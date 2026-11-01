/*! Tankstellen Austria Card — bundled by Rolldown. Edit sources in src/, then `npm run build`. */
var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r},n=globalThis,r=n.ShadowRoot&&(n.ShadyCSS===void 0||n.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,i=Symbol(),a=/* @__PURE__ */ new WeakMap,o=class{constructor(e,t,n){
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(r&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=a.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&a.set(t,e))}return e}toString(){return this.cssText}},s=e=>new o(typeof e==`string`?e:e+``,void 0,i),c=(e,...t)=>new o(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,i),l=(e,t)=>{if(r)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let r of t){let t=document.createElement(`style`),i=n.litNonce;i!==void 0&&t.setAttribute(`nonce`,i),t.textContent=r.cssText,e.appendChild(t)}},u=r?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return s(t)})(e):e,{is:d,defineProperty:f,getOwnPropertyDescriptor:p,getOwnPropertyNames:m,getOwnPropertySymbols:h,getPrototypeOf:g}=Object,_=globalThis,v=_.trustedTypes,y=v?v.emptyScript:``,b=_.reactiveElementPolyfillSupport,x=(e,t)=>e,S={toAttribute(e,t){
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
switch(t){case Boolean:e=e?y:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},C=(e,t)=>!d(e,t),w={attribute:!0,type:String,converter:S,reflect:!1,useDefault:!1,hasChanged:C};Symbol.metadata??=Symbol(`metadata`),_.litPropertyMetadata??=/* @__PURE__ */ new WeakMap;var T=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&f(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=p(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(x(`elementProperties`)))return;let e=g(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(x(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(x(`properties`))){let e=this.properties,t=[...m(e),...h(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=/* @__PURE__ */ new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(u(e))}else e!==void 0&&t.push(u(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=/* @__PURE__ */ new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=/* @__PURE__ */ new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=/* @__PURE__ */ new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return l(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?S:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?S:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??C)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=/* @__PURE__ */ new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=/* @__PURE__ */ new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=/* @__PURE__ */ new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};T.elementStyles=[],T.shadowRootOptions={mode:`open`},T[x(`elementProperties`)]=/* @__PURE__ */ new Map,T[x(`finalized`)]=/* @__PURE__ */ new Map,b?.({ReactiveElement:T}),(_.reactiveElementVersions??=[]).push(`2.1.2`);
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var E=globalThis,D=e=>e,O=E.trustedTypes,ee=O?O.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,k=`$lit$`,A=`lit$${Math.random().toFixed(9).slice(2)}$`,te=`?`+A,ne=`<${te}>`,j=document,M=()=>j.createComment(``),re=e=>e===null||typeof e!=`object`&&typeof e!=`function`,ie=Array.isArray,ae=e=>ie(e)||typeof e?.[Symbol.iterator]==`function`,oe=`[ 	
\f\r]`,se=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ce=/-->/g,le=/>/g,N=RegExp(`>|${oe}(?:([^\\s"'>=/]+)(${oe}*=${oe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),ue=/'/g,de=/"/g,fe=/^(?:script|style|textarea|title)$/i,pe=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),P=pe(1),me=pe(2),F=Symbol.for(`lit-noChange`),I=Symbol.for(`lit-nothing`),he=/* @__PURE__ */ new WeakMap,L=j.createTreeWalker(j,129);function ge(e,t){if(!ie(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return ee===void 0?t:ee.createHTML(t)}var _e=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=se;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===se?c[1]===`!--`?o=ce:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=N):(fe.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=N):o=le:o===N?c[0]===`>`?(o=i??se,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?N:c[3]===`"`?de:ue):o===de||o===ue?o=N:o===ce||o===le?o=se:(o=N,i=void 0);let d=o===N&&e[t+1].startsWith(`/>`)?` `:``;a+=o===se?n+ne:l>=0?(r.push(s),n.slice(0,l)+k+n.slice(l)+A+d):n+A+(l===-2?t:d)}return[ge(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},ve=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=_e(t,n);if(this.el=e.createElement(l,r),L.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=L.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(k)){let t=u[o++],n=i.getAttribute(e).split(A),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Se:r[1]===`?`?Ce:r[1]===`@`?we:xe}),i.removeAttribute(e)}else e.startsWith(A)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(fe.test(i.tagName)){let e=i.textContent.split(A),t=e.length-1;if(t>0){i.textContent=O?O.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],M()),L.nextNode(),c.push({type:2,index:++a});i.append(e[t],M())}}}else if(i.nodeType===8){if(i.data===te)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(A,e+1))!==-1;)c.push({type:7,index:a}),e+=A.length-1}}a++}}static createElement(e,t){let n=j.createElement(`template`);return n.innerHTML=e,n}};function R(e,t,n=e,r){if(t===F)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=re(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=R(e,i._$AS(e,t.values),i,r)),t}var ye=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??j).importNode(t,!0);L.currentNode=r;let i=L.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new be(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Te(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=L.nextNode(),a++)}return L.currentNode=j,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},be=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=I,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=R(this,e,t),re(e)?e===I||e==null||e===``?(this._$AH!==I&&this._$AR(),this._$AH=I):e!==this._$AH&&e!==F&&this._(e):e._$litType$===void 0?e.nodeType===void 0?ae(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==I&&re(this._$AH)?this._$AA.nextSibling.data=e:this.T(j.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=ve.createElement(ge(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new ye(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=he.get(e.strings);return t===void 0&&he.set(e.strings,t=new ve(e)),t}k(t){ie(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(M()),this.O(M()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=D(e).nextSibling;D(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},xe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=I,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(/* @__PURE__ */ new String),this.strings=n):this._$AH=I}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=R(this,e,t,0),a=!re(e)||e!==this._$AH&&e!==F,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=R(this,r[n+o],t,o),s===F&&(s=this._$AH[o]),a||=!re(s)||s!==this._$AH[o],s===I?e=I:e!==I&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===I?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Se=class extends xe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===I?void 0:e}},Ce=class extends xe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==I)}},we=class extends xe{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=R(this,e,t,0)??I)===F)return;let n=this._$AH,r=e===I&&n!==I||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==I&&(n===I||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Te=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){R(this,e)}},Ee=E.litHtmlPolyfillSupport;Ee?.(ve,be),(E.litHtmlVersions??=[]).push(`3.3.3`);var De=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new be(t.insertBefore(M(),e),e,void 0,n??{})}return i._$AI(e),i},Oe=globalThis,z=class extends T{constructor(){
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=De(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};z._$litElement$=!0,z.finalized=!0,Oe.litElementHydrateSupport?.({LitElement:z});var ke=Oe.litElementPolyfillSupport;ke?.({LitElement:z}),(Oe.litElementVersions??=[]).push(`4.2.2`);
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var Ae=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})},je={attribute:!0,type:String,converter:S,reflect:!1,hasChanged:C},Me=(e=je,t,n)=>{
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=/* @__PURE__ */ new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function Ne(e){return(t,n)=>typeof n==`object`?Me(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/function B(e){return Ne({...e,state:!0,attribute:!1})}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var Pe={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Fe=e=>(...t)=>({_$litDirective$:e,values:t}),Ie=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},V=Fe(class extends Ie{constructor(e){
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
if(super(e),e.type!==Pe.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter(t=>e[t]).join(` `)+` `}update(e,[t]){if(this.st===void 0){this.st=/* @__PURE__ */ new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter(e=>e!==``)));for(let e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return F}}),Le=`important`,Re=` !`+Le,ze=Fe(class extends Ie{constructor(e){
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
if(super(e),e.type!==Pe.ATTRIBUTE||e.name!==`style`||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,n)=>{let r=e[n];return r==null?t:t+`${n=n.includes(`-`)?n:n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,`-$&`).toLowerCase()}:${r};`},``)}update(e,[t]){let{style:n}=e.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let e of this.ft)t[e]??(this.ft.delete(e),e.includes(`-`)?n.removeProperty(e):n[e]=null);for(let e in t){let r=t[e];if(r!=null){this.ft.add(e);let t=typeof r==`string`&&r.endsWith(Re);e.includes(`-`)||t?n.setProperty(e,t?r.slice(0,-11):r,t?Le:``):n[e]=r}}return F}}),Be=`1.11.0`,Ve=12e4,He=2e4,Ue=18e5,We=`#1a1a1a`,Ge=`#ffffff`,Ke=[{match:/\bomv\b/i,initials:`OMV`,bg:`#052759`,fg:`#1fff5a`},{match:/\bavanti\b/i,initials:`AVA`,bg:`#fbe800`,fg:`#1d1d1b`},{match:/\bbp\b/i,initials:`BP`,bg:`#007700`,fg:`#ffe600`},{match:/\bshell\b/i,initials:`SH`,bg:`#fbce07`,fg:We},{match:/\beni(?:\d+)?\b/i,initials:`ENI`,bg:`#fab600`,fg:We},{match:/\bjet\b/i,initials:`JET`,bg:`#ffb700`,fg:`#164194`},{match:/\bturm(?:ö|oe)l\b/i,initials:`TÖ`,bg:`#f04e23`,fg:We},{match:/\bavia\b/i,initials:`AV`,bg:`#e30613`,fg:Ge},{match:/\bsocar\b/i,initials:`SO`,bg:`#e4022c`,fg:Ge},{match:/\b(?:genol|lagerhaus)\b/i,initials:`LH`,bg:`#009e3c`,fg:We}],qe=/* @__PURE__ */ new Set([`tankstelle`,`tankstellen`,`tanken`,`diesel`,`diskont`,`shop`,`quick`,`austria`,`gmbh`,`co`,`kg`]);function Je(e){let[t,n]=e.split(/[^\p{L}\p{N}]+/u).filter(e=>e.length>0&&!qe.has(e.toLowerCase()));return t?(n&&!/^\d/.test(t)?`${t[0]}${n[0]}`:t.slice(0,2)).toUpperCase():``}function Ye(e){let t=e??``,n=Ke.find(e=>e.match.test(t));return n?{initials:n.initials,bg:n.bg,fg:n.fg}:{initials:Je(t)||`–`}}var Xe=173,Ze=45,Qe=68,$e=41,et=99,tt=19,nt=12,rt=46,it=65;function at(e,t){let n=Xe;t.entityCount>1&&(n+=Ze),e.hide_header_price===!0&&(n-=Qe),e.hide_attribution===!0&&(n-=$e),e.show_history!==!1&&!t.dynamic&&(n+=et,e.show_best_refuel!==!1&&(n+=tt)),e.show_cars===!0&&(e.show_car_fillup!==!1||e.show_car_consumption!==!1)&&t.carCount>0&&(n+=nt+rt*t.carCount);let r=e.max_stations??5;return n+=it*Math.min(r,t.stationCount),n}var ot=[`DIE`,`SUP`,`GAS`];function st(e){if(!e||typeof e!=`object`)return null;let t=e,n=typeof t.name==`string`?t.name.slice(0,50):``,r=ot.includes(t.fuel_type)?t.fuel_type:`DIE`,i=parseInt(String(t.tank_size),10),a=Number.isFinite(i)&&i>=1?Math.min(200,i):50,o;if(typeof t.consumption==`number`||typeof t.consumption==`string`){let e=parseFloat(String(t.consumption));Number.isFinite(e)&&e>=0&&(o=Math.min(30,e))}let s={name:n,fuel_type:r,tank_size:a,icon:typeof t.icon==`string`&&t.icon.startsWith(`mdi:`)?t.icon:`mdi:car`};return o!=null&&(s.consumption=o),s}function ct(e){if(!e)throw Error(`tankstellen-austria-card: config missing`);let t={...e};if(typeof t.entities==`string`&&(t.entities=[t.entities]),Array.isArray(t.entities)?t.entities=t.entities.filter(e=>typeof e==`string`&&e.includes(`.`)):t.entities!=null&&(console.warn(`[Tankstellen Austria] config.entities must be an array of entity IDs — ignoring`,t.entities),delete t.entities),t.max_stations!=null){let e=parseInt(String(t.max_stations),10);t.max_stations=Number.isFinite(e)?Math.max(0,Math.min(5,e)):5}return Array.isArray(t.payment_filter)?t.payment_filter=t.payment_filter.filter(e=>typeof e==`string`&&e.length>0):t.payment_filter!=null&&delete t.payment_filter,Array.isArray(t.cars)?t.cars=t.cars.map(e=>st(e)).filter(e=>e!==null):t.cars!=null&&delete t.cars,t}var lt={stations:{count:5,sort:`price`,index:!0,brand:!1,tile_shape:`square`,map_links:!0,map_provider:`auto`,distance:!1,opening_hours:!0,payment_methods:!0,payment_mode:`filter`},header:{show:!0,price:!0},chart:{show:!0,median_line:!1,hour_envelope:!1,noon_markers:!1,min_max:!0,best_refuel:!0},cars:{show:!1,fill_up:!0,consumption:!0},footer:{adaptive_logo:!1,show:!0}},ut=[`stations`,`header`,`chart`,`cars`,`footer`],H=e=>typeof e==`boolean`?!e:e,dt=[{flat:`max_stations`,group:`stations`,key:`count`},{flat:`sort_by_distance`,group:`stations`,key:`sort`,toGroup:e=>e===!0?`distance`:`price`,toFlat:e=>e===`distance`},{flat:`show_index`,group:`stations`,key:`index`},{flat:`show_brand`,group:`stations`,key:`brand`},{flat:`tile_shape`,group:`stations`,key:`tile_shape`},{flat:`show_distance`,group:`stations`,key:`distance`},{flat:`show_opening_hours`,group:`stations`,key:`opening_hours`},{flat:`show_payment_methods`,group:`stations`,key:`payment_methods`},{flat:`show_map_links`,group:`stations`,key:`map_links`},{flat:`map_provider`,group:`stations`,key:`map_provider`},{flat:`payment_filter`,group:`stations`,key:`payment_filter`},{flat:`payment_highlight_mode`,group:`stations`,key:`payment_mode`,toGroup:e=>e===!0?`highlight`:`filter`,toFlat:e=>e===`highlight`},{flat:`hide_header`,group:`header`,key:`show`,toGroup:H,toFlat:H},{flat:`hide_header_price`,group:`header`,key:`price`,toGroup:H,toFlat:H},{flat:`show_history`,group:`chart`,key:`show`},{flat:`show_best_refuel`,group:`chart`,key:`best_refuel`},{flat:`show_median_line`,group:`chart`,key:`median_line`},{flat:`show_hour_envelope`,group:`chart`,key:`hour_envelope`},{flat:`show_noon_markers`,group:`chart`,key:`noon_markers`},{flat:`show_minmax`,group:`chart`,key:`min_max`},{flat:`show_cars`,group:`cars`,key:`show`},{flat:`show_car_fillup`,group:`cars`,key:`fill_up`},{flat:`show_car_consumption`,group:`cars`,key:`consumption`},{flat:`hide_attribution`,group:`footer`,key:`show`,toGroup:H,toFlat:H},{flat:`logo_adapt_to_theme`,group:`footer`,key:`adaptive_logo`}],ft=e=>!!e&&typeof e==`object`&&!Array.isArray(e);function pt(e){let t={...e},n={};for(let r of ut)ft(e[r])&&(n[r]={...e[r]}),delete t[r];Array.isArray(e.cars)&&(n.cars={items:e.cars,...n.cars});for(let r of dt){let i=e[r.flat];if(delete t[r.flat],i===void 0)continue;let a=n[r.group]??={};a[r.key]===void 0&&(a[r.key]=r.toGroup?r.toGroup(i):i)}for(let e of ut)n[e]&&Object.keys(n[e]).length>0&&(t[e]=n[e]);return t}function mt(e){let t={...e},n={};for(let r of ut)ft(e[r])&&(n[r]=e[r]),delete t[r];for(let e of dt){let r=n[e.group]?.[e.key];r!==void 0&&(t[e.flat]=e.toFlat?e.toFlat(r):r)}return n.cars?.items!==void 0&&(t.cars=n.cars.items),t}var ht=`fuel_`;function gt(e){return!e||!e.states?[]:Object.keys(e.states).filter(t=>{if(!t.startsWith(`sensor.`))return!1;if(e.entities?.[t]?.platform===`tankstellen_austria`)return!0;let n=e.states[t];return!!(n?.attributes?.fuel_type&&Array.isArray(n.attributes.stations))})}function _t(e,t,n){let r=n?.fuel_type;if(typeof r==`string`&&r)return r;let i=e?.entities?.[t]?.translation_key;return typeof i==`string`&&i.startsWith(ht)?i.slice(5).toUpperCase():``}function vt(e){return e?!!(e.cash||e.debit_card||e.credit_card||e.others&&e.others.length>0):!1}function yt(e,t,n){return t===`cash`?e.cash?n?.cash??`cash`:null:t===`debit_card`?e.debit_card?n?.debit_card??`debit_card`:null:t===`credit_card`?e.credit_card?n?.credit_card??`credit_card`:null:(e.others??[]).find(e=>e.toLowerCase()===t.toLowerCase())??null}function bt(e,t){if(!t||!t.length)return!0;let n=e.payment_methods??{};return t.some(e=>yt(n,e)!==null)}function xt(e,t,n){if(!t||!t.length)return[];let r=e.payment_methods??{},i=[];for(let e of t){let t=yt(r,e,n);t!==null&&i.push(t)}return i}function St(e,t=/* @__PURE__ */ new Date){if(e.open===!1)return!1;let n=e.opening_hours??[];if(!n.length)return!1;let r=t.getDay(),i=r===0?`SO`:r===6?`SA`:`MO`,a=n.find(e=>e.day===i);if(!a||!a.to||a.from===`00:00`&&a.to===`24:00`)return!1;let[o,s]=a.to.split(`:`);if(o===void 0||s===void 0)return!1;let c=parseInt(o,10),l=parseInt(s,10);if(!Number.isFinite(c)||!Number.isFinite(l))return!1;let u=new Date(t);c===0&&l===0?(u.setDate(u.getDate()+1),u.setHours(0,0,0,0)):u.setHours(c,l,0,0);let d=(u.getTime()-t.getTime())/6e4;return d>0&&d<=30}function U(e){return e==null||!Number.isFinite(Number(e))?`–`:`€ ${Number(e).toFixed(3).replace(`.`,`,`)}`}function W(e){return e==null||!Number.isFinite(Number(e))?`–`:Number(e).toFixed(3).replace(`.`,`,`)}function Ct(e){return e==null||!Number.isFinite(e)||e<0?``:e<1e3?`${Math.round(e)} m`:`${(e/1e3).toFixed(1).replace(`.`,`,`)} km`}function wt(e,t,n=`google`){if(!e)return t?`https://www.google.com/search?q=${encodeURIComponent(t)}`:null;if(/\d/.test(e.address??``)){let t=`${e.postalCode??``} ${e.city??``} ${e.address??``}`.trim(),r=encodeURIComponent(t);return n===`apple`?`https://maps.apple.com/?q=${r}`:n===`geo`?`geo:0,0?q=${r}`:`https://maps.google.com/?q=${r}`}let r=[t,e.address,e.postalCode,e.city].filter(e=>e!=null&&e!==``);return r.length===0?null:`https://www.google.com/search?q=${encodeURIComponent(r.join(` `))}`}var Tt=6e4;async function Et(e){try{return(await e.callWS({type:`tankstellen_austria/api_status`}))?.maintenance===!0}catch{return!1}}var Dt=/* @__PURE__ */ t({card:()=>kt,common:()=>Ot,default:()=>Nt,editor:()=>Mt,fuel_types:()=>At,weekdays:()=>jt}),Ot={version:`Version`,invalid_configuration:`Invalid configuration`,loading:`Loading…`,no_data:`No data available`},kt={cheapest:`Cheapest price`,average:`Avg. price`,price:`Price`,closed:`Closed`,closing_soon:`Closing soon`,open_now:`Open`,opening_hours:`Opening hours`,payment:`Payment`,cash:`Cash`,debit_card:`Debit card`,credit_card:`Credit card`,payment_filter_active:`Payment filter active`,payment_highlight_active:`Payment filter (highlight)`,mon_fri:`Mon–Fri`,sat:`Sat`,sun:`Sun`,holiday:`Holiday`,map:`Map`,per_liter:`/l`,last_7_days:`Last 7 days`,min_label:`Min`,max_label:`Max`,refresh:`Refresh`,last_updated:`Updated:`,no_new_data:`No new data`,version_update:`Tankstellen Austria updated to v{v} — please reload`,version_reload:`Reload`,version_reload_stuck:`Reload didn't load the new version. Check HACS and do a hard refresh (Ctrl+Shift+R).`,version_dismiss:`Dismiss`,fill_up:`Fill up`,best_refuel_hour:`Tip: Cheapest between {h1}:00–{h2}:00`,best_refuel_hour_weekday:`Tip: Cheapest between {h1}:00–{h2}:00, usually {day}`,not_enough_data_hint:`Not enough data yet for a tip (min. 7 days)`,confidence_high:`High`,confidence_medium:`Medium`,confidence_low:`Low`,confidence_title:`Recommendation confidence`,confidence_span:`Data span`,confidence_coverage:`Coverage`,confidence_gap:`Gap`,confidence_days:`days`,confidence_cents:`¢`,confidence_short_history_hint:`Note: Home Assistant keeps only 10 days of history by default. For better recommendations raise recorder.purge_keep_days to 30.`,median_delta_below:`{c}¢ below median`,median_delta_above:`{c}¢ above median`,median_delta_equal:`at median`,loading:`Loading…`,no_data:`No data available`,sparkline_open_more_info:`Open price history`,sparkline_aria_summary:`Price history last 7 days: minimum {min}, maximum {max}, median {median}`,sparkline_aria_simple:`Price history last 7 days: minimum {min}, maximum {max}`,history_fetch_error:`Couldn't load price history`,api_maintenance:`E-Control is down for maintenance. Prices return automatically when it's back.`,unreachable:`Can't reach E-Control`,unreachable_detail:`Prices come back on their own once the connection works again.`},At={DIE:`Diesel`,SUP:`Super 95`,GAS:`CNG`},jt=[`Sunday`,`Monday`,`Tuesday`,`Wednesday`,`Thursday`,`Friday`,`Saturday`],Mt={entities:`Sensors`,entity_missing:`Sensor {entity} no longer exists. Pick a different sensor or remove it from this card's entities list.`,map_provider_auto:`Automatic (by device)`,map_provider_google:`Always Google Maps`,map_provider_apple:`Always Apple Maps`,tile_shape_square:`Rounded square`,tile_shape_circle:`Circle`,recorder_hint_intro:`Home Assistant keeps only 10 days of history by default. For better recommendations, add this block to configuration.yaml and restart:`,recorder_hint_docs:`Read the recorder docs`,copy:`Copy`,copied:`Copied`,section_tab_labels:`Tab labels`,tab_labels_hint:`Leave empty to use the default label`,section_cars:`Cars`,cars_both_off_hint:`No rows enabled. To hide cars entirely, turn off “Show cars”.`,car_fuel_type:`Fuel type`,car_delete:`Delete car`,add_car:`Add car`,copy_recorder_snippet:`Copy the recorder snippet`,consumption_range_error:`Please enter a value between 0 and 30 l/100 km`,section_stations:`Stations`,section_header:`Header`,section_chart:`Price history`,section_footer:`Logo & attribution`,stations_count:`Number of stations`,stations_index:`Show rank`,stations_brand:`Brand instead of rank`,stations_tile_shape:`Tile shape`,stations_map_links:`Show navigation links`,stations_map_provider:`Navigation app`,stations_distance:`Show distance`,stations_sort:`Order`,sort_price:`Cheapest first`,sort_distance:`Nearest first`,stations_opening_hours:`Show opening hours`,stations_payment_methods:`Show payment methods`,stations_payment_mode:`Stations without a match`,payment_mode_filter:`Hide them`,payment_mode_highlight:`Show them, highlight the matches`,header_show:`Show header`,header_price:`Show cheapest and average price`,chart_show:`Show price history`,chart_median_line:`Show 7-day median`,chart_hour_envelope:`Typical hourly range (4 wk)`,chart_noon_markers:`Noon reset markers`,chart_min_max:`Show min/max`,chart_best_refuel:`Show refuel tip`,cars_show:`Show cars`,cars_fill_up:`Show fill-up cost`,cars_consumption:`Show consumption`,footer_adaptive_logo:`Adapt E-Control logo color to theme`,footer_show:`Show attribution`,stations_payment_filter:`Only stations with`,stations_payment_filter_helper:`Pick from the list or type a method; it must match the name E-Control uses, e.g. Routex, UTA, DKV.`,summary_hidden:`Hidden`,summary_stations:`Up to {count} stations`,summary_stations_one:`1 station`,summary_filter:`Only {methods}`,summary_brand:`Brand`,summary_header_price:`With prices`,summary_header_title:`Title only`,summary_chart_best_refuel:`Refuel tip`,summary_chart_min_max:`Min/max`,summary_chart_median_line:`Median`,summary_chart_hour_envelope:`Hourly range`,summary_chart_noon_markers:`Noon markers`,summary_chart_plain:`Line only`,summary_cars:`{count} cars`,summary_cars_one:`1 car`,summary_cars_none:`No cars yet`,summary_shown:`Shown`,summary_adaptive_logo:`Logo follows theme`,car_name:`Name`,car_name_helper:`e.g. Golf TDI`,car_tank_size:`Tank size`,car_consumption:`Average consumption`,car_icon:`Icon`,car_unnamed:`Car {n}`,car_move_up:`Move up`,car_move_down:`Move down`},Nt={common:Ot,card:kt,fuel_types:At,weekdays:jt,editor:Mt},Pt=/* @__PURE__ */ t({card:()=>It,common:()=>Ft,default:()=>Bt,editor:()=>zt,fuel_types:()=>Lt,weekdays:()=>Rt}),Ft={version:`Version`,invalid_configuration:`Ungültige Konfiguration`,loading:`Lädt…`,no_data:`Keine Daten verfügbar`},It={cheapest:`Günstigster Preis`,average:`Ø Preis`,price:`Preis`,closed:`Geschlossen`,closing_soon:`Schließt bald`,open_now:`Geöffnet`,opening_hours:`Öffnungszeiten`,payment:`Zahlungsarten`,cash:`Bar`,debit_card:`Bankomat`,credit_card:`Kreditkarte`,payment_filter_active:`Zahlungsfilter aktiv`,payment_highlight_active:`Zahlungsfilter (Hervorhebung)`,mon_fri:`Mo–Fr`,sat:`Sa`,sun:`So`,holiday:`Feiertag`,map:`Karte`,per_liter:`/l`,last_7_days:`Letzte 7 Tage`,min_label:`Min`,max_label:`Max`,refresh:`Aktualisieren`,last_updated:`Aktualisiert:`,no_new_data:`Keine neuen Daten`,version_update:`Tankstellen Austria wurde auf v{v} aktualisiert — bitte neu laden`,version_reload:`Neu laden`,version_reload_stuck:`Neu-Laden hat die neue Version nicht geladen. In HACS prüfen und einen harten Reload (Strg+Umschalt+R) ausführen.`,version_dismiss:`Ausblenden`,fill_up:`Volltanken`,best_refuel_hour:`Tipp: Am günstigsten zwischen {h1}:00–{h2}:00`,best_refuel_hour_weekday:`Tipp: Am günstigsten zwischen {h1}:00–{h2}:00, meist {day}`,not_enough_data_hint:`Noch zu wenig Daten für Empfehlung (mind. 7 Tage)`,confidence_high:`Hoch`,confidence_medium:`Mittel`,confidence_low:`Niedrig`,confidence_title:`Empfehlungsgüte`,confidence_span:`Datenumfang`,confidence_coverage:`Abdeckung`,confidence_gap:`Vorsprung`,confidence_days:`Tage`,confidence_cents:`Cent`,confidence_short_history_hint:`Hinweis: Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen recorder.purge_keep_days auf 30 erhöhen.`,median_delta_below:`{c}¢ unter Median`,median_delta_above:`{c}¢ über Median`,median_delta_equal:`auf Median`,loading:`Wird geladen…`,no_data:`Keine Daten verfügbar`,sparkline_open_more_info:`Preisverlauf öffnen`,sparkline_aria_summary:`Preisverlauf der letzten 7 Tage: Minimum {min}, Maximum {max}, Median {median}`,sparkline_aria_simple:`Preisverlauf der letzten 7 Tage: Minimum {min}, Maximum {max}`,history_fetch_error:`Preisverlauf konnte nicht geladen werden`,api_maintenance:`E-Control führt Wartungsarbeiten durch. Die Preise kommen automatisch zurück, sobald der Dienst wieder läuft.`,unreachable:`Keine Verbindung zur E-Control`,unreachable_detail:`Die Preise erscheinen von selbst wieder, sobald die Verbindung funktioniert.`},Lt={DIE:`Diesel`,SUP:`Super 95`,GAS:`CNG Erdgas`},Rt=[`Sonntag`,`Montag`,`Dienstag`,`Mittwoch`,`Donnerstag`,`Freitag`,`Samstag`],zt={entities:`Sensoren`,entity_missing:`Sensor {entity} existiert nicht mehr. Wähle einen anderen Sensor oder entferne ihn aus den Entitäten dieser Karte.`,map_provider_auto:`Automatisch (je Gerät)`,map_provider_google:`Immer Google Maps`,map_provider_apple:`Immer Apple Maps`,tile_shape_square:`Abgerundetes Quadrat`,tile_shape_circle:`Kreis`,recorder_hint_intro:`Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen diesen Block in configuration.yaml ergänzen und neu starten:`,recorder_hint_docs:`Recorder-Dokumentation lesen`,copy:`Kopieren`,copied:`Kopiert`,section_tab_labels:`Tab-Bezeichnungen`,tab_labels_hint:`Leer lassen, um die Standard-Bezeichnung zu verwenden`,section_cars:`Fahrzeuge`,cars_both_off_hint:`Keine Zeile aktiv. Um Fahrzeuge ganz auszublenden, „Fahrzeuge anzeigen“ ausschalten.`,car_fuel_type:`Kraftstoffart`,car_delete:`Fahrzeug entfernen`,add_car:`Fahrzeug hinzufügen`,copy_recorder_snippet:`Recorder-Ausschnitt kopieren`,consumption_range_error:`Bitte einen Wert zwischen 0 und 30 l/100 km eingeben`,section_stations:`Tankstellen`,section_header:`Kopfzeile`,section_chart:`Preisverlauf`,section_footer:`Logo & Quellenangabe`,stations_count:`Anzahl Tankstellen`,stations_index:`Platzierung anzeigen`,stations_brand:`Marke statt Platzierung`,stations_tile_shape:`Form der Kachel`,stations_map_links:`Navigations-Links anzeigen`,stations_map_provider:`Navigations-App`,stations_distance:`Luftlinie anzeigen`,stations_sort:`Reihenfolge`,sort_price:`Günstigste zuerst`,sort_distance:`Nächste zuerst`,stations_opening_hours:`Öffnungszeiten anzeigen`,stations_payment_methods:`Zahlungsarten anzeigen`,stations_payment_mode:`Tankstellen ohne Treffer`,payment_mode_filter:`Ausblenden`,payment_mode_highlight:`Anzeigen, Treffer hervorheben`,header_show:`Kopfzeile anzeigen`,header_price:`Günstigsten und Durchschnittspreis anzeigen`,chart_show:`Preisverlauf anzeigen`,chart_median_line:`7-Tage-Median einblenden`,chart_hour_envelope:`Typischer Stundenverlauf (4 Wo)`,chart_noon_markers:`12:00-Markierung (Preisreset)`,chart_min_max:`Min/Max anzeigen`,chart_best_refuel:`Tank-Tipp anzeigen`,cars_show:`Fahrzeuge anzeigen`,cars_fill_up:`Tankkosten anzeigen`,cars_consumption:`Verbrauch anzeigen`,footer_adaptive_logo:`E-Control-Logo an Theme-Farbe anpassen`,footer_show:`Quellenangabe anzeigen`,stations_payment_filter:`Nur Tankstellen mit`,stations_payment_filter_helper:`Aus der Liste wählen oder eintippen; der Name muss dem von E-Control entsprechen, z. B. Routex, UTA, DKV.`,summary_hidden:`Ausgeblendet`,summary_stations:`Bis zu {count} Tankstellen`,summary_stations_one:`1 Tankstelle`,summary_filter:`Nur {methods}`,summary_brand:`Marke`,summary_header_price:`Mit Preisen`,summary_header_title:`Nur Titel`,summary_chart_best_refuel:`Tank-Tipp`,summary_chart_min_max:`Min/Max`,summary_chart_median_line:`Median`,summary_chart_hour_envelope:`Stundenverlauf`,summary_chart_noon_markers:`12:00-Markierung`,summary_chart_plain:`Nur Verlauf`,summary_cars:`{count} Fahrzeuge`,summary_cars_one:`1 Fahrzeug`,summary_cars_none:`Noch keine Fahrzeuge`,summary_shown:`Eingeblendet`,summary_adaptive_logo:`Logo passt sich an`,car_name:`Name`,car_name_helper:`z. B. Golf TDI`,car_tank_size:`Tankgröße`,car_consumption:`Durchschnittsverbrauch`,car_icon:`Symbol`,car_unnamed:`Fahrzeug {n}`,car_move_up:`Nach oben`,car_move_down:`Nach unten`},Bt={common:Ft,card:It,fuel_types:Lt,weekdays:Rt,editor:zt},Vt=Dt,G=Pt,Ht={en:Vt,de:G};function K(e,t){return e.split(`.`).reduce((e,t)=>{if(e&&typeof e==`object`&&t in e)return e[t]},t)}function Ut(e,t){let n=K(e,t);return typeof n==`string`?n:void 0}function Wt(e){return(e.configLanguage||e.hassLanguage||`de`).replace(`-`,`_`)}function Gt(e,t,n){let r=Ut(e,Ht[Wt(t)]??G);if(r===void 0&&(r=Ut(e,G)),r===void 0&&(r=e),n)for(let[e,t]of Object.entries(n))r=r.replace(`{${e}}`,t);return r}function Kt(e){let t=K(`weekdays`,Ht[Wt(e)]??G);if(Array.isArray(t)&&t.every(e=>typeof e==`string`))return t;let n=K(`weekdays`,G);return Array.isArray(n)?n:[]}function qt(e,t){let n=(K(`fuel_types`,Ht[Wt(t)]??G)??K(`fuel_types`,G))?.[e];return typeof n==`string`?n:e}var Jt=/* @__PURE__ */ new Map,Yt=/* @__PURE__ */ new Map;function Xt(e){if(typeof e.lu==`number`)return Math.round(e.lu*1e3);let t=e.lu??e.last_updated??e.last_changed;return t?new Date(t).getTime():0}function Zt(e,t){let n=e[0]?.time??1/0;return[...t.filter(e=>e.time<n),...e]}function Qt(e){return(e??[]).map(e=>({time:typeof e.start==`number`?e.start:e.start?new Date(e.start).getTime():0,value:typeof e.mean==`number`?e.mean:NaN})).filter(e=>Number.isFinite(e.value)&&e.time>0)}async function $t(e,t,n,r){try{return Qt((await e.callWS({type:`recorder/statistics_during_period`,start_time:n.toISOString(),end_time:r.toISOString(),statistic_ids:[t],period:`hour`,types:[`mean`]}))?.[t])}catch(e){return console.warn(`[Tankstellen Austria] statistics fetch failed for`,t,e),[]}}async function en(e,t,n={}){if(!e?.callWS)return[];let r=Yt.get(t);if(r)return r;let i=n.days??28,a=/* @__PURE__ */ new Date,o=/* @__PURE__ */ new Date(a.getTime()-i*24*60*60*1e3),s=e.states?.[t]?.attributes?.state_class===`measurement`,c=(async()=>{try{let n=((await e.callWS({type:`history/history_during_period`,start_time:o.toISOString(),end_time:a.toISOString(),entity_ids:[t],minimal_response:!0,significant_changes_only:!0}))?.[t]??[]).map(e=>({time:Xt(e),value:parseFloat(String(e.s??e.state??``))})).filter(e=>Number.isFinite(e.value)&&e.time>0),r=s?Zt(n,await $t(e,t,o,a)):n;return Jt.set(t,r),r}catch(e){return console.warn(`[Tankstellen Austria] history fetch failed for`,t,`— sparkline and best-refuel will be empty:`,e),Jt.get(t)??[]}finally{Yt.delete(t)}})();return Yt.set(t,c),c}function tn(e){return Jt.get(e)??[]}function nn(e){let t=e.length;if(t===0)return``;if(t===1)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;if(t===2)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)} L ${e[1].x.toFixed(2)} ${e[1].y.toFixed(2)}`;let n=Array.from({length:t-1});for(let r=0;r<t-1;r++){let t=e[r+1].x-e[r].x;n[r]=t===0?0:(e[r+1].y-e[r].y)/t}let r=Array.from({length:t});r[0]=n[0],r[t-1]=n[t-2];for(let e=1;e<t-1;e++)r[e]=(n[e-1]+n[e])/2;for(let e=0;e<t-1;e++){if(n[e]===0){r[e]=0,r[e+1]=0;continue}let t=r[e]/n[e],i=r[e+1]/n[e],a=t*t+i*i;if(a>9){let o=3/Math.sqrt(a);r[e]=o*t*n[e],r[e+1]=o*i*n[e]}}let i=`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;for(let n=0;n<t-1;n++){let t=e[n+1].x-e[n].x,a=e[n].x+t/3,o=e[n].y+r[n]*t/3,s=e[n+1].x-t/3,c=e[n+1].y-r[n+1]*t/3;i+=` C ${a.toFixed(2)} ${o.toFixed(2)}, ${s.toFixed(2)} ${c.toFixed(2)}, ${e[n+1].x.toFixed(2)} ${e[n+1].y.toFixed(2)}`}return i}function rn(e,t){return!e||!t||e.length<2||e.length!==t.length?``:`${nn(e)} ${nn([...t].reverse()).replace(/^M\s+([-\d.]+)\s+([-\d.]+)/,(e,t,n)=>`L ${t} ${n}`)} Z`}function q(e,t,n){return Math.max(t,Math.min(n,e))}function an(e,t){let n=e.filter(e=>Number.isFinite(e.value)&&e.weight>0);if(n.length===0)return NaN;if(n.length===1)return n[0].value;let r=[...n];r.sort((e,t)=>e.value-t.value);let i=r.reduce((e,t)=>e+t.weight,0),a=q(t,0,1)*i,o=0;for(let e of r)if(o+=e.weight,o>=a)return e.value;return r[r.length-1].value}var J=280,Y=48,on=6048e5;function sn(e){if(!e?.hasEnoughData||e.hour==null)return null;let t=/* @__PURE__ */ new Date,n=new Date(t);if(e.weekday!=null){let r=(t.getDay()-e.weekday+7)%7;r===0&&t.getHours()<e.hour&&(r=7),n.setDate(n.getDate()-r)}else t.getHours()<e.hour&&n.setDate(n.getDate()-1);n.setHours(e.hour,0,0,0);let r=n.getTime();return{startMs:r,endMs:r+(((e.hour_end??(e.hour+1)%24)-e.hour+24)%24||1)*36e5}}function cn(e){let t=Date.now()-on,n=e.filter(e=>e.time>=t),r=e.filter(e=>e.time<t),i=r.length?r[r.length-1]:null;return i?[{time:t,value:i.value},...n]:n}function ln(e){if(e.length<2)return null;let t=[...e];t.sort((e,t)=>e-t);let n=(t.length-1)/2,r=(t[Math.floor(n)]+t[Math.ceil(n)])/2,i=(e[e.length-1]-r)*100,a=Math.abs(i).toFixed(1);return i<=-.05?{key:`median_delta_below`,cents:a,cls:`median-delta-good`}:i>=.05?{key:`median_delta_above`,cents:a,cls:`median-delta-bad`}:{key:`median_delta_equal`,cents:a,cls:`median-delta-neutral`}}function un(e,t){let n=[...e];n.sort((e,t)=>e-t);let r=(n.length-1)/2;return t((n[Math.floor(r)]+n[Math.ceil(r)])/2)}function dn(e){let t={template:I,hoverPoints:[],medianDelta:null,viewBoxWidth:J,viewBoxHeight:Y};try{let n=e.points;if(!n||n.length<2)return t;let r=cn(n);if(r.length<2)return t;let i=r[r.length-1];i.time<Date.now()-18e5&&(r=[...r,{time:Date.now(),value:i.value}]);let a=r.map(e=>e.value),o=Math.min(...a),s=Math.max(...a),c=o,l=s,u=e.showHourEnvelope?e.hourEnvelope??null:null;if(u)for(let e=0;e<24;e++){let t=u.minByHour[e],n=u.maxByHour[e];t!=null&&n!=null&&(c=Math.min(c,t),l=Math.max(l,n))}let d=l-c||.01,f=e=>44-(e-c)/d*40,p=r.map((e,t)=>({x:t/(r.length-1)*J,y:f(e.value)})),m=nn(p),h=m?`${m} L ${J.toFixed(2)} ${Y.toFixed(2)} L 0 ${Y.toFixed(2)} Z`:``,g=I;if(u){let e=[],t=[];for(let n=0;n<r.length;n++){let i=new Date(r[n].time).getHours(),a=u.maxByHour[i],o=u.minByHour[i];a!=null&&o!=null&&(e.push({x:p[n].x,y:f(a)}),t.push({x:p[n].x,y:f(o)}))}if(e.length>=2){let n=rn(e,t);n&&(g=me`<path d=${n} fill="var(--primary-color)" fill-opacity="0.08" stroke="none"/>`)}}let _=r[0].time,v=r[r.length-1].time,y=e=>{if(e<=_||e>=v)return null;let t=0,n=r.length-1;for(;t<n-1;){let i=t+n>>1;r[i].time<=e?t=i:n=i}let i=r[t+1].time-r[t].time,a=i>0?(e-r[t].time)/i:0;return p[t].x+a*(p[t+1].x-p[t].x)},b=[];if(e.showNoonMarkers&&r.length>=2){let e=new Date(_);for(e.setHours(12,0,0,0),e.getTime()<_&&e.setDate(e.getDate()+1);e.getTime()<=v;e.setDate(e.getDate()+1),e.setHours(12,0,0,0)){let t=y(e.getTime());t!=null&&b.push(me`
          <line x1=${t.toFixed(1)} y1="0" x2=${t.toFixed(1)} y2=${Y}
                stroke="var(--secondary-text-color)" stroke-width="0.5"
                stroke-dasharray="2,3" opacity="0.55"/>
        `)}}let x=e.showMedianLine?ln(a):null,S=e.showMedianLine?me`<line x1="0" y1=${un(a,f).toFixed(1)}
                  x2=${J} y2=${un(a,f).toFixed(1)}
                  stroke="var(--secondary-text-color)" stroke-width="0.5"
                  stroke-dasharray="4,3" opacity="0.55"/>`:I,C=sn(e.analysis),w=null,T=null;if(C){let e=y(C.startMs),t=y(C.endMs);w=e??(C.startMs<=_?0:null),T=t??(C.endMs>=v?J:null)}let E=w!=null&&T!=null&&T>w?me`<rect x=${w.toFixed(1)} y="0"
                  width=${(T-w).toFixed(1)} height=${Y}
                  fill="var(--success-color,#4CAF50)" fill-opacity="0.10"
                  stroke="none"/>`:I,D=r.map((e,t)=>({t:e.time,v:e.value,x:+p[t].x.toFixed(1),y:+p[t].y.toFixed(1)})),O=`spark-grad-${Math.random().toString(36).slice(2,8)}`,ee=e.showMedianLine?(()=>{let t=ln(a);if(!t)return I;let n={median_delta_below:e.translations.median_delta_below,median_delta_above:e.translations.median_delta_above,median_delta_equal:e.translations.median_delta_equal}[t.key].replace(`{c}`,t.cents);return P`
            <span class="median-delta ${t.cls}">${n}</span>
          `})():I,k=[...a];k.sort((e,t)=>e-t);let A=(k.length-1)/2,te=k.length>0?(k[Math.floor(A)]+k[Math.ceil(A)])/2:0,ne=(e.showMedianLine?e.translations.sparkline_aria_summary:e.translations.sparkline_aria_simple).replace(`{min}`,W(o)).replace(`{max}`,W(s)).replace(`{median}`,W(te));return{template:P`
      <div class="sparkline-svg-wrap">
      <svg
        class="sparkline"
        viewBox="0 0 ${J} ${Y}"
        preserveAspectRatio="none"
        role="img"
        aria-label=${ne}
        data-points=${JSON.stringify(D)}
        data-width=${J}
        data-height=${Y}
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
          x1="0" y1="0" x2="0" y2=${Y}
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
        ${e.showMinMax?P`<span>
              <span class="sparkline-minmax-label">${e.translations.min_label}</span>
              ${W(o)}
            </span>`:I}
        <span class="sparkline-period">
          ${e.translations.last_7_days}${ee===I?I:P` · ${ee}`}
        </span>
        ${e.showMinMax?P`<span>
              <span class="sparkline-minmax-label">${e.translations.max_label}</span>
              ${W(s)}
            </span>`:I}
      </div>
    `,hoverPoints:D,medianDelta:x,viewBoxWidth:J,viewBoxHeight:Y}}catch(e){return console.warn(`[Tankstellen Austria] sparkline render failed:`,e),t}}function fn(e,t){let n=()=>void 0;try{let n=()=>{let t=e.querySelector(`svg.sparkline`),n=e.querySelector(`.sparkline-tooltip`);if(!t||!n)return null;let r=t.querySelector(`.sparkline-hover-line`),i=e.querySelector(`.sparkline-hover-dot`),a=n.querySelector(`.sparkline-tooltip-time`),o=n.querySelector(`.sparkline-tooltip-price`);if(!r||!i||!a||!o)return null;let s;try{s=JSON.parse(t.dataset.points||`[]`)}catch{s=[]}if(!s.length)return null;let c=Number(t.dataset.width)||J,l=Number(t.dataset.height)||Y;return{svgEl:t,line:r,dot:i,tooltip:n,timeEl:a,priceEl:o,pts:s,vbWidth:c,vbHeight:l}},r=r=>{let i=n();if(!i)return;let{svgEl:a,line:o,dot:s,tooltip:c,timeEl:l,priceEl:u,pts:d,vbWidth:f,vbHeight:p}=i,m=a.getBoundingClientRect();if(m.width===0)return;let h=Math.max(0,Math.min(1,(r-m.left)/m.width))*f,g=d[0],_=Math.abs(g.x-h);for(let e of d){let t=Math.abs(e.x-h);t<_&&(g=e,_=t)}o.setAttribute(`x1`,String(g.x)),o.setAttribute(`x2`,String(g.x)),o.setAttribute(`opacity`,`0.5`),s.style.left=`${g.x/f*100}%`,s.style.top=`${g.y/p*100}%`,s.style.opacity=`1`,l.textContent=t.formatTime(g.t),u.textContent=t.formatPrice(g.v),c.hidden=!1;let v=e.getBoundingClientRect(),y=g.x/f*m.width+(m.left-v.left);c.style.left=`0px`;let b=c.offsetWidth,x=y-b/2,S=Math.max(0,Math.min(v.width-b,x));c.style.left=`${S}px`},i=()=>{let e=n();e&&(e.line.setAttribute(`opacity`,`0`),e.dot.style.opacity=`0`,e.tooltip.hidden=!0)},a=new AbortController,{signal:o}=a;return e.addEventListener(`pointermove`,e=>r(e.clientX),{signal:o}),e.addEventListener(`pointerleave`,i,{signal:o}),e.addEventListener(`pointercancel`,i,{signal:o}),()=>{a.abort()}}catch(e){return console.warn(`[Tankstellen Austria] sparkline hover setup failed:`,e),n}}var pn=36e5,mn=864e5,hn=14*mn,gn=3*mn;function _n(e){let t=new Date(e);t.setHours(0,0,0,0);let n=t.getDay();return t.setDate(t.getDate()-(n===0?6:n-1)),t.getTime()}function vn(e,t){let n=[],r=(e,t,r)=>{if(r<=t||!Number.isFinite(e))return;let i=t;for(;i<r;){let t=Math.floor(i/pn)*pn+pn,a=Math.min(r,t),o=new Date(i);n.push({price:e,t:i,hour:o.getHours(),weekday:o.getDay(),weekKey:_n(i),durationMs:a-i}),i=a}};for(let t=0;t<e.length-1;t++)r(e[t].value,e[t].time,e[t+1].time);let i=e[e.length-1];return r(i.value,i.time,t),n}function yn(e){let t=/* @__PURE__ */ new Map;for(let n of e){let e=t.get(n.weekKey);e?e.push(n):t.set(n.weekKey,[n])}return t}function*bn(e){for(let t of yn(e).values()){let e=0;for(let n of t)e+=n.durationMs;if(e<gn)continue;let n=t.map(e=>({value:e.price,weight:e.durationMs}));yield{weekChunks:t,totalMs:e,p05:an(n,.05),p95:an(n,.95)}}}var xn=.005;function Sn(e,t,n){let r=e=>e!==void 0&&!Number.isNaN(e)&&e-n<=xn,i=0;for(let n=1;n<=23&&r(e[(t+n)%24]);n++)i=n;let a=0;for(let n=1;n<=23&&r(e[(t-n+24)%24]);n++)a=n;return{start:(t-a+24)%24,end:(t+i+1)%24}}function Cn(e,t){let n=e.map(e=>e.length>=t?an(e,.5):NaN),r=-1,i=1/0;return n.forEach((e,t)=>{!Number.isNaN(e)&&e<i&&(i=e,r=t)}),{medians:n,bestIdx:r,bestVal:i,minVal:i}}function wn(e,t){let n=e.medians.filter(e=>!Number.isNaN(e));return n.sort((e,t)=>e-t),n.length<2||e.bestIdx<0?0:q((n[Math.floor((n.length-1)/2)]-e.minVal)*100/t,0,1)}function Tn(e){if(!e||e.length<2)return null;let t=Date.now(),n=t-e[0].time;if(n<7*mn)return{hasEnoughData:!1};let r=vn(e,t);if(r.length===0)return{hasEnoughData:!1};let i=Array.from({length:24},()=>[]),a=Array.from({length:7},()=>[]);for(let{weekChunks:e,totalMs:n,p05:o,p95:s}of bn(r)){let r=0;for(let t of e)r+=q(t.price,o,s)*t.durationMs;let c=r/n;for(let n of e){let e=q(n.price,o,s),r=.5**((t-n.t)/hn),l={value:e-c,weight:n.durationMs*r};i[n.hour].push(l),a[n.weekday].push(l)}}let o=Cn(i,3);if(o.bestIdx<0)return{hasEnoughData:!1};let s=Cn(a,3),c=n/mn,l=Math.min(1,c/28),u=i.filter(e=>e.length>=3).length/24,d=wn(o,1.5),f=o.medians.filter(e=>!Number.isNaN(e));f.sort((e,t)=>e-t);let p=f.length>=2?(f[Math.floor((f.length-1)/2)]-o.minVal)*100:0,m=(l+u+d)/3,h=m>=.75?`high`:m>=.5?`medium`:`low`,g=a.filter(e=>e.length>=3).length/7,_=wn(s,.8),v=(s.bestIdx>=0?(l+g+_)/3:0)>=.75,y=Sn(o.medians,o.bestIdx,o.minVal);return{hasEnoughData:!0,hour:y.start,hour_end:y.end,weekday:v?s.bestIdx:null,confidence:{level:h,score:m,span_days:Math.round(c),coverage_pct:Math.round(u*100),gap_cents:Math.round(p*10)/10}}}function En(e){if(!e||e.length<2)return null;let t=Date.now();if(t-e[0].time<7*mn)return null;let n=vn(e,t);if(n.length===0)return null;let r=Array.from({length:24},()=>[]);for(let{weekChunks:e,p05:t,p95:i}of bn(n))for(let n of e)r[n.hour].push({value:q(n.price,t,i),weight:n.durationMs});let i=Array.from({length:24},()=>null),a=Array.from({length:24},()=>null),o=0;for(let e=0;e<24;e++){let t=r[e];t.length<3||(i[e]=an(t,.1),a[e]=an(t,.9),o++)}return o<6?null:{minByHour:i,maxByHour:a}}var Dn=c`
  :host {
    /* color-scheme enables light-dark() and steers forced-colors palette
       selection (WCAG 1.4.11). HA's active theme drives the resolution. */
    color-scheme: light dark;
    display: block;

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
    /* Clips content to the card; in a grid cell the gated rule below puts
       that edge at the cell's height. */
    overflow: hidden;
    /* Card responds to its own width, not the viewport — narrow
       dashboard columns trigger the compact density tier even on wide
       screens. */
    container-type: inline-size;
    container-name: tscard;
    /* A column, so that in a fixed-height cell the tabs and footer keep
       their size and the content between them scrolls (.wrap). In an
       auto-height cell nothing is short of room and nothing changes. */
    display: flex;
    flex-direction: column;
  }
  /* Fill the grid cell the dashboard hands us. A sections view puts a fixed
     pixel height on the cell WRAPPER when rows is numeric -- which dragging
     a resize handle causes even here, since the stored grid_options
     overrides getGridOptions()'s rows: "auto" -- and styles nothing inside
     it.
     Because :host is display: block, it is ha-card's containing block, so
     the two declarations only work as a pair: without the host's, ha-card's
     100% computes to auto and the card renders at content height on top of
     the card beneath it.
     Gated on the layout HA sets on the card ("grid" in a sections view and
     its edit dialog, "panel" in a panel view), the way Mushroom and HA's tile
     card gate it. The add-card picker sets none and centres each preview in
     a tile as tall as the tallest preview in its row; an ungated 100%
     resolves against that tile and stretches the card down to it. */
  :host([layout="grid"]),
  :host([layout="panel"]) {
    block-size: 100%;
  }
  :host([layout="grid"]) ha-card,
  :host([layout="panel"]) ha-card {
    block-size: 100%;
  }
  .wrap {
    padding: var(--tankst-pad-y) var(--tankst-pad-x);
    display: flex;
    flex-direction: column;
    gap: var(--tankst-row-gap);
    /* The one scroller: takes whatever height the tabs and footer leave,
       and when the user dragged the cell shorter than the card, header and
       stations scroll together. Pinning the header instead leaves no room:
       with the sparkline and tip it is about 300 px on its own.
       min-block-size: 0 is what lets this flex child shrink at all. */
    flex: 1 1 auto;
    min-block-size: 0;
    overflow-y: auto;
  }
  .empty {
    padding: 24px 0;
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 0.875rem;
  }
  /* "Can't reach E-Control": a headline the eye can find, so it doesn't
     read as one more quiet empty-list remark. */
  .empty-title {
    color: var(--primary-text-color);
    font-weight: 500;
  }
  .empty-detail {
    margin-block-start: var(--ha-space-1, 4px);
    font-size: 0.875em;
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
    /* overflow-x makes its automatic minimum height 0, so in ha-card's
       flex column a short cell would squash the tabs first. */
    flex-shrink: 0;
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
  /* The list runs edge to edge of the scrolling .wrap, so a ring drawn
     outside the row would be cut at both sides. Draw it inside. */
  .stations .station-main:focus-visible {
    outline-offset: -2px;
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
  /* stations.tile_shape: circle. Three 10 px letters still fit inside
     a 28 px circle. */
  .index-tile.circle {
    border-radius: 50%;
  }
  /* Brand initials run to three letters ("OMV", "JET"). */
  .index-tile.brand {
    font-size: 0.625rem;
    letter-spacing: -0.02em;
  }
  /* A station without a known brand: neutral, so it never passes for one
     (the accent blue would read as SOCAR or OMV). */
  .index-tile.brand:not(.brand-known) {
    background: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
    color: var(--primary-text-color);
  }
  .index-tile.brand-known {
    background: var(--tankst-tile-bg);
    color: var(--tankst-tile-fg);
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
  /* The name gives way, not the Closed / Closing-soon flag after it: as a
     flex item the span would otherwise keep its full width and push the
     flag out past .name's overflow, unseen. */
  .name > span[lang] {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
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
  /* Two lines per station, only at half a section (~240 px): index, name
     and address on top, price and actions underneath. There one row left
     the name a few characters next to the price, map pin and chevron.
     Wider than this one row reads better: the price stays beside its
     station and the card stays a third shorter. Areas with no element (no
     index, no map link) stay empty. */
  @container tscard (inline-size < 280px) {
    .station-main {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      grid-template-areas:
        "idx info info info"
        ".   price map  chev";
      align-items: center;
      gap: 2px 8px;
    }
    .index-tile {
      grid-area: idx;
    }
    .info {
      grid-area: info;
    }
    .station-main .price {
      grid-area: price;
    }
    .map-action {
      grid-area: map;
    }
    .expander-chevron {
      grid-area: chev;
    }
    /* 32 px keeps the second line short; still above the 24 px target
       minimum (WCAG 2.5.8). */
    .station-main .icon-action {
      width: 32px;
      height: 32px;
    }
    .name {
      white-space: normal;
      flex-wrap: wrap;
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
  /* .tabs scrolls sideways, which clips a ring drawn outside the tab. */
  .tab:focus-visible {
    outline-offset: -2px;
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
`,On=c`
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
    margin: 0;
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

  /* Tab labels, under the sensor picker */
  .tab-labels {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* Section panels: the body pads the form the way HA's own editors do. */
  ha-expansion-panel {
    --expansion-panel-content-padding: 0 16px 16px;
  }
  ha-expansion-panel ha-icon[slot="leading-icon"] {
    color: var(--secondary-text-color);
  }
  .panel-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Cars: one outlined list, a row per car, one open at a time */
  .car-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    overflow: hidden;
  }
  .car-item + .car-item {
    border-top: 1px solid var(--divider-color);
  }
  .car-head {
    display: flex;
    align-items: center;
    gap: 2px;
    padding-inline-end: 4px;
  }
  .car-toggle {
    flex: 1;
    min-width: 0;
    min-height: 56px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: none;
    border: 0;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
  }
  .car-toggle:focus-visible {
    outline: 2px solid var(--tankst-accent, var(--primary-color));
    outline-offset: -2px;
  }
  .car-toggle ha-icon {
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }
  .car-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .car-name,
  .car-details {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .car-details {
    font-size: 0.8125rem;
    color: var(--secondary-text-color);
  }
  .car-body {
    padding: 4px 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .car-add {
    align-self: flex-start;
  }
`;async function kn(e,t,n){if(!e?.callWS)return null;try{let r=await e.callWS({type:t});if(r?.version&&r.version!==n)return r.version}catch{}return null}async function An(){try{if(typeof window<`u`&&`caches`in window){let e=await caches.keys();await Promise.all(e.map(e=>caches.delete(e)))}}catch{}location.reload()}function jn(e){return e.mismatchVersion?e.stuck?P`
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
    `:P`
    <div class="version-notice" role="alert" aria-live="assertive">
      <span>${e.t(`version_update`,{v:e.mismatchVersion})}</span>
      <button
        class="version-reload-btn"
        type="button"
        @click=${e.onReload}
      >
        ${e.t(`version_reload`)}
      </button>
    </div>
  `:I}var Mn=`https://www.e-control.at/`,Nn=`/tankstellen-austria/e-control_logo.svg`;function Pn(e){return typeof e==`string`&&/^https?:\/\//i.test(e)?e:``}function Fn(e){return typeof e==`string`?e.startsWith(`geo:0,0?q=`)?e:Pn(e):``}function In(e,t){return/iPhone|iPad|iPod/.test(e)||/Macintosh/.test(e)&&t>1?`ios`:/Android/.test(e)?`android`:`desktop`}function Ln(e,t){return e===`google`||e===`apple`?e:t===`ios`?`apple`:t===`android`?`geo`:`google`}function Rn(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0}))}function X(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var zn=[`stations`,`header`,`chart`,`cars`,`footer`],Bn={stations:`mdi:gas-station-outline`,header:`mdi:page-layout-header`,chart:`mdi:chart-line`,cars:`mdi:car-outline`,footer:`mdi:page-layout-footer`},Vn={stations:[`count`,`sort`,`tile_shape`,`map_provider`,`payment_mode`]},Hn=[`DIE`,`SUP`,`GAS`],Un=[`cash`,`debit_card`,`credit_card`],Wn={name:``,fuel_type:`DIE`,tank_size:50,icon:`mdi:car`};function Gn(e){return e.replace(/[<>"'&]/g,``).slice(0,50).trim()}var Z=(e,t)=>({name:t,default:lt[e][t],selector:{boolean:{}}});function Kn(e){let t={...e};for(let e of zn){let n=t[e];if(!n||typeof n!=`object`||Array.isArray(n))continue;let r=lt[e],i={};for(let[e,t]of Object.entries(n))t!=null&&t!==r[e]&&(Array.isArray(t)&&t.length===0||(i[e]=t));Object.keys(i).length>0?t[e]=i:delete t[e]}return Array.isArray(t.entities)&&t.entities.length===0&&delete t.entities,t}var Q=class extends z{constructor(...e){super(...e),this._config={type:`tankstellen-austria-card`},this._open=/* @__PURE__ */ new Set,this._openCar=null,this._copiedPulse=!1,this._labels=/* @__PURE__ */ new Map,this._helpers=/* @__PURE__ */ new Map,this._onEntitiesChanged=e=>{e.stopPropagation();let t=e.detail.value.entities,n={...this._config};t&&t.length>0?n.entities=t:delete n.entities,this._commit(n)},this._onTabLabelsChanged=e=>{e.stopPropagation();let t={};for(let[n,r]of Object.entries(e.detail.value)){let e=typeof r==`string`?Gn(r):``;e&&(t[n]=e)}let n={...this._config};Object.keys(t).length>0?n.tab_labels=t:delete n.tab_labels,this._commit(n)},this._onAddCar=()=>{let e=[...this._config.cars?.items??[],{...Wn}];this._openCar=e.length-1,this._setCars(e)}}setConfig(e){this._config=pt(e)}disconnectedCallback(){super.disconnectedCallback(),this._copiedTimeout!==void 0&&(clearTimeout(this._copiedTimeout),this._copiedTimeout=void 0)}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_et(e,t){return Gt(`editor.${e}`,this._ctx(),t)}_ct(e,t){return Gt(`card.${e}`,this._ctx(),t)}_maybe(e){let t=this._et(e);return t===`editor.${e}`?void 0:t}_commit(e){this._config=Kn(e),Rn(this,`config-changed`,{config:this._config})}_opt(e,t){return this._config[e]?.[t]??lt[e][t]}_labelFor(e){let t=e??``,n=this._labels.get(t);return n||(n=t=>{if(e===null){let e=this.hass?.localize?.(`ui.panel.lovelace.editor.card.generic.${t.name}`);if(e)return e}return this._maybe(e===null?t.name:`${e}_${t.name}`)??t.name},this._labels.set(t,n)),n}_helperFor(e){let t=e??``,n=this._helpers.get(t);return n||(n=t=>this._maybe(`${e===null?``:`${e}_`}${t.name}_helper`),this._helpers.set(t,n)),n}_select(e,t){return{name:e,selector:{select:{mode:`dropdown`,options:t.map(t=>({value:t,label:this._et(`${e}_${t}`)}))}}}}_groupSchema(e){let t=t=>this._opt(e,t)===!0;switch(e){case`stations`:{let e=this._config.stations?.payment_filter??[];return[{name:`count`,selector:{number:{min:0,max:5,step:1,mode:`slider`}}},Z(`stations`,`index`),...t(`index`)?[Z(`stations`,`brand`),this._select(`tile_shape`,[`square`,`circle`])]:[],Z(`stations`,`map_links`),this._select(`map_provider`,[`auto`,`google`,`apple`]),Z(`stations`,`distance`),this._select(`sort`,[`price`,`distance`]),Z(`stations`,`opening_hours`),Z(`stations`,`payment_methods`),...t(`payment_methods`)?[this._paymentFilterField()]:[],...t(`payment_methods`)&&e.length>0?[this._select(`payment_mode`,[`filter`,`highlight`])]:[]]}case`header`:return[Z(`header`,`show`),...t(`show`)?[Z(`header`,`price`)]:[]];case`chart`:return[Z(`chart`,`show`),...t(`show`)?[`median_line`,`hour_envelope`,`noon_markers`,`min_max`,`best_refuel`].map(e=>Z(`chart`,e)):[]];case`cars`:return[Z(`cars`,`show`),...t(`show`)?[Z(`cars`,`fill_up`),Z(`cars`,`consumption`)]:[]];case`footer`:return[Z(`footer`,`show`),...t(`show`)?[Z(`footer`,`adaptive_logo`)]:[]]}}_paymentFilterField(){let e=new Set(Un);for(let t of this._config.entities??[]){let n=this.hass?.states[t]?.attributes?.stations??[];for(let t of n)for(let n of t.payment_methods?.others??[])e.add(n)}for(let t of this._config.stations?.payment_filter??[])e.add(t);let t=e=>Un.includes(e)?this._ct(e):e;return{name:`payment_filter`,selector:{select:{multiple:!0,custom_value:!0,options:[...e].map(e=>({value:e,label:t(e)}))}}}}_carSchema(){return[{name:`name`,selector:{text:{}}},{name:`fuel_type`,selector:{select:{mode:`dropdown`,options:Hn.map(e=>({value:e,label:qt(e,this._ctx())}))}}},{name:`tank_size`,selector:{number:{min:1,max:200,step:1,mode:`box`,unit_of_measurement:`l`}}},{name:`consumption`,selector:{number:{min:0,max:30,step:.1,mode:`box`,unit_of_measurement:`l/100 km`}}},{name:`icon`,selector:{icon:{placeholder:`mdi:car`}}}]}_summary(e){let t=this._et(`summary_hidden`),n=[];switch(e){case`stations`:{let e=Number(this._opt(`stations`,`count`));if(e===0)return t;n.push(e===1?this._et(`summary_stations_one`):this._et(`summary_stations`,{count:String(e)})),n.push(this._et(`sort_${String(this._opt(`stations`,`sort`))}`));let r=this._config.stations?.payment_filter??[];r.length>0&&this._opt(`stations`,`payment_methods`)===!0?n.push(this._et(`summary_filter`,{methods:r.join(`, `)})):this._opt(`stations`,`brand`)===!0&&n.push(this._et(`summary_brand`));break}case`header`:if(this._opt(`header`,`show`)!==!0)return t;n.push(this._et(this._opt(`header`,`price`)===!0?`summary_header_price`:`summary_header_title`));break;case`chart`:if(this._opt(`chart`,`show`)!==!0)return t;for(let e of[`best_refuel`,`min_max`,`median_line`,`hour_envelope`,`noon_markers`])this._opt(`chart`,e)===!0&&n.push(this._et(`summary_chart_${e}`));n.length===0&&n.push(this._et(`summary_chart_plain`));break;case`cars`:{if(this._opt(`cars`,`show`)!==!0)return t;let e=this._config.cars?.items?.length??0;n.push(e===0?this._et(`summary_cars_none`):e===1?this._et(`summary_cars_one`):this._et(`summary_cars`,{count:String(e)}));break}case`footer`:if(this._opt(`footer`,`show`)!==!0)return t;n.push(this._et(`summary_shown`)),this._opt(`footer`,`adaptive_logo`)===!0&&n.push(this._et(`summary_adaptive_logo`))}return n.slice(0,3).join(` · `)}render(){let e=(this._config.entities??[]).filter(e=>!!this.hass&&!this.hass.states[e]);return P`
      <div class="editor">
        <ha-form
          data-form="entities"
          .hass=${this.hass}
          .data=${{entities:this._config.entities}}
          .schema=${[{name:`entities`,selector:{entity:{multiple:!0,filter:{domain:`sensor`,integration:`tankstellen_austria`}}}}]}
          .computeLabel=${this._labelFor(null)}
          .computeHelper=${this._helperFor(null)}
          @value-changed=${this._onEntitiesChanged}
        ></ha-form>
        ${e.map(e=>P`
            <ha-alert alert-type="warning">${this._et(`entity_missing`,{entity:e})}</ha-alert>
          `)}
        ${this._renderTabLabels()} ${zn.map(e=>this._renderPanel(e))}
      </div>
    `}_renderPanel(e){return P`
      <ha-expansion-panel
        outlined
        data-group=${e}
        .header=${this._et(`section_${e}`)}
        .secondary=${this._summary(e)}
        @expanded-will-change=${t=>this._setOpen(e,t.detail.expanded)}
      >
        <ha-icon slot="leading-icon" icon=${Bn[e]}></ha-icon>
        ${this._open.has(e)?this._renderBody(e):I}
      </ha-expansion-panel>
    `}_renderBody(e){let t=Object.fromEntries((Vn[e]??[]).map(t=>[t,lt[e][t]])),n=e===`chart`&&this._opt(`chart`,`show`)===!0&&this._opt(`chart`,`best_refuel`)===!0;return P`
      <div class="panel-body">
        <ha-form
          data-form=${e}
          .hass=${this.hass}
          .data=${{...t,...this._config[e]}}
          .schema=${this._groupSchema(e)}
          .computeLabel=${this._labelFor(e)}
          .computeHelper=${this._helperFor(e)}
          @value-changed=${t=>this._onGroupChanged(e,t)}
        ></ha-form>
        ${n?this._renderRecorderHint():I}
        ${e===`cars`&&this._opt(`cars`,`show`)===!0?this._renderCars():I}
      </div>
    `}_renderTabLabels(){if(!this.hass)return I;let e=(this._config.entities??[]).filter(e=>!!this.hass.states[e]);if(e.length<2)return I;let t=new Map(e.map(e=>[e,this._defaultTabLabel(e)]));return P`
      <div class="tab-labels">
        <div class="section-header">${this._et(`section_tab_labels`)}</div>
        <ha-form
          data-form="tab_labels"
          .hass=${this.hass}
          .data=${this._config.tab_labels??{}}
          .schema=${e.map(e=>({name:e,selector:{text:{}}}))}
          .computeLabel=${e=>t.get(e.name)??e.name}
          @value-changed=${this._onTabLabelsChanged}
        ></ha-form>
        <div class="editor-hint">${this._et(`tab_labels_hint`)}</div>
      </div>
    `}_defaultTabLabel(e){let t=this.hass.states[e],n=qt(_t(this.hass,e,t.attributes),this._ctx());if(t.attributes?.dynamic_mode===!0){let e=t.attributes.dynamic_tracker_label;e&&(n+=` · ${e}`)}return n}_renderRecorderHint(){let e=`recorder:
  purge_keep_days: 30`;return P`
      <div class="recorder-hint">
        <div class="recorder-hint-text">${this._et(`recorder_hint_intro`)}</div>
        <pre class="recorder-snippet"><code>${e}</code></pre>
        <div class="recorder-hint-actions">
          <ha-button
            appearance="plain"
            size="small"
            aria-label=${this._et(`copy_recorder_snippet`)}
            @click=${()=>this._onCopyRecorderSnippet(e)}
          >
            <ha-icon slot="start" icon="mdi:content-copy" aria-hidden="true"></ha-icon>
            ${this._copiedPulse?this._et(`copied`):this._et(`copy`)}
          </ha-button>
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
    `}_renderCars(){let e=this._config.cars?.items??[];return P`
      ${this._opt(`cars`,`fill_up`)!==!0&&this._opt(`cars`,`consumption`)!==!0?P`<div class="editor-hint">${this._et(`cars_both_off_hint`)}</div>`:I}
      ${e.length>0?P`<ul class="car-list">
            ${e.map((t,n)=>this._renderCar(t,n,e.length))}
          </ul>`:I}
      <ha-button appearance="plain" class="car-add" @click=${this._onAddCar}>
        <ha-icon slot="start" icon="mdi:plus" aria-hidden="true"></ha-icon>
        ${this._et(`add_car`)}
      </ha-button>
    `}_renderCar(e,t,n){let r=this._openCar===t,i=`tsa-car-${t}`,a=[qt(e.fuel_type,this._ctx()),`${e.tank_size} l`,...e.consumption==null?[]:[`${e.consumption} l/100 km`]].join(` · `),o=e.consumption!=null&&(e.consumption<0||e.consumption>30);return P`
      <li class="car-item">
        <div class="car-head">
          <button
            class="car-toggle"
            type="button"
            aria-expanded=${r?`true`:`false`}
            aria-controls=${i}
            @click=${()=>this._openCar=r?null:t}
          >
            <ha-icon icon=${e.icon||`mdi:car`} aria-hidden="true"></ha-icon>
            <span class="car-text">
              <span class="car-name"
                >${e.name||this._et(`car_unnamed`,{n:String(t+1)})}</span
              >
              <span class="car-details">${a}</span>
            </span>
          </button>
          <ha-icon-button
            .label=${this._et(`car_move_up`)}
            .disabled=${t===0}
            @click=${()=>this._moveCar(t,-1)}
          >
            <ha-icon icon="mdi:arrow-up" aria-hidden="true"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            .label=${this._et(`car_move_down`)}
            .disabled=${t===n-1}
            @click=${()=>this._moveCar(t,1)}
          >
            <ha-icon icon="mdi:arrow-down" aria-hidden="true"></ha-icon>
          </ha-icon-button>
          <ha-icon-button .label=${this._et(`car_delete`)} @click=${()=>this._deleteCar(t)}>
            <ha-icon icon="mdi:delete-outline" aria-hidden="true"></ha-icon>
          </ha-icon-button>
        </div>
        ${r?P`<div class="car-body" id=${i}>
              <ha-form
                data-form="car"
                .hass=${this.hass}
                .data=${e}
                .schema=${this._carSchema()}
                .computeLabel=${this._labelFor(`car`)}
                .computeHelper=${this._helperFor(`car`)}
                @value-changed=${e=>this._onCarChanged(t,e)}
              ></ha-form>
              ${o?P`<ha-alert alert-type="error">${this._et(`consumption_range_error`)}</ha-alert>`:I}
            </div>`:I}
      </li>
    `}_setOpen(e,t){let n=new Set(this._open);t?n.add(e):n.delete(e),this._open=n}_onGroupChanged(e,t){t.stopPropagation();let n={...this._config[e],...t.detail.value};if(e===`stations`&&Array.isArray(n.payment_filter)){let e=n.payment_filter.map(e=>Gn(String(e)));n.payment_filter=[...new Set(e.filter(Boolean))]}this._commit({...this._config,[e]:n})}_onCarChanged(e,t){t.stopPropagation();let n=[...this._config.cars?.items??[]],r=n[e];if(!r)return;let i=t.detail.value,a={...r};typeof i.name==`string`&&(a.name=Gn(i.name)),Hn.includes(i.fuel_type)&&(a.fuel_type=i.fuel_type),typeof i.tank_size==`number`&&Number.isFinite(i.tank_size)&&(a.tank_size=Math.min(200,Math.max(1,Math.round(i.tank_size)))),typeof i.consumption==`number`&&Number.isFinite(i.consumption)?a.consumption=Math.round(i.consumption*10)/10:delete a.consumption,a.icon=typeof i.icon==`string`&&i.icon.startsWith(`mdi:`)?i.icon:`mdi:car`,n[e]=a,this._setCars(n)}_moveCar(e,t){let n=[...this._config.cars?.items??[]],r=e+t,i=n[e];!i||r<0||r>=n.length||(n.splice(e,1),n.splice(r,0,i),this._openCar===e?this._openCar=r:this._openCar===r&&(this._openCar=e),this._setCars(n))}_deleteCar(e){let t=[...this._config.cars?.items??[]];t.splice(e,1),this._openCar===e?this._openCar=null:this._openCar!=null&&this._openCar>e&&--this._openCar,this._setCars(t)}_setCars(e){this._commit({...this._config,cars:{...this._config.cars,items:e}})}async _onCopyRecorderSnippet(e){try{await navigator.clipboard.writeText(e),this._copiedPulse=!0,this._copiedTimeout!==void 0&&clearTimeout(this._copiedTimeout),this._copiedTimeout=window.setTimeout(()=>{this._copiedPulse=!1,this._copiedTimeout=void 0},1500)}catch{}}static{this.styles=On}};X([Ne({attribute:!1})],Q.prototype,`hass`,void 0),X([B()],Q.prototype,`_config`,void 0),X([B()],Q.prototype,`_open`,void 0),X([B()],Q.prototype,`_openCar`,void 0),X([B()],Q.prototype,`_copiedPulse`,void 0),Q=X([Ae(`tankstellen-austria-card-editor`)],Q);var qn=`Datenquelle: E-Control`;window.customCards=window.customCards||[],window.customCards.push({type:`tankstellen-austria-card`,name:`Tankstellen Austria`,description:`Austrian fuel prices from E-Control with sparklines and best-refuel analytics.`,preview:!0,documentationURL:`https://github.com/rolandzeiner/tankstellen-austria`,getEntitySuggestion:(e,t)=>!t.startsWith(`sensor.`)||e?.entities?.[t]?.platform!==`tankstellen_austria`?null:{config:{type:`custom:tankstellen-austria-card`,entities:[t]}}});var $=class extends z{constructor(...e){super(...e),this.preview=!1,this._activeTab=0,this._expandedStations=/* @__PURE__ */ new Set,this._history={},this._versionMismatch=null,this._lastManualRefresh=0,this._noNewData=!1,this._historyError=!1,this._apiMaintenance=!1,this._cooldownTick=0,this._initDone=!1,this._onDismissVersionBanner=()=>{this._versionMismatch=null},this._onMapLinkClick=e=>{e.stopPropagation()},this._onRefresh=()=>{if(!this.hass)return;let e=Date.now();if(e-this._lastManualRefresh<12e4)return;this._lastManualRefresh=e,this._noNewData=!1;let t=this._resolveEntities(),n=(t[this._activeTab]??t[0])?.last_updated;for(let e of t){let t=this.hass.callService(`homeassistant`,`update_entity`,{entity_id:e.entity_id});t&&typeof t.catch==`function`&&t.catch(t=>{console.warn(`[Tankstellen Austria] update_entity failed for`,e.entity_id,t)})}this._postRefreshTimeout!==void 0&&clearTimeout(this._postRefreshTimeout),this._postRefreshTimeout=window.setTimeout(()=>{this._postRefreshTimeout=void 0;try{let e=this._resolveEntities();(e[this._activeTab]??e[0])?.last_updated===n&&(this._noNewData=!0)}catch(e){console.warn(`[Tankstellen Austria] post-refresh check failed`,e)}},He),this._cooldownInterval!==void 0&&clearInterval(this._cooldownInterval),typeof window<`u`&&typeof window.matchMedia==`function`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?(this._cooldownTimeout!==void 0&&clearTimeout(this._cooldownTimeout),this._cooldownTimeout=window.setTimeout(()=>{this._cooldownTimeout=void 0,this._cooldownTick=(this._cooldownTick+1)%1e6},Ve)):this._cooldownInterval=window.setInterval(()=>{Date.now()-this._lastManualRefresh>=12e4&&this._cooldownInterval!==void 0&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),this._cooldownTick=(this._cooldownTick+1)%1e6},1e3)},this._onVersionReload=async()=>{if(this._versionMismatch)try{sessionStorage.setItem(`tsa-reload-attempted-${this._versionMismatch}`,`1`)}catch{}await An()}}static getConfigElement(){return document.createElement(`tankstellen-austria-card-editor`)}static getStubConfig(e){let t=gt(e);return{entities:t.length?[t[0]]:[],stations:{distance:!0,payment_mode:`highlight`}}}setConfig(e){if(!e||typeof e!=`object`||Array.isArray(e))throw Error(`tankstellen-austria-card: config must be an object`);let t=e.entities;if(t!==void 0&&typeof t!=`string`&&!Array.isArray(t))throw Error(`tankstellen-austria-card: config.entities must be a string or array of entity IDs`);if(this._config=ct(mt(pt(e))),this._config.entities){let e={},t=!1;for(let n of this._config.entities){let r=tn(n);r.length>=2&&(e[n]=r,t=!0)}t&&(this._history={...this._history,...e})}}getCardSize(){let e=this._config??{},t=this.hass&&this._config?this._resolveEntities():[],n=t[this._activeTab]??t[0],r=n?_t(this.hass,n.entity_id,n.attributes):void 0,i=(e.cars??[]).filter(e=>r===void 0||e.fuel_type===r),a=at(e,{entityCount:Math.max(1,t.length),stationCount:n?.attributes.stations?.length??5,carCount:i.length,dynamic:n?.attributes.dynamic_mode===!0});return Math.ceil(a/50)}getGridOptions(){return{columns:12,rows:`auto`,min_columns:6,min_rows:4}}shouldUpdate(e){if(!this._config)return!1;if(e.has(`_config`)||e.has(`_activeTab`)||e.has(`_expandedStations`)||e.has(`_history`)||e.has(`_historyError`)||e.has(`_apiMaintenance`)||e.has(`_versionMismatch`)||e.has(`_lastManualRefresh`)||e.has(`_noNewData`)||e.has(`_cooldownTick`)||e.has(`layout`)||e.has(`preview`))return!0;let t=e.get(`hass`);return!t||t.language!==this.hass.language||this._trackedEntityIds().some(e=>t.states[e]!==this.hass.states[e])}_trackedEntityIds(){return this._config.entities?.length?this._config.entities:gt(this.hass)}_resolveEntities(){return this.hass?this._trackedEntityIds().map(e=>{let t=this.hass.states[e];return t?{entity_id:e,state:t.state,attributes:t.attributes,last_updated:t.last_updated}:null}).filter(e=>e!==null):[]}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_t(e,t){return Gt(`card.${e}`,this._ctx(),t)}connectedCallback(){super.connectedCallback(),this.hass&&this._config&&this._syncApiStatus(),this._initDone||this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),this._stopApiStatusPoll(),this._historyInterval!==void 0&&(clearInterval(this._historyInterval),this._historyInterval=void 0),this._cooldownInterval!==void 0&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),this._postRefreshTimeout!==void 0&&(clearTimeout(this._postRefreshTimeout),this._postRefreshTimeout=void 0),this._cooldownTimeout!==void 0&&(clearTimeout(this._cooldownTimeout),this._cooldownTimeout=void 0),this._sparklineCleanup&&=(this._sparklineCleanup(),void 0),this._initDone=!1}willUpdate(e){e.has(`hass`)&&this._syncApiStatus()}_syncApiStatus(){this._resolveEntities().some(e=>e.state===`unavailable`)?this._apiStatusInterval===void 0&&(this._checkApiStatus(),this._apiStatusInterval=window.setInterval(()=>{this._checkApiStatus()},Tt)):(this._stopApiStatusPoll(),this._apiMaintenance=!1)}async _checkApiStatus(){this._apiMaintenance=await Et(this.hass)}_stopApiStatusPoll(){this._apiStatusInterval!==void 0&&(clearInterval(this._apiStatusInterval),this._apiStatusInterval=void 0)}updated(e){!this._initDone&&this.isConnected&&this.hass&&this._config&&(this._initDone=!0,this._fetchAllHistory(),this._historyInterval=window.setInterval(()=>{this._fetchAllHistory()},Ue),this._checkCardVersion()),this._reattachSparklineHover()}async _fetchAllHistory(){try{let e=this._resolveEntities();await Promise.all(e.map(async e=>{let t=await en(this.hass,e.entity_id);this._history={...this._history,[e.entity_id]:t}})),this._historyError=!1}catch(e){console.warn(`[Tankstellen Austria] history refresh failed`,e),this._historyError=!0}}async _checkCardVersion(){let e=await kn(this.hass,`tankstellen_austria/card_version`,Be);e&&(this._versionMismatch=e)}_reattachSparklineHover(){this._sparklineCleanup&&=(this._sparklineCleanup(),void 0);let e=this.shadowRoot?.querySelector(`.sparkline-container[data-entity]`);if(!e)return;let t=Kt(this._ctx()),n=Wt(this._ctx()),r=e=>{let r=new Date(e);return`${t[r.getDay()]?.slice(0,2)??``} ${n===`de`?`${r.getDate()}.${r.getMonth()+1}.`:`${r.getMonth()+1}/${r.getDate()}`} ${String(r.getHours()).padStart(2,`0`)}:${String(r.getMinutes()).padStart(2,`0`)}`};this._sparklineCleanup=fn(e,{formatTime:r,formatPrice:U})}render(){if(!this.hass||!this._config)return P`
        <ha-card>
          <div class="empty" role="status" aria-live="polite">
            ${this._t(`loading`)}
          </div>
          ${this._renderFooter(void 0)}
        </ha-card>
      `;let e=this._resolveEntities(),t=this._activeTab>=e.length?0:this._activeTab;if(!e.length)return P`
        <ha-card>
          ${this._renderVersionBanner()}
          <div class="empty">${this._t(`no_data`)}</div>
          ${this._renderFooter(void 0)}
        </ha-card>
      `;let n=e[t]??e[0],r=n.attributes.attribution;return P`
      <ha-card>
        ${this._renderTabs(e,t)}
        <div class="wrap">
          ${this._renderVersionBanner()}
          ${this._apiMaintenance&&n.state===`unavailable`?P`<ha-alert alert-type="info" role="status">
                ${this._t(`api_maintenance`)}
              </ha-alert>`:I}
          ${this._historyError?P`<ha-alert alert-type="warning" role="alert">
                ${this._t(`history_fetch_error`)}
              </ha-alert>`:I}
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
    `}_renderFooter(e){if(this._config?.hide_attribution===!0)return I;let t=this._config?.logo_adapt_to_theme===!0,n=!!this.hass?.themes?.darkMode,r=t?`brand-logo adaptive ${n?`adaptive-dark`:`adaptive-light`}`:`brand-logo`,i=e&&e.includes(`E-Control`)?e:qn;return P`
      <div class="footer">
        <a
          class="brand-link"
          href=${Pn(Mn)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="E-Control"
          @click=${e=>e.stopPropagation()}
        >
          <img
            class=${r}
            src=${Nn}
            alt="E-Control"
          />
        </a>
        <span class="attribution-text">${i}</span>
      </div>
    `}_renderVersionBanner(){if(this.preview)return I;let e=this._versionMismatch!==null&&typeof sessionStorage<`u`&&sessionStorage.getItem(`tsa-reload-attempted-${this._versionMismatch}`)===`1`;return jn({mismatchVersion:this._versionMismatch,stuck:e,t:(e,t)=>this._t(e,t),onReload:this._onVersionReload,onDismiss:this._onDismissVersionBanner})}_renderTabs(e,t){if(e.length<=1)return I;let n=this._config.tab_labels??{};return P`
      <div class="tabs" role="tablist">
        ${e.map((r,i)=>{let a=n[r.entity_id],o;if(typeof a==`string`&&a.trim().length>0)o=a;else if(o=qt(_t(this.hass,r.entity_id,r.attributes),this._ctx()),r.attributes.dynamic_mode===!0){let e=r.attributes.dynamic_tracker_label;e&&(o+=` · ${e}`)}let s=i===t;return P`
            <button
              type="button"
              role="tab"
              class=${V({tab:!0,active:s})}
              aria-selected=${s?`true`:`false`}
              tabindex=${s?`0`:`-1`}
              @click=${()=>this._onTabClick(i)}
              @keydown=${t=>this._onTabKeydown(t,i,e.length)}
            >
              ${o}
            </button>
          `})}
      </div>
    `}_renderHeader(e){if(this._config?.hide_header===!0)return I;let t=_t(this.hass,e.entity_id,e.attributes),n=e.attributes.fuel_type_name||qt(t,this._ctx()),r=e.attributes.dynamic_mode===!0,i=null;return r&&(i=e.attributes.dynamic_tracker_label??null),P`
      <header class="header">
        <div class="icon-tile" aria-hidden="true">
          <ha-icon icon="mdi:gas-station"></ha-icon>
        </div>
        <div class="header-text">
          <h2 class="title">${n}</h2>
          ${i?P`<p class="subtitle">${i}</p>`:I}
        </div>
        ${r?P`
              <div class="header-actions">
                ${this._renderRefreshButton()}
                ${this._renderDynamicChips(e)}
              </div>
            `:I}
      </header>
    `}_renderDynamicChips(e){let t=!!e.last_updated;return!t&&!this._noNewData?I:P`
      <div class="chip-row" aria-live="polite">
        ${t?P`<span class="chip muted">
              <ha-icon icon="mdi:clock-outline" aria-hidden="true"></ha-icon>
              <ha-relative-time
                .hass=${this.hass}
                .datetime=${new Date(e.last_updated)}
              ></ha-relative-time>
            </span>`:I}
        ${this._noNewData?P`<span class="chip warn" role="status">
              <ha-icon icon="mdi:alert-circle-outline" aria-hidden="true"></ha-icon>
              ${this._t(`no_new_data`)}
            </span>`:I}
      </div>
    `}_renderRefreshButton(){let e=Ve-(Date.now()-this._lastManualRefresh),t=e>0,n=t?(()=>{let t=Math.ceil(e/1e3);return`${Math.floor(t/60)}:${String(t%60).padStart(2,`0`)}`})():``;return P`
      <button
        class=${V({"btn-primary":!0,cooling:t})}
        type="button"
        aria-label=${this._t(`refresh`)}
        aria-disabled=${t?`true`:`false`}
        @click=${this._onRefresh}
      >
        <ha-icon icon="mdi:refresh" aria-hidden="true"></ha-icon>
        <span>${t?n:this._t(`refresh`)}</span>
      </button>
    `}_renderHero(e){let t=e.attributes.stations??[];if(!t.length)return I;let n=e.attributes.dynamic_mode===!0,r=t[0]?.price,i=e.attributes.average_price;return n||this._config.hide_header_price===!0||r==null?I:P`
      <div class="hero">
        <div class="metric">
          <div class="metric-value">
            <span class="metric-num">${U(r)}</span>
            ${i==null?I:P`<span class="metric-of"
                  >/ ${U(i)} ${this._t(`average`)}</span
                >`}
          </div>
          <div class="metric-label">${this._t(`cheapest`)}</div>
        </div>
      </div>
    `}_renderSparklineBlock(e){return e.attributes.dynamic_mode===!0||this._config.show_history===!1?I:this._renderSparkline(e)}_renderSparkline(e){let t=e.entity_id,n=this._history[t]??[];if(n.length<2)return I;let r=this._config.show_median_line===!0,i=this._config.show_hour_envelope===!0,a=this._config.show_noon_markers===!0,o=this._config.show_minmax!==!1,s=i?En(n):null,c=this._config.show_best_refuel===!1?null:Tn(n),l=dn({points:n,showMedianLine:r,showHourEnvelope:i,showNoonMarkers:a,showMinMax:o,hourEnvelope:s,analysis:c,translations:{min_label:this._t(`min_label`),max_label:this._t(`max_label`),last_7_days:this._t(`last_7_days`),median_delta_below:this._t(`median_delta_below`),median_delta_above:this._t(`median_delta_above`),median_delta_equal:this._t(`median_delta_equal`),sparkline_aria_summary:this._t(`sparkline_aria_summary`),sparkline_aria_simple:this._t(`sparkline_aria_simple`)}});return l.template===I?I:P`
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
    `}_renderRecommendation(e){if(!e)return I;if(!e.hasEnoughData)return P`
        <div class="refuel-hint">
          <ha-icon icon="mdi:information-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
          ${this._t(`not_enough_data_hint`)}
        </div>
      `;let t=e.hour??0,n=e.hour_end??(t+1)%24,r=String(t).padStart(2,`0`),i=String(n).padStart(2,`0`),a;if(e.weekday!=null){let t=Kt(this._ctx())[e.weekday]??``;a=this._t(`best_refuel_hour_weekday`,{h1:r,h2:i,day:t})}else a=this._t(`best_refuel_hour`,{h1:r,h2:i});let o=e.confidence;if(!o)return P`
        <div class="refuel-recommendation">
          <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
          <span class="refuel-text">${a}</span>
        </div>
      `;let s=this._t(`confidence_${o.level}`),c=[`${this._t(`confidence_title`)}: ${s}`,`${this._t(`confidence_span`)}: ${o.span_days} ${this._t(`confidence_days`)}`,`${this._t(`confidence_coverage`)}: ${o.coverage_pct}%`,`${this._t(`confidence_gap`)}: ${o.gap_cents.toFixed(1)} ${this._t(`confidence_cents`)}`];o.span_days<14&&c.push(this._t(`confidence_short_history_hint`));let l=c.join(`. `),u=`refuel-confidence refuel-confidence-${o.level}`;return P`
      <div class="refuel-recommendation">
        <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
        <span class="refuel-text">${a}</span>
        <span
          class=${u}
          title=${l}
          aria-label=${l}
        >${s}</span>
      </div>
    `}_renderCars(e){let t=e.attributes.stations??[];if(!t.length)return I;let n=this._config.show_cars===!0,r=this._config.show_car_fillup!==!1,i=this._config.show_car_consumption!==!1;if(!n||!r&&!i)return I;let a=_t(this.hass,e.entity_id,e.attributes),o=this._config.payment_filter??[],s=this._config.payment_highlight_mode===!0,c=(this._config.cars??[]).filter(e=>e.fuel_type===a&&e.tank_size>0&&e.name),l=r?c:c.filter(e=>Number(e.consumption)>0);if(!l.length)return I;let u=s?t:t.filter(e=>bt(e,o)),d=s?t[0]?.price:u[0]?.price;return P`
      <div class="cars-fillup">
        ${l.map(e=>this._renderCarRow(e,d,r,i))}
      </div>
    `}_renderCarRow(e,t,n,r){let i=Number(e.consumption),a=Number.isFinite(i)&&i>0?i.toFixed(1).replace(`.`,`,`):``;if(n){let n=t==null?`–`:`€ ${(t*Number(e.tank_size)).toFixed(2).replace(`.`,`,`)}`,o=t!=null&&i>0?`€ ${(t*i).toFixed(2).replace(`.`,`,`)}`:`–`;return P`
        <div class="car-fillup-row">
          <span class="car-fillup-name">
            <ha-icon icon=${e.icon||`mdi:car`} class="car-icon" aria-hidden="true"></ha-icon>
            ${e.name}
            <span class="car-fillup-liters">${e.tank_size} L</span>
          </span>
          <span class="car-fillup-cost">${n}</span>
        </div>
        ${r&&i>0?P`
              <div class="car-per100-row">
                <span class="car-per100-label">${a} l/100 km</span>
                <span class="car-per100-cost">${o} / 100 km</span>
              </div>
            `:I}
      `}let o=t==null?`–`:`€ ${(t*i).toFixed(2).replace(`.`,`,`)}`;return P`
      <div class="car-fillup-row">
        <span class="car-fillup-name">
          <ha-icon icon=${e.icon||`mdi:car`} class="car-icon" aria-hidden="true"></ha-icon>
          ${e.name}
          <span class="car-fillup-liters">${a} l/100 km</span>
        </span>
        <span class="car-fillup-cost">${o} / 100 km</span>
      </div>
    `}_renderStationList(e,t){let n=e.attributes.stations??[],r=parseInt(String(this._config.max_stations),10),i=Number.isFinite(r)?Math.max(0,Math.min(5,r)):5,a=this._config.payment_filter??[],o=this._config.payment_highlight_mode===!0,s=o?n:n.filter(e=>bt(e,a));if(e.state===`unavailable`)return P`<div class="empty" role="status" aria-live="polite">
        <div class="empty-title">${this._t(`unreachable`)}</div>
        <div class="empty-detail">${this._t(`unreachable_detail`)}</div>
      </div>`;if(i===0)return I;if(!s.length&&a.length&&n.length)return P`
        <div class="empty">
          ${this._t(`payment_filter_active`)} — ${this._t(`no_data`)}
        </div>
      `;if(!s.length)return P`<div class="empty">${this._t(`no_data`)}</div>`;let c=s;return this._config.sort_by_distance===!0&&(c=[...s],c.sort((e,t)=>(e.distance_m??1/0)-(t.distance_m??1/0))),P`
      <div class="stations">
        ${c.slice(0,i).map((e,n)=>this._renderStation(e,n,t,a,o))}
      </div>
    `}_renderIndexTile(e,t){let n=this._config.tile_shape===`circle`;if(this._config.show_brand!==!0)return P`<div class=${V({"index-tile":!0,circle:n})} aria-hidden="true">
        ${t+1}
      </div>`;let r=Ye(e.name),i=r.bg?{"--tankst-tile-bg":r.bg,"--tankst-tile-fg":r.fg??``}:{};return P`<div
      class=${V({"index-tile":!0,brand:!0,"brand-known":!!r.bg,circle:n})}
      style=${ze(i)}
      aria-hidden="true"
    >
      ${r.initials}
    </div>`}_renderStation(e,t,n,r,i){let a=this._config.show_index!==!1,o=this._config.show_map_links!==!1,s=this._config.show_distance===!0,c=this._config.show_opening_hours!==!1,l=this._config.show_payment_methods!==!1,u=e.location??{},d=`${n}|${e.name??``}|${u.address??``}`,f=this._expandedStations.has(d),p=e.open===!1,m=!p&&St(e),h=i&&r.length>0&&bt(e,r),g=h?xt(e,r,{cash:this._t(`cash`),debit_card:this._t(`debit_card`),credit_card:this._t(`credit_card`)}):[],_=c&&!!e.opening_hours?.length,v=l&&vt(e.payment_methods),y=_||v,b=[e.name||`–`,u.city??``,U(e.price)].filter(Boolean).join(`, `),x=y?`tsa-station-detail-${n}-${t}`:void 0,S=!!e.name,C=u.city??``,w=u.address??``,T=[u.postalCode,C].filter(e=>e!=null&&e!==``).join(` `),E=T?P`<span lang="de">${T}</span>`:I,D=w?P`<span lang="de">${w}</span>`:I,O=E!==I&&D!==I?`, `:``;return P`
      <div class=${V({station:!0,"pm-highlight":h})}>
        <div
          class="station-main"
          role=${y?`button`:`group`}
          tabindex=${y?`0`:`-1`}
          aria-expanded=${y?f?`true`:`false`:I}
          aria-controls=${x??I}
          aria-label=${b}
          @click=${()=>this._onStationClick(d)}
          @keydown=${e=>this._onStationKeydown(e,d,y)}
        >
          ${a?this._renderIndexTile(e,t):I}
          <div class="info">
            <div class="name">
              ${S?P`<span lang="de">${e.name}</span>`:`–`}
              ${p?P`<span class="flag closed">${this._t(`closed`)}</span>`:m?P`<span class="flag closing-soon"
                      >${this._t(`closing_soon`)}</span
                    >`:I}
              ${g.map(e=>P`<span class="chip match">${e}</span>`)}
            </div>
            <div class="address">
              ${E}${O}${D}
            </div>
          </div>
          <div class="price">${U(e.price)}</div>
          ${(()=>{let t=I;if(o){let n=Ln(this._config.map_provider??`auto`,In(navigator.userAgent,navigator.maxTouchPoints)),r=Fn(wt(u,e.name??``,n));r&&(t=P`
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
                `)}let n=s&&e.distance_m!=null?P`<span class="distance" lang="de"
                    >${Ct(e.distance_m)}</span
                  >`:I;return t===I&&n===I?I:P`<div
              class=${V({"map-action":!0,"has-distance":n!==I})}
            >
              ${t}${n}
            </div>`})()}
          ${y?P`<ha-icon
                class="expander-chevron"
                icon="mdi:chevron-down"
                aria-hidden="true"
              ></ha-icon>`:I}
        </div>
        ${y?P`
              <div
                id=${x}
                class=${V({"station-detail":!0,expanded:f})}
              >
                <div class="detail-cols">
                  ${_?P`<div class="detail-col">${this._renderHours(e.opening_hours??[])}</div>`:I}
                  ${v?P`<div class="detail-col">${this._renderPaymentMethods(e.payment_methods)}</div>`:I}
                </div>
              </div>
            `:I}
      </div>
    `}_renderHours(e){let t=e.find(e=>e.day===`MO`)??e[0],n=e.find(e=>e.day===`SA`)??e[5],r=e.find(e=>e.day===`SO`)??e[6],i=e.find(e=>e.day===`FE`);return P`
      <div class="hours-grid">
        ${t?P`<span class="day">${this._t(`mon_fri`)}</span><span>${t.from} – ${t.to}</span>`:I}
        ${n?P`<span class="day">${this._t(`sat`)}</span><span>${n.from} – ${n.to}</span>`:I}
        ${r?P`<span class="day">${this._t(`sun`)}</span><span>${r.from} – ${r.to}</span>`:I}
        ${i?P`<span class="day">${this._t(`holiday`)}</span><span>${i.from} – ${i.to}</span>`:I}
      </div>
    `}_renderPaymentMethods(e){if(!e)return I;let t=[];e.cash&&t.push(P`
        <span class="pm-badge">
          <ha-icon icon="mdi:cash" class="pm-icon" aria-hidden="true"></ha-icon>
          ${this._t(`cash`)}
        </span>
      `),e.debit_card&&t.push(P`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon" aria-hidden="true"></ha-icon>
          ${this._t(`debit_card`)}
        </span>
      `),e.credit_card&&t.push(P`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon" aria-hidden="true"></ha-icon>
          ${this._t(`credit_card`)}
        </span>
      `);for(let n of e.others??[])t.push(P`<span class="pm-badge pm-other">${n}</span>`);return t.length?P`
      <div class="pm-section">
        <div class="pm-label">${this._t(`payment`)}</div>
        <div class="pm-badges">${t}</div>
      </div>
    `:I}_onTabClick(e){this._activeTab!==e&&(this._activeTab=e,this._expandedStations=/* @__PURE__ */ new Set)}_onTabKeydown(e,t,n){let r=t;switch(e.key){case`ArrowRight`:r=(t+1)%n;break;case`ArrowLeft`:r=(t-1+n)%n;break;case`Home`:r=0;break;case`End`:r=n-1;break;default:return}e.preventDefault(),this._onTabClick(r),this.updateComplete.then(()=>{(this.shadowRoot?.querySelectorAll(`.tabs [role="tab"]`))?.[r]?.focus()})}_onStationClick(e){let t=new Set(this._expandedStations);t.has(e)?t.delete(e):t.add(e),this._expandedStations=t}_onStationKeydown(e,t,n){n&&(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this._onStationClick(t))}_onSparklineClick(e){this.dispatchEvent(new CustomEvent(`hass-more-info`,{detail:{entityId:e},bubbles:!0,composed:!0}))}static{this.styles=Dn}};X([Ne({attribute:!1})],$.prototype,`hass`,void 0),X([Ne({reflect:!0})],$.prototype,`layout`,void 0),X([Ne({type:Boolean})],$.prototype,`preview`,void 0),X([B()],$.prototype,`_config`,void 0),X([B()],$.prototype,`_activeTab`,void 0),X([B()],$.prototype,`_expandedStations`,void 0),X([B()],$.prototype,`_history`,void 0),X([B()],$.prototype,`_versionMismatch`,void 0),X([B()],$.prototype,`_lastManualRefresh`,void 0),X([B()],$.prototype,`_noNewData`,void 0),X([B()],$.prototype,`_historyError`,void 0),X([B()],$.prototype,`_apiMaintenance`,void 0),X([B()],$.prototype,`_cooldownTick`,void 0),$=X([Ae(`tankstellen-austria-card`)],$);export{$ as TankstellenAustriaCard};