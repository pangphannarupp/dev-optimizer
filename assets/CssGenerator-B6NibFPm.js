import{j as e,P as Y,L,aO as z,v as B,x as O,S as A,aS as E,aT as D,aU as U,R as W,ae as q}from"./ui-vendor-DEvE63cZ.js";import{r as C}from"./react-vendor-BGp5FbCG.js";import{u as Z,c as P}from"./index-QRt--NjA.js";import"./framer-vendor-DEiCTn3G.js";import"./utils-vendor-CJFcDo9C.js";const K=(l,i=1)=>{let a=0,r=0,s=0;return l.length===4?(a=parseInt(l[1]+l[1],16),r=parseInt(l[2]+l[2],16),s=parseInt(l[3]+l[3],16)):l.length===7&&(a=parseInt(l.substring(1,3),16),r=parseInt(l.substring(3,5),16),s=parseInt(l.substring(5,7),16)),{r:a,g:r,b:s,a:i}},H=(l,i)=>{const{x:a,y:r,blur:s,spread:o,color:n,inset:c}=l;switch(i){case"css":return`box-shadow: ${c?"inset ":""}${a}px ${r}px ${s}px ${o}px ${n};`;case"android_xml":return`<!-- android:elevation="${Math.max(a,r,s)/2}dp" -->
<!-- Note: Custom shadows in XML often require a layer-list drawable or 9-patch -->`;case"android_compose":return`Modifier.shadow(
    elevation = ${s} .dp,
    shape = RectangleShape,
    spotColor = Color(android.graphics.Color.parseColor("${n}"))
)`;case"ios_swiftui":return`.shadow(color: Color(hex: "${n}"), radius: ${s}, x: ${a}, y: ${r})`;case"ios_uikit":return`view.layer.shadowColor = UIColor(hex: "${n}").cgColor
view.layer.shadowOpacity = 1
view.layer.shadowOffset = CGSize(width: ${a}, height: ${r})
view.layer.shadowRadius = ${s}`;case"flutter":return`BoxShadow(
  color: Color(0xff${n.replace("#","")}),
  offset: Offset(${a}, ${r}),
  blurRadius: ${s},
  spreadRadius: ${o},
)`;default:return""}},J=(l,i)=>{const{tl:a,tr:r,br:s,bl:o}=l,n=a===r&&r===s&&s===o;switch(i){case"css":return n?`border-radius: ${a}px;`:`border-radius: ${a}px ${r}px ${s}px ${o}px;`;case"android_xml":return n?`<corners android:radius="${a}dp" />`:`<corners
    android:topLeftRadius="${a}dp"
    android:topRightRadius="${r}dp"
    android:bottomRightRadius="${s}dp"
    android:bottomLeftRadius="${o}dp" />`;case"android_compose":return n?`RoundedCornerShape(${a}.dp)`:`RoundedCornerShape(
    topStart = ${a}.dp,
    topEnd = ${r}.dp,
    bottomEnd = ${s}.dp,
    bottomStart = ${o}.dp
)`;case"ios_swiftui":return n?`.cornerRadius(${a})`:`.clipShape(
    .rect(
        topLeadingRadius: ${a},
        bottomLeadingRadius: ${o},
        bottomTrailingRadius: ${s},
        topTrailingRadius: ${r}
    )
)`;case"ios_uikit":return n?`view.layer.cornerRadius = ${a}`:`view.layer.cornerRadius = ${a}
view.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner, .layerMaxXMaxYCorner, .layerMinXMaxYCorner]`;case"flutter":return n?`BorderRadius.circular(${a})`:`BorderRadius.only(
  topLeft: Radius.circular(${a}),
  topRight: Radius.circular(${r}),
  bottomRight: Radius.circular(${s}),
  bottomLeft: Radius.circular(${o}),
)`;default:return""}},Q=(l,i)=>{const{type:a,angle:r,stops:s}=l;switch(i){case"css":const o=s.map(u=>`${u.color} ${Math.round(u.position*100)}%`).join(", ");return a==="linear"?`background: linear-gradient(${r}deg, ${o});`:`background: radial-gradient(circle, ${o});`;case"android_xml":return`<!-- Linear Gradient Example -->
<gradient
    android:angle="${Math.round(r/45)*45}"
    android:startColor="${s[0]?.color}"
    android:endColor="${s[s.length-1]?.color}"
    android:type="${a}" />`;case"android_compose":const n=s.map(u=>`Color(android.graphics.Color.parseColor("${u.color}"))`).join(", ");return`Brush.${a}Gradient(
    colors = listOf(${n})
)`;case"ios_swiftui":const c=s.map(u=>`.init(color: Color(hex: "${u.color}"), location: ${u.position})`).join(", ");return`${a==="linear"?"LinearGradient":"RadialGradient"}(
    gradient: Gradient(stops: [
        ${c}
    ]),
    startPoint: .top, // Adjust based on angle
    endPoint: .bottom
)`;case"ios_uikit":return`let gradientLayer = CAGradientLayer()
gradientLayer.colors = [${s.map(u=>`UIColor(hex: "${u.color}").cgColor`).join(", ")}]
gradientLayer.locations = [${s.map(u=>u.position).join(", ")}]
view.layer.addSublayer(gradientLayer)`;case"flutter":const m=s.map(u=>`Color(0xff${u.color.replace("#","")})`).join(", "),g=s.map(u=>u.position).join(", ");return`BoxDecoration(
  gradient: ${a==="linear"?"LinearGradient":"RadialGradient"}(
    colors: [${m}],
    stops: [${g}],
    begin: Alignment.topLeft, // Adjust based on angle
    end: Alignment.bottomRight,
  ),
)`;default:return""}},V=(l,i)=>{const{x:a,y:r,blur:s,color:o}=l;switch(i){case"css":return`text-shadow: ${a}px ${r}px ${s}px ${o};`;case"android_xml":return`android:shadowColor="${o}"
android:shadowDx="${a}"
android:shadowDy="${r}"
android:shadowRadius="${s}"`;case"android_compose":return`TextStyle(
    shadow = Shadow(
        color = Color(android.graphics.Color.parseColor("${o}")),
        offset = Offset(${a}f, ${r}f),
        blurRadius = ${s}f
    )
)`;case"ios_swiftui":return`.shadow(color: Color(hex: "${o}"), radius: ${s}, x: ${a}, y: ${r})`;case"ios_uikit":return`label.layer.shadowColor = UIColor(hex: "${o}").cgColor
label.layer.shadowOffset = CGSize(width: ${a}, height: ${r})
label.layer.shadowRadius = ${s}
label.layer.shadowOpacity = 1.0`;case"flutter":return`TextStyle(
  shadows: [
    Shadow(
      blurRadius: ${s},
      color: Color(0xff${o.replace("#","")}),
      offset: Offset(${a}, ${r}),
    ),
  ],
)`;default:return""}},ee=(l,i)=>{const{blur:a,brightness:r,contrast:s,grayscale:o,hueRotate:n,invert:c,opacity:m,saturate:g,sepia:u}=l,p=[];a>0&&p.push(`blur(${a}px)`),r!==100&&p.push(`brightness(${r}%)`),s!==100&&p.push(`contrast(${s}%)`),o>0&&p.push(`grayscale(${o}%)`),n>0&&p.push(`hue-rotate(${n}deg)`),c>0&&p.push(`invert(${c}%)`),m<100&&p.push(`opacity(${m}%)`),g!==100&&p.push(`saturate(${g}%)`),u>0&&p.push(`sepia(${u}%)`);const y=p.length>0?`filter: ${p.join(" ")};`:"/* No filters active */";switch(i){case"css":return y;case"android_compose":let f="";return a>0&&(f+=`
    .blur(${a}.dp)`),m<100&&(f+=`
    .alpha(${m/100}f)`),f?`Modifier${f}`:`// Compose mainly supports blur and alpha directly. 
// For others use ColorFilter with ColorMatrix.`;case"ios_swiftui":let b="";return a>0&&(b+=`
.blur(radius: ${a})`),r!==100&&(b+=`
.brightness(${(r-100)/100})`),s!==100&&(b+=`
.contrast(${s/100})`),o>0&&(b+=`
.grayscale(${o/100})`),n>0&&(b+=`
.hueRotation(.degrees(${n}))`),c>0&&(b+=`
.colorInvert(${c/100})`),m<100&&(b+=`
.opacity(${m/100})`),g!==100&&(b+=`
.saturation(${g/100})`),b.trim()?b.trim():"// No matching SwiftUI modifiers";case"flutter":return a>0?`ImageFiltered(
  imageFilter: ImageFilter.blur(sigmaX: ${a}, sigmaY: ${a}),
  child: Widget
)`:m<100?`Opacity(
  opacity: ${m/100},
  child: Widget
)`:"// Flutter uses Widgets like ImageFiltered (blur), Opacity, or ColorFiltered (matrix) for these effects.";default:return y}},te=(l,i)=>{const{rotate:a,scaleX:r,scaleY:s,skewX:o,skewY:n,translateX:c,translateY:m}=l;if(a===0&&r===1&&s===1&&o===0&&n===0&&c===0&&m===0)return"/* No transform */";const u=[];(c!==0||m!==0)&&u.push(`translate(${c}px, ${m}px)`),a!==0&&u.push(`rotate(${a}deg)`),(r!==1||s!==1)&&u.push(`scale(${r}, ${s})`),(o!==0||n!==0)&&u.push(`skew(${o}deg, ${n}deg)`);const p=`transform: ${u.join(" ")};`;switch(i){case"css":return p;case"android_compose":return`Modifier.graphicsLayer {
    ${c!==0?`translationX = ${c}.dp.toPx()
    translationY = ${m}.dp.toPx()`:""}
    ${a!==0?`rotationZ = ${a}f`:""}
    ${r!==1||s!==1?`scaleX = ${r}f
    scaleY = ${s}f`:""}
    // Skew not directly supported in standard simple modifiers
}`;case"ios_swiftui":let y="";return a!==0&&(y+=`.rotationEffect(.degrees(${a}))
`),(r!==1||s!==1)&&(y+=`.scaleEffect(x: ${r}, y: ${s})
`),(c!==0||m!==0)&&(y+=`.offset(x: ${c}, y: ${m})
`),y.trim();case"flutter":return`Transform(
  transform: Matrix4.identity()
    ${c!==0||m!==0?`..translate(${c}, ${m})`:""}
    ${a!==0?`..rotateZ(${a*Math.PI/180})`:""}
    ${r!==1||s!==1?`..scale(${r}, ${s})`:""},
  child: Widget,
)`;default:return p}},ae=(l,i)=>{const{blur:a,transparency:r,color:s,outline:o}=l,n=K(s,r);switch(i){case"css":return`background: rgba(${n.r}, ${n.g}, ${n.b}, ${r});
backdrop-filter: blur(${a}px);
-webkit-backdrop-filter: blur(${a}px);
border: ${o}px solid rgba(255, 255, 255, 0.3);`;case"android_compose":return`Box(
    modifier = Modifier
        .background(Color(${n.r}, ${n.g}, ${n.b}, ${(r*255).toFixed(0)}))
        .border(${o}.dp, Color.White.copy(alpha = 0.3f))
        // Native blur requires Android 12+ (RenderEffect) or Toolkit
)`;case"ios_swiftui":return`.background(.regularMaterial) // Native Frosted Glass
.overlay(
    RoundedRectangle(cornerRadius: 16)
        .stroke(.white.opacity(0.3), lineWidth: ${o})
)`;case"flutter":return`ClipRRect(
  child: BackdropFilter(
    filter: ImageFilter.blur(sigmaX: ${a}, sigmaY: ${a}),
    child: Container(
      decoration: BoxDecoration(
        color: Color.fromRGBO(${n.r}, ${n.g}, ${n.b}, ${r}),
        border: Border.all(color: Colors.white.withOpacity(0.3), width: ${o}),
      ),
    ),
  ),
)`;default:return""}},se=(l,i)=>{const{points:a}=l;switch(i){case"css":return`clip-path: polygon(${a.map(s=>`${s.x}% ${s.y}%`).join(", ")});`;case"android_compose":return`val shape = GenericShape { size, _ ->
${a.map((s,o)=>`    ${o===0?"moveTo":"lineTo"}(size.width * ${s.x/100}f, size.height * ${s.y/100}f)`).join(`
`)}
}
// Usage: Modifier.clip(shape)`;case"ios_swiftui":return`shape = Path { path in
${a.map((s,o)=>`    path.${o===0?"move":"addLine"}(to: CGPoint(x: rect.width * ${s.x/100}, y: rect.height * ${s.y/100}))`).join(`
`)}
}
// Usage: .clipShape(shape)`;case"flutter":return`class MyClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    var path = Path();
${a.map((s,o)=>`    path.${o===0?"moveTo":"lineTo"}(size.width * ${s.x/100}, size.height * ${s.y/100});`).join(`
`)}
    path.close();
    return path;
  }
  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}`;default:return""}},de=()=>{const{t:l}=Z(),[i,a]=C.useState("shadow"),[r,s]=C.useState("css"),[o,n]=C.useState(!1),[c,m]=C.useState({x:10,y:10,blur:20,spread:0,color:"#000000",inset:!1}),[g,u]=C.useState({tl:16,tr:16,br:16,bl:16}),[p,y]=C.useState({type:"linear",angle:135,stops:[{color:"#8ec5fc",position:0},{color:"#e0c3fc",position:1}]}),[f,b]=C.useState({x:2,y:2,blur:4,color:"#000000"}),[$,G]=C.useState({blur:0,brightness:100,contrast:100,grayscale:0,hueRotate:0,invert:0,opacity:100,saturate:100,sepia:0}),[w,_]=C.useState({rotate:0,scaleX:1,scaleY:1,skewX:0,skewY:0,translateX:0,translateY:0}),[v,T]=C.useState({blur:10,transparency:.25,color:"#ffffff",outline:1}),[j,N]=C.useState({type:"polygon",points:[{x:50,y:0},{x:0,y:100},{x:100,y:100}]}),M=()=>{switch(i){case"shadow":return H(c,r);case"radius":return J(g,r);case"gradient":return Q(p,r);case"textShadow":return V(f,r);case"filter":return ee($,r);case"transform":return te(w,r);case"glass":return ae(v,r);case"clipPath":return se(j,r);default:return""}},F=()=>{navigator.clipboard.writeText(M()),n(!0),setTimeout(()=>n(!1),2e3)},X=()=>{const t={width:"200px",height:"200px",backgroundColor:"white",transition:"all 0.3s ease",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",fontWeight:"bold",color:"#333"};if(i==="shadow")t.boxShadow=`${c.inset?"inset ":""}${c.x}px ${c.y}px ${c.blur}px ${c.spread}px ${c.color}`,t.borderRadius="12px";else if(i==="radius")t.borderRadius=`${g.tl}px ${g.tr}px ${g.br}px ${g.bl}px`,t.border="2px solid #e2e8f0",t.background="linear-gradient(135deg, #6366f1 0%, #a855f7 100%)";else if(i==="gradient"){t.borderRadius="12px";const d=p.stops.map(x=>`${x.color} ${Math.round(x.position*100)}%`).join(", ");t.background=p.type==="linear"?`linear-gradient(${p.angle}deg, ${d})`:`radial-gradient(circle, ${d})`}else if(i==="textShadow")t.textShadow=`${f.x}px ${f.y}px ${f.blur}px ${f.color}`,t.backgroundColor="transparent";else if(i==="filter")t.filter=`blur(${$.blur}px) brightness(${$.brightness}%) contrast(${$.contrast}%) grayscale(${$.grayscale}%) hue-rotate(${$.hueRotate}deg) invert(${$.invert}%) opacity(${$.opacity}%) saturate(${$.saturate}%) sepia(${$.sepia}%)`,t.backgroundImage='url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80")',t.backgroundSize="cover";else if(i==="transform")t.transform=`translate(${w.translateX}px, ${w.translateY}px) rotate(${w.rotate}deg) scale(${w.scaleX}, ${w.scaleY}) skew(${w.skewX}deg, ${w.skewY}deg)`,t.background="linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)",t.borderRadius="12px";else if(i==="glass"){const d=(()=>{const x=v.color,h=parseInt(x.slice(1,3),16),S=parseInt(x.slice(3,5),16),R=parseInt(x.slice(5,7),16);return`${h}, ${S}, ${R}`})();t.backgroundColor=`rgba(${d}, ${v.transparency})`,t.backdropFilter=`blur(${v.blur}px)`,t.WebkitBackdropFilter=`blur(${v.blur}px)`,t.border=`${v.outline}px solid rgba(255, 255, 255, 0.3)`,t.borderRadius="16px"}else if(i==="clipPath"){const d=j.points.map(x=>`${x.x}% ${x.y}%`).join(", ");t.clipPath=`polygon(${d})`,t.background="linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)",t.width="200px",t.height="200px"}return t},I=t=>{t==="triangle"&&N({type:"polygon",points:[{x:50,y:0},{x:0,y:100},{x:100,y:100}]}),t==="circle"&&N({type:"polygon",points:[{x:50,y:0},{x:100,y:50},{x:50,y:100},{x:0,y:50}]}),t==="trapezoid"&&N({type:"polygon",points:[{x:20,y:0},{x:80,y:0},{x:100,y:100},{x:0,y:100}]}),t==="parallelogram"&&N({type:"polygon",points:[{x:25,y:0},{x:100,y:0},{x:75,y:100},{x:0,y:100}]}),t==="star"&&N({type:"polygon",points:[{x:50,y:0},{x:61,y:35},{x:98,y:35},{x:68,y:57},{x:79,y:91},{x:50,y:70},{x:21,y:91},{x:32,y:57},{x:2,y:35},{x:39,y:35}]})},k=({id:t,icon:d,label:x})=>e.jsxs("button",{onClick:()=>a(t),className:P("flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap min-w-[140px]",i===t?"bg-white dark:bg-gray-700 shadow-sm text-slate-800 dark:text-white":"text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200"),children:[e.jsx(d,{size:16})," ",x]});return e.jsxs("div",{className:"h-full flex flex-col p-6 max-w-[1600px] mx-auto w-full relative",children:[e.jsxs("h1",{className:"text-3xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-3",children:[e.jsx(Y,{className:"text-purple-500",size:32}),l("cssGenerator.title","CSS Generator")]}),e.jsxs("div",{className:"flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0",children:[e.jsxs("div",{className:"flex-1 flex flex-col gap-6 overflow-y-auto min-h-0 pr-2 pb-10",children:[e.jsxs("div",{className:"flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl shrink-0 overflow-x-auto gap-1",children:[e.jsx(k,{id:"shadow",icon:L,label:l("cssGenerator.boxShadow","Box Shadow")}),e.jsx(k,{id:"radius",icon:z,label:l("cssGenerator.borderRadius","Border Radius")}),e.jsx(k,{id:"gradient",icon:B,label:l("cssGenerator.gradient","Gradient")}),e.jsx(k,{id:"textShadow",icon:O,label:l("cssGenerator.textShadow","Text Shadow")}),e.jsx(k,{id:"filter",icon:A,label:l("cssGenerator.filter","Filter")}),e.jsx(k,{id:"transform",icon:E,label:l("cssGenerator.transform","Transform")}),e.jsx(k,{id:"glass",icon:D,label:l("cssGenerator.glassmorphism","Glassmorphism")}),e.jsx(k,{id:"clipPath",icon:U,label:l("cssGenerator.clipPath","Clip Path")})]}),e.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700",children:[i==="shadow"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"grid grid-cols-2 gap-4",children:["x","y","blur","spread"].map(t=>e.jsxs("div",{children:[e.jsxs("label",{className:"text-xs font-semibold text-gray-500 uppercase",children:[t,": ",c[t],"px"]}),e.jsx("input",{type:"range",min:"-50",max:"50",value:c[t],onChange:d=>m({...c,[t]:Number(d.target.value)}),className:"w-full mt-1"})]},t))}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("input",{type:"color",value:c.color,onChange:t=>m({...c,color:t.target.value}),className:"h-8 w-16"}),e.jsxs("label",{className:"flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300",children:[e.jsx("input",{type:"checkbox",checked:c.inset,onChange:t=>m({...c,inset:t.target.checked}),className:"rounded border-gray-300"}),"Inset"]})]})]}),i==="radius"&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase",children:"All Corners"}),e.jsx("input",{type:"range",min:"0",max:"100",value:g.tl,onChange:t=>{const d=Number(t.target.value);u({tl:d,tr:d,br:d,bl:d})},className:"w-2/3"})]}),e.jsx("div",{className:"grid grid-cols-2 gap-4",children:["tl","tr","br","bl"].map(t=>e.jsxs("div",{children:[e.jsxs("label",{className:"text-xs font-semibold text-gray-500 uppercase",children:[t,": ",g[t],"px"]}),e.jsx("input",{type:"range",min:"0",max:"100",value:g[t],onChange:d=>u({...g,[t]:Number(d.target.value)}),className:"w-full mt-1"})]},t))})]}),i==="gradient"&&e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"flex gap-4",children:["linear","radial"].map(t=>e.jsxs("label",{className:"flex items-center gap-2 text-sm dark:text-white capitalize",children:[e.jsx("input",{type:"radio",checked:p.type===t,onChange:()=>y({...p,type:t})})," ",t]},t))}),p.type==="linear"&&e.jsxs("div",{children:[e.jsxs("label",{className:"text-xs font-semibold text-gray-500 uppercase",children:["Angle: ",p.angle,"deg"]}),e.jsx("input",{type:"range",min:"0",max:"360",value:p.angle,onChange:t=>y({...p,angle:Number(t.target.value)}),className:"w-full mt-1"})]}),e.jsx("div",{className:"space-y-2",children:p.stops.map((t,d)=>e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx("input",{type:"color",value:t.color,onChange:x=>{const h=[...p.stops];h[d].color=x.target.value,y({...p,stops:h})},className:"h-8 w-10 shrink-0"}),e.jsx("input",{type:"range",min:"0",max:"1",step:"0.01",value:t.position,onChange:x=>{const h=[...p.stops];h[d].position=Number(x.target.value),y({...p,stops:h})},className:"flex-1"})]},d))})]}),i==="textShadow"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"grid grid-cols-2 gap-4",children:["x","y","blur"].map(t=>e.jsxs("div",{children:[e.jsxs("label",{className:"text-xs font-semibold text-gray-500 uppercase",children:[t,": ",f[t],"px"]}),e.jsx("input",{type:"range",min:"-50",max:"50",value:f[t],onChange:d=>b({...f,[t]:Number(d.target.value)}),className:"w-full mt-1"})]},t))}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase block mb-1",children:"Color"}),e.jsx("input",{type:"color",value:f.color,onChange:t=>b({...f,color:t.target.value}),className:"h-8 w-16"})]})]}),i==="filter"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"grid grid-cols-2 gap-4",children:[{key:"blur",max:20,unit:"px"},{key:"brightness",max:200,unit:"%"},{key:"contrast",max:200,unit:"%"},{key:"grayscale",max:100,unit:"%"},{key:"hueRotate",max:360,unit:"deg"},{key:"invert",max:100,unit:"%"},{key:"opacity",max:100,unit:"%"},{key:"saturate",max:200,unit:"%"},{key:"sepia",max:100,unit:"%"}].map(({key:t,max:d,unit:x})=>e.jsxs("div",{children:[e.jsxs("label",{className:"text-xs font-semibold text-gray-500 uppercase",children:[t,": ",$[t],x]}),e.jsx("input",{type:"range",min:"0",max:d,value:$[t],onChange:h=>G({...$,[t]:Number(h.target.value)}),className:"w-full mt-1"})]},t))}),e.jsx("button",{onClick:()=>G({blur:0,brightness:100,contrast:100,grayscale:0,hueRotate:0,invert:0,opacity:100,saturate:100,sepia:0}),className:"text-sm text-red-500 hover:underline",children:"Reset Filters"})]}),i==="transform"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"grid grid-cols-2 gap-4",children:[{key:"rotate",min:0,max:360,step:1},{key:"scaleX",min:.1,max:2,step:.1},{key:"scaleY",min:.1,max:2,step:.1},{key:"skewX",min:-180,max:180,step:1},{key:"skewY",min:-180,max:180,step:1},{key:"translateX",min:-100,max:100,step:1},{key:"translateY",min:-100,max:100,step:1}].map(({key:t,min:d,max:x,step:h})=>e.jsxs("div",{children:[e.jsxs("label",{className:"text-xs font-semibold text-gray-500 uppercase",children:[t,": ",w[t]]}),e.jsx("input",{type:"range",min:d,max:x,step:h,value:w[t],onChange:S=>_({...w,[t]:Number(S.target.value)}),className:"w-full mt-1"})]},t))}),e.jsx("button",{onClick:()=>_({rotate:0,scaleX:1,scaleY:1,skewX:0,skewY:0,translateX:0,translateY:0}),className:"text-sm text-red-500 hover:underline",children:"Reset Transform"})]}),i==="glass"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"grid grid-cols-2 gap-4",children:[{key:"blur",min:0,max:50,step:1,unit:"px"},{key:"transparency",min:0,max:1,step:.01,unit:""},{key:"outline",min:0,max:5,step:.5,unit:"px"}].map(({key:t,min:d,max:x,step:h,unit:S})=>e.jsxs("div",{children:[e.jsxs("label",{className:"text-xs font-semibold text-gray-500 uppercase",children:[t,": ",v[t],S]}),e.jsx("input",{type:"range",min:d,max:x,step:h,value:v[t],onChange:R=>T({...v,[t]:Number(R.target.value)}),className:"w-full mt-1"})]},t))}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase block mb-1",children:"Glass Color"}),e.jsx("input",{type:"color",value:v.color,onChange:t=>T({...v,color:t.target.value}),className:"h-8 w-full"})]})]}),i==="clipPath"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2",children:"Presets"}),e.jsx("div",{className:"flex flex-wrap gap-2",children:["Triangle","Trapezoid","Parallelogram","Star","Diamond"].map(t=>e.jsx("button",{onClick:()=>I(t.toLowerCase()),className:"px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-slate-700 dark:text-gray-300 transition-colors",children:t},t))})]}),e.jsxs("div",{className:"bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg",children:[e.jsx("h3",{className:"text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2",children:"Points (X% Y%)"}),e.jsx("div",{className:"space-y-2",children:j.points.map((t,d)=>e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx("span",{className:"text-xs font-mono w-4",children:d+1}),e.jsx("input",{type:"number",value:t.x,min:"0",max:"100",onChange:x=>{const h=[...j.points];h[d].x=Number(x.target.value),N({...j,points:h})},className:"w-16 rounded text-xs p-1 text-black",placeholder:"X"}),e.jsx("input",{type:"number",value:t.y,min:"0",max:"100",onChange:x=>{const h=[...j.points];h[d].y=Number(x.target.value),N({...j,points:h})},className:"w-16 rounded text-xs p-1 text-black",placeholder:"Y"}),e.jsx("button",{onClick:()=>{const x=j.points.filter((h,S)=>S!==d);N({...j,points:x})},className:"text-red-500 hover:text-red-700",children:"×"})]},d))}),e.jsx("button",{onClick:()=>N({...j,points:[...j.points,{x:0,y:0}]}),className:"mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline",children:"+ Add Point"})]})]})]})]}),e.jsxs("div",{className:"w-full lg:w-[450px] flex flex-col gap-6 shrink-0",children:[e.jsxs("div",{className:"bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center p-8 h-[300px] border border-gray-200 dark:border-gray-700 shadow-inner relative overflow-hidden",children:[i==="glass"?e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center",children:e.jsx("div",{className:"text-4xl font-bold text-white opacity-50",children:"GLASS"})}):e.jsx("div",{className:"absolute inset-0 opacity-10",style:{backgroundImage:"linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)",backgroundSize:"20px 20px",backgroundPosition:"0 0, 0 10px, 10px -10px, -10px 0px"}}),i==="textShadow"?e.jsx("h1",{style:X(),className:"relative z-10 text-4xl font-bold",children:"Preview"}):e.jsx("div",{style:X(),className:P("relative z-10 shadow-sm",i==="glass"?"w-48 h-48 flex items-center justify-center":""),children:i==="glass"&&e.jsx("span",{className:"text-gray-800 font-medium",children:"Frosted Element"})})]}),e.jsxs("div",{className:"bg-slate-900 rounded-xl overflow-hidden flex flex-col shadow-lg flex-1 min-h-[300px] mb-6 lg:mb-0",children:[e.jsx("div",{className:"flex p-2 bg-slate-800 border-b border-slate-700 overflow-x-auto",children:[{id:"css",label:"CSS"},{id:"android_xml",label:"Android XML"},{id:"android_compose",label:"Compose"},{id:"ios_swiftui",label:"SwiftUI"},{id:"ios_uikit",label:"UIKit"},{id:"flutter",label:"Flutter"}].map(t=>e.jsx("button",{onClick:()=>s(t.id),className:P("px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors",r===t.id?"bg-slate-700 text-white":"text-slate-400 hover:text-white hover:bg-slate-700/50"),children:t.label},t.id))}),e.jsxs("div",{className:"relative flex-1 p-4 font-mono text-sm text-blue-300 overflow-auto",children:[e.jsx("pre",{className:"whitespace-pre-wrap break-all",children:M()}),e.jsx("button",{onClick:F,className:"absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors backdrop-blur-sm",children:o?e.jsx(W,{size:16,className:"text-green-400"}):e.jsx(q,{size:16})})]})]})]})]})]})};export{de as CssGenerator};
