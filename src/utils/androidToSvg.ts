export function convertAndroidDrawableToSvg(xmlContent: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'text/xml');
    const vector = doc.querySelector('vector');

    if (!vector) return '<svg></svg>';

    const width = vector.getAttribute('android:width')?.replace('dp', '') || '24';
    const height = vector.getAttribute('android:height')?.replace('dp', '') || '24';
    const viewportWidth = vector.getAttribute('android:viewportWidth') || width;
    const viewportHeight = vector.getAttribute('android:viewportHeight') || height;

    let defs = '';
    let clipPathIdCounter = 0;

    function traverse(node: Element, indent: number): string {
        let output = '';
        const spaces = ' '.repeat(indent);
        let activeClipGroups = 0;

        Array.from(node.children).forEach(child => {
            if (child.tagName === 'clip-path') {
                const pathData = child.getAttribute('android:pathData');
                if (pathData) {
                    const id = `clip_${clipPathIdCounter++}`;
                    defs += `<clipPath id="${id}"><path d="${pathData}" /></clipPath>`;
                    output += `${spaces}<g clip-path="url(#${id})">\n`;
                    activeClipGroups++;
                }
            } else if (child.tagName === 'group') {
                const rotation = child.getAttribute('android:rotation') || '0';
                const pivotX = child.getAttribute('android:pivotX') || '0';
                const pivotY = child.getAttribute('android:pivotY') || '0';
                const scaleX = child.getAttribute('android:scaleX') || '1';
                const scaleY = child.getAttribute('android:scaleY') || '1';
                const translateX = child.getAttribute('android:translateX') || '0';
                const translateY = child.getAttribute('android:translateY') || '0';

                let transform = '';
                if (translateX !== '0' || translateY !== '0') transform += `translate(${translateX}, ${translateY}) `;
                if (rotation !== '0') transform += `rotate(${rotation}, ${pivotX}, ${pivotY}) `;
                if (scaleX !== '1' || scaleY !== '1') transform += `translate(${pivotX}, ${pivotY}) scale(${scaleX}, ${scaleY}) translate(-${pivotX}, -${pivotY}) `;

                output += `${spaces}<g transform="${transform.trim()}">\n`;
                output += traverse(child, indent + 2);
                output += `${spaces}</g>\n`;
            } else if (child.tagName === 'path') {
                const pathData = child.getAttribute('android:pathData');
                const fillColor = child.getAttribute('android:fillColor');
                const strokeColor = child.getAttribute('android:strokeColor');
                const strokeWidth = child.getAttribute('android:strokeWidth');
                const fillAlpha = child.getAttribute('android:fillAlpha');
                const strokeAlpha = child.getAttribute('android:strokeAlpha');
                const strokeLineCap = child.getAttribute('android:strokeLineCap');
                const strokeLineJoin = child.getAttribute('android:strokeLineJoin');

                if (pathData) {
                    output += `${spaces}<path d="${pathData}"`;
                    if (fillColor) {
                        output += ` fill="${convertAndroidColor(fillColor)}"`;
                        if (fillAlpha) output += ` fill-opacity="${fillAlpha}"`;
                    } else {
                        output += ` fill="none"`;
                    }
                    if (strokeColor) {
                        output += ` stroke="${convertAndroidColor(strokeColor)}"`;
                        if (strokeWidth) output += ` stroke-width="${strokeWidth}"`;
                        if (strokeAlpha) output += ` stroke-opacity="${strokeAlpha}"`;
                        if (strokeLineCap) output += ` stroke-linecap="${strokeLineCap}"`;
                        if (strokeLineJoin) output += ` stroke-linejoin="${strokeLineJoin}"`;
                    }
                    output += ` />\n`;
                }
            }
        });

        // Close all clip groups opened in this group
        for (let i = 0; i < activeClipGroups; i++) {
            output += `${spaces}</g>\n`;
        }

        return output;
    }

    const content = traverse(vector, 2);

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${viewportWidth} ${viewportHeight}" xmlns="http://www.w3.org/2000/svg">
${defs ? `<defs>${defs}</defs>` : ''}
${content}</svg>`;
}

function convertAndroidColor(color: string): string {
    if (!color) return 'none';
    if (color.startsWith('#')) {
        if (color.length === 9) {
            // #AARRGGBB -> rgba(R, G, B, A)
            const a = parseInt(color.substring(1, 3), 16) / 255;
            const r = parseInt(color.substring(3, 5), 16);
            const g = parseInt(color.substring(5, 7), 16);
            const b = parseInt(color.substring(7, 9), 16);
            return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
        } else if (color.length === 7) {
            return color;
        }
    }
    return color;
}
