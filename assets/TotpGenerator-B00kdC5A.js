import{j as f,K as _e,y as He,R as Fe,ae as he,Q as Oe,f as me,d as pe,aP as Ve,G as ze,aQ as Ke}from"./ui-vendor-DEvE63cZ.js";import{r as N}from"./react-vendor-BGp5FbCG.js";import{C as K}from"./index-62DLJybD.js";import{u as Je,c as Ye}from"./index-DH-nAFKK.js";import{v as We}from"./vsc-dark-plus-CcVsXCy1.js";import"./utils-vendor-CJFcDo9C.js";import"./index-B2O9PLBP.js";import"./framer-vendor-DEiCTn3G.js";var V={},Ge=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then},xe={},E={};let ce;const Qe=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];E.getSymbolSize=function(e){if(!e)throw new Error('"version" cannot be null or undefined');if(e<1||e>40)throw new Error('"version" should be in range from 1 to 40');return e*4+17};E.getSymbolTotalCodewords=function(e){return Qe[e]};E.getBCHDigit=function(t){let e=0;for(;t!==0;)e++,t>>>=1;return e};E.setToSJISFunction=function(e){if(typeof e!="function")throw new Error('"toSJISFunc" is not a valid function.');ce=e};E.isKanjiModeEnabled=function(){return typeof ce<"u"};E.toSJIS=function(e){return ce(e)};var Q={};(function(t){t.L={bit:1},t.M={bit:0},t.Q={bit:3},t.H={bit:2};function e(i){if(typeof i!="string")throw new Error("Param is not a string");switch(i.toLowerCase()){case"l":case"low":return t.L;case"m":case"medium":return t.M;case"q":case"quartile":return t.Q;case"h":case"high":return t.H;default:throw new Error("Unknown EC Level: "+i)}}t.isValid=function(o){return o&&typeof o.bit<"u"&&o.bit>=0&&o.bit<4},t.from=function(o,r){if(t.isValid(o))return o;try{return e(o)}catch{return r}}})(Q);function Se(){this.buffer=[],this.length=0}Se.prototype={get:function(t){const e=Math.floor(t/8);return(this.buffer[e]>>>7-t%8&1)===1},put:function(t,e){for(let i=0;i<e;i++)this.putBit((t>>>e-i-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(t){const e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),t&&(this.buffer[e]|=128>>>this.length%8),this.length++}};var Xe=Se;function z(t){if(!t||t<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}z.prototype.set=function(t,e,i,o){const r=t*this.size+e;this.data[r]=i,o&&(this.reservedBit[r]=!0)};z.prototype.get=function(t,e){return this.data[t*this.size+e]};z.prototype.xor=function(t,e,i){this.data[t*this.size+e]^=i};z.prototype.isReserved=function(t,e){return this.reservedBit[t*this.size+e]};var qe=z,Te={};(function(t){const e=E.getSymbolSize;t.getRowColCoords=function(o){if(o===1)return[];const r=Math.floor(o/7)+2,n=e(o),s=n===145?26:Math.ceil((n-13)/(2*r-2))*2,l=[n-7];for(let a=1;a<r-1;a++)l[a]=l[a-1]-s;return l.push(6),l.reverse()},t.getPositions=function(o){const r=[],n=t.getRowColCoords(o),s=n.length;for(let l=0;l<s;l++)for(let a=0;a<s;a++)l===0&&a===0||l===0&&a===s-1||l===s-1&&a===0||r.push([n[l],n[a]]);return r}})(Te);var ve={};const Ze=E.getSymbolSize,ye=7;ve.getPositions=function(e){const i=Ze(e);return[[0,0],[i-ye,0],[0,i-ye]]};var Ee={};(function(t){t.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const e={N1:3,N2:3,N3:40,N4:10};t.isValid=function(r){return r!=null&&r!==""&&!isNaN(r)&&r>=0&&r<=7},t.from=function(r){return t.isValid(r)?parseInt(r,10):void 0},t.getPenaltyN1=function(r){const n=r.size;let s=0,l=0,a=0,d=null,u=null;for(let x=0;x<n;x++){l=a=0,d=u=null;for(let m=0;m<n;m++){let g=r.get(x,m);g===d?l++:(l>=5&&(s+=e.N1+(l-5)),d=g,l=1),g=r.get(m,x),g===u?a++:(a>=5&&(s+=e.N1+(a-5)),u=g,a=1)}l>=5&&(s+=e.N1+(l-5)),a>=5&&(s+=e.N1+(a-5))}return s},t.getPenaltyN2=function(r){const n=r.size;let s=0;for(let l=0;l<n-1;l++)for(let a=0;a<n-1;a++){const d=r.get(l,a)+r.get(l,a+1)+r.get(l+1,a)+r.get(l+1,a+1);(d===4||d===0)&&s++}return s*e.N2},t.getPenaltyN3=function(r){const n=r.size;let s=0,l=0,a=0;for(let d=0;d<n;d++){l=a=0;for(let u=0;u<n;u++)l=l<<1&2047|r.get(d,u),u>=10&&(l===1488||l===93)&&s++,a=a<<1&2047|r.get(u,d),u>=10&&(a===1488||a===93)&&s++}return s*e.N3},t.getPenaltyN4=function(r){let n=0;const s=r.data.length;for(let a=0;a<s;a++)n+=r.data[a];return Math.abs(Math.ceil(n*100/s/5)-10)*e.N4};function i(o,r,n){switch(o){case t.Patterns.PATTERN000:return(r+n)%2===0;case t.Patterns.PATTERN001:return r%2===0;case t.Patterns.PATTERN010:return n%3===0;case t.Patterns.PATTERN011:return(r+n)%3===0;case t.Patterns.PATTERN100:return(Math.floor(r/2)+Math.floor(n/3))%2===0;case t.Patterns.PATTERN101:return r*n%2+r*n%3===0;case t.Patterns.PATTERN110:return(r*n%2+r*n%3)%2===0;case t.Patterns.PATTERN111:return(r*n%3+(r+n)%2)%2===0;default:throw new Error("bad maskPattern:"+o)}}t.applyMask=function(r,n){const s=n.size;for(let l=0;l<s;l++)for(let a=0;a<s;a++)n.isReserved(a,l)||n.xor(a,l,i(r,a,l))},t.getBestMask=function(r,n){const s=Object.keys(t.Patterns).length;let l=0,a=1/0;for(let d=0;d<s;d++){n(d),t.applyMask(d,r);const u=t.getPenaltyN1(r)+t.getPenaltyN2(r)+t.getPenaltyN3(r)+t.getPenaltyN4(r);t.applyMask(d,r),u<a&&(a=u,l=d)}return l}})(Ee);var X={};const k=Q,J=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],Y=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];X.getBlocksCount=function(e,i){switch(i){case k.L:return J[(e-1)*4+0];case k.M:return J[(e-1)*4+1];case k.Q:return J[(e-1)*4+2];case k.H:return J[(e-1)*4+3];default:return}};X.getTotalCodewordsCount=function(e,i){switch(i){case k.L:return Y[(e-1)*4+0];case k.M:return Y[(e-1)*4+1];case k.Q:return Y[(e-1)*4+2];case k.H:return Y[(e-1)*4+3];default:return}};var Ie={},q={};const F=new Uint8Array(512),W=new Uint8Array(256);(function(){let e=1;for(let i=0;i<255;i++)F[i]=e,W[e]=i,e<<=1,e&256&&(e^=285);for(let i=255;i<512;i++)F[i]=F[i-255]})();q.log=function(e){if(e<1)throw new Error("log("+e+")");return W[e]};q.exp=function(e){return F[e]};q.mul=function(e,i){return e===0||i===0?0:F[W[e]+W[i]]};(function(t){const e=q;t.mul=function(o,r){const n=new Uint8Array(o.length+r.length-1);for(let s=0;s<o.length;s++)for(let l=0;l<r.length;l++)n[s+l]^=e.mul(o[s],r[l]);return n},t.mod=function(o,r){let n=new Uint8Array(o);for(;n.length-r.length>=0;){const s=n[0];for(let a=0;a<r.length;a++)n[a]^=e.mul(r[a],s);let l=0;for(;l<n.length&&n[l]===0;)l++;n=n.slice(l)}return n},t.generateECPolynomial=function(o){let r=new Uint8Array([1]);for(let n=0;n<o;n++)r=t.mul(r,new Uint8Array([1,e.exp(n)]));return r}})(Ie);const Pe=Ie;function de(t){this.genPoly=void 0,this.degree=t,this.degree&&this.initialize(this.degree)}de.prototype.initialize=function(e){this.degree=e,this.genPoly=Pe.generateECPolynomial(this.degree)};de.prototype.encode=function(e){if(!this.genPoly)throw new Error("Encoder not initialized");const i=new Uint8Array(e.length+this.degree);i.set(e);const o=Pe.mod(i,this.genPoly),r=this.degree-o.length;if(r>0){const n=new Uint8Array(this.degree);return n.set(o,r),n}return o};var $e=de,Ne={},D={},ue={};ue.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40};var B={};const Be="[0-9]+",et="[A-Z $%*+\\-./:]+";let O="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";O=O.replace(/u/g,"\\u");const tt="(?:(?![A-Z0-9 $%*+\\-./:]|"+O+`)(?:.|[\r
]))+`;B.KANJI=new RegExp(O,"g");B.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");B.BYTE=new RegExp(tt,"g");B.NUMERIC=new RegExp(Be,"g");B.ALPHANUMERIC=new RegExp(et,"g");const rt=new RegExp("^"+O+"$"),nt=new RegExp("^"+Be+"$"),ot=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");B.testKanji=function(e){return rt.test(e)};B.testNumeric=function(e){return nt.test(e)};B.testAlphanumeric=function(e){return ot.test(e)};(function(t){const e=ue,i=B;t.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},t.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},t.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},t.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},t.MIXED={bit:-1},t.getCharCountIndicator=function(n,s){if(!n.ccBits)throw new Error("Invalid mode: "+n);if(!e.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?n.ccBits[0]:s<27?n.ccBits[1]:n.ccBits[2]},t.getBestModeForData=function(n){return i.testNumeric(n)?t.NUMERIC:i.testAlphanumeric(n)?t.ALPHANUMERIC:i.testKanji(n)?t.KANJI:t.BYTE},t.toString=function(n){if(n&&n.id)return n.id;throw new Error("Invalid mode")},t.isValid=function(n){return n&&n.bit&&n.ccBits};function o(r){if(typeof r!="string")throw new Error("Param is not a string");switch(r.toLowerCase()){case"numeric":return t.NUMERIC;case"alphanumeric":return t.ALPHANUMERIC;case"kanji":return t.KANJI;case"byte":return t.BYTE;default:throw new Error("Unknown mode: "+r)}}t.from=function(n,s){if(t.isValid(n))return n;try{return o(n)}catch{return s}}})(D);(function(t){const e=E,i=X,o=Q,r=D,n=ue,s=7973,l=e.getBCHDigit(s);function a(m,g,y){for(let w=1;w<=40;w++)if(g<=t.getCapacity(w,y,m))return w}function d(m,g){return r.getCharCountIndicator(m,g)+4}function u(m,g){let y=0;return m.forEach(function(w){const v=d(w.mode,g);y+=v+w.getBitsLength()}),y}function x(m,g){for(let y=1;y<=40;y++)if(u(m,y)<=t.getCapacity(y,g,r.MIXED))return y}t.from=function(g,y){return n.isValid(g)?parseInt(g,10):y},t.getCapacity=function(g,y,w){if(!n.isValid(g))throw new Error("Invalid QR Code version");typeof w>"u"&&(w=r.BYTE);const v=e.getSymbolTotalCodewords(g),p=i.getTotalCodewordsCount(g,y),b=(v-p)*8;if(w===r.MIXED)return b;const c=b-d(w,g);switch(w){case r.NUMERIC:return Math.floor(c/10*3);case r.ALPHANUMERIC:return Math.floor(c/11*2);case r.KANJI:return Math.floor(c/13);case r.BYTE:default:return Math.floor(c/8)}},t.getBestVersionForData=function(g,y){let w;const v=o.from(y,o.M);if(Array.isArray(g)){if(g.length>1)return x(g,v);if(g.length===0)return 1;w=g[0]}else w=g;return a(w.mode,w.getLength(),v)},t.getEncodedBits=function(g){if(!n.isValid(g)||g<7)throw new Error("Invalid QR Code version");let y=g<<12;for(;e.getBCHDigit(y)-l>=0;)y^=s<<e.getBCHDigit(y)-l;return g<<12|y}})(Ne);var Ae={};const ie=E,Le=1335,it=21522,we=ie.getBCHDigit(Le);Ae.getEncodedBits=function(e,i){const o=e.bit<<3|i;let r=o<<10;for(;ie.getBCHDigit(r)-we>=0;)r^=Le<<ie.getBCHDigit(r)-we;return(o<<10|r)^it};var ke={};const st=D;function M(t){this.mode=st.NUMERIC,this.data=t.toString()}M.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)};M.prototype.getLength=function(){return this.data.length};M.prototype.getBitsLength=function(){return M.getBitsLength(this.data.length)};M.prototype.write=function(e){let i,o,r;for(i=0;i+3<=this.data.length;i+=3)o=this.data.substr(i,3),r=parseInt(o,10),e.put(r,10);const n=this.data.length-i;n>0&&(o=this.data.substr(i),r=parseInt(o,10),e.put(r,n*3+1))};var at=M;const lt=D,ee=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function U(t){this.mode=lt.ALPHANUMERIC,this.data=t}U.getBitsLength=function(e){return 11*Math.floor(e/2)+6*(e%2)};U.prototype.getLength=function(){return this.data.length};U.prototype.getBitsLength=function(){return U.getBitsLength(this.data.length)};U.prototype.write=function(e){let i;for(i=0;i+2<=this.data.length;i+=2){let o=ee.indexOf(this.data[i])*45;o+=ee.indexOf(this.data[i+1]),e.put(o,11)}this.data.length%2&&e.put(ee.indexOf(this.data[i]),6)};var ct=U;const dt=D;function R(t){this.mode=dt.BYTE,typeof t=="string"?this.data=new TextEncoder().encode(t):this.data=new Uint8Array(t)}R.getBitsLength=function(e){return e*8};R.prototype.getLength=function(){return this.data.length};R.prototype.getBitsLength=function(){return R.getBitsLength(this.data.length)};R.prototype.write=function(t){for(let e=0,i=this.data.length;e<i;e++)t.put(this.data[e],8)};var ut=R;const gt=D,ft=E;function j(t){this.mode=gt.KANJI,this.data=t}j.getBitsLength=function(e){return e*13};j.prototype.getLength=function(){return this.data.length};j.prototype.getBitsLength=function(){return j.getBitsLength(this.data.length)};j.prototype.write=function(t){let e;for(e=0;e<this.data.length;e++){let i=ft.toSJIS(this.data[e]);if(i>=33088&&i<=40956)i-=33088;else if(i>=57408&&i<=60351)i-=49472;else throw new Error("Invalid SJIS character: "+this.data[e]+`
Make sure your charset is UTF-8`);i=(i>>>8&255)*192+(i&255),t.put(i,13)}};var ht=j,De={exports:{}};(function(t){var e={single_source_shortest_paths:function(i,o,r){var n={},s={};s[o]=0;var l=e.PriorityQueue.make();l.push(o,0);for(var a,d,u,x,m,g,y,w,v;!l.empty();){a=l.pop(),d=a.value,x=a.cost,m=i[d]||{};for(u in m)m.hasOwnProperty(u)&&(g=m[u],y=x+g,w=s[u],v=typeof s[u]>"u",(v||w>y)&&(s[u]=y,l.push(u,y),n[u]=d))}if(typeof r<"u"&&typeof s[r]>"u"){var p=["Could not find a path from ",o," to ",r,"."].join("");throw new Error(p)}return n},extract_shortest_path_from_predecessor_list:function(i,o){for(var r=[],n=o;n;)r.push(n),i[n],n=i[n];return r.reverse(),r},find_path:function(i,o,r){var n=e.single_source_shortest_paths(i,o,r);return e.extract_shortest_path_from_predecessor_list(n,r)},PriorityQueue:{make:function(i){var o=e.PriorityQueue,r={},n;i=i||{};for(n in o)o.hasOwnProperty(n)&&(r[n]=o[n]);return r.queue=[],r.sorter=i.sorter||o.default_sorter,r},default_sorter:function(i,o){return i.cost-o.cost},push:function(i,o){var r={value:i,cost:o};this.queue.push(r),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};t.exports=e})(De);var mt=De.exports;(function(t){const e=D,i=at,o=ct,r=ut,n=ht,s=B,l=E,a=mt;function d(p){return unescape(encodeURIComponent(p)).length}function u(p,b,c){const h=[];let C;for(;(C=p.exec(c))!==null;)h.push({data:C[0],index:C.index,mode:b,length:C[0].length});return h}function x(p){const b=u(s.NUMERIC,e.NUMERIC,p),c=u(s.ALPHANUMERIC,e.ALPHANUMERIC,p);let h,C;return l.isKanjiModeEnabled()?(h=u(s.BYTE,e.BYTE,p),C=u(s.KANJI,e.KANJI,p)):(h=u(s.BYTE_KANJI,e.BYTE,p),C=[]),b.concat(c,h,C).sort(function(T,I){return T.index-I.index}).map(function(T){return{data:T.data,mode:T.mode,length:T.length}})}function m(p,b){switch(b){case e.NUMERIC:return i.getBitsLength(p);case e.ALPHANUMERIC:return o.getBitsLength(p);case e.KANJI:return n.getBitsLength(p);case e.BYTE:return r.getBitsLength(p)}}function g(p){return p.reduce(function(b,c){const h=b.length-1>=0?b[b.length-1]:null;return h&&h.mode===c.mode?(b[b.length-1].data+=c.data,b):(b.push(c),b)},[])}function y(p){const b=[];for(let c=0;c<p.length;c++){const h=p[c];switch(h.mode){case e.NUMERIC:b.push([h,{data:h.data,mode:e.ALPHANUMERIC,length:h.length},{data:h.data,mode:e.BYTE,length:h.length}]);break;case e.ALPHANUMERIC:b.push([h,{data:h.data,mode:e.BYTE,length:h.length}]);break;case e.KANJI:b.push([h,{data:h.data,mode:e.BYTE,length:d(h.data)}]);break;case e.BYTE:b.push([{data:h.data,mode:e.BYTE,length:d(h.data)}])}}return b}function w(p,b){const c={},h={start:{}};let C=["start"];for(let S=0;S<p.length;S++){const T=p[S],I=[];for(let L=0;L<T.length;L++){const P=T[L],_=""+S+L;I.push(_),c[_]={node:P,lastCount:0},h[_]={};for(let $=0;$<C.length;$++){const A=C[$];c[A]&&c[A].node.mode===P.mode?(h[A][_]=m(c[A].lastCount+P.length,P.mode)-m(c[A].lastCount,P.mode),c[A].lastCount+=P.length):(c[A]&&(c[A].lastCount=P.length),h[A][_]=m(P.length,P.mode)+4+e.getCharCountIndicator(P.mode,b))}}C=I}for(let S=0;S<C.length;S++)h[C[S]].end=0;return{map:h,table:c}}function v(p,b){let c;const h=e.getBestModeForData(p);if(c=e.from(b,h),c!==e.BYTE&&c.bit<h.bit)throw new Error('"'+p+'" cannot be encoded with mode '+e.toString(c)+`.
 Suggested mode is: `+e.toString(h));switch(c===e.KANJI&&!l.isKanjiModeEnabled()&&(c=e.BYTE),c){case e.NUMERIC:return new i(p);case e.ALPHANUMERIC:return new o(p);case e.KANJI:return new n(p);case e.BYTE:return new r(p)}}t.fromArray=function(b){return b.reduce(function(c,h){return typeof h=="string"?c.push(v(h,null)):h.data&&c.push(v(h.data,h.mode)),c},[])},t.fromString=function(b,c){const h=x(b,l.isKanjiModeEnabled()),C=y(h),S=w(C,c),T=a.find_path(S.map,"start","end"),I=[];for(let L=1;L<T.length-1;L++)I.push(S.table[T[L]].node);return t.fromArray(g(I))},t.rawSplit=function(b){return t.fromArray(x(b,l.isKanjiModeEnabled()))}})(ke);const Z=E,te=Q,pt=Xe,yt=qe,wt=Te,bt=ve,se=Ee,ae=X,Ct=$e,G=Ne,xt=Ae,St=D,re=ke;function Tt(t,e){const i=t.size,o=bt.getPositions(e);for(let r=0;r<o.length;r++){const n=o[r][0],s=o[r][1];for(let l=-1;l<=7;l++)if(!(n+l<=-1||i<=n+l))for(let a=-1;a<=7;a++)s+a<=-1||i<=s+a||(l>=0&&l<=6&&(a===0||a===6)||a>=0&&a<=6&&(l===0||l===6)||l>=2&&l<=4&&a>=2&&a<=4?t.set(n+l,s+a,!0,!0):t.set(n+l,s+a,!1,!0))}}function vt(t){const e=t.size;for(let i=8;i<e-8;i++){const o=i%2===0;t.set(i,6,o,!0),t.set(6,i,o,!0)}}function Et(t,e){const i=wt.getPositions(e);for(let o=0;o<i.length;o++){const r=i[o][0],n=i[o][1];for(let s=-2;s<=2;s++)for(let l=-2;l<=2;l++)s===-2||s===2||l===-2||l===2||s===0&&l===0?t.set(r+s,n+l,!0,!0):t.set(r+s,n+l,!1,!0)}}function It(t,e){const i=t.size,o=G.getEncodedBits(e);let r,n,s;for(let l=0;l<18;l++)r=Math.floor(l/3),n=l%3+i-8-3,s=(o>>l&1)===1,t.set(r,n,s,!0),t.set(n,r,s,!0)}function ne(t,e,i){const o=t.size,r=xt.getEncodedBits(e,i);let n,s;for(n=0;n<15;n++)s=(r>>n&1)===1,n<6?t.set(n,8,s,!0):n<8?t.set(n+1,8,s,!0):t.set(o-15+n,8,s,!0),n<8?t.set(8,o-n-1,s,!0):n<9?t.set(8,15-n-1+1,s,!0):t.set(8,15-n-1,s,!0);t.set(o-8,8,1,!0)}function Pt(t,e){const i=t.size;let o=-1,r=i-1,n=7,s=0;for(let l=i-1;l>0;l-=2)for(l===6&&l--;;){for(let a=0;a<2;a++)if(!t.isReserved(r,l-a)){let d=!1;s<e.length&&(d=(e[s]>>>n&1)===1),t.set(r,l-a,d),n--,n===-1&&(s++,n=7)}if(r+=o,r<0||i<=r){r-=o,o=-o;break}}}function Nt(t,e,i){const o=new pt;i.forEach(function(a){o.put(a.mode.bit,4),o.put(a.getLength(),St.getCharCountIndicator(a.mode,t)),a.write(o)});const r=Z.getSymbolTotalCodewords(t),n=ae.getTotalCodewordsCount(t,e),s=(r-n)*8;for(o.getLengthInBits()+4<=s&&o.put(0,4);o.getLengthInBits()%8!==0;)o.putBit(0);const l=(s-o.getLengthInBits())/8;for(let a=0;a<l;a++)o.put(a%2?17:236,8);return Bt(o,t,e)}function Bt(t,e,i){const o=Z.getSymbolTotalCodewords(e),r=ae.getTotalCodewordsCount(e,i),n=o-r,s=ae.getBlocksCount(e,i),l=o%s,a=s-l,d=Math.floor(o/s),u=Math.floor(n/s),x=u+1,m=d-u,g=new Ct(m);let y=0;const w=new Array(s),v=new Array(s);let p=0;const b=new Uint8Array(t.buffer);for(let T=0;T<s;T++){const I=T<a?u:x;w[T]=b.slice(y,y+I),v[T]=g.encode(w[T]),y+=I,p=Math.max(p,I)}const c=new Uint8Array(o);let h=0,C,S;for(C=0;C<p;C++)for(S=0;S<s;S++)C<w[S].length&&(c[h++]=w[S][C]);for(C=0;C<m;C++)for(S=0;S<s;S++)c[h++]=v[S][C];return c}function At(t,e,i,o){let r;if(Array.isArray(t))r=re.fromArray(t);else if(typeof t=="string"){let d=e;if(!d){const u=re.rawSplit(t);d=G.getBestVersionForData(u,i)}r=re.fromString(t,d||40)}else throw new Error("Invalid data");const n=G.getBestVersionForData(r,i);if(!n)throw new Error("The amount of data is too big to be stored in a QR Code");if(!e)e=n;else if(e<n)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+n+`.
`);const s=Nt(e,i,r),l=Z.getSymbolSize(e),a=new yt(l);return Tt(a,e),vt(a),Et(a,e),ne(a,i,0),e>=7&&It(a,e),Pt(a,s),isNaN(o)&&(o=se.getBestMask(a,ne.bind(null,a,i))),se.applyMask(o,a),ne(a,i,o),{modules:a,version:e,errorCorrectionLevel:i,maskPattern:o,segments:r}}xe.create=function(e,i){if(typeof e>"u"||e==="")throw new Error("No input text");let o=te.M,r,n;return typeof i<"u"&&(o=te.from(i.errorCorrectionLevel,te.M),r=G.from(i.version),n=se.from(i.maskPattern),i.toSJISFunc&&Z.setToSJISFunction(i.toSJISFunc)),At(e,r,o,n)};var Me={},ge={};(function(t){function e(i){if(typeof i=="number"&&(i=i.toString()),typeof i!="string")throw new Error("Color should be defined as hex string");let o=i.slice().replace("#","").split("");if(o.length<3||o.length===5||o.length>8)throw new Error("Invalid hex color: "+i);(o.length===3||o.length===4)&&(o=Array.prototype.concat.apply([],o.map(function(n){return[n,n]}))),o.length===6&&o.push("F","F");const r=parseInt(o.join(""),16);return{r:r>>24&255,g:r>>16&255,b:r>>8&255,a:r&255,hex:"#"+o.slice(0,6).join("")}}t.getOptions=function(o){o||(o={}),o.color||(o.color={});const r=typeof o.margin>"u"||o.margin===null||o.margin<0?4:o.margin,n=o.width&&o.width>=21?o.width:void 0,s=o.scale||4;return{width:n,scale:n?4:s,margin:r,color:{dark:e(o.color.dark||"#000000ff"),light:e(o.color.light||"#ffffffff")},type:o.type,rendererOpts:o.rendererOpts||{}}},t.getScale=function(o,r){return r.width&&r.width>=o+r.margin*2?r.width/(o+r.margin*2):r.scale},t.getImageWidth=function(o,r){const n=t.getScale(o,r);return Math.floor((o+r.margin*2)*n)},t.qrToImageData=function(o,r,n){const s=r.modules.size,l=r.modules.data,a=t.getScale(s,n),d=Math.floor((s+n.margin*2)*a),u=n.margin*a,x=[n.color.light,n.color.dark];for(let m=0;m<d;m++)for(let g=0;g<d;g++){let y=(m*d+g)*4,w=n.color.light;if(m>=u&&g>=u&&m<d-u&&g<d-u){const v=Math.floor((m-u)/a),p=Math.floor((g-u)/a);w=x[l[v*s+p]?1:0]}o[y++]=w.r,o[y++]=w.g,o[y++]=w.b,o[y]=w.a}}})(ge);(function(t){const e=ge;function i(r,n,s){r.clearRect(0,0,n.width,n.height),n.style||(n.style={}),n.height=s,n.width=s,n.style.height=s+"px",n.style.width=s+"px"}function o(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}t.render=function(n,s,l){let a=l,d=s;typeof a>"u"&&(!s||!s.getContext)&&(a=s,s=void 0),s||(d=o()),a=e.getOptions(a);const u=e.getImageWidth(n.modules.size,a),x=d.getContext("2d"),m=x.createImageData(u,u);return e.qrToImageData(m.data,n,a),i(x,d,u),x.putImageData(m,0,0),d},t.renderToDataURL=function(n,s,l){let a=l;typeof a>"u"&&(!s||!s.getContext)&&(a=s,s=void 0),a||(a={});const d=t.render(n,s,a),u=a.type||"image/png",x=a.rendererOpts||{};return d.toDataURL(u,x.quality)}})(Me);var Ue={};const Lt=ge;function be(t,e){const i=t.a/255,o=e+'="'+t.hex+'"';return i<1?o+" "+e+'-opacity="'+i.toFixed(2).slice(1)+'"':o}function oe(t,e,i){let o=t+e;return typeof i<"u"&&(o+=" "+i),o}function kt(t,e,i){let o="",r=0,n=!1,s=0;for(let l=0;l<t.length;l++){const a=Math.floor(l%e),d=Math.floor(l/e);!a&&!n&&(n=!0),t[l]?(s++,l>0&&a>0&&t[l-1]||(o+=n?oe("M",a+i,.5+d+i):oe("m",r,0),r=0,n=!1),a+1<e&&t[l+1]||(o+=oe("h",s),s=0)):r++}return o}Ue.render=function(e,i,o){const r=Lt.getOptions(i),n=e.modules.size,s=e.modules.data,l=n+r.margin*2,a=r.color.light.a?"<path "+be(r.color.light,"fill")+' d="M0 0h'+l+"v"+l+'H0z"/>':"",d="<path "+be(r.color.dark,"stroke")+' d="'+kt(s,n,r.margin)+'"/>',u='viewBox="0 0 '+l+" "+l+'"',m='<svg xmlns="http://www.w3.org/2000/svg" '+(r.width?'width="'+r.width+'" height="'+r.width+'" ':"")+u+' shape-rendering="crispEdges">'+a+d+`</svg>
`;return typeof o=="function"&&o(null,m),m};const Dt=Ge,le=xe,Re=Me,Mt=Ue;function fe(t,e,i,o,r){const n=[].slice.call(arguments,1),s=n.length,l=typeof n[s-1]=="function";if(!l&&!Dt())throw new Error("Callback required as last argument");if(l){if(s<2)throw new Error("Too few arguments provided");s===2?(r=i,i=e,e=o=void 0):s===3&&(e.getContext&&typeof r>"u"?(r=o,o=void 0):(r=o,o=i,i=e,e=void 0))}else{if(s<1)throw new Error("Too few arguments provided");return s===1?(i=e,e=o=void 0):s===2&&!e.getContext&&(o=i,i=e,e=void 0),new Promise(function(a,d){try{const u=le.create(i,o);a(t(u,e,o))}catch(u){d(u)}})}try{const a=le.create(i,o);r(null,t(a,e,o))}catch(a){r(a)}}V.create=le.create;V.toCanvas=fe.bind(null,Re.render);V.toDataURL=fe.bind(null,Re.renderToDataURL);V.toString=fe.bind(null,function(t,e,i){return Mt.render(t,i)});const H={android:{label:"Android (Kotlin)",language:"kotlin",code:`// --- layout/activity_totp.xml ---
/*
<LinearLayout ... android:orientation="vertical" android:gravity="center">
    <!-- Code Display -->
    <TextView
        android:id="@+id/tvCode"
        android:textSize="48sp"
        android:text="000 000" ... />

    <!-- Countdown Progress -->
    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressButtonStyleHorizontal"
        android:max="3000" ... />
</LinearLayout>
*/

// --- TotpActivity.kt ---
import android.os.Handler
import android.os.Looper
// ... imports

class TotpActivity : AppCompatActivity() {
    private val handler = Handler(Looper.getMainLooper())
    private val secret = "JBSWY3DPEHPK3PXP" // Example

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_totp)
        startTimer()
    }

    private fun startTimer() {
        val runnable = object : Runnable {
            override fun run() {
                updateUI()
                handler.postDelayed(this, 100)
            }
        }
        handler.post(runnable)
    }

    private fun updateUI() {
        // Logic from previous step
        val code = generateTOTP(secret) 
        
        // Update Text
        binding.tvCode.text = "\${code.substring(0, 3)} \${code.substring(3)}"
        
        // Update Progress (30s window)
        // Use UTC time for consistency
        val calendar = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone("UTC"))
        val epoch = calendar.timeInMillis
        val millisLeft = 30000 - (epoch % 30000)
        binding.progressBar.progress = (millisLeft / 10).toInt()
    }
}`},androidJava:{label:"Android (Java)",language:"java",code:`// Build.gradle
// implementation 'commons-codec:commons-codec:1.15'

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import org.apache.commons.codec.binary.Base32;
import java.nio.ByteBuffer;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class TotpActivity extends AppCompatActivity {
    private TextView tvCode;
    private ProgressBar progressBar;
    private final String secret = "JBSWY3DPEHPK3PXP";
    private final Handler handler = new Handler(Looper.getMainLooper());
    private Runnable timerRunnable;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_totp);
        
        tvCode = findViewById(R.id.tvCode);
        progressBar = findViewById(R.id.progressBar);
        
        startTimer();
    }

    private void startTimer() {
        timerRunnable = new Runnable() {
            @Override
            public void run() {
                updateUI();
                handler.postDelayed(this, 100);
            }
        };
        handler.post(timerRunnable);
    }

    private void updateUI() {
        try {
            // Ensure UTC time
            java.util.Calendar calendar = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone("UTC"));
            long now = calendar.getTimeInMillis();
            
            String code = generateTOTP(secret, now);
            
            // Format 000 000
            tvCode.setText(code.substring(0, 3) + " " + code.substring(3));
            
            // Progress
            long millisLeft = 30000 - (now % 30000);
            progressBar.setProgress((int)(millisLeft / 10)); // Max 3000
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String generateTOTP(String secret, long time) throws Exception {
        Base32 base32 = new Base32();
        byte[] bytes = base32.decode(secret);
        long timeWindow = time / 30000;
        
        byte[] data = ByteBuffer.allocate(8).putLong(timeWindow).array();
        SecretKeySpec signKey = new SecretKeySpec(bytes, "HmacSHA1");
        Mac mac = Mac.getInstance("HmacSHA1");
        mac.init(signKey);
        byte[] hash = mac.doFinal(data);

        int offset = hash[hash.length - 1] & 0xF;
        long truncatedHash = 0;
        for (int i = 0; i < 4; ++i) {
            truncatedHash <<= 8;
            truncatedHash |= (hash[offset + i] & 0xFF);
        }
        truncatedHash &= 0x7FFFFFFF;
        long otp = truncatedHash % 1000000;
        
        return String.format("%06d", otp); // 6 Digits
    }
}`},ios:{label:"iOS (SwiftUI)",language:"swift",code:`import SwiftUI
import SwiftOTP

struct TotpView: View {
    let secret: String = "JBSWY3DPEHPK3PXP"
    @State private var code: String = "000 000"
    @State private var progress: Double = 1.0
    
    let timer = Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
    
    var body: some View {
        VStack(spacing: 20) {
            // Code Display
            Text(code)
                .font(.system(size: 48, weight: .bold, design: .monospaced))
                
            // Countdown Circle
            ZStack {
                Circle()
                    .stroke(lineWidth: 10)
                    .opacity(0.3)
                    .foregroundColor(.blue)
                
                Circle()
                    .trim(from: 0.0, to: CGFloat(progress))
                    .stroke(style: StrokeStyle(lineWidth: 10, lineCap: .round, lineJoin: .round))
                    .foregroundColor(.blue)
                    .rotationEffect(Angle(degrees: 270.0))
                    .animation(.linear, value: progress)
            }
            .frame(width: 100, height: 100)
        }
        .onReceive(timer) { _ in
            updateTOTP()
        }
        .onAppear { updateTOTP() }
    }
    
    func updateTOTP() {
        // Generate logic
        if let data = base32DecodeToData(secret),
           let totp = TOTP(secret: data, digits: 6, timeInterval: 30, algorithm: .sha1) {
            
            let newCode = totp.generate(time: Date()) ?? "Error"
            // Format 000 000
            let prefix = newCode.prefix(3)
            let suffix = newCode.suffix(3)
            self.code = "(prefix) (suffix)"
            
            // Update Progress
            // Date() yields UTC interval since 1970
            let epoch = Date().timeIntervalSince1970
            let timeLeft = 30.0 - fmod(epoch, 30.0)
            self.progress = timeLeft / 30.0
        }
    }
}`},iosUIKit:{label:"iOS (UIKit)",language:"swift",code:`import UIKit
import SwiftOTP

class TotpViewController: UIViewController {

    // Connect via Storyboard or standard init
    @IBOutlet weak var codeLabel: UILabel!
    @IBOutlet weak var progressView: UIProgressView!
    
    let secret = "JBSWY3DPEHPK3PXP"
    var timer: Timer?

    override func viewDidLoad() {
        super.viewDidLoad()
        // Start Timer
        timer = Timer.scheduledTimer(
            timeInterval: 0.1, 
            target: self, 
            selector: #selector(updateUI), 
            userInfo: nil, 
            repeats: true
        )
        updateUI()
    }
    
    deinit {
        timer?.invalidate()
    }

    @objc func updateUI() {
        guard let data = base32DecodeToData(secret),
              let totp = TOTP(secret: data, digits: 6, timeInterval: 30, algorithm: .sha1) else { return }
        
        // 1. Generate Code
        if let newCode = totp.generate(time: Date()) {
            let prefix = newCode.prefix(3)
            let suffix = newCode.suffix(3)
            codeLabel.text = "\\(prefix) \\(suffix)"
        }
        
        // 2. Update Progress
        // Date() is UTC
        let epoch = Date().timeIntervalSince1970
        let timeLeft = 30.0 - fmod(epoch, 30.0)
        progressView.setProgress(Float(timeLeft / 30.0), animated: true)
    }
}`},iosObjc:{label:"iOS (Obj-C)",language:"objectivec",code:`// ViewController.m
#import "ViewController.h"
#import <CommonCrypto/CommonHMAC.h>

@interface ViewController ()
@property (weak, nonatomic) IBOutlet UILabel *codeLabel;
@property (weak, nonatomic) IBOutlet UIProgressView *progressView;
@property (nonatomic, strong) NSTimer *timer;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.timer = [NSTimer scheduledTimerWithTimeInterval:0.1 
                                                  target:self 
                                                selector:@selector(updateUI) 
                                                userInfo:nil 
                                                 repeats:YES];
    [self updateUI];
}

- (void)updateUI {
    NSString *secret = @"JBSWY3DPEHPK3PXP";
    NSString *code = [self generateTOTP:secret];
    
    // Format 000 000
    if (code.length == 6) {
        NSString *prefix = [code substringToIndex:3];
        NSString *suffix = [code substringFromIndex:3];
        self.codeLabel.text = [NSString stringWithFormat:@"%@ %@", prefix, suffix];
    }
    
    // Progress
    // NSDate gives UTC timestamp
    NSTimeInterval epoch = [[NSDate date] timeIntervalSince1970];
    double timeLeft = 30.0 - fmod(epoch, 30.0);
    [self.progressView setProgress:(timeLeft / 30.0) animated:YES];
}

- (NSString *)generateTOTP:(NSString *)secret {
    // Note: You need a Base32 decode helper here. 
    // This is raw logic for demo purposes.
    
    // For demo, assume secretData is valid logic from a helper
    NSData *secretData = [secret dataUsingEncoding:NSASCIIStringEncoding]; // Placeholder: Use real Base32 decode
    if (!secretData) return nil;
    
    uint64_t time = (uint64_t)([[NSDate date] timeIntervalSince1970] / 30.0);
    time = NSSwapHostLongLongToBig(time);
    NSData *timeData = [NSData dataWithBytes:&time length:sizeof(time)];
    
    uint8_t hash[CC_SHA1_DIGEST_LENGTH];
    CCHmac(kCCHmacAlgSHA1, secretData.bytes, secretData.length, timeData.bytes, timeData.length, hash);
    
    int offset = hash[CC_SHA1_DIGEST_LENGTH - 1] & 0x0F;
    int binary = ((hash[offset] & 0x7f) << 24) |
                 ((hash[offset + 1] & 0xff) << 16) |
                 ((hash[offset + 2] & 0xff) << 8) |
                 (hash[offset + 3] & 0xff);
                 
    int otp = binary % 1000000;
    return [NSString stringWithFormat:@"%06d", otp]; // 6 Digits
}
@end`},flutter:{label:"Flutter (Dart)",language:"dart",code:`import 'package:flutter/material.dart';
import 'package:otp/otp.dart';
import 'dart:async';

class TotpScreen extends StatefulWidget {
  @override
  _TotpScreenState createState() => _TotpScreenState();
}

class _TotpScreenState extends State<TotpScreen> {
  String _secret = "JBSWY3DPEHPK3PXP";
  String _code = "000 000";
  double _progress = 1.0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(Duration(milliseconds: 100), (timer) => _update());
    _update();
  }

  void _update() {
    // Ensure UTC Time
    final now = DateTime.now().toUtc().millisecondsSinceEpoch;
    
    // Generate Code
    final rawCode = OTP.generateTOTPCodeString(
      _secret, now, 
      interval: 30, algorithm: Algorithm.SHA1, length: 6, isGoogle: true
    );
    
    // Update State
    setState(() {
      _code = "\${rawCode.substring(0, 3)} \${rawCode.substring(3)}";
      
      final timeLeft = 30000 - (now % 30000);
      _progress = timeLeft / 30000.0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(_code, style: TextStyle(fontSize: 48, fontWeight: FontWeight.bold)),
            SizedBox(height: 20),
            CircularProgressIndicator(
              value: _progress, 
              strokeWidth: 8,
            ),
            SizedBox(height: 10),
            Text("\${(_progress * 30).toInt()}s"),
          ],
        ),
      ),
    );
  }
}`},reactNative:{label:"React Native (JS)",language:"javascript",code:`import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as OTPAuth from 'otpauth';

// npm install react-native-progress

export default function TotpScreen() {
  const [code, setCode] = useState("000 000");
  const [timeLeft, setTimeLeft] = useState(30);
  const secret = "JBSWY3DPEHPK3PXP";

  useEffect(() => {
    const timer = setInterval(() => {
        const totp = new OTPAuth.TOTP({
            algorithm: 'SHA1', digits: 6, period: 30,
            secret: OTPAuth.Secret.fromBase32(secret)
        });
        
        const raw = totp.generate();
        setCode(\`\${raw.slice(0,3)} \${raw.slice(3)}\`);
        
        // Date.now() returns UTC timestamp
        const epoch = Math.floor(Date.now() / 1000);
        setTimeLeft(30 - (epoch % 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.code}>{code}</Text>
      <View style={styles.progressContainer}>
        {/* Simple Text Progress for demo */}
        <Text style={styles.timer}>{timeLeft}s</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  code: { fontSize: 48, fontWeight: 'bold' },
  timer: { fontSize: 20, color: 'gray' }
});`},react:{label:"React (TS)",language:"typescript",code:`import React, { useState, useEffect } from 'react';
import * as OTPAuth from 'otpauth';

export const TotpDisplay = ({ secret }: { secret: string }) => {
  const [code, setCode] = useState("000 000");
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const tick = () => {
      // 1. Generate
      const totp = new OTPAuth.TOTP({
        algorithm: 'SHA1', digits: 6, period: 30,
        secret: OTPAuth.Secret.fromBase32(secret)
      });
      const raw = totp.generate();
      setCode(\`\${raw.slice(0,3)} \${raw.slice(3)}\`);

      // 2. Progress (Date.now() is UTC)
      const epoch = Date.now();
      const left = 30000 - (epoch % 30000);
      setProgress((left / 30000) * 100);
    };

    tick();
    const timer = setInterval(tick, 100);
    return () => clearInterval(timer);
  }, [secret]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-4xl font-mono font-bold">{code}</div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-100 ease-linear" 
            style={{ width: \`\${progress}%\` }}
        ></div>
      </div>
    </div>
  );
};`},vue:{label:"Vue (TS)",language:"html",code:`<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as OTPAuth from 'otpauth';

const secret = "JBSWY3DPEHPK3PXP";
const code = ref("000 000");
const progress = ref(100);
let timer: number;

const update = () => {
  const totp = new OTPAuth.TOTP({
    algorithm: 'SHA1', digits: 6, period: 30,
    secret: OTPAuth.Secret.fromBase32(secret)
  });
  
  const raw = totp.generate();
  code.value = \`\${raw.slice(0, 3)} \${raw.slice(3)}\`;

  // Use UTC timestamp
  const epoch = Date.now();
  const msLeft = 30000 - (epoch % 30000);
  progress.value = (msLeft / 30000) * 100;
};

onMounted(() => {
  update();
  timer = setInterval(update, 100);
});

onUnmounted(() => {
  clearInterval(timer);
});
<\/script>

<template>
  <div class="totp-container">
    <div class="code">{{ code }}</div>
    <div class="progress-track">
      <div 
        class="progress-fill" 
        :style="{ width: progress + '%' }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.totp-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.code {
  font-size: 2.5rem;
  font-family: monospace;
  font-weight: bold;
}
.progress-track {
  width: 100%;
  height: 10px;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background-color: #2563eb;
  transition: width 0.1s linear;
}
</style>`},angular:{label:"Angular",language:"typescript",code:`// totp.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as OTPAuth from 'otpauth';

@Component({
  selector: 'app-totp',
  template: \`
    <div class="totp-container">
      <h1 class="code">{{ code }}</h1>
      <div class="progress-bar">
        <div class="fill" [style.width.%]="progress"></div>
      </div>
      <p>{{ timeLeft }}s</p>
    </div>
  \`,
  styles: [\`
    .code { font-size: 3rem; font-family: monospace; }
    .progress-bar { width: 100%; height: 10px; background: #eee; }
    .fill { height: 100%; background: blue; transition: width 0.1s linear; }
  \`]
})
export class TotpComponent implements OnInit, OnDestroy {
  secret = "JBSWY3DPEHPK3PXP";
  code = "000 000";
  progress = 100;
  timeLeft = 30;
  private intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => this.update(), 100);
    this.update();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  update() {
    // Generate
    const totp = new OTPAuth.TOTP({
       secret: OTPAuth.Secret.fromBase32(this.secret),
       digits: 6, period: 30
    });
    const raw = totp.generate();
    this.code = \`\${raw.slice(0, 3)} \${raw.slice(3)}\`;

    // Timer (Date.now() is UTC)
    const epoch = Date.now();
    const msLeft = 30000 - (epoch % 30000);
    this.progress = (msLeft / 30000) * 100;
    this.timeLeft = Math.ceil(msLeft / 1000);
  }
}`}},Ce="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",je={};for(let t=0;t<Ce.length;t++)je[Ce[t]]=t;const Ut=t=>{let e="",i="";const o=t.toUpperCase().replace(/=+$/,"");for(let r=0;r<o.length;r++){const n=je[o[r]];n!==void 0&&(e+=n.toString(2).padStart(5,"0"))}for(let r=0;r+4<=e.length;r+=4){const n=e.substr(r,4);i+=parseInt(n,2).toString(16)}return i},Rt=(t,e=30)=>{try{const i=Ut(t);if(!i)return{code:"------",timeLeft:e};const o=Math.round(new Date().getTime()/1e3);let n=Math.floor(o/e).toString(16).toUpperCase();for(;n.length<16;)n="0"+n;const s=K.enc.Hex.parse(n),l=K.enc.Hex.parse(i),d=K.HmacSHA1(s,l).toString(K.enc.Hex),u=parseInt(d.substring(d.length-1),16);let g=(((parseInt(d.substr(u*2,2),16)&127)<<24|(parseInt(d.substr(u*2+2,2),16)&255)<<16|(parseInt(d.substr(u*2+4,2),16)&255)<<8|parseInt(d.substr(u*2+6,2),16)&255)%1e6).toString();for(;g.length<6;)g="0"+g;const y=e-o%e;return{code:g,timeLeft:y}}catch{return{code:"Error",timeLeft:0}}},Jt=()=>{const{t}=Je(),[e,i]=N.useState(""),[o,r]=N.useState(""),[n,s]=N.useState("MyApp"),[l,a]=N.useState("000 000"),[d,u]=N.useState(30),[x,m]=N.useState(!1),[g,y]=N.useState(null),[w,v]=N.useState("android");N.useEffect(()=>{if(!e){a("------"),u(30);return}const c=()=>{const{code:C,timeLeft:S}=Rt(e),T=C.length===6?`${C.slice(0,3)} ${C.slice(3)}`:C;a(T),u(S)};c();const h=setInterval(c,1e3);return()=>clearInterval(h)},[e]),N.useEffect(()=>{if(!e||!o){y(null);return}const h=`otpauth://totp/${n?`${n}:${o}`:o}?secret=${e}&issuer=${n||""}`;V.toDataURL(h,{width:200,margin:1},(C,S)=>{C||y(S)})},[e,o,n]);const p=()=>{const c=l.replace(" ","");!c||c==="------"||(navigator.clipboard.writeText(c),m(!0),setTimeout(()=>m(!1),2e3))},b=d/30*100;return f.jsxs("div",{className:"flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full",children:[f.jsxs("div",{className:"flex flex-col gap-2 text-center items-center",children:[f.jsx("div",{className:"p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-2",children:f.jsx(_e,{size:32})}),f.jsx("h1",{className:"text-2xl font-bold text-gray-900 dark:text-white",children:t("totp.title","TOTP Generator")}),f.jsx("p",{className:"text-gray-600 dark:text-gray-400 max-w-md",children:t("totp.description","Generate 2FA codes manually by entering your secret key. Useful for testing or recovery.")})]}),f.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 items-start",children:[f.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-6",children:[f.jsx("h2",{className:"text-lg font-semibold text-gray-800 dark:text-white",children:"Configuration"}),f.jsxs("div",{className:"flex flex-col gap-2",children:[f.jsx("label",{className:"text-sm font-medium text-gray-700 dark:text-gray-300",children:t("totp.secretLabel","Secret Key (Base32)")}),f.jsx("input",{type:"text",value:e,onChange:c=>i(c.target.value.replace(/\s/g,"").toUpperCase()),placeholder:"JBSWY3DPEHPK3PXP",className:"w-full px-4 py-2 font-mono bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase text-gray-900 dark:text-white"}),f.jsxs("p",{className:"text-xs text-gray-500 flex items-center gap-1",children:[f.jsx(He,{size:12}),t("totp.secretHint","Enter the key provided by the service.")]})]}),f.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[f.jsxs("div",{className:"flex flex-col gap-2",children:[f.jsx("label",{className:"text-sm font-medium text-gray-700 dark:text-gray-300",children:"Account Name"}),f.jsx("input",{type:"text",value:o,onChange:c=>r(c.target.value),placeholder:"user@example.com",className:"w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"})]}),f.jsxs("div",{className:"flex flex-col gap-2",children:[f.jsx("label",{className:"text-sm font-medium text-gray-700 dark:text-gray-300",children:"Issuer"}),f.jsx("input",{type:"text",value:n,onChange:c=>s(c.target.value),placeholder:"MyApp",className:"w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"})]})]})]}),f.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center gap-6",children:[f.jsxs("div",{className:"flex flex-col items-center gap-4 w-full",children:[f.jsxs("div",{className:"relative w-24 h-24 flex items-center justify-center",children:[f.jsxs("svg",{className:"absolute w-full h-full transform -rotate-90",children:[f.jsx("circle",{cx:"48",cy:"48",r:"44",fill:"none",stroke:"currentColor",strokeWidth:"6",className:"text-gray-100 dark:text-gray-700"}),f.jsx("circle",{cx:"48",cy:"48",r:"44",fill:"none",stroke:d<5?"#ef4444":"#3b82f6",strokeWidth:"6",strokeDasharray:276,strokeDashoffset:276-276*b/100,className:"transition-all duration-1000 ease-linear",strokeLinecap:"round"})]}),f.jsxs("span",{className:`text-2xl font-bold font-mono ${d<5?"text-red-500":"text-gray-700 dark:text-gray-300"}`,children:[d,"s"]})]}),f.jsxs("div",{onClick:p,className:"group relative cursor-pointer flex items-center gap-4 bg-gray-50 dark:bg-gray-900 px-8 py-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-colors",children:[f.jsx("span",{className:"text-4xl font-mono font-bold tracking-wider text-gray-800 dark:text-gray-100",children:l}),f.jsx("div",{className:"absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",children:x?f.jsx(Fe,{className:"text-green-500",size:16}):f.jsx(he,{className:"text-gray-400",size:16})})]})]}),g?f.jsxs("div",{className:"flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-dashed border-gray-300",children:[f.jsx("img",{src:g,alt:"TOTP QR Code",className:"w-40 h-40 mix-blend-multiply"}),f.jsx("p",{className:"text-xs text-gray-500",children:"Scan with Authenticator App"})]}):f.jsxs("div",{className:"flex flex-col items-center gap-2 p-4 w-full rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-400",children:[f.jsx(Oe,{size:40,className:"opacity-20"}),f.jsx("p",{className:"text-xs text-center",children:"Fill Secret & Account to generate QR"})]})]})]}),f.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden",children:[f.jsx("div",{className:"px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center",children:f.jsxs("h2",{className:"font-semibold text-gray-800 dark:text-white flex items-center gap-2",children:[f.jsx(me,{size:20,className:"text-blue-500"}),"Sample Implementations"]})}),f.jsx("div",{className:"flex w-full overflow-x-auto gap-2 p-2 bg-gray-50/50 dark:bg-gray-900/30 scrollbar-none",children:Object.entries(H).map(([c,h])=>{const C=c.includes("android")?pe:c.includes("ios")?Ve:c==="flutter"||c==="reactNative"?pe:["react","vue","angular"].includes(c)?ze:me;return f.jsxs("button",{onClick:()=>v(c),className:Ye("flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",w===c?"bg-blue-600 text-white shadow-md shadow-blue-500/20 transform scale-105":"bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300"),children:[f.jsx(C,{size:16,className:w===c?"text-white":"text-gray-400"}),h.label]},c)})}),f.jsxs("div",{className:"relative bg-[#1e1e1e] group border-t border-gray-800",children:[f.jsxs("div",{className:"absolute top-0 right-0 p-2 flex items-center gap-2 z-10",children:[f.jsx("span",{className:"text-xs text-gray-500 font-mono px-2 py-1",children:H[w].language}),f.jsx("button",{onClick:()=>{navigator.clipboard.writeText(H[w].code);const c=document.getElementById("code-copy-btn");c&&(c.innerHTML='<span class="text-green-400 text-xs font-bold px-2">Copied!</span>',setTimeout(()=>{c.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy text-gray-400"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'},2e3))},id:"code-copy-btn",className:"p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg hover:bg-gray-700 border border-gray-700/50 transition-all shadow-lg",title:"Copy Code",children:f.jsx(he,{size:16,className:"text-gray-400"})})]}),f.jsx("div",{className:"max-h-[500px] overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pt-8",children:f.jsx(Ke,{language:H[w].language,style:We,customStyle:{margin:0,borderRadius:0,padding:"1.5rem",fontSize:"13px",background:"transparent",minHeight:"100%"},showLineNumbers:!0,wrapLines:!0,children:H[w].code})})]})]}),f.jsx("div",{className:"h-8 shrink-0"})]})};export{Jt as TotpGenerator};
