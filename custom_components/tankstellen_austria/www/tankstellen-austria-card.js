/*! Tankstellen Austria Card — bundled by Rolldown. Edit sources in src/, then `npm run build`. */
var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r};
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const n=globalThis,r=n.ShadowRoot&&(n.ShadyCSS===void 0||n.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,i=Symbol(),a=new WeakMap;var o=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(r&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=a.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&a.set(t,e))}return e}toString(){return this.cssText}};const s=e=>new o(typeof e==`string`?e:e+``,void 0,i),c=(e,...t)=>new o(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,i),l=(e,t)=>{if(r)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let r of t){let t=document.createElement(`style`),i=n.litNonce;i!==void 0&&t.setAttribute(`nonce`,i),t.textContent=r.cssText,e.appendChild(t)}},u=r?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return s(t)})(e):e,{is:d,defineProperty:f,getOwnPropertyDescriptor:p,getOwnPropertyNames:m,getOwnPropertySymbols:h,getPrototypeOf:g}=Object,_=globalThis,v=_.trustedTypes,y=v?v.emptyScript:``,b=_.reactiveElementPolyfillSupport,x=(e,t)=>e,S={toAttribute(e,t){
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
switch(t){case Boolean:e=e?y:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},C=(e,t)=>!d(e,t),w={attribute:!0,type:String,converter:S,reflect:!1,useDefault:!1,hasChanged:C};Symbol.metadata??=Symbol(`metadata`),_.litPropertyMetadata??=new WeakMap;var T=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&f(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=p(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(x(`elementProperties`)))return;let e=g(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(x(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(x(`properties`))){let e=this.properties,t=[...m(e),...h(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(u(e))}else e!==void 0&&t.push(u(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return l(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?S:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?S:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??C)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};T.elementStyles=[],T.shadowRootOptions={mode:`open`},T[x(`elementProperties`)]=new Map,T[x(`finalized`)]=new Map,b?.({ReactiveElement:T}),(_.reactiveElementVersions??=[]).push(`2.1.2`);
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const E=globalThis,D=e=>e,O=E.trustedTypes,ee=O?O.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,k=`$lit$`,A=`lit$${Math.random().toFixed(9).slice(2)}$`,te=`?`+A,ne=`<${te}>`,j=document,M=()=>j.createComment(``),N=e=>e===null||typeof e!=`object`&&typeof e!=`function`,re=Array.isArray,ie=e=>re(e)||typeof e?.[Symbol.iterator]==`function`,ae=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,oe=/-->/g,se=/>/g,F=RegExp(`>|${ae}(?:([^\\s"'>=/]+)(${ae}*=${ae}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),ce=/'/g,le=/"/g,ue=/^(?:script|style|textarea|title)$/i,de=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),I=de(1),L=de(2),R=Symbol.for(`lit-noChange`),z=Symbol.for(`lit-nothing`),fe=new WeakMap,B=j.createTreeWalker(j,129);function pe(e,t){if(!re(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return ee===void 0?t:ee.createHTML(t)}const me=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=P;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===P?c[1]===`!--`?o=oe:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=F):(ue.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=F):o=se:o===F?c[0]===`>`?(o=i??P,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?F:c[3]===`"`?le:ce):o===le||o===ce?o=F:o===oe||o===se?o=P:(o=F,i=void 0);let d=o===F&&e[t+1].startsWith(`/>`)?` `:``;a+=o===P?n+ne:l>=0?(r.push(s),n.slice(0,l)+k+n.slice(l)+A+d):n+A+(l===-2?t:d)}return[pe(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]};var he=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=me(t,n);if(this.el=e.createElement(l,r),B.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=B.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(k)){let t=u[o++],n=i.getAttribute(e).split(A),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?ye:r[1]===`?`?be:r[1]===`@`?xe:ve}),i.removeAttribute(e)}else e.startsWith(A)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(ue.test(i.tagName)){let e=i.textContent.split(A),t=e.length-1;if(t>0){i.textContent=O?O.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],M()),B.nextNode(),c.push({type:2,index:++a});i.append(e[t],M())}}}else if(i.nodeType===8){if(i.data===te)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(A,e+1))!==-1;)c.push({type:7,index:a}),e+=A.length-1}}a++}}static createElement(e,t){let n=j.createElement(`template`);return n.innerHTML=e,n}};function V(e,t,n=e,r){if(t===R)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=N(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=V(e,i._$AS(e,t.values),i,r)),t}var ge=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??j).importNode(t,!0);B.currentNode=r;let i=B.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new _e(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Se(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=B.nextNode(),a++)}return B.currentNode=j,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},_e=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=V(this,e,t),N(e)?e===z||e==null||e===``?(this._$AH!==z&&this._$AR(),this._$AH=z):e!==this._$AH&&e!==R&&this._(e):e._$litType$===void 0?e.nodeType===void 0?ie(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==z&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(j.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=he.createElement(pe(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new ge(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=fe.get(e.strings);return t===void 0&&fe.set(e.strings,t=new he(e)),t}k(t){re(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(M()),this.O(M()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=D(e).nextSibling;D(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},ve=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=z,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=z}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=V(this,e,t,0),a=!N(e)||e!==this._$AH&&e!==R,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=V(this,r[n+o],t,o),s===R&&(s=this._$AH[o]),a||=!N(s)||s!==this._$AH[o],s===z?e=z:e!==z&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},ye=class extends ve{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===z?void 0:e}},be=class extends ve{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==z)}},xe=class extends ve{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=V(this,e,t,0)??z)===R)return;let n=this._$AH,r=e===z&&n!==z||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==z&&(n===z||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Se=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){V(this,e)}};const Ce=E.litHtmlPolyfillSupport;Ce?.(he,_e),(E.litHtmlVersions??=[]).push(`3.3.2`);const we=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new _e(t.insertBefore(M(),e),e,void 0,n??{})}return i._$AI(e),i},Te=globalThis
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
;var H=class extends T{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=we(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return R}};H._$litElement$=!0,H.finalized=!0,Te.litElementHydrateSupport?.({LitElement:H});const Ee=Te.litElementPolyfillSupport;Ee?.({LitElement:H}),(Te.litElementVersions??=[]).push(`4.2.2`);
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const De=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})},Oe={attribute:!0,type:String,converter:S,reflect:!1,hasChanged:C},ke=(e=Oe,t,n)=>{
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function Ae(e){return(t,n)=>typeof n==`object`?ke(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/function U(e){return Ae({...e,state:!0,attribute:!1})}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const je={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Me=e=>(...t)=>({_$litDirective$:e,values:t});var Ne=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/const W=Me(class extends Ne{constructor(e){if(super(e),e.type!==je.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter(t=>e[t]).join(` `)+` `}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter(e=>e!==``)));for(let e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return R}}),Pe=12e4,Fe=[`mdi:car`,`mdi:car-sports`,`mdi:car-hatchback`,`mdi:car-estate`,`mdi:car-convertible`,`mdi:car-pickup`,`mdi:car-electric`,`mdi:car-electric-outline`,`mdi:car-side`,`mdi:van-passenger`,`mdi:motorbike`,`mdi:bus`,`mdi:truck`,`mdi:rv-truck`],Ie=[`DIE`,`SUP`,`GAS`];function Le(e){if(!e||typeof e!=`object`)return null;let t=e,n=typeof t.name==`string`?t.name.slice(0,50):``,r=Ie.includes(t.fuel_type)?t.fuel_type:`DIE`,i=parseInt(String(t.tank_size),10),a=Number.isFinite(i)&&i>=1?Math.min(200,i):50,o;if(t.consumption!=null){let e=parseFloat(String(t.consumption));Number.isFinite(e)&&e>=0&&(o=Math.min(30,e))}let s={name:n,fuel_type:r,tank_size:a,icon:typeof t.icon==`string`&&t.icon.startsWith(`mdi:`)?t.icon:`mdi:car`};return o!=null&&(s.consumption=o),s}function Re(e){if(!e)throw Error(`tankstellen-austria-card: config missing`);let t={...e};if(typeof t.entities==`string`&&(t.entities=[t.entities]),Array.isArray(t.entities)?t.entities=t.entities.filter(e=>typeof e==`string`&&e.includes(`.`)):t.entities!=null&&(console.warn(`[Tankstellen Austria] config.entities must be an array of entity IDs — ignoring`,t.entities),delete t.entities),t.max_stations!=null){let e=parseInt(String(t.max_stations),10);t.max_stations=Number.isFinite(e)?Math.max(0,Math.min(5,e)):5}return Array.isArray(t.payment_filter)?t.payment_filter=t.payment_filter.filter(e=>typeof e==`string`&&e.length>0):t.payment_filter!=null&&delete t.payment_filter,Array.isArray(t.cars)?t.cars=t.cars.map(e=>Le(e)).filter(e=>e!==null):t.cars!=null&&delete t.cars,t}function ze(e){return!e||!e.states?[]:Object.keys(e.states).filter(t=>{let n=e.states[t];return t.startsWith(`sensor.`)&&n?.attributes?.fuel_type&&Array.isArray(n.attributes.stations)})}function Be(e){return e?!!(e.cash||e.debit_card||e.credit_card||e.others&&e.others.length>0):!1}function Ve(e,t,n){return t===`cash`?e.cash?n?.cash??`cash`:null:t===`debit_card`?e.debit_card?n?.debit_card??`debit_card`:null:t===`credit_card`?e.credit_card?n?.credit_card??`credit_card`:null:(e.others??[]).find(e=>e.toLowerCase()===t.toLowerCase())??null}function He(e,t){if(!t||!t.length)return!0;let n=e.payment_methods??{};return t.some(e=>Ve(n,e)!==null)}function Ue(e,t,n){if(!t||!t.length)return[];let r=e.payment_methods??{},i=[];for(let e of t){let t=Ve(r,e,n);t!==null&&i.push(t)}return i}function We(e,t=new Date){if(e.open===!1)return!1;let n=e.opening_hours??[];if(!n.length)return!1;let r=t.getDay(),i=r===0?`SO`:r===6?`SA`:`MO`,a=n.find(e=>e.day===i);if(!a||!a.to||a.from===`00:00`&&a.to===`24:00`)return!1;let[o,s]=a.to.split(`:`);if(o===void 0||s===void 0)return!1;let c=parseInt(o,10),l=parseInt(s,10);if(!Number.isFinite(c)||!Number.isFinite(l))return!1;let u=new Date(t);c===0&&l===0?(u.setDate(u.getDate()+1),u.setHours(0,0,0,0)):u.setHours(c,l,0,0);let d=(u.getTime()-t.getTime())/6e4;return d>0&&d<=30}function G(e){return e==null||!Number.isFinite(Number(e))?`–`:`€ ${Number(e).toFixed(3).replace(`.`,`,`)}`}function K(e){return e==null||!Number.isFinite(Number(e))?`–`:Number(e).toFixed(3).replace(`.`,`,`)}function Ge(e){return e==null||!Number.isFinite(e)||e<0?``:e<1e3?`${Math.round(e)} m`:`${(e/1e3).toFixed(1).replace(`.`,`,`)} km`}function Ke(e,t,n=`google`){if(!e)return t?`https://www.google.com/search?q=${encodeURIComponent(t)}`:null;if(/\d/.test(e.address??``)){let t=`${e.postalCode??``} ${e.city??``} ${e.address??``}`.trim(),r=encodeURIComponent(t);return n===`apple`?`https://maps.apple.com/?q=${r}`:n===`geo`?`geo:0,0?q=${r}`:`https://maps.google.com/?q=${r}`}let r=[t,e.address,e.postalCode,e.city].filter(e=>e!=null&&e!==``);return r.length===0?null:`https://www.google.com/search?q=${encodeURIComponent(r.join(` `))}`}var qe=t({card:()=>Ye,common:()=>Je,default:()=>$e,editor:()=>Qe,fuel_types:()=>Xe,weekdays:()=>Ze}),Je={version:`Version`,invalid_configuration:`Invalid configuration`,loading:`Loading…`,no_data:`No data available`},Ye={cheapest:`Cheapest price`,average:`Avg. price`,price:`Price`,closed:`Closed`,closing_soon:`Closing soon`,open_now:`Open`,opening_hours:`Opening hours`,payment:`Payment`,cash:`Cash`,debit_card:`Debit card`,credit_card:`Credit card`,payment_filter_active:`Payment filter active`,payment_highlight_active:`Payment filter (highlight)`,mon_fri:`Mon–Fri`,sat:`Sat`,sun:`Sun`,holiday:`Holiday`,map:`Map`,per_liter:`/l`,last_7_days:`Last 7 days`,min_label:`Min`,max_label:`Max`,refresh:`Refresh`,last_updated:`Updated:`,no_new_data:`No new data`,version_update:`Tankstellen Austria updated to v{v} — please reload`,version_reload:`Reload`,version_reload_stuck:`Reload didn't load the new version. Check HACS and do a hard refresh (Ctrl+Shift+R).`,version_dismiss:`Dismiss`,fill_up:`Fill up`,best_refuel_hour:`Tip: Cheapest between {h1}:00–{h2}:00`,best_refuel_hour_weekday:`Tip: Cheapest between {h1}:00–{h2}:00, usually {day}`,not_enough_data_hint:`Not enough data yet for a tip (min. 7 days)`,confidence_high:`High`,confidence_medium:`Medium`,confidence_low:`Low`,confidence_title:`Recommendation confidence`,confidence_span:`Data span`,confidence_coverage:`Coverage`,confidence_gap:`Gap`,confidence_days:`days`,confidence_cents:`¢`,confidence_short_history_hint:`Note: Home Assistant keeps only 10 days of history by default. For better recommendations raise recorder.purge_keep_days to 30.`,median_delta_below:`{c}¢ below median`,median_delta_above:`{c}¢ above median`,median_delta_equal:`at median`,loading:`Loading…`,sparkline_open_more_info:`Open price history`,sparkline_aria_summary:`Price history last 7 days: minimum {min}, maximum {max}, median {median}`,sparkline_aria_simple:`Price history last 7 days: minimum {min}, maximum {max}`,history_fetch_error:`Couldn't load price history`},Xe={DIE:`Diesel`,SUP:`Super 95`,GAS:`CNG`},Ze=[`Sunday`,`Monday`,`Tuesday`,`Wednesday`,`Thursday`,`Friday`,`Saturday`],Qe={entities:`Sensors`,entities_hint:`Leave empty for auto-detection`,entity_missing:`Sensor {entity} no longer exists. Pick a different sensor or remove it from this card's entities list.`,max_stations:`Number of stations`,show_index:`Show rank`,show_map_links:`Show navigation links`,map_provider:`Navigation app`,map_provider_auto:`Automatic (by device)`,map_provider_google:`Always Google Maps`,map_provider_apple:`Always Apple Maps`,show_distance:`Show distance`,sort_by_distance:`Sort by distance`,show_opening_hours:`Show opening hours`,show_payment_methods:`Show payment methods`,show_history:`Show price history`,show_best_refuel:`Show refuel tip`,show_median_line:`Show 7-day median`,show_hour_envelope:`Typical hourly range (4 wk)`,show_noon_markers:`Noon reset markers`,show_minmax:`Show min/max`,recorder_hint_intro:`Home Assistant keeps only 10 days of history by default. For better recommendations, add this block to configuration.yaml and restart:`,recorder_hint_docs:`Read the recorder docs`,copy:`Copy`,copied:`Copied`,payment_filter:`Only stations with`,payment_filter_custom_placeholder:`Custom, e.g. Routex`,payment_filter_custom_hint:`Must match the API string exactly. Common values: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC`,payment_filter_add_custom:`Add custom payment method`,payment_highlight_mode:`Highlight instead of filter`,section_sensors:`Sensors`,section_display:`Display`,section_payment_filter:`Payment filter`,section_tab_labels:`Tab labels`,tab_labels_hint:`Leave empty to use the default label`,section_cars:`Cars`,show_cars:`Show fill-up costs`,show_car_fillup:`Show fill-up cost`,show_car_consumption:`Show consumption`,cars_both_off_hint:`No rows enabled. To hide cars entirely, use "Show fill-up costs" in Display options.`,car_name_placeholder:`Name (e.g. Golf TDI)`,car_tank_placeholder:`Liters`,car_consumption_placeholder:`⌀ l/100km`,car_fuel_type:`Fuel type`,car_choose_icon:`Choose icon`,car_delete:`Delete car`,add_car:`+ Add car`,copy_sensor_id:`Copy sensor ID to clipboard`,tank_size_range_error:`Please enter a value between 1 and 200 litres`,consumption_range_error:`Please enter a value between 0 and 30 l/100 km`,hide_header_price:`Hide cheapest / average price in header`,section_branding:`Branding & attribution`,section_history:`Price history`,logo_adapt_to_theme:`Adapt E-Control logo color to theme`,hide_header:`Hide header`,hide_attribution:`Hide attribution footer`},$e={common:Je,card:Ye,fuel_types:Xe,weekdays:Ze,editor:Qe},et=t({card:()=>nt,common:()=>tt,default:()=>ot,editor:()=>at,fuel_types:()=>rt,weekdays:()=>it}),tt={version:`Version`,invalid_configuration:`Ungültige Konfiguration`,loading:`Lädt…`,no_data:`Keine Daten verfügbar`},nt={cheapest:`Günstigster Preis`,average:`Ø Preis`,price:`Preis`,closed:`Geschlossen`,closing_soon:`Schließt bald`,open_now:`Geöffnet`,opening_hours:`Öffnungszeiten`,payment:`Zahlungsarten`,cash:`Bar`,debit_card:`Bankomat`,credit_card:`Kreditkarte`,payment_filter_active:`Zahlungsfilter aktiv`,payment_highlight_active:`Zahlungsfilter (Hervorhebung)`,mon_fri:`Mo–Fr`,sat:`Sa`,sun:`So`,holiday:`Feiertag`,map:`Karte`,per_liter:`/l`,last_7_days:`Letzte 7 Tage`,min_label:`Min`,max_label:`Max`,refresh:`Aktualisieren`,last_updated:`Aktualisiert:`,no_new_data:`Keine neuen Daten`,version_update:`Tankstellen Austria wurde auf v{v} aktualisiert — bitte neu laden`,version_reload:`Neu laden`,version_reload_stuck:`Neu-Laden hat die neue Version nicht geladen. In HACS prüfen und einen harten Reload (Strg+Umschalt+R) ausführen.`,version_dismiss:`Ausblenden`,fill_up:`Volltanken`,best_refuel_hour:`Tipp: Am günstigsten zwischen {h1}:00–{h2}:00`,best_refuel_hour_weekday:`Tipp: Am günstigsten zwischen {h1}:00–{h2}:00, meist {day}`,not_enough_data_hint:`Noch zu wenig Daten für Empfehlung (mind. 7 Tage)`,confidence_high:`Hoch`,confidence_medium:`Mittel`,confidence_low:`Niedrig`,confidence_title:`Empfehlungsgüte`,confidence_span:`Datenumfang`,confidence_coverage:`Abdeckung`,confidence_gap:`Vorsprung`,confidence_days:`Tage`,confidence_cents:`Cent`,confidence_short_history_hint:`Hinweis: Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen recorder.purge_keep_days auf 30 erhöhen.`,median_delta_below:`{c}¢ unter Median`,median_delta_above:`{c}¢ über Median`,median_delta_equal:`auf Median`,loading:`Wird geladen…`,sparkline_open_more_info:`Preisverlauf öffnen`,sparkline_aria_summary:`Preisverlauf der letzten 7 Tage: Minimum {min}, Maximum {max}, Median {median}`,sparkline_aria_simple:`Preisverlauf der letzten 7 Tage: Minimum {min}, Maximum {max}`,history_fetch_error:`Preisverlauf konnte nicht geladen werden`},rt={DIE:`Diesel`,SUP:`Super 95`,GAS:`CNG Erdgas`},it=[`Sonntag`,`Montag`,`Dienstag`,`Mittwoch`,`Donnerstag`,`Freitag`,`Samstag`],at={entities:`Sensoren`,entities_hint:`Leer lassen für automatische Erkennung`,entity_missing:`Sensor {entity} existiert nicht mehr. Wählen Sie einen anderen Sensor oder entfernen Sie ihn aus den Entitäten dieser Karte.`,max_stations:`Anzahl Tankstellen`,show_index:`Platzierung anzeigen`,show_map_links:`Navigations-Links anzeigen`,map_provider:`Navigations-App`,map_provider_auto:`Automatisch (je Gerät)`,map_provider_google:`Immer Google Maps`,map_provider_apple:`Immer Apple Maps`,show_distance:`Luftlinie anzeigen`,sort_by_distance:`Nach Luftlinie sortieren`,show_opening_hours:`Öffnungszeiten anzeigen`,show_payment_methods:`Zahlungsarten anzeigen`,show_history:`Preisverlauf anzeigen`,show_best_refuel:`Tank-Tipp anzeigen`,show_median_line:`7-Tage-Median einblenden`,show_hour_envelope:`Typischer Stundenverlauf (4 Wo)`,show_noon_markers:`12:00-Markierung (Preisreset)`,show_minmax:`Min/Max anzeigen`,recorder_hint_intro:`Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen diesen Block in configuration.yaml ergänzen und neu starten:`,recorder_hint_docs:`Recorder-Dokumentation lesen`,copy:`Kopieren`,copied:`Kopiert`,payment_filter:`Nur Tankstellen mit`,payment_filter_custom_placeholder:`Benutzerdefiniert, z.B. Routex`,payment_filter_custom_hint:`Der Wert muss exakt dem API-String entsprechen. Häufige Werte: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC`,payment_filter_add_custom:`Benutzerdefinierte Zahlungsmethode hinzufügen`,payment_highlight_mode:`Hervorheben statt filtern`,section_sensors:`Sensoren`,section_display:`Anzeige`,section_payment_filter:`Zahlungsfilter`,section_tab_labels:`Tab-Bezeichnungen`,tab_labels_hint:`Leer lassen, um die Standard-Bezeichnung zu verwenden`,section_cars:`Fahrzeuge`,show_cars:`Tankkosten anzeigen`,show_car_fillup:`Tankkosten anzeigen`,show_car_consumption:`Verbrauch anzeigen`,cars_both_off_hint:`Keine Zeile aktiv. Um Fahrzeuge komplett auszublenden, nutze „Tankkosten anzeigen“ in den Anzeige-Optionen.`,car_name_placeholder:`Name (z.B. Golf TDI)`,car_tank_placeholder:`Liter`,car_consumption_placeholder:`⌀ l/100km`,car_fuel_type:`Kraftstoffart`,car_choose_icon:`Symbol wählen`,car_delete:`Fahrzeug entfernen`,add_car:`+ Fahrzeug hinzufügen`,copy_sensor_id:`Sensor-ID in die Zwischenablage kopieren`,tank_size_range_error:`Bitte einen Wert zwischen 1 und 200 Litern eingeben`,consumption_range_error:`Bitte einen Wert zwischen 0 und 30 l/100 km eingeben`,hide_header_price:`Günstigster/Durchschnittspreis im Header ausblenden`,section_branding:`Branding & Quellenangabe`,section_history:`Preisverlauf`,logo_adapt_to_theme:`E-Control-Logo an Theme-Farbe anpassen`,hide_header:`Kopfzeile ausblenden`,hide_attribution:`Quellenangabe ausblenden`},ot={common:tt,card:nt,fuel_types:rt,weekdays:it,editor:at};const st=qe,q=et,ct={en:st,de:q};function J(e,t){return e.split(`.`).reduce((e,t)=>{if(e&&typeof e==`object`&&t in e)return e[t]},t)}function lt(e,t){let n=J(e,t);return typeof n==`string`?n:void 0}function ut(e){return(e.configLanguage||e.hassLanguage||`de`).replace(`-`,`_`)}function dt(e,t,n){let r=ut(t),i=lt(e,ct[r]??q);if(i===void 0&&(i=lt(e,q)),i===void 0&&(i=e),n)for(let[e,t]of Object.entries(n))i=i.replace(`{${e}}`,t);return i}function ft(e){let t=ut(e),n=J(`weekdays`,ct[t]??q);if(Array.isArray(n)&&n.every(e=>typeof e==`string`))return n;let r=J(`weekdays`,q);return Array.isArray(r)?r:[]}function pt(e,t){let n=ut(t),r=(J(`fuel_types`,ct[n]??q)??J(`fuel_types`,q))?.[e];return typeof r==`string`?r:e}const mt=new Map,ht=new Map;function gt(e){if(typeof e.lu==`number`)return Math.round(e.lu*1e3);let t=e.lu??e.last_updated??e.last_changed;return t?new Date(t).getTime():0}async function _t(e,t,n={}){if(!e?.callWS)return[];let r=ht.get(t);if(r)return r;let i=n.days??28,a=new Date,o=new Date(a.getTime()-i*24*60*60*1e3),s=(async()=>{try{let n=((await e.callWS({type:`history/history_during_period`,start_time:o.toISOString(),end_time:a.toISOString(),entity_ids:[t],minimal_response:!0,significant_changes_only:!0}))?.[t]??[]).map(e=>({time:gt(e),value:parseFloat(String(e.s??e.state??``))})).filter(e=>Number.isFinite(e.value)&&e.time>0);return mt.set(t,n),n}catch(e){return console.warn(`[Tankstellen Austria] history fetch failed for`,t,`— sparkline and best-refuel will be empty:`,e),mt.get(t)??[]}finally{ht.delete(t)}})();return ht.set(t,s),s}function vt(e){return mt.get(e)??[]}function yt(e){let t=e.length;if(t===0)return``;if(t===1)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;if(t===2)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)} L ${e[1].x.toFixed(2)} ${e[1].y.toFixed(2)}`;let n=Array(t-1);for(let r=0;r<t-1;r++){let t=e[r+1].x-e[r].x;n[r]=t===0?0:(e[r+1].y-e[r].y)/t}let r=Array(t);r[0]=n[0],r[t-1]=n[t-2];for(let e=1;e<t-1;e++)r[e]=(n[e-1]+n[e])/2;for(let e=0;e<t-1;e++){if(n[e]===0){r[e]=0,r[e+1]=0;continue}let t=r[e]/n[e],i=r[e+1]/n[e],a=t*t+i*i;if(a>9){let o=3/Math.sqrt(a);r[e]=o*t*n[e],r[e+1]=o*i*n[e]}}let i=`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;for(let n=0;n<t-1;n++){let t=e[n+1].x-e[n].x,a=e[n].x+t/3,o=e[n].y+r[n]*t/3,s=e[n+1].x-t/3,c=e[n+1].y-r[n+1]*t/3;i+=` C ${a.toFixed(2)} ${o.toFixed(2)}, ${s.toFixed(2)} ${c.toFixed(2)}, ${e[n+1].x.toFixed(2)} ${e[n+1].y.toFixed(2)}`}return i}function bt(e,t){return!e||!t||e.length<2||e.length!==t.length?``:`${yt(e)} ${yt([...t].reverse()).replace(/^M\s+([-\d.]+)\s+([-\d.]+)/,(e,t,n)=>`L ${t} ${n}`)} Z`}function Y(e,t,n){return Math.max(t,Math.min(n,e))}function X(e,t){let n=e.filter(e=>Number.isFinite(e.value)&&e.weight>0);if(n.length===0)return NaN;if(n.length===1)return n[0].value;let r=[...n].sort((e,t)=>e.value-t.value),i=r.reduce((e,t)=>e+t.weight,0),a=Y(t,0,1)*i,o=0;for(let e of r)if(o+=e.weight,o>=a)return e.value;return r[r.length-1].value}function xt(e){if(!e?.hasEnoughData||e.hour==null)return null;let t=new Date,n=new Date(t);if(e.weekday!=null){let r=(t.getDay()-e.weekday+7)%7;r===0&&t.getHours()<e.hour&&(r=7),n.setDate(n.getDate()-r)}else t.getHours()<e.hour&&n.setDate(n.getDate()-1);n.setHours(e.hour,0,0,0);let r=n.getTime();return{startMs:r,endMs:r+(((e.hour_end??(e.hour+1)%24)-e.hour+24)%24||1)*36e5}}function St(e){let t=Date.now()-6048e5,n=e.filter(e=>e.time>=t),r=e.filter(e=>e.time<t),i=r.length?r[r.length-1]:null;return i?[{time:t,value:i.value},...n]:n}function Ct(e){if(e.length<2)return null;let t=[...e].sort((e,t)=>e-t),n=(t.length-1)/2,r=(t[Math.floor(n)]+t[Math.ceil(n)])/2,i=(e[e.length-1]-r)*100,a=Math.abs(i).toFixed(1);return i<=-.05?{key:`median_delta_below`,cents:a,cls:`median-delta-good`}:i>=.05?{key:`median_delta_above`,cents:a,cls:`median-delta-bad`}:{key:`median_delta_equal`,cents:a,cls:`median-delta-neutral`}}function wt(e,t){let n=[...e].sort((e,t)=>e-t),r=(n.length-1)/2;return t((n[Math.floor(r)]+n[Math.ceil(r)])/2)}function Tt(e){let t={template:z,hoverPoints:[],medianDelta:null,viewBoxWidth:280,viewBoxHeight:48};try{let n=e.points;if(!n||n.length<2)return t;let r=St(n);if(r.length<2)return t;let i=r[r.length-1];i.time<Date.now()-18e5&&(r=[...r,{time:Date.now(),value:i.value}]);let a=r.map(e=>e.value),o=Math.min(...a),s=Math.max(...a),c=o,l=s,u=e.showHourEnvelope?e.hourEnvelope??null:null;if(u)for(let e=0;e<24;e++){let t=u.minByHour[e],n=u.maxByHour[e];t!=null&&n!=null&&(c=Math.min(c,t),l=Math.max(l,n))}let d=l-c||.01,f=e=>44-(e-c)/d*40,p=r.map((e,t)=>({x:t/(r.length-1)*280,y:f(e.value)})),m=yt(p),h=m?`${m} L ${280 .toFixed(2)} ${48 .toFixed(2)} L 0 ${48 .toFixed(2)} Z`:``,g=z;if(u){let e=[],t=[];for(let n=0;n<r.length;n++){let i=new Date(r[n].time).getHours(),a=u.maxByHour[i],o=u.minByHour[i];a!=null&&o!=null&&(e.push({x:p[n].x,y:f(a)}),t.push({x:p[n].x,y:f(o)}))}if(e.length>=2){let n=bt(e,t);n&&(g=L`<path d=${n} fill="var(--primary-color)" fill-opacity="0.08" stroke="none"/>`)}}let _=r[0].time,v=r[r.length-1].time,y=e=>{if(e<=_||e>=v)return null;let t=0,n=r.length-1;for(;t<n-1;){let i=t+n>>1;r[i].time<=e?t=i:n=i}let i=r[t+1].time-r[t].time,a=i>0?(e-r[t].time)/i:0;return p[t].x+a*(p[t+1].x-p[t].x)},b=[];if(e.showNoonMarkers&&r.length>=2){let e=new Date(_);for(e.setHours(12,0,0,0),e.getTime()<_&&e.setDate(e.getDate()+1);e.getTime()<=v;e.setDate(e.getDate()+1),e.setHours(12,0,0,0)){let t=y(e.getTime());t!=null&&b.push(L`
          <line x1=${t.toFixed(1)} y1="0" x2=${t.toFixed(1)} y2=${48}
                stroke="var(--secondary-text-color)" stroke-width="0.5"
                stroke-dasharray="2,3" opacity="0.55"/>
        `)}}let x=e.showMedianLine?Ct(a):null,S=e.showMedianLine?L`<line x1="0" y1=${wt(a,f).toFixed(1)}
                  x2=${280} y2=${wt(a,f).toFixed(1)}
                  stroke="var(--secondary-text-color)" stroke-width="0.5"
                  stroke-dasharray="4,3" opacity="0.55"/>`:z,C=xt(e.analysis),w=null,T=null;if(C){let e=y(C.startMs),t=y(C.endMs);w=e??(C.startMs<=_?0:null),T=t??(C.endMs>=v?280:null)}let E=w!=null&&T!=null&&T>w?L`<rect x=${w.toFixed(1)} y="0"
                  width=${(T-w).toFixed(1)} height=${48}
                  fill="var(--success-color,#4CAF50)" fill-opacity="0.10"
                  stroke="none"/>`:z,D=r.map((e,t)=>({t:e.time,v:e.value,x:+p[t].x.toFixed(1),y:+p[t].y.toFixed(1)})),O=`spark-grad-${Math.random().toString(36).slice(2,8)}`,ee=e.showMedianLine?(()=>{let t=Ct(a);if(!t)return z;let n={median_delta_below:e.translations.median_delta_below,median_delta_above:e.translations.median_delta_above,median_delta_equal:e.translations.median_delta_equal}[t.key].replace(`{c}`,t.cents);return I`
            <span class="median-delta ${t.cls}">${n}</span>
          `})():z,k=[...a].sort((e,t)=>e-t),A=(k.length-1)/2,te=k.length>0?(k[Math.floor(A)]+k[Math.ceil(A)])/2:0,ne=(e.showMedianLine?e.translations.sparkline_aria_summary:e.translations.sparkline_aria_simple).replace(`{min}`,K(o)).replace(`{max}`,K(s)).replace(`{median}`,K(te));return{template:I`
      <div class="sparkline-svg-wrap">
      <svg
        class="sparkline"
        viewBox="0 0 ${280} ${48}"
        preserveAspectRatio="none"
        role="img"
        aria-label=${ne}
        data-points=${JSON.stringify(D)}
        data-width=${280}
        data-height=${48}
      >
        <title>${ne}</title>
        <defs>
          <linearGradient id=${O} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.3" />
            <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        ${b}
        ${g}
        <path d=${h} fill="url(#${O})" />
        ${E}
        ${S}
        <path
          d=${m}
          fill="none"
          stroke="var(--primary-color)"
          stroke-width="1.5"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        <line
          class="sparkline-hover-line"
          x1="0" y1="0" x2="0" y2=${48}
          stroke="var(--primary-text-color)" stroke-width="0.6"
          stroke-dasharray="2,2" opacity="0" pointer-events="none"
        />
      </svg>
      <div class="sparkline-hover-dot" style="opacity:0" aria-hidden="true"></div>
      </div>
      <div class="sparkline-tooltip" hidden>
        <span class="sparkline-tooltip-time"></span>
        <span class="sparkline-tooltip-price"></span>
      </div>
      <div class="sparkline-labels">
        ${e.showMinMax?I`<span>
              <span class="sparkline-minmax-label">${e.translations.min_label}</span>
              ${K(o)}
            </span>`:z}
        <span class="sparkline-period">
          ${e.translations.last_7_days}${ee===z?z:I` · ${ee}`}
        </span>
        ${e.showMinMax?I`<span>
              <span class="sparkline-minmax-label">${e.translations.max_label}</span>
              ${K(s)}
            </span>`:z}
      </div>
    `,hoverPoints:D,medianDelta:x,viewBoxWidth:280,viewBoxHeight:48}}catch(e){return console.warn(`[Tankstellen Austria] sparkline render failed:`,e),t}}function Et(e,t){let n=()=>void 0;try{let n=()=>{let t=e.querySelector(`svg.sparkline`),n=e.querySelector(`.sparkline-tooltip`);if(!t||!n)return null;let r=t.querySelector(`.sparkline-hover-line`),i=e.querySelector(`.sparkline-hover-dot`),a=n.querySelector(`.sparkline-tooltip-time`),o=n.querySelector(`.sparkline-tooltip-price`);if(!r||!i||!a||!o)return null;let s;try{s=JSON.parse(t.dataset.points||`[]`)}catch{s=[]}if(!s.length)return null;let c=Number(t.dataset.width)||280,l=Number(t.dataset.height)||48;return{svgEl:t,line:r,dot:i,tooltip:n,timeEl:a,priceEl:o,pts:s,vbWidth:c,vbHeight:l}},r=r=>{let i=n();if(!i)return;let{svgEl:a,line:o,dot:s,tooltip:c,timeEl:l,priceEl:u,pts:d,vbWidth:f,vbHeight:p}=i,m=a.getBoundingClientRect();if(m.width===0)return;let h=Math.max(0,Math.min(1,(r-m.left)/m.width))*f,g=d[0],_=Math.abs(g.x-h);for(let e of d){let t=Math.abs(e.x-h);t<_&&(g=e,_=t)}o.setAttribute(`x1`,String(g.x)),o.setAttribute(`x2`,String(g.x)),o.setAttribute(`opacity`,`0.5`),s.style.left=`${g.x/f*100}%`,s.style.top=`${g.y/p*100}%`,s.style.opacity=`1`,l.textContent=t.formatTime(g.t),u.textContent=t.formatPrice(g.v),c.hidden=!1;let v=e.getBoundingClientRect(),y=g.x/f*m.width+(m.left-v.left);c.style.left=`0px`;let b=c.offsetWidth,x=y-b/2,S=Math.max(0,Math.min(v.width-b,x));c.style.left=`${S}px`},i=()=>{let e=n();e&&(e.line.setAttribute(`opacity`,`0`),e.dot.style.opacity=`0`,e.tooltip.hidden=!0)},a=new AbortController,{signal:o}=a;return e.addEventListener(`pointermove`,e=>r(e.clientX),{signal:o}),e.addEventListener(`pointerleave`,i,{signal:o}),e.addEventListener(`pointercancel`,i,{signal:o}),()=>{a.abort()}}catch(e){return console.warn(`[Tankstellen Austria] sparkline hover setup failed:`,e),n}}const Dt=36e5,Ot=864e5,kt=3*Ot;function At(e){let t=new Date(e);t.setHours(0,0,0,0);let n=t.getDay();return t.setDate(t.getDate()-(n===0?6:n-1)),t.getTime()}function jt(e,t){let n=[],r=(e,t,r)=>{if(r<=t||!Number.isFinite(e))return;let i=t;for(;i<r;){let t=Math.floor(i/Dt)*Dt+Dt,a=Math.min(r,t),o=new Date(i);n.push({price:e,t:i,hour:o.getHours(),weekday:o.getDay(),weekKey:At(i),durationMs:a-i}),i=a}};for(let t=0;t<e.length-1;t++)r(e[t].value,e[t].time,e[t+1].time);let i=e[e.length-1];return r(i.value,i.time,t),n}function Mt(e){let t=new Map;for(let n of e){let e=t.get(n.weekKey);e?e.push(n):t.set(n.weekKey,[n])}return t}function Nt(e,t,n){let r=e=>e!==void 0&&!Number.isNaN(e)&&e-n<=.005,i=0;for(let n=1;n<=23&&r(e[(t+n)%24]);n++)i=n;let a=0;for(let n=1;n<=23&&r(e[(t-n+24)%24]);n++)a=n;return{start:(t-a+24)%24,end:(t+i+1)%24}}function Pt(e,t){let n=e.map(e=>e.length>=t?X(e,.5):NaN),r=-1,i=1/0;return n.forEach((e,t)=>{!Number.isNaN(e)&&e<i&&(i=e,r=t)}),{medians:n,bestIdx:r,bestVal:i,minVal:i}}function Ft(e,t){let n=e.medians.filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t);return n.length<2||e.bestIdx<0?0:Y((n[Math.floor((n.length-1)/2)]-e.minVal)*100/t,0,1)}function It(e){if(!e||e.length<2)return null;let t=Date.now(),n=t-e[0].time;if(n<7*Ot)return{hasEnoughData:!1};let r=jt(e,t);if(r.length===0)return{hasEnoughData:!1};let i=Mt(r),a=Array.from({length:24},()=>[]),o=Array.from({length:7},()=>[]);for(let e of i.values()){let n=0;for(let t of e)n+=t.durationMs;if(n<kt)continue;let r=e.map(e=>({value:e.price,weight:e.durationMs})),i=X(r,.05),s=X(r,.95),c=0;for(let t of e)c+=Y(t.price,i,s)*t.durationMs;let l=c/n;for(let n of e){let e=Y(n.price,i,s),r=.5**((t-n.t)/12096e5),c={value:e-l,weight:n.durationMs*r};a[n.hour].push(c),o[n.weekday].push(c)}}let s=Pt(a,3);if(s.bestIdx<0)return{hasEnoughData:!1};let c=Pt(o,3),l=n/Ot,u=Math.min(1,l/28),d=a.filter(e=>e.length>=3).length/24,f=Ft(s,1.5),p=s.medians.filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t),m=p.length>=2?(p[Math.floor((p.length-1)/2)]-s.minVal)*100:0,h=(u+d+f)/3,g=h>=.75?`high`:h>=.5?`medium`:`low`,_=o.filter(e=>e.length>=3).length/7,v=Ft(c,.8),y=(c.bestIdx>=0?(u+_+v)/3:0)>=.75,b=Nt(s.medians,s.bestIdx,s.minVal);return{hasEnoughData:!0,hour:b.start,hour_end:b.end,weekday:y?c.bestIdx:null,confidence:{level:g,score:h,span_days:Math.round(l),coverage_pct:Math.round(d*100),gap_cents:Math.round(m*10)/10}}}function Lt(e){if(!e||e.length<2)return null;let t=Date.now();if(t-e[0].time<7*Ot)return null;let n=jt(e,t);if(n.length===0)return null;let r=Mt(n),i=Array.from({length:24},()=>[]);for(let e of r.values()){let t=0;for(let n of e)t+=n.durationMs;if(t<kt)continue;let n=e.map(e=>({value:e.price,weight:e.durationMs})),r=X(n,.05),a=X(n,.95);for(let t of e)i[t.hour].push({value:Y(t.price,r,a),weight:t.durationMs})}let a=Array(24).fill(null),o=Array(24).fill(null),s=0;for(let e=0;e<24;e++){let t=i[e];t.length<3||(a[e]=X(t,.1),o[e]=X(t,.9),s++)}return s<6?null:{minByHour:a,maxByHour:o}}const Rt=c`
  :host {
    /* color-scheme enables light-dark() and steers forced-colors palette
       selection (WCAG 1.4.11). HA's active theme drives the resolution. */
    color-scheme: light dark;
    display: block;
    /* Fill the grid cell the dashboard gave us.
       A sections view puts a fixed pixel height on the cell WRAPPER whenever
       the card's rows are numeric -- which a user also causes by dragging the
       row handle, since a stored grid_options overrides what getGridOptions()
       returns -- and styles nothing inside that wrapper.
       This host is display: block, so IT is the containing block for the
       ha-card below, and a percentage height against a containing block whose
       own height is auto computes to auto. Without this line ha-card therefore
       sizes to its content, overflows a cell too short for it, and is painted
       over the card underneath. Taking the cell's height here is what gives
       ha-card's 100% something to resolve against.
       In an auto-height cell it resolves to auto -- the height it already had
       -- so it costs nothing there. */
    block-size: 100%;

    /* Brand accent — domain-specific, no HA equivalent. */
    --tankst-accent: var(--primary-color);

    /* Semantic state tokens layered over HA's official semantic palette
       so theme authors can recolour the whole portfolio in one place;
       hard-coded fallbacks for older HA versions. NOTE: editorStyles
       :host also needs these — duplicated there. See ha-portfolio-design
       § 4 "Multi-card integrations — every shadow scope needs the
       tokens" for why. */
    --tankst-rt:      var(--success-color, #4caf50);
    --tankst-warning: var(--warning-color, #ffa000);
    --tankst-error:   var(--error-color,   #db4437);
    --tankst-info:    var(--info-color,    #1565c0);

    /* Spacing / radius / sizing — layered over the HA Design System
       so the card moves with HA when tokens evolve. Hard-coded values
       are the fallback for older HA versions. */
    /* These names were wrong until v1.9.4 and nothing complained: var()
       on a token HA does not define is not an error, it just resolves to
       the fallback. So the card ran entirely on its own literals while
       looking theme-aware — which is how --ha-spacing-3 came to mean
       14px on one line and 12px on the next.

       Verified against the frontend's src/resources/theme/core.globals.ts:
         --ha-space-N          4px grid, 1…20   (was --ha-spacing-N)
         --ha-font-size-*      xs 10 / s 12 / m 14 / l 16 / xl 20px.
                               typography.globals.ts sets the root to
                               font-size:14px, so -m is 1rem, NOT 0.875 —
                               do the rem maths at 14px or just write px.
         --ha-border-radius-*  sm 4 / md 8 / lg 12 / xl 16 / pill / circle
                                                (was --ha-radius-*)
         --ha-animation-duration-*  none 1 / instant 75 / fast 150 /
                                    normal 250 / slow 350ms
                                                (was --ha-transition-duration-*)
       There is no easing token — --ha-transition-easing-standard never
       existed either, so easings are now named directly.

       Fallbacks are kept and now match the token they stand in for.
       Adopting a new --ha-* token means checking core.globals.ts first;
       a typo here is invisible. */
    --tankst-radius-sm: var(--ha-border-radius-sm, 4px);
    --tankst-radius-md: var(--ha-border-radius-md, 8px);
    --tankst-radius-lg: var(--ha-card-border-radius, var(--ha-border-radius-lg, 12px));
    --tankst-pad-x:     var(--ha-space-4, 16px);
    --tankst-pad-y:     var(--ha-space-3, 12px);
    --tankst-row-gap:   var(--ha-space-3, 12px);
    --tankst-tile-size: 40px;
  }
  ha-card {
    /* Resolves against the height :host just took from the cell, so
       overflow: hidden clips inside the card rather than the card spilling
       past its own cell. The two declarations only work as a pair: core cards
       that set this one alone leave :host at its default inline display, where
       the cell wrapper is ha-card's containing block instead. */
    block-size: 100%;

    overflow: hidden;
    /* Card responds to its own width, not the viewport — narrow
       dashboard columns trigger the compact density tier even on wide
       screens. */
    container-type: inline-size;
    container-name: tscard;
  }
  .wrap {
    padding: var(--tankst-pad-y) var(--tankst-pad-x);
    display: flex;
    flex-direction: column;
    gap: var(--tankst-row-gap);
  }
  .empty {
    padding: 24px 0;
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 0.875rem;
  }

  /* ── Version-mismatch banner ────────────────────────────────────── */
  .version-notice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: var(--tankst-warning);
    color: #fff;
    padding: 10px 14px;
    margin: calc(var(--tankst-pad-y) * -1) calc(var(--tankst-pad-x) * -1) 0;
    font-size: 0.8125rem;
    font-weight: 500;
  }
  .version-reload-btn {
    flex-shrink: 0;
    background: #fff;
    color: var(--tankst-warning);
    border: none;
    border-radius: 999px;
    padding: 6px 14px;
    font-weight: 600;
    font-size: 0.75rem;
    cursor: pointer;
    min-height: 32px;
    font-family: inherit;
  }

  /* ── Tabs ───────────────────────────────────────────────────────── */
  /* Direct child of <ha-card>, flush with the card edges. The .wrap
     padding handles the breathing room to the first content row. */
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar {
    display: none;
  }
  .tab {
    /* 44px tall tap target, three independent active cues (colour,
       weight, underline) so the active state survives any single-channel
       deficit (low vision, protanopia, grayscale). */
    flex: 1;
    min-width: 0;
    height: 44px;
    padding: 0 14px;
    background: none;
    border: none;
    box-shadow: inset 0 -2px 0 transparent;
    color: var(--secondary-text-color);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition:
      color var(--ha-animation-duration-fast, 150ms) ease,
      box-shadow var(--ha-animation-duration-fast, 150ms) ease,
      background-color var(--ha-animation-duration-fast, 150ms) ease;
    font-family: inherit;
  }
  .tab:hover {
    color: var(--primary-text-color);
    background: color-mix(in srgb, var(--primary-color) 6%, transparent);
  }
  .tab.active {
    color: var(--primary-color);
    font-weight: var(--ha-font-weight-bold, 700);
    box-shadow: inset 0 -2px 0 var(--primary-color);
  }

  /* ── Section + Header ───────────────────────────────────────────── */
  .station-section {
    display: flex;
    flex-direction: column;
    gap: var(--tankst-row-gap);
  }
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .icon-tile {
    /* Modern HA tile-card vocabulary: rounded square, accent-tinted
       background, accent-coloured icon. Gives the card immediate visual
       identity in dashboards. */
    width: var(--tankst-tile-size);
    height: var(--tankst-tile-size);
    border-radius: var(--tankst-radius-md);
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--tankst-accent) 18%, transparent);
    color: var(--tankst-accent);
    --mdc-icon-size: 22px;
  }
  .header-text {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .title {
    /* <h2> override: nuke UA heading margins. */
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .subtitle {
    /* <p> override. */
    margin: 0;
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    font-weight: 400;
    letter-spacing: 0.1px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .header-actions {
    /* Right-side cluster in dynamic mode: refresh button on top, the
       last-updated + no_new_data chips below — visually grouped with
       the action they relate to. */
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    flex-shrink: 0;
  }
  .header-actions .chip-row {
    /* Right-align the wrapped chip overflow under the button. */
    justify-content: flex-end;
  }
  .icon-action {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--secondary-text-color);
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    transition:
      background-color var(--ha-animation-duration-fast, 150ms) ease,
      color var(--ha-animation-duration-fast, 150ms) ease;
    --mdc-icon-size: 20px;
    font-family: inherit;
  }
  .icon-action:hover {
    background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    color: var(--primary-color);
  }

  /* Map-pin action and its distance caption stacked as one column, so the
     Luftlinie value reads as an annotation to the pin rather than a
     free-floating number. The pin keeps the only interactive affordance;
     the caption stays quiet (muted, tabular so values align down the list,
     tight line-height so it tucks under the pin circle — which shrinks via
     .has-distance below so the column never exceeds the 40px standalone
     pin and the row height stays put). */
  .map-action {
    flex-shrink: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
  }
  .distance {
    font-size: 0.68rem;
    line-height: 1;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }
  /* With the caption present, shrink the pin circle so the stacked column
     (28px pin + 1px gap + ~11px caption) matches the 40px standalone pin —
     toggling show_distance must not change the row height. 28px keeps the
     tap target above the WCAG 2.2 24px minimum. */
  .map-action.has-distance .icon-action {
    width: 28px;
    height: 28px;
    --mdc-icon-size: 16px;
  }

  /* ── Hero metric ────────────────────────────────────────────────── */
  .hero {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .metric {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .metric-value {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    line-height: 1;
  }
  .metric-num {
    font-size: 2.25rem;
    font-weight: var(--ha-font-weight-bold, 700);
    color: var(--primary-text-color);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.5px;
  }
  .metric-of {
    font-size: 1rem;
    color: var(--secondary-text-color);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
  .metric-label {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    font-weight: 500;
    letter-spacing: 0.2px;
    text-transform: uppercase;
  }

  /* ── Chips ──────────────────────────────────────────────────────── */
  .chip-row {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
    background: color-mix(in srgb, var(--primary-color) 14%, transparent);
    color: var(--primary-color);
    font-variant-numeric: tabular-nums;
  }
  .chip ha-icon {
    --mdc-icon-size: 14px;
  }
  .chip.muted {
    background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent);
    color: var(--secondary-text-color);
  }
  .chip.warn {
    background: color-mix(in srgb, var(--tankst-warning) 16%, transparent);
    color: var(--tankst-warning);
  }
  .chip.match {
    /* Payment-method match highlight chip (filter mode + highlight
       toggle). Same accent vocabulary as the hero metric. */
    background: color-mix(in srgb, var(--tankst-rt) 16%, transparent);
    color: var(--tankst-rt);
  }

  /* ── Status flags (closed / closing-soon) ───────────────────────── */
  .flag {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent);
    color: var(--secondary-text-color);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .flag.closed {
    background: color-mix(in srgb, var(--tankst-error) 16%, transparent);
    color: var(--tankst-error);
  }
  .flag.closing-soon {
    background: color-mix(in srgb, var(--tankst-warning) 16%, transparent);
    color: var(--tankst-warning);
  }

  /* ── Filled CTA (dynamic-mode refresh) ──────────────────────────── */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0 14px;
    height: 32px;
    border: none;
    border-radius: 999px;
    background: var(--tankst-accent);
    color: var(--text-primary-color, #fff);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 1px 2px color-mix(in srgb, #000 12%, transparent);
    transition:
      filter var(--ha-animation-duration-fast, 150ms) ease,
      transform var(--ha-animation-duration-fast, 150ms) ease,
      opacity var(--ha-animation-duration-fast, 150ms) ease;
    flex-shrink: 0;
    font-family: inherit;
    font-variant-numeric: tabular-nums;
  }
  .btn-primary:hover:not(.cooling) {
    filter: brightness(1.08);
  }
  .btn-primary:active:not(.cooling) {
    transform: translateY(1px);
  }
  .btn-primary.cooling {
    opacity: 0.55;
    cursor: default;
    pointer-events: none;
  }
  .btn-primary ha-icon {
    --mdc-icon-size: 16px;
  }

  /* ── Sparkline ──────────────────────────────────────────────────── */
  .sparkline-container {
    cursor: pointer;
    position: relative;
  }
  /* Tight wrap around the SVG that gives marker + hover-dot HTML
     overlays a positioning context EQUAL to the SVG's rendered box.
     If the markers were positioned against .sparkline-container
     directly, their percentage top/left would resolve against a
     taller container that also includes tooltip + labels — dot
     would land below the line. */
  .sparkline-svg-wrap {
    position: relative;
    width: 100%;
  }
  .sparkline {
    width: 100%;
    height: var(--ts-sparkline-height, clamp(40px, 8vw + 24px, 72px));
    display: block;
  }
  /* Cheapest-refill marker + hover dot. Both live OUTSIDE the SVG
     (HTML overlays positioned via percentage left/top inside
     .sparkline-svg-wrap) because the SVG uses preserveAspectRatio
     "none" to stretch the line across the card width — circles
     inside that SVG get squashed into ovals on wide cards. As regular
     HTML elements with border-radius: 50%, these stay true circles
     regardless of card width. */
  .sparkline-marker,
  .sparkline-hover-dot {
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    border: 1.5px solid var(--card-background-color, #fff);
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 1;
  }
  .sparkline-marker {
    background: var(--tankst-rt);
  }
  .sparkline-hover-dot {
    background: var(--primary-color);
    /* The dot follows the pointer, so it wants the shortest real
       duration HA ships — instant, not fast. The old 60ms literal
       was aiming at the same thing. */
    transition:
      left var(--ha-animation-duration-instant, 75ms) linear,
      top var(--ha-animation-duration-instant, 75ms) linear,
      opacity var(--ha-animation-duration-fast, 150ms) ease;
  }
  .sparkline-tooltip {
    position: absolute;
    top: -28px;
    display: flex;
    gap: 6px;
    padding: 3px 7px;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color);
    border-radius: var(--tankst-radius-sm);
    box-shadow: 0 2px 6px color-mix(in srgb, #000 12%, transparent);
    font-size: 0.75rem;
    white-space: nowrap;
    pointer-events: none;
    z-index: 2;
  }
  .sparkline-tooltip[hidden] {
    display: none;
  }
  .sparkline-tooltip-time {
    color: var(--secondary-text-color);
  }
  .sparkline-tooltip-price {
    color: var(--primary-text-color);
    font-weight: 600;
  }
  .sparkline-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.6875rem;
    color: var(--secondary-text-color);
    padding: 2px 0 0;
  }
  .sparkline-period {
    font-size: 0.6875rem;
    opacity: 0.6;
  }
  .sparkline-minmax-label {
    opacity: 0.6;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .median-delta {
    font-weight: 500;
    opacity: 0.9;
  }
  .median-delta-good {
    color: var(--tankst-rt);
  }
  .median-delta-bad {
    color: var(--tankst-warning);
  }
  .median-delta-neutral {
    color: var(--secondary-text-color);
  }

  /* ── Best-refuel recommendation ─────────────────────────────────── */
  .refuel-recommendation {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--tankst-rt);
    line-height: 1.3;
  }
  .refuel-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    opacity: 0.85;
  }
  .refuel-icon {
    --mdc-icon-size: 14px;
    flex-shrink: 0;
  }
  .refuel-text {
    flex: 1;
    min-width: 0;
  }
  .refuel-confidence {
    flex-shrink: 0;
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    padding: 3px 8px;
    border-radius: 999px;
    cursor: help;
    white-space: nowrap;
  }
  .refuel-confidence-high {
    background: color-mix(in srgb, var(--tankst-rt) 18%, transparent);
    color: var(--tankst-rt);
  }
  .refuel-confidence-medium {
    background: color-mix(in srgb, var(--tankst-warning) 18%, transparent);
    color: var(--tankst-warning);
  }
  .refuel-confidence-low {
    background: color-mix(in srgb, var(--secondary-text-color, #888) 15%, transparent);
    color: var(--secondary-text-color, #888);
  }

  /* ── Cars fill-up block ─────────────────────────────────────────── */
  .cars-fillup {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-top: var(--tankst-row-gap);
    border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.15));
  }
  .car-fillup-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
  .car-fillup-name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: var(--primary-text-color);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .car-icon {
    --mdc-icon-size: 16px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }
  .car-fillup-liters {
    font-size: 0.75rem;
    opacity: 0.7;
    color: var(--secondary-text-color);
  }
  .car-fillup-cost {
    font-size: 0.9375rem;
    font-weight: var(--ha-font-weight-bold, 700);
    color: var(--primary-text-color);
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }
  .car-per100-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 22px;
    margin-top: -4px;
  }
  .car-per100-label {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    opacity: 0.85;
  }
  .car-per100-cost {
    font-size: 0.8125rem;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }

  /* ── Stations list ──────────────────────────────────────────────── */
  .stations {
    display: flex;
    flex-direction: column;
    /* Negative side + bottom margins so the list bleeds to the card's
       edges (full-bleed list look) while the rest of the section
       content stays inside .wrap's padding. Keeps the gap-rhythm above
       intact. */
    margin: 0 calc(var(--tankst-pad-x) * -1) calc(var(--tankst-pad-y) * -1);
    border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.15));
  }
  .station {
    border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.1));
  }
  .station:last-child {
    border-bottom: none;
  }
  .station.pm-highlight {
    box-shadow: inset 3px 0 0 var(--tankst-rt);
    background: color-mix(in srgb, var(--tankst-rt) 6%, transparent);
  }
  .station.pm-highlight .station-main:hover {
    background: color-mix(in srgb, var(--tankst-rt) 12%, transparent);
  }
  .station-main {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px var(--tankst-pad-x);
    cursor: pointer;
    transition: background-color var(--ha-animation-duration-fast, 150ms) ease;
  }
  .station-main:hover {
    background: color-mix(in srgb, var(--primary-color) 6%, transparent);
  }
  .index-tile {
    /* Rounded-square index badge. Same vocabulary as the header
       .icon-tile but smaller and label-bearing. */
    width: 28px;
    height: 28px;
    border-radius: var(--tankst-radius-sm);
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--tankst-accent) 18%, transparent);
    color: var(--tankst-accent);
    font-size: 0.8125rem;
    font-weight: var(--ha-font-weight-bold, 700);
    font-variant-numeric: tabular-nums;
  }
  .info {
    flex: 1;
    min-width: 0;
  }
  .name {
    font-weight: 500;
    font-size: 0.9375rem;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .address {
    font-size: 0.8125rem;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .price {
    font-weight: var(--ha-font-weight-bold, 700);
    font-size: 1.125rem;
    color: var(--primary-text-color);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    flex-shrink: 0;
  }
  /* Chevron arrow indicating collapsibility. Rotates 180° on
     aria-expanded="true" so the cue follows the WAI-ARIA state without
     a bespoke CSS class — same pattern as wiener-linien-austria. */
  .expander-chevron {
    --mdc-icon-size: 20px;
    color: var(--secondary-text-color);
    transition: transform var(--ha-animation-duration-fast, 150ms) ease;
    flex-shrink: 0;
  }
  .station-main[aria-expanded="true"] .expander-chevron {
    transform: rotate(180deg);
  }

  /* Station-detail drawer.
     grid-template-rows 0fr ↔ 1fr animates to intrinsic height — long
     content (many opening-hour lines + payment methods) is not clipped.
     The single direct child gets overflow:hidden + min-height:0 so the
     row collapse actually hides it. */
  .station-detail {
    display: grid;
    grid-template-rows: 0fr;
    transition:
      grid-template-rows 0.3s ease,
      padding 0.3s ease;
    padding: 0 var(--tankst-pad-x) 0 calc(var(--tankst-pad-x) + 28px + 12px);
  }
  .station-detail > * {
    overflow: hidden;
    min-height: 0;
  }
  .station-detail.expanded {
    grid-template-rows: 1fr;
    padding: 0 var(--tankst-pad-x) 12px calc(var(--tankst-pad-x) + 28px + 12px);
  }
  .detail-cols {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .detail-col {
    flex: 1 1 140px;
    min-width: 0;
  }
  .hours-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2px 12px;
    font-size: 0.8125rem;
    color: var(--secondary-text-color);
  }
  .hours-grid .day {
    font-weight: 600;
    color: var(--primary-text-color);
  }

  /* Payment methods — chip vocabulary. */
  .pm-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .pm-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.2px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .pm-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .pm-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.2;
    background: color-mix(in srgb, var(--secondary-text-color) 10%, transparent);
    color: var(--primary-text-color);
  }
  .pm-badge ha-icon {
    --mdc-icon-size: 13px;
    color: var(--secondary-text-color);
  }
  .pm-badge.pm-other {
    font-style: italic;
  }

  /* ── Brand footer (E-Control logo-link + attribution) ──────────── */
  /* Mirrors the Ladestellen Austria card's footer vocabulary —
     adaptive logo silhouette (filter brightness(0) [invert(1)]) so
     a brand-coloured PNG/SVG follows hass.themes.darkMode when the
     user enables logo_adapt_to_theme. */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px var(--tankst-pad-x);
    border-top: 1px solid var(--divider-color);
  }
  .brand-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    transition: opacity 0.16s ease;
  }
  .brand-link:hover {
    opacity: 0.7;
  }
  .brand-logo {
    display: block;
    height: 20px;
    width: auto;
    max-width: 140px;
    object-fit: contain;
    transition: filter 0.16s ease;
  }
  .brand-logo.adaptive.adaptive-light {
    filter: brightness(0);
  }
  .brand-logo.adaptive.adaptive-dark {
    filter: brightness(0) invert(1);
  }
  .attribution-text {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    letter-spacing: 0.03em;
    opacity: 0.85;
  }

  /* ── Density ladder (container queries, not viewport) ───────────── */
  /* Compact: narrow phone columns, side-by-side panels. */
  @container tscard (inline-size < 360px) {
    :host {
      --tankst-pad-x: 14px;
      --tankst-pad-y: 12px;
      --tankst-tile-size: 36px;
    }
    .metric-num {
      font-size: 2rem;
    }
    .icon-tile {
      --mdc-icon-size: 20px;
    }
    .address {
      white-space: normal;
    }
    .price {
      font-size: 1rem;
    }
    .station-main {
      gap: 8px;
    }
    .footer {
      padding: 8px 14px;
    }
    .brand-logo {
      height: 18px;
    }
  }
  /* Wide: sidebar / panel mode / 2-column section view. */
  @container tscard (inline-size > 480px) {
    :host {
      --tankst-pad-x: 20px;
      --tankst-pad-y: 16px;
      --tankst-tile-size: 44px;
    }
    .metric-num {
      font-size: 2.5rem;
    }
    .icon-tile {
      --mdc-icon-size: 24px;
    }
  }

  /* ── Accessibility primitives ───────────────────────────────────── */
  .tab:focus-visible,
  .station-main:focus-visible,
  .sparkline-container:focus-visible,
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 6px;
  }
  .btn-primary:focus-visible {
    outline-offset: 3px;
  }

  /* Forced-colors fallback (Windows High Contrast). */
  @media (forced-colors: active) {
    .tab:focus-visible,
    .station-main:focus-visible,
    .sparkline-container:focus-visible,
    a:focus-visible,
    button:focus-visible {
      outline-color: CanvasText;
    }
    .icon-tile,
    .index-tile,
    .chip,
    .flag,
    .btn-primary,
    .pm-badge,
    .refuel-confidence {
      forced-color-adjust: none;
    }
  }

  /* Honour user motion preference (catch-all). */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`,zt=c`
  :host {
    /* color-scheme enables light-dark() and steers forced-colors palette
       selection. The editor is its own Lit element with its own shadow
       root — CSS custom properties don't bleed across shadow boundaries,
       so the semantic tokens below are duplicated from the cardStyles
       :host. Keep both blocks in sync. See ha-portfolio-design § 4
       "Multi-card integrations — every shadow scope needs the tokens". */
    color-scheme: light dark;
    display: block;

    --tankst-rt:      var(--success-color, #4caf50);
    --tankst-warning: var(--warning-color, #ffa000);
    --tankst-error:   var(--error-color,   #db4437);
    --tankst-info:    var(--info-color,    #1565c0);
  }
  .editor {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .editor-section {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .section-header {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    margin-bottom: 2px;
  }
  .editor-hint {
    font-size: 0.8125rem;
    color: var(--secondary-text-color);
    line-height: 1.4;
  }

  /* Recorder hint + copy button */
  .recorder-hint {
    margin: 4px 0 2px 16px;
    padding: 8px 10px;
    border-radius: 6px;
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
    border: 1px solid var(--divider-color);
  }
  .recorder-hint-text {
    font-size: 0.75rem;
    line-height: 1.4;
    color: var(--secondary-text-color);
    margin-bottom: 6px;
  }
  .recorder-snippet {
    margin: 0;
    padding: 8px;
    border-radius: 4px;
    background: var(--code-editor-background-color, var(--primary-background-color, #0e0e0e));
    font-family: var(--code-font-family, monospace);
    font-size: 0.75rem;
    line-height: 1.35;
    color: var(--primary-text-color);
    overflow-x: auto;
    white-space: pre;
  }
  .recorder-hint-actions {
    margin-top: 6px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .recorder-copy-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 4px;
    background: transparent;
    border: 1px solid var(--divider-color);
    color: var(--primary-text-color);
    font-size: 0.75rem;
    cursor: pointer;
    font-family: inherit;
  }
  .recorder-copy-btn:hover {
    background: var(--primary-background-color);
  }
  .recorder-copy-btn ha-icon,
  .recorder-docs-link ha-icon {
    --mdc-icon-size: 14px;
  }
  .recorder-docs-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: var(--primary-color);
    text-decoration: none;
  }
  .recorder-docs-link:hover {
    text-decoration: underline;
  }

  /* Tab labels */
  .tab-label-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .tab-label-default {
    flex: 0 0 40%;
    font-size: 0.875rem;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tab-label-input {
    flex: 1;
    min-width: 0;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font-size: 0.875rem;
    font-family: inherit;
  }
  .tab-label-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  /* Payment filter chips */
  .pm-filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .pm-filter-chip {
    padding: 6px 12px;
    min-height: 32px;
    border-radius: 14px;
    font-size: 0.8125rem;
    cursor: pointer;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    transition: all var(--ha-animation-duration-fast, 150ms) ease;
    font-family: inherit;
  }
  .pm-filter-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }
  .pm-filter-chip:hover {
    opacity: 0.85;
  }
  .pm-filter-chip.confirm {
    background: var(--tankst-error);
    color: #fff;
    border-color: var(--tankst-error);
  }
  .pm-custom-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .pm-custom-row ha-selector {
    flex: 1;
    /* Flex items default to min-width:auto; the selector's input has an
       intrinsic minimum that would otherwise push the + button off-row. */
    min-width: 0;
  }
  .pm-custom-row ha-icon-button {
    color: var(--primary-color);
    flex-shrink: 0;
  }

  /* Cars editor */
  .car-editor-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .car-editor-row {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }
  .car-input {
    background: var(--input-fill-color, rgba(0, 0, 0, 0.06));
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    padding: 6px 8px;
    font-size: 0.875rem;
    color: var(--primary-text-color);
    outline: none;
    font-family: inherit;
    min-width: 0;
  }
  .car-input:focus {
    border-color: var(--primary-color);
  }
  .car-name-input {
    flex: 1 1 50px;
    min-width: 50px;
  }
  .car-tank-input {
    width: 54px;
    flex-shrink: 0;
  }
  .car-consumption-input {
    width: 60px;
    flex-shrink: 0;
  }
  .car-select {
    background: var(--input-fill-color, rgba(0, 0, 0, 0.06));
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    padding: 6px 2px;
    font-size: 0.875rem;
    color: var(--primary-text-color);
    cursor: pointer;
    font-family: inherit;
    flex-shrink: 0;
    max-width: 90px;
  }
  .car-delete-btn {
    background: none;
    border: none;
    color: var(--tankst-error);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: auto;
  }
  .car-delete-btn:hover {
    background: rgba(219, 68, 55, 0.1);
  }
  .car-add-btn {
    align-self: flex-start;
    background: none;
    border: 1px dashed var(--divider-color);
    border-radius: 8px;
    color: var(--primary-color);
    cursor: pointer;
    font-size: 0.875rem;
    padding: 8px 14px;
    width: 100%;
    font-family: inherit;
    transition: background var(--ha-animation-duration-fast, 150ms) ease;
  }
  .car-add-btn:hover {
    background: rgba(0, 0, 0, 0.04);
  }
  .car-icon-btn {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    color: var(--primary-color);
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background var(--ha-animation-duration-fast, 150ms) ease, border-color var(--ha-animation-duration-fast, 150ms) ease;
    --mdc-icon-size: 20px;
  }
  .car-icon-btn.active {
    border-color: var(--primary-color);
    background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.1);
  }
  .car-icon-btn:hover {
    border-color: var(--primary-color);
  }
  .car-icon-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 6px 8px;
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    border-radius: 8px;
    border: 1px solid var(--divider-color);
  }
  .car-icon-option {
    background: none;
    border: 1px solid transparent;
    border-radius: 6px;
    color: var(--secondary-text-color);
    cursor: pointer;
    padding: 6px;
    min-width: 32px;
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--ha-animation-duration-fast, 150ms) ease;
    --mdc-icon-size: 20px;
  }
  .car-icon-option:hover {
    background: var(--card-background-color, #fff);
    color: var(--primary-color);
    border-color: var(--divider-color);
  }
  .car-icon-option.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }
`;async function Bt(e,t,n){if(!e?.callWS)return null;try{let r=await e.callWS({type:t});if(r?.version&&r.version!==n)return r.version}catch{}return null}async function Vt(){try{if(typeof window<`u`&&`caches`in window){let e=await caches.keys();await Promise.all(e.map(e=>caches.delete(e)))}}catch{}location.reload()}function Ht(e){if(!e.mismatchVersion)return z;if(e.stuck)return I`
      <div class="version-notice" role="alert" aria-live="assertive">
        <span>${e.t(`version_reload_stuck`)}</span>
        <button
          class="version-reload-btn"
          type="button"
          @click=${e.onDismiss}
        >
          ${e.t(`version_dismiss`)}
        </button>
      </div>
    `;let t=e.t(`version_update`,{v:e.mismatchVersion});return I`
    <div class="version-notice" role="alert" aria-live="assertive">
      <span>${t}</span>
      <button
        class="version-reload-btn"
        type="button"
        @click=${e.onReload}
      >
        ${e.t(`version_reload`)}
      </button>
    </div>
  `}function Ut(e){return typeof e==`string`&&/^https?:\/\//i.test(e)?e:``}function Wt(e){return typeof e==`string`?e.startsWith(`geo:0,0?q=`)?e:Ut(e):``}function Gt(e,t){return/iPhone|iPad|iPod/.test(e)||/Macintosh/.test(e)&&t>1?`ios`:/Android/.test(e)?`android`:`desktop`}function Kt(e,t){return e===`google`||e===`apple`?e:t===`ios`?`apple`:t===`android`?`geo`:`google`}function qt(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0}))}function Z(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}function Jt(e){return e.replace(/[<>"'&]/g,``).slice(0,50).trim()}const Yt={text:{}};let Q=class extends H{constructor(...e){super(...e),this._config={type:`tankstellen-austria-card`},this._expandedCarIcon=null,this._pendingRemove=null,this._pmDraft=``,this._copiedPulse=!1,this._computeLabel=e=>{let t=`ui.panel.lovelace.editor.card.generic.${e.name}`,n=this.hass?.localize?.(t);if(n)return n;let r=this._et(e.name);return r===`editor.${e.name}`?e.name:r},this._computeHelper=e=>{let t=`${e.name}_helper`,n=this._et(t);return n===`editor.${t}`?void 0:n},this._onFormChanged=e=>{let t=e.detail.value,n={...this._config,...t};n.map_provider===`auto`&&delete n.map_provider,this._config=n,qt(this,`config-changed`,{config:n})}}setConfig(e){this._config={...e}}disconnectedCallback(){super.disconnectedCallback(),this._copiedTimeout!==void 0&&(clearTimeout(this._copiedTimeout),this._copiedTimeout=void 0)}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_et(e,t){return dt(`editor.${e}`,this._ctx(),t)}_ct(e,t){return dt(`card.${e}`,this._ctx(),t)}_fireChanged(){qt(this,`config-changed`,{config:{...this._config}})}_schema(){let e=this._config.show_history!==!1,t=this._config.show_cars===!0,n=this._config.show_payment_methods!==!1,r=this._config.payment_filter??[],i=[{name:`entities`,selector:{entity:{multiple:!0,filter:{domain:`sensor`,integration:`tankstellen_austria`}}}},{type:`expandable`,name:`display`,title:this._et(`section_display`),flatten:!0,schema:[{name:`max_stations`,selector:{number:{min:0,max:5,step:1,mode:`slider`}}},{name:`hide_header`,selector:{boolean:{}}},{name:`hide_header_price`,selector:{boolean:{}}},{name:`show_index`,selector:{boolean:{}}},{name:`show_map_links`,selector:{boolean:{}}},{name:`map_provider`,selector:{select:{mode:`dropdown`,options:[{value:`auto`,label:this._et(`map_provider_auto`)},{value:`google`,label:this._et(`map_provider_google`)},{value:`apple`,label:this._et(`map_provider_apple`)}]}}},{name:`show_distance`,selector:{boolean:{}}},{name:`sort_by_distance`,selector:{boolean:{}}},{name:`show_opening_hours`,selector:{boolean:{}}},{name:`show_payment_methods`,selector:{boolean:{}}},{name:`show_history`,selector:{boolean:{}}}]}];e&&i.push({type:`expandable`,name:`history_options`,title:this._et(`section_history`),flatten:!0,schema:[{name:`show_median_line`,selector:{boolean:{}}},{name:`show_hour_envelope`,selector:{boolean:{}}},{name:`show_noon_markers`,selector:{boolean:{}}},{name:`show_minmax`,selector:{boolean:{}}},{name:`show_best_refuel`,selector:{boolean:{}}}]});{let e=[{name:`show_cars`,selector:{boolean:{}}}];t&&e.push({name:`show_car_fillup`,selector:{boolean:{}}},{name:`show_car_consumption`,selector:{boolean:{}}}),i.push({type:`expandable`,name:`cars_options`,title:this._et(`section_cars`),flatten:!0,schema:e})}return n&&r.length>0&&i.push({type:`expandable`,name:`payment_options`,title:this._et(`section_payment_filter`),flatten:!0,schema:[{name:`payment_highlight_mode`,selector:{boolean:{}}}]}),i.push({type:`expandable`,name:`branding`,title:this._et(`section_branding`),flatten:!0,schema:[{name:`logo_adapt_to_theme`,selector:{boolean:{}}},{name:`hide_attribution`,selector:{boolean:{}}}]}),i}render(){let e=this._config.show_history!==!1,t=this._config.show_best_refuel!==!1,n=e&&t,r=(this._config.entities??[]).filter(e=>!!this.hass&&!this.hass.states[e]);return I`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${{map_provider:`auto`,...this._config}}
          .schema=${this._schema()}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._onFormChanged}
        ></ha-form>

        ${r.map(e=>I`
            <ha-alert alert-type="warning">
              ${this._et(`entity_missing`,{entity:e})}
            </ha-alert>
          `)}

        ${n?this._renderRecorderHint():z}
        ${this._renderTabLabelsSection()}
        ${this._renderPaymentChipsSection()}
        ${this._renderCarsRosterSection()}
      </div>
    `}_renderRecorderHint(){let e=`recorder:
  purge_keep_days: 30`,t=this._copiedPulse?this._et(`copied`):this._et(`copy`);return I`
      <div class="recorder-hint">
        <div class="recorder-hint-text">${this._et(`recorder_hint_intro`)}</div>
        <pre class="recorder-snippet"><code>${e}</code></pre>
        <div class="recorder-hint-actions">
          <button
            class="recorder-copy-btn"
            type="button"
            aria-label=${this._et(`copy_sensor_id`)}
            @click=${()=>this._onCopyRecorderSnippet(e)}
          >
            <ha-icon icon="mdi:content-copy" aria-hidden="true"></ha-icon>
            <span class="recorder-copy-label">${t}</span>
          </button>
          <a
            class="recorder-docs-link"
            href="https://www.home-assistant.io/integrations/recorder/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ha-icon icon="mdi:open-in-new" aria-hidden="true"></ha-icon>
            <span>${this._et(`recorder_hint_docs`)}</span>
          </a>
        </div>
      </div>
    `}_renderTabLabelsSection(){if(!this.hass)return z;let e=(this._config.entities??[]).map(e=>({eid:e,state:this.hass.states[e]})).filter(e=>!!e.state);if(e.length<2)return z;let t=this._config.tab_labels??{};return I`
      <div class="editor-section">
        <div class="section-header">${this._et(`section_tab_labels`)}</div>
        ${e.map(({eid:e,state:n})=>{let r=pt(n.attributes?.fuel_type??``,this._ctx());if(n.attributes?.dynamic_mode===!0){let e=n.attributes.dynamic_tracker_label;e&&(r+=` · ${e}`)}let i=typeof t[e]==`string`?t[e]:``,a=`tablbl-${e.replace(/[^a-z0-9_-]/gi,`-`)}`;return I`
            <div class="tab-label-row">
              <label class="tab-label-default" for=${a} title=${r}>${r}</label>
              <input
                id=${a}
                class="tab-label-input"
                type="text"
                autocomplete="off"
                maxlength="50"
                placeholder=${r}
                .value=${i}
                @click=${this._stop}
                @pointerdown=${this._stop}
                @keydown=${this._stop}
                @keyup=${this._stop}
                @keypress=${this._stop}
                @change=${t=>this._onTabLabelChange(e,t)}
              />
            </div>
          `})}
        <div class="editor-hint">${this._et(`tab_labels_hint`)}</div>
      </div>
    `}_collectApiPaymentKeys(){let e=new Set([`cash`,`debit_card`,`credit_card`]);if(!this.hass)return e;for(let t of this._config.entities??[]){let n=this.hass.states[t]?.attributes?.stations??[];for(let t of n)for(let n of t.payment_methods?.others??[])e.add(n)}return e}_renderPaymentChipsSection(){if(this._config.show_payment_methods===!1)return z;let e=this._collectApiPaymentKeys(),t=this._config.payment_filter??[],n=new Set(e);for(let e of t)n.add(e);return I`
      <div class="editor-section">
        <div class="section-header">${this._et(`section_payment_filter`)}</div>
        <div class="pm-filter-chips">
          ${[...n].map(n=>this._renderPaymentChip(n,t,e))}
        </div>
        <div class="pm-custom-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${Yt}
            .value=${this._pmDraft}
            .label=${this._et(`payment_filter_custom_placeholder`)}
            .required=${!1}
            @value-changed=${this._onCustomPmChanged}
            @keydown=${this._onCustomPmKeydown}
            @keyup=${this._stop}
            @keypress=${this._stop}
          ></ha-selector>
          <ha-icon-button
            .label=${this._et(`payment_filter_add_custom`)}
            title=${this._et(`payment_filter_add_custom`)}
            @click=${this._onAddCustomPm}
          >
            <ha-icon icon="mdi:plus-circle" aria-hidden="true"></ha-icon>
          </ha-icon-button>
        </div>
        <div class="editor-hint">${this._et(`payment_filter_custom_hint`)}</div>
      </div>
    `}_renderPaymentChip(e,t,n){let r=t.includes(e),i=e===this._pendingRemove,a=!n.has(e),o=e===`cash`?this._ct(`cash`):e===`debit_card`?this._ct(`debit_card`):e===`credit_card`?this._ct(`credit_card`):e;return I`
      <button
        class=${W({"pm-filter-chip":!0,active:r,confirm:i})}
        type="button"
        aria-pressed=${r?`true`:`false`}
        @click=${()=>this._togglePaymentChip(e,a)}
      >
        ${i?`✕ ${o}?`:o}
      </button>
    `}_renderCarsRosterSection(){if(this._config.show_cars!==!0)return z;let e=this._config.show_car_fillup!==!1,t=this._config.show_car_consumption!==!1,n=this._config.cars??[];return I`
      <div class="editor-section">
        <div class="section-header">${this._et(`section_cars`)}</div>
        ${!e&&!t?I`<div class="editor-hint">${this._et(`cars_both_off_hint`)}</div>`:z}
        ${n.map((e,t)=>this._renderCarRow(e,t))}
        <button class="car-add-btn" type="button" @click=${this._onAddCar}>
          ${this._et(`add_car`)}
        </button>
      </div>
    `}_renderCarRow(e,t){let n=this._expandedCarIcon===t,r=e.icon||`mdi:car`,i=`tsa-car-icon-picker-${t}`,a=e.tank_size!=null&&(e.tank_size<1||e.tank_size>200),o=e.consumption!=null&&(e.consumption<0||e.consumption>30),s=`tsa-car-tank-err-${t}`,c=`tsa-car-consumption-err-${t}`;return I`
      <div class="car-editor-group">
        <div class="car-editor-row">
          <button
            class=${W({"car-icon-btn":!0,active:n})}
            type="button"
            aria-label=${this._et(`car_choose_icon`)}
            aria-expanded=${n?`true`:`false`}
            aria-controls=${i}
            title=${this._et(`car_choose_icon`)}
            @click=${e=>this._onToggleIconPicker(e,t)}
          >
            <ha-icon icon=${r} aria-hidden="true"></ha-icon>
          </button>
          <input
            class="car-input car-name-input"
            type="text"
            autocomplete="off"
            aria-label=${this._et(`car_name_placeholder`)}
            placeholder=${this._et(`car_name_placeholder`)}
            .value=${e.name??``}
            @click=${this._stop}
            @pointerdown=${this._stop}
            @keydown=${this._stop}
            @keyup=${this._stop}
            @keypress=${this._stop}
            @change=${e=>this._onCarFieldChange(t,`name`,e)}
          />
          <select
            class="car-select"
            aria-label=${this._et(`car_fuel_type`)}
            @click=${this._stop}
            @pointerdown=${this._stop}
            @change=${e=>this._onCarFieldChange(t,`fuel_type`,e)}
          >
            ${[`DIE`,`SUP`,`GAS`].map(t=>I`
                <option value=${t} ?selected=${e.fuel_type===t}>
                  ${pt(t,this._ctx())}
                </option>
              `)}
          </select>
          <input
            class="car-input car-tank-input"
            type="number"
            min="1"
            max="200"
            autocomplete="off"
            aria-label=${this._et(`car_tank_placeholder`)}
            aria-invalid=${a?`true`:`false`}
            aria-describedby=${a?s:z}
            placeholder=${this._et(`car_tank_placeholder`)}
            .value=${e.tank_size==null?``:String(e.tank_size)}
            @click=${this._stop}
            @pointerdown=${this._stop}
            @keydown=${this._stop}
            @keyup=${this._stop}
            @keypress=${this._stop}
            @change=${e=>this._onCarFieldChange(t,`tank_size`,e)}
          />
          <input
            class="car-input car-consumption-input"
            type="number"
            min="0"
            max="30"
            step="0.1"
            autocomplete="off"
            aria-label=${this._et(`car_consumption_placeholder`)}
            aria-invalid=${o?`true`:`false`}
            aria-describedby=${o?c:z}
            placeholder=${this._et(`car_consumption_placeholder`)}
            .value=${e.consumption==null?``:String(e.consumption)}
            @click=${this._stop}
            @pointerdown=${this._stop}
            @keydown=${this._stop}
            @keyup=${this._stop}
            @keypress=${this._stop}
            @change=${e=>this._onCarFieldChange(t,`consumption`,e)}
          />
          <button
            class="car-delete-btn"
            type="button"
            aria-label=${this._et(`car_delete`)}
            title=${this._et(`car_delete`)}
            @click=${e=>this._onDeleteCar(e,t)}
          >
            <ha-icon icon="mdi:delete-outline" aria-hidden="true"></ha-icon>
          </button>
        </div>
        ${a?I`<ha-alert
              id=${s}
              alert-type="error"
            >${this._et(`tank_size_range_error`)}</ha-alert>`:z}
        ${o?I`<ha-alert
              id=${c}
              alert-type="error"
            >${this._et(`consumption_range_error`)}</ha-alert>`:z}
        ${n?I`
              <div id=${i} class="car-icon-picker">
                ${Fe.map(e=>I`
                    <button
                      class=${W({"car-icon-option":!0,active:r===e})}
                      type="button"
                      aria-label=${e.replace(`mdi:`,``)}
                      aria-pressed=${r===e?`true`:`false`}
                      title=${e.replace(`mdi:`,``)}
                      @click=${n=>this._onPickCarIcon(n,t,e)}
                    >
                      <ha-icon icon=${e} aria-hidden="true"></ha-icon>
                    </button>
                  `)}
              </div>
            `:z}
      </div>
    `}_stop(e){e.stopPropagation()}async _onCopyRecorderSnippet(e){try{await navigator.clipboard.writeText(e),this._copiedPulse=!0,this._copiedTimeout!==void 0&&clearTimeout(this._copiedTimeout),this._copiedTimeout=window.setTimeout(()=>{this._copiedPulse=!1,this._copiedTimeout=void 0},1500)}catch{}}_onTabLabelChange(e,t){t.stopPropagation();let n=t.target,r=Jt(n.value),i={...this._config.tab_labels??{}};r?i[e]=r:delete i[e];let a={...this._config};Object.keys(i).length?a.tab_labels=i:delete a.tab_labels,this._config=a,this._fireChanged()}_togglePaymentChip(e,t){let n=[...this._config.payment_filter??[]],r=n.includes(e);if(r&&t){this._pendingRemove===e?(this._pendingRemove=null,this._config={...this._config,payment_filter:n.filter(t=>t!==e)},this._fireChanged()):this._pendingRemove=e;return}this._pendingRemove=null;let i=r?n.filter(t=>t!==e):[...n,e];this._config={...this._config,payment_filter:i},this._fireChanged()}_onCustomPmChanged(e){e.stopPropagation(),this._pmDraft=e.detail?.value??``}_onCustomPmKeydown(e){e.stopPropagation(),e.key===`Enter`&&this._onAddCustomPm()}_onAddCustomPm(){let e=Jt(this._pmDraft);if(!e)return;this._pendingRemove=null;let t=[...this._config.payment_filter??[]];t.includes(e)||(t.push(e),this._config={...this._config,payment_filter:t},this._fireChanged()),this._pmDraft=``}_onToggleIconPicker(e,t){e.stopPropagation(),this._expandedCarIcon=this._expandedCarIcon===t?null:t}_onPickCarIcon(e,t,n){e.stopPropagation();let r=[...this._config.cars??[]];r[t]&&(r[t]={...r[t],icon:n},this._config={...this._config,cars:r},this._expandedCarIcon=null,this._fireChanged())}_onCarFieldChange(e,t,n){n.stopPropagation();let r=n.target.value,i=[...this._config.cars??[]],a=i[e];if(!a)return;let o={...a};if(t===`consumption`){let e=r.trim();if(e===``)delete o.consumption;else{let t=parseFloat(e);Number.isFinite(t)&&t>0?o.consumption=Math.round(t*10)/10:delete o.consumption}}else if(t===`tank_size`){let e=parseInt(r,10);o.tank_size=Math.min(200,Math.max(1,Number.isFinite(e)?e:1))}else t===`fuel_type`?[`DIE`,`SUP`,`GAS`].includes(r)&&(o.fuel_type=r):o.name=Jt(r);i[e]=o,this._config={...this._config,cars:i},this._fireChanged()}_onDeleteCar(e,t){e.stopPropagation();let n=[...this._config.cars??[]];n.splice(t,1),this._config={...this._config,cars:n},this._expandedCarIcon===t?this._expandedCarIcon=null:this._expandedCarIcon!=null&&this._expandedCarIcon>t&&--this._expandedCarIcon,this._fireChanged()}_onAddCar(e){e.stopPropagation();let t=[...this._config.cars??[]];t.push({name:``,fuel_type:`DIE`,tank_size:50,icon:`mdi:car`}),this._config={...this._config,cars:t},this._fireChanged()}static{this.styles=zt}};Z([Ae({attribute:!1})],Q.prototype,`hass`,void 0),Z([U()],Q.prototype,`_config`,void 0),Z([U()],Q.prototype,`_expandedCarIcon`,void 0),Z([U()],Q.prototype,`_pendingRemove`,void 0),Z([U()],Q.prototype,`_pmDraft`,void 0),Z([U()],Q.prototype,`_copiedPulse`,void 0),Q=Z([De(`tankstellen-austria-card-editor`)],Q),window.customCards=window.customCards||[],window.customCards.push({type:`tankstellen-austria-card`,name:`Tankstellen Austria`,description:`Austrian fuel prices from E-Control with sparklines and best-refuel analytics.`,preview:!0,documentationURL:`https://github.com/rolandzeiner/tankstellen-austria`,getEntitySuggestion:(e,t)=>!t.startsWith(`sensor.`)||e?.entities?.[t]?.platform!==`tankstellen_austria`?null:{config:{type:`custom:tankstellen-austria-card`,entities:[t]}}});let $=class extends H{constructor(...e){super(...e),this._activeTab=0,this._expandedStations=new Set,this._history={},this._versionMismatch=null,this._lastManualRefresh=0,this._noNewData=!1,this._historyError=!1,this._cooldownTick=0,this._initDone=!1,this._onDismissVersionBanner=()=>{this._versionMismatch=null},this._onVersionReload=async()=>{if(this._versionMismatch)try{sessionStorage.setItem(`tsa-reload-attempted-${this._versionMismatch}`,`1`)}catch{}await Vt()}}static getConfigElement(){return document.createElement(`tankstellen-austria-card-editor`)}static getStubConfig(e){let t=ze(e);return{entities:t.length?[t[0]]:[],max_stations:5,show_index:!0,show_map_links:!0,show_distance:!0,show_opening_hours:!0,show_payment_methods:!0,show_history:!0,show_minmax:!0,show_best_refuel:!0,payment_filter:[],payment_highlight_mode:!0,show_cars:!1,cars:[]}}setConfig(e){if(!e||typeof e!=`object`||Array.isArray(e))throw Error(`tankstellen-austria-card: config must be an object`);let t=e.entities;if(t!==void 0&&typeof t!=`string`&&!Array.isArray(t))throw Error(`tankstellen-austria-card: config.entities must be a string or array of entity IDs`);if(this._config=Re(e),this._config.entities){let e={},t=!1;for(let n of this._config.entities){let r=vt(n);r.length>=2&&(e[n]=r,t=!0)}t&&(this._history={...this._history,...e})}}getCardSize(){return 6}getGridOptions(){return{columns:12,rows:`auto`,min_columns:6,min_rows:4}}shouldUpdate(e){if(!this._config)return!1;if(e.has(`_config`)||e.has(`_activeTab`)||e.has(`_expandedStations`)||e.has(`_history`)||e.has(`_historyError`)||e.has(`_versionMismatch`)||e.has(`_lastManualRefresh`)||e.has(`_noNewData`)||e.has(`_cooldownTick`))return!0;let t=e.get(`hass`);return!t||this._trackedEntityIds().some(e=>t.states[e]!==this.hass.states[e])}_trackedEntityIds(){return this._config.entities?.length?this._config.entities:ze(this.hass)}_resolveEntities(){return this.hass?this._trackedEntityIds().map(e=>{let t=this.hass.states[e];return t?{entity_id:e,state:t.state,attributes:t.attributes,last_updated:t.last_updated}:null}).filter(e=>e!==null):[]}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_t(e,t){return dt(`card.${e}`,this._ctx(),t)}disconnectedCallback(){super.disconnectedCallback(),this._historyInterval!==void 0&&(clearInterval(this._historyInterval),this._historyInterval=void 0),this._cooldownInterval!==void 0&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),this._postRefreshTimeout!==void 0&&(clearTimeout(this._postRefreshTimeout),this._postRefreshTimeout=void 0),this._cooldownTimeout!==void 0&&(clearTimeout(this._cooldownTimeout),this._cooldownTimeout=void 0),this._sparklineCleanup&&=(this._sparklineCleanup(),void 0),this._initDone=!1}updated(e){!this._initDone&&this.hass&&this._config&&(this._initDone=!0,this._fetchAllHistory(),this._historyInterval=window.setInterval(()=>{this._fetchAllHistory()},18e5),this._checkCardVersion()),this._reattachSparklineHover()}async _fetchAllHistory(){try{let e=this._resolveEntities();await Promise.all(e.map(async e=>{let t=await _t(this.hass,e.entity_id);this._history={...this._history,[e.entity_id]:t}})),this._historyError=!1}catch(e){console.warn(`[Tankstellen Austria] history refresh failed`,e),this._historyError=!0}}async _checkCardVersion(){let e=await Bt(this.hass,`tankstellen_austria/card_version`,`1.10.0`);e&&(this._versionMismatch=e)}_reattachSparklineHover(){this._sparklineCleanup&&=(this._sparklineCleanup(),void 0);let e=this.shadowRoot?.querySelector(`.sparkline-container[data-entity]`);if(!e)return;let t=ft(this._ctx()),n=ut(this._ctx()),r=e=>{let r=new Date(e);return`${t[r.getDay()]?.slice(0,2)??``} ${n===`de`?`${r.getDate()}.${r.getMonth()+1}.`:`${r.getMonth()+1}/${r.getDate()}`} ${String(r.getHours()).padStart(2,`0`)}:${String(r.getMinutes()).padStart(2,`0`)}`};this._sparklineCleanup=Et(e,{formatTime:r,formatPrice:G})}render(){if(!this.hass||!this._config)return I`
        <ha-card>
          <div class="empty" role="status" aria-live="polite">
            ${this._t(`loading`)}
          </div>
          ${this._renderFooter(void 0)}
        </ha-card>
      `;let e=this._resolveEntities(),t=this._activeTab>=e.length?0:this._activeTab;if(!e.length)return I`
        <ha-card>
          ${this._renderVersionBanner()}
          <div class="empty">${this._t(`no_data`)}</div>
          ${this._renderFooter(void 0)}
        </ha-card>
      `;let n=e[t]??e[0],r=n.attributes.attribution;return I`
      <ha-card>
        ${this._renderTabs(e,t)}
        <div class="wrap">
          ${this._renderVersionBanner()}
          ${this._historyError?I`<ha-alert alert-type="warning" role="alert">
                ${this._t(`history_fetch_error`)}
              </ha-alert>`:z}
          <section
            class="station-section"
            style="--tankst-accent: var(--primary-color);"
          >
            ${this._renderHeader(n)}
            ${this._renderHero(n)}
            ${this._renderSparklineBlock(n)}
            ${this._renderCars(n)}
          </section>
          ${this._renderStationList(n,t)}
        </div>
        ${this._renderFooter(r)}
      </ha-card>
    `}_renderFooter(e){if(this._config?.hide_attribution===!0)return z;let t=this._config?.logo_adapt_to_theme===!0,n=!!this.hass?.themes?.darkMode,r=t?`brand-logo adaptive ${n?`adaptive-dark`:`adaptive-light`}`:`brand-logo`,i=e&&e.includes(`E-Control`)?e:`Datenquelle: E-Control`;return I`
      <div class="footer">
        <a
          class="brand-link"
          href=${Ut(`https://www.e-control.at/`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="E-Control"
          @click=${e=>e.stopPropagation()}
        >
          <img
            class=${r}
            src=${`/tankstellen-austria/e-control_logo.svg`}
            alt="E-Control"
          />
        </a>
        <span class="attribution-text">${i}</span>
      </div>
    `}_renderVersionBanner(){let e=this._versionMismatch!==null&&typeof sessionStorage<`u`&&sessionStorage.getItem(`tsa-reload-attempted-${this._versionMismatch}`)===`1`;return Ht({mismatchVersion:this._versionMismatch,stuck:e,t:(e,t)=>this._t(e,t),onReload:this._onVersionReload,onDismiss:this._onDismissVersionBanner})}_renderTabs(e,t){if(e.length<=1)return z;let n=this._config.tab_labels??{};return I`
      <div class="tabs" role="tablist">
        ${e.map((r,i)=>{let a=n[r.entity_id],o;if(typeof a==`string`&&a.trim().length>0)o=a;else if(o=pt(r.attributes.fuel_type??``,this._ctx()),r.attributes.dynamic_mode===!0){let e=r.attributes.dynamic_tracker_label;e&&(o+=` · ${e}`)}let s=i===t;return I`
            <button
              type="button"
              role="tab"
              class=${W({tab:!0,active:s})}
              aria-selected=${s?`true`:`false`}
              tabindex=${s?`0`:`-1`}
              @click=${()=>this._onTabClick(i)}
              @keydown=${t=>this._onTabKeydown(t,i,e.length)}
            >
              ${o}
            </button>
          `})}
      </div>
    `}_renderHeader(e){if(this._config?.hide_header===!0)return z;let t=e.attributes.fuel_type??``,n=e.attributes.fuel_type_name||pt(t,this._ctx()),r=e.attributes.dynamic_mode===!0,i=null;return r&&(i=e.attributes.dynamic_tracker_label??null),I`
      <header class="header">
        <div class="icon-tile" aria-hidden="true">
          <ha-icon icon="mdi:gas-station"></ha-icon>
        </div>
        <div class="header-text">
          <h2 class="title">${n}</h2>
          ${i?I`<p class="subtitle">${i}</p>`:z}
        </div>
        ${r?I`
              <div class="header-actions">
                ${this._renderRefreshButton()}
                ${this._renderDynamicChips(e)}
              </div>
            `:z}
      </header>
    `}_renderDynamicChips(e){let t=!!e.last_updated;return!t&&!this._noNewData?z:I`
      <div class="chip-row" aria-live="polite">
        ${t?I`<span class="chip muted">
              <ha-icon icon="mdi:clock-outline" aria-hidden="true"></ha-icon>
              <ha-relative-time
                .hass=${this.hass}
                .datetime=${new Date(e.last_updated)}
              ></ha-relative-time>
            </span>`:z}
        ${this._noNewData?I`<span class="chip warn" role="status">
              <ha-icon icon="mdi:alert-circle-outline" aria-hidden="true"></ha-icon>
              ${this._t(`no_new_data`)}
            </span>`:z}
      </div>
    `}_renderRefreshButton(){let e=Pe-(Date.now()-this._lastManualRefresh),t=e>0,n=t?(()=>{let t=Math.ceil(e/1e3);return`${Math.floor(t/60)}:${String(t%60).padStart(2,`0`)}`})():``;return I`
      <button
        class=${W({"btn-primary":!0,cooling:t})}
        type="button"
        aria-label=${this._t(`refresh`)}
        aria-disabled=${t?`true`:`false`}
        @click=${this._onRefresh}
      >
        <ha-icon icon="mdi:refresh" aria-hidden="true"></ha-icon>
        <span>${t?n:this._t(`refresh`)}</span>
      </button>
    `}_renderHero(e){let t=e.attributes.stations??[];if(!t.length)return z;let n=e.attributes.dynamic_mode===!0,r=t[0]?.price,i=e.attributes.average_price;return n||this._config.hide_header_price===!0||r==null?z:I`
      <div class="hero">
        <div class="metric">
          <div class="metric-value">
            <span class="metric-num">${G(r)}</span>
            ${i==null?z:I`<span class="metric-of"
                  >/ ${G(i)} ${this._t(`average`)}</span
                >`}
          </div>
          <div class="metric-label">${this._t(`cheapest`)}</div>
        </div>
      </div>
    `}_renderSparklineBlock(e){return e.attributes.dynamic_mode===!0||this._config.show_history===!1?z:this._renderSparkline(e)}_renderSparkline(e){let t=e.entity_id,n=this._history[t]??[];if(n.length<2)return z;let r=this._config.show_median_line===!0,i=this._config.show_hour_envelope===!0,a=this._config.show_noon_markers===!0,o=this._config.show_minmax!==!1,s=i?Lt(n):null,c=this._config.show_best_refuel===!1?null:It(n),l=Tt({points:n,showMedianLine:r,showHourEnvelope:i,showNoonMarkers:a,showMinMax:o,hourEnvelope:s,analysis:c,translations:{min_label:this._t(`min_label`),max_label:this._t(`max_label`),last_7_days:this._t(`last_7_days`),median_delta_below:this._t(`median_delta_below`),median_delta_above:this._t(`median_delta_above`),median_delta_equal:this._t(`median_delta_equal`),sparkline_aria_summary:this._t(`sparkline_aria_summary`),sparkline_aria_simple:this._t(`sparkline_aria_simple`)}});return l.template===z?z:I`
      <div
        class="sparkline-container"
        data-entity=${t}
        role="button"
        tabindex="0"
        aria-label=${this._t(`sparkline_open_more_info`)}
        @click=${()=>this._onSparklineClick(t)}
        @keydown=${e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this._onSparklineClick(t))}}
      >
        ${l.template}
        ${this._renderRecommendation(c)}
      </div>
    `}_renderRecommendation(e){if(!e)return z;if(!e.hasEnoughData)return I`
        <div class="refuel-hint">
          <ha-icon icon="mdi:information-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
          ${this._t(`not_enough_data_hint`)}
        </div>
      `;let t=e.hour??0,n=e.hour_end??(t+1)%24,r=String(t).padStart(2,`0`),i=String(n).padStart(2,`0`),a;if(e.weekday!=null){let t=ft(this._ctx())[e.weekday]??``;a=this._t(`best_refuel_hour_weekday`,{h1:r,h2:i,day:t})}else a=this._t(`best_refuel_hour`,{h1:r,h2:i});let o=e.confidence;if(!o)return I`
        <div class="refuel-recommendation">
          <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
          <span class="refuel-text">${a}</span>
        </div>
      `;let s=this._t(`confidence_${o.level}`),c=[`${this._t(`confidence_title`)}: ${s}`,`${this._t(`confidence_span`)}: ${o.span_days} ${this._t(`confidence_days`)}`,`${this._t(`confidence_coverage`)}: ${o.coverage_pct}%`,`${this._t(`confidence_gap`)}: ${o.gap_cents.toFixed(1)} ${this._t(`confidence_cents`)}`];o.span_days<14&&c.push(this._t(`confidence_short_history_hint`));let l=c.join(`. `),u=`refuel-confidence refuel-confidence-${o.level}`;return I`
      <div class="refuel-recommendation">
        <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
        <span class="refuel-text">${a}</span>
        <span
          class=${u}
          title=${l}
          aria-label=${l}
        >${s}</span>
      </div>
    `}_renderCars(e){let t=e.attributes.stations??[];if(!t.length)return z;let n=this._config.show_cars===!0,r=this._config.show_car_fillup!==!1,i=this._config.show_car_consumption!==!1;if(!n||!r&&!i)return z;let a=e.attributes.fuel_type??``,o=this._config.payment_filter??[],s=this._config.payment_highlight_mode===!0,c=(this._config.cars??[]).filter(e=>e.fuel_type===a&&e.tank_size>0&&e.name),l=r?c:c.filter(e=>Number(e.consumption)>0);if(!l.length)return z;let u=s?t:t.filter(e=>He(e,o)),d=s?t[0]?.price:u[0]?.price;return I`
      <div class="cars-fillup">
        ${l.map(e=>this._renderCarRow(e,d,r,i))}
      </div>
    `}_renderCarRow(e,t,n,r){let i=Number(e.consumption),a=Number.isFinite(i)&&i>0?i.toFixed(1).replace(`.`,`,`):``;if(n){let n=t==null?`–`:`€ ${(t*Number(e.tank_size)).toFixed(2).replace(`.`,`,`)}`,o=t!=null&&i>0?`€ ${(t*i).toFixed(2).replace(`.`,`,`)}`:`–`;return I`
        <div class="car-fillup-row">
          <span class="car-fillup-name">
            <ha-icon icon=${e.icon||`mdi:car`} class="car-icon" aria-hidden="true"></ha-icon>
            ${e.name}
            <span class="car-fillup-liters">${e.tank_size} L</span>
          </span>
          <span class="car-fillup-cost">${n}</span>
        </div>
        ${r&&i>0?I`
              <div class="car-per100-row">
                <span class="car-per100-label">${a} l/100 km</span>
                <span class="car-per100-cost">${o} / 100 km</span>
              </div>
            `:z}
      `}let o=t==null?`–`:`€ ${(t*i).toFixed(2).replace(`.`,`,`)}`;return I`
      <div class="car-fillup-row">
        <span class="car-fillup-name">
          <ha-icon icon=${e.icon||`mdi:car`} class="car-icon" aria-hidden="true"></ha-icon>
          ${e.name}
          <span class="car-fillup-liters">${a} l/100 km</span>
        </span>
        <span class="car-fillup-cost">${o} / 100 km</span>
      </div>
    `}_renderStationList(e,t){let n=e.attributes.stations??[],r=parseInt(String(this._config.max_stations),10),i=Number.isFinite(r)?Math.max(0,Math.min(5,r)):5,a=this._config.payment_filter??[],o=this._config.payment_highlight_mode===!0,s=o?n:n.filter(e=>He(e,a));if(i===0)return z;if(!s.length&&a.length&&n.length)return I`
        <div class="empty">
          ${this._t(`payment_filter_active`)} — ${this._t(`no_data`)}
        </div>
      `;if(!s.length)return I`<div class="empty">${this._t(`no_data`)}</div>`;let c=(this._config.sort_by_distance===!0?[...s].sort((e,t)=>(e.distance_m??1/0)-(t.distance_m??1/0)):s).slice(0,i);return I`
      <div class="stations">
        ${c.map((e,n)=>this._renderStation(e,n,t,a,o))}
      </div>
    `}_renderStation(e,t,n,r,i){let a=this._config.show_index!==!1,o=this._config.show_map_links!==!1,s=this._config.show_distance===!0,c=this._config.show_opening_hours!==!1,l=this._config.show_payment_methods!==!1,u=e.location??{},d=`${n}|${e.name??``}|${u.address??``}`,f=this._expandedStations.has(d),p=e.open===!1,m=!p&&We(e),h=i&&r.length>0&&He(e,r),g=h?Ue(e,r,{cash:this._t(`cash`),debit_card:this._t(`debit_card`),credit_card:this._t(`credit_card`)}):[],_=c&&!!e.opening_hours?.length,v=l&&Be(e.payment_methods),y=_||v,b=[e.name||`–`,u.city??``,G(e.price)].filter(Boolean).join(`, `),x=y?`tsa-station-detail-${n}-${t}`:void 0,S=!!e.name,C=u.city??``,w=u.address??``,T=[u.postalCode,C].filter(e=>e!=null&&e!==``).join(` `),E=T?I`<span lang="de">${T}</span>`:z,D=w?I`<span lang="de">${w}</span>`:z,O=E!==z&&D!==z?`, `:``;return I`
      <div class=${W({station:!0,"pm-highlight":h})}>
        <div
          class="station-main"
          role=${y?`button`:`group`}
          tabindex=${y?`0`:`-1`}
          aria-expanded=${y?f?`true`:`false`:z}
          aria-controls=${x??z}
          aria-label=${b}
          @click=${()=>this._onStationClick(d)}
          @keydown=${e=>this._onStationKeydown(e,d,y)}
        >
          ${a?I`<div class="index-tile" aria-hidden="true">${t+1}</div>`:z}
          <div class="info">
            <div class="name">
              ${S?I`<span lang="de">${e.name}</span>`:`–`}
              ${p?I`<span class="flag closed">${this._t(`closed`)}</span>`:m?I`<span class="flag closing-soon"
                      >${this._t(`closing_soon`)}</span
                    >`:z}
              ${g.map(e=>I`<span class="chip match">${e}</span>`)}
            </div>
            <div class="address">
              ${E}${O}${D}
            </div>
          </div>
          <div class="price">${G(e.price)}</div>
          ${(()=>{let t=z;if(o){let n=Kt(this._config.map_provider??`auto`,Gt(navigator.userAgent,navigator.maxTouchPoints)),r=Wt(Ke(u,e.name??``,n));r&&(t=I`
                  <a
                    class="icon-action map"
                    href=${r}
                    target=${r.startsWith(`geo:`)?`_self`:`_blank`}
                    rel="noopener noreferrer"
                    aria-label=${`${this._t(`map`)}: ${e.name??``}`}
                    title=${this._t(`map`)}
                    @click=${this._onMapLinkClick}
                  >
                    <ha-icon
                      icon=${/\d/.test(u.address??``)?`mdi:map-marker`:`mdi:magnify`}
                      aria-hidden="true"
                    ></ha-icon>
                  </a>
                `)}let n=s&&e.distance_m!=null?I`<span class="distance" lang="de"
                    >${Ge(e.distance_m)}</span
                  >`:z;return t===z&&n===z?z:I`<div
              class=${W({"map-action":!0,"has-distance":n!==z})}
            >
              ${t}${n}
            </div>`})()}
          ${y?I`<ha-icon
                class="expander-chevron"
                icon="mdi:chevron-down"
                aria-hidden="true"
              ></ha-icon>`:z}
        </div>
        ${y?I`
              <div
                id=${x}
                class=${W({"station-detail":!0,expanded:f})}
              >
                <div class="detail-cols">
                  ${_?I`<div class="detail-col">${this._renderHours(e.opening_hours??[])}</div>`:z}
                  ${v?I`<div class="detail-col">${this._renderPaymentMethods(e.payment_methods)}</div>`:z}
                </div>
              </div>
            `:z}
      </div>
    `}_renderHours(e){let t=e.find(e=>e.day===`MO`)??e[0],n=e.find(e=>e.day===`SA`)??e[5],r=e.find(e=>e.day===`SO`)??e[6],i=e.find(e=>e.day===`FE`);return I`
      <div class="hours-grid">
        ${t?I`<span class="day">${this._t(`mon_fri`)}</span><span>${t.from} – ${t.to}</span>`:z}
        ${n?I`<span class="day">${this._t(`sat`)}</span><span>${n.from} – ${n.to}</span>`:z}
        ${r?I`<span class="day">${this._t(`sun`)}</span><span>${r.from} – ${r.to}</span>`:z}
        ${i?I`<span class="day">${this._t(`holiday`)}</span><span>${i.from} – ${i.to}</span>`:z}
      </div>
    `}_renderPaymentMethods(e){if(!e)return z;let t=[];e.cash&&t.push(I`
        <span class="pm-badge">
          <ha-icon icon="mdi:cash" class="pm-icon" aria-hidden="true"></ha-icon>
          ${this._t(`cash`)}
        </span>
      `),e.debit_card&&t.push(I`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon" aria-hidden="true"></ha-icon>
          ${this._t(`debit_card`)}
        </span>
      `),e.credit_card&&t.push(I`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon" aria-hidden="true"></ha-icon>
          ${this._t(`credit_card`)}
        </span>
      `);for(let n of e.others??[])t.push(I`<span class="pm-badge pm-other">${n}</span>`);return t.length?I`
      <div class="pm-section">
        <div class="pm-label">${this._t(`payment`)}</div>
        <div class="pm-badges">${t}</div>
      </div>
    `:z}_onTabClick(e){this._activeTab!==e&&(this._activeTab=e,this._expandedStations=new Set)}_onTabKeydown(e,t,n){let r=t;switch(e.key){case`ArrowRight`:r=(t+1)%n;break;case`ArrowLeft`:r=(t-1+n)%n;break;case`Home`:r=0;break;case`End`:r=n-1;break;default:return}e.preventDefault(),this._onTabClick(r),this.updateComplete.then(()=>{(this.shadowRoot?.querySelectorAll(`.tabs [role="tab"]`))?.[r]?.focus()})}_onStationClick(e){let t=new Set(this._expandedStations);t.has(e)?t.delete(e):t.add(e),this._expandedStations=t}_onStationKeydown(e,t,n){n&&(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this._onStationClick(t))}_onMapLinkClick(e){e.stopPropagation()}_onSparklineClick(e){this.dispatchEvent(new CustomEvent(`hass-more-info`,{detail:{entityId:e},bubbles:!0,composed:!0}))}_onRefresh(){if(!this.hass)return;let e=Date.now();if(e-this._lastManualRefresh<12e4)return;this._lastManualRefresh=e,this._noNewData=!1;let t=this._resolveEntities(),n=(t[this._activeTab]??t[0])?.last_updated;for(let e of t){let t=this.hass.callService(`homeassistant`,`update_entity`,{entity_id:e.entity_id});t&&typeof t.catch==`function`&&t.catch(t=>{console.warn(`[Tankstellen Austria] update_entity failed for`,e.entity_id,t)})}this._postRefreshTimeout!==void 0&&clearTimeout(this._postRefreshTimeout),this._postRefreshTimeout=window.setTimeout(()=>{this._postRefreshTimeout=void 0;try{let e=this._resolveEntities();(e[this._activeTab]??e[0])?.last_updated===n&&(this._noNewData=!0)}catch(e){console.warn(`[Tankstellen Austria] post-refresh check failed`,e)}},3e3),this._cooldownInterval!==void 0&&clearInterval(this._cooldownInterval),typeof window<`u`&&typeof window.matchMedia==`function`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?(this._cooldownTimeout!==void 0&&clearTimeout(this._cooldownTimeout),this._cooldownTimeout=window.setTimeout(()=>{this._cooldownTimeout=void 0,this._cooldownTick=(this._cooldownTick+1)%1e6},Pe)):this._cooldownInterval=window.setInterval(()=>{Date.now()-this._lastManualRefresh>=12e4&&this._cooldownInterval!==void 0&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),this._cooldownTick=(this._cooldownTick+1)%1e6},1e3)}static{this.styles=Rt}};Z([Ae({attribute:!1})],$.prototype,`hass`,void 0),Z([U()],$.prototype,`_config`,void 0),Z([U()],$.prototype,`_activeTab`,void 0),Z([U()],$.prototype,`_expandedStations`,void 0),Z([U()],$.prototype,`_history`,void 0),Z([U()],$.prototype,`_versionMismatch`,void 0),Z([U()],$.prototype,`_lastManualRefresh`,void 0),Z([U()],$.prototype,`_noNewData`,void 0),Z([U()],$.prototype,`_historyError`,void 0),Z([U()],$.prototype,`_cooldownTick`,void 0),$=Z([De(`tankstellen-austria-card`)],$);export{$ as TankstellenAustriaCard};