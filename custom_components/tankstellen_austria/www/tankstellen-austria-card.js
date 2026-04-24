// Tankstellen Austria Card — bundled by Rollup. Edit sources in src/, then `npm run build`.
function e(e,t,i,n){var r,s=arguments.length,o=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(o=(s<3?r(o):s>3?r(t,i,o):r(t,i))||o);return s>3&&o&&Object.defineProperty(t,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap;let s=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(t,e))}return e}toString(){return this.cssText}};const o=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new s(i,e,n)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,f=_.trustedTypes,m=f?f.emptyScript:"",g=_.reactiveElementPolyfillSupport,y=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&c(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:r}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const s=n?.call(this);r?.call(this,t),this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,n)=>{if(i)e.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of n){const n=document.createElement("style"),r=t.litNonce;void 0!==r&&n.setAttribute("nonce",r),n.textContent=i.cssText,e.appendChild(n)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=n;const s=r.fromAttribute(t,e.type);this[n]=s??this._$Ej?.get(n)??s,this._$Em=null}}requestUpdate(e,t,i,n=!1,r){if(void 0!==e){const s=this.constructor;if(!1===n&&(r=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??b)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:r},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==r||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[y("elementProperties")]=new Map,x[y("finalized")]=new Map,g?.({ReactiveElement:x}),(_.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=e=>e,S=w.trustedTypes,A=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+E,M=`<${T}>`,z=document,P=()=>z.createComment(""),D=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,I="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,F=/>/g,L=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),O=/'/g,U=/"/g,B=/^(?:script|style|textarea|title)$/i,j=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),V=j(1),q=j(2),W=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),G=new WeakMap,Z=z.createTreeWalker(z,129);function J(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const X=(e,t)=>{const i=e.length-1,n=[];let r,s=2===t?"<svg>":3===t?"<math>":"",o=R;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,d=0;for(;d<i.length&&(o.lastIndex=d,l=o.exec(i),null!==l);)d=o.lastIndex,o===R?"!--"===l[1]?o=H:void 0!==l[1]?o=F:void 0!==l[2]?(B.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=L):void 0!==l[3]&&(o=L):o===L?">"===l[0]?(o=r??R,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?L:'"'===l[3]?U:O):o===U||o===O?o=L:o===H||o===F?o=R:(o=L,r=void 0);const h=o===L&&e[t+1].startsWith("/>")?" ":"";s+=o===R?i+M:c>=0?(n.push(a),i.slice(0,c)+C+i.slice(c)+E+h):i+E+(-2===c?t:h)}return[J(e,s+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class Q{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let r=0,s=0;const o=e.length-1,a=this.parts,[l,c]=X(e,t);if(this.el=Q.createElement(l,i),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=Z.nextNode())&&a.length<o;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(C)){const t=c[s++],i=n.getAttribute(e).split(E),o=/([.?@])?(.*)/.exec(t);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?ne:"?"===o[1]?re:"@"===o[1]?se:ie}),n.removeAttribute(e)}else e.startsWith(E)&&(a.push({type:6,index:r}),n.removeAttribute(e));if(B.test(n.tagName)){const e=n.textContent.split(E),t=e.length-1;if(t>0){n.textContent=S?S.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],P()),Z.nextNode(),a.push({type:2,index:++r});n.append(e[t],P())}}}else if(8===n.nodeType)if(n.data===T)a.push({type:2,index:r});else{let e=-1;for(;-1!==(e=n.data.indexOf(E,e+1));)a.push({type:7,index:r}),e+=E.length-1}r++}}static createElement(e,t){const i=z.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,n){if(t===W)return t;let r=void 0!==n?i._$Co?.[n]:i._$Cl;const s=D(t)?void 0:t._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),void 0===s?r=void 0:(r=new s(e),r._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=r:i._$Cl=r),void 0!==r&&(t=Y(e,r._$AS(e,t.values),r,n)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??z).importNode(t,!0);Z.currentNode=n;let r=Z.nextNode(),s=0,o=0,a=i[0];for(;void 0!==a;){if(s===a.index){let t;2===a.type?t=new te(r,r.nextSibling,this,e):1===a.type?t=new a.ctor(r,a.name,a.strings,this,e):6===a.type&&(t=new oe(r,this,e)),this._$AV.push(t),a=i[++o]}s!==a?.index&&(r=Z.nextNode(),s++)}return Z.currentNode=z,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),D(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&D(this._$AH)?this._$AA.nextSibling.data=e:this.T(z.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Q.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new ee(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new Q(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const r of e)n===t.length?t.push(i=new te(this.O(P()),this.O(P()),this,this.options)):i=t[n],i._$AI(r),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,r){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(e,t=this,i,n){const r=this.strings;let s=!1;if(void 0===r)e=Y(this,e,t,0),s=!D(e)||e!==this._$AH&&e!==W,s&&(this._$AH=e);else{const n=e;let o,a;for(e=r[0],o=0;o<r.length-1;o++)a=Y(this,n[i+o],t,o),a===W&&(a=this._$AH[o]),s||=!D(a)||a!==this._$AH[o],a===K?e=K:e!==K&&(e+=(a??"")+r[o+1]),this._$AH[o]=a}s&&!n&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ne extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}}class re extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}}class se extends ie{constructor(e,t,i,n,r){super(e,t,i,n,r),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??K)===W)return;const i=this._$AH,n=e===K&&i!==K||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==K&&(i===K||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const ae=w.litHtmlPolyfillSupport;ae?.(Q,te),(w.litHtmlVersions??=[]).push("3.3.2");const le=globalThis;let ce=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let r=n._$litPart$;if(void 0===r){const e=i?.renderBefore??null;n._$litPart$=r=new te(t.insertBefore(P(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const he=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},pe={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},ue=(e=pe,t,i)=>{const{kind:n,metadata:r}=i;let s=globalThis.litPropertyMetadata.get(r);if(void 0===s&&globalThis.litPropertyMetadata.set(r,s=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),s.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const r=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,r,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const r=this[n];t.call(this,i),this.requestUpdate(n,r,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function _e(e){return(t,i)=>"object"==typeof i?ue(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function fe(e){return _e({...e,state:!0,attribute:!1})}const me=1;class ge{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const ye=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends ge{constructor(e){if(super(e),e.type!==me||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const i=e.element.classList;for(const e of this.st)e in t||(i.remove(e),this.st.delete(e));for(const e in t){const n=!!t[e];n===this.st.has(e)||this.nt?.has(e)||(n?(i.add(e),this.st.add(e)):(i.remove(e),this.st.delete(e)))}return W}}),ve="1.7.0",be=12e4,$e=["mdi:car","mdi:car-sports","mdi:car-hatchback","mdi:car-estate","mdi:car-convertible","mdi:car-pickup","mdi:car-electric","mdi:car-electric-outline","mdi:car-side","mdi:van-passenger","mdi:motorbike","mdi:bus","mdi:truck","mdi:rv-truck"],xe=["DIE","SUP","GAS"];function we(e){if(!e)throw new Error("tankstellen-austria-card: config missing");const t={...e};if("string"==typeof t.entities&&(t.entities=[t.entities]),Array.isArray(t.entities)?t.entities=t.entities.filter(e=>"string"==typeof e&&e.includes(".")):null!=t.entities&&(console.warn("[Tankstellen Austria] config.entities must be an array of entity IDs — ignoring",t.entities),delete t.entities),null!=t.max_stations){const e=parseInt(String(t.max_stations),10);t.max_stations=Number.isFinite(e)?Math.max(0,Math.min(5,e)):5}return Array.isArray(t.payment_filter)?t.payment_filter=t.payment_filter.filter(e=>"string"==typeof e&&e.length>0):null!=t.payment_filter&&delete t.payment_filter,Array.isArray(t.cars)?t.cars=t.cars.map(e=>function(e){if(!e||"object"!=typeof e)return null;const t=e,i="string"==typeof t.name?t.name.slice(0,50):"",n=xe.includes(t.fuel_type)?t.fuel_type:"DIE",r=parseInt(String(t.tank_size),10),s=Number.isFinite(r)&&r>=1?Math.min(200,r):50;let o;if(null!=t.consumption){const e=parseFloat(String(t.consumption));Number.isFinite(e)&&e>=0&&(o=Math.min(30,e))}const a={name:i,fuel_type:n,tank_size:s,icon:"string"==typeof t.icon&&t.icon.startsWith("mdi:")?t.icon:"mdi:car"};return null!=o&&(a.consumption=o),a}(e)).filter(e=>null!==e):null!=t.cars&&delete t.cars,t}function ke(e){return e&&e.states?Object.keys(e.states).filter(t=>{const i=e.states[t];return t.startsWith("sensor.")&&i?.attributes?.fuel_type&&Array.isArray(i.attributes.stations)}):[]}function Se(e,t){if(!t||!t.length)return!0;const i=e.payment_methods??{};return t.some(e=>"cash"===e?Boolean(i.cash):"debit_card"===e?Boolean(i.debit_card):"credit_card"===e?Boolean(i.credit_card):(i.others??[]).some(t=>t.toLowerCase()===e.toLowerCase()))}function Ae(e){return null!=e&&Number.isFinite(Number(e))?`€ ${Number(e).toFixed(3).replace(".",",")}`:"–"}function Ce(e){return null!=e&&Number.isFinite(Number(e))?Number(e).toFixed(3).replace(".",","):"–"}var Ee={version:"Version",invalid_configuration:"Invalid configuration",loading:"Loading…",no_data:"No data available"},Te={cheapest:"Cheapest price",average:"Avg. price",price:"Price",closed:"Closed",closing_soon:"Closing soon",open_now:"Open",opening_hours:"Opening hours",payment:"Payment",cash:"Cash",debit_card:"Debit card",credit_card:"Credit card",payment_filter_active:"Payment filter active",payment_highlight_active:"Payment filter (highlight)",mon_fri:"Mon–Fri",sat:"Sat",sun:"Sun",holiday:"Holiday",map:"Map",per_liter:"/l",last_7_days:"Last 7 days",min_label:"Min",max_label:"Max",refresh:"Refresh",last_updated:"Updated:",no_new_data:"No new data",version_update:"Tankstellen Austria updated to v{v} — please reload",version_reload:"Reload",version_reload_stuck:"Reload didn't load the new version. Check HACS and do a hard refresh (Ctrl+Shift+R).",version_dismiss:"Dismiss",fill_up:"Fill up",best_refuel_hour:"Tip: Cheapest between {h1}:00–{h2}:00",best_refuel_hour_weekday:"Tip: Cheapest between {h1}:00–{h2}:00, usually {day}",not_enough_data_hint:"Not enough data yet for a tip (min. 7 days)",confidence_high:"High",confidence_medium:"Medium",confidence_low:"Low",confidence_title:"Recommendation confidence",confidence_span:"Data span",confidence_coverage:"Coverage",confidence_gap:"Gap",confidence_days:"days",confidence_cents:"¢",confidence_short_history_hint:"Note: Home Assistant keeps only 10 days of history by default. For better recommendations raise recorder.purge_keep_days to 30.",median_delta_below:"{c}¢ below median",median_delta_above:"{c}¢ above median",median_delta_equal:"at median",loading:"Loading…",sparkline_open_more_info:"Open price history",sparkline_aria_summary:"Price history last 7 days: minimum {min}, maximum {max}, median {median}",sparkline_aria_simple:"Price history last 7 days: minimum {min}, maximum {max}",history_fetch_error:"Couldn't load price history"},Me={DIE:"Diesel",SUP:"Super 95",GAS:"CNG"},ze=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Pe={entities:"Sensors",entities_hint:"Leave empty for auto-detection",max_stations:"Number of stations",show_map_links:"Show Google Maps links",show_opening_hours:"Show opening hours",show_payment_methods:"Show payment methods",show_history:"Show price history",show_best_refuel:"Show refuel tip",show_median_line:"Show 7-day median",show_hour_envelope:"Typical hourly range (4 wk)",show_noon_markers:"Noon reset markers",recorder_hint_intro:"Home Assistant keeps only 10 days of history by default. For better recommendations, add this block to configuration.yaml and restart:",copy:"Copy",copied:"Copied",payment_filter:"Only stations with",payment_filter_custom_placeholder:"Custom, e.g. Routex",payment_filter_custom_hint:"Must match the API string exactly. Common values: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC",payment_filter_add_custom:"Add custom payment method",payment_highlight_mode:"Highlight instead of filter",section_sensors:"Sensors",section_display:"Display",section_payment_filter:"Payment filter",section_tab_labels:"Tab labels",tab_labels_hint:"Leave empty to use the default label",section_cars:"Cars",show_cars:"Show fill-up costs",show_car_fillup:"Show fill-up cost",show_car_consumption:"Show consumption",cars_both_off_hint:'No rows enabled. To hide cars entirely, use "Show fill-up costs" in Display options.',car_name_placeholder:"Name (e.g. Golf TDI)",car_tank_placeholder:"Liters",car_consumption_placeholder:"⌀ l/100km",car_fuel_type:"Fuel type",car_choose_icon:"Choose icon",car_delete:"Delete car",add_car:"+ Add car",copy_sensor_id:"Copy sensor ID to clipboard",tank_size_range_error:"Please enter a value between 1 and 200 litres",consumption_range_error:"Please enter a value between 0 and 30 l/100 km"},De={common:Ee,card:Te,fuel_types:Me,weekdays:ze,editor:Pe},Ne={version:"Version",invalid_configuration:"Ungültige Konfiguration",loading:"Lädt…",no_data:"Keine Daten verfügbar"},Ie={cheapest:"Günstigster Preis",average:"Ø Preis",price:"Preis",closed:"Geschlossen",closing_soon:"Schließt bald",open_now:"Geöffnet",opening_hours:"Öffnungszeiten",payment:"Zahlungsarten",cash:"Bar",debit_card:"Bankomat",credit_card:"Kreditkarte",payment_filter_active:"Zahlungsfilter aktiv",payment_highlight_active:"Zahlungsfilter (Hervorhebung)",mon_fri:"Mo–Fr",sat:"Sa",sun:"So",holiday:"Feiertag",map:"Karte",per_liter:"/l",last_7_days:"Letzte 7 Tage",min_label:"Min",max_label:"Max",refresh:"Aktualisieren",last_updated:"Aktualisiert:",no_new_data:"Keine neuen Daten",version_update:"Tankstellen Austria wurde auf v{v} aktualisiert — bitte neu laden",version_reload:"Neu laden",version_reload_stuck:"Neu-Laden hat die neue Version nicht geladen. In HACS prüfen und einen harten Reload (Strg+Umschalt+R) ausführen.",version_dismiss:"Ausblenden",fill_up:"Volltanken",best_refuel_hour:"Tipp: Am günstigsten zwischen {h1}:00–{h2}:00",best_refuel_hour_weekday:"Tipp: Am günstigsten zwischen {h1}:00–{h2}:00, meist {day}",not_enough_data_hint:"Noch zu wenig Daten für Empfehlung (mind. 7 Tage)",confidence_high:"Hoch",confidence_medium:"Mittel",confidence_low:"Niedrig",confidence_title:"Empfehlungsgüte",confidence_span:"Datenumfang",confidence_coverage:"Abdeckung",confidence_gap:"Vorsprung",confidence_days:"Tage",confidence_cents:"Cent",confidence_short_history_hint:"Hinweis: Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen recorder.purge_keep_days auf 30 erhöhen.",median_delta_below:"{c}¢ unter Median",median_delta_above:"{c}¢ über Median",median_delta_equal:"auf Median",loading:"Wird geladen…",sparkline_open_more_info:"Preisverlauf öffnen",sparkline_aria_summary:"Preisverlauf der letzten 7 Tage: Minimum {min}, Maximum {max}, Median {median}",sparkline_aria_simple:"Preisverlauf der letzten 7 Tage: Minimum {min}, Maximum {max}",history_fetch_error:"Preisverlauf konnte nicht geladen werden"},Re={DIE:"Diesel",SUP:"Super 95",GAS:"CNG Erdgas"},He=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],Fe={entities:"Sensoren",entities_hint:"Leer lassen für automatische Erkennung",max_stations:"Anzahl Tankstellen",show_map_links:"Google Maps Links anzeigen",show_opening_hours:"Öffnungszeiten anzeigen",show_payment_methods:"Zahlungsarten anzeigen",show_history:"Preisverlauf anzeigen",show_best_refuel:"Tank-Tipp anzeigen",show_median_line:"7-Tage-Median einblenden",show_hour_envelope:"Typischer Stundenverlauf (4 Wo)",show_noon_markers:"12:00-Markierung (Preisreset)",recorder_hint_intro:"Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen diesen Block in configuration.yaml ergänzen und neu starten:",copy:"Kopieren",copied:"Kopiert",payment_filter:"Nur Tankstellen mit",payment_filter_custom_placeholder:"Benutzerdefiniert, z.B. Routex",payment_filter_custom_hint:"Der Wert muss exakt dem API-String entsprechen. Häufige Werte: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC",payment_filter_add_custom:"Benutzerdefinierte Zahlungsmethode hinzufügen",payment_highlight_mode:"Hervorheben statt filtern",section_sensors:"Sensoren",section_display:"Anzeige",section_payment_filter:"Zahlungsfilter",section_tab_labels:"Tab-Bezeichnungen",tab_labels_hint:"Leer lassen, um die Standard-Bezeichnung zu verwenden",section_cars:"Fahrzeuge",show_cars:"Tankkosten anzeigen",show_car_fillup:"Tankkosten anzeigen",show_car_consumption:"Verbrauch anzeigen",cars_both_off_hint:"Keine Zeile aktiv. Um Fahrzeuge komplett auszublenden, nutze „Tankkosten anzeigen“ in den Anzeige-Optionen.",car_name_placeholder:"Name (z.B. Golf TDI)",car_tank_placeholder:"Liter",car_consumption_placeholder:"⌀ l/100km",car_fuel_type:"Kraftstoffart",car_choose_icon:"Symbol wählen",car_delete:"Fahrzeug entfernen",add_car:"+ Fahrzeug hinzufügen",copy_sensor_id:"Sensor-ID in die Zwischenablage kopieren",tank_size_range_error:"Bitte einen Wert zwischen 1 und 200 Litern eingeben",consumption_range_error:"Bitte einen Wert zwischen 0 und 30 l/100 km eingeben"},Le={common:Ne,card:Ie,fuel_types:Re,weekdays:He,editor:Fe};const Oe={en:Object.freeze({__proto__:null,card:Te,common:Ee,default:De,editor:Pe,fuel_types:Me,weekdays:ze}),de:Object.freeze({__proto__:null,card:Ie,common:Ne,default:Le,editor:Fe,fuel_types:Re,weekdays:He})};function Ue(e,t){return e.split(".").reduce((e,t)=>{if(e&&"object"==typeof e&&t in e)return e[t]},t)}function Be(e,t){const i=Ue(e,t);return"string"==typeof i?i:void 0}function je(e){return(e.configLanguage||e.hassLanguage||"de").replace("-","_")}function Ve(e,t,i){const n=je(t);let r=Be(e,Oe[n]??Oe.de);if(void 0===r&&(r=Be(e,Oe.de)),void 0===r&&(r=e),i)for(const[e,t]of Object.entries(i))r=r.replace(`{${e}}`,t);return r}function qe(e){const t=je(e),i=Ue("weekdays",Oe[t]??Oe.de);if(Array.isArray(i)&&i.every(e=>"string"==typeof e))return i;const n=Ue("weekdays",Oe.de);return Array.isArray(n)?n:[]}function We(e,t){const i=je(t),n=Ue("fuel_types",Oe[i]??Oe.de)??Ue("fuel_types",Oe.de),r=n?.[e];return"string"==typeof r?r:e}const Ke=new Map,Ge=new Map;function Ze(e){if("number"==typeof e.lu)return Math.round(1e3*e.lu);const t=e.lu??e.last_updated??e.last_changed;return t?new Date(t).getTime():0}function Je(e){const t=e.length;if(0===t)return"";if(1===t)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;if(2===t)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)} L ${e[1].x.toFixed(2)} ${e[1].y.toFixed(2)}`;const i=new Array(t-1);for(let n=0;n<t-1;n++){const t=e[n+1].x-e[n].x;i[n]=0===t?0:(e[n+1].y-e[n].y)/t}const n=new Array(t);n[0]=i[0],n[t-1]=i[t-2];for(let e=1;e<t-1;e++)n[e]=(i[e-1]+i[e])/2;for(let e=0;e<t-1;e++){if(0===i[e]){n[e]=0,n[e+1]=0;continue}const t=n[e]/i[e],r=n[e+1]/i[e],s=t*t+r*r;if(s>9){const o=3/Math.sqrt(s);n[e]=o*t*i[e],n[e+1]=o*r*i[e]}}let r=`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;for(let i=0;i<t-1;i++){const t=e[i+1].x-e[i].x,s=e[i].x+t/3,o=e[i].y+n[i]*t/3,a=e[i+1].x-t/3,l=e[i+1].y-n[i+1]*t/3;r+=` C ${s.toFixed(2)} ${o.toFixed(2)}, ${a.toFixed(2)} ${l.toFixed(2)}, ${e[i+1].x.toFixed(2)} ${e[i+1].y.toFixed(2)}`}return r}function Xe(e,t,i){return Math.max(t,Math.min(i,e))}function Qe(e,t){const i=e.length;if(0===i)return NaN;if(1===i)return e[0];const n=Xe(t,0,1)*(i-1),r=Math.floor(n),s=Math.ceil(n);if(r===s)return e[r];const o=n-r;return e[r]*(1-o)+e[s]*o}const Ye=280,et=48;function tt(e){if(e.length<2)return null;const t=[...e].sort((e,t)=>e-t),i=(t.length-1)/2,n=(t[Math.floor(i)]+t[Math.ceil(i)])/2,r=100*(e[e.length-1]-n),s=Math.abs(r).toFixed(1);return r<=-.05?{key:"median_delta_below",cents:s,cls:"median-delta-good"}:r>=.05?{key:"median_delta_above",cents:s,cls:"median-delta-bad"}:{key:"median_delta_equal",cents:s,cls:"median-delta-neutral"}}function it(e,t){const i=[...e].sort((e,t)=>e-t),n=(i.length-1)/2;return t((i[Math.floor(n)]+i[Math.ceil(n)])/2)}function nt(e){const t={template:K,hoverPoints:[],medianDelta:null,viewBoxWidth:Ye,viewBoxHeight:et};try{const i=e.points;if(!i||i.length<2)return t;const n=function(e){const t=Date.now()-6048e5;let i=e.filter(e=>e.time>=t);if(i.length<2){const n=e.filter(e=>e.time<t),r=n.length?n[n.length-1]:null;r&&(i=[r,...i])}return i}(i);if(n.length<2)return t;const r=n.map(e=>e.value),s=Math.min(...r),o=Math.max(...r);let a=s,l=o;const c=e.showHourEnvelope?e.hourEnvelope??null:null;if(c)for(let e=0;e<24;e++){const t=c.minByHour[e],i=c.maxByHour[e];null!=t&&null!=i&&(a=Math.min(a,t),l=Math.max(l,i))}const d=l-a||.01,h=e=>44-(e-a)/d*40,p=n.map((e,t)=>({x:t/(n.length-1)*Ye,y:h(e.value)})),u=Je(p),_=u?`${u} L ${Ye.toFixed(2)} ${et.toFixed(2)} L 0 ${et.toFixed(2)} Z`:"";let f=K;if(c){const e=[],t=[];for(let i=0;i<n.length;i++){const r=new Date(n[i].time).getHours(),s=c.maxByHour[r],o=c.minByHour[r];null!=s&&null!=o&&(e.push({x:p[i].x,y:h(s)}),t.push({x:p[i].x,y:h(o)}))}if(e.length>=2){const i=function(e,t){if(!e||!t||e.length<2||e.length!==t.length)return"";const i=Je(e),n=Je([...t].reverse()).replace(/^M\s+([-\d.]+)\s+([-\d.]+)/,(e,t,i)=>`L ${t} ${i}`);return`${i} ${n} Z`}(e,t);i&&(f=q`<path d=${i} fill="var(--primary-color)" fill-opacity="0.08" stroke="none"/>`)}}const m=[];if(e.showNoonMarkers&&n.length>=2){const e=n[0].time,t=n[n.length-1].time,i=new Date(e);i.setHours(12,0,0,0),i.getTime()<e&&i.setDate(i.getDate()+1);const r=i=>{if(i<=e||i>=t)return null;let r=0,s=n.length-1;for(;r<s-1;){const e=r+s>>1;n[e].time<=i?r=e:s=e}const o=n[r+1].time-n[r].time,a=o>0?(i-n[r].time)/o:0;return p[r].x+a*(p[r+1].x-p[r].x)};for(let e=i.getTime();e<=t;e+=864e5){const t=r(e);null!=t&&m.push(q`
          <line x1=${t.toFixed(1)} y1="0" x2=${t.toFixed(1)} y2=${et}
                stroke="var(--secondary-text-color)" stroke-width="0.9"
                stroke-dasharray="2,3" opacity="0.55"/>
        `)}}const g=e.showMedianLine?tt(r):null,y=e.showMedianLine?q`<line x1="0" y1=${it(r,h).toFixed(1)}
                  x2=${Ye} y2=${it(r,h).toFixed(1)}
                  stroke="var(--secondary-text-color)" stroke-width="0.8"
                  stroke-dasharray="4,3" opacity="0.55"/>`:K,v=function(e,t){if(!t?.hasEnoughData||null==t.hour)return-1;if(0===e.length)return-1;const i=new Date,n=new Date(i);if(null!=t.weekday){let e=(i.getDay()-t.weekday+7)%7;0===e&&i.getHours()<t.hour&&(e=7),n.setDate(n.getDate()-e)}else i.getHours()<t.hour&&n.setDate(n.getDate()-1);n.setHours(t.hour,0,0,0);const r=n.getTime();let s=1/0,o=-1;for(let t=0;t<e.length;t++){const i=Math.abs(e[t].time-r);i<s&&(s=i,o=t)}return o}(n,e.analysis),b=v>=0&&v<p.length?q`
          <line x1=${p[v].x.toFixed(1)} y1="0"
                x2=${p[v].x.toFixed(1)} y2=${et}
                stroke="var(--success-color,#4CAF50)" stroke-width="1"
                stroke-dasharray="3,2" opacity="0.8"/>
          <circle cx=${p[v].x.toFixed(1)}
                  cy=${p[v].y.toFixed(1)} r="3.5"
                  fill="var(--success-color,#4CAF50)"
                  stroke="var(--card-background-color,#fff)" stroke-width="1.5"/>`:K,$=n.map((e,t)=>({t:e.time,v:e.value,x:+p[t].x.toFixed(1),y:+p[t].y.toFixed(1)})),x=`spark-grad-${Math.random().toString(36).slice(2,8)}`,w=e.showMedianLine?(()=>{const t=tt(r);if(!t)return K;const i={median_delta_below:e.translations.median_delta_below,median_delta_above:e.translations.median_delta_above,median_delta_equal:e.translations.median_delta_equal}[t.key].replace("{c}",t.cents);return V`
            <span class="median-delta ${t.cls}">${i}</span>
          `})():K,k=[...r].sort((e,t)=>e-t),S=(k.length-1)/2,A=k.length>0?(k[Math.floor(S)]+k[Math.ceil(S)])/2:0,C=(e.showMedianLine?e.translations.sparkline_aria_summary:e.translations.sparkline_aria_simple).replace("{min}",Ce(s)).replace("{max}",Ce(o)).replace("{median}",Ce(A));return{template:V`
      <svg
        class="sparkline"
        viewBox="0 0 ${Ye} ${et}"
        preserveAspectRatio="none"
        role="img"
        aria-label=${C}
        data-points=${JSON.stringify($)}
        data-width=${Ye}
        data-height=${et}
      >
        <title>${C}</title>
        <defs>
          <linearGradient id=${x} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.3" />
            <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        ${m}
        ${f}
        <path d=${_} fill="url(#${x})" />
        ${b}
        ${y}
        <path
          d=${u}
          fill="none"
          stroke="var(--primary-color)"
          stroke-width="1.5"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        <line
          class="sparkline-hover-line"
          x1="0" y1="0" x2="0" y2=${et}
          stroke="var(--primary-text-color)" stroke-width="0.6"
          stroke-dasharray="2,2" opacity="0" pointer-events="none"
        />
        <circle
          class="sparkline-hover-dot"
          cx="0" cy="0" r="3"
          fill="var(--primary-color)"
          stroke="var(--card-background-color,#fff)" stroke-width="1.5"
          opacity="0" pointer-events="none"
        />
      </svg>
      <div class="sparkline-tooltip" hidden>
        <span class="sparkline-tooltip-time"></span>
        <span class="sparkline-tooltip-price"></span>
      </div>
      <div class="sparkline-labels">
        <span>
          <span class="sparkline-minmax-label">${e.translations.min_label}</span>
          ${Ce(s)}
        </span>
        <span class="sparkline-period">
          ${e.translations.last_7_days}${w===K?K:V` · ${w}`}
        </span>
        <span>
          <span class="sparkline-minmax-label">${e.translations.max_label}</span>
          ${Ce(o)}
        </span>
      </div>
    `,hoverPoints:$,medianDelta:g,viewBoxWidth:Ye,viewBoxHeight:et}}catch(e){return console.warn("[Tankstellen Austria] sparkline render failed:",e),t}}const rt=36e5,st=864e5,ot=14*st;function at(e){const t=new Date(e);t.setHours(0,0,0,0);const i=t.getDay();return t.setDate(t.getDate()-(0===i?6:i-1)),t.getTime()}function lt(e,t){const i=[],n=(e,t,n)=>{for(let r=Math.ceil(t/rt)*rt;r<n;r+=rt)i.push({t:r,price:e})};for(let t=0;t<e.length-1;t++)n(e[t].value,e[t].time,e[t+1].time);return n(e[e.length-1].value,e[e.length-1].time,t),i}function ct(e){const t=new Map;for(const i of e){const e=at(i.t),n=t.get(e);n?n.push(i):t.set(e,[i])}return t}function dt(e,t){const i=e.map(e=>e.length>=t?function(e){if(0===e.length)return NaN;const t=[...e].sort((e,t)=>e.value-t.value),i=t.reduce((e,t)=>e+t.weight,0);let n=0;for(const e of t)if(n+=e.weight,n>=i/2)return e.value;return t[t.length-1].value}(e):NaN);let n=-1,r=1/0;return i.forEach((e,t)=>{!Number.isNaN(e)&&e<r&&(r=e,n=t)}),{medians:i,bestIdx:n,bestVal:r}}function ht(e,t){const i=e.medians.filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t);if(i.length<2||e.bestIdx<0)return 0;return Xe(100*(Qe(i,.5)-e.bestVal)/t,0,1)}const pt=o`
  :host {
    display: block;
  }
  ha-card {
    padding: 0;
    overflow: hidden;
    /* Card responds to its own width, not the viewport — lets narrow
       dashboard columns trigger compact layout even on a wide screen. */
    container-type: inline-size;
    container-name: tscard;
  }
  .empty {
    padding: 24px 16px;
    text-align: center;
    color: var(--secondary-text-color);
  }

  /* Version-mismatch banner */
  .version-notice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 16px;
    background: var(--warning-color, #ff9800);
    color: #fff;
    font-size: 0.875rem;
  }
  .version-reload-btn {
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 0.8125rem;
    padding: 8px 14px;
    min-height: 44px;
  }

  /* Tabs */
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar {
    display: none;
  }
  .tab {
    flex: 1 0 auto;
    min-height: 44px;
    padding: 12px 12px;
    background: none;
    border: none;
    color: var(--secondary-text-color);
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    border-bottom: 2px solid transparent;
    font-family: inherit;
    white-space: nowrap;
  }
  .tab.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
  }
  .tab:hover {
    color: var(--primary-text-color);
  }

  /* Card header */
  .card-header {
    padding: 16px 16px 8px;
  }
  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }
  .fuel-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 1rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }
  .fuel-icon {
    color: var(--primary-color);
    --mdc-icon-size: 18px;
  }
  .refresh-icon {
    --mdc-icon-size: 16px;
    vertical-align: middle;
  }
  .map-icon {
    --mdc-icon-size: 20px;
  }
  .pm-icon {
    --mdc-icon-size: 13px;
    vertical-align: middle;
  }
  .header-prices {
    display: flex;
    gap: 16px;
    text-align: right;
  }
  .header-price-item {
    display: flex;
    flex-direction: column;
  }
  .header-price-label {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    font-weight: 400;
  }
  .header-price-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-text-color);
  }
  .header-price-value.avg {
    font-size: 1rem;
    font-weight: 500;
    color: var(--secondary-text-color);
  }

  /* Cars fill-up block */
  .cars-fillup {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding: 8px 16px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .car-fillup-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .car-fillup-name {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.875rem;
    color: var(--secondary-text-color);
  }
  .car-icon {
    --mdc-icon-size: 14px;
    color: var(--secondary-text-color);
  }
  .car-fillup-liters {
    font-size: 0.75rem;
    opacity: 0.65;
  }
  .car-fillup-cost {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }
  .car-per100-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 19px;
    margin-top: -2px;
  }
  .car-per100-label {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    opacity: 0.75;
  }
  .car-per100-cost {
    font-size: 0.8125rem;
    color: var(--secondary-text-color);
  }

  /* Sparkline */
  .sparkline-container {
    margin-top: 8px;
    cursor: pointer;
    position: relative;
  }
  .sparkline {
    width: 100%;
    /* Fluid height: scales between 40 and 72 px with viewport width, and
       respects a --ts-sparkline-height override for themes that want a
       taller chart. The SVG uses preserveAspectRatio="none" so the
       internal 280×48 coordinate space stretches vertically to fit. */
    height: var(--ts-sparkline-height, clamp(40px, 8vw + 24px, 72px));
    display: block;
  }
  .sparkline-tooltip {
    position: absolute;
    top: -28px;
    display: flex;
    gap: 6px;
    padding: 3px 7px;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
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
    color: var(--success-color, #4caf50);
  }
  .median-delta-bad {
    color: var(--warning-color, #ff9800);
  }
  .median-delta-neutral {
    color: var(--secondary-text-color);
  }

  /* Best-refuel recommendation */
  .refuel-recommendation {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--success-color, #4caf50);
    margin-top: 5px;
    line-height: 1.3;
  }
  .refuel-hint {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    opacity: 0.75;
    margin-top: 5px;
  }
  .refuel-icon {
    --mdc-icon-size: 13px;
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
    padding: 1px 5px;
    border-radius: 3px;
    cursor: help;
    white-space: nowrap;
  }
  .refuel-confidence-high {
    background: color-mix(in srgb, var(--success-color, #4caf50) 18%, transparent);
    color: var(--success-color, #4caf50);
  }
  .refuel-confidence-medium {
    background: color-mix(in srgb, var(--warning-color, #ffa726) 18%, transparent);
    color: var(--warning-color, #ffa726);
  }
  .refuel-confidence-low {
    background: color-mix(in srgb, var(--secondary-text-color, #888) 15%, transparent);
    color: var(--secondary-text-color, #888);
  }

  /* Station list */
  .stations {
    padding: 0;
  }
  .station {
    border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
  }
  .station:last-child {
    border-bottom: none;
  }
  .station.pm-highlight {
    border-left: 3px solid var(--success-color, #4caf50);
    background: rgba(76, 175, 80, 0.06);
  }
  .station.pm-highlight .station-main:hover {
    background: rgba(76, 175, 80, 0.12);
  }
  .station-main {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .station-main:hover {
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
  }
  .rank {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    font-weight: 700;
    flex-shrink: 0;
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
    gap: 8px;
  }
  .address {
    font-size: 0.8125rem;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .price {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--primary-text-color);
    white-space: nowrap;
  }
  .map-link {
    color: var(--secondary-text-color);
    transition: color 0.2s;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    min-height: 40px;
    border-radius: 50%;
  }
  .map-link:hover {
    color: var(--primary-color);
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
  }
  .badge {
    font-size: 0.6875rem;
    padding: 1px 6px;
    border-radius: 4px;
    font-weight: 600;
  }
  .badge.closed {
    background: var(--error-color, #db4437);
    color: #fff;
  }
  .badge.closing-soon {
    background: var(--warning-color, #ff9800);
    color: #fff;
  }
  .pm-match-chip {
    font-size: 0.6875rem;
    padding: 1px 6px;
    border: 1px solid var(--success-color, #4caf50);
    border-radius: 8px;
    color: var(--success-color, #4caf50);
    font-weight: 500;
    line-height: 14px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* Dynamic mode meta + refresh */
  .dynamic-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    flex: 1;
  }
  .last-updated {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
  }
  .dynamic-meta-inner {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.2;
  }
  .no-new-data {
    font-size: 0.75rem;
    color: var(--warning-color, #ff9800);
  }
  .refresh-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-left: auto;
    padding: 6px 12px;
    min-height: 44px;
    background: none;
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    color: var(--primary-color);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.2s;
    flex-shrink: 0;
    font-family: inherit;
  }
  .refresh-btn.cooling {
    opacity: 0.4;
    cursor: default;
    pointer-events: none;
  }
  .refresh-btn:hover:not(.cooling) {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  /* Station-detail drawer.
     Uses the grid-template-rows 0fr ↔ 1fr pattern instead of animating
     max-height so long content (many opening-hour lines + payment
     methods) is not clipped at a fixed height. The direct child gets
     overflow:hidden + min-height:0 so the row collapse actually hides
     it. */
  .station-detail {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease, padding 0.3s ease;
    padding: 0 16px 0 52px;
  }
  .station-detail > * {
    overflow: hidden;
    min-height: 0;
  }
  .station-detail.expanded {
    grid-template-rows: 1fr;
    padding: 0 16px 12px 52px;
  }
  .detail-cols {
    display: flex;
    gap: 16px;
  }
  .detail-col {
    flex: 1;
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
    font-weight: 500;
    color: var(--primary-text-color);
  }
  .pm-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .pm-label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--primary-text-color);
  }
  .pm-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .pm-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 0.75rem;
    line-height: 1.4;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--secondary-text-color);
    border: 1px solid var(--divider-color, #e0e0e0);
  }
  .pm-badge.pm-other {
    font-style: italic;
  }

  /* Narrow-card layout: tightens paddings, lets address wrap, shrinks
     the hero price a touch. Kicks in when a dashboard column is narrow
     even on a desktop viewport. */
  @container tscard (inline-size < 360px) {
    .station-main {
      gap: 8px;
      padding: 10px 12px;
    }
    .rank {
      width: 28px;
      height: 28px;
      font-size: 0.875rem;
    }
    .address {
      white-space: normal;
    }
    .price {
      font-size: 1rem;
    }
    .tab {
      padding: 12px 10px;
      font-size: 0.875rem;
    }
    .card-header {
      padding: 12px 12px 6px;
    }
    .station-detail.expanded {
      padding: 0 12px 10px 42px;
    }
  }

  /* Accessibility: visible focus ring for keyboard users. */
  .tab:focus-visible,
  .station-main:focus-visible,
  .pm-filter-chip:focus-visible,
  .sparkline-container:focus-visible,
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 6px;
  }

  /* Accessibility: honour user motion preference. */
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
`,ut=o`
  :host {
    display: block;
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

  /* Entity chips */
  .entity-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .entity-chip {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 12px;
    border-radius: 16px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font-family: inherit;
  }
  .entity-chip.selected {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }
  .entity-chip:hover {
    opacity: 0.85;
  }
  .entity-chip .fuel-name {
    font-weight: 500;
  }
  .entity-chip-suffix {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  /* Toggle rows */
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 0;
  }
  .toggle-row label {
    font-size: 0.875rem;
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .toggle-row-sub {
    padding-left: 16px;
  }
  .toggle-row-sub label {
    font-size: 0.8125rem;
    color: var(--secondary-text-color);
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

  .divider {
    height: 1px;
    background: var(--divider-color);
    margin: 2px 0;
  }

  /* Max-stations slider */
  .slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .slider-row input[type="range"] {
    flex: 1;
    accent-color: var(--primary-color);
  }
  .slider-value {
    min-width: 20px;
    text-align: center;
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--primary-color);
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
    transition: all 0.15s;
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
    background: var(--error-color, #db4437);
    color: #fff;
    border-color: var(--error-color, #db4437);
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
    color: var(--error-color, #db4437);
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
    transition: background 0.15s;
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
    transition: background 0.15s, border-color 0.15s;
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
    transition: all 0.15s;
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
`;var _t,ft;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(_t||(_t={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(ft||(ft={}));function mt(e){return e.replace(/[<>"'&]/g,"").slice(0,50).trim()}let gt=class extends ce{constructor(){super(...arguments),this._config={type:"tankstellen-austria-card"},this._expandedCarIcon=null,this._pendingRemove=null,this._copiedPulse=!1}setConfig(e){this._config={...e}}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._copiedTimeout&&(clearTimeout(this._copiedTimeout),this._copiedTimeout=void 0)}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_et(e,t){return Ve(`editor.${e}`,this._ctx(),t)}_ct(e,t){return Ve(`card.${e}`,this._ctx(),t)}_fireChanged(){((e,t,i,n)=>{n=n||{},i=null==i?{}:i;const r=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});r.detail=i,e.dispatchEvent(r)})(this,"config-changed",{config:{...this._config}})}render(){const e=ke(this.hass),t=this._config.entities??[],i=this._collectApiPaymentKeys();return V`
      <div class="editor">
        ${this._renderSensorsSection(e,t)}
        ${this._renderTabLabelsSection(e,t)}
        ${this._renderDisplaySection()}
        ${this._renderPaymentSection(i)}
        ${this._renderCarsSection()}
      </div>
    `}_collectApiPaymentKeys(){const e=new Set(["cash","debit_card","credit_card"]);if(!this.hass)return e;for(const t of this._config.entities??[]){const i=this.hass.states[t]?.attributes?.stations??[];for(const t of i)for(const i of t.payment_methods?.others??[])e.add(i)}return e}_renderSensorsSection(e,t){return V`
      <div class="editor-section">
        <div class="section-header">${this._et("section_sensors")}</div>
        <div class="entity-chips">
          ${e.map(e=>this._renderEntityChip(e,t))}
        </div>
        <div class="editor-hint">${this._et("entities_hint")}</div>
      </div>
    `}_renderEntityChip(e,t){const i=this.hass?.states[e],n=We(i?.attributes?.fuel_type??"",this._ctx()),r=t.includes(e);return V`
      <button
        class=${ye({"entity-chip":!0,selected:r})}
        type="button"
        aria-pressed=${r?"true":"false"}
        @click=${()=>this._toggleEntity(e)}
      >
        <span class="fuel-name">${n}</span>
        <span class="entity-chip-suffix">${e.split(".")[1]??e}</span>
      </button>
    `}_renderTabLabelsSection(e,t){if(!this.hass)return K;const i=(t.length?t:e).map(e=>({eid:e,state:this.hass.states[e]})).filter(e=>!!e.state);if(i.length<2)return K;const n=this._config.tab_labels??{};return V`
      <div class="editor-section">
        <div class="section-header">${this._et("section_tab_labels")}</div>
        ${i.map(({eid:e,state:t})=>{let i=We(t.attributes?.fuel_type??"",this._ctx());if(!0===t.attributes?.dynamic_mode){const e=t.attributes.dynamic_entity,n=e?this.hass.states[e]?.attributes?.friendly_name||e.split(".")[1]:null;n&&(i+=` · ${n}`)}const r="string"==typeof n[e]?n[e]:"",s=`tablbl-${e.replace(/[^a-z0-9_-]/gi,"-")}`;return V`
            <div class="tab-label-row">
              <label class="tab-label-default" for=${s} title=${i}>${i}</label>
              <input
                id=${s}
                class="tab-label-input"
                type="text"
                autocomplete="off"
                maxlength="50"
                placeholder=${i}
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
    `}_renderDisplaySection(){const e=!1!==this._config.show_map_links,t=!1!==this._config.show_opening_hours,i=!1!==this._config.show_payment_methods,n=!1!==this._config.show_history,r=!1!==this._config.show_best_refuel,s=!0===this._config.show_median_line,o=!0===this._config.show_hour_envelope,a=!0===this._config.show_noon_markers,l=!0===this._config.show_cars,c=this._config.max_stations??5;return V`
      <div class="editor-section">
        <div class="section-header">${this._et("section_display")}</div>
        ${this._renderToggle("show_map_links",this._et("show_map_links"),e)}
        <div class="divider"></div>
        ${this._renderToggle("show_opening_hours",this._et("show_opening_hours"),t)}
        <div class="divider"></div>
        ${this._renderToggle("show_payment_methods",this._et("show_payment_methods"),i)}
        <div class="divider"></div>
        ${this._renderToggle("show_history",this._et("show_history"),n)}
        ${n?V`
              ${this._renderToggle("show_median_line",this._et("show_median_line"),s,!0)}
              ${this._renderToggle("show_hour_envelope",this._et("show_hour_envelope"),o,!0)}
              ${this._renderToggle("show_noon_markers",this._et("show_noon_markers"),a,!0)}
              ${this._renderToggle("show_best_refuel",this._et("show_best_refuel"),r,!0)}
              ${r?this._renderRecorderHint():K}
            `:K}
        <div class="divider"></div>
        ${this._renderToggle("show_cars",this._et("show_cars"),l)}
        <div class="divider"></div>
        <div class="toggle-row" style="padding-top:4px">
          <label for="slider-stations">${this._et("max_stations")}</label>
        </div>
        <div class="slider-row">
          <input
            id="slider-stations"
            type="range"
            min="0"
            max="5"
            step="1"
            .value=${String(c)}
            @input=${this._onSliderInput}
            @change=${this._onSliderChange}
            @keydown=${this._stop}
            @keyup=${this._stop}
            @keypress=${this._stop}
          />
          <span class="slider-value">${c}</span>
        </div>
      </div>
    `}_renderToggle(e,t,i,n=!1){const r=`toggle-${String(e)}`;return V`
      <div class=${ye({"toggle-row":!0,"toggle-row-sub":n})}>
        <label for=${r}>${t}</label>
        <ha-switch
          id=${r}
          .checked=${i}
          @change=${t=>this._onBooleanToggle(e,t)}
        ></ha-switch>
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
    `}_renderPaymentSection(e){if(!(!1!==this._config.show_payment_methods))return K;const t=this._config.payment_filter??[],i=!0===this._config.payment_highlight_mode,n=new Set(e);for(const e of t)n.add(e);return V`
      <div class="editor-section">
        <div class="section-header">${this._et("section_payment_filter")}</div>
        <div class="pm-filter-chips">
          ${[...n].map(i=>this._renderPaymentChip(i,t,e))}
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
        ${t.length?V`
              <div class="divider"></div>
              ${this._renderToggle("payment_highlight_mode",this._et("payment_highlight_mode"),i)}
            `:K}
      </div>
    `}_renderPaymentChip(e,t,i){const n=t.includes(e),r=e===this._pendingRemove,s=!i.has(e),o="cash"===e?this._ct("cash"):"debit_card"===e?this._ct("debit_card"):"credit_card"===e?this._ct("credit_card"):e;return V`
      <button
        class=${ye({"pm-filter-chip":!0,active:n,confirm:r})}
        type="button"
        aria-pressed=${n?"true":"false"}
        @click=${()=>this._togglePaymentChip(e,s)}
      >
        ${r?`✕ ${o}?`:o}
      </button>
    `}_renderCarsSection(){if(!(!0===this._config.show_cars))return K;const e=!1!==this._config.show_car_fillup,t=!1!==this._config.show_car_consumption,i=this._config.cars??[];return V`
      <div class="editor-section">
        <div class="section-header">${this._et("section_cars")}</div>
        ${this._renderToggle("show_car_fillup",this._et("show_car_fillup"),e)}
        ${this._renderToggle("show_car_consumption",this._et("show_car_consumption"),t)}
        ${e||t?K:V`<div class="editor-hint">${this._et("cars_both_off_hint")}</div>`}
        <div class="divider"></div>
        ${i.map((e,t)=>this._renderCarRow(e,t))}
        <button
          class="car-add-btn"
          type="button"
          @click=${this._onAddCar}
        >
          ${this._et("add_car")}
        </button>
      </div>
    `}_renderCarRow(e,t){const i=this._expandedCarIcon===t,n=e.icon||"mdi:car",r=`tsa-car-icon-picker-${t}`,s=null!=e.tank_size&&(e.tank_size<1||e.tank_size>200),o=null!=e.consumption&&(e.consumption<0||e.consumption>30),a=`tsa-car-tank-err-${t}`,l=`tsa-car-consumption-err-${t}`;return V`
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
                  ${We(t,this._ctx())}
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
            aria-invalid=${s?"true":"false"}
            aria-describedby=${s?a:K}
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
            aria-describedby=${o?l:K}
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
        ${s?V`<ha-alert
              id=${a}
              alert-type="error"
            >${this._et("tank_size_range_error")}</ha-alert>`:K}
        ${o?V`<ha-alert
              id=${l}
              alert-type="error"
            >${this._et("consumption_range_error")}</ha-alert>`:K}
        ${i?V`
              <div id=${r} class="car-icon-picker">
                ${$e.map(e=>V`
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
            `:K}
      </div>
    `}_stop(e){e.stopPropagation()}_toggleEntity(e){const t=[...this._config.entities??[]],i=t.includes(e)?t.filter(t=>t!==e):[...t,e];this._config={...this._config,entities:i},this._fireChanged()}_onBooleanToggle(e,t){const i=!!t.target.checked;this._config={...this._config,[e]:i},this._fireChanged()}_onSliderInput(e){const t=e.target,i=t.nextElementSibling;i&&(i.textContent=t.value)}_onSliderChange(e){const t=e.target,i=parseInt(t.value,10);Number.isFinite(i)&&(this._config={...this._config,max_stations:i},this._fireChanged())}async _onCopyRecorderSnippet(e){try{await navigator.clipboard.writeText(e),this._copiedPulse=!0,void 0!==this._copiedTimeout&&clearTimeout(this._copiedTimeout),this._copiedTimeout=window.setTimeout(()=>{this._copiedPulse=!1,this._copiedTimeout=void 0},1500)}catch{}}_onTabLabelChange(e,t){t.stopPropagation();const i=mt(t.target.value),n={...this._config.tab_labels??{}};i?n[e]=i:delete n[e];const r={...this._config};Object.keys(n).length?r.tab_labels=n:delete r.tab_labels,this._config=r,this._fireChanged()}_togglePaymentChip(e,t){const i=[...this._config.payment_filter??[]],n=i.includes(e);if(n&&t)return void(this._pendingRemove===e?(this._pendingRemove=null,this._config={...this._config,payment_filter:i.filter(t=>t!==e)},this._fireChanged()):this._pendingRemove=e);this._pendingRemove=null;const r=n?i.filter(t=>t!==e):[...i,e];this._config={...this._config,payment_filter:r},this._fireChanged()}_onCustomPmKeydown(e){e.stopPropagation(),"Enter"===e.key&&this._onAddCustomPm()}_onAddCustomPm(){const e=this.shadowRoot?.getElementById("pm-custom-input");if(!e)return;const t=mt(String(e.value??""));if(!t)return;this._pendingRemove=null;const i=[...this._config.payment_filter??[]];i.includes(t)||(i.push(t),this._config={...this._config,payment_filter:i},this._fireChanged()),e.value=""}_onToggleIconPicker(e,t){e.stopPropagation(),this._expandedCarIcon=this._expandedCarIcon===t?null:t}_onPickCarIcon(e,t,i){e.stopPropagation();const n=[...this._config.cars??[]];n[t]&&(n[t]={...n[t],icon:i},this._config={...this._config,cars:n},this._expandedCarIcon=null,this._fireChanged())}_onCarFieldChange(e,t,i){i.stopPropagation();const n=i.target.value,r=[...this._config.cars??[]],s=r[e];if(!s)return;const o={...s};if("consumption"===t){const e=n.trim();if(""===e)delete o.consumption;else{const t=parseFloat(e);Number.isFinite(t)&&t>0?o.consumption=Math.round(10*t)/10:delete o.consumption}}else if("tank_size"===t){const e=parseInt(n,10);o.tank_size=Math.max(1,Number.isFinite(e)?e:1)}else if("fuel_type"===t){["DIE","SUP","GAS"].includes(n)&&(o.fuel_type=n)}else o.name=mt(n);r[e]=o,this._config={...this._config,cars:r},this._fireChanged()}_onDeleteCar(e,t){e.stopPropagation();const i=[...this._config.cars??[]];i.splice(t,1),this._config={...this._config,cars:i},this._expandedCarIcon===t?this._expandedCarIcon=null:null!=this._expandedCarIcon&&this._expandedCarIcon>t&&(this._expandedCarIcon=this._expandedCarIcon-1),this._fireChanged()}_onAddCar(e){e.stopPropagation();const t=[...this._config.cars??[]];t.push({name:"",fuel_type:"DIE",tank_size:50,icon:"mdi:car"}),this._config={...this._config,cars:t},this._fireChanged()}static{this.styles=ut}};e([_e({attribute:!1})],gt.prototype,"hass",void 0),e([fe()],gt.prototype,"_config",void 0),e([fe()],gt.prototype,"_expandedCarIcon",void 0),e([fe()],gt.prototype,"_pendingRemove",void 0),e([fe()],gt.prototype,"_copiedPulse",void 0),gt=e([he("tankstellen-austria-card-editor")],gt),console.info(`%c  Tankstellen Austria Card  %c  ${function(e,t="",i=""){const n=("undefined"!=typeof localStorage&&localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_");let r=Be(e,Oe[n]??Oe.en);return void 0===r&&(r=Be(e,Oe.en)),void 0===r&&(r=e),""!==t&&""!==i&&(r=r.replace(t,i)),r}("common.version")} ${ve}  `,"color: white; font-weight: bold; background: #DC2026","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"tankstellen-austria-card",name:"Tankstellen Austria",description:"Austrian fuel prices from E-Control with sparklines and best-refuel analytics.",preview:!0,documentationURL:"https://github.com/rolandzeiner/tankstellen-austria"});let yt=class extends ce{constructor(){super(...arguments),this._activeTab=0,this._expandedStations=new Set,this._history={},this._versionMismatch=null,this._lastManualRefresh=0,this._noNewData=!1,this._historyError=!1,this._cooldownTick=0,this._initDone=!1,this._onDismissVersionBanner=()=>{this._versionMismatch=null}}static getConfigElement(){return document.createElement("tankstellen-austria-card-editor")}static getStubConfig(e){const t=ke(e);return{entities:t.length?[t[0]]:[],max_stations:5,show_map_links:!0,show_opening_hours:!0,show_payment_methods:!0,show_history:!0,show_best_refuel:!0,payment_filter:[],payment_highlight_mode:!0,show_cars:!1,cars:[]}}setConfig(e){this._config=we(e)}getCardSize(){return 6}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,min_rows:4}}shouldUpdate(e){if(!this._config)return!1;if(e.has("_config")||e.has("_activeTab")||e.has("_expandedStations")||e.has("_history")||e.has("_versionMismatch")||e.has("_lastManualRefresh")||e.has("_noNewData")||e.has("_cooldownTick"))return!0;const t=e.get("hass");if(!t)return!0;return this._trackedEntityIds().some(e=>t.states[e]!==this.hass.states[e])}_trackedEntityIds(){return this._config.entities?.length?this._config.entities:ke(this.hass)}_resolveEntities(){if(!this.hass)return[];return this._trackedEntityIds().map(e=>{const t=this.hass.states[e];return t?{entity_id:e,state:t.state,attributes:t.attributes,last_updated:t.last_updated}:null}).filter(e=>null!==e)}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_t(e,t){return Ve(`card.${e}`,this._ctx(),t)}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._historyInterval&&(clearInterval(this._historyInterval),this._historyInterval=void 0),void 0!==this._cooldownInterval&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),this._sparklineCleanup&&(this._sparklineCleanup(),this._sparklineCleanup=void 0),this._initDone=!1}updated(e){!this._initDone&&this.hass&&this._config&&(this._initDone=!0,this._fetchAllHistory(),this._historyInterval=window.setInterval(()=>{this._fetchAllHistory()},18e5),this._checkCardVersion()),this._reattachSparklineHover()}async _fetchAllHistory(){try{const e=this._resolveEntities();await Promise.all(e.map(async e=>{const t=await async function(e,t,i={}){if(!e?.callWS)return[];const n=Ge.get(t);if(n)return n;const r=i.days??28,s=new Date,o=new Date(s.getTime()-24*r*60*60*1e3),a=(async()=>{try{const i=await e.callWS({type:"history/history_during_period",start_time:o.toISOString(),end_time:s.toISOString(),entity_ids:[t],minimal_response:!0,significant_changes_only:!0}),n=(i?.[t]??[]).map(e=>({time:Ze(e),value:parseFloat(String(e.s??e.state??""))})).filter(e=>Number.isFinite(e.value)&&e.time>0);return Ke.set(t,n),n}catch(e){return console.warn("[Tankstellen Austria] history fetch failed for",t,"— sparkline and best-refuel will be empty:",e),Ke.get(t)??[]}finally{Ge.delete(t)}})();return Ge.set(t,a),a}(this.hass,e.entity_id);this._history={...this._history,[e.entity_id]:t}})),this._historyError=!1}catch(e){console.warn("[Tankstellen Austria] history refresh failed",e),this._historyError=!0}}async _checkCardVersion(){if(this.hass?.callWS)try{const e=await this.hass.callWS({type:"tankstellen_austria/card_version"});e?.version&&e.version!==ve&&(this._versionMismatch=e.version)}catch{}}_reattachSparklineHover(){this._sparklineCleanup&&(this._sparklineCleanup(),this._sparklineCleanup=void 0);const e=this.shadowRoot?.querySelector(".sparkline-container[data-entity]");if(!e)return;const t=qe(this._ctx()),i=je(this._ctx());this._sparklineCleanup=function(e,t){const i=()=>{};try{const n=e.querySelector("svg.sparkline"),r=e.querySelector(".sparkline-tooltip");if(!n||!r)return i;const s=n.querySelector(".sparkline-hover-line"),o=n.querySelector(".sparkline-hover-dot"),a=r.querySelector(".sparkline-tooltip-time"),l=r.querySelector(".sparkline-tooltip-price");if(!(s&&o&&a&&l))return i;let c;try{c=JSON.parse(n.dataset.points||"[]")}catch{c=[]}if(!c.length)return i;const d=Number(n.dataset.width)||280,h=i=>{const h=n.getBoundingClientRect();if(0===h.width)return;const p=Math.max(0,Math.min(1,(i-h.left)/h.width))*d;let u=c[0],_=Math.abs(c[0].x-p);for(const e of c){const t=Math.abs(e.x-p);t<_&&(u=e,_=t)}s.setAttribute("x1",String(u.x)),s.setAttribute("x2",String(u.x)),s.setAttribute("opacity","0.5"),o.setAttribute("cx",String(u.x)),o.setAttribute("cy",String(u.y)),o.setAttribute("opacity","1"),a.textContent=t.formatTime(u.t),l.textContent=t.formatPrice(u.v),r.hidden=!1;const f=e.getBoundingClientRect(),m=u.x/d*h.width+(h.left-f.left);r.style.left="0px";const g=r.offsetWidth,y=m-g/2,v=Math.max(0,Math.min(f.width-g,y));r.style.left=`${v}px`},p=()=>{s.setAttribute("opacity","0"),o.setAttribute("opacity","0"),r.hidden=!0},u=e=>h(e.clientX),_=e=>{e.touches[0]&&h(e.touches[0].clientX)};return n.addEventListener("mousemove",u),n.addEventListener("mouseleave",p),n.addEventListener("touchstart",_,{passive:!0}),n.addEventListener("touchmove",_,{passive:!0}),n.addEventListener("touchend",p),()=>{n.removeEventListener("mousemove",u),n.removeEventListener("mouseleave",p),n.removeEventListener("touchstart",_),n.removeEventListener("touchmove",_),n.removeEventListener("touchend",p)}}catch(e){return console.warn("[Tankstellen Austria] sparkline hover setup failed:",e),i}}(e,{formatTime:e=>{const n=new Date(e);return`${t[n.getDay()]?.slice(0,2)??""} ${"de"===i?`${n.getDate()}.${n.getMonth()+1}.`:`${n.getMonth()+1}/${n.getDate()}`} ${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`},formatPrice:Ae})}render(){if(!this.hass||!this._config)return V`
        <ha-card>
          <div class="empty" role="status" aria-live="polite">
            ${this._t("loading")}
          </div>
        </ha-card>
      `;const e=this._resolveEntities(),t=this._activeTab>=e.length?0:this._activeTab;if(!e.length)return V`
        <ha-card>
          ${this._renderVersionBanner()}
          <div class="empty">${this._t("no_data")}</div>
        </ha-card>
      `;const i=e[t]??e[0];return V`
      <ha-card>
        ${this._renderVersionBanner()}
        ${this._renderTabs(e,t)}
        ${this._historyError?V`<ha-alert alert-type="warning" role="alert">
              ${this._t("history_fetch_error")}
            </ha-alert>`:K}
        ${this._renderHeader(i)}
        ${this._renderCars(i)}
        ${this._renderStationList(i,t)}
      </ha-card>
    `}_renderVersionBanner(){if(!this._versionMismatch)return K;if("undefined"!=typeof sessionStorage&&"1"===sessionStorage.getItem(`tsa-reload-attempted-${this._versionMismatch}`))return V`
        <div class="version-notice" role="alert" aria-live="assertive">
          <span>${this._t("version_reload_stuck")}</span>
          <button
            class="version-reload-btn"
            type="button"
            @click=${this._onDismissVersionBanner}
          >
            ${this._t("version_dismiss")}
          </button>
        </div>
      `;const e=this._t("version_update",{v:this._versionMismatch});return V`
      <div class="version-notice" role="alert" aria-live="assertive">
        <span>${e}</span>
        <button
          class="version-reload-btn"
          type="button"
          @click=${this._onVersionReload}
        >
          ${this._t("version_reload")}
        </button>
      </div>
    `}_renderTabs(e,t){if(e.length<=1)return K;const i=this._config.tab_labels??{};return V`
      <div class="tabs" role="tablist">
        ${e.map((n,r)=>{const s=i[n.entity_id];let o;if("string"==typeof s&&s.trim().length>0)o=s;else{if(o=We(n.attributes.fuel_type??"",this._ctx()),!0===n.attributes.dynamic_mode){const e=n.attributes.dynamic_entity,t=e?this.hass.states[e]?.attributes?.friendly_name||e.split(".")[1]:null;t&&(o+=` · ${t}`)}}const a=r===t;return V`
            <button
              type="button"
              role="tab"
              class=${ye({tab:!0,active:a})}
              aria-selected=${a?"true":"false"}
              tabindex=${a?"0":"-1"}
              @click=${()=>this._onTabClick(r)}
              @keydown=${t=>this._onTabKeydown(t,r,e.length)}
            >
              ${o}
            </button>
          `})}
      </div>
    `}_renderHeader(e){const t=e.attributes.stations??[];if(!t.length)return K;const i=e.attributes.fuel_type??"",n=e.attributes.fuel_type_name||We(i,this._ctx()),r=e.attributes.average_price,s=t[0]?.price,o=!0===e.attributes.dynamic_mode,a=!1!==this._config.show_history;return V`
      <div class="card-header">
        <div class="header-top">
          <div class="fuel-label">
            <ha-icon icon="mdi:gas-station" class="fuel-icon" aria-hidden="true"></ha-icon>
            <span>${n}</span>
          </div>
          ${o?this._renderDynamicHeader(e):V`
                <div class="header-prices">
                  <div class="header-price-item">
                    <span class="header-price-label">${this._t("cheapest")}</span>
                    <span class="header-price-value">${Ae(s)}</span>
                  </div>
                  ${null!=r?V`
                        <div class="header-price-item">
                          <span class="header-price-label">${this._t("average")}</span>
                          <span class="header-price-value avg">${Ae(r)}</span>
                        </div>
                      `:K}
                </div>
              `}
        </div>
        ${a&&!o?this._renderSparkline(e):K}
      </div>
    `}_renderDynamicHeader(e){const t=e.last_updated?new Date(e.last_updated).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"",i=be-(Date.now()-this._lastManualRefresh),n=i>0,r=n?(()=>{const e=Math.ceil(i/1e3);return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`})():"";return V`
      <div class="dynamic-meta">
        <div class="dynamic-meta-inner" aria-live="polite">
          ${t?V`<span class="last-updated">${this._t("last_updated")} ${t}</span>`:K}
          ${this._noNewData?V`<span class="no-new-data" role="status">${this._t("no_new_data")}</span>`:K}
        </div>
      </div>
      <button
        class=${ye({"refresh-btn":!0,cooling:n})}
        type="button"
        aria-label=${this._t("refresh")}
        aria-disabled=${n?"true":"false"}
        @click=${this._onRefresh}
      >
        <ha-icon icon="mdi:refresh" class="refresh-icon" aria-hidden="true"></ha-icon>
        ${n?r:this._t("refresh")}
      </button>
    `}_renderSparkline(e){const t=e.entity_id,i=this._history[t]??[];if(i.length<2)return K;const n=!0===this._config.show_median_line,r=!0===this._config.show_hour_envelope,s=!0===this._config.show_noon_markers,o=r?function(e){if(!e||e.length<2)return null;const t=Date.now();if(t-e[0].time<7*st)return null;const i=lt(e,t);if(0===i.length)return null;const n=ct(i),r=Array.from({length:24},()=>[]);for(const e of n.values()){if(e.length<24)continue;const t=e.map(e=>e.price).sort((e,t)=>e-t),i=Qe(t,.05),n=Qe(t,.95);for(const t of e){const e=Xe(t.price,i,n);r[new Date(t.t).getHours()].push(e)}}const s=new Array(24).fill(null),o=new Array(24).fill(null);let a=0;for(let e=0;e<24;e++){const t=r[e];if(t.length<3)continue;const i=[...t].sort((e,t)=>e-t);s[e]=Qe(i,.1),o[e]=Qe(i,.9),a++}return a<6?null:{minByHour:s,maxByHour:o}}(i):null,a=!1!==this._config.show_best_refuel?function(e){if(!e||e.length<2)return null;const t=Date.now(),i=t-e[0].time;if(i<7*st)return{hasEnoughData:!1};const n=lt(e,t);if(0===n.length)return{hasEnoughData:!1};const r=ct(n),s=[];for(const e of r.values()){if(e.length<24)continue;const i=e.map(e=>e.price).sort((e,t)=>e-t),n=Qe(i,.05),r=Qe(i,.95);let o=0;const a=e.map(e=>{const t=Xe(e.price,n,r);return o+=t,{t:e.t,price:t}}),l=o/a.length;for(const{t:e,price:i}of a)s.push({t:e,delta:i-l,weight:Math.pow(.5,(t-e)/ot)})}if(0===s.length)return{hasEnoughData:!1};const o=Array.from({length:24},()=>[]),a=Array.from({length:7},()=>[]);for(const{t:e,delta:t,weight:i}of s){const n=new Date(e);o[n.getHours()].push({value:t,weight:i}),a[n.getDay()].push({value:t,weight:i})}const l=dt(o,3);if(l.bestIdx<0)return{hasEnoughData:!1};const c=dt(a,3),d=i/st,h=Math.min(1,d/28),p=o.filter(e=>e.length>=3).length/24,u=ht(l,1.5),_=l.medians.filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t),f=_.length>=2?100*(Qe(_,.5)-l.bestVal):0,m=(h+p+u)/3,g=m>=.75?"high":m>=.5?"medium":"low",y=a.filter(e=>e.length>=3).length/7,v=ht(c,.8),b=(c.bestIdx>=0?(h+y+v)/3:0)>=.75;return{hasEnoughData:!0,hour:l.bestIdx,weekday:b?c.bestIdx:null,confidence:{level:g,score:m,span_days:Math.round(d),coverage_pct:Math.round(100*p),gap_cents:Math.round(10*f)/10}}}(i):null,l=nt({points:i,showMedianLine:n,showHourEnvelope:r,showNoonMarkers:s,hourEnvelope:o,analysis:a,translations:{min_label:this._t("min_label"),max_label:this._t("max_label"),last_7_days:this._t("last_7_days"),median_delta_below:this._t("median_delta_below"),median_delta_above:this._t("median_delta_above"),median_delta_equal:this._t("median_delta_equal"),sparkline_aria_summary:this._t("sparkline_aria_summary"),sparkline_aria_simple:this._t("sparkline_aria_simple")}});return l.template===K?K:V`
      <div
        class="sparkline-container"
        data-entity=${t}
        role="button"
        tabindex="0"
        aria-label=${this._t("sparkline_open_more_info")}
        @click=${()=>this._onSparklineClick(t)}
        @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._onSparklineClick(t))}}
      >
        ${l.template}
        ${this._renderRecommendation(a)}
      </div>
    `}_renderRecommendation(e){if(!e)return K;if(!e.hasEnoughData)return V`
        <div class="refuel-hint">
          <ha-icon icon="mdi:information-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
          ${this._t("not_enough_data_hint")}
        </div>
      `;const t=e.hour??0,i=String(t).padStart(2,"0"),n=String((t+1)%24).padStart(2,"0");let r;if(null!=e.weekday){const t=qe(this._ctx())[e.weekday]??"";r=this._t("best_refuel_hour_weekday",{h1:i,h2:n,day:t})}else r=this._t("best_refuel_hour",{h1:i,h2:n});const s=e.confidence;if(!s)return V`
        <div class="refuel-recommendation">
          <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
          <span class="refuel-text">${r}</span>
        </div>
      `;const o=this._t(`confidence_${s.level}`),a=[`${this._t("confidence_title")}: ${o}`,`• ${this._t("confidence_span")}: ${s.span_days} ${this._t("confidence_days")}`,`• ${this._t("confidence_coverage")}: ${s.coverage_pct}%`,`• ${this._t("confidence_gap")}: ${s.gap_cents.toFixed(1)} ${this._t("confidence_cents")}`];s.span_days<14&&a.push("",this._t("confidence_short_history_hint"));const l=function(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(a.join("\n")),c=`refuel-confidence refuel-confidence-${s.level}`,d=[`${this._t("confidence_title")}: ${o}`,`${this._t("confidence_span")}: ${s.span_days} ${this._t("confidence_days")}`,`${this._t("confidence_coverage")}: ${s.coverage_pct}%`,`${this._t("confidence_gap")}: ${s.gap_cents.toFixed(1)} ${this._t("confidence_cents")}`].join(". ");return V`
      <div class="refuel-recommendation">
        <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
        <span class="refuel-text">${r}</span>
        <span
          class=${c}
          title=${l}
          aria-label=${d}
        >${o}</span>
      </div>
    `}_renderCars(e){const t=e.attributes.stations??[];if(!t.length)return K;const i=!0===this._config.show_cars,n=!1!==this._config.show_car_fillup,r=!1!==this._config.show_car_consumption;if(!i||!n&&!r)return K;const s=e.attributes.fuel_type??"",o=this._config.payment_filter??[],a=!0===this._config.payment_highlight_mode,l=(this._config.cars??[]).filter(e=>e.fuel_type===s&&e.tank_size>0&&e.name),c=n?l:l.filter(e=>Number(e.consumption)>0);if(!c.length)return K;const d=a?t:t.filter(e=>Se(e,o)),h=a?t[0]?.price:d[0]?.price;return V`
      <div class="cars-fillup">
        ${c.map(e=>this._renderCarRow(e,h,n,r))}
      </div>
    `}_renderCarRow(e,t,i,n){const r=Number(e.consumption),s=Number.isFinite(r)&&r>0?r.toFixed(1).replace(".",","):"";if(i){const i=null!=t?`€ ${(t*Number(e.tank_size)).toFixed(2).replace(".",",")}`:"–",o=null!=t&&r>0?`€ ${(t*r).toFixed(2).replace(".",",")}`:"–";return V`
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
                <span class="car-per100-label">${s} l/100 km</span>
                <span class="car-per100-cost">${o} / 100 km</span>
              </div>
            `:K}
      `}const o=null!=t?`€ ${(t*r).toFixed(2).replace(".",",")}`:"–";return V`
      <div class="car-fillup-row">
        <span class="car-fillup-name">
          <ha-icon icon=${e.icon||"mdi:car"} class="car-icon" aria-hidden="true"></ha-icon>
          ${e.name}
          <span class="car-fillup-liters">${s} l/100 km</span>
        </span>
        <span class="car-fillup-cost">${o} / 100 km</span>
      </div>
    `}_renderStationList(e,t){const i=e.attributes.stations??[],n=parseInt(String(this._config.max_stations),10),r=Number.isFinite(n)?Math.max(0,Math.min(5,n)):5,s=this._config.payment_filter??[],o=!0===this._config.payment_highlight_mode,a=o?i:i.filter(e=>Se(e,s));if(0===r)return K;if(!a.length&&s.length&&i.length)return V`
        <div class="empty">
          ${this._t("payment_filter_active")} — ${this._t("no_data")}
        </div>
      `;if(!a.length)return V`<div class="empty">${this._t("no_data")}</div>`;const l=a.slice(0,r);return V`
      <div class="stations">
        ${l.map((e,i)=>this._renderStation(e,i,t,s,o))}
      </div>
    `}_renderStation(e,t,i,n,r){const s=!1!==this._config.show_map_links,o=!1!==this._config.show_opening_hours,a=!1!==this._config.show_payment_methods,l=e.location??{},c=`${i}-${t}`,d=this._expandedStations.has(c),h=!1===e.open,p=!h&&function(e,t=new Date){if(!1===e.open)return!1;const i=e.opening_hours??[];if(!i.length)return!1;const n=t.getDay(),r=0===n?"SO":6===n?"SA":"MO",s=i.find(e=>e.day===r);if(!s||!s.to)return!1;if("00:00"===s.from&&"24:00"===s.to)return!1;const[o,a]=s.to.split(":"),l=parseInt(o,10),c=parseInt(a,10);if(!Number.isFinite(l)||!Number.isFinite(c))return!1;const d=new Date(t);0===l&&0===c?(d.setDate(d.getDate()+1),d.setHours(0,0,0,0)):d.setHours(l,c,0,0);const h=(d.getTime()-t.getTime())/6e4;return h>0&&h<=30}(e),u=r&&n.length>0&&Se(e,n),_=u?function(e,t,i){if(!t||!t.length)return[];const n=e.payment_methods??{},r=[];for(const e of t)if("cash"===e&&n.cash)r.push(i.cash);else if("debit_card"===e&&n.debit_card)r.push(i.debit_card);else if("credit_card"===e&&n.credit_card)r.push(i.credit_card);else{const t=(n.others??[]).find(t=>t.toLowerCase()===e.toLowerCase());t&&r.push(t)}return r}(e,n,{cash:this._t("cash"),debit_card:this._t("debit_card"),credit_card:this._t("credit_card")}):[],f=o&&!!e.opening_hours?.length,m=a&&(!!(g=e.payment_methods)&&Boolean(g.cash||g.debit_card||g.credit_card||g.others&&g.others.length>0));var g;const y=f||m,v=[e.name||"–",l.city??"",Ae(e.price)].filter(Boolean).join(", "),b=y?`tsa-station-detail-${i}-${t}`:void 0,$=!!e.name,x=l.city??"",w=l.address??"";return V`
      <div class=${ye({station:!0,"pm-highlight":u})}>
        <div
          class="station-main"
          role=${y?"button":"group"}
          tabindex=${y?"0":"-1"}
          aria-expanded=${y?d?"true":"false":K}
          aria-controls=${b??K}
          aria-label=${v}
          @click=${()=>this._onStationClick(c)}
          @keydown=${e=>this._onStationKeydown(e,c,y)}
        >
          <div class="rank">${t+1}</div>
          <div class="info">
            <div class="name">
              ${$?V`<span lang="de">${e.name}</span>`:"–"}
              ${h?V`<span class="badge closed">${this._t("closed")}</span>`:p?V`<span class="badge closing-soon">${this._t("closing_soon")}</span>`:K}
              ${_.map(e=>V`<span class="pm-match-chip">${e}</span>`)}
            </div>
            <div class="address">
              ${l.postalCode??""}${x?V` <span lang="de">${x}</span>`:K},
              ${w?V`<span lang="de">${w}</span>`:K}
            </div>
          </div>
          <div class="price">${Ae(e.price)}</div>
          ${s?V`
                <a
                  class="map-link"
                  href=${function(e,t){if(!e)return"#";if(/\d/.test(e.address??"")){const t=`${e.postalCode??""} ${e.city??""} ${e.address??""}`.trim();return`https://maps.google.com/?q=${encodeURIComponent(t)}`}const i=[t,e.address,e.postalCode,e.city].filter(e=>null!=e&&""!==e);return`https://www.google.com/search?q=${encodeURIComponent(i.join(" "))}`}(l,e.name??"")}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label=${`${this._t("map")}: ${e.name??""}`}
                  title=${this._t("map")}
                  @click=${this._onMapLinkClick}
                >
                  <ha-icon
                    icon=${/\d/.test(l.address??"")?"mdi:map-marker":"mdi:magnify"}
                    class="map-icon"
                    aria-hidden="true"
                  ></ha-icon>
                </a>
              `:K}
        </div>
        ${y?V`
              <div
                id=${b}
                class=${ye({"station-detail":!0,expanded:d})}
              >
                <div class="detail-cols">
                  ${f?V`<div class="detail-col">${this._renderHours(e.opening_hours??[])}</div>`:K}
                  ${m?V`<div class="detail-col">${this._renderPaymentMethods(e.payment_methods)}</div>`:K}
                </div>
              </div>
            `:K}
      </div>
    `}_renderHours(e){const t=e.find(e=>"MO"===e.day)??e[0],i=e.find(e=>"SA"===e.day)??e[5],n=e.find(e=>"SO"===e.day)??e[6],r=e.find(e=>"FE"===e.day);return V`
      <div class="hours-grid">
        ${t?V`<span class="day">${this._t("mon_fri")}</span><span>${t.from} – ${t.to}</span>`:K}
        ${i?V`<span class="day">${this._t("sat")}</span><span>${i.from} – ${i.to}</span>`:K}
        ${n?V`<span class="day">${this._t("sun")}</span><span>${n.from} – ${n.to}</span>`:K}
        ${r?V`<span class="day">${this._t("holiday")}</span><span>${r.from} – ${r.to}</span>`:K}
      </div>
    `}_renderPaymentMethods(e){if(!e)return K;const t=[];e.cash&&t.push(V`
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
    `:K}_onTabClick(e){this._activeTab!==e&&(this._activeTab=e,this._expandedStations=new Set)}_onTabKeydown(e,t,i){let n=t;switch(e.key){case"ArrowRight":n=(t+1)%i;break;case"ArrowLeft":n=(t-1+i)%i;break;case"Home":n=0;break;case"End":n=i-1;break;default:return}e.preventDefault(),this._onTabClick(n),this.updateComplete.then(()=>{const e=this.shadowRoot?.querySelectorAll('.tabs [role="tab"]');e?.[n]?.focus()})}_onStationClick(e){const t=new Set(this._expandedStations);t.has(e)?t.delete(e):t.add(e),this._expandedStations=t}_onStationKeydown(e,t,i){i&&("Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._onStationClick(t)))}_onMapLinkClick(e){e.stopPropagation()}_onSparklineClick(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_onRefresh(){if(!this.hass)return;const e=Date.now();if(e-this._lastManualRefresh<be)return;this._lastManualRefresh=e,this._noNewData=!1;const t=this._resolveEntities(),i=t[this._activeTab]??t[0],n=i?.last_updated;for(const e of t){const t=this.hass.callService("homeassistant","update_entity",{entity_id:e.entity_id});t&&"function"==typeof t.catch&&t.catch(t=>{console.warn("[Tankstellen Austria] update_entity failed for",e.entity_id,t)})}window.setTimeout(()=>{try{const e=this._resolveEntities(),t=e[this._activeTab]??e[0];t?.last_updated===n&&(this._noNewData=!0)}catch(e){console.warn("[Tankstellen Austria] post-refresh check failed",e)}},3e3),void 0!==this._cooldownInterval&&clearInterval(this._cooldownInterval);"undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches?window.setTimeout(()=>{this._cooldownTick=(this._cooldownTick+1)%1e6},be):this._cooldownInterval=window.setInterval(()=>{Date.now()-this._lastManualRefresh>=be&&void 0!==this._cooldownInterval&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),this._cooldownTick=(this._cooldownTick+1)%1e6},1e3)}async _onVersionReload(){if(this._versionMismatch)try{sessionStorage.setItem(`tsa-reload-attempted-${this._versionMismatch}`,"1")}catch{}try{if("undefined"!=typeof window&&"caches"in window){const e=await caches.keys();await Promise.all(e.map(e=>caches.delete(e)))}}catch{}location.reload()}static{this.styles=pt}};e([_e({attribute:!1})],yt.prototype,"hass",void 0),e([fe()],yt.prototype,"_config",void 0),e([fe()],yt.prototype,"_activeTab",void 0),e([fe()],yt.prototype,"_expandedStations",void 0),e([fe()],yt.prototype,"_history",void 0),e([fe()],yt.prototype,"_versionMismatch",void 0),e([fe()],yt.prototype,"_lastManualRefresh",void 0),e([fe()],yt.prototype,"_noNewData",void 0),e([fe()],yt.prototype,"_historyError",void 0),e([fe()],yt.prototype,"_cooldownTick",void 0),yt=e([he("tankstellen-austria-card")],yt);export{yt as TankstellenAustriaCard};
