// Tankstellen Austria Card — bundled by Rollup. Edit sources in src/, then `npm run build`.
function e(e,t,i,s){var n,r=arguments.length,o=r<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(o=(r<3?n(o):r>3?n(t,i,o):n(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let r=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(t,e))}return e}toString(){return this.cssText}};const o=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new r(i,e,s)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,_=f.trustedTypes,g=_?_.emptyScript:"",m=f.reactiveElementPolyfillSupport,y=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!c(e,t),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&l(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:n}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const r=s?.call(this);n?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=s;const r=n.fromAttribute(t,e.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(e,t,i,s=!1,n){if(void 0!==e){const r=this.constructor;if(!1===s&&(n=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??b)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==n||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[y("elementProperties")]=new Map,x[y("finalized")]=new Map,m?.({ReactiveElement:x}),(f.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=e=>e,k=w.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+C,T=`<${z}>`,P=document,M=()=>P.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,U=Array.isArray,O="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,R=/>/g,L=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,I=/"/g,F=/^(?:script|style|textarea|title)$/i,B=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),V=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,G=P.createTreeWalker(P,129);function K(e,t){if(!U(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const Z=(e,t)=>{const i=e.length-1,s=[];let n,r=2===t?"<svg>":3===t?"<math>":"",o=H;for(let t=0;t<i;t++){const i=e[t];let a,c,l=-1,d=0;for(;d<i.length&&(o.lastIndex=d,c=o.exec(i),null!==c);)d=o.lastIndex,o===H?"!--"===c[1]?o=D:void 0!==c[1]?o=R:void 0!==c[2]?(F.test(c[2])&&(n=RegExp("</"+c[2],"g")),o=L):void 0!==c[3]&&(o=L):o===L?">"===c[0]?(o=n??H,l=-1):void 0===c[1]?l=-2:(l=o.lastIndex-c[2].length,a=c[1],o=void 0===c[3]?L:'"'===c[3]?I:j):o===I||o===j?o=L:o===D||o===R?o=H:(o=L,n=void 0);const h=o===L&&e[t+1].startsWith("/>")?" ":"";r+=o===H?i+T:l>=0?(s.push(a),i.slice(0,l)+E+i.slice(l)+C+h):i+C+(-2===l?t:h)}return[K(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class J{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let n=0,r=0;const o=e.length-1,a=this.parts,[c,l]=Z(e,t);if(this.el=J.createElement(c,i),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=G.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(E)){const t=l[r++],i=s.getAttribute(e).split(C),o=/([.?@])?(.*)/.exec(t);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?te:"?"===o[1]?ie:"@"===o[1]?se:ee}),s.removeAttribute(e)}else e.startsWith(C)&&(a.push({type:6,index:n}),s.removeAttribute(e));if(F.test(s.tagName)){const e=s.textContent.split(C),t=e.length-1;if(t>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],M()),G.nextNode(),a.push({type:2,index:++n});s.append(e[t],M())}}}else if(8===s.nodeType)if(s.data===z)a.push({type:2,index:n});else{let e=-1;for(;-1!==(e=s.data.indexOf(C,e+1));)a.push({type:7,index:n}),e+=C.length-1}n++}}static createElement(e,t){const i=P.createElement("template");return i.innerHTML=e,i}}function Q(e,t,i=e,s){if(t===V)return t;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=N(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(e),n._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(t=Q(e,n._$AS(e,t.values),n,s)),t}class X{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??P).importNode(t,!0);G.currentNode=s;let n=G.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let t;2===a.type?t=new Y(n,n.nextSibling,this,e):1===a.type?t=new a.ctor(n,a.name,a.strings,this,e):6===a.type&&(t=new ne(n,this,e)),this._$AV.push(t),a=i[++o]}r!==a?.index&&(n=G.nextNode(),r++)}return G.currentNode=P,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),N(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>U(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=J.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new X(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new J(e)),t}k(e){U(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const n of e)s===t.length?t.push(i=new Y(this.O(M()),this.O(M()),this,this.options)):i=t[s],i._$AI(n),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(e,t=this,i,s){const n=this.strings;let r=!1;if(void 0===n)e=Q(this,e,t,0),r=!N(e)||e!==this._$AH&&e!==V,r&&(this._$AH=e);else{const s=e;let o,a;for(e=n[0],o=0;o<n.length-1;o++)a=Q(this,s[i+o],t,o),a===V&&(a=this._$AH[o]),r||=!N(a)||a!==this._$AH[o],a===W?e=W:e!==W&&(e+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class se extends ee{constructor(e,t,i,s,n){super(e,t,i,s,n),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??W)===V)return;const i=this._$AH,s=e===W&&i!==W||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const re=w.litHtmlPolyfillSupport;re?.(J,Y),(w.litHtmlVersions??=[]).push("3.3.2");const oe=globalThis;let ae=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let n=s._$litPart$;if(void 0===n){const e=i?.renderBefore??null;s._$litPart$=n=new Y(t.insertBefore(M(),e),e,void 0,i??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};ae._$litElement$=!0,ae.finalized=!0,oe.litElementHydrateSupport?.({LitElement:ae});const ce=oe.litElementPolyfillSupport;ce?.({LitElement:ae}),(oe.litElementVersions??=[]).push("4.2.2");const le=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},de={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},he=(e=de,t,i)=>{const{kind:s,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),r.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const n=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,n,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];t.call(this,i),this.requestUpdate(s,n,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function pe(e){return(t,i)=>"object"==typeof i?he(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ue(e){return pe({...e,state:!0,attribute:!1})}const fe=1;class _e{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const ge=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends _e{constructor(e){if(super(e),e.type!==fe||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const i=e.element.classList;for(const e of this.st)e in t||(i.remove(e),this.st.delete(e));for(const e in t){const s=!!t[e];s===this.st.has(e)||this.nt?.has(e)||(s?(i.add(e),this.st.add(e)):(i.remove(e),this.st.delete(e)))}return V}}),me=["DIE","SUP","GAS"];function ye(e){if(!e)throw new Error("tankstellen-austria-card: config missing");const t={...e};if("string"==typeof t.entities&&(t.entities=[t.entities]),Array.isArray(t.entities)?t.entities=t.entities.filter(e=>"string"==typeof e&&e.includes(".")):null!=t.entities&&(console.warn("[Tankstellen Austria] config.entities must be an array of entity IDs — ignoring",t.entities),delete t.entities),null!=t.max_stations){const e=parseInt(String(t.max_stations),10);t.max_stations=Number.isFinite(e)?Math.max(0,Math.min(5,e)):5}return Array.isArray(t.payment_filter)?t.payment_filter=t.payment_filter.filter(e=>"string"==typeof e&&e.length>0):null!=t.payment_filter&&delete t.payment_filter,Array.isArray(t.cars)?t.cars=t.cars.map(e=>function(e){if(!e||"object"!=typeof e)return null;const t=e,i="string"==typeof t.name?t.name.slice(0,50):"",s=me.includes(t.fuel_type)?t.fuel_type:"DIE",n=parseInt(String(t.tank_size),10),r=Number.isFinite(n)&&n>=1?Math.min(200,n):50;let o;if(null!=t.consumption){const e=parseFloat(String(t.consumption));Number.isFinite(e)&&e>=0&&(o=Math.min(30,e))}const a={name:i,fuel_type:s,tank_size:r,icon:"string"==typeof t.icon&&t.icon.startsWith("mdi:")?t.icon:"mdi:car"};return null!=o&&(a.consumption=o),a}(e)).filter(e=>null!==e):null!=t.cars&&delete t.cars,t}function ve(e){return e&&e.states?Object.keys(e.states).filter(t=>{const i=e.states[t];return t.startsWith("sensor.")&&i?.attributes?.fuel_type&&Array.isArray(i.attributes.stations)}):[]}function be(e,t){if(!t||!t.length)return!0;const i=e.payment_methods??{};return t.some(e=>"cash"===e?Boolean(i.cash):"debit_card"===e?Boolean(i.debit_card):"credit_card"===e?Boolean(i.credit_card):(i.others??[]).some(t=>t.toLowerCase()===e.toLowerCase()))}function $e(e){return null!=e&&Number.isFinite(Number(e))?`€ ${Number(e).toFixed(3).replace(".",",")}`:"–"}var xe={version:"Version",invalid_configuration:"Invalid configuration",loading:"Loading…",no_data:"No data available"},we={cheapest:"Cheapest price",average:"Avg. price",price:"Price",closed:"Closed",closing_soon:"Closing soon",open_now:"Open",opening_hours:"Opening hours",payment:"Payment",cash:"Cash",debit_card:"Debit card",credit_card:"Credit card",payment_filter_active:"Payment filter active",payment_highlight_active:"Payment filter (highlight)",mon_fri:"Mon–Fri",sat:"Sat",sun:"Sun",holiday:"Holiday",map:"Map",per_liter:"/l",last_7_days:"Last 7 days",min_label:"Min",max_label:"Max",refresh:"Refresh",last_updated:"Updated:",no_new_data:"No new data",version_update:"Tankstellen Austria updated to v{v} — please reload",version_reload:"Reload",fill_up:"Fill up",best_refuel_hour:"Tip: Cheapest between {h1}:00–{h2}:00",best_refuel_hour_weekday:"Tip: Cheapest between {h1}:00–{h2}:00, usually {day}",not_enough_data_hint:"Not enough data yet for a tip (min. 7 days)",confidence_high:"High",confidence_medium:"Medium",confidence_low:"Low",confidence_title:"Recommendation confidence",confidence_span:"Data span",confidence_coverage:"Coverage",confidence_gap:"Gap",confidence_days:"days",confidence_cents:"¢",confidence_short_history_hint:"Note: Home Assistant keeps only 10 days of history by default. For better recommendations raise recorder.purge_keep_days to 30.",median_delta_below:"{c}¢ below median",median_delta_above:"{c}¢ above median",median_delta_equal:"at median"},Ae={DIE:"Diesel",SUP:"Super 95",GAS:"CNG"},ke=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Se={entities:"Sensors",entities_hint:"Leave empty for auto-detection",max_stations:"Number of stations",show_map_links:"Show Google Maps links",show_opening_hours:"Show opening hours",show_payment_methods:"Show payment methods",show_history:"Show price history",show_best_refuel:"Show refuel tip",show_median_line:"Show 7-day median",show_hour_envelope:"Typical hourly range (4 wk)",show_noon_markers:"Noon reset markers",recorder_hint_intro:"Home Assistant keeps only 10 days of history by default. For better recommendations, add this block to configuration.yaml and restart:",copy:"Copy",copied:"Copied",payment_filter:"Only stations with",payment_filter_custom_placeholder:"Custom, e.g. Routex",payment_filter_custom_hint:"Must match the API string exactly. Common values: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC",payment_highlight_mode:"Highlight instead of filter",section_sensors:"Sensors",section_display:"Display",section_payment_filter:"Payment filter",section_tab_labels:"Tab labels",tab_labels_hint:"Leave empty to use the default label",section_cars:"Cars",show_cars:"Show fill-up costs",show_car_fillup:"Show fill-up cost",show_car_consumption:"Show consumption",cars_both_off_hint:'No rows enabled. To hide cars entirely, use "Show fill-up costs" in Display options.',car_name_placeholder:"Name (e.g. Golf TDI)",car_tank_placeholder:"Liters",car_consumption_placeholder:"⌀ l/100km",add_car:"+ Add car"},Ee={common:xe,card:we,fuel_types:Ae,weekdays:ke,editor:Se},Ce={version:"Version",invalid_configuration:"Ungültige Konfiguration",loading:"Lädt…",no_data:"Keine Daten verfügbar"},ze={cheapest:"Günstigster Preis",average:"Ø Preis",price:"Preis",closed:"Geschlossen",closing_soon:"Schließt bald",open_now:"Geöffnet",opening_hours:"Öffnungszeiten",payment:"Zahlungsarten",cash:"Bar",debit_card:"Bankomat",credit_card:"Kreditkarte",payment_filter_active:"Zahlungsfilter aktiv",payment_highlight_active:"Zahlungsfilter (Hervorhebung)",mon_fri:"Mo–Fr",sat:"Sa",sun:"So",holiday:"Feiertag",map:"Karte",per_liter:"/l",last_7_days:"Letzte 7 Tage",min_label:"Min",max_label:"Max",refresh:"Aktualisieren",last_updated:"Aktualisiert:",no_new_data:"Keine neuen Daten",version_update:"Tankstellen Austria wurde auf v{v} aktualisiert — bitte neu laden",version_reload:"Neu laden",fill_up:"Volltanken",best_refuel_hour:"Tipp: Am günstigsten zwischen {h1}:00–{h2}:00",best_refuel_hour_weekday:"Tipp: Am günstigsten zwischen {h1}:00–{h2}:00, meist {day}",not_enough_data_hint:"Noch zu wenig Daten für Empfehlung (mind. 7 Tage)",confidence_high:"Hoch",confidence_medium:"Mittel",confidence_low:"Niedrig",confidence_title:"Empfehlungsgüte",confidence_span:"Datenumfang",confidence_coverage:"Abdeckung",confidence_gap:"Vorsprung",confidence_days:"Tage",confidence_cents:"Cent",confidence_short_history_hint:"Hinweis: Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen recorder.purge_keep_days auf 30 erhöhen.",median_delta_below:"{c}¢ unter Median",median_delta_above:"{c}¢ über Median",median_delta_equal:"auf Median"},Te={DIE:"Diesel",SUP:"Super 95",GAS:"CNG Erdgas"},Pe=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],Me={entities:"Sensoren",entities_hint:"Leer lassen für automatische Erkennung",max_stations:"Anzahl Tankstellen",show_map_links:"Google Maps Links anzeigen",show_opening_hours:"Öffnungszeiten anzeigen",show_payment_methods:"Zahlungsarten anzeigen",show_history:"Preisverlauf anzeigen",show_best_refuel:"Tank-Tipp anzeigen",show_median_line:"7-Tage-Median einblenden",show_hour_envelope:"Typischer Stundenverlauf (4 Wo)",show_noon_markers:"12:00-Markierung (Preisreset)",recorder_hint_intro:"Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen diesen Block in configuration.yaml ergänzen und neu starten:",copy:"Kopieren",copied:"Kopiert",payment_filter:"Nur Tankstellen mit",payment_filter_custom_placeholder:"Benutzerdefiniert, z.B. Routex",payment_filter_custom_hint:"Der Wert muss exakt dem API-String entsprechen. Häufige Werte: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC",payment_highlight_mode:"Hervorheben statt filtern",section_sensors:"Sensoren",section_display:"Anzeige",section_payment_filter:"Zahlungsfilter",section_tab_labels:"Tab-Bezeichnungen",tab_labels_hint:"Leer lassen, um die Standard-Bezeichnung zu verwenden",section_cars:"Fahrzeuge",show_cars:"Tankkosten anzeigen",show_car_fillup:"Tankkosten anzeigen",show_car_consumption:"Verbrauch anzeigen",cars_both_off_hint:"Keine Zeile aktiv. Um Fahrzeuge komplett auszublenden, nutze „Tankkosten anzeigen“ in den Anzeige-Optionen.",car_name_placeholder:"Name (z.B. Golf TDI)",car_tank_placeholder:"Liter",car_consumption_placeholder:"⌀ l/100km",add_car:"+ Fahrzeug hinzufügen"},Ne={common:Ce,card:ze,fuel_types:Te,weekdays:Pe,editor:Me};const Ue={en:Object.freeze({__proto__:null,card:we,common:xe,default:Ee,editor:Se,fuel_types:Ae,weekdays:ke}),de:Object.freeze({__proto__:null,card:ze,common:Ce,default:Ne,editor:Me,fuel_types:Te,weekdays:Pe})};function Oe(e,t){return e.split(".").reduce((e,t)=>{if(e&&"object"==typeof e&&t in e)return e[t]},t)}function He(e,t){const i=Oe(e,t);return"string"==typeof i?i:void 0}function De(e,t="",i=""){const s=("undefined"!=typeof localStorage&&localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_");let n=He(e,Ue[s]??Ue.en);return void 0===n&&(n=He(e,Ue.en)),void 0===n&&(n=e),""!==t&&""!==i&&(n=n.replace(t,i)),n}function Re(e){return(e.configLanguage||e.hassLanguage||"de").replace("-","_")}function Le(e,t){const i=Re(t),s=Oe("fuel_types",Ue[i]??Ue.de)??Oe("fuel_types",Ue.de),n=s?.[e];return"string"==typeof n?n:e}const je=o`
  :host {
    display: block;
  }
  ha-card {
    padding: 0;
    overflow: hidden;
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
    font-size: 13px;
  }
  .version-reload-btn {
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 12px;
    padding: 4px 12px;
  }

  /* Tabs */
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
  }
  .tab {
    flex: 1;
    padding: 12px 8px;
    background: none;
    border: none;
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    border-bottom: 2px solid transparent;
    font-family: inherit;
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
    font-size: 15px;
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
    font-size: 11px;
    color: var(--secondary-text-color);
    font-weight: 400;
  }
  .header-price-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-text-color);
  }
  .header-price-value.avg {
    font-size: 15px;
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
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  .car-icon {
    --mdc-icon-size: 14px;
    color: var(--secondary-text-color);
  }
  .car-fillup-liters {
    font-size: 11px;
    opacity: 0.65;
  }
  .car-fillup-cost {
    font-size: 14px;
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
    font-size: 11px;
    color: var(--secondary-text-color);
    opacity: 0.75;
  }
  .car-per100-cost {
    font-size: 12px;
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
    height: 48px;
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
    font-size: 11px;
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
    font-size: 10px;
    color: var(--secondary-text-color);
    padding: 2px 0 0;
  }
  .sparkline-period {
    font-size: 10px;
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
    font-size: 11px;
    font-weight: 500;
    color: var(--success-color, #4caf50);
    margin-top: 5px;
    line-height: 1.3;
  }
  .refuel-hint {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
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
    font-size: 9px;
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
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .info {
    flex: 1;
    min-width: 0;
  }
  .name {
    font-weight: 500;
    font-size: 14px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .address {
    font-size: 12px;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .price {
    font-weight: 700;
    font-size: 16px;
    color: var(--primary-text-color);
    white-space: nowrap;
  }
  .map-link {
    color: var(--secondary-text-color);
    transition: color 0.2s;
    flex-shrink: 0;
  }
  .map-link:hover {
    color: var(--primary-color);
  }
  .badge {
    font-size: 10px;
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
    font-size: 10px;
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
    font-size: 11px;
    color: var(--secondary-text-color);
  }
  .dynamic-meta-inner {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.2;
  }
  .no-new-data {
    font-size: 11px;
    color: var(--warning-color, #ff9800);
  }
  .refresh-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
    padding: 4px 8px;
    background: none;
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    color: var(--primary-color);
    font-size: 12px;
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

  /* Station-detail drawer */
  .station-detail {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    padding: 0 16px 0 52px;
  }
  .station-detail.expanded {
    max-height: 200px;
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
    font-size: 12px;
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
    font-size: 12px;
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
    gap: 3px;
    padding: 2px 7px;
    border-radius: 10px;
    font-size: 11px;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--secondary-text-color);
    border: 1px solid var(--divider-color, #e0e0e0);
  }
  .pm-badge.pm-other {
    font-style: italic;
  }
`,Ie=o`
  :host {
    display: block;
  }
  .editor {
    padding: var(--ha-space-4, 16px);
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-3, 12px);
  }
  .editor-section {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    border-radius: var(--ha-border-radius-lg, 12px);
    padding: var(--ha-space-3, 14px) var(--ha-space-4, 16px);
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-2, 10px);
  }
  .section-header {
    font-size: var(--ha-font-size-xs, 11px);
    font-weight: 600;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .editor-hint {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
    line-height: 1.4;
  }
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;var Fe,Be;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Fe||(Fe={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Be||(Be={}));let Ve=class extends ae{constructor(){super(...arguments),this._config={type:"tankstellen-austria-card"}}setConfig(e){this._config={...e}}render(){return B`
      <div class="editor">
        <div class="editor-section">
          <div class="section-header">${De("editor.section_main")}</div>

          <ha-textfield
            label=${De("editor.name")}
            .value=${this._config.name||""}
            .configValue=${"name"}
            @input=${this._valueChanged}
          ></ha-textfield>

          ${this.hass?B`
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{entity:{}}}
                  .value=${this._config.entity||void 0}
                  .configValue=${"entity"}
                  .label=${De("editor.entity")}
                  .required=${!1}
                  @value-changed=${this._valueChanged}
                ></ha-selector>
              `:B`<p>${De("common.loading")}</p>`}
        </div>

        <div class="editor-section">
          <div class="section-header">${De("editor.section_display")}</div>

          <div class="toggle-row">
            <label>${De("editor.show_warning")}</label>
            <ha-switch
              .checked=${this._config.show_warning??!1}
              .configValue=${"show_warning"}
              @change=${this._valueChanged}
            ></ha-switch>
          </div>

          <div class="toggle-row">
            <label>${De("editor.show_error")}</label>
            <ha-switch
              .checked=${this._config.show_error??!1}
              .configValue=${"show_error"}
              @change=${this._valueChanged}
            ></ha-switch>
          </div>
        </div>
      </div>
    `}_valueChanged(e){if(!this._config||!this.hass)return;const t=e.target;if(!t.configValue)return;const i=void 0!==t.checked?t.checked:e.detail?.value??t.value;this._config[t.configValue]!==i&&(this._config={...this._config,[t.configValue]:i},((e,t,i,s)=>{s=s||{},i=null==i?{}:i;const n=new Event(t,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});n.detail=i,e.dispatchEvent(n)})(this,"config-changed",{config:this._config}))}static{this.styles=Ie}};e([pe({attribute:!1})],Ve.prototype,"hass",void 0),e([ue()],Ve.prototype,"_config",void 0),Ve=e([le("tankstellen-austria-card-editor")],Ve),console.info(`%c  Tankstellen Austria Card  %c  ${De("common.version")} 1.6.0  `,"color: white; font-weight: bold; background: #DC2026","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"tankstellen-austria-card",name:"Tankstellen Austria",description:"Austrian fuel prices from E-Control with sparklines and best-refuel analytics.",preview:!0,documentationURL:"https://github.com/rolandzeiner/tankstellen-austria"});let We=class extends ae{constructor(){super(...arguments),this._activeTab=0,this._expandedStations=new Set}static getConfigElement(){return document.createElement("tankstellen-austria-card-editor")}static getStubConfig(e){const t=ve(e);return{entities:t.length?[t[0]]:[],max_stations:5,show_map_links:!0,show_opening_hours:!0,show_payment_methods:!0,show_history:!0,show_best_refuel:!0,payment_filter:[],payment_highlight_mode:!0,show_cars:!1,cars:[]}}setConfig(e){this._config=ye(e)}getCardSize(){return 6}shouldUpdate(e){if(!this._config)return!1;if(e.has("_config"))return!0;if(e.has("_activeTab")||e.has("_expandedStations"))return!0;const t=e.get("hass");if(!t)return!0;return this._trackedEntityIds().some(e=>t.states[e]!==this.hass.states[e])}_trackedEntityIds(){return this._config.entities?.length?this._config.entities:ve(this.hass)}_resolveEntities(){if(!this.hass)return[];return this._trackedEntityIds().map(e=>{const t=this.hass.states[e];return t?{entity_id:e,state:t.state,attributes:t.attributes,last_updated:t.last_updated}:null}).filter(e=>null!==e)}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_t(e,t){return function(e,t,i){const s=Re(t);let n=He(e,Ue[s]??Ue.de);if(void 0===n&&(n=He(e,Ue.de)),void 0===n&&(n=e),i)for(const[e,t]of Object.entries(i))n=n.replace(`{${e}}`,t);return n}(`card.${e}`,this._ctx(),t)}render(){if(!this.hass||!this._config)return B`<ha-card></ha-card>`;const e=this._resolveEntities(),t=this._activeTab>=e.length?0:this._activeTab;if(!e.length)return B`
        <ha-card>
          <div class="empty">${this._t("no_data")}</div>
        </ha-card>
      `;const i=e[t]??e[0];return B`
      <ha-card>
        ${this._renderTabs(e,t)}
        ${this._renderHeader(i)}
        ${this._renderCars(i)}
        ${this._renderStationList(i,t)}
      </ha-card>
    `}_renderTabs(e,t){if(e.length<=1)return W;const i=this._config.tab_labels??{};return B`
      <div class="tabs">
        ${e.map((e,s)=>{const n=i[e.entity_id];let r;if("string"==typeof n&&n.trim().length>0)r=n;else{if(r=Le(e.attributes.fuel_type??"",this._ctx()),!0===e.attributes.dynamic_mode){const t=e.attributes.dynamic_entity,i=t?this.hass.states[t]?.attributes?.friendly_name||t.split(".")[1]:null;i&&(r+=` · ${i}`)}}return B`
            <button
              class=${ge({tab:!0,active:s===t})}
              @click=${()=>this._onTabClick(s)}
            >
              ${r}
            </button>
          `})}
      </div>
    `}_renderHeader(e){const t=e.attributes.stations??[];if(!t.length)return W;const i=e.attributes.fuel_type??"",s=e.attributes.fuel_type_name||Le(i,this._ctx()),n=e.attributes.average_price,r=t[0]?.price,o=!0===e.attributes.dynamic_mode;return B`
      <div class="card-header">
        <div class="header-top">
          <div class="fuel-label">
            <ha-icon icon="mdi:gas-station" class="fuel-icon"></ha-icon>
            <span>${s}</span>
          </div>
          ${o?this._renderDynamicHeader(e):B`
                <div class="header-prices">
                  <div class="header-price-item">
                    <span class="header-price-label">${this._t("cheapest")}</span>
                    <span class="header-price-value">${$e(r)}</span>
                  </div>
                  ${null!=n?B`
                        <div class="header-price-item">
                          <span class="header-price-label">${this._t("average")}</span>
                          <span class="header-price-value avg">${$e(n)}</span>
                        </div>
                      `:W}
                </div>
              `}
        </div>
      </div>
    `}_renderDynamicHeader(e){const t=e.last_updated?new Date(e.last_updated).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"";return B`
      <div class="dynamic-meta">
        <div class="dynamic-meta-inner">
          ${t?B`<span class="last-updated">${this._t("last_updated")} ${t}</span>`:W}
        </div>
      </div>
      <button class="refresh-btn" @click=${this._onRefresh}>
        <ha-icon icon="mdi:refresh" class="refresh-icon"></ha-icon>
        ${this._t("refresh")}
      </button>
    `}_renderCars(e){const t=e.attributes.stations??[];if(!t.length)return W;const i=!0===this._config.show_cars,s=!1!==this._config.show_car_fillup,n=!1!==this._config.show_car_consumption;if(!i||!s&&!n)return W;const r=e.attributes.fuel_type??"",o=this._config.payment_filter??[],a=!0===this._config.payment_highlight_mode,c=(this._config.cars??[]).filter(e=>e.fuel_type===r&&e.tank_size>0&&e.name),l=s?c:c.filter(e=>Number(e.consumption)>0);if(!l.length)return W;const d=a?t:t.filter(e=>be(e,o)),h=a?t[0]?.price:d[0]?.price;return B`
      <div class="cars-fillup">
        ${l.map(e=>this._renderCarRow(e,h,s,n))}
      </div>
    `}_renderCarRow(e,t,i,s){const n=Number(e.consumption),r=Number.isFinite(n)&&n>0?n.toFixed(1).replace(".",","):"";if(i){const i=null!=t?`€ ${(t*Number(e.tank_size)).toFixed(2).replace(".",",")}`:"–",o=null!=t&&n>0?`€ ${(t*n).toFixed(2).replace(".",",")}`:"–";return B`
        <div class="car-fillup-row">
          <span class="car-fillup-name">
            <ha-icon icon=${e.icon||"mdi:car"} class="car-icon"></ha-icon>
            ${e.name}
            <span class="car-fillup-liters">${e.tank_size} L</span>
          </span>
          <span class="car-fillup-cost">${i}</span>
        </div>
        ${s&&n>0?B`
              <div class="car-per100-row">
                <span class="car-per100-label">${r} l/100 km</span>
                <span class="car-per100-cost">${o} / 100 km</span>
              </div>
            `:W}
      `}const o=null!=t?`€ ${(t*n).toFixed(2).replace(".",",")}`:"–";return B`
      <div class="car-fillup-row">
        <span class="car-fillup-name">
          <ha-icon icon=${e.icon||"mdi:car"} class="car-icon"></ha-icon>
          ${e.name}
          <span class="car-fillup-liters">${r} l/100 km</span>
        </span>
        <span class="car-fillup-cost">${o} / 100 km</span>
      </div>
    `}_renderStationList(e,t){const i=e.attributes.stations??[],s=parseInt(String(this._config.max_stations),10),n=Number.isFinite(s)?Math.max(0,Math.min(5,s)):5,r=this._config.payment_filter??[],o=!0===this._config.payment_highlight_mode,a=o?i:i.filter(e=>be(e,r));if(0===n)return W;if(!a.length&&r.length&&i.length)return B`
        <div class="empty">
          ${this._t("payment_filter_active")} — ${this._t("no_data")}
        </div>
      `;if(!a.length)return B`<div class="empty">${this._t("no_data")}</div>`;const c=a.slice(0,n);return B`
      <div class="stations">
        ${c.map((e,i)=>this._renderStation(e,i,t,r,o))}
      </div>
    `}_renderStation(e,t,i,s,n){const r=!1!==this._config.show_map_links,o=!1!==this._config.show_opening_hours,a=!1!==this._config.show_payment_methods,c=e.location??{},l=`${i}-${t}`,d=this._expandedStations.has(l),h=!1===e.open,p=!h&&function(e,t=new Date){if(!1===e.open)return!1;const i=e.opening_hours??[];if(!i.length)return!1;const s=t.getDay(),n=0===s?"SO":6===s?"SA":"MO",r=i.find(e=>e.day===n);if(!r||!r.to)return!1;if("00:00"===r.from&&"24:00"===r.to)return!1;const[o,a]=r.to.split(":"),c=parseInt(o,10),l=parseInt(a,10);if(!Number.isFinite(c)||!Number.isFinite(l))return!1;const d=new Date(t);0===c&&0===l?(d.setDate(d.getDate()+1),d.setHours(0,0,0,0)):d.setHours(c,l,0,0);const h=(d.getTime()-t.getTime())/6e4;return h>0&&h<=30}(e),u=n&&s.length>0&&be(e,s),f=u?function(e,t,i){if(!t||!t.length)return[];const s=e.payment_methods??{},n=[];for(const e of t)if("cash"===e&&s.cash)n.push(i.cash);else if("debit_card"===e&&s.debit_card)n.push(i.debit_card);else if("credit_card"===e&&s.credit_card)n.push(i.credit_card);else{const t=(s.others??[]).find(t=>t.toLowerCase()===e.toLowerCase());t&&n.push(t)}return n}(e,s,{cash:this._t("cash"),debit_card:this._t("debit_card"),credit_card:this._t("credit_card")}):[],_=o&&!!e.opening_hours?.length,g=a&&(!!(m=e.payment_methods)&&Boolean(m.cash||m.debit_card||m.credit_card||m.others&&m.others.length>0));var m;const y=_||g;return B`
      <div class=${ge({station:!0,"pm-highlight":u})}>
        <div
          class="station-main"
          @click=${()=>this._onStationClick(l)}
        >
          <div class="rank">${t+1}</div>
          <div class="info">
            <div class="name">
              ${e.name||"–"}
              ${h?B`<span class="badge closed">${this._t("closed")}</span>`:p?B`<span class="badge closing-soon">${this._t("closing_soon")}</span>`:W}
              ${f.map(e=>B`<span class="pm-match-chip">${e}</span>`)}
            </div>
            <div class="address">
              ${c.postalCode??""} ${c.city??""},
              ${c.address??""}
            </div>
          </div>
          <div class="price">${$e(e.price)}</div>
          ${r?B`
                <a
                  class="map-link"
                  href=${function(e,t){if(!e)return"#";if(/\d/.test(e.address??"")){const t=`${e.postalCode??""} ${e.city??""} ${e.address??""}`.trim();return`https://maps.google.com/?q=${encodeURIComponent(t)}`}const i=[t,e.address,e.postalCode,e.city].filter(e=>null!=e&&""!==e);return`https://www.google.com/search?q=${encodeURIComponent(i.join(" "))}`}(c,e.name??"")}
                  target="_blank"
                  rel="noopener noreferrer"
                  title=${this._t("map")}
                  @click=${this._onMapLinkClick}
                >
                  <ha-icon
                    icon=${/\d/.test(c.address??"")?"mdi:map-marker":"mdi:magnify"}
                    class="map-icon"
                  ></ha-icon>
                </a>
              `:W}
        </div>
        ${y?B`
              <div class=${ge({"station-detail":!0,expanded:d})}>
                <div class="detail-cols">
                  ${_?B`<div class="detail-col">${this._renderHours(e.opening_hours??[])}</div>`:W}
                  ${g?B`<div class="detail-col">${this._renderPaymentMethods(e.payment_methods)}</div>`:W}
                </div>
              </div>
            `:W}
      </div>
    `}_renderHours(e){const t=e.find(e=>"MO"===e.day)??e[0],i=e.find(e=>"SA"===e.day)??e[5],s=e.find(e=>"SO"===e.day)??e[6],n=e.find(e=>"FE"===e.day);return B`
      <div class="hours-grid">
        ${t?B`<span class="day">${this._t("mon_fri")}</span><span>${t.from} – ${t.to}</span>`:W}
        ${i?B`<span class="day">${this._t("sat")}</span><span>${i.from} – ${i.to}</span>`:W}
        ${s?B`<span class="day">${this._t("sun")}</span><span>${s.from} – ${s.to}</span>`:W}
        ${n?B`<span class="day">${this._t("holiday")}</span><span>${n.from} – ${n.to}</span>`:W}
      </div>
    `}_renderPaymentMethods(e){if(!e)return W;const t=[];e.cash&&t.push(B`
        <span class="pm-badge">
          <ha-icon icon="mdi:cash" class="pm-icon"></ha-icon>
          ${this._t("cash")}
        </span>
      `),e.debit_card&&t.push(B`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon"></ha-icon>
          ${this._t("debit_card")}
        </span>
      `),e.credit_card&&t.push(B`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon"></ha-icon>
          ${this._t("credit_card")}
        </span>
      `);for(const i of e.others??[])t.push(B`<span class="pm-badge pm-other">${i}</span>`);return t.length?B`
      <div class="pm-section">
        <div class="pm-label">${this._t("payment")}</div>
        <div class="pm-badges">${t}</div>
      </div>
    `:W}_onTabClick(e){this._activeTab!==e&&(this._activeTab=e,this._expandedStations=new Set)}_onStationClick(e){const t=new Set(this._expandedStations);t.has(e)?t.delete(e):t.add(e),this._expandedStations=t}_onMapLinkClick(e){e.stopPropagation()}_onRefresh(){if(this.hass)for(const e of this._resolveEntities()){const t=this.hass.callService("homeassistant","update_entity",{entity_id:e.entity_id});t&&"function"==typeof t.catch&&t.catch(t=>{console.warn("[Tankstellen Austria] update_entity failed for",e.entity_id,t)})}}static{this.styles=je}};e([pe({attribute:!1})],We.prototype,"hass",void 0),e([ue()],We.prototype,"_config",void 0),e([ue()],We.prototype,"_activeTab",void 0),e([ue()],We.prototype,"_expandedStations",void 0),We=e([le("tankstellen-austria-card")],We);export{We as TankstellenAustriaCard};
