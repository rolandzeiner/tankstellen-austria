/*! Tankstellen Austria Card — bundled by Rolldown. Edit sources in src/, then `npm run build`. */
var e=Object.defineProperty,t=(t,n)=>{let r={};for(var i in t)e(r,i,{get:t[i],enumerable:!0});return n||e(r,Symbol.toStringTag,{value:`Module`}),r},n=globalThis,r=n.ShadowRoot&&(n.ShadyCSS===void 0||n.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,i=Symbol(),a=/* @__PURE__ */ new WeakMap,o=class{constructor(e,t,n){
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(r&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=a.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&a.set(t,e))}return e}toString(){return this.cssText}},s=e=>new o(typeof e==`string`?e:e+``,void 0,i),c=(e,...t)=>new o(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,i),l=(e,t)=>{if(r)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let r of t){let t=document.createElement(`style`),i=n.litNonce;i!==void 0&&t.setAttribute(`nonce`,i),t.textContent=r.cssText,e.appendChild(t)}},u=r?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return s(t)})(e):e,{is:d,defineProperty:f,getOwnPropertyDescriptor:p,getOwnPropertyNames:ee,getOwnPropertySymbols:m,getPrototypeOf:h}=Object,g=globalThis,_=g.trustedTypes,v=_?_.emptyScript:``,y=g.reactiveElementPolyfillSupport,b=(e,t)=>e,x={toAttribute(e,t){
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
switch(t){case Boolean:e=e?v:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},S=(e,t)=>!d(e,t),te={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:S};Symbol.metadata??=Symbol(`metadata`),g.litPropertyMetadata??=/* @__PURE__ */ new WeakMap;var C=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=te){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&f(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=p(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??te}static _$Ei(){if(this.hasOwnProperty(b(`elementProperties`)))return;let e=h(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b(`properties`))){let e=this.properties,t=[...ee(e),...m(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=/* @__PURE__ */ new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(u(e))}else e!==void 0&&t.push(u(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=/* @__PURE__ */ new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=/* @__PURE__ */ new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=/* @__PURE__ */ new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return l(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?x:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?x:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??S)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=/* @__PURE__ */ new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=/* @__PURE__ */ new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=/* @__PURE__ */ new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};C.elementStyles=[],C.shadowRootOptions={mode:`open`},C[b(`elementProperties`)]=/* @__PURE__ */ new Map,C[b(`finalized`)]=/* @__PURE__ */ new Map,y?.({ReactiveElement:C}),(g.reactiveElementVersions??=[]).push(`2.1.2`);
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var w=globalThis,ne=e=>e,re=w.trustedTypes,ie=re?re.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,ae=`$lit$`,T=`lit$${Math.random().toFixed(9).slice(2)}$`,oe=`?`+T,se=`<${oe}>`,E=document,ce=()=>E.createComment(``),le=e=>e===null||typeof e!=`object`&&typeof e!=`function`,ue=Array.isArray,de=e=>ue(e)||typeof e?.[Symbol.iterator]==`function`,fe=`[ 	
\f\r]`,pe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,me=/-->/g,he=/>/g,D=RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),ge=/'/g,_e=/"/g,ve=/^(?:script|style|textarea|title)$/i,ye=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),O=ye(1),k=ye(2),A=Symbol.for(`lit-noChange`),j=Symbol.for(`lit-nothing`),be=/* @__PURE__ */ new WeakMap,M=E.createTreeWalker(E,129);function xe(e,t){if(!ue(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return ie===void 0?t:ie.createHTML(t)}var Se=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=pe;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===pe?c[1]===`!--`?o=me:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=D):(ve.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=D):o=he:o===D?c[0]===`>`?(o=i??pe,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?D:c[3]===`"`?_e:ge):o===_e||o===ge?o=D:o===me||o===he?o=pe:(o=D,i=void 0);let d=o===D&&e[t+1].startsWith(`/>`)?` `:``;a+=o===pe?n+se:l>=0?(r.push(s),n.slice(0,l)+ae+n.slice(l)+T+d):n+T+(l===-2?t:d)}return[xe(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Ce=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Se(t,n);if(this.el=e.createElement(l,r),M.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=M.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(ae)){let t=u[o++],n=i.getAttribute(e).split(T),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?De:r[1]===`?`?Oe:r[1]===`@`?ke:Ee}),i.removeAttribute(e)}else e.startsWith(T)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(ve.test(i.tagName)){let e=i.textContent.split(T),t=e.length-1;if(t>0){i.textContent=re?re.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],ce()),M.nextNode(),c.push({type:2,index:++a});i.append(e[t],ce())}}}else if(i.nodeType===8){if(i.data===oe)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(T,e+1))!==-1;)c.push({type:7,index:a}),e+=T.length-1}}a++}}static createElement(e,t){let n=E.createElement(`template`);return n.innerHTML=e,n}};function N(e,t,n=e,r){if(t===A)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=le(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=N(e,i._$AS(e,t.values),i,r)),t}var we=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??E).importNode(t,!0);M.currentNode=r;let i=M.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new Te(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Ae(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=M.nextNode(),a++)}return M.currentNode=E,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},Te=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=N(this,e,t),le(e)?e===j||e==null||e===``?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==A&&this._(e):e._$litType$===void 0?e.nodeType===void 0?de(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==j&&le(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Ce.createElement(xe(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new we(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=be.get(e.strings);return t===void 0&&be.set(e.strings,t=new Ce(e)),t}k(t){ue(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(ce()),this.O(ce()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=ne(e).nextSibling;ne(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Ee=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(/* @__PURE__ */ new String),this.strings=n):this._$AH=j}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=N(this,e,t,0),a=!le(e)||e!==this._$AH&&e!==A,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=N(this,r[n+o],t,o),s===A&&(s=this._$AH[o]),a||=!le(s)||s!==this._$AH[o],s===j?e=j:e!==j&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},De=class extends Ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}},Oe=class extends Ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==j)}},ke=class extends Ee{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=N(this,e,t,0)??j)===A)return;let n=this._$AH,r=e===j&&n!==j||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==j&&(n===j||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Ae=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){N(this,e)}},je=w.litHtmlPolyfillSupport;je?.(Ce,Te),(w.litHtmlVersions??=[]).push(`3.3.3`);var Me=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new Te(t.insertBefore(ce(),e),e,void 0,n??{})}return i._$AI(e),i},Ne=globalThis,P=class extends C{constructor(){
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Me(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};P._$litElement$=!0,P.finalized=!0,Ne.litElementHydrateSupport?.({LitElement:P});var Pe=Ne.litElementPolyfillSupport;Pe?.({LitElement:P}),(Ne.litElementVersions??=[]).push(`4.2.2`);
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var Fe=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})},Ie={attribute:!0,type:String,converter:x,reflect:!1,hasChanged:S},Le=(e=Ie,t,n)=>{
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=/* @__PURE__ */ new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function F(e){return(t,n)=>typeof n==`object`?Le(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/function I(e){return F({...e,state:!0,attribute:!1})}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var Re={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ze=e=>(...t)=>({_$litDirective$:e,values:t}),Be=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},L=ze(class extends Be{constructor(e){
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
if(super(e),e.type!==Re.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter(t=>e[t]).join(` `)+` `}update(e,[t]){if(this.st===void 0){this.st=/* @__PURE__ */ new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter(e=>e!==``)));for(let e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return A}}),Ve=`important`,He=` !`+Ve,Ue=ze(class extends Be{constructor(e){
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
if(super(e),e.type!==Re.ATTRIBUTE||e.name!==`style`||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,n)=>{let r=e[n];return r==null?t:t+`${n=n.includes(`-`)?n:n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,`-$&`).toLowerCase()}:${r};`},``)}update(e,[t]){let{style:n}=e.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let e of this.ft)t[e]??(this.ft.delete(e),e.includes(`-`)?n.removeProperty(e):n[e]=null);for(let e in t){let r=t[e];if(r!=null){this.ft.add(e);let t=typeof r==`string`&&r.endsWith(He);e.includes(`-`)||t?n.setProperty(e,t?r.slice(0,-11):r,t?Ve:``):n[e]=r}}return A}}),We=`2.0.0`,Ge=12e4,Ke=2e4,qe=18e5,R=`#1a1a1a`,Je=`#ffffff`,Ye=[{match:/\bomv\b/i,initials:`OMV`,bg:`#052759`,fg:`#1fff5a`},{match:/\bavanti\b/i,initials:`AVA`,bg:`#fbe800`,fg:`#1d1d1b`},{match:/\bbp\b/i,initials:`BP`,bg:`#007700`,fg:`#ffe600`},{match:/\bshell\b/i,initials:`SH`,bg:`#fbce07`,fg:R},{match:/\beni(?:\d+)?\b/i,initials:`ENI`,bg:`#fab600`,fg:R},{match:/\bjet\b/i,initials:`JET`,bg:`#ffb700`,fg:`#164194`},{match:/\bturm(?:ö|oe)l\b/i,initials:`TÖ`,bg:`#f04e23`,fg:R},{match:/\bavia\b/i,initials:`AV`,bg:`#e30613`,fg:Je},{match:/\bsocar\b/i,initials:`SO`,bg:`#e4022c`,fg:Je},{match:/\b(?:genol|lagerhaus|lh)\b/i,initials:`LH`,bg:`#009e3c`,fg:R},{match:/^\s*diskont(?:[\s-]*tank(?:stelle|en))?\s*$/i,initials:`DT`,bg:`#1d1d1b`,fg:Je},{match:/\bdisk\b/i,initials:`DSK`,bg:`#ec6623`,fg:R},{match:/\brumpold\b/i,initials:`RU`,bg:`#232323`,fg:`#ffe800`},{match:/\bf\.?\s*leitner\b/i,initials:`FL`,bg:`#153d8a`,fg:`#ffcc00`},{match:/\biq\b/i,initials:`IQ`,bg:`#ec6708`,fg:R},{match:/\blm[\s-]?energy\b/i,initials:`LM`,bg:`#005a77`,fg:`#d3d800`}],Xe=/* @__PURE__ */ new Set([`tankstelle`,`tankstellen`,`tanken`,`diesel`,`diskont`,`shop`,`quick`,`austria`,`gmbh`,`co`,`kg`]);function Ze(e){let[t,n]=e.split(/[^\p{L}\p{N}]+/u).filter(e=>e.length>0&&!Xe.has(e.toLowerCase()));return t?(n&&!/^\d/.test(t)?`${t[0]}${n[0]}`:t.slice(0,2)).toUpperCase():``}function Qe(e){let t=e??``,n=Ye.find(e=>e.match.test(t));return n?{initials:n.initials,bg:n.bg,fg:n.fg}:{initials:Ze(t)||`–`}}var $e=137,et=49,tt=40,nt=34,rt=80,it=83,at=15,ot=24,st=62;function ct(e,t){let n=$e;t.entityCount>1&&(n+=et),e.hide_header_price===!0&&(n-=tt),e.hide_attribution===!0&&(n-=nt),e.show_history!==!1&&!t.dynamic&&(n+=rt,e.show_best_refuel!==!1&&(n+=it)),e.show_cars===!0&&(e.show_car_fillup!==!1||e.show_car_consumption!==!1)&&t.carCount>0&&(n+=at+ot*t.carCount);let r=e.max_stations??5;return n+=st*Math.min(r,t.stationCount),n}var lt=[`DIE`,`SUP`,`GAS`];function ut(e){if(!e||typeof e!=`object`)return null;let t=e,n=typeof t.name==`string`?t.name.slice(0,50):``,r=lt.includes(t.fuel_type)?t.fuel_type:`DIE`,i=parseInt(String(t.tank_size),10),a=Number.isFinite(i)&&i>=1?Math.min(200,i):50,o;if(typeof t.consumption==`number`||typeof t.consumption==`string`){let e=parseFloat(String(t.consumption));Number.isFinite(e)&&e>=0&&(o=Math.min(30,e))}let s={name:n,fuel_type:r,tank_size:a,icon:typeof t.icon==`string`&&t.icon.startsWith(`mdi:`)?t.icon:`mdi:car`};return o!=null&&(s.consumption=o),s}function dt(e){if(!e)throw Error(`tankstellen-austria-card: config missing`);let t={...e};if(typeof t.entities==`string`&&(t.entities=[t.entities]),Array.isArray(t.entities)?t.entities=t.entities.filter(e=>typeof e==`string`&&e.includes(`.`)):t.entities!=null&&(console.warn(`[Tankstellen Austria] config.entities must be an array of entity IDs — ignoring`,t.entities),delete t.entities),t.max_stations!=null){let e=parseInt(String(t.max_stations),10);t.max_stations=Number.isFinite(e)?Math.max(0,Math.min(5,e)):5}return Array.isArray(t.payment_filter)?t.payment_filter=t.payment_filter.filter(e=>typeof e==`string`&&e.length>0):t.payment_filter!=null&&delete t.payment_filter,Array.isArray(t.cars)?t.cars=t.cars.map(e=>ut(e)).filter(e=>e!==null):t.cars!=null&&delete t.cars,t}var ft={stations:{count:5,sort:`price`,index:!0,brand:!1,tile_shape:`square`,map_links:!0,map_provider:`auto`,distance:!1,opening_hours:!0,payment_methods:!0,payment_mode:`filter`},header:{show:!0,price:!0},chart:{show:!0,median_line:!1,hour_envelope:!1,noon_markers:!1,min_max:!0,best_refuel:!0},cars:{show:!1,fill_up:!0,consumption:!0},footer:{adaptive_logo:!1,show:!0}},pt=[`stations`,`header`,`chart`,`cars`,`footer`],z=e=>typeof e==`boolean`?!e:e,mt=[{flat:`max_stations`,group:`stations`,key:`count`},{flat:`sort_by_distance`,group:`stations`,key:`sort`,toGroup:e=>e===!0?`distance`:`price`,toFlat:e=>e===`distance`},{flat:`show_index`,group:`stations`,key:`index`},{flat:`show_brand`,group:`stations`,key:`brand`},{flat:`tile_shape`,group:`stations`,key:`tile_shape`},{flat:`show_distance`,group:`stations`,key:`distance`},{flat:`show_opening_hours`,group:`stations`,key:`opening_hours`},{flat:`show_payment_methods`,group:`stations`,key:`payment_methods`},{flat:`show_map_links`,group:`stations`,key:`map_links`},{flat:`map_provider`,group:`stations`,key:`map_provider`},{flat:`payment_filter`,group:`stations`,key:`payment_filter`},{flat:`payment_highlight_mode`,group:`stations`,key:`payment_mode`,toGroup:e=>e===!0?`highlight`:`filter`,toFlat:e=>e===`highlight`},{flat:`hide_header`,group:`header`,key:`show`,toGroup:z,toFlat:z},{flat:`hide_header_price`,group:`header`,key:`price`,toGroup:z,toFlat:z},{flat:`show_history`,group:`chart`,key:`show`},{flat:`show_best_refuel`,group:`chart`,key:`best_refuel`},{flat:`show_median_line`,group:`chart`,key:`median_line`},{flat:`show_hour_envelope`,group:`chart`,key:`hour_envelope`},{flat:`show_noon_markers`,group:`chart`,key:`noon_markers`},{flat:`show_minmax`,group:`chart`,key:`min_max`},{flat:`show_cars`,group:`cars`,key:`show`},{flat:`show_car_fillup`,group:`cars`,key:`fill_up`},{flat:`show_car_consumption`,group:`cars`,key:`consumption`},{flat:`hide_attribution`,group:`footer`,key:`show`,toGroup:z,toFlat:z},{flat:`logo_adapt_to_theme`,group:`footer`,key:`adaptive_logo`}],ht=e=>!!e&&typeof e==`object`&&!Array.isArray(e);function gt(e){let t={...e},n={};for(let r of pt)ht(e[r])&&(n[r]={...e[r]}),delete t[r];Array.isArray(e.cars)&&(n.cars={items:e.cars,...n.cars});for(let r of mt){let i=e[r.flat];if(delete t[r.flat],i===void 0)continue;let a=n[r.group]??={};a[r.key]===void 0&&(a[r.key]=r.toGroup?r.toGroup(i):i)}for(let e of pt)n[e]&&Object.keys(n[e]).length>0&&(t[e]=n[e]);return t}function _t(e){let t={...e},n={};for(let r of pt)ht(e[r])&&(n[r]=e[r]),delete t[r];for(let e of mt){let r=n[e.group]?.[e.key];r!==void 0&&(t[e.flat]=e.toFlat?e.toFlat(r):r)}return n.cars?.items!==void 0&&(t.cars=n.cars.items),t}var vt=`fuel_`;function yt(e){return!e||!e.states?[]:Object.keys(e.states).filter(t=>{if(!t.startsWith(`sensor.`))return!1;if(e.entities?.[t]?.platform===`tankstellen_austria`)return!0;let n=e.states[t];return!!(n?.attributes?.fuel_type&&Array.isArray(n.attributes.stations))})}function B(e,t,n){let r=n?.fuel_type;if(typeof r==`string`&&r)return r;let i=e?.entities?.[t]?.translation_key;return typeof i==`string`&&i.startsWith(vt)?i.slice(5).toUpperCase():``}function bt(e){return e?!!(e.cash||e.debit_card||e.credit_card||e.others&&e.others.length>0):!1}function xt(e,t,n){return t===`cash`?e.cash?n?.cash??`cash`:null:t===`debit_card`?e.debit_card?n?.debit_card??`debit_card`:null:t===`credit_card`?e.credit_card?n?.credit_card??`credit_card`:null:(e.others??[]).find(e=>e.toLowerCase()===t.toLowerCase())??null}function St(e,t){if(!t||!t.length)return!0;let n=e.payment_methods??{};return t.some(e=>xt(n,e)!==null)}function Ct(e,t,n){if(!t||!t.length)return[];let r=e.payment_methods??{},i=[];for(let e of t){let t=xt(r,e,n);t!==null&&i.push(t)}return i}function wt(e,t=/* @__PURE__ */ new Date){if(e.open===!1)return!1;let n=e.opening_hours??[];if(!n.length)return!1;let r=t.getDay(),i=r===0?`SO`:r===6?`SA`:`MO`,a=n.find(e=>e.day===i);if(!a||!a.to||a.from===`00:00`&&a.to===`24:00`)return!1;let[o,s]=a.to.split(`:`);if(o===void 0||s===void 0)return!1;let c=parseInt(o,10),l=parseInt(s,10);if(!Number.isFinite(c)||!Number.isFinite(l))return!1;let u=new Date(t);c===0&&l===0?(u.setDate(u.getDate()+1),u.setHours(0,0,0,0)):u.setHours(c,l,0,0);let d=(u.getTime()-t.getTime())/6e4;return d>0&&d<=30}function Tt(e){return e==null||!Number.isFinite(Number(e))?`–`:`€ ${Number(e).toFixed(3).replace(`.`,`,`)}`}function V(e){return e==null||!Number.isFinite(Number(e))?`–`:Number(e).toFixed(3).replace(`.`,`,`)}function Et(e){return e==null||!Number.isFinite(e)||e<0?``:e<1e3?`${Math.round(e)} m`:`${(e/1e3).toFixed(1).replace(`.`,`,`)} km`}function Dt(e,t,n=`google`){if(!e)return t?`https://www.google.com/search?q=${encodeURIComponent(t)}`:null;if(/\d/.test(e.address??``)){let t=`${e.postalCode??``} ${e.city??``} ${e.address??``}`.trim(),r=encodeURIComponent(t);return n===`apple`?`https://maps.apple.com/?q=${r}`:n===`geo`?`geo:0,0?q=${r}`:`https://maps.google.com/?q=${r}`}let r=[t,e.address,e.postalCode,e.city].filter(e=>e!=null&&e!==``);return r.length===0?null:`https://www.google.com/search?q=${encodeURIComponent(r.join(` `))}`}var Ot=6e4;async function kt(e){try{return(await e.callWS({type:`tankstellen_austria/api_status`}))?.maintenance===!0}catch{return!1}}var At=/* @__PURE__ */ t({card:()=>Mt,common:()=>jt,default:()=>It,editor:()=>Ft,fuel_types:()=>Nt,weekdays:()=>Pt}),jt={version:`Version`,invalid_configuration:`Invalid configuration`,loading:`Loading…`,no_data:`No data available`},Mt={cheapest:`cheapest`,average:`avg.`,price:`Price`,closed:`Closed`,closing_soon:`Closing soon`,open_now:`Open`,opening_hours:`Opening hours`,payment:`Payment`,cash:`Cash`,debit_card:`Debit card`,credit_card:`Credit card`,payment_filter_active:`Payment filter active`,payment_highlight_active:`Payment filter (highlight)`,mon_fri:`Mon–Fri`,sat:`Sat`,sun:`Sun`,holiday:`Holiday`,map:`Map`,per_liter:`/l`,last_7_days:`Last 7 days`,window_label:`{h1}–{h2} h`,min_label:`Min`,max_label:`Max`,refresh:`Refresh`,last_updated:`Updated:`,no_new_data:`No new data`,version_update:`Tankstellen Austria updated to v{v} — please reload`,version_reload:`Reload`,version_reload_stuck:`Reload didn't load the new version. Check HACS and do a hard refresh (Ctrl+Shift+R).`,version_dismiss:`Dismiss`,fill_up:`Fill up`,best_refuel_hour:`Cheapest {h1}:00–{h2}:00`,best_refuel_alt:`also {a1}:00–{a2}:00`,best_refuel_weekday:`Cheapest day: {day}`,not_enough_data_hint:`Not enough data yet for a tip (min. 7 days)`,no_pattern_hint:`No time of day is reliably cheaper here: prices move {range} ¢ over a typical day. Fill up when it suits you`,noon_before:`Fill up before 12:00: noon +{c} ¢ on {n} of {d} days`,noon_some:`Noon +{c} ¢ on {n} of {d} days`,noon_none:`No noon price rise in {d} days`,now_cheaper:`Today below {pct} % of the last four weeks`,now_dearer:`Today above {pct} % of the last four weeks`,now_usual:`Today the usual price of the last four weeks`,confidence_high:`High`,confidence_medium:`Medium`,confidence_low:`Low`,confidence_title:`Recommendation confidence`,confidence_span:`Data span`,confidence_gap:`Lead over the rest of the day`,confidence_consistency:`Window time below the day's median`,confidence_tied_hint:`Another time of day is about as cheap, so the window can shift`,confidence_days:`days`,confidence_cents:`¢`,confidence_short_history_hint:`Note: Home Assistant keeps only 10 days of history by default. For better recommendations raise recorder.purge_keep_days to 30.`,median_delta_below:`{c}¢ below median`,median_delta_above:`{c}¢ above median`,median_delta_equal:`at median`,loading:`Loading…`,no_data:`No data available`,sparkline_open_more_info:`Open price history`,sparkline_aria_summary:`Price history last 7 days: minimum {min}, maximum {max}, median {median}`,sparkline_aria_simple:`Price history last 7 days: minimum {min}, maximum {max}`,history_fetch_error:`Couldn't load price history`,api_maintenance:`E-Control is down for maintenance. Prices return automatically when it's back.`,unreachable:`Can't reach E-Control`,unreachable_detail:`Prices come back on their own once the connection works again.`},Nt={DIE:`Diesel`,SUP:`Super 95`,GAS:`CNG`},Pt=[`Sunday`,`Monday`,`Tuesday`,`Wednesday`,`Thursday`,`Friday`,`Saturday`],Ft={entities:`Sensors`,entity_missing:`Sensor {entity} no longer exists. Pick a different sensor or remove it from this card's entities list.`,map_provider_auto:`Automatic (by device)`,map_provider_google:`Always Google Maps`,map_provider_apple:`Always Apple Maps`,tile_shape_square:`Rounded square`,tile_shape_circle:`Circle`,recorder_hint_intro:`Home Assistant keeps only 10 days of history by default. For better recommendations, add this block to configuration.yaml and restart:`,recorder_hint_docs:`Read the recorder docs`,copy:`Copy`,copied:`Copied`,section_tab_labels:`Tab labels`,tab_labels_hint:`Leave empty to use the default label`,section_cars:`Cars`,cars_both_off_hint:`No rows enabled. To hide cars entirely, turn off “Show cars”.`,car_fuel_type:`Fuel type`,car_delete:`Delete car`,add_car:`Add car`,copy_recorder_snippet:`Copy the recorder snippet`,consumption_range_error:`Please enter a value between 0 and 30 l/100 km`,section_stations:`Stations`,section_header:`Header`,section_chart:`Price history`,section_footer:`Logo & attribution`,stations_count:`Number of stations`,stations_index:`Show rank`,stations_brand:`Show brand`,stations_tile_shape:`Tile shape`,stations_map_links:`Show navigation links`,stations_map_provider:`Navigation app`,stations_distance:`Show distance`,stations_sort:`Order`,sort_price:`Cheapest first`,sort_distance:`Nearest first`,stations_opening_hours:`Show opening hours`,stations_payment_methods:`Show payment methods`,stations_payment_mode:`Stations without a match`,payment_mode_filter:`Hide them`,payment_mode_highlight:`Show them, highlight the matches`,header_show:`Show header`,header_price:`Show cheapest and average price`,chart_show:`Show price history`,chart_median_line:`Show 7-day median`,chart_hour_envelope:`Typical hourly range (4 wk)`,chart_noon_markers:`Noon reset markers`,chart_min_max:`Show min/max`,chart_best_refuel:`Show refuel tip`,cars_show:`Show cars`,cars_fill_up:`Show fill-up cost`,cars_consumption:`Show consumption`,footer_adaptive_logo:`Adapt E-Control logo color to theme`,footer_show:`Show attribution`,stations_payment_filter:`Only stations with`,stations_payment_filter_helper:`Pick from the list or type a method; it must match the name E-Control uses, e.g. Routex, UTA, DKV.`,summary_hidden:`Hidden`,summary_stations:`Up to {count} stations`,summary_stations_one:`1 station`,summary_filter:`Only {methods}`,summary_brand:`Brand`,summary_header_price:`With prices`,summary_header_title:`Title only`,summary_chart_best_refuel:`Refuel tip`,summary_chart_min_max:`Min/max`,summary_chart_median_line:`Median`,summary_chart_hour_envelope:`Hourly range`,summary_chart_noon_markers:`Noon markers`,summary_chart_plain:`Line only`,summary_cars:`{count} cars`,summary_cars_one:`1 car`,summary_cars_none:`No cars yet`,summary_shown:`Shown`,summary_adaptive_logo:`Logo follows theme`,car_name:`Name`,car_name_helper:`e.g. Golf TDI`,car_tank_size:`Tank size`,car_consumption:`Average consumption`,car_icon:`Icon`,car_unnamed:`Car {n}`,car_move_up:`Move up`,car_move_down:`Move down`,stations_brand_helper:`Replaces the rank`},It={common:jt,card:Mt,fuel_types:Nt,weekdays:Pt,editor:Ft},Lt=/* @__PURE__ */ t({card:()=>zt,common:()=>Rt,default:()=>Ut,editor:()=>Ht,fuel_types:()=>Bt,weekdays:()=>Vt}),Rt={version:`Version`,invalid_configuration:`Ungültige Konfiguration`,loading:`Lädt…`,no_data:`Keine Daten verfügbar`},zt={cheapest:`günstigster`,average:`Ø`,price:`Preis`,closed:`Geschlossen`,closing_soon:`Schließt bald`,open_now:`Geöffnet`,opening_hours:`Öffnungszeiten`,payment:`Zahlungsarten`,cash:`Bar`,debit_card:`Bankomat`,credit_card:`Kreditkarte`,payment_filter_active:`Zahlungsfilter aktiv`,payment_highlight_active:`Zahlungsfilter (Hervorhebung)`,mon_fri:`Mo–Fr`,sat:`Sa`,sun:`So`,holiday:`Feiertag`,map:`Karte`,per_liter:`/l`,last_7_days:`Letzte 7 Tage`,window_label:`{h1}–{h2} h`,min_label:`Min`,max_label:`Max`,refresh:`Aktualisieren`,last_updated:`Aktualisiert:`,no_new_data:`Keine neuen Daten`,version_update:`Tankstellen Austria wurde auf v{v} aktualisiert — bitte neu laden`,version_reload:`Neu laden`,version_reload_stuck:`Neu-Laden hat die neue Version nicht geladen. In HACS prüfen und einen harten Reload (Strg+Umschalt+R) ausführen.`,version_dismiss:`Ausblenden`,fill_up:`Volltanken`,best_refuel_hour:`Am günstigsten {h1}:00–{h2}:00`,best_refuel_alt:`auch {a1}:00–{a2}:00`,best_refuel_weekday:`Günstigster Tag: {day}`,not_enough_data_hint:`Noch zu wenig Daten für Empfehlung (mind. 7 Tage)`,no_pattern_hint:`Keine Tageszeit ist hier verlässlich günstiger: der Preis bewegt sich an einem typischen Tag um {range} Cent. Tanken, wann es passt`,noon_before:`Vor 12:00 tanken: mittags +{c} ¢ an {n} von {d} Tagen`,noon_some:`Mittags +{c} ¢ an {n} von {d} Tagen`,noon_none:`Kein Mittagsanstieg in {d} Tagen`,now_cheaper:`Heute unter {pct} % der letzten vier Wochen`,now_dearer:`Heute über {pct} % der letzten vier Wochen`,now_usual:`Heute der übliche Preis der letzten vier Wochen`,confidence_high:`Hoch`,confidence_medium:`Mittel`,confidence_low:`Niedrig`,confidence_title:`Empfehlungsgüte`,confidence_span:`Datenumfang`,confidence_gap:`Vorsprung zum Rest des Tages`,confidence_consistency:`Fensterzeit unter dem Tagesmedian`,confidence_tied_hint:`Eine andere Tageszeit ist etwa gleich günstig, das Fenster kann wechseln`,confidence_days:`Tage`,confidence_cents:`Cent`,confidence_short_history_hint:`Hinweis: Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen recorder.purge_keep_days auf 30 erhöhen.`,median_delta_below:`{c}¢ unter Median`,median_delta_above:`{c}¢ über Median`,median_delta_equal:`auf Median`,loading:`Wird geladen…`,no_data:`Keine Daten verfügbar`,sparkline_open_more_info:`Preisverlauf öffnen`,sparkline_aria_summary:`Preisverlauf der letzten 7 Tage: Minimum {min}, Maximum {max}, Median {median}`,sparkline_aria_simple:`Preisverlauf der letzten 7 Tage: Minimum {min}, Maximum {max}`,history_fetch_error:`Preisverlauf konnte nicht geladen werden`,api_maintenance:`E-Control führt Wartungsarbeiten durch. Die Preise kommen automatisch zurück, sobald der Dienst wieder läuft.`,unreachable:`Keine Verbindung zur E-Control`,unreachable_detail:`Die Preise erscheinen von selbst wieder, sobald die Verbindung funktioniert.`},Bt={DIE:`Diesel`,SUP:`Super 95`,GAS:`CNG Erdgas`},Vt=[`Sonntag`,`Montag`,`Dienstag`,`Mittwoch`,`Donnerstag`,`Freitag`,`Samstag`],Ht={entities:`Sensoren`,entity_missing:`Sensor {entity} existiert nicht mehr. Wähle einen anderen Sensor oder entferne ihn aus den Entitäten dieser Karte.`,map_provider_auto:`Automatisch (je Gerät)`,map_provider_google:`Immer Google Maps`,map_provider_apple:`Immer Apple Maps`,tile_shape_square:`Abgerundetes Quadrat`,tile_shape_circle:`Kreis`,recorder_hint_intro:`Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen diesen Block in configuration.yaml ergänzen und neu starten:`,recorder_hint_docs:`Recorder-Dokumentation lesen`,copy:`Kopieren`,copied:`Kopiert`,section_tab_labels:`Tab-Bezeichnungen`,tab_labels_hint:`Leer lassen, um die Standard-Bezeichnung zu verwenden`,section_cars:`Fahrzeuge`,cars_both_off_hint:`Keine Zeile aktiv. Um Fahrzeuge ganz auszublenden, „Fahrzeuge anzeigen“ ausschalten.`,car_fuel_type:`Kraftstoffart`,car_delete:`Fahrzeug entfernen`,add_car:`Fahrzeug hinzufügen`,copy_recorder_snippet:`Recorder-Ausschnitt kopieren`,consumption_range_error:`Bitte einen Wert zwischen 0 und 30 l/100 km eingeben`,section_stations:`Tankstellen`,section_header:`Kopfzeile`,section_chart:`Preisverlauf`,section_footer:`Logo & Quellenangabe`,stations_count:`Anzahl Tankstellen`,stations_index:`Platzierung anzeigen`,stations_brand:`Marke anzeigen`,stations_tile_shape:`Form der Kachel`,stations_map_links:`Navigations-Links anzeigen`,stations_map_provider:`Navigations-App`,stations_distance:`Luftlinie anzeigen`,stations_sort:`Reihenfolge`,sort_price:`Günstigste zuerst`,sort_distance:`Nächste zuerst`,stations_opening_hours:`Öffnungszeiten anzeigen`,stations_payment_methods:`Zahlungsarten anzeigen`,stations_payment_mode:`Tankstellen ohne Treffer`,payment_mode_filter:`Ausblenden`,payment_mode_highlight:`Anzeigen, Treffer hervorheben`,header_show:`Kopfzeile anzeigen`,header_price:`Günstigsten und Durchschnittspreis anzeigen`,chart_show:`Preisverlauf anzeigen`,chart_median_line:`7-Tage-Median einblenden`,chart_hour_envelope:`Typischer Stundenverlauf (4 Wo)`,chart_noon_markers:`12:00-Markierung (Preisreset)`,chart_min_max:`Min/Max anzeigen`,chart_best_refuel:`Tank-Tipp anzeigen`,cars_show:`Fahrzeuge anzeigen`,cars_fill_up:`Tankkosten anzeigen`,cars_consumption:`Verbrauch anzeigen`,footer_adaptive_logo:`E-Control-Logo an Theme-Farbe anpassen`,footer_show:`Quellenangabe anzeigen`,stations_payment_filter:`Nur Tankstellen mit`,stations_payment_filter_helper:`Aus der Liste wählen oder eintippen; der Name muss dem von E-Control entsprechen, z. B. Routex, UTA, DKV.`,summary_hidden:`Ausgeblendet`,summary_stations:`Bis zu {count} Tankstellen`,summary_stations_one:`1 Tankstelle`,summary_filter:`Nur {methods}`,summary_brand:`Marke`,summary_header_price:`Mit Preisen`,summary_header_title:`Nur Titel`,summary_chart_best_refuel:`Tank-Tipp`,summary_chart_min_max:`Min/Max`,summary_chart_median_line:`Median`,summary_chart_hour_envelope:`Stundenverlauf`,summary_chart_noon_markers:`12:00-Markierung`,summary_chart_plain:`Nur Verlauf`,summary_cars:`{count} Fahrzeuge`,summary_cars_one:`1 Fahrzeug`,summary_cars_none:`Noch keine Fahrzeuge`,summary_shown:`Eingeblendet`,summary_adaptive_logo:`Logo passt sich an`,car_name:`Name`,car_name_helper:`z. B. Golf TDI`,car_tank_size:`Tankgröße`,car_consumption:`Durchschnittsverbrauch`,car_icon:`Symbol`,car_unnamed:`Fahrzeug {n}`,car_move_up:`Nach oben`,car_move_down:`Nach unten`,stations_brand_helper:`Ersetzt die Platzierung`},Ut={common:Rt,card:zt,fuel_types:Bt,weekdays:Vt,editor:Ht},Wt=At,H=Lt,Gt={en:Wt,de:H};function U(e,t){return e.split(`.`).reduce((e,t)=>{if(e&&typeof e==`object`&&t in e)return e[t]},t)}function Kt(e,t){let n=U(e,t);return typeof n==`string`?n:void 0}function qt(e){return(e.configLanguage||e.hassLanguage||`de`).replace(`-`,`_`)}function Jt(e,t,n){let r=Kt(e,Gt[qt(t)]??H);if(r===void 0&&(r=Kt(e,H)),r===void 0&&(r=e),n)for(let[e,t]of Object.entries(n))r=r.replace(`{${e}}`,t);return r}function Yt(e){let t=U(`weekdays`,Gt[qt(e)]??H);if(Array.isArray(t)&&t.every(e=>typeof e==`string`))return t;let n=U(`weekdays`,H);return Array.isArray(n)?n:[]}function W(e,t){let n=(U(`fuel_types`,Gt[qt(t)]??H)??U(`fuel_types`,H))?.[e];return typeof n==`string`?n:e}var Xt=/* @__PURE__ */ new Map,Zt=/* @__PURE__ */ new Map;function Qt(e){if(typeof e.lu==`number`)return Math.round(e.lu*1e3);let t=e.lu??e.last_updated??e.last_changed;return t?new Date(t).getTime():0}function $t(e,t){let n=e[0]?.time??1/0;return[...t.filter(e=>e.time<n),...e]}function en(e){return(e??[]).map(e=>({time:typeof e.start==`number`?e.start:e.start?new Date(e.start).getTime():0,value:typeof e.mean==`number`?e.mean:NaN})).filter(e=>Number.isFinite(e.value)&&e.time>0)}async function tn(e,t,n,r){try{return en((await e.callWS({type:`recorder/statistics_during_period`,start_time:n.toISOString(),end_time:r.toISOString(),statistic_ids:[t],period:`hour`,types:[`mean`]}))?.[t])}catch(e){return console.warn(`[Tankstellen Austria] statistics fetch failed for`,t,e),[]}}async function nn(e,t,n={}){if(!e?.callWS)return[];let r=Zt.get(t);if(r)return r;let i=e.states?.[t]?.attributes?.state_class===`measurement`,a=n.days??(i?84:28),o=/* @__PURE__ */ new Date,s=/* @__PURE__ */ new Date(o.getTime()-a*24*60*60*1e3),c=(async()=>{try{let n=((await e.callWS({type:`history/history_during_period`,start_time:s.toISOString(),end_time:o.toISOString(),entity_ids:[t],minimal_response:!0,significant_changes_only:!0}))?.[t]??[]).map(e=>({time:Qt(e),value:parseFloat(String(e.s??e.state??``))})).filter(e=>Number.isFinite(e.value)&&e.time>0),r=i?$t(n,await tn(e,t,s,o)):n;return Xt.set(t,r),r}catch(e){return console.warn(`[Tankstellen Austria] history fetch failed for`,t,`— sparkline and best-refuel will be empty:`,e),Xt.get(t)??[]}finally{Zt.delete(t)}})();return Zt.set(t,c),c}function rn(e){return Xt.get(e)??[]}function an(e,t){let n=Xt.get(e);if(!n?.length)return!1;let r=n[n.length-1];return!(t.time>r.time)||t.value===r.value?!1:(Xt.set(e,[...n,t]),!0)}function on(e){let t=e.length;if(t===0)return``;if(t===1)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;if(t===2)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)} L ${e[1].x.toFixed(2)} ${e[1].y.toFixed(2)}`;let n=Array.from({length:t-1});for(let r=0;r<t-1;r++){let t=e[r+1].x-e[r].x;n[r]=t===0?0:(e[r+1].y-e[r].y)/t}let r=Array.from({length:t});r[0]=n[0],r[t-1]=n[t-2];for(let e=1;e<t-1;e++)r[e]=(n[e-1]+n[e])/2;for(let e=0;e<t-1;e++){if(n[e]===0){r[e]=0,r[e+1]=0;continue}let t=r[e]/n[e],i=r[e+1]/n[e],a=t*t+i*i;if(a>9){let o=3/Math.sqrt(a);r[e]=o*t*n[e],r[e+1]=o*i*n[e]}}let i=`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;for(let n=0;n<t-1;n++){let t=e[n+1].x-e[n].x,a=e[n].x+t/3,o=e[n].y+r[n]*t/3,s=e[n+1].x-t/3,c=e[n+1].y-r[n+1]*t/3;i+=` C ${a.toFixed(2)} ${o.toFixed(2)}, ${s.toFixed(2)} ${c.toFixed(2)}, ${e[n+1].x.toFixed(2)} ${e[n+1].y.toFixed(2)}`}return i}function sn(e,t){return!e||!t||e.length<2||e.length!==t.length?``:`${on(e)} ${on([...t].reverse()).replace(/^M\s+([-\d.]+)\s+([-\d.]+)/,(e,t,n)=>`L ${t} ${n}`)} Z`}function G(e,t,n){return Math.max(t,Math.min(n,e))}function K(e,t){let n=e.filter(e=>Number.isFinite(e.value)&&e.weight>0);if(n.length===0)return NaN;if(n.length===1)return n[0].value;let r=[...n];r.sort((e,t)=>e.value-t.value);let i=r.reduce((e,t)=>e+t.weight,0),a=G(t,0,1)*i,o=0;for(let e of r)if(o+=e.weight,o>=a)return e.value;return r[r.length-1].value}var q=36e5,cn=864e5;function ln(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||`UTC`}catch{return`UTC`}}function un(e){let t=e?.config?.time_zone;return!t||e?.locale?.time_zone===`local`?ln():t}function dn(e,t){let n=e?.time_format;if(n===`12`)return!0;if(n===`24`)return!1;try{return new Intl.DateTimeFormat(n===`system`?void 0:t,{hour:`numeric`}).resolvedOptions().hour12??!1}catch{return!1}}var fn={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};function pn(e){let t={hourCycle:`h23`,year:`numeric`,month:`numeric`,day:`numeric`,hour:`numeric`,minute:`numeric`,second:`numeric`,weekday:`short`};try{return new Intl.DateTimeFormat(`en-US`,{...t,timeZone:e})}catch{return new Intl.DateTimeFormat(`en-US`,t)}}var mn=class{constructor(e){this.timeZone=e,this._dayStarts=/* @__PURE__ */ new Map,this._fmt=pn(e)}parts(e){let t={year:0,month:0,day:0,hour:0,minute:0,second:0,weekday:0};for(let n of this._fmt.formatToParts(e))switch(n.type){case`year`:t.year=Number(n.value);break;case`month`:t.month=Number(n.value);break;case`day`:t.day=Number(n.value);break;case`hour`:t.hour=Number(n.value)%24;break;case`minute`:t.minute=Number(n.value);break;case`second`:t.second=Number(n.value);break;case`weekday`:t.weekday=fn[n.value]??0}return t}_offset(e){let t=this.parts(e);return Date.UTC(t.year,t.month-1,t.day,t.hour,t.minute,t.second)-(e-e%1e3)}startOfDay(e){let t=this.parts(e),n=t.year*1e4+t.month*100+t.day,r=this._dayStarts.get(n);if(r!==void 0)return r;let i=Date.UTC(t.year,t.month-1,t.day),a=i-this._offset(e),o=this._offset(a);return i-o!==a&&(a=i-o),this._dayStarts.set(n,a),a}shiftDays(e,t){return this.startOfDay(this.startOfDay(e)-t*cn+12*q)}atHour(e,t){let n=this.startOfDay(e)+t*q,r=this.parts(n).hour;return r!==t&&(n+=(t-r)*q),n}mondayKey(e){let t=this.parts(e).weekday,n=t===0?6:t-1;return n?this.shiftDays(e,n):this.startOfDay(e)}},hn=/* @__PURE__ */ new Map;function gn(e){let t=e??ln(),n=hn.get(t);return n||(n=new mn(t),hn.set(t,n)),n}var _n=7*cn,vn=e=>e.toFixed(2);function yn(e,t){let n=t-_n,r=e.filter(e=>e.time>=n&&e.time<=t),i=null;for(let t of e)if(t.time<n)i=t;else break;return i?[i,...r]:r}function bn(e,t=Date.now()){return!e||e.length<2?!1:yn(e,t).length>=2}function xn(e){let t=[...e];t.sort((e,t)=>e-t);let n=(t.length-1)/2;return(t[Math.floor(n)]+t[Math.ceil(n)])/2}function Sn(e,t){let n=(e-t)*100,r=Math.abs(n).toFixed(1);return n<=-.05?{key:`median_delta_below`,cents:r,cls:`median-delta-good`}:n>=.05?{key:`median_delta_above`,cents:r,cls:`median-delta-bad`}:{key:`median_delta_equal`,cents:r,cls:`median-delta-neutral`}}function Cn(e){let t=e[0];if(!t)return``;let n=`M ${vn(t.x)} ${vn(t.y)}`;for(let t=1;t<e.length;t++){let r=e[t];n+=` H ${vn(r.x)}`,r.y!==e[t-1].y&&(n+=` V ${vn(r.y)}`)}return n}function wn(e,t,n,r){let i=r.parts(n).hour<e?r.shiftDays(n,1):n,a=r.atHour(i,e);return{startMs:a,endMs:a+(((t??(e+1)%24)-e+24)%24||1)*q}}function Tn(e,t,n){if(!e?.hasEnoughData||e.hour==null)return[];let r=gn(n),i=[wn(e.hour,e.hour_end,t,r)];return e.alt_hour!=null&&i.push(wn(e.alt_hour,e.alt_hour_end,t,r)),i}function En(e){let t=e.now??Date.now(),n=yn(e.points??[],t);if(n.length<2)return null;let r=t-_n,i=t,a=e=>(e-r)/_n*280,o=e=>Math.max(0,Math.min(280,e)),s=n.map(e=>e.value),c=Math.min(...s),l=Math.max(...s),u=xn(s),d=c,f=l,p=e.showHourEnvelope?e.hourEnvelope??null:null;if(p)for(let e=0;e<24;e++){let t=p.minByHour[e],n=p.maxByHour[e];t!=null&&n!=null&&(d=Math.min(d,t),f=Math.max(f,n))}let ee=f-d||.01,m=e=>44-(e-d)/ee*40,h=n.map(e=>({time:e.time,value:e.value,x:+o(a(e.time)).toFixed(1),y:+m(e.value).toFixed(1)})),g=h.map(e=>({x:e.x,y:e.y})),_=g[g.length-1];_.x<280&&g.push({x:280,y:_.y});let v=Cn(g),y=`${v} V ${vn(48)} H 0 Z`,b=null;if(p){let t=gn(e.timeZone),n=[],o=[],s=e=>{let r=t.parts(e).hour,i=p.maxByHour[r],s=p.minByHour[r];if(i==null||s==null)return;let c=a(e);n.push({x:c,y:m(i)}),o.push({x:c,y:m(s)})};s(r);for(let e=Math.ceil(r/q)*q;e<i;e+=q)s(e);s(i),n.length>=2&&(b=sn(n,o)||null)}let x=[];if(e.showNoonMarkers){let t=gn(e.timeZone);for(let e=t.startOfDay(r);e<=i;e=t.shiftDays(e,-1)){let n=t.atHour(e,12);n>r&&n<i&&x.push(+a(n).toFixed(1))}}let S=[];for(let n of Tn(e.analysis,t,e.timeZone)){let e=o(a(n.startMs)),t=o(a(n.endMs));t>e&&S.push({x1:+e.toFixed(1),x2:+t.toFixed(1)})}return{width:280,height:48,linePath:v,areaPath:y,envelopePath:b,noonXs:x,medianY:e.showMedianLine?+m(u).toFixed(1):null,bands:S,hoverPoints:h,min:c,max:l,median:u,medianDelta:e.showMedianLine?Sn(s[s.length-1],u):null}}function Dn(e,t){let n=e.hoverPoints;if(!n.length)return null;let r=0,i=n.length-1;for(;r<i;){let e=r+i+1>>1;n[e].x<=t?r=e:i=e-1}return n[r]}function J(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var On=0,kn=/* @__PURE__ */ new Map;function An(e,t,n){let r=`${e}|${t}|${n?12:24}`,i=kn.get(r);if(!i){let a={weekday:`short`,day:`numeric`,month:`numeric`,hour:`2-digit`,minute:`2-digit`,hourCycle:n?`h12`:`h23`};try{i=new Intl.DateTimeFormat(e,{...a,timeZone:t})}catch{i=new Intl.DateTimeFormat(void 0,a)}kn.set(r,i)}return i}var Y=class extends P{constructor(...e){super(...e),this.points=[],this.envelope=null,this.analysis=null,this.showMedianLine=!1,this.showHourEnvelope=!1,this.showNoonMarkers=!1,this.showMinMax=!0,this.timeZone=`UTC`,this.language=`de`,this.hour12=!1,this.translations=null,this._hover=null,this._model=null,this._gradId=`spark-grad-${++On}`,this._onPointerMove=e=>{let t=this._model;if(!t)return;let n=e.currentTarget.getBoundingClientRect();if(n.width===0)return;let r=Dn(t,Math.max(0,Math.min(1,(e.clientX-n.left)/n.width))*t.width);r!==this._hover&&(this._hover=r)},this._onPointerLeave=()=>{this._hover=null}}willUpdate(e){let t=!1;for(let n of e.keys())n!==`_hover`&&(t=!0);t&&(this._model=En({points:this.points,showMedianLine:this.showMedianLine,showHourEnvelope:this.showHourEnvelope,showNoonMarkers:this.showNoonMarkers,hourEnvelope:this.envelope,analysis:this.analysis,timeZone:this.timeZone}),this._hover&&=this._model?Dn(this._model,this._hover.x):null)}updated(e){if(!e.has(`_hover`)||!this._hover)return;let t=this.renderRoot.querySelector(`.sparkline-tooltip`),n=this.renderRoot.querySelector(`.sparkline-svg-wrap`);if(!t||!n||!this._model)return;let r=n.clientWidth,i=this._hover.x/this._model.width*r-t.offsetWidth/2;t.style.left=`${Math.max(0,Math.min(r-t.offsetWidth,i))}px`}_t(e){return this.translations?.[e]??e}render(){let e=this._model;if(!e)return j;let{width:t,height:n}=e,r=this._t(this.showMedianLine?`sparkline_aria_summary`:`sparkline_aria_simple`).replace(`{min}`,V(e.min)).replace(`{max}`,V(e.max)).replace(`{median}`,V(e.median)),i=this._hover,a=i?An(this.language,this.timeZone,this.hour12).format(i.time):``,o=e.medianDelta,s=o?this._t(o.key).replace(`{c}`,o.cents):``,c=this.analysis,l=e=>String(e).padStart(2,`0`),u=e.bands.length&&c?.hour!=null?this._t(`window_label`).replace(`{h1}`,l(c.hour)).replace(`{h2}`,l(c.hour_end??(c.hour+1)%24)):``;return O`
      <div
        class="sparkline-svg-wrap"
        @pointermove=${this._onPointerMove}
        @pointerleave=${this._onPointerLeave}
        @pointercancel=${this._onPointerLeave}
      >
        <svg
          class="sparkline"
          viewBox="0 0 ${t} ${n}"
          preserveAspectRatio="none"
          role="img"
          aria-label=${s?`${r}. ${s}`:r}
        >
          <title>${r}</title>
          <defs>
            <linearGradient id=${this._gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.3" />
              <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.02" />
            </linearGradient>
          </defs>
          ${e.noonXs.map(e=>k`<line x1=${e} y1="0" x2=${e} y2=${n}
                stroke="var(--secondary-text-color)" stroke-width="0.5"
                stroke-dasharray="2,3" opacity="0.55"
                vector-effect="non-scaling-stroke"/>`)}
          ${e.envelopePath?k`<path d=${e.envelopePath} fill="var(--primary-color)" fill-opacity="0.08" stroke="none"/>`:j}
          <path d=${e.areaPath} fill="url(#${this._gradId})" />
          ${e.bands.map(e=>k`<rect x=${e.x1} y="0" width=${+(e.x2-e.x1).toFixed(1)}
                  height=${n} fill="var(--success-color)" fill-opacity="0.10" stroke="none"/>`)}
          ${e.medianY==null?j:k`<line x1="0" y1=${e.medianY} x2=${t} y2=${e.medianY}
                  stroke="var(--secondary-text-color)" stroke-width="0.5"
                  stroke-dasharray="4,3" opacity="0.55"
                  vector-effect="non-scaling-stroke"/>`}
          <path
            d=${e.linePath}
            fill="none"
            stroke="var(--primary-color)"
            stroke-width="1.5"
            stroke-linejoin="round"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
          ${i?k`<line x1=${i.x} y1="0" x2=${i.x} y2=${n}
                  stroke="var(--primary-text-color)" stroke-width="0.6"
                  stroke-dasharray="2,2" opacity="0.5" pointer-events="none"
                  vector-effect="non-scaling-stroke"/>`:j}
        </svg>
        ${i?O`<div
                class="sparkline-hover-dot"
                style=${Ue({left:`${i.x/t*100}%`,top:`${i.y/n*100}%`})}
                aria-hidden="true"
              ></div>`:j}
      </div>
      <div class="sparkline-tooltip" ?hidden=${!i} aria-hidden="true">
        <span class="sparkline-tooltip-time">${a}</span>
        <span class="sparkline-tooltip-price">${i?Tt(i.value):``}</span>
      </div>
      ${this.showMinMax?O`<span class="lab max" aria-hidden="true">${V(e.max)}</span>
              <span class="lab min" aria-hidden="true">${V(e.min)}</span>`:j}
      ${u?O`<span class="lab win" aria-hidden="true">${u}</span>`:j}
    `}static{this.styles=c`
    :host {
      display: block;
      position: relative;
    }
    /* Tight wrap around the SVG, so the hover dot's percentage position
       resolves against the SVG's rendered box and not the labels below. */
    .sparkline-svg-wrap {
      position: relative;
      width: 100%;
    }
    .sparkline {
      width: 100%;
      /* The card's one responsive dial: taller with the card, like HA's
         sensor-card graph, never above 88 px. */
      height: var(--ts-sparkline-height, clamp(56px, 10cqi + 24px, 88px));
      display: block;
    }
    /* Min and max at the left edge, the best window at the right, drawn
       over the chart so the labels row under it is gone. */
    .lab {
      position: absolute;
      left: var(--tankst-pad, 16px);
      font-size: var(--ha-font-size-xs, 0.714rem);
      line-height: 1;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
      padding: 1px 4px;
      border-radius: 3px;
      background: color-mix(in srgb, var(--card-background-color) 80%, transparent);
      pointer-events: none;
    }
    .lab.max {
      top: 4px;
    }
    .lab.min {
      bottom: 4px;
    }
    .lab.win {
      left: auto;
      right: var(--tankst-pad, 16px);
      bottom: 4px;
      color: var(--success-color, #4caf50);
      font-weight: var(--ha-font-weight-medium, 500);
    }
    .sparkline-hover-dot {
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      border: 1.5px solid var(--card-background-color);
      background: var(--primary-color);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 1;
      /* The dot follows the pointer, so it wants the shortest real
         duration HA ships: instant, not fast. */
      transition:
        left var(--ha-animation-duration-instant, 75ms) linear,
        top var(--ha-animation-duration-instant, 75ms) linear;
    }
    .sparkline-tooltip {
      position: absolute;
      top: -28px;
      display: flex;
      gap: 6px;
      padding: 3px 7px;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-sm, 4px);
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
    @media (prefers-reduced-motion: reduce) {
      .sparkline-hover-dot {
        transition: none;
      }
    }
  `}};J([F({attribute:!1})],Y.prototype,`points`,void 0),J([F({attribute:!1})],Y.prototype,`envelope`,void 0),J([F({attribute:!1})],Y.prototype,`analysis`,void 0),J([F({attribute:!1})],Y.prototype,`showMedianLine`,void 0),J([F({attribute:!1})],Y.prototype,`showHourEnvelope`,void 0),J([F({attribute:!1})],Y.prototype,`showNoonMarkers`,void 0),J([F({attribute:!1})],Y.prototype,`showMinMax`,void 0),J([F({attribute:!1})],Y.prototype,`timeZone`,void 0),J([F({attribute:!1})],Y.prototype,`language`,void 0),J([F({attribute:!1})],Y.prototype,`hour12`,void 0),J([F({attribute:!1})],Y.prototype,`translations`,void 0),J([I()],Y.prototype,`_hover`,void 0),Y=J([Fe(`tankstellen-austria-sparkline`)],Y);var jn=36e5,X=864e5,Mn=14*X,Nn=28*X,Pn=.001,Fn=3*X,In=3,Ln=1.5,Rn=.5,zn=20*jn,Bn=.005,Vn=200,Hn=.05,Un=24301;function Wn(e,t,n){let r=[],i=(e,t,i)=>{if(i<=t||!Number.isFinite(e))return;let a=t;for(;a<i;){let t=Math.floor(a/jn)*jn+jn,o=Math.min(i,t),s=n.parts(a);r.push({price:e,t:a,hour:s.hour,weekday:s.weekday,dayKey:n.startOfDay(a),weekKey:n.mondayKey(a),durationMs:o-a}),a=o}};for(let t=0;t<e.length-1;t++)i(e[t].value,e[t].time,e[t+1].time);let a=e[e.length-1];return i(a.value,a.time,t),r}function Gn(e,t){let n=/* @__PURE__ */ new Map;for(let r of e){let e=t(r),i=n.get(e);i?i.push(r):n.set(e,[r])}return n}function*Kn(e){for(let t of Gn(e,e=>e.weekKey).values()){let e=0;for(let n of t)e+=n.durationMs;if(e<Fn)continue;let n=t.map(e=>({value:e.price,weight:e.durationMs}));yield{weekChunks:t,totalMs:e,p05:K(n,.05),p95:K(n,.95)}}}function qn(e){let t=e.map(e=>e.length>=In?K(e,.5):NaN),n=-1,r=1/0;return t.forEach((e,t)=>{!Number.isNaN(e)&&e<r&&(r=e,n=t)}),{medians:t,bestIdx:n,minVal:r}}function Jn(e){let t=[...e];return t.sort((e,t)=>e-t),t[Math.floor((t.length-1)/2)]}function Yn(e){let t=e.medians.filter(e=>!Number.isNaN(e));return t.length<2||e.bestIdx<0?null:(Jn(t)-e.minVal)*100}function Xn(e,t){let n=e.filter((e,n)=>!t[n]&&!Number.isNaN(e)),r=e.filter((e,n)=>t[n]&&!Number.isNaN(e));return n.length===0||r.length===0?null:(Jn(n)-Jn(r))*100}function Zn(e,t){let n=0,r=0;for(let i of Gn(e,e=>e.dayKey).values()){let e=0;for(let t of i)e+=t.durationMs;if(e<zn)continue;let a=K(i.map(e=>({value:e.price,weight:e.durationMs})),.5);for(let e of i)t[e.hour]&&(r+=e.durationMs,e.price<=a&&(n+=e.durationMs))}return r>0?n/r:null}function Qn(e,t){let n=[],r=0,i=0,a=0;for(let t of Gn(e,e=>e.dayKey).values()){let e=0;for(let n of t)e+=n.durationMs;if(e<zn)continue;let o=1/0,s=-1/0;for(let e of t)o=Math.min(o,e.price),s=Math.max(s,e.price);n.push(s-o);let c,l;for(let e of t)e.hour===11&&(!c||e.t>c.t)&&(c=e),e.hour===13&&(!l||e.t<l.t)&&(l=e);if(!c||!l)continue;r++;let u=l.price-c.price;u>Pn&&(i++,a+=u)}let o=0,s=0,c=0;for(let n of e)c+=n.durationMs,n.price>t?o+=n.durationMs:n.price<t&&(s+=n.durationMs);return{daily_range_cents:n.length?Math.round(Jn(n)*1e3)/10:0,noon_days:r,noon_rise_days:i,noon_rise_cents:i?Math.round(a/i*1e3)/10:0,cheaper_than_pct:c?Math.round(o/c*100):0,dearer_than_pct:c?Math.round(s/c*100):0}}function $n(e){let t=e|0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function er(e){let t=Array.from({length:7},()=>[]);for(let n of e)t[n.weekday].push(n);let n=qn(t),r=Yn(n);if(r===null||r<Bn*100)return null;let i=tr(e),a=[...i.keys()];a.sort((e,t)=>e-t);let o=a.map(e=>i.get(e).weekday),s=$n(Un),c=0;for(let e=0;e<Vn;e++){for(let e=o.length-1;e>0;e--){let t=Math.floor(s()*(e+1)),n=o[e];o[e]=o[t],o[t]=n}let e=Array.from({length:7},()=>[]);a.forEach((t,n)=>{e[o[n]].push(...i.get(t).entries)});let t=Yn(qn(e));t!==null&&t>=r&&c++}return(c+1)/201<=Hn?n.bestIdx:null}function tr(e){let t=/* @__PURE__ */ new Map;for(let n of e){let e=t.get(n.dayKey);e?e.entries.push(n):t.set(n.dayKey,{weekday:n.weekday,entries:[n]})}return t}var nr=.005;function rr(e,t,n){let r=e=>e!==void 0&&!Number.isNaN(e)&&e-n<=nr,i=0;for(let n=1;n<=23&&r(e[(t+n)%24]);n++)i=n;let a=0;for(let n=1;n<=23&&r(e[(t-n+24)%24]);n++)a=n;return i+a+1>=24?null:{start:(t-a+24)%24,end:(t+i+1)%24}}function ir(e,t){return(t-e+24)%24||24}function ar(e,t){let n=ir(e,t);return Array.from({length:24},(t,r)=>(r-e+24)%24<n)}function or(e,t,n){let r=-1,i=1/0;return e.forEach((e,a)=>{t[a]||Number.isNaN(e)||e-n>nr||e<i&&(i=e,r=a)}),r<0?null:rr(e,r,n)}function sr(e,t){if(!e||e.length<2)return null;let n=Date.now(),r=Math.min(n-e[0].time,Nn);if(r<7*X)return{hasEnoughData:!1};let i=Wn(e,n,gn(t)),a=i.filter(e=>e.t>=n-Nn);if(a.length===0)return{hasEnoughData:!1};let o=Qn(a,e[e.length-1].value),s=Array.from({length:24},()=>[]),c=[];for(let{weekChunks:e,totalMs:t,p05:r,p95:a}of Kn(i)){let i=0;for(let t of e)i+=G(t.price,r,a)*t.durationMs;let o=i/t;for(let t of e){let e=G(t.price,r,a),i=.5**((n-t.t)/Mn),l=e-o,u=t.durationMs*i;t.t>=n-Nn&&s[t.hour].push({value:l,weight:u}),c.push({value:l,weight:u,weekday:t.weekday,dayKey:t.dayKey})}}let l=qn(s);if(l.bestIdx<0)return{hasEnoughData:!1};let u=rr(l.medians,l.bestIdx,l.minVal);if(!u)return{hasEnoughData:!0,hour:null,hour_end:null,alt_hour:null,alt_hour_end:null,weekday:null,confidence:null,facts:o};let d=ar(u.start,u.end),f=or(l.medians,d,l.minVal),p=f?d.map((e,t)=>e||ar(f.start,f.end)[t]):d,ee=r/X,m=Math.min(1,ee/28),h=Xn(l.medians,d)||0,g=G(h/Ln,0,1),_=Zn(a,p),v=_===null?0:G((_-Rn)/.4,0,1),y=(m+g)/2*v,b=y>=.75?`high`:y>=.5?`medium`:`low`;return f&&b===`high`&&(b=`medium`),{hasEnoughData:!0,hour:u.start,hour_end:u.end,alt_hour:f?f.start:null,alt_hour_end:f?f.end:null,weekday:er(c),confidence:{level:b,score:y,span_days:Math.round(ee),gap_cents:Math.round(h*10)/10,consistency_pct:Math.round((_||0)*100)},facts:o}}function cr(e,t){if(!e||e.length<2)return null;let n=Date.now();if(n-e[0].time<7*X)return null;let r=Wn(e,n,gn(t)).filter(e=>e.t>=n-Nn);if(r.length===0)return null;let i=Array.from({length:24},()=>[]);for(let{weekChunks:e,p05:t,p95:n}of Kn(r))for(let r of e)i[r.hour].push({value:G(r.price,t,n),weight:r.durationMs});let a=Array.from({length:24},()=>null),o=Array.from({length:24},()=>null),s=0;for(let e=0;e<24;e++){let t=i[e];t.length<In||(a[e]=K(t,.1),o[e]=K(t,.9),s++)}return s<6?null:{minByHour:a,maxByHour:o}}var lr=c`
  :host {
    display: block;

    /* Brand accent and the three state colours, layered over HA's flat
       semantic palette so a theme recolours the whole portfolio at once. */
    --tankst-accent:  var(--primary-color);
    --tankst-good:    var(--success-color, #4caf50);
    --tankst-warning: var(--warning-color, #ffa000);
    --tankst-error:   var(--error-color,   #db4437);

    /* One horizontal padding and one tile size; everything else is HA's.
       Verified against core.globals.ts: --ha-space-N is a 4 px grid,
       --ha-border-radius-{sm,md} are 4 / 8 px, --ha-animation-duration-fast
       is 150 ms. A var() on a token HA does not define silently takes the
       fallback, so check the file before adopting a new name. */
    --tankst-pad:  var(--ha-space-4, 16px);
    --tankst-tile: 40px;
    /* The rail: where every text block starts. Tile plus its gap. */
    --tankst-rail: calc(var(--tankst-pad) + var(--tankst-tile) + var(--ha-space-3, 12px));
  }
  ha-card {
    /* Clips content to the card; in a grid cell the gated rule below puts
       that edge at the cell's height. */
    overflow: hidden;
    /* The card responds to its own width, not the viewport. */
    container-type: inline-size;
    container-name: tscard;
    /* A column, so that in a fixed-height cell the tabs and footer keep
       their size and .body between them scrolls. */
    display: flex;
    flex-direction: column;
  }
  /* Fill the grid cell the dashboard hands us. A sections view puts a fixed
     pixel height on the cell wrapper when rows is numeric (a user's drag
     stores grid_options that override getGridOptions()) and styles nothing
     inside it. :host is display: block, so it is ha-card's containing
     block, and the two declarations only work as a pair. Gated on the
     layout HA sets ("grid" in a sections view and its edit dialog, "panel"
     in a panel view): the add-card picker sets none and centres each
     preview in a tile as tall as the tallest in its row, which an ungated
     100% would stretch the card down to. */
  :host([layout="grid"]),
  :host([layout="panel"]) {
    block-size: 100%;
  }
  :host([layout="grid"]) ha-card,
  :host([layout="panel"]) ha-card {
    block-size: 100%;
  }
  /* The one scroller: whatever height the tabs and footer leave. */
  .body {
    flex: 1 1 auto;
    min-block-size: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  ha-alert {
    display: block;
    margin: var(--ha-space-3, 12px) var(--tankst-pad) 0;
  }
  .empty {
    padding: 24px var(--tankst-pad);
    text-align: center;
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-s, 0.857rem);
  }
  .empty-title {
    color: var(--primary-text-color);
    font-weight: var(--ha-font-weight-medium, 500);
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
    font-size: var(--ha-font-size-s, 0.857rem);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .version-reload-btn {
    flex-shrink: 0;
    background: #fff;
    color: var(--tankst-warning);
    border: none;
    border-radius: var(--ha-border-radius-pill, 999px);
    padding: 6px 14px;
    font-weight: 600;
    font-size: var(--ha-font-size-s, 0.857rem);
    cursor: pointer;
    min-height: 32px;
    font-family: inherit;
  }

  /* ── Tabs ───────────────────────────────────────────────────────── */
  .tabs {
    display: flex;
    flex-shrink: 0;
    border-bottom: 1px solid var(--divider-color);
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar {
    display: none;
  }
  /* 48 px like HA's tab bar; colour, weight and underline mark the active
     one, so the state survives any single-channel deficit. */
  .tab {
    flex: 1;
    min-width: 0;
    height: 48px;
    padding: 0 12px;
    border: 0;
    background: none;
    color: var(--secondary-text-color);
    font: inherit;
    font-weight: var(--ha-font-weight-medium, 500);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    box-shadow: inset 0 -2px 0 transparent;
    transition:
      color var(--ha-animation-duration-fast, 150ms) ease,
      box-shadow var(--ha-animation-duration-fast, 150ms) ease;
  }
  .tab:hover {
    color: var(--primary-text-color);
  }
  .tab.active {
    color: var(--tankst-accent);
    font-weight: var(--ha-font-weight-bold, 700);
    box-shadow: inset 0 -2px 0 var(--tankst-accent);
  }

  /* ── Head: tile, fuel name, the big price under the name ────────── */
  .head {
    display: grid;
    grid-template-columns: var(--tankst-tile) 1fr auto;
    grid-template-areas:
      "tile name  act"
      "tile price price";
    column-gap: var(--ha-space-3, 12px);
    align-items: center;
    padding: var(--tankst-pad) var(--tankst-pad) var(--ha-space-2, 8px);
  }
  .head.no-title {
    grid-template-areas: "price price act";
    grid-template-columns: 1fr auto;
  }
  .tile {
    grid-area: tile;
    align-self: start;
    width: var(--tankst-tile);
    height: var(--tankst-tile);
    border-radius: var(--ha-border-radius-md, 8px);
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--tankst-accent) 18%, transparent);
    color: var(--tankst-accent);
    --mdc-icon-size: 22px;
  }
  .title {
    grid-area: name;
    margin: 0;
    min-width: 0;
    font-size: var(--ha-font-size-l, 1.143rem);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: 1.25;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .subtitle {
    display: block;
    font-size: var(--ha-font-size-s, 0.857rem);
    font-weight: var(--ha-font-weight-normal, 400);
    color: var(--secondary-text-color);
  }
  .price-line {
    grid-area: price;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0 8px;
    line-height: 1.1;
    margin-top: 2px;
  }
  .price-big {
    font-size: 32px;
    font-weight: var(--ha-font-weight-bold, 700);
    letter-spacing: -0.5px;
    font-variant-numeric: tabular-nums;
  }
  .price-ctx {
    font-size: var(--ha-font-size-s, 0.857rem);
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }
  .price-ctx b {
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--primary-text-color);
  }
  /* Dynamic mode: refresh button with the last-updated chip under it. */
  .head-actions {
    grid-area: act;
    align-self: start;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  /* ── Chips (dynamic-mode status, payment match) ─────────────────── */
  .chip-row {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 6px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    border-radius: var(--ha-border-radius-pill, 999px);
    font-size: var(--ha-font-size-s, 0.857rem);
    font-weight: 600;
    line-height: 1;
    background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent);
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
    --mdc-icon-size: 14px;
  }
  .chip.warn {
    background: color-mix(in srgb, var(--tankst-warning) 16%, transparent);
    color: var(--tankst-warning);
  }
  .chip.match {
    background: color-mix(in srgb, var(--tankst-good) 16%, transparent);
    color: var(--tankst-good);
  }

  /* ── Filled CTA (dynamic-mode refresh) ──────────────────────────── */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0 14px;
    height: 32px;
    border: none;
    border-radius: var(--ha-border-radius-pill, 999px);
    background: var(--tankst-accent);
    color: var(--text-primary-color, #fff);
    font: inherit;
    font-size: var(--ha-font-size-s, 0.857rem);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    --mdc-icon-size: 16px;
    transition: opacity var(--ha-animation-duration-fast, 150ms) ease;
  }
  .btn-primary.cooling {
    opacity: 0.55;
    cursor: default;
    pointer-events: none;
  }

  /* ── Chart: full-bleed like hui-sensor-card, opens more-info ────── */
  .chart {
    display: block;
    width: 100%;
    padding: 0;
    margin: 0 0 var(--ha-space-1, 4px);
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
  }

  /* ── Facts under the chart: icon column at the pad, text on the rail ─ */
  .facts {
    list-style: none;
    margin: 0;
    padding: var(--ha-space-2, 8px) var(--tankst-pad) var(--ha-space-3, 12px);
    display: grid;
    grid-template-columns: 20px 1fr auto;
    row-gap: 4px;
    column-gap: 8px;
    font-size: var(--ha-font-size-s, 0.857rem);
    color: var(--secondary-text-color);
  }
  .facts li {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    align-items: center;
  }
  .facts ha-icon {
    --mdc-icon-size: 16px;
    justify-self: center;
  }
  .facts .lead {
    color: var(--tankst-good);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .conf {
    font-size: var(--ha-font-size-xs, 0.714rem);
    font-weight: var(--ha-font-weight-bold, 700);
    letter-spacing: 0.3px;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: var(--ha-border-radius-pill, 999px);
    cursor: help;
    white-space: nowrap;
  }
  .conf-high {
    background: color-mix(in srgb, var(--tankst-good) 18%, transparent);
    color: var(--tankst-good);
  }
  .conf-medium {
    background: color-mix(in srgb, var(--tankst-warning) 18%, transparent);
    color: var(--tankst-warning);
  }
  .conf-low {
    background: color-mix(in srgb, var(--secondary-text-color) 15%, transparent);
    color: var(--secondary-text-color);
  }

  /* ── Cars: the same three columns as the facts ──────────────────── */
  .cars {
    list-style: none;
    margin: 0;
    padding: var(--ha-space-2, 8px) var(--tankst-pad) var(--ha-space-3, 12px);
    border-top: 1px solid var(--divider-color);
    display: grid;
    grid-template-columns: 20px 1fr auto;
    row-gap: 6px;
    column-gap: 8px;
  }
  .cars li {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    align-items: baseline;
    min-width: 0;
  }
  .cars ha-icon {
    --mdc-icon-size: 16px;
    color: var(--secondary-text-color);
    justify-self: center;
    align-self: center;
  }
  .cars small {
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-s, 0.857rem);
  }
  .cars .num {
    font-weight: var(--ha-font-weight-bold, 700);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  /* ── Stations: one <li> per station, row button and map link side by
        side, the detail panel under both ───────────────────────────── */
  .stations {
    list-style: none;
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--divider-color);
  }
  .st {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: stretch;
    border-bottom: 1px solid var(--divider-color);
  }
  .st:last-child {
    border-bottom: 0;
  }
  .st.pm-highlight {
    box-shadow: inset 3px 0 0 var(--tankst-good);
    background: color-mix(in srgb, var(--tankst-good) 6%, transparent);
  }
  /* Two lines on four columns: tile, name over address, price over
     distance, chevron. Carries a narrow card without a second layout. */
  .st-row {
    grid-column: 1;
    display: grid;
    grid-template-columns: 28px 1fr auto 20px;
    grid-template-areas:
      "tile name price chev"
      "tile addr dist  chev";
    column-gap: 12px;
    row-gap: 1px;
    align-items: center;
    padding: 10px 0 10px var(--tankst-pad);
    min-height: 56px;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
    transition: background-color var(--ha-animation-duration-fast, 150ms) ease;
  }
  .st-row.no-map {
    padding-inline-end: var(--tankst-pad);
  }
  .st-row:not([aria-expanded]) {
    cursor: default;
  }
  .st-row:hover,
  .st-map:hover {
    background: color-mix(in srgb, var(--tankst-accent) 6%, transparent);
  }
  /* The rank, or the brand's initials on its colour. */
  .st-tile {
    grid-area: tile;
    width: 28px;
    height: 28px;
    border-radius: var(--ha-border-radius-sm, 4px);
    display: grid;
    place-items: center;
    font-size: var(--ha-font-size-s, 0.857rem);
    font-weight: var(--ha-font-weight-bold, 700);
    font-variant-numeric: tabular-nums;
    background: color-mix(in srgb, var(--tankst-accent) 18%, transparent);
    color: var(--tankst-accent);
  }
  .st-tile.circle {
    border-radius: 50%;
  }
  .st-tile.brand {
    font-size: 10px;
    letter-spacing: -0.02em;
  }
  /* A station without a known brand: neutral, so it never passes for one. */
  .st-tile.brand:not(.brand-known) {
    background: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
    color: var(--primary-text-color);
  }
  .st-tile.brand-known {
    background: var(--tankst-tile-bg);
    color: var(--tankst-tile-fg);
  }
  .st-name {
    grid-area: name;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: var(--ha-font-weight-medium, 500);
    white-space: nowrap;
  }
  /* The name gives way, not the flag after it. */
  .st-name > span[lang] {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .st-addr {
    grid-area: addr;
    min-width: 0;
    font-size: var(--ha-font-size-s, 0.857rem);
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .st-price {
    grid-area: price;
    font-size: var(--ha-font-size-l, 1.143rem);
    font-weight: var(--ha-font-weight-bold, 700);
    font-variant-numeric: tabular-nums;
    text-align: end;
    white-space: nowrap;
  }
  .st-dist {
    grid-area: dist;
    font-size: var(--ha-font-size-xs, 0.714rem);
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
    text-align: end;
    white-space: nowrap;
  }
  .chev {
    grid-area: chev;
    --mdc-icon-size: 20px;
    color: var(--secondary-text-color);
    transition: transform var(--ha-animation-duration-fast, 150ms) ease;
  }
  .st-row[aria-expanded="true"] .chev {
    transform: rotate(180deg);
  }
  .st-map {
    grid-column: 2;
    display: grid;
    place-items: center;
    width: 44px;
    color: var(--secondary-text-color);
    text-decoration: none;
    --mdc-icon-size: 20px;
    transition:
      background-color var(--ha-animation-duration-fast, 150ms) ease,
      color var(--ha-animation-duration-fast, 150ms) ease;
  }
  .st-map:hover {
    color: var(--tankst-accent);
  }
  .flag {
    font-size: var(--ha-font-size-xs, 0.714rem);
    font-weight: var(--ha-font-weight-bold, 700);
    padding: 2px 7px;
    border-radius: var(--ha-border-radius-pill, 999px);
    white-space: nowrap;
    flex-shrink: 0;
    background: color-mix(in srgb, var(--tankst-warning) 16%, transparent);
    color: var(--tankst-warning);
  }
  .flag.closed {
    background: color-mix(in srgb, var(--tankst-error) 16%, transparent);
    color: var(--tankst-error);
  }
  /* Detail drawer: 0fr ↔ 1fr animates to intrinsic height, so long content
     is never clipped. Hours and payment sit side by side when there is
     room, aligned to the row's name. */
  .st-detail {
    grid-column: 1 / -1;
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--ha-animation-duration-normal, 250ms) ease;
  }
  .st-detail > div {
    overflow: hidden;
    min-height: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 28px;
    padding: 0 var(--tankst-pad) 0 calc(var(--tankst-pad) + 40px);
    font-size: var(--ha-font-size-s, 0.857rem);
  }
  .st-detail.expanded {
    grid-template-rows: 1fr;
  }
  .st-detail.expanded > div {
    padding-bottom: 12px;
  }
  .hours {
    margin: 0;
    display: grid;
    grid-template-columns: auto auto;
    gap: 1px 12px;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }
  .hours dt {
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--primary-text-color);
  }
  .hours dd {
    margin: 0;
  }
  .pay {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 5px;
  }
  .pay span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: var(--ha-border-radius-pill, 999px);
    background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent);
    --mdc-icon-size: 13px;
  }
  .pay .pm-other {
    font-style: italic;
  }

  /* ── Footer: E-Control logo-link + attribution ──────────────────── */
  .footer {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px var(--tankst-pad);
    border-top: 1px solid var(--divider-color);
  }
  .brand-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
  }
  .brand-logo {
    display: block;
    height: 20px;
    width: auto;
    max-width: 140px;
    object-fit: contain;
  }
  /* Theme-following silhouette when logo_adapt_to_theme is on. */
  .brand-logo.adaptive.adaptive-light {
    filter: brightness(0);
  }
  .brand-logo.adaptive.adaptive-dark {
    filter: brightness(0) invert(1);
  }
  .attribution-text {
    font-size: var(--ha-font-size-xs, 0.714rem);
    color: var(--secondary-text-color);
    letter-spacing: 0.03em;
  }

  /* ── Density: two steps ─────────────────────────────────────────── */
  @container tscard (inline-size < 360px) {
    .price-big {
      font-size: 28px;
    }
    .st-row {
      column-gap: 10px;
    }
    .st-detail > div {
      padding-left: var(--tankst-pad);
    }
    .st-name {
      white-space: normal;
      flex-wrap: wrap;
    }
    .st-name > span[lang] {
      overflow: visible;
    }
    .cars .num {
      grid-column: 2;
    }
  }
  @container tscard (inline-size > 480px) {
    :host {
      --tankst-pad: var(--ha-space-5, 20px);
      --tankst-tile: 44px;
    }
    .price-big {
      font-size: 36px;
    }
    .st-row {
      min-height: 60px;
    }
  }

  /* ── Accessibility ──────────────────────────────────────────────── */
  :is(button, a):focus-visible {
    outline: 2px solid var(--tankst-accent);
    outline-offset: 2px;
    border-radius: 6px;
  }
  /* These sit flush with a clipping edge, so the ring goes inside. */
  .tab:focus-visible,
  .st-row:focus-visible,
  .st-map:focus-visible,
  .chart:focus-visible {
    outline-offset: -2px;
  }
  @media (forced-colors: active) {
    :is(button, a):focus-visible {
      outline-color: CanvasText;
    }
    .tile,
    .st-tile,
    .chip,
    .flag,
    .btn-primary,
    .pay span,
    .conf {
      forced-color-adjust: none;
    }
  }
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
`,ur=c`
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
`;async function dr(e,t,n){if(!e?.callWS)return null;try{let r=await e.callWS({type:t});if(r?.version&&r.version!==n)return r.version}catch{}return null}async function fr(){try{if(typeof window<`u`&&`caches`in window){let e=await caches.keys();await Promise.all(e.map(e=>caches.delete(e)))}}catch{}location.reload()}function pr(e){return e.mismatchVersion?e.stuck?O`
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
    `:O`
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
  `:j}var mr=`https://www.e-control.at/`,hr=`/tankstellen-austria/e-control_logo.svg`;function gr(e){return typeof e==`string`&&/^https?:\/\//i.test(e)?e:``}function _r(e){return typeof e==`string`?e.startsWith(`geo:0,0?q=`)?e:gr(e):``}function vr(e,t){return/iPhone|iPad|iPod/.test(e)||/Macintosh/.test(e)&&t>1?`ios`:/Android/.test(e)?`android`:`desktop`}function yr(e,t){return e===`google`||e===`apple`?e:t===`ios`?`apple`:t===`android`?`geo`:`google`}function br(e,t,n){e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0}))}var xr=[`stations`,`header`,`chart`,`cars`,`footer`],Sr={stations:`mdi:gas-station-outline`,header:`mdi:page-layout-header`,chart:`mdi:chart-line`,cars:`mdi:car-outline`,footer:`mdi:page-layout-footer`},Cr={stations:[`count`,`sort`,`tile_shape`,`map_provider`,`payment_mode`]},wr=[`DIE`,`SUP`,`GAS`],Tr=[`cash`,`debit_card`,`credit_card`],Er={name:``,fuel_type:`DIE`,tank_size:50,icon:`mdi:car`};function Dr(e){return e.replace(/[<>"'&]/g,``).slice(0,50).trim()}var Z=(e,t)=>({name:t,default:ft[e][t],selector:{boolean:{}}});function Or(e){let t={...e};for(let e of xr){let n=t[e];if(!n||typeof n!=`object`||Array.isArray(n))continue;let r=ft[e],i={};for(let[e,t]of Object.entries(n))t!=null&&t!==r[e]&&(Array.isArray(t)&&t.length===0||(i[e]=t));Object.keys(i).length>0?t[e]=i:delete t[e]}return Array.isArray(t.entities)&&t.entities.length===0&&delete t.entities,t}var Q=class extends P{constructor(...e){super(...e),this._config={type:`tankstellen-austria-card`},this._open=/* @__PURE__ */ new Set,this._openCar=null,this._copiedPulse=!1,this._labels=/* @__PURE__ */ new Map,this._helpers=/* @__PURE__ */ new Map,this._onEntitiesChanged=e=>{e.stopPropagation();let t=e.detail.value.entities,n={...this._config};t&&t.length>0?n.entities=t:delete n.entities,this._commit(n)},this._onTabLabelsChanged=e=>{e.stopPropagation();let t={};for(let[n,r]of Object.entries(e.detail.value)){let e=typeof r==`string`?Dr(r):``;e&&(t[n]=e)}let n={...this._config};Object.keys(t).length>0?n.tab_labels=t:delete n.tab_labels,this._commit(n)},this._onAddCar=()=>{let e=[...this._config.cars?.items??[],{...Er}];this._openCar=e.length-1,this._setCars(e)}}setConfig(e){this._config=gt(e)}disconnectedCallback(){super.disconnectedCallback(),this._copiedTimeout!==void 0&&(clearTimeout(this._copiedTimeout),this._copiedTimeout=void 0)}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_et(e,t){return Jt(`editor.${e}`,this._ctx(),t)}_ct(e,t){return Jt(`card.${e}`,this._ctx(),t)}_maybe(e){let t=this._et(e);return t===`editor.${e}`?void 0:t}_commit(e){this._config=Or(e),br(this,`config-changed`,{config:this._config})}_opt(e,t){return this._config[e]?.[t]??ft[e][t]}_labelFor(e){let t=e??``,n=this._labels.get(t);return n||(n=t=>{if(e===null){let e=this.hass?.localize?.(`ui.panel.lovelace.editor.card.generic.${t.name}`);if(e)return e}return this._maybe(e===null?t.name:`${e}_${t.name}`)??t.name},this._labels.set(t,n)),n}_helperFor(e){let t=e??``,n=this._helpers.get(t);return n||(n=t=>this._maybe(`${e===null?``:`${e}_`}${t.name}_helper`),this._helpers.set(t,n)),n}_select(e,t){return{name:e,selector:{select:{mode:`dropdown`,options:t.map(t=>({value:t,label:this._et(`${e}_${t}`)}))}}}}_groupSchema(e){let t=t=>this._opt(e,t)===!0;switch(e){case`stations`:{let e=this._config.stations?.payment_filter??[];return[{name:`count`,selector:{number:{min:0,max:5,step:1,mode:`slider`}}},Z(`stations`,`index`),Z(`stations`,`brand`),...t(`index`)||t(`brand`)?[this._select(`tile_shape`,[`square`,`circle`])]:[],Z(`stations`,`map_links`),this._select(`map_provider`,[`auto`,`google`,`apple`]),Z(`stations`,`distance`),this._select(`sort`,[`price`,`distance`]),Z(`stations`,`opening_hours`),Z(`stations`,`payment_methods`),...t(`payment_methods`)?[this._paymentFilterField()]:[],...t(`payment_methods`)&&e.length>0?[this._select(`payment_mode`,[`filter`,`highlight`])]:[]]}case`header`:return[Z(`header`,`show`),...t(`show`)?[Z(`header`,`price`)]:[]];case`chart`:return[Z(`chart`,`show`),...t(`show`)?[`median_line`,`hour_envelope`,`noon_markers`,`min_max`,`best_refuel`].map(e=>Z(`chart`,e)):[]];case`cars`:return[Z(`cars`,`show`),...t(`show`)?[Z(`cars`,`fill_up`),Z(`cars`,`consumption`)]:[]];case`footer`:return[Z(`footer`,`show`),...t(`show`)?[Z(`footer`,`adaptive_logo`)]:[]]}}_paymentFilterField(){let e=new Set(Tr);for(let t of this._config.entities??[]){let n=this.hass?.states[t]?.attributes?.stations??[];for(let t of n)for(let n of t.payment_methods?.others??[])e.add(n)}for(let t of this._config.stations?.payment_filter??[])e.add(t);let t=e=>Tr.includes(e)?this._ct(e):e;return{name:`payment_filter`,selector:{select:{multiple:!0,custom_value:!0,options:[...e].map(e=>({value:e,label:t(e)}))}}}}_carSchema(){return[{name:`name`,selector:{text:{}}},{name:`fuel_type`,selector:{select:{mode:`dropdown`,options:wr.map(e=>({value:e,label:W(e,this._ctx())}))}}},{name:`tank_size`,selector:{number:{min:1,max:200,step:1,mode:`box`,unit_of_measurement:`l`}}},{name:`consumption`,selector:{number:{min:0,max:30,step:.1,mode:`box`,unit_of_measurement:`l/100 km`}}},{name:`icon`,selector:{icon:{placeholder:`mdi:car`}}}]}_summary(e){let t=this._et(`summary_hidden`),n=[];switch(e){case`stations`:{let e=Number(this._opt(`stations`,`count`));if(e===0)return t;n.push(e===1?this._et(`summary_stations_one`):this._et(`summary_stations`,{count:String(e)})),n.push(this._et(`sort_${String(this._opt(`stations`,`sort`))}`));let r=this._config.stations?.payment_filter??[];r.length>0&&this._opt(`stations`,`payment_methods`)===!0?n.push(this._et(`summary_filter`,{methods:r.join(`, `)})):this._opt(`stations`,`brand`)===!0&&n.push(this._et(`summary_brand`));break}case`header`:if(this._opt(`header`,`show`)!==!0)return t;n.push(this._et(this._opt(`header`,`price`)===!0?`summary_header_price`:`summary_header_title`));break;case`chart`:if(this._opt(`chart`,`show`)!==!0)return t;for(let e of[`best_refuel`,`min_max`,`median_line`,`hour_envelope`,`noon_markers`])this._opt(`chart`,e)===!0&&n.push(this._et(`summary_chart_${e}`));n.length===0&&n.push(this._et(`summary_chart_plain`));break;case`cars`:{if(this._opt(`cars`,`show`)!==!0)return t;let e=this._config.cars?.items?.length??0;n.push(e===0?this._et(`summary_cars_none`):e===1?this._et(`summary_cars_one`):this._et(`summary_cars`,{count:String(e)}));break}case`footer`:if(this._opt(`footer`,`show`)!==!0)return t;n.push(this._et(`summary_shown`)),this._opt(`footer`,`adaptive_logo`)===!0&&n.push(this._et(`summary_adaptive_logo`))}return n.slice(0,3).join(` · `)}render(){let e=(this._config.entities??[]).filter(e=>!!this.hass&&!this.hass.states[e]);return O`
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
        ${e.map(e=>O`
            <ha-alert alert-type="warning">${this._et(`entity_missing`,{entity:e})}</ha-alert>
          `)}
        ${this._renderTabLabels()} ${xr.map(e=>this._renderPanel(e))}
      </div>
    `}_renderPanel(e){return O`
      <ha-expansion-panel
        outlined
        data-group=${e}
        .header=${this._et(`section_${e}`)}
        .secondary=${this._summary(e)}
        @expanded-will-change=${t=>this._setOpen(e,t.detail.expanded)}
      >
        <ha-icon slot="leading-icon" icon=${Sr[e]}></ha-icon>
        ${this._open.has(e)?this._renderBody(e):j}
      </ha-expansion-panel>
    `}_renderBody(e){let t=Object.fromEntries((Cr[e]??[]).map(t=>[t,ft[e][t]])),n=e===`chart`&&this._opt(`chart`,`show`)===!0&&this._opt(`chart`,`best_refuel`)===!0;return O`
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
        ${n?this._renderRecorderHint():j}
        ${e===`cars`&&this._opt(`cars`,`show`)===!0?this._renderCars():j}
      </div>
    `}_renderTabLabels(){if(!this.hass)return j;let e=(this._config.entities??[]).filter(e=>!!this.hass.states[e]);if(e.length<2)return j;let t=new Map(e.map(e=>[e,this._defaultTabLabel(e)]));return O`
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
    `}_defaultTabLabel(e){let t=this.hass.states[e],n=W(B(this.hass,e,t.attributes),this._ctx());if(t.attributes?.dynamic_mode===!0){let e=t.attributes.dynamic_tracker_label;e&&(n+=` · ${e}`)}return n}_renderRecorderHint(){let e=`recorder:
  purge_keep_days: 30`;return O`
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
    `}_renderCars(){let e=this._config.cars?.items??[];return O`
      ${this._opt(`cars`,`fill_up`)!==!0&&this._opt(`cars`,`consumption`)!==!0?O`<div class="editor-hint">${this._et(`cars_both_off_hint`)}</div>`:j}
      ${e.length>0?O`<ul class="car-list">
            ${e.map((t,n)=>this._renderCar(t,n,e.length))}
          </ul>`:j}
      <ha-button appearance="plain" class="car-add" @click=${this._onAddCar}>
        <ha-icon slot="start" icon="mdi:plus" aria-hidden="true"></ha-icon>
        ${this._et(`add_car`)}
      </ha-button>
    `}_renderCar(e,t,n){let r=this._openCar===t,i=`tsa-car-${t}`,a=[W(e.fuel_type,this._ctx()),`${e.tank_size} l`,...e.consumption==null?[]:[`${e.consumption} l/100 km`]].join(` · `),o=e.consumption!=null&&(e.consumption<0||e.consumption>30);return O`
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
        ${r?O`<div class="car-body" id=${i}>
              <ha-form
                data-form="car"
                .hass=${this.hass}
                .data=${e}
                .schema=${this._carSchema()}
                .computeLabel=${this._labelFor(`car`)}
                .computeHelper=${this._helperFor(`car`)}
                @value-changed=${e=>this._onCarChanged(t,e)}
              ></ha-form>
              ${o?O`<ha-alert alert-type="error">${this._et(`consumption_range_error`)}</ha-alert>`:j}
            </div>`:j}
      </li>
    `}_setOpen(e,t){let n=new Set(this._open);t?n.add(e):n.delete(e),this._open=n}_onGroupChanged(e,t){t.stopPropagation();let n={...this._config[e],...t.detail.value};if(e===`stations`){let e=e=>this._opt(`stations`,e)===!0;n.brand===!0&&!e(`brand`)?n.index=!1:n.index===!0&&!e(`index`)&&(n.brand=!1)}if(e===`stations`&&Array.isArray(n.payment_filter)){let e=n.payment_filter.map(e=>Dr(String(e)));n.payment_filter=[...new Set(e.filter(Boolean))]}this._commit({...this._config,[e]:n})}_onCarChanged(e,t){t.stopPropagation();let n=[...this._config.cars?.items??[]],r=n[e];if(!r)return;let i=t.detail.value,a={...r};typeof i.name==`string`&&(a.name=Dr(i.name)),wr.includes(i.fuel_type)&&(a.fuel_type=i.fuel_type),typeof i.tank_size==`number`&&Number.isFinite(i.tank_size)&&(a.tank_size=Math.min(200,Math.max(1,Math.round(i.tank_size)))),typeof i.consumption==`number`&&Number.isFinite(i.consumption)?a.consumption=Math.round(i.consumption*10)/10:delete a.consumption,a.icon=typeof i.icon==`string`&&i.icon.startsWith(`mdi:`)?i.icon:`mdi:car`,n[e]=a,this._setCars(n)}_moveCar(e,t){let n=[...this._config.cars?.items??[]],r=e+t,i=n[e];!i||r<0||r>=n.length||(n.splice(e,1),n.splice(r,0,i),this._openCar===e?this._openCar=r:this._openCar===r&&(this._openCar=e),this._setCars(n))}_deleteCar(e){let t=[...this._config.cars?.items??[]];t.splice(e,1),this._openCar===e?this._openCar=null:this._openCar!=null&&this._openCar>e&&--this._openCar,this._setCars(t)}_setCars(e){this._commit({...this._config,cars:{...this._config.cars,items:e}})}async _onCopyRecorderSnippet(e){try{await navigator.clipboard.writeText(e),this._copiedPulse=!0,this._copiedTimeout!==void 0&&clearTimeout(this._copiedTimeout),this._copiedTimeout=window.setTimeout(()=>{this._copiedPulse=!1,this._copiedTimeout=void 0},1500)}catch{}}static{this.styles=ur}};J([F({attribute:!1})],Q.prototype,`hass`,void 0),J([I()],Q.prototype,`_config`,void 0),J([I()],Q.prototype,`_open`,void 0),J([I()],Q.prototype,`_openCar`,void 0),J([I()],Q.prototype,`_copiedPulse`,void 0),Q=J([Fe(`tankstellen-austria-card-editor`)],Q);var kr=`Datenquelle: E-Control`;window.customCards=window.customCards||[],window.customCards.push({type:`tankstellen-austria-card`,name:`Tankstellen Austria`,description:`Austrian fuel prices from E-Control with sparklines and best-refuel analytics.`,preview:!0,documentationURL:`https://github.com/rolandzeiner/tankstellen-austria`,getEntitySuggestion:(e,t)=>!t.startsWith(`sensor.`)||e?.entities?.[t]?.platform!==`tankstellen_austria`?null:{config:{type:`custom:tankstellen-austria-card`,entities:[t]}}});var $=class extends P{constructor(...e){super(...e),this.preview=!1,this._activeTab=0,this._expandedStations=/* @__PURE__ */ new Set,this._history={},this._versionMismatch=null,this._lastManualRefresh=0,this._noNewData=!1,this._historyError=!1,this._apiMaintenance=!1,this._cooldownTick=0,this._initDone=!1,this._onDismissVersionBanner=()=>{this._versionMismatch=null},this._onRefresh=()=>{if(!this.hass)return;let e=Date.now();if(e-this._lastManualRefresh<12e4)return;this._lastManualRefresh=e,this._noNewData=!1;let t=this._resolveEntities(),n=(t[this._activeTab]??t[0])?.last_updated;for(let e of t){let t=this.hass.callService(`homeassistant`,`update_entity`,{entity_id:e.entity_id});t&&typeof t.catch==`function`&&t.catch(t=>{console.warn(`[Tankstellen Austria] update_entity failed for`,e.entity_id,t)})}this._postRefreshTimeout!==void 0&&clearTimeout(this._postRefreshTimeout),this._postRefreshTimeout=window.setTimeout(()=>{this._postRefreshTimeout=void 0;try{let e=this._resolveEntities();(e[this._activeTab]??e[0])?.last_updated===n&&(this._noNewData=!0)}catch(e){console.warn(`[Tankstellen Austria] post-refresh check failed`,e)}},Ke),this._cooldownInterval!==void 0&&clearInterval(this._cooldownInterval),typeof window<`u`&&typeof window.matchMedia==`function`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?(this._cooldownTimeout!==void 0&&clearTimeout(this._cooldownTimeout),this._cooldownTimeout=window.setTimeout(()=>{this._cooldownTimeout=void 0,this._cooldownTick=(this._cooldownTick+1)%1e6},Ge)):this._cooldownInterval=window.setInterval(()=>{Date.now()-this._lastManualRefresh>=12e4&&this._cooldownInterval!==void 0&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),this._cooldownTick=(this._cooldownTick+1)%1e6},1e3)},this._onVersionReload=async()=>{if(this._versionMismatch)try{sessionStorage.setItem(`tsa-reload-attempted-${this._versionMismatch}`,`1`)}catch{}await fr()}}static getConfigElement(){return document.createElement(`tankstellen-austria-card-editor`)}static getStubConfig(e){let t=yt(e);return{entities:t.length?[t[0]]:[],stations:{distance:!0,payment_mode:`highlight`}}}setConfig(e){if(!e||typeof e!=`object`||Array.isArray(e))throw Error(`tankstellen-austria-card: config must be an object`);let t=e.entities;if(t!==void 0&&typeof t!=`string`&&!Array.isArray(t))throw Error(`tankstellen-austria-card: config.entities must be a string or array of entity IDs`);if(this._config=dt(_t(gt(e))),this._config.entities){let e={},t=!1;for(let n of this._config.entities){let r=rn(n);r.length>=2&&(e[n]=r,t=!0)}t&&(this._history={...this._history,...e})}}getCardSize(){let e=this._config??{},t=this.hass&&this._config?this._resolveEntities():[],n=t[this._activeTab]??t[0],r=n?B(this.hass,n.entity_id,n.attributes):void 0,i=(e.cars??[]).filter(e=>r===void 0||e.fuel_type===r),a=ct(e,{entityCount:Math.max(1,t.length),stationCount:n?.attributes.stations?.length??5,carCount:i.length,dynamic:n?.attributes.dynamic_mode===!0});return Math.ceil(a/50)}getGridOptions(){return{columns:12,rows:`auto`,min_columns:6,min_rows:4}}shouldUpdate(e){if(!this._config)return!1;if(e.has(`_config`)||e.has(`_activeTab`)||e.has(`_expandedStations`)||e.has(`_history`)||e.has(`_historyError`)||e.has(`_apiMaintenance`)||e.has(`_versionMismatch`)||e.has(`_lastManualRefresh`)||e.has(`_noNewData`)||e.has(`_cooldownTick`)||e.has(`layout`)||e.has(`preview`))return!0;let t=e.get(`hass`);return!t||t.language!==this.hass.language||this._trackedEntityIds().some(e=>t.states[e]!==this.hass.states[e])}_trackedEntityIds(){return this._config.entities?.length?this._config.entities:yt(this.hass)}_resolveEntities(){return this.hass?this._trackedEntityIds().map(e=>{let t=this.hass.states[e];return t?{entity_id:e,state:t.state,attributes:t.attributes,last_updated:t.last_updated}:null}).filter(e=>e!==null):[]}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_t(e,t){return Jt(`card.${e}`,this._ctx(),t)}connectedCallback(){super.connectedCallback(),this.hass&&this._config&&this._syncApiStatus(),this._initDone||this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),this._stopApiStatusPoll(),this._historyInterval!==void 0&&(clearInterval(this._historyInterval),this._historyInterval=void 0),this._cooldownInterval!==void 0&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),this._postRefreshTimeout!==void 0&&(clearTimeout(this._postRefreshTimeout),this._postRefreshTimeout=void 0),this._cooldownTimeout!==void 0&&(clearTimeout(this._cooldownTimeout),this._cooldownTimeout=void 0),this._initDone=!1}willUpdate(e){e.has(`hass`)&&(this._syncApiStatus(),this._appendLiveStates(e.get(`hass`)))}_appendLiveStates(e){if(!e)return;let t;for(let n of this._trackedEntityIds()){let r=this.hass.states[n];if(!r||r===e.states[n])continue;let i=this._history[n];if(!i?.length)continue;let a=Number(r.state),o=new Date(r.last_changed??r.last_updated).getTime();if(!Number.isFinite(a)||!Number.isFinite(o))continue;let s=i[i.length-1];if(!(o>s.time)||a===s.value)continue;let c={time:o,value:a};an(n,c),t??={...this._history},t[n]=[...i,c]}t&&(this._history=t)}_syncApiStatus(){this._resolveEntities().some(e=>e.state===`unavailable`)?this._apiStatusInterval===void 0&&(this._checkApiStatus(),this._apiStatusInterval=window.setInterval(()=>{this._checkApiStatus()},Ot)):(this._stopApiStatusPoll(),this._apiMaintenance=!1)}async _checkApiStatus(){this._apiMaintenance=await kt(this.hass)}_stopApiStatusPoll(){this._apiStatusInterval!==void 0&&(clearInterval(this._apiStatusInterval),this._apiStatusInterval=void 0)}updated(e){!this._initDone&&this.isConnected&&this.hass&&this._config&&(this._initDone=!0,this._fetchAllHistory(),this._historyInterval=window.setInterval(()=>{this._fetchAllHistory()},qe),this._checkCardVersion())}async _fetchAllHistory(){try{let e=this._resolveEntities();await Promise.all(e.map(async e=>{let t=await nn(this.hass,e.entity_id);this._history={...this._history,[e.entity_id]:t}})),this._historyError=!1}catch(e){console.warn(`[Tankstellen Austria] history refresh failed`,e),this._historyError=!0}}async _checkCardVersion(){let e=await dr(this.hass,`tankstellen_austria/card_version`,We);e&&(this._versionMismatch=e)}render(){if(!this.hass||!this._config)return O`
        <ha-card>
          <div class="empty" role="status" aria-live="polite">
            ${this._t(`loading`)}
          </div>
          ${this._renderFooter(void 0)}
        </ha-card>
      `;let e=this._resolveEntities(),t=this._activeTab>=e.length?0:this._activeTab;if(!e.length)return O`
        <ha-card>
          ${this._renderVersionBanner()}
          <div class="empty">${this._t(`no_data`)}</div>
          ${this._renderFooter(void 0)}
        </ha-card>
      `;let n=e[t]??e[0],r=n.attributes.attribution;return O`
      <ha-card>
        ${this._renderTabs(e,t)}
        <div class="body">
          ${this._renderVersionBanner()}
          ${this._apiMaintenance&&n.state===`unavailable`?O`<ha-alert alert-type="info" role="status">
                ${this._t(`api_maintenance`)}
              </ha-alert>`:j}
          ${this._historyError?O`<ha-alert alert-type="warning" role="alert">
                ${this._t(`history_fetch_error`)}
              </ha-alert>`:j}
          ${this._renderHead(n)}
          ${this._renderSparklineBlock(n)}
          ${this._renderCars(n)}
          ${this._renderStationList(n,t)}
        </div>
        ${this._renderFooter(r)}
      </ha-card>
    `}_renderFooter(e){if(this._config?.hide_attribution===!0)return j;let t=this._config?.logo_adapt_to_theme===!0,n=!!this.hass?.themes?.darkMode,r=t?`brand-logo adaptive ${n?`adaptive-dark`:`adaptive-light`}`:`brand-logo`,i=e&&e.includes(`E-Control`)?e:kr;return O`
      <div class="footer">
        <a
          class="brand-link"
          href=${gr(mr)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="E-Control"
          @click=${e=>e.stopPropagation()}
        >
          <img
            class=${r}
            src=${hr}
            alt="E-Control"
          />
        </a>
        <span class="attribution-text">${i}</span>
      </div>
    `}_renderVersionBanner(){if(this.preview)return j;let e=this._versionMismatch!==null&&typeof sessionStorage<`u`&&sessionStorage.getItem(`tsa-reload-attempted-${this._versionMismatch}`)===`1`;return pr({mismatchVersion:this._versionMismatch,stuck:e,t:(e,t)=>this._t(e,t),onReload:this._onVersionReload,onDismiss:this._onDismissVersionBanner})}_renderTabs(e,t){if(e.length<=1)return j;let n=this._config.tab_labels??{};return O`
      <div class="tabs" role="tablist">
        ${e.map((r,i)=>{let a=n[r.entity_id],o;if(typeof a==`string`&&a.trim().length>0)o=a;else if(o=W(B(this.hass,r.entity_id,r.attributes),this._ctx()),r.attributes.dynamic_mode===!0){let e=r.attributes.dynamic_tracker_label;e&&(o+=` · ${e}`)}let s=i===t;return O`
            <button
              type="button"
              role="tab"
              class=${L({tab:!0,active:s})}
              aria-selected=${s?`true`:`false`}
              tabindex=${s?`0`:`-1`}
              @click=${()=>this._onTabClick(i)}
              @keydown=${t=>this._onTabKeydown(t,i,e.length)}
            >
              ${o}
            </button>
          `})}
      </div>
    `}_renderHead(e){let t=this._config.hide_header!==!0,n=e.attributes.dynamic_mode===!0,r=(e.attributes.stations??[])[0]?.price,i=!n&&this._config.hide_header_price!==!0&&r!=null;if(!t&&!i&&!n)return j;let a=B(this.hass,e.entity_id,e.attributes),o=e.attributes.fuel_type_name||W(a,this._ctx()),s=n?e.attributes.dynamic_tracker_label??null:null,c=e.attributes.average_price;return O`
      <header class=${L({head:!0,"no-title":!t})}>
        ${t?O`
              <div class="tile" aria-hidden="true">
                <ha-icon icon="mdi:gas-station"></ha-icon>
              </div>
              <h2 class="title">
                ${o}
                ${s?O`<span class="subtitle">${s}</span>`:j}
              </h2>
            `:j}
        ${i?O`
              <p class="price-line">
                <span class="price-big">${Tt(r)}</span>
                <span class="price-ctx">
                  ${this._t(`cheapest`)}${c==null?j:O` · ${this._t(`average`)} <b>${V(c)}</b>`}
                </span>
              </p>
            `:j}
        ${n?O`
              <div class="head-actions">
                ${this._renderRefreshButton()}
                ${this._renderDynamicChips(e)}
              </div>
            `:j}
      </header>
    `}_renderDynamicChips(e){let t=!!e.last_updated;return!t&&!this._noNewData?j:O`
      <div class="chip-row" aria-live="polite">
        ${t?O`<span class="chip">
              <ha-icon icon="mdi:clock-outline" aria-hidden="true"></ha-icon>
              <ha-relative-time
                .hass=${this.hass}
                .datetime=${new Date(e.last_updated)}
              ></ha-relative-time>
            </span>`:j}
        ${this._noNewData?O`<span class="chip warn" role="status">
              <ha-icon icon="mdi:alert-circle-outline" aria-hidden="true"></ha-icon>
              ${this._t(`no_new_data`)}
            </span>`:j}
      </div>
    `}_renderRefreshButton(){let e=Ge-(Date.now()-this._lastManualRefresh),t=e>0,n=t?(()=>{let t=Math.ceil(e/1e3);return`${Math.floor(t/60)}:${String(t%60).padStart(2,`0`)}`})():``;return O`
      <button
        class=${L({"btn-primary":!0,cooling:t})}
        type="button"
        aria-label=${this._t(`refresh`)}
        aria-disabled=${t?`true`:`false`}
        @click=${this._onRefresh}
      >
        <ha-icon icon="mdi:refresh" aria-hidden="true"></ha-icon>
        <span>${t?n:this._t(`refresh`)}</span>
      </button>
    `}_renderSparklineBlock(e){return e.attributes.dynamic_mode===!0||this._config.show_history===!1?j:this._renderSparkline(e)}_renderSparkline(e){let t=e.entity_id,n=this._history[t]??[];if(!bn(n))return j;let r=this._config.show_median_line===!0,i=this._config.show_hour_envelope===!0,a=this._config.show_noon_markers===!0,o=this._config.show_minmax!==!1,s=this._config.show_best_refuel!==!1,c=un(this.hass),l=i?this._envelope(n,c):null,u=s?this._analysis(n,c):null,d=qt(this._ctx()).replace(`_`,`-`);return O`
      <button
        class="chart"
        type="button"
        data-entity=${t}
        aria-label=${this._t(`sparkline_open_more_info`)}
        @click=${()=>this._onSparklineClick(t)}
      >
        <tankstellen-austria-sparkline
          .points=${n}
          .envelope=${l}
          .analysis=${u}
          .showMedianLine=${r}
          .showHourEnvelope=${i}
          .showNoonMarkers=${a}
          .showMinMax=${o}
          .timeZone=${c}
          .language=${d}
          .hour12=${dn(this.hass.locale,d)}
          .translations=${this._sparklineTranslations(d)}
        ></tankstellen-austria-sparkline>
      </button>
      ${this._renderFacts(u)}
    `}_analysisFor(e,t){let n=this._analysisMemo;return n&&n.points===e&&n.timeZone===t?n:(this._analysisMemo={points:e,timeZone:t},this._analysisMemo)}_envelope(e,t){let n=this._analysisFor(e,t);return n.envelope??=cr(e,t),n.envelope}_analysis(e,t){let n=this._analysisFor(e,t);return n.analysis??=sr(e,t),n.analysis}_sparklineTranslations(e){if(this._sparklineI18n?.lang===e)return this._sparklineI18n.strings;let t={min_label:this._t(`min_label`),max_label:this._t(`max_label`),last_7_days:this._t(`last_7_days`),window_label:this._t(`window_label`),median_delta_below:this._t(`median_delta_below`),median_delta_above:this._t(`median_delta_above`),median_delta_equal:this._t(`median_delta_equal`),sparkline_aria_summary:this._t(`sparkline_aria_summary`),sparkline_aria_simple:this._t(`sparkline_aria_simple`)};return this._sparklineI18n={lang:e,strings:t},t}_renderFacts(e){if(!e)return j;let t=(e,t,n=``,r=j)=>O`
      <li class=${n}>
        <ha-icon icon=${e} aria-hidden="true"></ha-icon>
        <span>${t}</span>
        ${r}
      </li>
    `;if(!e.hasEnoughData)return O`<ul class="facts">
        ${t(`mdi:information-outline`,this._t(`not_enough_data_hint`))}
      </ul>`;let n=[],r=e=>String(e).padStart(2,`0`);if(e.hour==null)n.push(t(`mdi:information-outline`,this._t(`no_pattern_hint`,{range:(e.facts?.daily_range_cents??0).toFixed(1)})));else{let i=e.hour,a=this._t(`best_refuel_hour`,{h1:r(i),h2:r(e.hour_end??(i+1)%24)});e.alt_hour!=null&&e.alt_hour_end!=null&&(a+=`, ${this._t(`best_refuel_alt`,{a1:r(e.alt_hour),a2:r(e.alt_hour_end)})}`),e.weekday!=null&&(a+=` · ${Yt(this._ctx())[e.weekday]??``}`),n.push(t(`mdi:lightbulb-outline`,a,`lead`,this._renderConfidence(e)))}return n.push(...this._factRows(e.facts)),O`<ul class="facts">${n}</ul>`}_renderConfidence(e){let t=e.confidence;if(!t)return j;let n=this._t(`confidence_${t.level}`),r=[`${this._t(`confidence_title`)}: ${n}`,`${this._t(`confidence_span`)}: ${t.span_days} ${this._t(`confidence_days`)}`,`${this._t(`confidence_gap`)}: ${t.gap_cents.toFixed(1)} ${this._t(`confidence_cents`)}`,`${this._t(`confidence_consistency`)}: ${t.consistency_pct}%`];e.alt_hour!=null&&r.push(this._t(`confidence_tied_hint`)),t.span_days<14&&r.push(this._t(`confidence_short_history_hint`));let i=r.join(`. `);return O`<span
      class="conf conf-${t.level}"
      title=${i}
      aria-label=${i}
    >${n}</span>`}_factRows(e){if(!e)return[];let t=[],n=(e,t)=>O`
      <li>
        <ha-icon icon=${e} aria-hidden="true"></ha-icon>
        <span>${t}</span>
      </li>
    `;if(e.noon_days>=7){let r={n:String(e.noon_rise_days),d:String(e.noon_days),c:e.noon_rise_cents.toFixed(1)};e.noon_rise_days===0?t.push(n(`mdi:trending-neutral`,this._t(`noon_none`,r))):e.noon_rise_days*2>=e.noon_days?t.push(n(`mdi:trending-up`,this._t(`noon_before`,r))):t.push(n(`mdi:trending-up`,this._t(`noon_some`,r)))}let{cheaper_than_pct:r,dearer_than_pct:i}=e;return r>=i&&r>=25?t.push(n(`mdi:arrow-down-thin`,this._t(`now_cheaper`,{pct:String(r)}))):i>r&&i>=25?t.push(n(`mdi:arrow-up-thin`,this._t(`now_dearer`,{pct:String(i)}))):t.push(n(`mdi:approximately-equal`,this._t(`now_usual`))),t}_renderCars(e){let t=e.attributes.stations??[];if(!t.length)return j;let n=this._config.show_cars===!0,r=this._config.show_car_fillup!==!1,i=this._config.show_car_consumption!==!1;if(!n||!r&&!i)return j;let a=B(this.hass,e.entity_id,e.attributes),o=this._config.payment_filter??[],s=this._config.payment_highlight_mode===!0,c=(this._config.cars??[]).filter(e=>e.fuel_type===a&&e.tank_size>0&&e.name),l=r?c:c.filter(e=>Number(e.consumption)>0);if(!l.length)return j;let u=s?t:t.filter(e=>St(e,o)),d=s?t[0]?.price:u[0]?.price;return O`
      <ul class="cars">
        ${l.map(e=>this._renderCar(e,d,r,i))}
      </ul>
    `}_renderCar(e,t,n,r){let i=Number(e.consumption),a=Number.isFinite(i)&&i>0,o=e=>`€ ${e.toFixed(2).replace(`.`,`,`)}`,s=a?`${i.toFixed(1).replace(`.`,`,`)} l/100 km`:``,c=t==null?`–`:o(t*Number(e.tank_size)),l=t!=null&&a?o(t*i):`–`,u=r&&a,d=[n?`${e.tank_size} l`:``,s].filter(Boolean).join(` · `),f=n?O`${c}${u?O` <small>· ${l} / 100 km</small>`:j}`:O`${l} <small>/ 100 km</small>`;return O`
      <li>
        <ha-icon icon=${e.icon||`mdi:car`} aria-hidden="true"></ha-icon>
        <span>${e.name}${d?O` <small>${d}</small>`:j}</span>
        <span class="num">${f}</span>
      </li>
    `}_renderStationList(e,t){let n=e.attributes.stations??[],r=parseInt(String(this._config.max_stations),10),i=Number.isFinite(r)?Math.max(0,Math.min(5,r)):5,a=this._config.payment_filter??[],o=this._config.payment_highlight_mode===!0,s=o?n:n.filter(e=>St(e,a));if(e.state===`unavailable`)return O`<div class="empty" role="status" aria-live="polite">
        <div class="empty-title">${this._t(`unreachable`)}</div>
        <div class="empty-detail">${this._t(`unreachable_detail`)}</div>
      </div>`;if(i===0)return j;if(!s.length&&a.length&&n.length)return O`
        <div class="empty">
          ${this._t(`payment_filter_active`)} — ${this._t(`no_data`)}
        </div>
      `;if(!s.length)return O`<div class="empty">${this._t(`no_data`)}</div>`;let c=s;return this._config.sort_by_distance===!0&&(c=[...s],c.sort((e,t)=>(e.distance_m??1/0)-(t.distance_m??1/0))),O`
      <ol class="stations">
        ${c.slice(0,i).map((e,n)=>this._renderStation(e,n,t,a,o))}
      </ol>
    `}_renderIndexTile(e,t){let n=this._config.tile_shape===`circle`;if(this._config.show_brand!==!0)return O`<span class=${L({"st-tile":!0,circle:n})} aria-hidden="true">
        ${t+1}
      </span>`;let r=Qe(e.name),i=r.bg?{"--tankst-tile-bg":r.bg,"--tankst-tile-fg":r.fg??``}:{};return O`<span
      class=${L({"st-tile":!0,brand:!0,"brand-known":!!r.bg,circle:n})}
      style=${Ue(i)}
      aria-hidden="true"
    >
      ${r.initials}
    </span>`}_renderStation(e,t,n,r,i){let a=this._config.show_index!==!1||this._config.show_brand===!0,o=this._config.show_map_links!==!1,s=this._config.show_distance===!0,c=this._config.show_opening_hours!==!1,l=this._config.show_payment_methods!==!1,u=e.location??{},d=`${n}|${e.name??``}|${u.address??``}`,f=this._expandedStations.has(d),p=e.open===!1,ee=!p&&wt(e),m=i&&r.length>0&&St(e,r),h=m?Ct(e,r,{cash:this._t(`cash`),debit_card:this._t(`debit_card`),credit_card:this._t(`credit_card`)}):[],g=c&&!!e.opening_hours?.length,_=l&&bt(e.payment_methods),v=g||_,y=v?`tsa-station-detail-${n}-${t}`:void 0,b=[u.postalCode,u.city].filter(e=>e!=null&&e!==``).join(` `),x=u.address??``,S=b?O`<span lang="de">${b}</span>`:j,te=x?O`<span lang="de">${x}</span>`:j,C=S!==j&&te!==j?`, `:``,w=``;if(o){let t=yr(this._config.map_provider??`auto`,vr(navigator.userAgent,navigator.maxTouchPoints));w=_r(Dt(u,e.name??``,t))}return O`
      <li class=${L({st:!0,"pm-highlight":m})}>
        <button
          class=${L({"st-row":!0,"no-map":!w})}
          type="button"
          aria-expanded=${v?f?`true`:`false`:j}
          aria-controls=${y??j}
          ?disabled=${!v}
          @click=${()=>this._onStationClick(d)}
        >
          ${a?this._renderIndexTile(e,t):j}
          <span class="st-name">
            ${e.name?O`<span lang="de">${e.name}</span>`:`–`}
            ${p?O`<span class="flag closed">${this._t(`closed`)}</span>`:ee?O`<span class="flag">${this._t(`closing_soon`)}</span>`:j}
            ${h.map(e=>O`<span class="chip match">${e}</span>`)}
          </span>
          <span class="st-addr">${S}${C}${te}</span>
          <span class="st-price">${Tt(e.price)}</span>
          ${s&&e.distance_m!=null?O`<span class="st-dist" lang="de">${Et(e.distance_m)}</span>`:j}
          ${v?O`<ha-icon class="chev" icon="mdi:chevron-down" aria-hidden="true"></ha-icon>`:j}
        </button>
        ${w?O`
              <a
                class="st-map"
                href=${w}
                target=${w.startsWith(`geo:`)?`_self`:`_blank`}
                rel="noopener noreferrer"
                aria-label=${`${this._t(`map`)}: ${e.name??``}`}
                title=${this._t(`map`)}
              >
                <ha-icon
                  icon=${/\d/.test(x)?`mdi:map-marker`:`mdi:magnify`}
                  aria-hidden="true"
                ></ha-icon>
              </a>
            `:j}
        ${v?O`
              <div id=${y} class=${L({"st-detail":!0,expanded:f})}>
                <div>
                  ${g?this._renderHours(e.opening_hours??[]):j}
                  ${_?this._renderPaymentMethods(e.payment_methods):j}
                </div>
              </div>
            `:j}
      </li>
    `}_renderHours(e){return O`
      <dl class="hours">
        ${[[this._t(`mon_fri`),e.find(e=>e.day===`MO`)??e[0]],[this._t(`sat`),e.find(e=>e.day===`SA`)??e[5]],[this._t(`sun`),e.find(e=>e.day===`SO`)??e[6]],[this._t(`holiday`),e.find(e=>e.day===`FE`)]].map(([e,t])=>t?O`<dt>${e}</dt><dd>${t.from} – ${t.to}</dd>`:j)}
      </dl>
    `}_renderPaymentMethods(e){if(!e)return j;let t=[],n=(e,t)=>O`
      <span><ha-icon icon=${e} aria-hidden="true"></ha-icon>${t}</span>
    `;e.cash&&t.push(n(`mdi:cash`,this._t(`cash`))),e.debit_card&&t.push(n(`mdi:credit-card`,this._t(`debit_card`))),e.credit_card&&t.push(n(`mdi:credit-card`,this._t(`credit_card`)));for(let n of e.others??[])t.push(O`<span class="pm-other">${n}</span>`);return t.length?O`<div class="pay">${t}</div>`:j}_onTabClick(e){this._activeTab!==e&&(this._activeTab=e,this._expandedStations=/* @__PURE__ */ new Set)}_onTabKeydown(e,t,n){let r=t;switch(e.key){case`ArrowRight`:r=(t+1)%n;break;case`ArrowLeft`:r=(t-1+n)%n;break;case`Home`:r=0;break;case`End`:r=n-1;break;default:return}e.preventDefault(),this._onTabClick(r),this.updateComplete.then(()=>{(this.shadowRoot?.querySelectorAll(`.tabs [role="tab"]`))?.[r]?.focus()})}_onStationClick(e){let t=new Set(this._expandedStations);t.has(e)?t.delete(e):t.add(e),this._expandedStations=t}_onSparklineClick(e){this.dispatchEvent(new CustomEvent(`hass-more-info`,{detail:{entityId:e},bubbles:!0,composed:!0}))}static{this.styles=lr}};J([F({attribute:!1})],$.prototype,`hass`,void 0),J([F({reflect:!0})],$.prototype,`layout`,void 0),J([F({type:Boolean})],$.prototype,`preview`,void 0),J([I()],$.prototype,`_config`,void 0),J([I()],$.prototype,`_activeTab`,void 0),J([I()],$.prototype,`_expandedStations`,void 0),J([I()],$.prototype,`_history`,void 0),J([I()],$.prototype,`_versionMismatch`,void 0),J([I()],$.prototype,`_lastManualRefresh`,void 0),J([I()],$.prototype,`_noNewData`,void 0),J([I()],$.prototype,`_historyError`,void 0),J([I()],$.prototype,`_apiMaintenance`,void 0),J([I()],$.prototype,`_cooldownTick`,void 0),$=J([Fe(`tankstellen-austria-card`)],$);export{$ as TankstellenAustriaCard};