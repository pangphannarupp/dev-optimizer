
// Helper types for Lottie
interface LottieShape {
    ty: string; // Type
    nm: string; // Name
    it?: any[];  // Items (for groups)
    [key: string]: any;
}

interface LottieLayer {
    ddd: number; // 3D layer
    ind: number; // Index
    ty: number;  // Type (4 = Shape)
    nm: string;  // Name
    sr: number;  // Stretch
    ks: any;     // Transform
    ao: number;  // Auto Orient
    shapes: LottieShape[];
    ip: number;  // In Point
    op: number;  // Out Point
    st: number;  // Start Time
    bm: number;  // Blend Mode
    hd?: boolean; // Hidden
}

// --- SVG Path Parsing Logic (Math Helpers) ---

type Point = [number, number];
type cubicSegment = { p0: Point, cp1: Point, cp2: Point, p: Point };

const tokenizePath = (d: string): string[] => {
    const commands = d.match(/([a-df-z][^a-df-z]*)/gi);
    return commands ? commands.map(c => c.trim()) : [];
};

const parseValues = (args: string): number[] => {
    return args.match(/-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi)?.map(parseFloat) || [];
};

const quadToCubic = (p0: Point, cp: Point, p: Point): cubicSegment => {
    const cp1: Point = [
        p0[0] + (2 / 3) * (cp[0] - p0[0]),
        p0[1] + (2 / 3) * (cp[1] - p0[1])
    ];
    const cp2: Point = [
        p[0] + (2 / 3) * (cp[0] - p[0]),
        p[1] + (2 / 3) * (cp[1] - p[1])
    ];
    return { p0, cp1, cp2, p };
};

const arcToCubic = (
    current: Point,
    rx: number, ry: number,
    xAxisRotation: number,
    largeArcFlag: number, sweepFlag: number,
    end: Point
): cubicSegment[] => {
    rx = Math.abs(rx); ry = Math.abs(ry);
    if (rx === 0 || ry === 0) return [{ p0: current, cp1: current, cp2: end, p: end }];

    const phi = (xAxisRotation * Math.PI) / 180;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    const x1p = cosPhi * (current[0] - end[0]) / 2 + sinPhi * (current[1] - end[1]) / 2;
    const y1p = -sinPhi * (current[0] - end[0]) / 2 + cosPhi * (current[1] - end[1]) / 2;

    const rx_sq = rx * rx;
    const ry_sq = ry * ry;
    const x1p_sq = x1p * x1p;
    const y1p_sq = y1p * y1p;

    let radicant = (rx_sq * ry_sq - rx_sq * y1p_sq - ry_sq * x1p_sq) / (rx_sq * y1p_sq + ry_sq * x1p_sq);
    radicant = Math.max(0, radicant);
    let factor = Math.sqrt(radicant);
    if (largeArcFlag === sweepFlag) factor = -factor;

    const cxp = factor * rx * y1p / ry;
    const cyp = factor * -ry * x1p / rx;

    const cx = cosPhi * cxp - sinPhi * cyp + (current[0] + end[0]) / 2;
    const cy = sinPhi * cxp + cosPhi * cyp + (current[1] + end[1]) / 2;

    const v1: Point = [(x1p - cxp) / rx, (y1p - cyp) / ry];
    const v2: Point = [(-x1p - cxp) / rx, (-y1p - cyp) / ry];

    const angle = (u: Point, v: Point) => {
        const sign = (u[0] * v[1] - u[1] * v[0] < 0) ? -1 : 1;
        let dot = u[0] * v[0] + u[1] * v[1];
        if (dot > 1) dot = 1; if (dot < -1) dot = -1;
        return sign * Math.acos(dot);
    };

    let startAngle = angle([1, 0], v1);
    let deltaAngle = angle(v1, v2);

    if (sweepFlag === 0 && deltaAngle > 0) deltaAngle -= 2 * Math.PI;
    if (sweepFlag === 1 && deltaAngle < 0) deltaAngle += 2 * Math.PI;

    const segments = Math.max(Math.ceil(Math.abs(deltaAngle) / (Math.PI / 2)), 1);
    const result: cubicSegment[] = [];

    for (let i = 0; i < segments; i++) {
        const angle1 = startAngle + i * deltaAngle / segments;
        const angle2 = startAngle + (i + 1) * deltaAngle / segments;
        const halfStep = (angle2 - angle1) / 2;
        const alpha = Math.sin(halfStep) * (Math.sqrt(4 + 3 * Math.tan(halfStep) * Math.tan(halfStep)) - 1) * 4 / 3;

        const x1 = Math.cos(angle1) * rx;
        const y1 = Math.sin(angle1) * ry;
        const x2 = Math.cos(angle2) * rx;
        const y2 = Math.sin(angle2) * ry;

        const p0: Point = i === 0 ? current : [
            cosPhi * x1 - sinPhi * y1 + cx,
            sinPhi * x1 + cosPhi * y1 + cy
        ];

        const cp1_raw: Point = [x1 - alpha * Math.sin(angle1) * rx, y1 + alpha * Math.cos(angle1) * ry];
        const cp2_raw: Point = [x2 + alpha * Math.sin(angle2) * rx, y2 - alpha * Math.cos(angle2) * ry];

        const mapPoint = (px: number, py: number): Point => [
            cosPhi * px - sinPhi * py + cx,
            sinPhi * px + cosPhi * py + cy
        ];

        result.push({
            p0: p0,
            cp1: mapPoint(cp1_raw[0], cp1_raw[1]),
            cp2: mapPoint(cp2_raw[0], cp2_raw[1]),
            p: mapPoint(x2, y2)
        });
    }

    return result;
};


function parsePathData(d: string): { v: Point[], i: Point[], o: Point[], c: boolean } {
    const commands = tokenizePath(d);

    let cx = 0, cy = 0;
    let sx = 0, sy = 0;
    let lastCp: Point | null = null;

    const subpaths: Array<{ points: Point[], inTangents: Point[], outTangents: Point[], closed: boolean }> = [];

    let currentSubpath = {
        points: [] as Point[],
        inTangents: [] as Point[],
        outTangents: [] as Point[],
        closed: false
    };

    const flushSubpath = () => {
        if (currentSubpath.points.length > 0) {
            subpaths.push({ ...currentSubpath });
            currentSubpath = { points: [], inTangents: [], outTangents: [], closed: false };
        }
    };

    const addSegment = (cp1: Point, cp2: Point, p: Point) => {
        if (currentSubpath.points.length === 0) {
            currentSubpath.points.push([cx, cy]);
            currentSubpath.inTangents.push([0, 0]);
            currentSubpath.outTangents.push([0, 0]);
        }

        const lastIdx = currentSubpath.points.length - 1;
        currentSubpath.outTangents[lastIdx] = [cp1[0] - cx, cp1[1] - cy];

        currentSubpath.points.push(p);
        currentSubpath.inTangents.push([cp2[0] - p[0], cp2[1] - p[1]]);
        currentSubpath.outTangents.push([0, 0]);

        cx = p[0];
        cy = p[1];
        lastCp = cp2;
    };

    commands.forEach(cmdStr => {
        const type = cmdStr[0];
        const args = parseValues(cmdStr.substring(1));
        const isRel = type === type.toLowerCase();
        const cmd = type.toUpperCase();

        switch (cmd) {
            case 'M':
                flushSubpath();
                cx = isRel ? cx + args[0] : args[0];
                cy = isRel ? cy + args[1] : args[1];
                sx = cx; sy = cy;
                currentSubpath.points.push([cx, cy]);
                currentSubpath.inTangents.push([0, 0]);
                currentSubpath.outTangents.push([0, 0]);
                lastCp = [cx, cy];
                break;
            case 'L':
                for (let k = 0; k < args.length; k += 2) {
                    const nx = isRel ? cx + args[k] : args[k];
                    const ny = isRel ? cy + args[k + 1] : args[k + 1];
                    addSegment([cx, cy], [nx, ny], [nx, ny]);
                }
                break;
            case 'H':
                for (let k = 0; k < args.length; k++) {
                    const nx = isRel ? cx + args[k] : args[k];
                    addSegment([cx, cy], [nx, cy], [nx, cy]);
                }
                break;
            case 'V':
                for (let k = 0; k < args.length; k++) {
                    const ny = isRel ? cy + args[k] : args[k];
                    addSegment([cx, cy], [cx, ny], [cx, ny]);
                }
                break;
            case 'C':
                for (let k = 0; k < args.length; k += 6) {
                    const cp1x = isRel ? cx + args[k] : args[k];
                    const cp1y = isRel ? cy + args[k + 1] : args[k + 1];
                    const cp2x = isRel ? cx + args[k + 2] : args[k + 2];
                    const cp2y = isRel ? cy + args[k + 3] : args[k + 3];
                    const ex = isRel ? cx + args[k + 4] : args[k + 4];
                    const ey = isRel ? cy + args[k + 5] : args[k + 5];
                    addSegment([cp1x, cp1y], [cp2x, cp2y], [ex, ey]);
                }
                break;
            case 'S':
                for (let k = 0; k < args.length; k += 4) {
                    let cp1x = cx, cp1y = cy;
                    if (lastCp) {
                        cp1x = 2 * cx - lastCp[0];
                        cp1y = 2 * cy - lastCp[1];
                    }
                    const cp2x = isRel ? cx + args[k] : args[k];
                    const cp2y = isRel ? cy + args[k + 1] : args[k + 1];
                    const ex = isRel ? cx + args[k + 2] : args[k + 2];
                    const ey = isRel ? cy + args[k + 3] : args[k + 3];
                    addSegment([cp1x, cp1y], [cp2x, cp2y], [ex, ey]);
                }
                break;
            case 'Q':
                for (let k = 0; k < args.length; k += 4) {
                    const cpx = isRel ? cx + args[k] : args[k];
                    const cpy = isRel ? cy + args[k + 1] : args[k + 1];
                    const ex = isRel ? cx + args[k + 2] : args[k + 2];
                    const ey = isRel ? cy + args[k + 3] : args[k + 3];
                    const cubic = quadToCubic([cx, cy], [cpx, cpy], [ex, ey]);
                    addSegment(cubic.cp1, cubic.cp2, cubic.p);
                }
                break;
            case 'T':
                for (let k = 0; k < args.length; k += 2) {
                    let cpx = cx, cpy = cy;
                    if (lastCp) {
                        cpx = 2 * cx - lastCp[0];
                        cpy = 2 * cy - lastCp[1];
                    }
                    const ex = isRel ? cx + args[k] : args[k];
                    const ey = isRel ? cy + args[k + 1] : args[k + 1];
                    const cubic = quadToCubic([cx, cy], [cpx, cpy], [ex, ey]);
                    addSegment(cubic.cp1, cubic.cp2, cubic.p);
                    lastCp = [cpx, cpy];
                }
                break;
            case 'A':
                for (let k = 0; k < args.length; k += 7) {
                    const rx = args[k];
                    const ry = args[k + 1];
                    const rot = args[k + 2];
                    const large = args[k + 3];
                    const sweep = args[k + 4];
                    const ex = isRel ? cx + args[k + 5] : args[k + 5];
                    const ey = isRel ? cy + args[k + 6] : args[k + 6];

                    const segs = arcToCubic([cx, cy], rx, ry, rot, large, sweep, [ex, ey]);
                    segs.forEach(seg => {
                        addSegment(seg.cp1, seg.cp2, seg.p);
                    });
                }
                break;
            case 'Z':
                currentSubpath.closed = true;
                cx = sx; cy = sy;
                lastCp = null;
                break;
        }

        if (!['C', 'S', 'Q', 'T'].includes(cmd)) {
            lastCp = [cx, cy];
        }
    });

    flushSubpath();

    if (subpaths.length > 0) {
        const p = subpaths[0];
        return {
            v: p.points,
            i: p.inTangents,
            o: p.outTangents,
            c: p.closed
        };
    }

    return { v: [], i: [], o: [], c: false };
}


// --- Dom Styling & Transform Extractor ---

const getComputedStyles = (el: Element) => {
    const style = window.getComputedStyle(el);
    return {
        fill: style.fill,
        fillOpacity: style.fillOpacity,
        stroke: style.stroke,
        strokeWidth: style.strokeWidth,
        strokeOpacity: style.strokeOpacity,
        display: style.display,
        visibility: style.visibility,
        transform: style.transform, // Matrix(a, b, c, d, tx, ty)
        transformOrigin: style.transformOrigin
    };
};

const parseColor = (colorStr: string): number[] | null => {
    if (!colorStr || colorStr === 'none' || colorStr === 'transparent') return null;
    const match = colorStr.match(/(\d+(\.\d+)?)/g);
    if (!match || match.length < 3) return null;
    const r = parseFloat(match[0]) / 255;
    const g = parseFloat(match[1]) / 255;
    const b = parseFloat(match[2]) / 255;
    return [r, g, b];
};

// Decompose Matrix(a, b, c, d, tx, ty) to { p, s, r, sk, sa }
const decomposeTransform = (transformStr: string, originStr: string) => {
    let p = [0, 0];
    let s = [100, 100];
    let r = 0;

    // Default origin
    let a = [0, 0];
    if (originStr) {
        const parts = originStr.split(' ').map(parseFloat);
        if (parts.length >= 2) a = [parts[0], parts[1]];
    }

    if (transformStr && transformStr !== 'none') {
        const match = transformStr.match(/matrix\(([^)]+)\)/);
        if (match) {
            const m = match[1].split(',').map(v => parseFloat(v.trim()));
            if (m.length === 6) {
                // m = [a, b, c, d, tx, ty]
                const [ma, mb, mc, md, mtx, mty] = m;

                // Position
                p = [mtx + a[0], mty + a[1]];
                // Note: Lottie transform system is P (position) and A (anchor).
                // If CSS transform-origin is X,Y, then Lottie Anchor A = [X, Y].
                // And Lottie Position P = [X + tx, Y + ty].
                // Because Lottie applies A (negatively) -> Scale/Rotate -> P (positively).

                // Scale
                const sx = Math.sqrt(ma * ma + mb * mb);
                const sy = Math.sqrt(mc * mc + md * md);
                s = [sx * 100, sy * 100];

                // Rotation (in degrees)
                // angle = atan2(b, a)
                r = Math.atan2(mb, ma) * (180 / Math.PI);

                // Skew (sk/sa) is ignored for simplicity in this version, 
                // assuming mostly orthogonal/rotated transforms.
            }
        }
    } else {
        // If no transform, Position is just the Anchor point (so object stays in place relative to origin 0,0)
        p = [a[0], a[1]];
    }

    return {
        p: { a: 0, k: [...p, 0], ix: 2 },
        a: { a: 0, k: [...a, 0], ix: 1 },
        s: { a: 0, k: [...s, 100], ix: 6 },
        r: { a: 0, k: r, ix: 10 },
        o: { a: 0, k: 100, ix: 11 },
        sk: { a: 0, k: 0, ix: 4 },
        sa: { a: 0, k: 0, ix: 5 },
        nm: 'Transform'
    };
};

const convertRect = (el: Element): any => {
    const x = parseFloat(el.getAttribute('x') || '0');
    const y = parseFloat(el.getAttribute('y') || '0');
    const w = parseFloat(el.getAttribute('width') || '0');
    const h = parseFloat(el.getAttribute('height') || '0');
    const r = parseFloat(el.getAttribute('rx') || el.getAttribute('ry') || '0');

    return {
        ty: 'rc',
        nm: 'Rectangle',
        p: { a: 0, k: [x + w / 2, y + h / 2] }, // Center
        s: { a: 0, k: [w, h] },
        r: { a: 0, k: r }
    };
};

const convertCircle = (el: Element): any => {
    const cx = parseFloat(el.getAttribute('cx') || '0');
    const cy = parseFloat(el.getAttribute('cy') || '0');
    const r = parseFloat(el.getAttribute('r') || '0');

    return {
        ty: 'el',
        nm: 'Circle',
        p: { a: 0, k: [cx, cy] },
        s: { a: 0, k: [r * 2, r * 2] }
    };
};

const convertEllipse = (el: Element): any => {
    const cx = parseFloat(el.getAttribute('cx') || '0');
    const cy = parseFloat(el.getAttribute('cy') || '0');
    const rx = parseFloat(el.getAttribute('rx') || '0');
    const ry = parseFloat(el.getAttribute('ry') || '0');

    return {
        ty: 'el',
        nm: 'Ellipse',
        p: { a: 0, k: [cx, cy] },
        s: { a: 0, k: [rx * 2, ry * 2] }
    };
};

const pointsToPath = (points: string, closed: boolean): string => {
    const pts = points.trim().split(/\s+|,/).map(parseFloat);
    let d = "";
    for (let i = 0; i < pts.length; i += 2) {
        d += (i === 0 ? "M" : "L") + pts[i] + "," + pts[i + 1] + " ";
    }
    if (closed) d += "Z";
    return d;
};


const convertPath = (el: Element): any => {
    let d = el.getAttribute('d') || '';
    const tag = el.tagName.toLowerCase();

    if (tag === 'polyline') {
        d = pointsToPath(el.getAttribute('points') || '', false);
    } else if (tag === 'polygon') {
        d = pointsToPath(el.getAttribute('points') || '', true);
    } else if (tag === 'line') {
        const x1 = el.getAttribute('x1') || '0';
        const y1 = el.getAttribute('y1') || '0';
        const x2 = el.getAttribute('x2') || '0';
        const y2 = el.getAttribute('y2') || '0';
        d = `M${x1},${y1} L${x2},${y2}`;
    }

    const { v, i, o, c } = parsePathData(d);

    return {
        ty: 'sh',
        nm: 'Path',
        ks: {
            a: 0,
            k: { v, i, o, c }
        }
    };
};

// -- USE Tag Resolver --
const handleUseTag = (el: Element, container: HTMLElement): Element | null => {
    const href = el.getAttribute('href') || el.getAttribute('xlink:href');
    if (!href || !href.startsWith('#')) return null;

    const id = href.substring(1);
    const target = container.querySelector(`[id="${id}"]`);
    if (!target) return null;

    // Clone the target
    const clone = target.cloneNode(true) as Element;

    // 'use' tag can have x, y, width, height, transform
    // We treat 'use' as a Group wrapper around the cloned content.
    // The clone usually loses its ID to avoid duplicates (or we rely on group processing).

    const x = el.getAttribute('x');
    const y = el.getAttribute('y');

    // If x/y exist, they are an additional translation on top of any transform
    // We can simulate this by wrapping in a <g transform="translate(x,y)">...

    const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Copy computed styles from <use> element to wrapper to handle inheritance
    // Actually, inheritance flows into the shadow tree. 
    // Simply appending the clone here is a "flattening" strategy.

    if (x || y) {
        wrapper.setAttribute('transform', `translate(${x || 0}, ${y || 0})`);
    }

    wrapper.appendChild(clone);
    return wrapper;
};


const processNode = (node: Element, container: HTMLElement): any[] => {
    const styles = getComputedStyles(node);

    if (styles.display === 'none' || styles.visibility === 'hidden') return [];

    const items = [];
    let shape = null;
    const tag = node.tagName.toLowerCase();

    // Handle <use> by swapping it with its Shadow DOM equivalent (flattened)
    if (tag === 'use') {
        const resolved = handleUseTag(node, container);
        if (resolved) {
            // Process the resolved wrapper instead
            // Inherit raw attributes for recursion? 
            // The style inheritance is tricky here without a real shadow DOM.
            // We essentially recurse into the wrapper.
            // BUT: We need to apply the <use> tag's OWN transform as well. 
            // The 'getComputedStyles(node)' already includes the <use> tag's transform!
            // So we treat 'resolved' as the children, and 'node' provides the group transform.

            const groupItems: any[] = [];
            Array.from(resolved.children).forEach(child => {
                groupItems.push(...processNode(child as Element, container));
            });

            if (groupItems.length > 0) {
                // Push transform
                const transform = decomposeTransform(styles.transform, styles.transformOrigin);
                // Important: <use> x/y attributes are effectively a transform too. 
                // However, handleUseTag put them in a wrapper <g>. 
                // We should assume 'decomposeTransform' handles the main transform.
                // The 'wrapper' from handleUseTag has a transform="translate(x,y)".
                // We need to merge them or nest them.

                // Let's treat the <use> as a Group that contains the Wrapper Group.
                // Group 1 (Use): Transform from CSS/Attr
                //   -> Group 2 (Wrapper): Translate(x,y)
                //      -> Content

                // Since processNode returns items, let's just make one group for the Use tag, 
                // and if the resolved content has its own logic, it returns items.
                // Re-processing 'resolved' (the wrapper) will generate the inner group.

                return [{
                    ty: 'gr',
                    nm: `Use ${node.getAttribute('id') || ''}`,
                    it: [
                        ...processNode(resolved as Element, container).map(i => i.it).flat(), // Flatten inner group
                        transform
                    ]
                }];
            }
            return [];
        }
    }

    if (tag === 'g') {
        const groupItems: any[] = [];
        Array.from(node.children).forEach(child => {
            groupItems.push(...processNode(child as Element, container));
        });

        if (groupItems.length > 0) {
            const transform = decomposeTransform(styles.transform, styles.transformOrigin);
            groupItems.push(transform);

            return [{
                ty: 'gr',
                nm: node.getAttribute('id') || 'Group',
                it: groupItems
            }];
        }
        return [];
    }

    if (tag === 'rect') shape = convertRect(node);
    else if (tag === 'circle') shape = convertCircle(node);
    else if (tag === 'ellipse') shape = convertEllipse(node);
    else if (tag === 'path') shape = convertPath(node);
    else if (tag === 'polyline') shape = convertPath(node);
    else if (tag === 'polygon') shape = convertPath(node);
    else if (tag === 'line') shape = convertPath(node);

    if (shape) {
        items.push(shape);

        // Fill
        const fillColor = parseColor(styles.fill);
        if (fillColor) {
            const opacity = parseFloat(styles.fillOpacity || '1') * 100;
            items.push({
                ty: 'fl',
                nm: 'Fill',
                c: { a: 0, k: [...fillColor, 1] },
                o: { a: 0, k: opacity },
                r: 1
            });
        }

        // Stroke
        const strokeColor = parseColor(styles.stroke);
        if (strokeColor) {
            const width = parseFloat(styles.strokeWidth || '1');
            const opacity = parseFloat(styles.strokeOpacity || '1') * 100;
            if (width > 0) {
                items.push({
                    ty: 'st',
                    nm: 'Stroke',
                    c: { a: 0, k: [...strokeColor, 1] },
                    o: { a: 0, k: opacity },
                    w: { a: 0, k: width },
                    lc: 1,
                    lj: 1,
                    ml: 4
                });
            }
        }

        // Transform
        const transform = decomposeTransform(styles.transform, styles.transformOrigin);
        items.push(transform);

        return [{
            ty: 'gr',
            nm: node.getAttribute('id') || tag,
            it: items
        }];
    }

    return [];
};


export const convertSVGToLottie = (svgStrings: string[], fps: number = 30, duration: number = 60): any => {
    const isSequence = svgStrings.length > 1;
    const framesPerImage = isSequence ? Math.max(1, Math.round(fps / 5)) : duration;
    const totalFrames = isSequence ? svgStrings.length * framesPerImage : duration;

    // Create a hidden container to mount SVGs for ComputeStyle
    const container = document.createElement('div');
    container.style.position = 'absolute';
    // container.style.visibility = 'hidden'; // CAUSES INHERITED HIDDEN ON CHILDREN
    container.style.pointerEvents = 'none';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    let width = 500;
    let height = 500;

    // Parse dimensions from first SVG
    const parser = new DOMParser();
    const doc0 = parser.parseFromString(svgStrings[0], 'image/svg+xml');
    const svg0 = doc0.querySelector('svg');
    if (svg0) {
        const viewBox = svg0.getAttribute('viewBox');
        if (viewBox) {
            const parts = viewBox.split(/[\s,]+/).map(parseFloat);
            if (parts.length === 4) {
                width = parts[2];
                height = parts[3];
            }
        } else {
            width = parseFloat(svg0.getAttribute('width') || '500');
            height = parseFloat(svg0.getAttribute('height') || '500');
        }
    }

    const layers: LottieLayer[] = [];

    svgStrings.forEach((svgStr, index) => {
        // Sanitize
        const sanitized = svgStr.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");

        // Mount to DOM
        container.innerHTML = sanitized;
        const svg = container.querySelector('svg');

        if (!svg) return;

        const shapes: LottieShape[] = [];
        Array.from(svg.children).forEach(child => {
            // Pass container for resolving references
            shapes.push(...processNode(child as Element, container));
        });

        const inPoint = index * framesPerImage;
        const outPoint = (index + 1) * framesPerImage;

        const layer: LottieLayer = {
            ddd: 0,
            ind: index + 1,
            ty: 4,
            nm: `Frame ${index + 1}`,
            sr: 1,
            ks: {
                o: { a: 0, k: 100, ix: 11 },
                r: { a: 0, k: 0, ix: 10 },
                p: { a: 0, k: [width / 2, height / 2, 0], ix: 2 },
                a: { a: 0, k: [width / 2, height / 2, 0], ix: 1 },
                s: { a: 0, k: [100, 100, 100], ix: 6 }
            },
            ao: 0,
            shapes: shapes,
            ip: isSequence ? inPoint : 0,
            op: isSequence ? outPoint : totalFrames,
            st: 0,
            bm: 0
        };

        layers.push(layer);
    });

    // Cleanup
    document.body.removeChild(container);

    return {
        v: "5.7.1",
        fr: fps,
        ip: 0,
        op: totalFrames,
        w: width,
        h: height,
        nm: "SVG Animation",
        ddd: 0,
        assets: [],
        layers: layers.reverse(),
        markers: []
    };
};
