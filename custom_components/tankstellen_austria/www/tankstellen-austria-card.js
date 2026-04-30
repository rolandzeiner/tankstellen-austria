// Tankstellen Austria Card — bundled by Rollup. Edit sources in src/, then `npm run build`.
function e(e,t,i,n){var r,a=arguments.length,o=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap;let a=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(t,e))}return e}toString(){return this.cssText}};const o=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new a(i,e,n)},s=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,_=m.trustedTypes,f=_?_.emptyScript:"",g=m.reactiveElementPolyfillSupport,y=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!l(e,t),x={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&c(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:r}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const a=n?.call(this);r?.call(this,t),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(s(e))}else void 0!==e&&t.push(s(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,n)=>{if(i)e.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of n){const n=document.createElement("style"),r=t.litNonce;void 0!==r&&n.setAttribute("nonce",r),n.textContent=i.cssText,e.appendChild(n)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=n;const a=r.fromAttribute(t,e.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(e,t,i,n=!1,r){if(void 0!==e){const a=this.constructor;if(!1===n&&(r=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??b)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:r},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==r||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[y("elementProperties")]=new Map,w[y("finalized")]=new Map,g?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=e=>e,A=$.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+M,z=`<${E}>`,T=document,P=()=>T.createComment(""),D=e=>null===e||"object"!=typeof e&&"function"!=typeof e,H=Array.isArray,N="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,F=/>/g,L=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),O=/'/g,U=/"/g,B=/^(?:script|style|textarea|title)$/i,j=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),V=j(1),q=j(2),W=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),K=new WeakMap,Z=T.createTreeWalker(T,129);function J(e,t){if(!H(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const Q=(e,t)=>{const i=e.length-1,n=[];let r,a=2===t?"<svg>":3===t?"<math>":"",o=R;for(let t=0;t<i;t++){const i=e[t];let s,l,c=-1,d=0;for(;d<i.length&&(o.lastIndex=d,l=o.exec(i),null!==l);)d=o.lastIndex,o===R?"!--"===l[1]?o=I:void 0!==l[1]?o=F:void 0!==l[2]?(B.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=L):void 0!==l[3]&&(o=L):o===L?">"===l[0]?(o=r??R,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,s=l[1],o=void 0===l[3]?L:'"'===l[3]?U:O):o===U||o===O?o=L:o===I||o===F?o=R:(o=L,r=void 0);const h=o===L&&e[t+1].startsWith("/>")?" ":"";a+=o===R?i+z:c>=0?(n.push(s),i.slice(0,c)+C+i.slice(c)+M+h):i+M+(-2===c?t:h)}return[J(e,a+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class X{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let r=0,a=0;const o=e.length-1,s=this.parts,[l,c]=Q(e,t);if(this.el=X.createElement(l,i),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=Z.nextNode())&&s.length<o;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(C)){const t=c[a++],i=n.getAttribute(e).split(M),o=/([.?@])?(.*)/.exec(t);s.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?ne:"?"===o[1]?re:"@"===o[1]?ae:ie}),n.removeAttribute(e)}else e.startsWith(M)&&(s.push({type:6,index:r}),n.removeAttribute(e));if(B.test(n.tagName)){const e=n.textContent.split(M),t=e.length-1;if(t>0){n.textContent=A?A.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],P()),Z.nextNode(),s.push({type:2,index:++r});n.append(e[t],P())}}}else if(8===n.nodeType)if(n.data===E)s.push({type:2,index:r});else{let e=-1;for(;-1!==(e=n.data.indexOf(M,e+1));)s.push({type:7,index:r}),e+=M.length-1}r++}}static createElement(e,t){const i=T.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,n){if(t===W)return t;let r=void 0!==n?i._$Co?.[n]:i._$Cl;const a=D(t)?void 0:t._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(e),r._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=r:i._$Cl=r),void 0!==r&&(t=Y(e,r._$AS(e,t.values),r,n)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??T).importNode(t,!0);Z.currentNode=n;let r=Z.nextNode(),a=0,o=0,s=i[0];for(;void 0!==s;){if(a===s.index){let t;2===s.type?t=new te(r,r.nextSibling,this,e):1===s.type?t=new s.ctor(r,s.name,s.strings,this,e):6===s.type&&(t=new oe(r,this,e)),this._$AV.push(t),s=i[++o]}a!==s?.index&&(r=Z.nextNode(),a++)}return Z.currentNode=T,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),D(e)?e===G||null==e||""===e?(this._$AH!==G&&this._$AR(),this._$AH=G):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>H(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==G&&D(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=X.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new ee(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=K.get(e.strings);return void 0===t&&K.set(e.strings,t=new X(e)),t}k(e){H(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const r of e)n===t.length?t.push(i=new te(this.O(P()),this.O(P()),this,this.options)):i=t[n],i._$AI(r),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,r){this.type=1,this._$AH=G,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(e,t=this,i,n){const r=this.strings;let a=!1;if(void 0===r)e=Y(this,e,t,0),a=!D(e)||e!==this._$AH&&e!==W,a&&(this._$AH=e);else{const n=e;let o,s;for(e=r[0],o=0;o<r.length-1;o++)s=Y(this,n[i+o],t,o),s===W&&(s=this._$AH[o]),a||=!D(s)||s!==this._$AH[o],s===G?e=G:e!==G&&(e+=(s??"")+r[o+1]),this._$AH[o]=s}a&&!n&&this.j(e)}j(e){e===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ne extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===G?void 0:e}}class re extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==G)}}class ae extends ie{constructor(e,t,i,n,r){super(e,t,i,n,r),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??G)===W)return;const i=this._$AH,n=e===G&&i!==G||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==G&&(i===G||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const se=$.litHtmlPolyfillSupport;se?.(X,te),($.litHtmlVersions??=[]).push("3.3.2");const le=globalThis;let ce=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let r=n._$litPart$;if(void 0===r){const e=i?.renderBefore??null;n._$litPart$=r=new te(t.insertBefore(P(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const he=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},pe={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},ue=(e=pe,t,i)=>{const{kind:n,metadata:r}=i;let a=globalThis.litPropertyMetadata.get(r);if(void 0===a&&globalThis.litPropertyMetadata.set(r,a=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const r=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,r,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const r=this[n];t.call(this,i),this.requestUpdate(n,r,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function me(e){return(t,i)=>"object"==typeof i?ue(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function _e(e){return me({...e,state:!0,attribute:!1})}const fe=1;class ge{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const ye=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends ge{constructor(e){if(super(e),e.type!==fe||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const i=e.element.classList;for(const e of this.st)e in t||(i.remove(e),this.st.delete(e));for(const e in t){const n=!!t[e];n===this.st.has(e)||this.nt?.has(e)||(n?(i.add(e),this.st.add(e)):(i.remove(e),this.st.delete(e)))}return W}}),ve="1.9.0",be=12e4,xe=["mdi:car","mdi:car-sports","mdi:car-hatchback","mdi:car-estate","mdi:car-convertible","mdi:car-pickup","mdi:car-electric","mdi:car-electric-outline","mdi:car-side","mdi:van-passenger","mdi:motorbike","mdi:bus","mdi:truck","mdi:rv-truck"],we=["DIE","SUP","GAS"];function $e(e){if(!e)throw new Error("tankstellen-austria-card: config missing");const t={...e};if("string"==typeof t.entities&&(t.entities=[t.entities]),Array.isArray(t.entities)?t.entities=t.entities.filter(e=>"string"==typeof e&&e.includes(".")):null!=t.entities&&(console.warn("[Tankstellen Austria] config.entities must be an array of entity IDs — ignoring",t.entities),delete t.entities),null!=t.max_stations){const e=parseInt(String(t.max_stations),10);t.max_stations=Number.isFinite(e)?Math.max(0,Math.min(5,e)):5}return Array.isArray(t.payment_filter)?t.payment_filter=t.payment_filter.filter(e=>"string"==typeof e&&e.length>0):null!=t.payment_filter&&delete t.payment_filter,Array.isArray(t.cars)?t.cars=t.cars.map(e=>function(e){if(!e||"object"!=typeof e)return null;const t=e,i="string"==typeof t.name?t.name.slice(0,50):"",n=we.includes(t.fuel_type)?t.fuel_type:"DIE",r=parseInt(String(t.tank_size),10),a=Number.isFinite(r)&&r>=1?Math.min(200,r):50;let o;if(null!=t.consumption){const e=parseFloat(String(t.consumption));Number.isFinite(e)&&e>=0&&(o=Math.min(30,e))}const s={name:i,fuel_type:n,tank_size:a,icon:"string"==typeof t.icon&&t.icon.startsWith("mdi:")?t.icon:"mdi:car"};return null!=o&&(s.consumption=o),s}(e)).filter(e=>null!==e):null!=t.cars&&delete t.cars,t}function ke(e){return e&&e.states?Object.keys(e.states).filter(t=>{const i=e.states[t];return t.startsWith("sensor.")&&i?.attributes?.fuel_type&&Array.isArray(i.attributes.stations)}):[]}function Ae(e,t,i){if("cash"===t)return e.cash?i?.cash??"cash":null;if("debit_card"===t)return e.debit_card?i?.debit_card??"debit_card":null;if("credit_card"===t)return e.credit_card?i?.credit_card??"credit_card":null;const n=(e.others??[]).find(e=>e.toLowerCase()===t.toLowerCase());return n??null}function Se(e,t){if(!t||!t.length)return!0;const i=e.payment_methods??{};return t.some(e=>null!==Ae(i,e))}function Ce(e){return null!=e&&Number.isFinite(Number(e))?`€ ${Number(e).toFixed(3).replace(".",",")}`:"–"}function Me(e){return null!=e&&Number.isFinite(Number(e))?Number(e).toFixed(3).replace(".",","):"–"}var Ee={version:"Version",invalid_configuration:"Invalid configuration",loading:"Loading…",no_data:"No data available"},ze={cheapest:"Cheapest price",average:"Avg. price",price:"Price",closed:"Closed",closing_soon:"Closing soon",open_now:"Open",opening_hours:"Opening hours",payment:"Payment",cash:"Cash",debit_card:"Debit card",credit_card:"Credit card",payment_filter_active:"Payment filter active",payment_highlight_active:"Payment filter (highlight)",mon_fri:"Mon–Fri",sat:"Sat",sun:"Sun",holiday:"Holiday",map:"Map",per_liter:"/l",last_7_days:"Last 7 days",min_label:"Min",max_label:"Max",refresh:"Refresh",last_updated:"Updated:",no_new_data:"No new data",version_update:"Tankstellen Austria updated to v{v} — please reload",version_reload:"Reload",version_reload_stuck:"Reload didn't load the new version. Check HACS and do a hard refresh (Ctrl+Shift+R).",version_dismiss:"Dismiss",fill_up:"Fill up",best_refuel_hour:"Tip: Cheapest between {h1}:00–{h2}:00",best_refuel_hour_weekday:"Tip: Cheapest between {h1}:00–{h2}:00, usually {day}",not_enough_data_hint:"Not enough data yet for a tip (min. 7 days)",confidence_high:"High",confidence_medium:"Medium",confidence_low:"Low",confidence_title:"Recommendation confidence",confidence_span:"Data span",confidence_coverage:"Coverage",confidence_gap:"Gap",confidence_days:"days",confidence_cents:"¢",confidence_short_history_hint:"Note: Home Assistant keeps only 10 days of history by default. For better recommendations raise recorder.purge_keep_days to 30.",median_delta_below:"{c}¢ below median",median_delta_above:"{c}¢ above median",median_delta_equal:"at median",loading:"Loading…",sparkline_open_more_info:"Open price history",sparkline_aria_summary:"Price history last 7 days: minimum {min}, maximum {max}, median {median}",sparkline_aria_simple:"Price history last 7 days: minimum {min}, maximum {max}",history_fetch_error:"Couldn't load price history"},Te={DIE:"Diesel",SUP:"Super 95",GAS:"CNG"},Pe=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],De={entities:"Sensors",entities_hint:"Leave empty for auto-detection",max_stations:"Number of stations",show_index:"Show rank",show_map_links:"Show Google Maps links",show_opening_hours:"Show opening hours",show_payment_methods:"Show payment methods",show_history:"Show price history",show_best_refuel:"Show refuel tip",show_median_line:"Show 7-day median",show_hour_envelope:"Typical hourly range (4 wk)",show_noon_markers:"Noon reset markers",show_minmax:"Show min/max",recorder_hint_intro:"Home Assistant keeps only 10 days of history by default. For better recommendations, add this block to configuration.yaml and restart:",copy:"Copy",copied:"Copied",payment_filter:"Only stations with",payment_filter_custom_placeholder:"Custom, e.g. Routex",payment_filter_custom_hint:"Must match the API string exactly. Common values: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC",payment_filter_add_custom:"Add custom payment method",payment_highlight_mode:"Highlight instead of filter",section_sensors:"Sensors",section_display:"Display",section_payment_filter:"Payment filter",section_tab_labels:"Tab labels",tab_labels_hint:"Leave empty to use the default label",section_cars:"Cars",show_cars:"Show fill-up costs",show_car_fillup:"Show fill-up cost",show_car_consumption:"Show consumption",cars_both_off_hint:'No rows enabled. To hide cars entirely, use "Show fill-up costs" in Display options.',car_name_placeholder:"Name (e.g. Golf TDI)",car_tank_placeholder:"Liters",car_consumption_placeholder:"⌀ l/100km",car_fuel_type:"Fuel type",car_choose_icon:"Choose icon",car_delete:"Delete car",add_car:"+ Add car",copy_sensor_id:"Copy sensor ID to clipboard",tank_size_range_error:"Please enter a value between 1 and 200 litres",consumption_range_error:"Please enter a value between 0 and 30 l/100 km",hide_header_price:"Hide cheapest / average price in header",section_branding:"Branding & attribution",section_history:"Price history",logo_adapt_to_theme:"Adapt E-Control logo color to theme",hide_header:"Hide header",hide_attribution:"Hide attribution footer"},He={common:Ee,card:ze,fuel_types:Te,weekdays:Pe,editor:De},Ne=Object.freeze({__proto__:null,card:ze,common:Ee,default:He,editor:De,fuel_types:Te,weekdays:Pe}),Re={version:"Version",invalid_configuration:"Ungültige Konfiguration",loading:"Lädt…",no_data:"Keine Daten verfügbar"},Ie={cheapest:"Günstigster Preis",average:"Ø Preis",price:"Preis",closed:"Geschlossen",closing_soon:"Schließt bald",open_now:"Geöffnet",opening_hours:"Öffnungszeiten",payment:"Zahlungsarten",cash:"Bar",debit_card:"Bankomat",credit_card:"Kreditkarte",payment_filter_active:"Zahlungsfilter aktiv",payment_highlight_active:"Zahlungsfilter (Hervorhebung)",mon_fri:"Mo–Fr",sat:"Sa",sun:"So",holiday:"Feiertag",map:"Karte",per_liter:"/l",last_7_days:"Letzte 7 Tage",min_label:"Min",max_label:"Max",refresh:"Aktualisieren",last_updated:"Aktualisiert:",no_new_data:"Keine neuen Daten",version_update:"Tankstellen Austria wurde auf v{v} aktualisiert — bitte neu laden",version_reload:"Neu laden",version_reload_stuck:"Neu-Laden hat die neue Version nicht geladen. In HACS prüfen und einen harten Reload (Strg+Umschalt+R) ausführen.",version_dismiss:"Ausblenden",fill_up:"Volltanken",best_refuel_hour:"Tipp: Am günstigsten zwischen {h1}:00–{h2}:00",best_refuel_hour_weekday:"Tipp: Am günstigsten zwischen {h1}:00–{h2}:00, meist {day}",not_enough_data_hint:"Noch zu wenig Daten für Empfehlung (mind. 7 Tage)",confidence_high:"Hoch",confidence_medium:"Mittel",confidence_low:"Niedrig",confidence_title:"Empfehlungsgüte",confidence_span:"Datenumfang",confidence_coverage:"Abdeckung",confidence_gap:"Vorsprung",confidence_days:"Tage",confidence_cents:"Cent",confidence_short_history_hint:"Hinweis: Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen recorder.purge_keep_days auf 30 erhöhen.",median_delta_below:"{c}¢ unter Median",median_delta_above:"{c}¢ über Median",median_delta_equal:"auf Median",loading:"Wird geladen…",sparkline_open_more_info:"Preisverlauf öffnen",sparkline_aria_summary:"Preisverlauf der letzten 7 Tage: Minimum {min}, Maximum {max}, Median {median}",sparkline_aria_simple:"Preisverlauf der letzten 7 Tage: Minimum {min}, Maximum {max}",history_fetch_error:"Preisverlauf konnte nicht geladen werden"},Fe={DIE:"Diesel",SUP:"Super 95",GAS:"CNG Erdgas"},Le=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],Oe={entities:"Sensoren",entities_hint:"Leer lassen für automatische Erkennung",max_stations:"Anzahl Tankstellen",show_index:"Platzierung anzeigen",show_map_links:"Google Maps Links anzeigen",show_opening_hours:"Öffnungszeiten anzeigen",show_payment_methods:"Zahlungsarten anzeigen",show_history:"Preisverlauf anzeigen",show_best_refuel:"Tank-Tipp anzeigen",show_median_line:"7-Tage-Median einblenden",show_hour_envelope:"Typischer Stundenverlauf (4 Wo)",show_noon_markers:"12:00-Markierung (Preisreset)",show_minmax:"Min/Max anzeigen",recorder_hint_intro:"Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen diesen Block in configuration.yaml ergänzen und neu starten:",copy:"Kopieren",copied:"Kopiert",payment_filter:"Nur Tankstellen mit",payment_filter_custom_placeholder:"Benutzerdefiniert, z.B. Routex",payment_filter_custom_hint:"Der Wert muss exakt dem API-String entsprechen. Häufige Werte: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC",payment_filter_add_custom:"Benutzerdefinierte Zahlungsmethode hinzufügen",payment_highlight_mode:"Hervorheben statt filtern",section_sensors:"Sensoren",section_display:"Anzeige",section_payment_filter:"Zahlungsfilter",section_tab_labels:"Tab-Bezeichnungen",tab_labels_hint:"Leer lassen, um die Standard-Bezeichnung zu verwenden",section_cars:"Fahrzeuge",show_cars:"Tankkosten anzeigen",show_car_fillup:"Tankkosten anzeigen",show_car_consumption:"Verbrauch anzeigen",cars_both_off_hint:"Keine Zeile aktiv. Um Fahrzeuge komplett auszublenden, nutze „Tankkosten anzeigen“ in den Anzeige-Optionen.",car_name_placeholder:"Name (z.B. Golf TDI)",car_tank_placeholder:"Liter",car_consumption_placeholder:"⌀ l/100km",car_fuel_type:"Kraftstoffart",car_choose_icon:"Symbol wählen",car_delete:"Fahrzeug entfernen",add_car:"+ Fahrzeug hinzufügen",copy_sensor_id:"Sensor-ID in die Zwischenablage kopieren",tank_size_range_error:"Bitte einen Wert zwischen 1 und 200 Litern eingeben",consumption_range_error:"Bitte einen Wert zwischen 0 und 30 l/100 km eingeben",hide_header_price:"Günstigster/Durchschnittspreis im Header ausblenden",section_branding:"Branding & Quellenangabe",section_history:"Preisverlauf",logo_adapt_to_theme:"E-Control-Logo an Theme-Farbe anpassen",hide_header:"Kopfzeile ausblenden",hide_attribution:"Quellenangabe ausblenden"},Ue={common:Re,card:Ie,fuel_types:Fe,weekdays:Le,editor:Oe};const Be=Object.freeze({__proto__:null,card:Ie,common:Re,default:Ue,editor:Oe,fuel_types:Fe,weekdays:Le}),je={en:Ne,de:Be};function Ve(e,t){return e.split(".").reduce((e,t)=>{if(e&&"object"==typeof e&&t in e)return e[t]},t)}function qe(e,t){const i=Ve(e,t);return"string"==typeof i?i:void 0}function We(e){return(e.configLanguage||e.hassLanguage||"de").replace("-","_")}function Ge(e,t,i){const n=We(t);let r=qe(e,je[n]??Be);if(void 0===r&&(r=qe(e,Be)),void 0===r&&(r=e),i)for(const[e,t]of Object.entries(i))r=r.replace(`{${e}}`,t);return r}function Ke(e){const t=We(e),i=Ve("weekdays",je[t]??Be);if(Array.isArray(i)&&i.every(e=>"string"==typeof e))return i;const n=Ve("weekdays",Be);return Array.isArray(n)?n:[]}function Ze(e,t){const i=We(t),n=Ve("fuel_types",je[i]??Be)??Ve("fuel_types",Be),r=n?.[e];return"string"==typeof r?r:e}const Je=new Map,Qe=new Map;function Xe(e){if("number"==typeof e.lu)return Math.round(1e3*e.lu);const t=e.lu??e.last_updated??e.last_changed;return t?new Date(t).getTime():0}function Ye(e){const t=e.length;if(0===t)return"";if(1===t)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;if(2===t)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)} L ${e[1].x.toFixed(2)} ${e[1].y.toFixed(2)}`;const i=new Array(t-1);for(let n=0;n<t-1;n++){const t=e[n+1].x-e[n].x;i[n]=0===t?0:(e[n+1].y-e[n].y)/t}const n=new Array(t);n[0]=i[0],n[t-1]=i[t-2];for(let e=1;e<t-1;e++)n[e]=(i[e-1]+i[e])/2;for(let e=0;e<t-1;e++){if(0===i[e]){n[e]=0,n[e+1]=0;continue}const t=n[e]/i[e],r=n[e+1]/i[e],a=t*t+r*r;if(a>9){const o=3/Math.sqrt(a);n[e]=o*t*i[e],n[e+1]=o*r*i[e]}}let r=`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;for(let i=0;i<t-1;i++){const t=e[i+1].x-e[i].x,a=e[i].x+t/3,o=e[i].y+n[i]*t/3,s=e[i+1].x-t/3,l=e[i+1].y-n[i+1]*t/3;r+=` C ${a.toFixed(2)} ${o.toFixed(2)}, ${s.toFixed(2)} ${l.toFixed(2)}, ${e[i+1].x.toFixed(2)} ${e[i+1].y.toFixed(2)}`}return r}function et(e,t,i){return Math.max(t,Math.min(i,e))}function tt(e,t){const i=e.length;if(0===i)return NaN;if(1===i)return e[0];const n=et(t,0,1)*(i-1),r=Math.floor(n),a=Math.ceil(n);if(r===a)return e[r];const o=n-r;return e[r]*(1-o)+e[a]*o}const it=280,nt=48;function rt(e){if(e.length<2)return null;const t=[...e].sort((e,t)=>e-t),i=(t.length-1)/2,n=(t[Math.floor(i)]+t[Math.ceil(i)])/2,r=100*(e[e.length-1]-n),a=Math.abs(r).toFixed(1);return r<=-.05?{key:"median_delta_below",cents:a,cls:"median-delta-good"}:r>=.05?{key:"median_delta_above",cents:a,cls:"median-delta-bad"}:{key:"median_delta_equal",cents:a,cls:"median-delta-neutral"}}function at(e,t){const i=[...e].sort((e,t)=>e-t),n=(i.length-1)/2;return t((i[Math.floor(n)]+i[Math.ceil(n)])/2)}function ot(e){const t={template:G,hoverPoints:[],medianDelta:null,viewBoxWidth:it,viewBoxHeight:nt};try{const i=e.points;if(!i||i.length<2)return t;let n=function(e){const t=Date.now()-6048e5,i=e.filter(e=>e.time>=t),n=e.filter(e=>e.time<t),r=n.length?n[n.length-1]:null;return r?[r,...i]:i}(i);if(n.length<2)return t;const r=18e5,a=n[n.length-1];a.time<Date.now()-r&&(n=[...n,{time:Date.now(),value:a.value}]);const o=n.map(e=>e.value),s=Math.min(...o),l=Math.max(...o);let c=s,d=l;const h=e.showHourEnvelope?e.hourEnvelope??null:null;if(h)for(let e=0;e<24;e++){const t=h.minByHour[e],i=h.maxByHour[e];null!=t&&null!=i&&(c=Math.min(c,t),d=Math.max(d,i))}const p=d-c||.01,u=e=>44-(e-c)/p*40,m=n.map((e,t)=>({x:t/(n.length-1)*it,y:u(e.value)})),_=Ye(m),f=_?`${_} L ${it.toFixed(2)} ${nt.toFixed(2)} L 0 ${nt.toFixed(2)} Z`:"";let g=G;if(h){const e=[],t=[];for(let i=0;i<n.length;i++){const r=new Date(n[i].time).getHours(),a=h.maxByHour[r],o=h.minByHour[r];null!=a&&null!=o&&(e.push({x:m[i].x,y:u(a)}),t.push({x:m[i].x,y:u(o)}))}if(e.length>=2){const i=function(e,t){if(!e||!t||e.length<2||e.length!==t.length)return"";const i=Ye(e),n=Ye([...t].reverse()).replace(/^M\s+([-\d.]+)\s+([-\d.]+)/,(e,t,i)=>`L ${t} ${i}`);return`${i} ${n} Z`}(e,t);i&&(g=q`<path d=${i} fill="var(--primary-color)" fill-opacity="0.08" stroke="none"/>`)}}const y=[];if(e.showNoonMarkers&&n.length>=2){const e=n[0].time,t=n[n.length-1].time,i=new Date(e);i.setHours(12,0,0,0),i.getTime()<e&&i.setDate(i.getDate()+1);const r=i=>{if(i<=e||i>=t)return null;let r=0,a=n.length-1;for(;r<a-1;){const e=r+a>>1;n[e].time<=i?r=e:a=e}const o=n[r+1].time-n[r].time,s=o>0?(i-n[r].time)/o:0;return m[r].x+s*(m[r+1].x-m[r].x)};for(let e=i.getTime();e<=t;e+=864e5){const t=r(e);null!=t&&y.push(q`
          <line x1=${t.toFixed(1)} y1="0" x2=${t.toFixed(1)} y2=${nt}
                stroke="var(--secondary-text-color)" stroke-width="0.9"
                stroke-dasharray="2,3" opacity="0.55"/>
        `)}}const v=e.showMedianLine?rt(o):null,b=e.showMedianLine?q`<line x1="0" y1=${at(o,u).toFixed(1)}
                  x2=${it} y2=${at(o,u).toFixed(1)}
                  stroke="var(--secondary-text-color)" stroke-width="0.8"
                  stroke-dasharray="4,3" opacity="0.55"/>`:G,x=function(e,t){if(!t?.hasEnoughData||null==t.hour)return-1;if(0===e.length)return-1;const i=new Date,n=new Date(i);if(null!=t.weekday){let e=(i.getDay()-t.weekday+7)%7;0===e&&i.getHours()<t.hour&&(e=7),n.setDate(n.getDate()-e)}else i.getHours()<t.hour&&n.setDate(n.getDate()-1);n.setHours(t.hour,0,0,0);const r=n.getTime();let a=1/0,o=-1;for(let t=0;t<e.length;t++){const i=Math.abs(e[t].time-r);i<a&&(a=i,o=t)}return o}(n,e.analysis),w=x>=0&&x<m.length?m[x]:null,$=w?q`
          <line x1=${w.x.toFixed(1)} y1="0"
                x2=${w.x.toFixed(1)} y2=${nt}
                stroke="var(--success-color,#4CAF50)" stroke-width="1"
                stroke-dasharray="3,2" opacity="0.8"/>`:G,k=w?V`<div
          class="sparkline-marker"
          style=${`left:${(w.x/it*100).toFixed(2)}%;top:${(w.y/nt*100).toFixed(2)}%;`}
          aria-hidden="true"
        ></div>`:G,A=n.map((e,t)=>({t:e.time,v:e.value,x:+m[t].x.toFixed(1),y:+m[t].y.toFixed(1)})),S=`spark-grad-${Math.random().toString(36).slice(2,8)}`,C=e.showMedianLine?(()=>{const t=rt(o);if(!t)return G;const i={median_delta_below:e.translations.median_delta_below,median_delta_above:e.translations.median_delta_above,median_delta_equal:e.translations.median_delta_equal}[t.key].replace("{c}",t.cents);return V`
            <span class="median-delta ${t.cls}">${i}</span>
          `})():G,M=[...o].sort((e,t)=>e-t),E=(M.length-1)/2,z=M.length>0?(M[Math.floor(E)]+M[Math.ceil(E)])/2:0,T=(e.showMedianLine?e.translations.sparkline_aria_summary:e.translations.sparkline_aria_simple).replace("{min}",Me(s)).replace("{max}",Me(l)).replace("{median}",Me(z));return{template:V`
      <div class="sparkline-svg-wrap">
      <svg
        class="sparkline"
        viewBox="0 0 ${it} ${nt}"
        preserveAspectRatio="none"
        role="img"
        aria-label=${T}
        data-points=${JSON.stringify(A)}
        data-width=${it}
        data-height=${nt}
      >
        <title>${T}</title>
        <defs>
          <linearGradient id=${S} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.3" />
            <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        ${y}
        ${g}
        <path d=${f} fill="url(#${S})" />
        ${$}
        ${b}
        <path
          d=${_}
          fill="none"
          stroke="var(--primary-color)"
          stroke-width="1.5"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        <line
          class="sparkline-hover-line"
          x1="0" y1="0" x2="0" y2=${nt}
          stroke="var(--primary-text-color)" stroke-width="0.6"
          stroke-dasharray="2,2" opacity="0" pointer-events="none"
        />
      </svg>
      ${k}
      <div class="sparkline-hover-dot" style="opacity:0" aria-hidden="true"></div>
      </div>
      <div class="sparkline-tooltip" hidden>
        <span class="sparkline-tooltip-time"></span>
        <span class="sparkline-tooltip-price"></span>
      </div>
      <div class="sparkline-labels">
        ${e.showMinMax?V`<span>
              <span class="sparkline-minmax-label">${e.translations.min_label}</span>
              ${Me(s)}
            </span>`:G}
        <span class="sparkline-period">
          ${e.translations.last_7_days}${C===G?G:V` · ${C}`}
        </span>
        ${e.showMinMax?V`<span>
              <span class="sparkline-minmax-label">${e.translations.max_label}</span>
              ${Me(l)}
            </span>`:G}
      </div>
    `,hoverPoints:A,medianDelta:v,viewBoxWidth:it,viewBoxHeight:nt}}catch(e){return console.warn("[Tankstellen Austria] sparkline render failed:",e),t}}const st=36e5,lt=864e5,ct=14*lt;function dt(e){const t=new Date(e);t.setHours(0,0,0,0);const i=t.getDay();return t.setDate(t.getDate()-(0===i?6:i-1)),t.getTime()}function ht(e,t){const i=[],n=(e,t,n)=>{for(let r=Math.ceil(t/st)*st;r<n;r+=st)i.push({t:r,price:e})};for(let t=0;t<e.length-1;t++)n(e[t].value,e[t].time,e[t+1].time);const r=e[e.length-1];return n(r.value,r.time,t),i}function pt(e){const t=new Map;for(const i of e){const e=dt(i.t),n=t.get(e);n?n.push(i):t.set(e,[i])}return t}function ut(e,t){const i=e.map(e=>e.length>=t?function(e){if(0===e.length)return NaN;const t=[...e].sort((e,t)=>e.value-t.value),i=t.reduce((e,t)=>e+t.weight,0);let n=0;for(const e of t)if(n+=e.weight,n>=i/2)return e.value;return t[t.length-1].value}(e):NaN);let n=-1,r=1/0;return i.forEach((e,t)=>{!Number.isNaN(e)&&e<r&&(r=e,n=t)}),{medians:i,bestIdx:n,bestVal:r}}function mt(e,t){const i=e.medians.filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t);if(i.length<2||e.bestIdx<0)return 0;return et(100*(tt(i,.5)-e.bestVal)/t,0,1)}const _t=o`
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
    --tankst-rt:      var(--ha-color-success, #4caf50);
    --tankst-warning: var(--ha-color-warning, #ffa000);
    --tankst-error:   var(--ha-color-error,   #db4437);
    --tankst-info:    var(--ha-color-info,    #1565c0);

    /* Spacing / radius / sizing — layered over the HA Design System
       so the card moves with HA when tokens evolve. Hard-coded values
       are the fallback for older HA versions. */
    --tankst-radius-sm: var(--ha-radius-sm, 6px);
    --tankst-radius-md: var(--ha-radius-md, 10px);
    --tankst-radius-lg: var(--ha-card-border-radius, var(--ha-radius-lg, 12px));
    --tankst-pad-x:     var(--ha-spacing-4, 16px);
    --tankst-pad-y:     var(--ha-spacing-3, 14px);
    --tankst-row-gap:   var(--ha-spacing-3, 12px);
    --tankst-tile-size: 40px;
  }
  ha-card {
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
      color var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease),
      box-shadow var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease),
      background-color var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease);
    font-family: inherit;
  }
  .tab:hover {
    color: var(--primary-text-color);
    background: color-mix(in srgb, var(--primary-color) 6%, transparent);
  }
  .tab.active {
    color: var(--primary-color);
    font-weight: var(--ha-font-weight-bold, 600);
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
       background, accent-coloured icon. Replaces the old inline
       fuel-icon and gives the card immediate visual identity. */
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
      background-color var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease),
      color var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease);
    --mdc-icon-size: 20px;
    font-family: inherit;
  }
  .icon-action:hover {
    background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    color: var(--primary-color);
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
    font-weight: var(--ha-font-weight-bold, 600);
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
      filter var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease),
      transform var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease),
      opacity var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease);
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
    transition:
      left var(--ha-transition-duration-fast, 60ms) linear,
      top var(--ha-transition-duration-fast, 60ms) linear,
      opacity var(--ha-transition-duration-fast, 120ms) var(--ha-transition-easing-standard, ease);
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
    font-weight: var(--ha-font-weight-bold, 600);
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
    transition: background-color var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease);
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
    font-weight: var(--ha-font-weight-bold, 600);
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
    font-weight: var(--ha-font-weight-bold, 600);
    font-size: 1.125rem;
    color: var(--primary-text-color);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    flex-shrink: 0;
  }
  /* Map link — circular icon-action sized for touch (40×40). */
  .icon-action.map {
    /* Wrap the existing .icon-action surface to match prior placement. */
  }
  /* Chevron arrow indicating collapsibility. Rotates 180° on
     aria-expanded="true" so the cue follows the WAI-ARIA state without
     a bespoke CSS class — same pattern as wiener-linien-austria. */
  .expander-chevron {
    --mdc-icon-size: 20px;
    color: var(--secondary-text-color);
    transition: transform var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease);
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
`,ft=o`
  :host {
    /* color-scheme enables light-dark() and steers forced-colors palette
       selection. The editor is its own Lit element with its own shadow
       root — CSS custom properties don't bleed across shadow boundaries,
       so the semantic tokens below are duplicated from the cardStyles
       :host. Keep both blocks in sync. See ha-portfolio-design § 4
       "Multi-card integrations — every shadow scope needs the tokens". */
    color-scheme: light dark;
    display: block;

    --tankst-rt:      var(--ha-color-success, #4caf50);
    --tankst-warning: var(--ha-color-warning, #ffa000);
    --tankst-error:   var(--ha-color-error,   #db4437);
    --tankst-info:    var(--ha-color-info,    #1565c0);
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
  .recorder-copy-btn {
    margin-top: 6px;
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
  .recorder-copy-btn ha-icon {
    --mdc-icon-size: 14px;
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
    transition: all var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease);
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
  .pm-custom-row ha-textfield {
    flex: 1;
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
    transition: background var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease);
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
    transition: background var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease), border-color var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease);
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
    transition: all var(--ha-transition-duration-fast, 160ms) var(--ha-transition-easing-standard, ease);
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
`;function gt(e){return"string"!=typeof e?"":/^https?:\/\//i.test(e)?e:""}var yt,vt;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(yt||(yt={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(vt||(vt={}));const bt=(e,t,i,n)=>{n=n||{},i=null==i?{}:i;const r=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return r.detail=i,e.dispatchEvent(r),r};function xt(e){return e.replace(/[<>"'&]/g,"").slice(0,50).trim()}let wt=class extends ce{constructor(){super(...arguments),this._config={type:"tankstellen-austria-card"},this._expandedCarIcon=null,this._pendingRemove=null,this._copiedPulse=!1,this._computeLabel=e=>{const t=`ui.panel.lovelace.editor.card.generic.${e.name}`,i=this.hass?.localize?.(t);if(i)return i;const n=this._et(e.name);return n!==`editor.${e.name}`?n:e.name},this._computeHelper=e=>{const t=`${e.name}_helper`,i=this._et(t);return i===`editor.${t}`?void 0:i},this._onFormChanged=e=>{const t=e.detail.value,i={...this._config,...t};this._config=i,bt(this,"config-changed",{config:i})}}setConfig(e){this._config={...e}}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._copiedTimeout&&(clearTimeout(this._copiedTimeout),this._copiedTimeout=void 0)}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_et(e,t){return Ge(`editor.${e}`,this._ctx(),t)}_ct(e,t){return Ge(`card.${e}`,this._ctx(),t)}_fireChanged(){bt(this,"config-changed",{config:{...this._config}})}_schema(){const e=!1!==this._config.show_history,t=!0===this._config.show_cars,i=!1!==this._config.show_payment_methods,n=this._config.payment_filter??[],r=[{name:"entities",selector:{entity:{domain:"sensor",integration:"tankstellen_austria",multiple:!0}}},{type:"expandable",name:"display",title:this._et("section_display"),flatten:!0,schema:[{name:"max_stations",selector:{number:{min:0,max:5,step:1,mode:"slider"}}},{name:"hide_header",selector:{boolean:{}}},{name:"hide_header_price",selector:{boolean:{}}},{name:"show_index",selector:{boolean:{}}},{name:"show_map_links",selector:{boolean:{}}},{name:"show_opening_hours",selector:{boolean:{}}},{name:"show_payment_methods",selector:{boolean:{}}},{name:"show_history",selector:{boolean:{}}}]}];e&&r.push({type:"expandable",name:"history_options",title:this._et("section_history"),flatten:!0,schema:[{name:"show_median_line",selector:{boolean:{}}},{name:"show_hour_envelope",selector:{boolean:{}}},{name:"show_noon_markers",selector:{boolean:{}}},{name:"show_minmax",selector:{boolean:{}}},{name:"show_best_refuel",selector:{boolean:{}}}]});{const e=[{name:"show_cars",selector:{boolean:{}}}];t&&e.push({name:"show_car_fillup",selector:{boolean:{}}},{name:"show_car_consumption",selector:{boolean:{}}}),r.push({type:"expandable",name:"cars_options",title:this._et("section_cars"),flatten:!0,schema:e})}return i&&n.length>0&&r.push({type:"expandable",name:"payment_options",title:this._et("section_payment_filter"),flatten:!0,schema:[{name:"payment_highlight_mode",selector:{boolean:{}}}]}),r.push({type:"expandable",name:"branding",title:this._et("section_branding"),flatten:!0,schema:[{name:"logo_adapt_to_theme",selector:{boolean:{}}},{name:"hide_attribution",selector:{boolean:{}}}]}),r}render(){if(!this.hass)return V`<div class="editor"></div>`;const e=!1!==this._config.show_history,t=!1!==this._config.show_best_refuel,i=e&&t;return V`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${this._schema()}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._onFormChanged}
        ></ha-form>

        ${i?this._renderRecorderHint():G}
        ${this._renderTabLabelsSection()}
        ${this._renderPaymentChipsSection()}
        ${this._renderCarsRosterSection()}
      </div>
    `}_renderRecorderHint(){const e="recorder:\n  purge_keep_days: 30",t=this._copiedPulse?this._et("copied"):this._et("copy");return V`
      <div class="recorder-hint">
        <div class="recorder-hint-text">${this._et("recorder_hint_intro")}</div>
        <pre class="recorder-snippet"><code>${e}</code></pre>
        <button
          class="recorder-copy-btn"
          type="button"
          aria-label=${this._et("copy_sensor_id")}
          @click=${()=>this._onCopyRecorderSnippet(e)}
        >
          <ha-icon icon="mdi:content-copy" aria-hidden="true"></ha-icon>
          <span class="recorder-copy-label">${t}</span>
        </button>
      </div>
    `}_renderTabLabelsSection(){if(!this.hass)return G;const e=(this._config.entities??[]).map(e=>({eid:e,state:this.hass.states[e]})).filter(e=>!!e.state);if(e.length<2)return G;const t=this._config.tab_labels??{};return V`
      <div class="editor-section">
        <div class="section-header">${this._et("section_tab_labels")}</div>
        ${e.map(({eid:e,state:i})=>{let n=Ze(i.attributes?.fuel_type??"",this._ctx());if(!0===i.attributes?.dynamic_mode){const e=i.attributes.dynamic_tracker_label;e&&(n+=` · ${e}`)}const r="string"==typeof t[e]?t[e]:"",a=`tablbl-${e.replace(/[^a-z0-9_-]/gi,"-")}`;return V`
            <div class="tab-label-row">
              <label class="tab-label-default" for=${a} title=${n}>${n}</label>
              <input
                id=${a}
                class="tab-label-input"
                type="text"
                autocomplete="off"
                maxlength="50"
                placeholder=${n}
                .value=${r}
                @click=${this._stop}
                @pointerdown=${this._stop}
                @keydown=${this._stop}
                @keyup=${this._stop}
                @keypress=${this._stop}
                @change=${t=>this._onTabLabelChange(e,t)}
              />
            </div>
          `})}
        <div class="editor-hint">${this._et("tab_labels_hint")}</div>
      </div>
    `}_collectApiPaymentKeys(){const e=new Set(["cash","debit_card","credit_card"]);if(!this.hass)return e;for(const t of this._config.entities??[]){const i=this.hass.states[t]?.attributes?.stations??[];for(const t of i)for(const i of t.payment_methods?.others??[])e.add(i)}return e}_renderPaymentChipsSection(){if(!(!1!==this._config.show_payment_methods))return G;const e=this._collectApiPaymentKeys(),t=this._config.payment_filter??[],i=new Set(e);for(const e of t)i.add(e);return V`
      <div class="editor-section">
        <div class="section-header">${this._et("section_payment_filter")}</div>
        <div class="pm-filter-chips">
          ${[...i].map(i=>this._renderPaymentChip(i,t,e))}
        </div>
        <div class="pm-custom-row">
          <ha-textfield
            id="pm-custom-input"
            label=${this._et("payment_filter_custom_placeholder")}
            autocomplete="off"
            @keydown=${this._onCustomPmKeydown}
            @keyup=${this._stop}
            @keypress=${this._stop}
          ></ha-textfield>
          <ha-icon-button
            .label=${this._et("payment_filter_add_custom")}
            title=${this._et("payment_filter_add_custom")}
            @click=${this._onAddCustomPm}
          >
            <ha-icon icon="mdi:plus-circle" aria-hidden="true"></ha-icon>
          </ha-icon-button>
        </div>
        <div class="editor-hint">${this._et("payment_filter_custom_hint")}</div>
      </div>
    `}_renderPaymentChip(e,t,i){const n=t.includes(e),r=e===this._pendingRemove,a=!i.has(e),o="cash"===e?this._ct("cash"):"debit_card"===e?this._ct("debit_card"):"credit_card"===e?this._ct("credit_card"):e;return V`
      <button
        class=${ye({"pm-filter-chip":!0,active:n,confirm:r})}
        type="button"
        aria-pressed=${n?"true":"false"}
        @click=${()=>this._togglePaymentChip(e,a)}
      >
        ${r?`✕ ${o}?`:o}
      </button>
    `}_renderCarsRosterSection(){if(!(!0===this._config.show_cars))return G;const e=!1!==this._config.show_car_fillup,t=!1!==this._config.show_car_consumption,i=this._config.cars??[];return V`
      <div class="editor-section">
        <div class="section-header">${this._et("section_cars")}</div>
        ${e||t?G:V`<div class="editor-hint">${this._et("cars_both_off_hint")}</div>`}
        ${i.map((e,t)=>this._renderCarRow(e,t))}
        <button class="car-add-btn" type="button" @click=${this._onAddCar}>
          ${this._et("add_car")}
        </button>
      </div>
    `}_renderCarRow(e,t){const i=this._expandedCarIcon===t,n=e.icon||"mdi:car",r=`tsa-car-icon-picker-${t}`,a=null!=e.tank_size&&(e.tank_size<1||e.tank_size>200),o=null!=e.consumption&&(e.consumption<0||e.consumption>30),s=`tsa-car-tank-err-${t}`,l=`tsa-car-consumption-err-${t}`;return V`
      <div class="car-editor-group">
        <div class="car-editor-row">
          <button
            class=${ye({"car-icon-btn":!0,active:i})}
            type="button"
            aria-label=${this._et("car_choose_icon")}
            aria-expanded=${i?"true":"false"}
            aria-controls=${r}
            title=${this._et("car_choose_icon")}
            @click=${e=>this._onToggleIconPicker(e,t)}
          >
            <ha-icon icon=${n} aria-hidden="true"></ha-icon>
          </button>
          <input
            class="car-input car-name-input"
            type="text"
            autocomplete="off"
            aria-label=${this._et("car_name_placeholder")}
            placeholder=${this._et("car_name_placeholder")}
            .value=${e.name??""}
            @click=${this._stop}
            @pointerdown=${this._stop}
            @keydown=${this._stop}
            @keyup=${this._stop}
            @keypress=${this._stop}
            @change=${e=>this._onCarFieldChange(t,"name",e)}
          />
          <select
            class="car-select"
            aria-label=${this._et("car_fuel_type")}
            @click=${this._stop}
            @pointerdown=${this._stop}
            @change=${e=>this._onCarFieldChange(t,"fuel_type",e)}
          >
            ${["DIE","SUP","GAS"].map(t=>V`
                <option value=${t} ?selected=${e.fuel_type===t}>
                  ${Ze(t,this._ctx())}
                </option>
              `)}
          </select>
          <input
            class="car-input car-tank-input"
            type="number"
            min="1"
            max="200"
            autocomplete="off"
            aria-label=${this._et("car_tank_placeholder")}
            aria-invalid=${a?"true":"false"}
            aria-describedby=${a?s:G}
            placeholder=${this._et("car_tank_placeholder")}
            .value=${null!=e.tank_size?String(e.tank_size):""}
            @click=${this._stop}
            @pointerdown=${this._stop}
            @keydown=${this._stop}
            @keyup=${this._stop}
            @keypress=${this._stop}
            @change=${e=>this._onCarFieldChange(t,"tank_size",e)}
          />
          <input
            class="car-input car-consumption-input"
            type="number"
            min="0"
            max="30"
            step="0.1"
            autocomplete="off"
            aria-label=${this._et("car_consumption_placeholder")}
            aria-invalid=${o?"true":"false"}
            aria-describedby=${o?l:G}
            placeholder=${this._et("car_consumption_placeholder")}
            .value=${null!=e.consumption?String(e.consumption):""}
            @click=${this._stop}
            @pointerdown=${this._stop}
            @keydown=${this._stop}
            @keyup=${this._stop}
            @keypress=${this._stop}
            @change=${e=>this._onCarFieldChange(t,"consumption",e)}
          />
          <button
            class="car-delete-btn"
            type="button"
            aria-label=${this._et("car_delete")}
            title=${this._et("car_delete")}
            @click=${e=>this._onDeleteCar(e,t)}
          >
            <ha-icon icon="mdi:delete-outline" aria-hidden="true"></ha-icon>
          </button>
        </div>
        ${a?V`<ha-alert
              id=${s}
              alert-type="error"
            >${this._et("tank_size_range_error")}</ha-alert>`:G}
        ${o?V`<ha-alert
              id=${l}
              alert-type="error"
            >${this._et("consumption_range_error")}</ha-alert>`:G}
        ${i?V`
              <div id=${r} class="car-icon-picker">
                ${xe.map(e=>V`
                    <button
                      class=${ye({"car-icon-option":!0,active:n===e})}
                      type="button"
                      aria-label=${e.replace("mdi:","")}
                      aria-pressed=${n===e?"true":"false"}
                      title=${e.replace("mdi:","")}
                      @click=${i=>this._onPickCarIcon(i,t,e)}
                    >
                      <ha-icon icon=${e} aria-hidden="true"></ha-icon>
                    </button>
                  `)}
              </div>
            `:G}
      </div>
    `}_stop(e){e.stopPropagation()}async _onCopyRecorderSnippet(e){try{await navigator.clipboard.writeText(e),this._copiedPulse=!0,void 0!==this._copiedTimeout&&clearTimeout(this._copiedTimeout),this._copiedTimeout=window.setTimeout(()=>{this._copiedPulse=!1,this._copiedTimeout=void 0},1500)}catch{}}_onTabLabelChange(e,t){t.stopPropagation();const i=xt(t.target.value),n={...this._config.tab_labels??{}};i?n[e]=i:delete n[e];const r={...this._config};Object.keys(n).length?r.tab_labels=n:delete r.tab_labels,this._config=r,this._fireChanged()}_togglePaymentChip(e,t){const i=[...this._config.payment_filter??[]],n=i.includes(e);if(n&&t)return void(this._pendingRemove===e?(this._pendingRemove=null,this._config={...this._config,payment_filter:i.filter(t=>t!==e)},this._fireChanged()):this._pendingRemove=e);this._pendingRemove=null;const r=n?i.filter(t=>t!==e):[...i,e];this._config={...this._config,payment_filter:r},this._fireChanged()}_onCustomPmKeydown(e){e.stopPropagation(),"Enter"===e.key&&this._onAddCustomPm()}_onAddCustomPm(){const e=this.shadowRoot?.getElementById("pm-custom-input");if(!e)return;const t=xt(String(e.value??""));if(!t)return;this._pendingRemove=null;const i=[...this._config.payment_filter??[]];i.includes(t)||(i.push(t),this._config={...this._config,payment_filter:i},this._fireChanged()),e.value=""}_onToggleIconPicker(e,t){e.stopPropagation(),this._expandedCarIcon=this._expandedCarIcon===t?null:t}_onPickCarIcon(e,t,i){e.stopPropagation();const n=[...this._config.cars??[]];n[t]&&(n[t]={...n[t],icon:i},this._config={...this._config,cars:n},this._expandedCarIcon=null,this._fireChanged())}_onCarFieldChange(e,t,i){i.stopPropagation();const n=i.target.value,r=[...this._config.cars??[]],a=r[e];if(!a)return;const o={...a};if("consumption"===t){const e=n.trim();if(""===e)delete o.consumption;else{const t=parseFloat(e);Number.isFinite(t)&&t>0?o.consumption=Math.round(10*t)/10:delete o.consumption}}else if("tank_size"===t){const e=parseInt(n,10);o.tank_size=Math.max(1,Number.isFinite(e)?e:1)}else if("fuel_type"===t){["DIE","SUP","GAS"].includes(n)&&(o.fuel_type=n)}else o.name=xt(n);r[e]=o,this._config={...this._config,cars:r},this._fireChanged()}_onDeleteCar(e,t){e.stopPropagation();const i=[...this._config.cars??[]];i.splice(t,1),this._config={...this._config,cars:i},this._expandedCarIcon===t?this._expandedCarIcon=null:null!=this._expandedCarIcon&&this._expandedCarIcon>t&&(this._expandedCarIcon=this._expandedCarIcon-1),this._fireChanged()}_onAddCar(e){e.stopPropagation();const t=[...this._config.cars??[]];t.push({name:"",fuel_type:"DIE",tank_size:50,icon:"mdi:car"}),this._config={...this._config,cars:t},this._fireChanged()}static{this.styles=ft}};e([me({attribute:!1})],wt.prototype,"hass",void 0),e([_e()],wt.prototype,"_config",void 0),e([_e()],wt.prototype,"_expandedCarIcon",void 0),e([_e()],wt.prototype,"_pendingRemove",void 0),e([_e()],wt.prototype,"_copiedPulse",void 0),wt=e([he("tankstellen-austria-card-editor")],wt);console.info(`%c  Tankstellen Austria Card  %c  Version ${ve}  `,"color: white; font-weight: bold; background: #DC2026","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"tankstellen-austria-card",name:"Tankstellen Austria",description:"Austrian fuel prices from E-Control with sparklines and best-refuel analytics.",preview:!0,documentationURL:"https://github.com/rolandzeiner/tankstellen-austria"});let $t=class extends ce{constructor(){super(...arguments),this._activeTab=0,this._expandedStations=new Set,this._history={},this._versionMismatch=null,this._lastManualRefresh=0,this._noNewData=!1,this._historyError=!1,this._cooldownTick=0,this._initDone=!1,this._onDismissVersionBanner=()=>{this._versionMismatch=null},this._onVersionReload=async()=>{if(this._versionMismatch)try{sessionStorage.setItem(`tsa-reload-attempted-${this._versionMismatch}`,"1")}catch{}await async function(){try{if("undefined"!=typeof window&&"caches"in window){const e=await caches.keys();await Promise.all(e.map(e=>caches.delete(e)))}}catch{}location.reload()}()}}static getConfigElement(){return document.createElement("tankstellen-austria-card-editor")}static getStubConfig(e){const t=ke(e);return{entities:t.length?[t[0]]:[],max_stations:5,show_index:!0,show_map_links:!0,show_opening_hours:!0,show_payment_methods:!0,show_history:!0,show_minmax:!0,show_best_refuel:!0,payment_filter:[],payment_highlight_mode:!0,show_cars:!1,cars:[]}}setConfig(e){this._config=$e(e)}getCardSize(){return 6}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,min_rows:4}}shouldUpdate(e){if(!this._config)return!1;if(e.has("_config")||e.has("_activeTab")||e.has("_expandedStations")||e.has("_history")||e.has("_historyError")||e.has("_versionMismatch")||e.has("_lastManualRefresh")||e.has("_noNewData")||e.has("_cooldownTick"))return!0;const t=e.get("hass");if(!t)return!0;return this._trackedEntityIds().some(e=>t.states[e]!==this.hass.states[e])}_trackedEntityIds(){return this._config.entities?.length?this._config.entities:ke(this.hass)}_resolveEntities(){if(!this.hass)return[];return this._trackedEntityIds().map(e=>{const t=this.hass.states[e];return t?{entity_id:e,state:t.state,attributes:t.attributes,last_updated:t.last_updated}:null}).filter(e=>null!==e)}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_t(e,t){return Ge(`card.${e}`,this._ctx(),t)}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._historyInterval&&(clearInterval(this._historyInterval),this._historyInterval=void 0),void 0!==this._cooldownInterval&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),this._sparklineCleanup&&(this._sparklineCleanup(),this._sparklineCleanup=void 0),this._initDone=!1}updated(e){!this._initDone&&this.hass&&this._config&&(this._initDone=!0,this._fetchAllHistory(),this._historyInterval=window.setInterval(()=>{this._fetchAllHistory()},18e5),this._checkCardVersion()),this._reattachSparklineHover()}async _fetchAllHistory(){try{const e=this._resolveEntities();await Promise.all(e.map(async e=>{const t=await async function(e,t,i={}){if(!e?.callWS)return[];const n=Qe.get(t);if(n)return n;const r=i.days??28,a=new Date,o=new Date(a.getTime()-24*r*60*60*1e3),s=(async()=>{try{const i=await e.callWS({type:"history/history_during_period",start_time:o.toISOString(),end_time:a.toISOString(),entity_ids:[t],minimal_response:!0,significant_changes_only:!0}),n=(i?.[t]??[]).map(e=>({time:Xe(e),value:parseFloat(String(e.s??e.state??""))})).filter(e=>Number.isFinite(e.value)&&e.time>0);return Je.set(t,n),n}catch(e){return console.warn("[Tankstellen Austria] history fetch failed for",t,"— sparkline and best-refuel will be empty:",e),Je.get(t)??[]}finally{Qe.delete(t)}})();return Qe.set(t,s),s}(this.hass,e.entity_id);this._history={...this._history,[e.entity_id]:t}})),this._historyError=!1}catch(e){console.warn("[Tankstellen Austria] history refresh failed",e),this._historyError=!0}}async _checkCardVersion(){const e=await async function(e,t,i){if(!e?.callWS)return null;try{const n=await e.callWS({type:t});if(n?.version&&n.version!==i)return n.version}catch{}return null}(this.hass,"tankstellen_austria/card_version",ve);e&&(this._versionMismatch=e)}_reattachSparklineHover(){this._sparklineCleanup&&(this._sparklineCleanup(),this._sparklineCleanup=void 0);const e=this.shadowRoot?.querySelector(".sparkline-container[data-entity]");if(!e)return;const t=Ke(this._ctx()),i=We(this._ctx());this._sparklineCleanup=function(e,t){const i=()=>{};try{const i=()=>{const t=e.querySelector("svg.sparkline"),i=e.querySelector(".sparkline-tooltip");if(!t||!i)return null;const n=t.querySelector(".sparkline-hover-line"),r=e.querySelector(".sparkline-hover-dot"),a=i.querySelector(".sparkline-tooltip-time"),o=i.querySelector(".sparkline-tooltip-price");if(!(n&&r&&a&&o))return null;let s;try{s=JSON.parse(t.dataset.points||"[]")}catch{s=[]}return s.length?{svgEl:t,line:n,dot:r,tooltip:i,timeEl:a,priceEl:o,pts:s,vbWidth:Number(t.dataset.width)||280,vbHeight:Number(t.dataset.height)||64}:null},n=n=>{const r=i();if(!r)return;const{svgEl:a,line:o,dot:s,tooltip:l,timeEl:c,priceEl:d,pts:h,vbWidth:p,vbHeight:u}=r,m=a.getBoundingClientRect();if(0===m.width)return;const _=Math.max(0,Math.min(1,(n-m.left)/m.width))*p;let f=h[0],g=Math.abs(f.x-_);for(const e of h){const t=Math.abs(e.x-_);t<g&&(f=e,g=t)}o.setAttribute("x1",String(f.x)),o.setAttribute("x2",String(f.x)),o.setAttribute("opacity","0.5"),s.style.left=f.x/p*100+"%",s.style.top=f.y/u*100+"%",s.style.opacity="1",c.textContent=t.formatTime(f.t),d.textContent=t.formatPrice(f.v),l.hidden=!1;const y=e.getBoundingClientRect(),v=f.x/p*m.width+(m.left-y.left);l.style.left="0px";const b=l.offsetWidth,x=v-b/2,w=Math.max(0,Math.min(y.width-b,x));l.style.left=`${w}px`},r=()=>{const e=i();e&&(e.line.setAttribute("opacity","0"),e.dot.style.opacity="0",e.tooltip.hidden=!0)},a=new AbortController,{signal:o}=a,s=e=>n(e.clientX);return e.addEventListener("pointermove",s,{signal:o}),e.addEventListener("pointerleave",r,{signal:o}),e.addEventListener("pointercancel",r,{signal:o}),()=>{a.abort()}}catch(e){return console.warn("[Tankstellen Austria] sparkline hover setup failed:",e),i}}(e,{formatTime:e=>{const n=new Date(e);return`${t[n.getDay()]?.slice(0,2)??""} ${"de"===i?`${n.getDate()}.${n.getMonth()+1}.`:`${n.getMonth()+1}/${n.getDate()}`} ${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`},formatPrice:Ce})}render(){if(!this.hass||!this._config)return V`
        <ha-card>
          <div class="empty" role="status" aria-live="polite">
            ${this._t("loading")}
          </div>
          ${this._renderFooter(void 0)}
        </ha-card>
      `;const e=this._resolveEntities(),t=this._activeTab>=e.length?0:this._activeTab;if(!e.length)return V`
        <ha-card>
          ${this._renderVersionBanner()}
          <div class="empty">${this._t("no_data")}</div>
          ${this._renderFooter(void 0)}
        </ha-card>
      `;const i=e[t]??e[0],n=i.attributes.attribution;return V`
      <ha-card>
        ${this._renderTabs(e,t)}
        <div class="wrap">
          ${this._renderVersionBanner()}
          ${this._historyError?V`<ha-alert alert-type="warning" role="alert">
                ${this._t("history_fetch_error")}
              </ha-alert>`:G}
          <section
            class="station-section"
            style="--tankst-accent: var(--primary-color);"
          >
            ${this._renderHeader(i)}
            ${this._renderHero(i)}
            ${this._renderSparklineBlock(i)}
            ${this._renderCars(i)}
          </section>
          ${this._renderStationList(i,t)}
        </div>
        ${this._renderFooter(n)}
      </ha-card>
    `}_renderFooter(e){if(!0===this._config?.hide_attribution)return G;const t=!0===this._config?.logo_adapt_to_theme,i=Boolean(this.hass?.themes?.darkMode),n=t?"brand-logo adaptive "+(i?"adaptive-dark":"adaptive-light"):"brand-logo",r=e&&e.includes("E-Control")?e:"Datenquelle: E-Control";return V`
      <div class="footer">
        <a
          class="brand-link"
          href=${gt("https://www.e-control.at/")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="E-Control"
          @click=${e=>e.stopPropagation()}
        >
          <img
            class=${n}
            src=${"/tankstellen-austria/e-control_logo.svg"}
            alt="E-Control"
          />
        </a>
        <span class="attribution-text">${r}</span>
      </div>
    `}_renderVersionBanner(){const e=null!==this._versionMismatch&&"undefined"!=typeof sessionStorage&&"1"===sessionStorage.getItem(`tsa-reload-attempted-${this._versionMismatch}`);return function(e){if(!e.mismatchVersion)return G;if(e.stuck)return V`
      <div class="version-notice" role="alert" aria-live="assertive">
        <span>${e.t("version_reload_stuck")}</span>
        <button
          class="version-reload-btn"
          type="button"
          @click=${e.onDismiss}
        >
          ${e.t("version_dismiss")}
        </button>
      </div>
    `;const t=e.t("version_update",{v:e.mismatchVersion});return V`
    <div class="version-notice" role="alert" aria-live="assertive">
      <span>${t}</span>
      <button
        class="version-reload-btn"
        type="button"
        @click=${e.onReload}
      >
        ${e.t("version_reload")}
      </button>
    </div>
  `}({mismatchVersion:this._versionMismatch,stuck:e,t:(e,t)=>this._t(e,t),onReload:this._onVersionReload,onDismiss:this._onDismissVersionBanner})}_renderTabs(e,t){if(e.length<=1)return G;const i=this._config.tab_labels??{};return V`
      <div class="tabs" role="tablist">
        ${e.map((n,r)=>{const a=i[n.entity_id];let o;if("string"==typeof a&&a.trim().length>0)o=a;else{if(o=Ze(n.attributes.fuel_type??"",this._ctx()),!0===n.attributes.dynamic_mode){const e=n.attributes.dynamic_tracker_label;e&&(o+=` · ${e}`)}}const s=r===t;return V`
            <button
              type="button"
              role="tab"
              class=${ye({tab:!0,active:s})}
              aria-selected=${s?"true":"false"}
              tabindex=${s?"0":"-1"}
              @click=${()=>this._onTabClick(r)}
              @keydown=${t=>this._onTabKeydown(t,r,e.length)}
            >
              ${o}
            </button>
          `})}
      </div>
    `}_renderHeader(e){if(!0===this._config?.hide_header)return G;const t=e.attributes.fuel_type??"",i=e.attributes.fuel_type_name||Ze(t,this._ctx()),n=!0===e.attributes.dynamic_mode;let r=null;return n&&(r=e.attributes.dynamic_tracker_label??null),V`
      <header class="header">
        <div class="icon-tile" aria-hidden="true">
          <ha-icon icon="mdi:gas-station"></ha-icon>
        </div>
        <div class="header-text">
          <h2 class="title">${i}</h2>
          ${r?V`<p class="subtitle">${r}</p>`:G}
        </div>
        ${n?V`
              <div class="header-actions">
                ${this._renderRefreshButton()}
                ${this._renderDynamicChips(e)}
              </div>
            `:G}
      </header>
    `}_renderDynamicChips(e){const t=!!e.last_updated;return t||this._noNewData?V`
      <div class="chip-row" aria-live="polite">
        ${t?V`<span class="chip muted">
              <ha-icon icon="mdi:clock-outline" aria-hidden="true"></ha-icon>
              <ha-relative-time
                .hass=${this.hass}
                .datetime=${new Date(e.last_updated)}
              ></ha-relative-time>
            </span>`:G}
        ${this._noNewData?V`<span class="chip warn" role="status">
              <ha-icon icon="mdi:alert-circle-outline" aria-hidden="true"></ha-icon>
              ${this._t("no_new_data")}
            </span>`:G}
      </div>
    `:G}_renderRefreshButton(){const e=be-(Date.now()-this._lastManualRefresh),t=e>0,i=t?(()=>{const t=Math.ceil(e/1e3);return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`})():"";return V`
      <button
        class=${ye({"btn-primary":!0,cooling:t})}
        type="button"
        aria-label=${this._t("refresh")}
        aria-disabled=${t?"true":"false"}
        @click=${this._onRefresh}
      >
        <ha-icon icon="mdi:refresh" aria-hidden="true"></ha-icon>
        <span>${t?i:this._t("refresh")}</span>
      </button>
    `}_renderHero(e){const t=e.attributes.stations??[];if(!t.length)return G;const i=!0===e.attributes.dynamic_mode,n=t[0]?.price,r=e.attributes.average_price;return i||!0===this._config.hide_header_price||null==n?G:V`
      <div class="hero">
        <div class="metric">
          <div class="metric-value">
            <span class="metric-num">${Ce(n)}</span>
            ${null!=r?V`<span class="metric-of"
                  >/ ${Ce(r)} ${this._t("average")}</span
                >`:G}
          </div>
          <div class="metric-label">${this._t("cheapest")}</div>
        </div>
      </div>
    `}_renderSparklineBlock(e){return!0===e.attributes.dynamic_mode||!1===this._config.show_history?G:this._renderSparkline(e)}_renderSparkline(e){const t=e.entity_id,i=this._history[t]??[];if(i.length<2)return G;const n=!0===this._config.show_median_line,r=!0===this._config.show_hour_envelope,a=!0===this._config.show_noon_markers,o=!1!==this._config.show_minmax,s=r?function(e){if(!e||e.length<2)return null;const t=Date.now();if(t-e[0].time<7*lt)return null;const i=ht(e,t);if(0===i.length)return null;const n=pt(i),r=Array.from({length:24},()=>[]);for(const e of n.values()){if(e.length<24)continue;const t=e.map(e=>e.price).sort((e,t)=>e-t),i=tt(t,.05),n=tt(t,.95);for(const t of e){const e=et(t.price,i,n);r[new Date(t.t).getHours()].push(e)}}const a=new Array(24).fill(null),o=new Array(24).fill(null);let s=0;for(let e=0;e<24;e++){const t=r[e];if(t.length<3)continue;const i=[...t].sort((e,t)=>e-t);a[e]=tt(i,.1),o[e]=tt(i,.9),s++}return s<6?null:{minByHour:a,maxByHour:o}}(i):null,l=!1!==this._config.show_best_refuel?function(e){if(!e||e.length<2)return null;const t=Date.now(),i=t-e[0].time;if(i<7*lt)return{hasEnoughData:!1};const n=ht(e,t);if(0===n.length)return{hasEnoughData:!1};const r=pt(n),a=[];for(const e of r.values()){if(e.length<24)continue;const i=e.map(e=>e.price).sort((e,t)=>e-t),n=tt(i,.05),r=tt(i,.95);let o=0;const s=e.map(e=>{const t=et(e.price,n,r);return o+=t,{t:e.t,price:t}}),l=o/s.length;for(const{t:e,price:i}of s)a.push({t:e,delta:i-l,weight:Math.pow(.5,(t-e)/ct)})}if(0===a.length)return{hasEnoughData:!1};const o=Array.from({length:24},()=>[]),s=Array.from({length:7},()=>[]);for(const{t:e,delta:t,weight:i}of a){const n=new Date(e);o[n.getHours()].push({value:t,weight:i}),s[n.getDay()].push({value:t,weight:i})}const l=ut(o,3);if(l.bestIdx<0)return{hasEnoughData:!1};const c=ut(s,3),d=i/lt,h=Math.min(1,d/28),p=o.filter(e=>e.length>=3).length/24,u=mt(l,1.5),m=l.medians.filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t),_=m.length>=2?100*(tt(m,.5)-l.bestVal):0,f=(h+p+u)/3,g=f>=.75?"high":f>=.5?"medium":"low",y=s.filter(e=>e.length>=3).length/7,v=mt(c,.8),b=(c.bestIdx>=0?(h+y+v)/3:0)>=.75;return{hasEnoughData:!0,hour:l.bestIdx,weekday:b?c.bestIdx:null,confidence:{level:g,score:f,span_days:Math.round(d),coverage_pct:Math.round(100*p),gap_cents:Math.round(10*_)/10}}}(i):null,c=ot({points:i,showMedianLine:n,showHourEnvelope:r,showNoonMarkers:a,showMinMax:o,hourEnvelope:s,analysis:l,translations:{min_label:this._t("min_label"),max_label:this._t("max_label"),last_7_days:this._t("last_7_days"),median_delta_below:this._t("median_delta_below"),median_delta_above:this._t("median_delta_above"),median_delta_equal:this._t("median_delta_equal"),sparkline_aria_summary:this._t("sparkline_aria_summary"),sparkline_aria_simple:this._t("sparkline_aria_simple")}});return c.template===G?G:V`
      <div
        class="sparkline-container"
        data-entity=${t}
        role="button"
        tabindex="0"
        aria-label=${this._t("sparkline_open_more_info")}
        @click=${()=>this._onSparklineClick(t)}
        @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._onSparklineClick(t))}}
      >
        ${c.template}
        ${this._renderRecommendation(l)}
      </div>
    `}_renderRecommendation(e){if(!e)return G;if(!e.hasEnoughData)return V`
        <div class="refuel-hint">
          <ha-icon icon="mdi:information-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
          ${this._t("not_enough_data_hint")}
        </div>
      `;const t=e.hour??0,i=String(t).padStart(2,"0"),n=String((t+1)%24).padStart(2,"0");let r;if(null!=e.weekday){const t=Ke(this._ctx())[e.weekday]??"";r=this._t("best_refuel_hour_weekday",{h1:i,h2:n,day:t})}else r=this._t("best_refuel_hour",{h1:i,h2:n});const a=e.confidence;if(!a)return V`
        <div class="refuel-recommendation">
          <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
          <span class="refuel-text">${r}</span>
        </div>
      `;const o=this._t(`confidence_${a.level}`),s=[`${this._t("confidence_title")}: ${o}`,`• ${this._t("confidence_span")}: ${a.span_days} ${this._t("confidence_days")}`,`• ${this._t("confidence_coverage")}: ${a.coverage_pct}%`,`• ${this._t("confidence_gap")}: ${a.gap_cents.toFixed(1)} ${this._t("confidence_cents")}`];a.span_days<14&&s.push("",this._t("confidence_short_history_hint"));const l=function(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(s.join("\n")),c=`refuel-confidence refuel-confidence-${a.level}`,d=[`${this._t("confidence_title")}: ${o}`,`${this._t("confidence_span")}: ${a.span_days} ${this._t("confidence_days")}`,`${this._t("confidence_coverage")}: ${a.coverage_pct}%`,`${this._t("confidence_gap")}: ${a.gap_cents.toFixed(1)} ${this._t("confidence_cents")}`].join(". ");return V`
      <div class="refuel-recommendation">
        <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
        <span class="refuel-text">${r}</span>
        <span
          class=${c}
          title=${l}
          aria-label=${d}
        >${o}</span>
      </div>
    `}_renderCars(e){const t=e.attributes.stations??[];if(!t.length)return G;const i=!0===this._config.show_cars,n=!1!==this._config.show_car_fillup,r=!1!==this._config.show_car_consumption;if(!i||!n&&!r)return G;const a=e.attributes.fuel_type??"",o=this._config.payment_filter??[],s=!0===this._config.payment_highlight_mode,l=(this._config.cars??[]).filter(e=>e.fuel_type===a&&e.tank_size>0&&e.name),c=n?l:l.filter(e=>Number(e.consumption)>0);if(!c.length)return G;const d=s?t:t.filter(e=>Se(e,o)),h=s?t[0]?.price:d[0]?.price;return V`
      <div class="cars-fillup">
        ${c.map(e=>this._renderCarRow(e,h,n,r))}
      </div>
    `}_renderCarRow(e,t,i,n){const r=Number(e.consumption),a=Number.isFinite(r)&&r>0?r.toFixed(1).replace(".",","):"";if(i){const i=null!=t?`€ ${(t*Number(e.tank_size)).toFixed(2).replace(".",",")}`:"–",o=null!=t&&r>0?`€ ${(t*r).toFixed(2).replace(".",",")}`:"–";return V`
        <div class="car-fillup-row">
          <span class="car-fillup-name">
            <ha-icon icon=${e.icon||"mdi:car"} class="car-icon" aria-hidden="true"></ha-icon>
            ${e.name}
            <span class="car-fillup-liters">${e.tank_size} L</span>
          </span>
          <span class="car-fillup-cost">${i}</span>
        </div>
        ${n&&r>0?V`
              <div class="car-per100-row">
                <span class="car-per100-label">${a} l/100 km</span>
                <span class="car-per100-cost">${o} / 100 km</span>
              </div>
            `:G}
      `}const o=null!=t?`€ ${(t*r).toFixed(2).replace(".",",")}`:"–";return V`
      <div class="car-fillup-row">
        <span class="car-fillup-name">
          <ha-icon icon=${e.icon||"mdi:car"} class="car-icon" aria-hidden="true"></ha-icon>
          ${e.name}
          <span class="car-fillup-liters">${a} l/100 km</span>
        </span>
        <span class="car-fillup-cost">${o} / 100 km</span>
      </div>
    `}_renderStationList(e,t){const i=e.attributes.stations??[],n=parseInt(String(this._config.max_stations),10),r=Number.isFinite(n)?Math.max(0,Math.min(5,n)):5,a=this._config.payment_filter??[],o=!0===this._config.payment_highlight_mode,s=o?i:i.filter(e=>Se(e,a));if(0===r)return G;if(!s.length&&a.length&&i.length)return V`
        <div class="empty">
          ${this._t("payment_filter_active")} — ${this._t("no_data")}
        </div>
      `;if(!s.length)return V`<div class="empty">${this._t("no_data")}</div>`;const l=s.slice(0,r);return V`
      <div class="stations">
        ${l.map((e,i)=>this._renderStation(e,i,t,a,o))}
      </div>
    `}_renderStation(e,t,i,n,r){const a=!1!==this._config.show_index,o=!1!==this._config.show_map_links,s=!1!==this._config.show_opening_hours,l=!1!==this._config.show_payment_methods,c=e.location??{},d=`${i}-${t}`,h=this._expandedStations.has(d),p=!1===e.open,u=!p&&function(e,t=new Date){if(!1===e.open)return!1;const i=e.opening_hours??[];if(!i.length)return!1;const n=t.getDay(),r=0===n?"SO":6===n?"SA":"MO",a=i.find(e=>e.day===r);if(!a||!a.to)return!1;if("00:00"===a.from&&"24:00"===a.to)return!1;const[o,s]=a.to.split(":");if(void 0===o||void 0===s)return!1;const l=parseInt(o,10),c=parseInt(s,10);if(!Number.isFinite(l)||!Number.isFinite(c))return!1;const d=new Date(t);0===l&&0===c?(d.setDate(d.getDate()+1),d.setHours(0,0,0,0)):d.setHours(l,c,0,0);const h=(d.getTime()-t.getTime())/6e4;return h>0&&h<=30}(e),m=r&&n.length>0&&Se(e,n),_=m?function(e,t,i){if(!t||!t.length)return[];const n=e.payment_methods??{},r=[];for(const e of t){const t=Ae(n,e,i);null!==t&&r.push(t)}return r}(e,n,{cash:this._t("cash"),debit_card:this._t("debit_card"),credit_card:this._t("credit_card")}):[],f=s&&!!e.opening_hours?.length,g=l&&(!!(y=e.payment_methods)&&Boolean(y.cash||y.debit_card||y.credit_card||y.others&&y.others.length>0));var y;const v=f||g,b=[e.name||"–",c.city??"",Ce(e.price)].filter(Boolean).join(", "),x=v?`tsa-station-detail-${i}-${t}`:void 0,w=!!e.name,$=c.city??"",k=c.address??"";return V`
      <div class=${ye({station:!0,"pm-highlight":m})}>
        <div
          class="station-main"
          role=${v?"button":"group"}
          tabindex=${v?"0":"-1"}
          aria-expanded=${v?h?"true":"false":G}
          aria-controls=${x??G}
          aria-label=${b}
          @click=${()=>this._onStationClick(d)}
          @keydown=${e=>this._onStationKeydown(e,d,v)}
        >
          ${a?V`<div class="index-tile" aria-hidden="true">${t+1}</div>`:G}
          <div class="info">
            <div class="name">
              ${w?V`<span lang="de">${e.name}</span>`:"–"}
              ${p?V`<span class="flag closed">${this._t("closed")}</span>`:u?V`<span class="flag closing-soon"
                      >${this._t("closing_soon")}</span
                    >`:G}
              ${_.map(e=>V`<span class="chip match">${e}</span>`)}
            </div>
            <div class="address">
              ${c.postalCode??""}${$?V` <span lang="de">${$}</span>`:G},
              ${k?V`<span lang="de">${k}</span>`:G}
            </div>
          </div>
          <div class="price">${Ce(e.price)}</div>
          ${(()=>{if(!o)return G;const t=gt(function(e,t){if(!e)return t?`https://www.google.com/search?q=${encodeURIComponent(t)}`:null;if(/\d/.test(e.address??"")){const t=`${e.postalCode??""} ${e.city??""} ${e.address??""}`.trim();return`https://maps.google.com/?q=${encodeURIComponent(t)}`}const i=[t,e.address,e.postalCode,e.city].filter(e=>null!=e&&""!==e);return 0===i.length?null:`https://www.google.com/search?q=${encodeURIComponent(i.join(" "))}`}(c,e.name??""));return t?V`
              <a
                class="icon-action map"
                href=${t}
                target="_blank"
                rel="noopener noreferrer"
                aria-label=${`${this._t("map")}: ${e.name??""}`}
                title=${this._t("map")}
                @click=${this._onMapLinkClick}
              >
                <ha-icon
                  icon=${/\d/.test(c.address??"")?"mdi:map-marker":"mdi:magnify"}
                  aria-hidden="true"
                ></ha-icon>
              </a>
            `:G})()}
          ${v?V`<ha-icon
                class="expander-chevron"
                icon="mdi:chevron-down"
                aria-hidden="true"
              ></ha-icon>`:G}
        </div>
        ${v?V`
              <div
                id=${x}
                class=${ye({"station-detail":!0,expanded:h})}
              >
                <div class="detail-cols">
                  ${f?V`<div class="detail-col">${this._renderHours(e.opening_hours??[])}</div>`:G}
                  ${g?V`<div class="detail-col">${this._renderPaymentMethods(e.payment_methods)}</div>`:G}
                </div>
              </div>
            `:G}
      </div>
    `}_renderHours(e){const t=e.find(e=>"MO"===e.day)??e[0],i=e.find(e=>"SA"===e.day)??e[5],n=e.find(e=>"SO"===e.day)??e[6],r=e.find(e=>"FE"===e.day);return V`
      <div class="hours-grid">
        ${t?V`<span class="day">${this._t("mon_fri")}</span><span>${t.from} – ${t.to}</span>`:G}
        ${i?V`<span class="day">${this._t("sat")}</span><span>${i.from} – ${i.to}</span>`:G}
        ${n?V`<span class="day">${this._t("sun")}</span><span>${n.from} – ${n.to}</span>`:G}
        ${r?V`<span class="day">${this._t("holiday")}</span><span>${r.from} – ${r.to}</span>`:G}
      </div>
    `}_renderPaymentMethods(e){if(!e)return G;const t=[];e.cash&&t.push(V`
        <span class="pm-badge">
          <ha-icon icon="mdi:cash" class="pm-icon" aria-hidden="true"></ha-icon>
          ${this._t("cash")}
        </span>
      `),e.debit_card&&t.push(V`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon" aria-hidden="true"></ha-icon>
          ${this._t("debit_card")}
        </span>
      `),e.credit_card&&t.push(V`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon" aria-hidden="true"></ha-icon>
          ${this._t("credit_card")}
        </span>
      `);for(const i of e.others??[])t.push(V`<span class="pm-badge pm-other">${i}</span>`);return t.length?V`
      <div class="pm-section">
        <div class="pm-label">${this._t("payment")}</div>
        <div class="pm-badges">${t}</div>
      </div>
    `:G}_onTabClick(e){this._activeTab!==e&&(this._activeTab=e,this._expandedStations=new Set)}_onTabKeydown(e,t,i){let n=t;switch(e.key){case"ArrowRight":n=(t+1)%i;break;case"ArrowLeft":n=(t-1+i)%i;break;case"Home":n=0;break;case"End":n=i-1;break;default:return}e.preventDefault(),this._onTabClick(n),this.updateComplete.then(()=>{const e=this.shadowRoot?.querySelectorAll('.tabs [role="tab"]');e?.[n]?.focus()})}_onStationClick(e){const t=new Set(this._expandedStations);t.has(e)?t.delete(e):t.add(e),this._expandedStations=t}_onStationKeydown(e,t,i){i&&("Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._onStationClick(t)))}_onMapLinkClick(e){e.stopPropagation()}_onSparklineClick(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_onRefresh(){if(!this.hass)return;const e=Date.now();if(e-this._lastManualRefresh<be)return;this._lastManualRefresh=e,this._noNewData=!1;const t=this._resolveEntities(),i=t[this._activeTab]??t[0],n=i?.last_updated;for(const e of t){const t=this.hass.callService("homeassistant","update_entity",{entity_id:e.entity_id});t&&"function"==typeof t.catch&&t.catch(t=>{console.warn("[Tankstellen Austria] update_entity failed for",e.entity_id,t)})}window.setTimeout(()=>{try{const e=this._resolveEntities(),t=e[this._activeTab]??e[0];t?.last_updated===n&&(this._noNewData=!0)}catch(e){console.warn("[Tankstellen Austria] post-refresh check failed",e)}},3e3),void 0!==this._cooldownInterval&&clearInterval(this._cooldownInterval);"undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches?window.setTimeout(()=>{this._cooldownTick=(this._cooldownTick+1)%1e6},be):this._cooldownInterval=window.setInterval(()=>{Date.now()-this._lastManualRefresh>=be&&void 0!==this._cooldownInterval&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),this._cooldownTick=(this._cooldownTick+1)%1e6},1e3)}static{this.styles=_t}};e([me({attribute:!1})],$t.prototype,"hass",void 0),e([_e()],$t.prototype,"_config",void 0),e([_e()],$t.prototype,"_activeTab",void 0),e([_e()],$t.prototype,"_expandedStations",void 0),e([_e()],$t.prototype,"_history",void 0),e([_e()],$t.prototype,"_versionMismatch",void 0),e([_e()],$t.prototype,"_lastManualRefresh",void 0),e([_e()],$t.prototype,"_noNewData",void 0),e([_e()],$t.prototype,"_historyError",void 0),e([_e()],$t.prototype,"_cooldownTick",void 0),$t=e([he("tankstellen-austria-card")],$t);export{$t as TankstellenAustriaCard};
