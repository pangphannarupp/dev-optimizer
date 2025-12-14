
export type Platform = 'css' | 'android_xml' | 'android_compose' | 'ios_swiftui' | 'ios_uikit' | 'flutter';

export interface ShadowProps {
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
    inset: boolean;
}

export interface RadiusProps {
    tl: number;
    tr: number;
    br: number;
    bl: number;
}

export interface GradientProps {
    type: 'linear' | 'radial';
    angle: number; // for linear
    stops: { color: string; position: number }[];
}

export interface TextShadowProps {
    x: number;
    y: number;
    blur: number;
    color: string;
}

export interface FilterProps {
    blur: number; // px
    brightness: number; // %
    contrast: number; // %
    grayscale: number; // %
    hueRotate: number; // deg
    invert: number; // %
    opacity: number; // %
    saturate: number; // %
    sepia: number; // %
}

export interface TransformProps {
    rotate: number; // deg
    scaleX: number;
    scaleY: number;
    skewX: number; // deg
    skewY: number; // deg
    translateX: number; // px
    translateY: number; // px
}

export interface GlassProps {
    blur: number; // px
    transparency: number; // 0-1
    color: string;
    outline: number; // px
}

export interface ClipPathProps {
    type: 'circle' | 'ellipse' | 'polygon';
    points: { x: number; y: number }[]; // % for polygon
}

// Helper to convert hex to rgba for Flutter/Swift
const hexToRgba = (hex: string, alpha: number = 1) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return { r, g, b, a: alpha };
};

export const generateShadowCode = (shadow: ShadowProps, platform: Platform): string => {
    const { x, y, blur, spread, color, inset } = shadow;

    switch (platform) {
        case 'css':
            return `box-shadow: ${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${color};`;

        case 'android_xml':
            // XML Elevation is limited, standard way is to use elevation
            return `<!-- android:elevation="${Math.max(x, y, blur) / 2}dp" -->
<!-- Note: Custom shadows in XML often require a layer-list drawable or 9-patch -->`;

        case 'android_compose':
            return `Modifier.shadow(
    elevation = ${blur} .dp,
    shape = RectangleShape,
    spotColor = Color(android.graphics.Color.parseColor("${color}"))
)`;

        case 'ios_swiftui':
            return `.shadow(color: Color(hex: "${color}"), radius: ${blur}, x: ${x}, y: ${y})`;

        case 'ios_uikit':
            return `view.layer.shadowColor = UIColor(hex: "${color}").cgColor
view.layer.shadowOpacity = 1
view.layer.shadowOffset = CGSize(width: ${x}, height: ${y})
view.layer.shadowRadius = ${blur}`;

        case 'flutter':
            return `BoxShadow(
  color: Color(0xff${color.replace('#', '')}),
  offset: Offset(${x}, ${y}),
  blurRadius: ${blur},
  spreadRadius: ${spread},
)`;
        default: return '';
    }
};

export const generateRadiusCode = (radius: RadiusProps, platform: Platform): string => {
    const { tl, tr, br, bl } = radius;
    const allEqual = tl === tr && tr === br && br === bl;

    switch (platform) {
        case 'css':
            return allEqual
                ? `border-radius: ${tl}px;`
                : `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;

        case 'android_xml':
            if (allEqual) return `<corners android:radius="${tl}dp" />`;
            return `<corners
    android:topLeftRadius="${tl}dp"
    android:topRightRadius="${tr}dp"
    android:bottomRightRadius="${br}dp"
    android:bottomLeftRadius="${bl}dp" />`;

        case 'android_compose':
            if (allEqual) return `RoundedCornerShape(${tl}.dp)`;
            return `RoundedCornerShape(
    topStart = ${tl}.dp,
    topEnd = ${tr}.dp,
    bottomEnd = ${br}.dp,
    bottomStart = ${bl}.dp
)`;

        case 'ios_swiftui':
            if (allEqual) return `.cornerRadius(${tl})`;
            return `.clipShape(
    .rect(
        topLeadingRadius: ${tl},
        bottomLeadingRadius: ${bl},
        bottomTrailingRadius: ${br},
        topTrailingRadius: ${tr}
    )
)`;

        case 'ios_uikit':
            if (allEqual) return `view.layer.cornerRadius = ${tl}`;
            return `view.layer.cornerRadius = ${tl}
view.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner, .layerMaxXMaxYCorner, .layerMinXMaxYCorner]`;

        case 'flutter':
            if (allEqual) return `BorderRadius.circular(${tl})`;
            return `BorderRadius.only(
  topLeft: Radius.circular(${tl}),
  topRight: Radius.circular(${tr}),
  bottomRight: Radius.circular(${br}),
  bottomLeft: Radius.circular(${bl}),
)`;
        default: return '';
    }
};

export const generateGradientCode = (gradient: GradientProps, platform: Platform): string => {
    const { type, angle, stops } = gradient;
    // const colors = stops.map(s => `Color(0xff${s.color.replace('#', '')})`); // Simplified for generic usage

    switch (platform) {
        case 'css':
            const stopsCss = stops.map(s => `${s.color} ${Math.round(s.position * 100)}%`).join(', ');
            return type === 'linear'
                ? `background: linear-gradient(${angle}deg, ${stopsCss});`
                : `background: radial-gradient(circle, ${stopsCss});`;

        case 'android_xml':
            return `<!-- Linear Gradient Example -->
<gradient
    android:angle="${Math.round(angle / 45) * 45}"
    android:startColor="${stops[0]?.color}"
    android:endColor="${stops[stops.length - 1]?.color}"
    android:type="${type}" />`;

        case 'android_compose':
            const colorList = stops.map(s => `Color(android.graphics.Color.parseColor("${s.color}"))`).join(', ');
            // Simple approximation of angle to start/end coordinates would be needed for precise mapping
            return `Brush.${type}Gradient(
    colors = listOf(${colorList})
)`;

        case 'ios_swiftui':
            const swiftStops = stops.map(s => `.init(color: Color(hex: "${s.color}"), location: ${s.position})`).join(', ');
            return `${type === 'linear' ? 'LinearGradient' : 'RadialGradient'}(
    gradient: Gradient(stops: [
        ${swiftStops}
    ]),
    startPoint: .top, // Adjust based on angle
    endPoint: .bottom
)`;

        case 'ios_uikit':
            return `let gradientLayer = CAGradientLayer()
gradientLayer.colors = [${stops.map(s => `UIColor(hex: "${s.color}").cgColor`).join(', ')}]
gradientLayer.locations = [${stops.map(s => s.position).join(', ')}]
view.layer.addSublayer(gradientLayer)`;

        case 'flutter':
            const flutterColors = stops.map(s => `Color(0xff${s.color.replace('#', '')})`).join(', ');
            const flutterStops = stops.map(s => s.position).join(', ');
            return `BoxDecoration(
  gradient: ${type === 'linear' ? 'LinearGradient' : 'RadialGradient'}(
    colors: [${flutterColors}],
    stops: [${flutterStops}],
    begin: Alignment.topLeft, // Adjust based on angle
    end: Alignment.bottomRight,
  ),
)`;
        default: return '';
    }
};

export const generateTextShadowCode = (shadow: TextShadowProps, platform: Platform): string => {
    const { x, y, blur, color } = shadow;
    switch (platform) {
        case 'css':
            return `text-shadow: ${x}px ${y}px ${blur}px ${color};`;
        case 'android_xml':
            return `android:shadowColor="${color}"
android:shadowDx="${x}"
android:shadowDy="${y}"
android:shadowRadius="${blur}"`;
        case 'android_compose':
            return `TextStyle(
    shadow = Shadow(
        color = Color(android.graphics.Color.parseColor("${color}")),
        offset = Offset(${x}f, ${y}f),
        blurRadius = ${blur}f
    )
)`;
        case 'ios_swiftui':
            return `.shadow(color: Color(hex: "${color}"), radius: ${blur}, x: ${x}, y: ${y})`;
        case 'ios_uikit':
            return `label.layer.shadowColor = UIColor(hex: "${color}").cgColor
label.layer.shadowOffset = CGSize(width: ${x}, height: ${y})
label.layer.shadowRadius = ${blur}
label.layer.shadowOpacity = 1.0`;
        case 'flutter':
            return `TextStyle(
  shadows: [
    Shadow(
      blurRadius: ${blur},
      color: Color(0xff${color.replace('#', '')}),
      offset: Offset(${x}, ${y}),
    ),
  ],
)`;
        default: return '';
    }
};

export const generateFilterCode = (filter: FilterProps, platform: Platform): string => {
    const { blur, brightness, contrast, grayscale, hueRotate, invert, opacity, saturate, sepia } = filter;

    // Construct CSS filter string with only non-default values
    const parts: string[] = [];
    if (blur > 0) parts.push(`blur(${blur}px)`);
    if (brightness !== 100) parts.push(`brightness(${brightness}%)`);
    if (contrast !== 100) parts.push(`contrast(${contrast}%)`);
    if (grayscale > 0) parts.push(`grayscale(${grayscale}%)`);
    if (hueRotate > 0) parts.push(`hue-rotate(${hueRotate}deg)`);
    if (invert > 0) parts.push(`invert(${invert}%)`);
    if (opacity < 100) parts.push(`opacity(${opacity}%)`);
    if (saturate !== 100) parts.push(`saturate(${saturate}%)`);
    if (sepia > 0) parts.push(`sepia(${sepia}%)`);

    const cssFilter = parts.length > 0 ? `filter: ${parts.join(' ')};` : '/* No filters active */';

    switch (platform) {
        case 'css': return cssFilter;
        case 'android_compose':
            // Compose Modifier.blur, alpha, etc.
            let composeModifiers = '';
            if (blur > 0) composeModifiers += `\n    .blur(${blur}.dp)`;
            if (opacity < 100) composeModifiers += `\n    .alpha(${opacity / 100}f)`;
            // Note: Other filters often require ColorMatrix or graphicsLayer
            if (composeModifiers) return `Modifier${composeModifiers}`;
            return `// Compose mainly supports blur and alpha directly. \n// For others use ColorFilter with ColorMatrix.`;

        case 'ios_swiftui':
            let swiftModifiers = '';
            if (blur > 0) swiftModifiers += `\n.blur(radius: ${blur})`;
            if (brightness !== 100) swiftModifiers += `\n.brightness(${(brightness - 100) / 100})`;
            if (contrast !== 100) swiftModifiers += `\n.contrast(${contrast / 100})`;
            if (grayscale > 0) swiftModifiers += `\n.grayscale(${grayscale / 100})`;
            if (hueRotate > 0) swiftModifiers += `\n.hueRotation(.degrees(${hueRotate}))`;
            if (invert > 0) swiftModifiers += `\n.colorInvert(${invert / 100})`;
            if (opacity < 100) swiftModifiers += `\n.opacity(${opacity / 100})`;
            if (saturate !== 100) swiftModifiers += `\n.saturation(${saturate / 100})`;
            return swiftModifiers.trim() ? swiftModifiers.trim() : '// No matching SwiftUI modifiers';

        case 'flutter':
            if (blur > 0) {
                return `ImageFiltered(\n  imageFilter: ImageFilter.blur(sigmaX: ${blur}, sigmaY: ${blur}),\n  child: Widget\n)`;
            }
            if (opacity < 100) {
                return `Opacity(\n  opacity: ${opacity / 100},\n  child: Widget\n)`;
            }
            return `// Flutter uses Widgets like ImageFiltered (blur), Opacity, or ColorFiltered (matrix) for these effects.`;

        default: return cssFilter; // Fallback or empty
    }
};

export const generateTransformCode = (t: TransformProps, platform: Platform): string => {
    const { rotate, scaleX, scaleY, skewX, skewY, translateX, translateY } = t;

    // Check for defaults
    const isDefault = rotate === 0 && scaleX === 1 && scaleY === 1 && skewX === 0 && skewY === 0 && translateX === 0 && translateY === 0;
    if (isDefault) return '/* No transform */';

    const parts: string[] = [];
    if (translateX !== 0 || translateY !== 0) parts.push(`translate(${translateX}px, ${translateY}px)`);
    if (rotate !== 0) parts.push(`rotate(${rotate}deg)`);
    if (scaleX !== 1 || scaleY !== 1) parts.push(`scale(${scaleX}, ${scaleY})`);
    if (skewX !== 0 || skewY !== 0) parts.push(`skew(${skewX}deg, ${skewY}deg)`);

    const cssTransform = `transform: ${parts.join(' ')};`;

    switch (platform) {
        case 'css': return cssTransform;
        case 'android_compose':
            return `Modifier.graphicsLayer {
    ${translateX !== 0 ? `translationX = ${translateX}.dp.toPx()\n    translationY = ${translateY}.dp.toPx()` : ''}
    ${rotate !== 0 ? `rotationZ = ${rotate}f` : ''}
    ${scaleX !== 1 || scaleY !== 1 ? `scaleX = ${scaleX}f\n    scaleY = ${scaleY}f` : ''}
    // Skew not directly supported in standard simple modifiers
}`;
        case 'ios_swiftui':
            // SwiftUI modifiers apply order matters, but here's a collection
            let swift = '';
            if (rotate !== 0) swift += `.rotationEffect(.degrees(${rotate}))\n`;
            if (scaleX !== 1 || scaleY !== 1) swift += `.scaleEffect(x: ${scaleX}, y: ${scaleY})\n`;
            if (translateX !== 0 || translateY !== 0) swift += `.offset(x: ${translateX}, y: ${translateY})\n`;
            return swift.trim();

        case 'flutter':
            return `Transform(
  transform: Matrix4.identity()
    ${translateX !== 0 || translateY !== 0 ? `..translate(${translateX}, ${translateY})` : ''}
    ${rotate !== 0 ? `..rotateZ(${rotate * Math.PI / 180})` : ''}
    ${scaleX !== 1 || scaleY !== 1 ? `..scale(${scaleX}, ${scaleY})` : ''},
  child: Widget,
)`;
        default: return cssTransform;
    }
};

export const generateGlassCode = (glass: GlassProps, platform: Platform): string => {
    const { blur, transparency, color, outline } = glass;
    const rgba = hexToRgba(color, transparency);

    switch (platform) {
        case 'css':
            return `background: rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${transparency});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: ${outline}px solid rgba(255, 255, 255, 0.3);`;

        case 'android_compose':
            return `Box(
    modifier = Modifier
        .background(Color(${rgba.r}, ${rgba.g}, ${rgba.b}, ${(transparency * 255).toFixed(0)}))
        .border(${outline}.dp, Color.White.copy(alpha = 0.3f))
        // Native blur requires Android 12+ (RenderEffect) or Toolkit
)`;

        case 'ios_swiftui':
            return `.background(.regularMaterial) // Native Frosted Glass
.overlay(
    RoundedRectangle(cornerRadius: 16)
        .stroke(.white.opacity(0.3), lineWidth: ${outline})
)`;

        case 'flutter':
            return `ClipRRect(
  child: BackdropFilter(
    filter: ImageFilter.blur(sigmaX: ${blur}, sigmaY: ${blur}),
    child: Container(
      decoration: BoxDecoration(
        color: Color.fromRGBO(${rgba.r}, ${rgba.g}, ${rgba.b}, ${transparency}),
        border: Border.all(color: Colors.white.withOpacity(0.3), width: ${outline}),
      ),
    ),
  ),
)`;
        default: return '';
    }
};

export const generateClipPathCode = (clip: ClipPathProps, platform: Platform): string => {
    const { points } = clip;

    switch (platform) {
        case 'css':
            const polyPoints = points.map(p => `${p.x}% ${p.y}%`).join(', ');
            return `clip-path: polygon(${polyPoints});`;

        case 'android_compose':
            return `val shape = GenericShape { size, _ ->
${points.map((p, i) => `    ${i === 0 ? 'moveTo' : 'lineTo'}(size.width * ${p.x / 100}f, size.height * ${p.y / 100}f)`).join('\n')}
}
// Usage: Modifier.clip(shape)`;

        case 'ios_swiftui':
            return `shape = Path { path in
${points.map((p, i) => `    path.${i === 0 ? 'move' : 'addLine'}(to: CGPoint(x: rect.width * ${p.x / 100}, y: rect.height * ${p.y / 100}))`).join('\n')}
}
// Usage: .clipShape(shape)`;

        case 'flutter':
            return `class MyClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    var path = Path();
${points.map((p, i) => `    path.${i === 0 ? 'moveTo' : 'lineTo'}(size.width * ${p.x / 100}, size.height * ${p.y / 100});`).join('\n')}
    path.close();
    return path;
  }
  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}`;

        default: return '';
    }
};
