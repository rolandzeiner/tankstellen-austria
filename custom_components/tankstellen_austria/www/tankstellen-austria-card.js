// Tankstellen Austria Card — bundled by Rollup. Edit sources in src/, then `npm run build`.
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let r=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=n.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&n.set(i,e))}return e}toString(){return this.cssText}};const a=(e,...t)=>{const n=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new r(n,e,i)},o=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:s,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,_=m?m.emptyScript:"",f=u.reactiveElementPolyfillSupport,g=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},y=(e,t)=>!s(e,t),b={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=b){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&l(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:r}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const a=n?.call(this);r?.call(this,t),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??b}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const e=this.properties,t=[...d(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,n)=>{if(t)i.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of n){const n=document.createElement("style"),r=e.litNonce;void 0!==r&&n.setAttribute("nonce",r),n.textContent=t.cssText,i.appendChild(n)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=n;const a=r.fromAttribute(t,e.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(e,t,i,n=!1,r){if(void 0!==e){const a=this.constructor;if(!1===n&&(r=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??y)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:r},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==r||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[g("elementProperties")]=new Map,x[g("finalized")]=new Map,f?.({ReactiveElement:x}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,$=e=>e,k=w.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,T=`<${M}>`,E=document,z=()=>E.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,D=Array.isArray,N="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,I=/>/g,F=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,O=/"/g,U=/^(?:script|style|textarea|title)$/i,j=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),B=j(1),V=j(2),q=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),G=new WeakMap,K=E.createTreeWalker(E,129);function Z(e,t){if(!D(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const J=(e,t)=>{const i=e.length-1,n=[];let r,a=2===t?"<svg>":3===t?"<math>":"",o=H;for(let t=0;t<i;t++){const i=e[t];let s,l,c=-1,d=0;for(;d<i.length&&(o.lastIndex=d,l=o.exec(i),null!==l);)d=o.lastIndex,o===H?"!--"===l[1]?o=R:void 0!==l[1]?o=I:void 0!==l[2]?(U.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=F):void 0!==l[3]&&(o=F):o===F?">"===l[0]?(o=r??H,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,s=l[1],o=void 0===l[3]?F:'"'===l[3]?O:L):o===O||o===L?o=F:o===R||o===I?o=H:(o=F,r=void 0);const h=o===F&&e[t+1].startsWith("/>")?" ":"";a+=o===H?i+T:c>=0?(n.push(s),i.slice(0,c)+S+i.slice(c)+C+h):i+C+(-2===c?t:h)}return[Z(e,a+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class Q{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let r=0,a=0;const o=e.length-1,s=this.parts,[l,c]=J(e,t);if(this.el=Q.createElement(l,i),K.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=K.nextNode())&&s.length<o;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(S)){const t=c[a++],i=n.getAttribute(e).split(C),o=/([.?@])?(.*)/.exec(t);s.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?ie:"?"===o[1]?ne:"@"===o[1]?re:te}),n.removeAttribute(e)}else e.startsWith(C)&&(s.push({type:6,index:r}),n.removeAttribute(e));if(U.test(n.tagName)){const e=n.textContent.split(C),t=e.length-1;if(t>0){n.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],z()),K.nextNode(),s.push({type:2,index:++r});n.append(e[t],z())}}}else if(8===n.nodeType)if(n.data===M)s.push({type:2,index:r});else{let e=-1;for(;-1!==(e=n.data.indexOf(C,e+1));)s.push({type:7,index:r}),e+=C.length-1}r++}}static createElement(e,t){const i=E.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,n){if(t===q)return t;let r=void 0!==n?i._$Co?.[n]:i._$Cl;const a=P(t)?void 0:t._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(e),r._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=r:i._$Cl=r),void 0!==r&&(t=Y(e,r._$AS(e,t.values),r,n)),t}class X{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??E).importNode(t,!0);K.currentNode=n;let r=K.nextNode(),a=0,o=0,s=i[0];for(;void 0!==s;){if(a===s.index){let t;2===s.type?t=new ee(r,r.nextSibling,this,e):1===s.type?t=new s.ctor(r,s.name,s.strings,this,e):6===s.type&&(t=new ae(r,this,e)),this._$AV.push(t),s=i[++o]}a!==s?.index&&(r=K.nextNode(),a++)}return K.currentNode=E,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class ee{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),P(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>D(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Q.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new X(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new Q(e)),t}k(e){D(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const r of e)n===t.length?t.push(i=new ee(this.O(z()),this.O(z()),this,this.options)):i=t[n],i._$AI(r),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class te{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,r){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(e,t=this,i,n){const r=this.strings;let a=!1;if(void 0===r)e=Y(this,e,t,0),a=!P(e)||e!==this._$AH&&e!==q,a&&(this._$AH=e);else{const n=e;let o,s;for(e=r[0],o=0;o<r.length-1;o++)s=Y(this,n[i+o],t,o),s===q&&(s=this._$AH[o]),a||=!P(s)||s!==this._$AH[o],s===W?e=W:e!==W&&(e+=(s??"")+r[o+1]),this._$AH[o]=s}a&&!n&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ie extends te{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class ne extends te{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class re extends te{constructor(e,t,i,n,r){super(e,t,i,n,r),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??W)===q)return;const i=this._$AH,n=e===W&&i!==W||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==W&&(i===W||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ae{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const oe=w.litHtmlPolyfillSupport;oe?.(Q,ee),(w.litHtmlVersions??=[]).push("3.3.2");const se=globalThis;let le=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let r=n._$litPart$;if(void 0===r){const e=i?.renderBefore??null;n._$litPart$=r=new ee(t.insertBefore(z(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};le._$litElement$=!0,le.finalized=!0,se.litElementHydrateSupport?.({LitElement:le});const ce=se.litElementPolyfillSupport;ce?.({LitElement:le}),(se.litElementVersions??=[]).push("4.2.2");const de=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},he={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:y},pe=(e=he,t,i)=>{const{kind:n,metadata:r}=i;let a=globalThis.litPropertyMetadata.get(r);if(void 0===a&&globalThis.litPropertyMetadata.set(r,a=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const r=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,r,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const r=this[n];t.call(this,i),this.requestUpdate(n,r,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function ue(e){return(t,i)=>"object"==typeof i?pe(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function me(e){return ue({...e,state:!0,attribute:!1})}const _e=1;class fe{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const ge=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends fe{constructor(e){if(super(e),e.type!==_e||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const i=e.element.classList;for(const e of this.st)e in t||(i.remove(e),this.st.delete(e));for(const e in t){const n=!!t[e];n===this.st.has(e)||this.nt?.has(e)||(n?(i.add(e),this.st.add(e)):(i.remove(e),this.st.delete(e)))}return q}}),ve=12e4,ye=["mdi:car","mdi:car-sports","mdi:car-hatchback","mdi:car-estate","mdi:car-convertible","mdi:car-pickup","mdi:car-electric","mdi:car-electric-outline","mdi:car-side","mdi:van-passenger","mdi:motorbike","mdi:bus","mdi:truck","mdi:rv-truck"],be=["DIE","SUP","GAS"];function xe(e){if(!e)throw new Error("tankstellen-austria-card: config missing");const t={...e};if("string"==typeof t.entities&&(t.entities=[t.entities]),Array.isArray(t.entities)?t.entities=t.entities.filter(e=>"string"==typeof e&&e.includes(".")):null!=t.entities&&(console.warn("[Tankstellen Austria] config.entities must be an array of entity IDs — ignoring",t.entities),delete t.entities),null!=t.max_stations){const e=parseInt(String(t.max_stations),10);t.max_stations=Number.isFinite(e)?Math.max(0,Math.min(5,e)):5}return Array.isArray(t.payment_filter)?t.payment_filter=t.payment_filter.filter(e=>"string"==typeof e&&e.length>0):null!=t.payment_filter&&delete t.payment_filter,Array.isArray(t.cars)?t.cars=t.cars.map(e=>function(e){if(!e||"object"!=typeof e)return null;const t=e,i="string"==typeof t.name?t.name.slice(0,50):"",n=be.includes(t.fuel_type)?t.fuel_type:"DIE",r=parseInt(String(t.tank_size),10),a=Number.isFinite(r)&&r>=1?Math.min(200,r):50;let o;if(null!=t.consumption){const e=parseFloat(String(t.consumption));Number.isFinite(e)&&e>=0&&(o=Math.min(30,e))}const s={name:i,fuel_type:n,tank_size:a,icon:"string"==typeof t.icon&&t.icon.startsWith("mdi:")?t.icon:"mdi:car"};return null!=o&&(s.consumption=o),s}(e)).filter(e=>null!==e):null!=t.cars&&delete t.cars,t}function we(e){return e&&e.states?Object.keys(e.states).filter(t=>{const i=e.states[t];return t.startsWith("sensor.")&&i?.attributes?.fuel_type&&Array.isArray(i.attributes.stations)}):[]}function $e(e,t,i){if("cash"===t)return e.cash?i?.cash??"cash":null;if("debit_card"===t)return e.debit_card?i?.debit_card??"debit_card":null;if("credit_card"===t)return e.credit_card?i?.credit_card??"credit_card":null;const n=(e.others??[]).find(e=>e.toLowerCase()===t.toLowerCase());return n??null}function ke(e,t){if(!t||!t.length)return!0;const i=e.payment_methods??{};return t.some(e=>null!==$e(i,e))}function Ae(e){return null!=e&&Number.isFinite(Number(e))?`€ ${Number(e).toFixed(3).replace(".",",")}`:"–"}function Se(e){return null!=e&&Number.isFinite(Number(e))?Number(e).toFixed(3).replace(".",","):"–"}var Ce={version:"Version",invalid_configuration:"Invalid configuration",loading:"Loading…",no_data:"No data available"},Me={cheapest:"Cheapest price",average:"Avg. price",price:"Price",closed:"Closed",closing_soon:"Closing soon",open_now:"Open",opening_hours:"Opening hours",payment:"Payment",cash:"Cash",debit_card:"Debit card",credit_card:"Credit card",payment_filter_active:"Payment filter active",payment_highlight_active:"Payment filter (highlight)",mon_fri:"Mon–Fri",sat:"Sat",sun:"Sun",holiday:"Holiday",map:"Map",per_liter:"/l",last_7_days:"Last 7 days",min_label:"Min",max_label:"Max",refresh:"Refresh",last_updated:"Updated:",no_new_data:"No new data",version_update:"Tankstellen Austria updated to v{v} — please reload",version_reload:"Reload",version_reload_stuck:"Reload didn't load the new version. Check HACS and do a hard refresh (Ctrl+Shift+R).",version_dismiss:"Dismiss",fill_up:"Fill up",best_refuel_hour:"Tip: Cheapest between {h1}:00–{h2}:00",best_refuel_hour_weekday:"Tip: Cheapest between {h1}:00–{h2}:00, usually {day}",not_enough_data_hint:"Not enough data yet for a tip (min. 7 days)",confidence_high:"High",confidence_medium:"Medium",confidence_low:"Low",confidence_title:"Recommendation confidence",confidence_span:"Data span",confidence_coverage:"Coverage",confidence_gap:"Gap",confidence_days:"days",confidence_cents:"¢",confidence_short_history_hint:"Note: Home Assistant keeps only 10 days of history by default. For better recommendations raise recorder.purge_keep_days to 30.",median_delta_below:"{c}¢ below median",median_delta_above:"{c}¢ above median",median_delta_equal:"at median",loading:"Loading…",sparkline_open_more_info:"Open price history",sparkline_aria_summary:"Price history last 7 days: minimum {min}, maximum {max}, median {median}",sparkline_aria_simple:"Price history last 7 days: minimum {min}, maximum {max}",history_fetch_error:"Couldn't load price history"},Te={DIE:"Diesel",SUP:"Super 95",GAS:"CNG"},Ee=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],ze={entities:"Sensors",entities_hint:"Leave empty for auto-detection",entity_missing:"Sensor {entity} no longer exists. Pick a different sensor or remove it from this card's entities list.",max_stations:"Number of stations",show_index:"Show rank",show_map_links:"Show navigation links",map_provider:"Navigation app",map_provider_auto:"Automatic (by device)",map_provider_google:"Always Google Maps",map_provider_apple:"Always Apple Maps",show_distance:"Show distance",sort_by_distance:"Sort by distance",show_opening_hours:"Show opening hours",show_payment_methods:"Show payment methods",show_history:"Show price history",show_best_refuel:"Show refuel tip",show_median_line:"Show 7-day median",show_hour_envelope:"Typical hourly range (4 wk)",show_noon_markers:"Noon reset markers",show_minmax:"Show min/max",recorder_hint_intro:"Home Assistant keeps only 10 days of history by default. For better recommendations, add this block to configuration.yaml and restart:",recorder_hint_docs:"Read the recorder docs",copy:"Copy",copied:"Copied",payment_filter:"Only stations with",payment_filter_custom_placeholder:"Custom, e.g. Routex",payment_filter_custom_hint:"Must match the API string exactly. Common values: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC",payment_filter_add_custom:"Add custom payment method",payment_highlight_mode:"Highlight instead of filter",section_sensors:"Sensors",section_display:"Display",section_payment_filter:"Payment filter",section_tab_labels:"Tab labels",tab_labels_hint:"Leave empty to use the default label",section_cars:"Cars",show_cars:"Show fill-up costs",show_car_fillup:"Show fill-up cost",show_car_consumption:"Show consumption",cars_both_off_hint:'No rows enabled. To hide cars entirely, use "Show fill-up costs" in Display options.',car_name_placeholder:"Name (e.g. Golf TDI)",car_tank_placeholder:"Liters",car_consumption_placeholder:"⌀ l/100km",car_fuel_type:"Fuel type",car_choose_icon:"Choose icon",car_delete:"Delete car",add_car:"+ Add car",copy_sensor_id:"Copy sensor ID to clipboard",tank_size_range_error:"Please enter a value between 1 and 200 litres",consumption_range_error:"Please enter a value between 0 and 30 l/100 km",hide_header_price:"Hide cheapest / average price in header",section_branding:"Branding & attribution",section_history:"Price history",logo_adapt_to_theme:"Adapt E-Control logo color to theme",hide_header:"Hide header",hide_attribution:"Hide attribution footer"},Pe={common:Ce,card:Me,fuel_types:Te,weekdays:Ee,editor:ze},De=Object.freeze({__proto__:null,card:Me,common:Ce,default:Pe,editor:ze,fuel_types:Te,weekdays:Ee}),Ne={version:"Version",invalid_configuration:"Ungültige Konfiguration",loading:"Lädt…",no_data:"Keine Daten verfügbar"},He={cheapest:"Günstigster Preis",average:"Ø Preis",price:"Preis",closed:"Geschlossen",closing_soon:"Schließt bald",open_now:"Geöffnet",opening_hours:"Öffnungszeiten",payment:"Zahlungsarten",cash:"Bar",debit_card:"Bankomat",credit_card:"Kreditkarte",payment_filter_active:"Zahlungsfilter aktiv",payment_highlight_active:"Zahlungsfilter (Hervorhebung)",mon_fri:"Mo–Fr",sat:"Sa",sun:"So",holiday:"Feiertag",map:"Karte",per_liter:"/l",last_7_days:"Letzte 7 Tage",min_label:"Min",max_label:"Max",refresh:"Aktualisieren",last_updated:"Aktualisiert:",no_new_data:"Keine neuen Daten",version_update:"Tankstellen Austria wurde auf v{v} aktualisiert — bitte neu laden",version_reload:"Neu laden",version_reload_stuck:"Neu-Laden hat die neue Version nicht geladen. In HACS prüfen und einen harten Reload (Strg+Umschalt+R) ausführen.",version_dismiss:"Ausblenden",fill_up:"Volltanken",best_refuel_hour:"Tipp: Am günstigsten zwischen {h1}:00–{h2}:00",best_refuel_hour_weekday:"Tipp: Am günstigsten zwischen {h1}:00–{h2}:00, meist {day}",not_enough_data_hint:"Noch zu wenig Daten für Empfehlung (mind. 7 Tage)",confidence_high:"Hoch",confidence_medium:"Mittel",confidence_low:"Niedrig",confidence_title:"Empfehlungsgüte",confidence_span:"Datenumfang",confidence_coverage:"Abdeckung",confidence_gap:"Vorsprung",confidence_days:"Tage",confidence_cents:"Cent",confidence_short_history_hint:"Hinweis: Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen recorder.purge_keep_days auf 30 erhöhen.",median_delta_below:"{c}¢ unter Median",median_delta_above:"{c}¢ über Median",median_delta_equal:"auf Median",loading:"Wird geladen…",sparkline_open_more_info:"Preisverlauf öffnen",sparkline_aria_summary:"Preisverlauf der letzten 7 Tage: Minimum {min}, Maximum {max}, Median {median}",sparkline_aria_simple:"Preisverlauf der letzten 7 Tage: Minimum {min}, Maximum {max}",history_fetch_error:"Preisverlauf konnte nicht geladen werden"},Re={DIE:"Diesel",SUP:"Super 95",GAS:"CNG Erdgas"},Ie=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],Fe={entities:"Sensoren",entities_hint:"Leer lassen für automatische Erkennung",entity_missing:"Sensor {entity} existiert nicht mehr. Wählen Sie einen anderen Sensor oder entfernen Sie ihn aus den Entitäten dieser Karte.",max_stations:"Anzahl Tankstellen",show_index:"Platzierung anzeigen",show_map_links:"Navigations-Links anzeigen",map_provider:"Navigations-App",map_provider_auto:"Automatisch (je Gerät)",map_provider_google:"Immer Google Maps",map_provider_apple:"Immer Apple Maps",show_distance:"Luftlinie anzeigen",sort_by_distance:"Nach Luftlinie sortieren",show_opening_hours:"Öffnungszeiten anzeigen",show_payment_methods:"Zahlungsarten anzeigen",show_history:"Preisverlauf anzeigen",show_best_refuel:"Tank-Tipp anzeigen",show_median_line:"7-Tage-Median einblenden",show_hour_envelope:"Typischer Stundenverlauf (4 Wo)",show_noon_markers:"12:00-Markierung (Preisreset)",show_minmax:"Min/Max anzeigen",recorder_hint_intro:"Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen diesen Block in configuration.yaml ergänzen und neu starten:",recorder_hint_docs:"Recorder-Dokumentation lesen",copy:"Kopieren",copied:"Kopiert",payment_filter:"Nur Tankstellen mit",payment_filter_custom_placeholder:"Benutzerdefiniert, z.B. Routex",payment_filter_custom_hint:"Der Wert muss exakt dem API-String entsprechen. Häufige Werte: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC",payment_filter_add_custom:"Benutzerdefinierte Zahlungsmethode hinzufügen",payment_highlight_mode:"Hervorheben statt filtern",section_sensors:"Sensoren",section_display:"Anzeige",section_payment_filter:"Zahlungsfilter",section_tab_labels:"Tab-Bezeichnungen",tab_labels_hint:"Leer lassen, um die Standard-Bezeichnung zu verwenden",section_cars:"Fahrzeuge",show_cars:"Tankkosten anzeigen",show_car_fillup:"Tankkosten anzeigen",show_car_consumption:"Verbrauch anzeigen",cars_both_off_hint:"Keine Zeile aktiv. Um Fahrzeuge komplett auszublenden, nutze „Tankkosten anzeigen“ in den Anzeige-Optionen.",car_name_placeholder:"Name (z.B. Golf TDI)",car_tank_placeholder:"Liter",car_consumption_placeholder:"⌀ l/100km",car_fuel_type:"Kraftstoffart",car_choose_icon:"Symbol wählen",car_delete:"Fahrzeug entfernen",add_car:"+ Fahrzeug hinzufügen",copy_sensor_id:"Sensor-ID in die Zwischenablage kopieren",tank_size_range_error:"Bitte einen Wert zwischen 1 und 200 Litern eingeben",consumption_range_error:"Bitte einen Wert zwischen 0 und 30 l/100 km eingeben",hide_header_price:"Günstigster/Durchschnittspreis im Header ausblenden",section_branding:"Branding & Quellenangabe",section_history:"Preisverlauf",logo_adapt_to_theme:"E-Control-Logo an Theme-Farbe anpassen",hide_header:"Kopfzeile ausblenden",hide_attribution:"Quellenangabe ausblenden"},Le={common:Ne,card:He,fuel_types:Re,weekdays:Ie,editor:Fe};const Oe=Object.freeze({__proto__:null,card:He,common:Ne,default:Le,editor:Fe,fuel_types:Re,weekdays:Ie}),Ue={en:De,de:Oe};function je(e,t){return e.split(".").reduce((e,t)=>{if(e&&"object"==typeof e&&t in e)return e[t]},t)}function Be(e,t){const i=je(e,t);return"string"==typeof i?i:void 0}function Ve(e){return(e.configLanguage||e.hassLanguage||"de").replace("-","_")}function qe(e,t,i){const n=Ve(t);let r=Be(e,Ue[n]??Oe);if(void 0===r&&(r=Be(e,Oe)),void 0===r&&(r=e),i)for(const[e,t]of Object.entries(i))r=r.replace(`{${e}}`,t);return r}function We(e){const t=Ve(e),i=je("weekdays",Ue[t]??Oe);if(Array.isArray(i)&&i.every(e=>"string"==typeof e))return i;const n=je("weekdays",Oe);return Array.isArray(n)?n:[]}function Ge(e,t){const i=Ve(t),n=je("fuel_types",Ue[i]??Oe)??je("fuel_types",Oe),r=n?.[e];return"string"==typeof r?r:e}const Ke=new Map,Ze=new Map;function Je(e){if("number"==typeof e.lu)return Math.round(1e3*e.lu);const t=e.lu??e.last_updated??e.last_changed;return t?new Date(t).getTime():0}function Qe(e){return Ke.get(e)??[]}function Ye(e){const t=e.length;if(0===t)return"";if(1===t)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;if(2===t)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)} L ${e[1].x.toFixed(2)} ${e[1].y.toFixed(2)}`;const i=new Array(t-1);for(let n=0;n<t-1;n++){const t=e[n+1].x-e[n].x;i[n]=0===t?0:(e[n+1].y-e[n].y)/t}const n=new Array(t);n[0]=i[0],n[t-1]=i[t-2];for(let e=1;e<t-1;e++)n[e]=(i[e-1]+i[e])/2;for(let e=0;e<t-1;e++){if(0===i[e]){n[e]=0,n[e+1]=0;continue}const t=n[e]/i[e],r=n[e+1]/i[e],a=t*t+r*r;if(a>9){const o=3/Math.sqrt(a);n[e]=o*t*i[e],n[e+1]=o*r*i[e]}}let r=`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;for(let i=0;i<t-1;i++){const t=e[i+1].x-e[i].x,a=e[i].x+t/3,o=e[i].y+n[i]*t/3,s=e[i+1].x-t/3,l=e[i+1].y-n[i+1]*t/3;r+=` C ${a.toFixed(2)} ${o.toFixed(2)}, ${s.toFixed(2)} ${l.toFixed(2)}, ${e[i+1].x.toFixed(2)} ${e[i+1].y.toFixed(2)}`}return r}function Xe(e,t,i){return Math.max(t,Math.min(i,e))}function et(e,t){const i=e.filter(e=>Number.isFinite(e.value)&&e.weight>0);if(0===i.length)return NaN;if(1===i.length)return i[0].value;const n=[...i].sort((e,t)=>e.value-t.value),r=n.reduce((e,t)=>e+t.weight,0),a=Xe(t,0,1)*r;let o=0;for(const e of n)if(o+=e.weight,o>=a)return e.value;return n[n.length-1].value}const tt=280,it=48;function nt(e){if(e.length<2)return null;const t=[...e].sort((e,t)=>e-t),i=(t.length-1)/2,n=(t[Math.floor(i)]+t[Math.ceil(i)])/2,r=100*(e[e.length-1]-n),a=Math.abs(r).toFixed(1);return r<=-.05?{key:"median_delta_below",cents:a,cls:"median-delta-good"}:r>=.05?{key:"median_delta_above",cents:a,cls:"median-delta-bad"}:{key:"median_delta_equal",cents:a,cls:"median-delta-neutral"}}function rt(e,t){const i=[...e].sort((e,t)=>e-t),n=(i.length-1)/2;return t((i[Math.floor(n)]+i[Math.ceil(n)])/2)}function at(e){const t={template:W,hoverPoints:[],medianDelta:null,viewBoxWidth:tt,viewBoxHeight:it};try{const i=e.points;if(!i||i.length<2)return t;let n=function(e){const t=Date.now()-6048e5,i=e.filter(e=>e.time>=t),n=e.filter(e=>e.time<t),r=n.length?n[n.length-1]:null;return r?[{time:t,value:r.value},...i]:i}(i);if(n.length<2)return t;const r=18e5,a=n[n.length-1];a.time<Date.now()-r&&(n=[...n,{time:Date.now(),value:a.value}]);const o=n.map(e=>e.value),s=Math.min(...o),l=Math.max(...o);let c=s,d=l;const h=e.showHourEnvelope?e.hourEnvelope??null:null;if(h)for(let e=0;e<24;e++){const t=h.minByHour[e],i=h.maxByHour[e];null!=t&&null!=i&&(c=Math.min(c,t),d=Math.max(d,i))}const p=d-c||.01,u=e=>44-(e-c)/p*40,m=n.map((e,t)=>({x:t/(n.length-1)*tt,y:u(e.value)})),_=Ye(m),f=_?`${_} L ${tt.toFixed(2)} ${it.toFixed(2)} L 0 ${it.toFixed(2)} Z`:"";let g=W;if(h){const e=[],t=[];for(let i=0;i<n.length;i++){const r=new Date(n[i].time).getHours(),a=h.maxByHour[r],o=h.minByHour[r];null!=a&&null!=o&&(e.push({x:m[i].x,y:u(a)}),t.push({x:m[i].x,y:u(o)}))}if(e.length>=2){const i=function(e,t){if(!e||!t||e.length<2||e.length!==t.length)return"";const i=Ye(e),n=Ye([...t].reverse()).replace(/^M\s+([-\d.]+)\s+([-\d.]+)/,(e,t,i)=>`L ${t} ${i}`);return`${i} ${n} Z`}(e,t);i&&(g=V`<path d=${i} fill="var(--primary-color)" fill-opacity="0.08" stroke="none"/>`)}}const v=n[0].time,y=n[n.length-1].time,b=e=>{if(e<=v||e>=y)return null;let t=0,i=n.length-1;for(;t<i-1;){const r=t+i>>1;n[r].time<=e?t=r:i=r}const r=n[t+1].time-n[t].time,a=r>0?(e-n[t].time)/r:0;return m[t].x+a*(m[t+1].x-m[t].x)},x=[];if(e.showNoonMarkers&&n.length>=2){const e=new Date(v);for(e.setHours(12,0,0,0),e.getTime()<v&&e.setDate(e.getDate()+1);e.getTime()<=y;e.setDate(e.getDate()+1),e.setHours(12,0,0,0)){const t=b(e.getTime());null!=t&&x.push(V`
          <line x1=${t.toFixed(1)} y1="0" x2=${t.toFixed(1)} y2=${it}
                stroke="var(--secondary-text-color)" stroke-width="0.5"
                stroke-dasharray="2,3" opacity="0.55"/>
        `)}}const w=e.showMedianLine?nt(o):null,$=e.showMedianLine?V`<line x1="0" y1=${rt(o,u).toFixed(1)}
                  x2=${tt} y2=${rt(o,u).toFixed(1)}
                  stroke="var(--secondary-text-color)" stroke-width="0.5"
                  stroke-dasharray="4,3" opacity="0.55"/>`:W,k=function(e){if(!e?.hasEnoughData||null==e.hour)return null;const t=new Date,i=new Date(t);if(null!=e.weekday){let n=(t.getDay()-e.weekday+7)%7;0===n&&t.getHours()<e.hour&&(n=7),i.setDate(i.getDate()-n)}else t.getHours()<e.hour&&i.setDate(i.getDate()-1);i.setHours(e.hour,0,0,0);const n=i.getTime();return{startMs:n,endMs:n+36e5*(((e.hour_end??(e.hour+1)%24)-e.hour+24)%24||1)}}(e.analysis);let A=null,S=null;if(k){const e=b(k.startMs),t=b(k.endMs);A=e??(k.startMs<=v?0:null),S=t??(k.endMs>=y?tt:null)}const C=null!=A&&null!=S&&S>A?V`<rect x=${A.toFixed(1)} y="0"
                  width=${(S-A).toFixed(1)} height=${it}
                  fill="var(--success-color,#4CAF50)" fill-opacity="0.10"
                  stroke="none"/>`:W,M=n.map((e,t)=>({t:e.time,v:e.value,x:+m[t].x.toFixed(1),y:+m[t].y.toFixed(1)})),T=`spark-grad-${Math.random().toString(36).slice(2,8)}`,E=e.showMedianLine?(()=>{const t=nt(o);if(!t)return W;const i={median_delta_below:e.translations.median_delta_below,median_delta_above:e.translations.median_delta_above,median_delta_equal:e.translations.median_delta_equal}[t.key].replace("{c}",t.cents);return B`
            <span class="median-delta ${t.cls}">${i}</span>
          `})():W,z=[...o].sort((e,t)=>e-t),P=(z.length-1)/2,D=z.length>0?(z[Math.floor(P)]+z[Math.ceil(P)])/2:0,N=(e.showMedianLine?e.translations.sparkline_aria_summary:e.translations.sparkline_aria_simple).replace("{min}",Se(s)).replace("{max}",Se(l)).replace("{median}",Se(D));return{template:B`
      <div class="sparkline-svg-wrap">
      <svg
        class="sparkline"
        viewBox="0 0 ${tt} ${it}"
        preserveAspectRatio="none"
        role="img"
        aria-label=${N}
        data-points=${JSON.stringify(M)}
        data-width=${tt}
        data-height=${it}
      >
        <title>${N}</title>
        <defs>
          <linearGradient id=${T} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.3" />
            <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        ${x}
        ${g}
        <path d=${f} fill="url(#${T})" />
        ${C}
        ${$}
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
          x1="0" y1="0" x2="0" y2=${it}
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
        ${e.showMinMax?B`<span>
              <span class="sparkline-minmax-label">${e.translations.min_label}</span>
              ${Se(s)}
            </span>`:W}
        <span class="sparkline-period">
          ${e.translations.last_7_days}${E===W?W:B` · ${E}`}
        </span>
        ${e.showMinMax?B`<span>
              <span class="sparkline-minmax-label">${e.translations.max_label}</span>
              ${Se(l)}
            </span>`:W}
      </div>
    `,hoverPoints:M,medianDelta:w,viewBoxWidth:tt,viewBoxHeight:it}}catch(e){return console.warn("[Tankstellen Austria] sparkline render failed:",e),t}}const ot=36e5,st=864e5,lt=14*st,ct=3*st;function dt(e){const t=new Date(e);t.setHours(0,0,0,0);const i=t.getDay();return t.setDate(t.getDate()-(0===i?6:i-1)),t.getTime()}function ht(e,t){const i=[],n=(e,t,n)=>{if(n<=t)return;if(!Number.isFinite(e))return;let r=t;for(;r<n;){const t=Math.floor(r/ot)*ot+ot,a=Math.min(n,t),o=new Date(r);i.push({price:e,t:r,hour:o.getHours(),weekday:o.getDay(),weekKey:dt(r),durationMs:a-r}),r=a}};for(let t=0;t<e.length-1;t++)n(e[t].value,e[t].time,e[t+1].time);const r=e[e.length-1];return n(r.value,r.time,t),i}function pt(e){const t=new Map;for(const i of e){const e=t.get(i.weekKey);e?e.push(i):t.set(i.weekKey,[i])}return t}function ut(e,t){const i=e.map(e=>e.length>=t?et(e,.5):NaN);let n=-1,r=1/0;return i.forEach((e,t)=>{!Number.isNaN(e)&&e<r&&(r=e,n=t)}),{medians:i,bestIdx:n,bestVal:r,minVal:r}}function mt(e,t){const i=e.medians.filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t);if(i.length<2||e.bestIdx<0)return 0;return Xe(100*(i[Math.floor((i.length-1)/2)]-e.minVal)/t,0,1)}function _t(e){if(!e||e.length<2)return null;const t=Date.now(),i=t-e[0].time;if(i<7*st)return{hasEnoughData:!1};const n=ht(e,t);if(0===n.length)return{hasEnoughData:!1};const r=pt(n),a=Array.from({length:24},()=>[]),o=Array.from({length:7},()=>[]);for(const e of r.values()){let i=0;for(const t of e)i+=t.durationMs;if(i<ct)continue;const n=e.map(e=>({value:e.price,weight:e.durationMs})),r=et(n,.05),s=et(n,.95);let l=0;for(const t of e)l+=Xe(t.price,r,s)*t.durationMs;const c=l/i;for(const i of e){const e=Xe(i.price,r,s),n=Math.pow(.5,(t-i.t)/lt),l={value:e-c,weight:i.durationMs*n};a[i.hour].push(l),o[i.weekday].push(l)}}const s=ut(a,3);if(s.bestIdx<0)return{hasEnoughData:!1};const l=ut(o,3),c=i/st,d=Math.min(1,c/28),h=a.filter(e=>e.length>=3).length/24,p=mt(s,1.5),u=s.medians.filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t),m=u.length>=2?100*(u[Math.floor((u.length-1)/2)]-s.minVal):0,_=(d+h+p)/3,f=_>=.75?"high":_>=.5?"medium":"low",g=o.filter(e=>e.length>=3).length/7,v=mt(l,.8),y=(l.bestIdx>=0?(d+g+v)/3:0)>=.75,b=function(e,t,i){const n=e=>void 0!==e&&!Number.isNaN(e)&&e-i<=.005;let r=0;for(let i=1;i<=23&&n(e[(t+i)%24]);i++)r=i;let a=0;for(let i=1;i<=23&&n(e[(t-i+24)%24]);i++)a=i;return{start:(t-a+24)%24,end:(t+r+1)%24}}(s.medians,s.bestIdx,s.minVal);return{hasEnoughData:!0,hour:b.start,hour_end:b.end,weekday:y?l.bestIdx:null,confidence:{level:f,score:_,span_days:Math.round(c),coverage_pct:Math.round(100*h),gap_cents:Math.round(10*m)/10}}}const ft=a`
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
`,gt=a`
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
`;function vt(e){return"string"!=typeof e?"":/^https?:\/\//i.test(e)?e:""}function yt(e,t,i){e.dispatchEvent(new CustomEvent(t,{detail:i,bubbles:!0,composed:!0}))}function bt(e,t,i,n){var r,a=arguments.length,o=a<3?t:n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o}function xt(e){return e.replace(/[<>"'&]/g,"").slice(0,50).trim()}const wt={text:{}};class $t extends le{setConfig(e){this._config={...e}}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._copiedTimeout&&(clearTimeout(this._copiedTimeout),this._copiedTimeout=void 0)}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_et(e,t){return qe(`editor.${e}`,this._ctx(),t)}_ct(e,t){return qe(`card.${e}`,this._ctx(),t)}_fireChanged(){yt(this,"config-changed",{config:{...this._config}})}_schema(){const e=!1!==this._config.show_history,t=!0===this._config.show_cars,i=!1!==this._config.show_payment_methods,n=this._config.payment_filter??[],r=[{name:"entities",selector:{entity:{multiple:!0,filter:{domain:"sensor",integration:"tankstellen_austria"}}}},{type:"expandable",name:"display",title:this._et("section_display"),flatten:!0,schema:[{name:"max_stations",selector:{number:{min:0,max:5,step:1,mode:"slider"}}},{name:"hide_header",selector:{boolean:{}}},{name:"hide_header_price",selector:{boolean:{}}},{name:"show_index",selector:{boolean:{}}},{name:"show_map_links",selector:{boolean:{}}},{name:"map_provider",selector:{select:{mode:"dropdown",options:[{value:"auto",label:this._et("map_provider_auto")},{value:"google",label:this._et("map_provider_google")},{value:"apple",label:this._et("map_provider_apple")}]}}},{name:"show_distance",selector:{boolean:{}}},{name:"sort_by_distance",selector:{boolean:{}}},{name:"show_opening_hours",selector:{boolean:{}}},{name:"show_payment_methods",selector:{boolean:{}}},{name:"show_history",selector:{boolean:{}}}]}];e&&r.push({type:"expandable",name:"history_options",title:this._et("section_history"),flatten:!0,schema:[{name:"show_median_line",selector:{boolean:{}}},{name:"show_hour_envelope",selector:{boolean:{}}},{name:"show_noon_markers",selector:{boolean:{}}},{name:"show_minmax",selector:{boolean:{}}},{name:"show_best_refuel",selector:{boolean:{}}}]});{const e=[{name:"show_cars",selector:{boolean:{}}}];t&&e.push({name:"show_car_fillup",selector:{boolean:{}}},{name:"show_car_consumption",selector:{boolean:{}}}),r.push({type:"expandable",name:"cars_options",title:this._et("section_cars"),flatten:!0,schema:e})}return i&&n.length>0&&r.push({type:"expandable",name:"payment_options",title:this._et("section_payment_filter"),flatten:!0,schema:[{name:"payment_highlight_mode",selector:{boolean:{}}}]}),r.push({type:"expandable",name:"branding",title:this._et("section_branding"),flatten:!0,schema:[{name:"logo_adapt_to_theme",selector:{boolean:{}}},{name:"hide_attribution",selector:{boolean:{}}}]}),r}render(){const e=!1!==this._config.show_history,t=!1!==this._config.show_best_refuel,i=e&&t,n=(this._config.entities??[]).filter(e=>!!this.hass&&!this.hass.states[e]);return B`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${{map_provider:"auto",...this._config}}
          .schema=${this._schema()}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._onFormChanged}
        ></ha-form>

        ${n.map(e=>B`
            <ha-alert alert-type="warning">
              ${this._et("entity_missing",{entity:e})}
            </ha-alert>
          `)}

        ${i?this._renderRecorderHint():W}
        ${this._renderTabLabelsSection()}
        ${this._renderPaymentChipsSection()}
        ${this._renderCarsRosterSection()}
      </div>
    `}_renderRecorderHint(){const e="recorder:\n  purge_keep_days: 30",t=this._copiedPulse?this._et("copied"):this._et("copy");return B`
      <div class="recorder-hint">
        <div class="recorder-hint-text">${this._et("recorder_hint_intro")}</div>
        <pre class="recorder-snippet"><code>${e}</code></pre>
        <div class="recorder-hint-actions">
          <button
            class="recorder-copy-btn"
            type="button"
            aria-label=${this._et("copy_sensor_id")}
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
            <span>${this._et("recorder_hint_docs")}</span>
          </a>
        </div>
      </div>
    `}_renderTabLabelsSection(){if(!this.hass)return W;const e=(this._config.entities??[]).map(e=>({eid:e,state:this.hass.states[e]})).filter(e=>!!e.state);if(e.length<2)return W;const t=this._config.tab_labels??{};return B`
      <div class="editor-section">
        <div class="section-header">${this._et("section_tab_labels")}</div>
        ${e.map(({eid:e,state:i})=>{let n=Ge(i.attributes?.fuel_type??"",this._ctx());if(!0===i.attributes?.dynamic_mode){const e=i.attributes.dynamic_tracker_label;e&&(n+=` · ${e}`)}const r="string"==typeof t[e]?t[e]:"",a=`tablbl-${e.replace(/[^a-z0-9_-]/gi,"-")}`;return B`
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
    `}_collectApiPaymentKeys(){const e=new Set(["cash","debit_card","credit_card"]);if(!this.hass)return e;for(const t of this._config.entities??[]){const i=this.hass.states[t]?.attributes?.stations??[];for(const t of i)for(const i of t.payment_methods?.others??[])e.add(i)}return e}_renderPaymentChipsSection(){if(!(!1!==this._config.show_payment_methods))return W;const e=this._collectApiPaymentKeys(),t=this._config.payment_filter??[],i=new Set(e);for(const e of t)i.add(e);return B`
      <div class="editor-section">
        <div class="section-header">${this._et("section_payment_filter")}</div>
        <div class="pm-filter-chips">
          ${[...i].map(i=>this._renderPaymentChip(i,t,e))}
        </div>
        <div class="pm-custom-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${wt}
            .value=${this._pmDraft}
            .label=${this._et("payment_filter_custom_placeholder")}
            .required=${!1}
            @value-changed=${this._onCustomPmChanged}
            @keydown=${this._onCustomPmKeydown}
            @keyup=${this._stop}
            @keypress=${this._stop}
          ></ha-selector>
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
    `}_renderPaymentChip(e,t,i){const n=t.includes(e),r=e===this._pendingRemove,a=!i.has(e),o="cash"===e?this._ct("cash"):"debit_card"===e?this._ct("debit_card"):"credit_card"===e?this._ct("credit_card"):e;return B`
      <button
        class=${ge({"pm-filter-chip":!0,active:n,confirm:r})}
        type="button"
        aria-pressed=${n?"true":"false"}
        @click=${()=>this._togglePaymentChip(e,a)}
      >
        ${r?`✕ ${o}?`:o}
      </button>
    `}_renderCarsRosterSection(){if(!(!0===this._config.show_cars))return W;const e=!1!==this._config.show_car_fillup,t=!1!==this._config.show_car_consumption,i=this._config.cars??[];return B`
      <div class="editor-section">
        <div class="section-header">${this._et("section_cars")}</div>
        ${e||t?W:B`<div class="editor-hint">${this._et("cars_both_off_hint")}</div>`}
        ${i.map((e,t)=>this._renderCarRow(e,t))}
        <button class="car-add-btn" type="button" @click=${this._onAddCar}>
          ${this._et("add_car")}
        </button>
      </div>
    `}_renderCarRow(e,t){const i=this._expandedCarIcon===t,n=e.icon||"mdi:car",r=`tsa-car-icon-picker-${t}`,a=null!=e.tank_size&&(e.tank_size<1||e.tank_size>200),o=null!=e.consumption&&(e.consumption<0||e.consumption>30),s=`tsa-car-tank-err-${t}`,l=`tsa-car-consumption-err-${t}`;return B`
      <div class="car-editor-group">
        <div class="car-editor-row">
          <button
            class=${ge({"car-icon-btn":!0,active:i})}
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
            ${["DIE","SUP","GAS"].map(t=>B`
                <option value=${t} ?selected=${e.fuel_type===t}>
                  ${Ge(t,this._ctx())}
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
            aria-describedby=${a?s:W}
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
            aria-describedby=${o?l:W}
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
        ${a?B`<ha-alert
              id=${s}
              alert-type="error"
            >${this._et("tank_size_range_error")}</ha-alert>`:W}
        ${o?B`<ha-alert
              id=${l}
              alert-type="error"
            >${this._et("consumption_range_error")}</ha-alert>`:W}
        ${i?B`
              <div id=${r} class="car-icon-picker">
                ${ye.map(e=>B`
                    <button
                      class=${ge({"car-icon-option":!0,active:n===e})}
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
            `:W}
      </div>
    `}_stop(e){e.stopPropagation()}async _onCopyRecorderSnippet(e){try{await navigator.clipboard.writeText(e),this._copiedPulse=!0,void 0!==this._copiedTimeout&&clearTimeout(this._copiedTimeout),this._copiedTimeout=window.setTimeout(()=>{this._copiedPulse=!1,this._copiedTimeout=void 0},1500)}catch{}}_onTabLabelChange(e,t){t.stopPropagation();const i=xt(t.target.value),n={...this._config.tab_labels??{}};i?n[e]=i:delete n[e];const r={...this._config};Object.keys(n).length?r.tab_labels=n:delete r.tab_labels,this._config=r,this._fireChanged()}_togglePaymentChip(e,t){const i=[...this._config.payment_filter??[]],n=i.includes(e);if(n&&t)return void(this._pendingRemove===e?(this._pendingRemove=null,this._config={...this._config,payment_filter:i.filter(t=>t!==e)},this._fireChanged()):this._pendingRemove=e);this._pendingRemove=null;const r=n?i.filter(t=>t!==e):[...i,e];this._config={...this._config,payment_filter:r},this._fireChanged()}_onCustomPmChanged(e){e.stopPropagation(),this._pmDraft=e.detail?.value??""}_onCustomPmKeydown(e){e.stopPropagation(),"Enter"===e.key&&this._onAddCustomPm()}_onAddCustomPm(){const e=xt(this._pmDraft);if(!e)return;this._pendingRemove=null;const t=[...this._config.payment_filter??[]];t.includes(e)||(t.push(e),this._config={...this._config,payment_filter:t},this._fireChanged()),this._pmDraft=""}_onToggleIconPicker(e,t){e.stopPropagation(),this._expandedCarIcon=this._expandedCarIcon===t?null:t}_onPickCarIcon(e,t,i){e.stopPropagation();const n=[...this._config.cars??[]];n[t]&&(n[t]={...n[t],icon:i},this._config={...this._config,cars:n},this._expandedCarIcon=null,this._fireChanged())}_onCarFieldChange(e,t,i){i.stopPropagation();const n=i.target.value,r=[...this._config.cars??[]],a=r[e];if(!a)return;const o={...a};if("consumption"===t){const e=n.trim();if(""===e)delete o.consumption;else{const t=parseFloat(e);Number.isFinite(t)&&t>0?o.consumption=Math.round(10*t)/10:delete o.consumption}}else if("tank_size"===t){const e=parseInt(n,10);o.tank_size=Math.min(200,Math.max(1,Number.isFinite(e)?e:1))}else if("fuel_type"===t){["DIE","SUP","GAS"].includes(n)&&(o.fuel_type=n)}else o.name=xt(n);r[e]=o,this._config={...this._config,cars:r},this._fireChanged()}_onDeleteCar(e,t){e.stopPropagation();const i=[...this._config.cars??[]];i.splice(t,1),this._config={...this._config,cars:i},this._expandedCarIcon===t?this._expandedCarIcon=null:null!=this._expandedCarIcon&&this._expandedCarIcon>t&&(this._expandedCarIcon=this._expandedCarIcon-1),this._fireChanged()}_onAddCar(e){e.stopPropagation();const t=[...this._config.cars??[]];t.push({name:"",fuel_type:"DIE",tank_size:50,icon:"mdi:car"}),this._config={...this._config,cars:t},this._fireChanged()}static{this.styles=gt}constructor(...e){super(...e),this._config={type:"tankstellen-austria-card"},this._expandedCarIcon=null,this._pendingRemove=null,this._pmDraft="",this._copiedPulse=!1,this._computeLabel=e=>{const t=`ui.panel.lovelace.editor.card.generic.${e.name}`,i=this.hass?.localize?.(t);if(i)return i;const n=this._et(e.name);return n!==`editor.${e.name}`?n:e.name},this._computeHelper=e=>{const t=`${e.name}_helper`,i=this._et(t);return i===`editor.${t}`?void 0:i},this._onFormChanged=e=>{const t=e.detail.value,i={...this._config,...t};"auto"===i.map_provider&&delete i.map_provider,this._config=i,yt(this,"config-changed",{config:i})}}}function kt(e,t,i,n){var r,a=arguments.length,o=a<3?t:n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(o=(a<3?r(o):a>3?r(t,i,o):r(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o}bt([ue({attribute:!1})],$t.prototype,"hass",void 0),bt([me()],$t.prototype,"_config",void 0),bt([me()],$t.prototype,"_expandedCarIcon",void 0),bt([me()],$t.prototype,"_pendingRemove",void 0),bt([me()],$t.prototype,"_pmDraft",void 0),bt([me()],$t.prototype,"_copiedPulse",void 0),$t=bt([de("tankstellen-austria-card-editor")],$t);window.customCards=window.customCards||[],window.customCards.push({type:"tankstellen-austria-card",name:"Tankstellen Austria",description:"Austrian fuel prices from E-Control with sparklines and best-refuel analytics.",preview:!0,documentationURL:"https://github.com/rolandzeiner/tankstellen-austria",getEntitySuggestion:(e,t)=>t.startsWith("sensor.")?"tankstellen_austria"!==e?.entities?.[t]?.platform?null:{config:{type:"custom:tankstellen-austria-card",entities:[t]}}:null});class At extends le{static getConfigElement(){return document.createElement("tankstellen-austria-card-editor")}static getStubConfig(e){const t=we(e);return{entities:t.length?[t[0]]:[],max_stations:5,show_index:!0,show_map_links:!0,show_distance:!0,show_opening_hours:!0,show_payment_methods:!0,show_history:!0,show_minmax:!0,show_best_refuel:!0,payment_filter:[],payment_highlight_mode:!0,show_cars:!1,cars:[]}}setConfig(e){if(!e||"object"!=typeof e||Array.isArray(e))throw new Error("tankstellen-austria-card: config must be an object");const t=e.entities;if(void 0!==t&&"string"!=typeof t&&!Array.isArray(t))throw new Error("tankstellen-austria-card: config.entities must be a string or array of entity IDs");if(this._config=xe(e),this._config.entities){const e={};let t=!1;for(const i of this._config.entities){const n=Qe(i);n.length>=2&&(e[i]=n,t=!0)}t&&(this._history={...this._history,...e})}}getCardSize(){return 6}getGridOptions(){return{columns:12,rows:"auto",min_columns:6,min_rows:4}}shouldUpdate(e){if(!this._config)return!1;if(e.has("_config")||e.has("_activeTab")||e.has("_expandedStations")||e.has("_history")||e.has("_historyError")||e.has("_versionMismatch")||e.has("_lastManualRefresh")||e.has("_noNewData")||e.has("_cooldownTick"))return!0;const t=e.get("hass");if(!t)return!0;return this._trackedEntityIds().some(e=>t.states[e]!==this.hass.states[e])}_trackedEntityIds(){return this._config.entities?.length?this._config.entities:we(this.hass)}_resolveEntities(){if(!this.hass)return[];return this._trackedEntityIds().map(e=>{const t=this.hass.states[e];return t?{entity_id:e,state:t.state,attributes:t.attributes,last_updated:t.last_updated}:null}).filter(e=>null!==e)}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_t(e,t){return qe(`card.${e}`,this._ctx(),t)}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._historyInterval&&(clearInterval(this._historyInterval),this._historyInterval=void 0),void 0!==this._cooldownInterval&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),void 0!==this._postRefreshTimeout&&(clearTimeout(this._postRefreshTimeout),this._postRefreshTimeout=void 0),void 0!==this._cooldownTimeout&&(clearTimeout(this._cooldownTimeout),this._cooldownTimeout=void 0),this._sparklineCleanup&&(this._sparklineCleanup(),this._sparklineCleanup=void 0),this._initDone=!1}updated(e){!this._initDone&&this.hass&&this._config&&(this._initDone=!0,this._fetchAllHistory(),this._historyInterval=window.setInterval(()=>{this._fetchAllHistory()},18e5),this._checkCardVersion()),this._reattachSparklineHover()}async _fetchAllHistory(){try{const e=this._resolveEntities();await Promise.all(e.map(async e=>{const t=await async function(e,t,i={}){if(!e?.callWS)return[];const n=Ze.get(t);if(n)return n;const r=i.days??28,a=new Date,o=new Date(a.getTime()-24*r*60*60*1e3),s=(async()=>{try{const i=await e.callWS({type:"history/history_during_period",start_time:o.toISOString(),end_time:a.toISOString(),entity_ids:[t],minimal_response:!0,significant_changes_only:!0}),n=(i?.[t]??[]).map(e=>({time:Je(e),value:parseFloat(String(e.s??e.state??""))})).filter(e=>Number.isFinite(e.value)&&e.time>0);return Ke.set(t,n),n}catch(e){return console.warn("[Tankstellen Austria] history fetch failed for",t,"— sparkline and best-refuel will be empty:",e),Ke.get(t)??[]}finally{Ze.delete(t)}})();return Ze.set(t,s),s}(this.hass,e.entity_id);this._history={...this._history,[e.entity_id]:t}})),this._historyError=!1}catch(e){console.warn("[Tankstellen Austria] history refresh failed",e),this._historyError=!0}}async _checkCardVersion(){const e=await async function(e,t,i){if(!e?.callWS)return null;try{const n=await e.callWS({type:t});if(n?.version&&n.version!==i)return n.version}catch{}return null}(this.hass,"tankstellen_austria/card_version","1.10.0");e&&(this._versionMismatch=e)}_reattachSparklineHover(){this._sparklineCleanup&&(this._sparklineCleanup(),this._sparklineCleanup=void 0);const e=this.shadowRoot?.querySelector(".sparkline-container[data-entity]");if(!e)return;const t=We(this._ctx()),i=Ve(this._ctx());this._sparklineCleanup=function(e,t){const i=()=>{};try{const i=()=>{const t=e.querySelector("svg.sparkline"),i=e.querySelector(".sparkline-tooltip");if(!t||!i)return null;const n=t.querySelector(".sparkline-hover-line"),r=e.querySelector(".sparkline-hover-dot"),a=i.querySelector(".sparkline-tooltip-time"),o=i.querySelector(".sparkline-tooltip-price");if(!(n&&r&&a&&o))return null;let s;try{s=JSON.parse(t.dataset.points||"[]")}catch{s=[]}return s.length?{svgEl:t,line:n,dot:r,tooltip:i,timeEl:a,priceEl:o,pts:s,vbWidth:Number(t.dataset.width)||tt,vbHeight:Number(t.dataset.height)||it}:null},n=n=>{const r=i();if(!r)return;const{svgEl:a,line:o,dot:s,tooltip:l,timeEl:c,priceEl:d,pts:h,vbWidth:p,vbHeight:u}=r,m=a.getBoundingClientRect();if(0===m.width)return;const _=Math.max(0,Math.min(1,(n-m.left)/m.width))*p;let f=h[0],g=Math.abs(f.x-_);for(const e of h){const t=Math.abs(e.x-_);t<g&&(f=e,g=t)}o.setAttribute("x1",String(f.x)),o.setAttribute("x2",String(f.x)),o.setAttribute("opacity","0.5"),s.style.left=f.x/p*100+"%",s.style.top=f.y/u*100+"%",s.style.opacity="1",c.textContent=t.formatTime(f.t),d.textContent=t.formatPrice(f.v),l.hidden=!1;const v=e.getBoundingClientRect(),y=f.x/p*m.width+(m.left-v.left);l.style.left="0px";const b=l.offsetWidth,x=y-b/2,w=Math.max(0,Math.min(v.width-b,x));l.style.left=`${w}px`},r=()=>{const e=i();e&&(e.line.setAttribute("opacity","0"),e.dot.style.opacity="0",e.tooltip.hidden=!0)},a=new AbortController,{signal:o}=a,s=e=>n(e.clientX);return e.addEventListener("pointermove",s,{signal:o}),e.addEventListener("pointerleave",r,{signal:o}),e.addEventListener("pointercancel",r,{signal:o}),()=>{a.abort()}}catch(e){return console.warn("[Tankstellen Austria] sparkline hover setup failed:",e),i}}(e,{formatTime:e=>{const n=new Date(e);return`${t[n.getDay()]?.slice(0,2)??""} ${"de"===i?`${n.getDate()}.${n.getMonth()+1}.`:`${n.getMonth()+1}/${n.getDate()}`} ${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`},formatPrice:Ae})}render(){if(!this.hass||!this._config)return B`
        <ha-card>
          <div class="empty" role="status" aria-live="polite">
            ${this._t("loading")}
          </div>
          ${this._renderFooter(void 0)}
        </ha-card>
      `;const e=this._resolveEntities(),t=this._activeTab>=e.length?0:this._activeTab;if(!e.length)return B`
        <ha-card>
          ${this._renderVersionBanner()}
          <div class="empty">${this._t("no_data")}</div>
          ${this._renderFooter(void 0)}
        </ha-card>
      `;const i=e[t]??e[0],n=i.attributes.attribution;return B`
      <ha-card>
        ${this._renderTabs(e,t)}
        <div class="wrap">
          ${this._renderVersionBanner()}
          ${this._historyError?B`<ha-alert alert-type="warning" role="alert">
                ${this._t("history_fetch_error")}
              </ha-alert>`:W}
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
    `}_renderFooter(e){if(!0===this._config?.hide_attribution)return W;const t=!0===this._config?.logo_adapt_to_theme,i=Boolean(this.hass?.themes?.darkMode),n=t?"brand-logo adaptive "+(i?"adaptive-dark":"adaptive-light"):"brand-logo",r=e&&e.includes("E-Control")?e:"Datenquelle: E-Control";return B`
      <div class="footer">
        <a
          class="brand-link"
          href=${vt("https://www.e-control.at/")}
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
    `}_renderVersionBanner(){const e=null!==this._versionMismatch&&"undefined"!=typeof sessionStorage&&"1"===sessionStorage.getItem(`tsa-reload-attempted-${this._versionMismatch}`);return function(e){if(!e.mismatchVersion)return W;if(e.stuck)return B`
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
    `;const t=e.t("version_update",{v:e.mismatchVersion});return B`
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
  `}({mismatchVersion:this._versionMismatch,stuck:e,t:(e,t)=>this._t(e,t),onReload:this._onVersionReload,onDismiss:this._onDismissVersionBanner})}_renderTabs(e,t){if(e.length<=1)return W;const i=this._config.tab_labels??{};return B`
      <div class="tabs" role="tablist">
        ${e.map((n,r)=>{const a=i[n.entity_id];let o;if("string"==typeof a&&a.trim().length>0)o=a;else{if(o=Ge(n.attributes.fuel_type??"",this._ctx()),!0===n.attributes.dynamic_mode){const e=n.attributes.dynamic_tracker_label;e&&(o+=` · ${e}`)}}const s=r===t;return B`
            <button
              type="button"
              role="tab"
              class=${ge({tab:!0,active:s})}
              aria-selected=${s?"true":"false"}
              tabindex=${s?"0":"-1"}
              @click=${()=>this._onTabClick(r)}
              @keydown=${t=>this._onTabKeydown(t,r,e.length)}
            >
              ${o}
            </button>
          `})}
      </div>
    `}_renderHeader(e){if(!0===this._config?.hide_header)return W;const t=e.attributes.fuel_type??"",i=e.attributes.fuel_type_name||Ge(t,this._ctx()),n=!0===e.attributes.dynamic_mode;let r=null;return n&&(r=e.attributes.dynamic_tracker_label??null),B`
      <header class="header">
        <div class="icon-tile" aria-hidden="true">
          <ha-icon icon="mdi:gas-station"></ha-icon>
        </div>
        <div class="header-text">
          <h2 class="title">${i}</h2>
          ${r?B`<p class="subtitle">${r}</p>`:W}
        </div>
        ${n?B`
              <div class="header-actions">
                ${this._renderRefreshButton()}
                ${this._renderDynamicChips(e)}
              </div>
            `:W}
      </header>
    `}_renderDynamicChips(e){const t=!!e.last_updated;return t||this._noNewData?B`
      <div class="chip-row" aria-live="polite">
        ${t?B`<span class="chip muted">
              <ha-icon icon="mdi:clock-outline" aria-hidden="true"></ha-icon>
              <ha-relative-time
                .hass=${this.hass}
                .datetime=${new Date(e.last_updated)}
              ></ha-relative-time>
            </span>`:W}
        ${this._noNewData?B`<span class="chip warn" role="status">
              <ha-icon icon="mdi:alert-circle-outline" aria-hidden="true"></ha-icon>
              ${this._t("no_new_data")}
            </span>`:W}
      </div>
    `:W}_renderRefreshButton(){const e=ve-(Date.now()-this._lastManualRefresh),t=e>0,i=t?(()=>{const t=Math.ceil(e/1e3);return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`})():"";return B`
      <button
        class=${ge({"btn-primary":!0,cooling:t})}
        type="button"
        aria-label=${this._t("refresh")}
        aria-disabled=${t?"true":"false"}
        @click=${this._onRefresh}
      >
        <ha-icon icon="mdi:refresh" aria-hidden="true"></ha-icon>
        <span>${t?i:this._t("refresh")}</span>
      </button>
    `}_renderHero(e){const t=e.attributes.stations??[];if(!t.length)return W;const i=!0===e.attributes.dynamic_mode,n=t[0]?.price,r=e.attributes.average_price;return i||!0===this._config.hide_header_price||null==n?W:B`
      <div class="hero">
        <div class="metric">
          <div class="metric-value">
            <span class="metric-num">${Ae(n)}</span>
            ${null!=r?B`<span class="metric-of"
                  >/ ${Ae(r)} ${this._t("average")}</span
                >`:W}
          </div>
          <div class="metric-label">${this._t("cheapest")}</div>
        </div>
      </div>
    `}_renderSparklineBlock(e){return!0===e.attributes.dynamic_mode||!1===this._config.show_history?W:this._renderSparkline(e)}_renderSparkline(e){const t=e.entity_id,i=this._history[t]??[];if(i.length<2)return W;const n=!0===this._config.show_median_line,r=!0===this._config.show_hour_envelope,a=!0===this._config.show_noon_markers,o=!1!==this._config.show_minmax,s=r?function(e){if(!e||e.length<2)return null;const t=Date.now();if(t-e[0].time<7*st)return null;const i=ht(e,t);if(0===i.length)return null;const n=pt(i),r=Array.from({length:24},()=>[]);for(const e of n.values()){let t=0;for(const i of e)t+=i.durationMs;if(t<ct)continue;const i=e.map(e=>({value:e.price,weight:e.durationMs})),n=et(i,.05),a=et(i,.95);for(const t of e)r[t.hour].push({value:Xe(t.price,n,a),weight:t.durationMs})}const a=new Array(24).fill(null),o=new Array(24).fill(null);let s=0;for(let e=0;e<24;e++){const t=r[e];t.length<3||(a[e]=et(t,.1),o[e]=et(t,.9),s++)}return s<6?null:{minByHour:a,maxByHour:o}}(i):null,l=!1!==this._config.show_best_refuel?_t(i):null,c=at({points:i,showMedianLine:n,showHourEnvelope:r,showNoonMarkers:a,showMinMax:o,hourEnvelope:s,analysis:l,translations:{min_label:this._t("min_label"),max_label:this._t("max_label"),last_7_days:this._t("last_7_days"),median_delta_below:this._t("median_delta_below"),median_delta_above:this._t("median_delta_above"),median_delta_equal:this._t("median_delta_equal"),sparkline_aria_summary:this._t("sparkline_aria_summary"),sparkline_aria_simple:this._t("sparkline_aria_simple")}});return c.template===W?W:B`
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
    `}_renderRecommendation(e){if(!e)return W;if(!e.hasEnoughData)return B`
        <div class="refuel-hint">
          <ha-icon icon="mdi:information-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
          ${this._t("not_enough_data_hint")}
        </div>
      `;const t=e.hour??0,i=e.hour_end??(t+1)%24,n=String(t).padStart(2,"0"),r=String(i).padStart(2,"0");let a;if(null!=e.weekday){const t=We(this._ctx())[e.weekday]??"";a=this._t("best_refuel_hour_weekday",{h1:n,h2:r,day:t})}else a=this._t("best_refuel_hour",{h1:n,h2:r});const o=e.confidence;if(!o)return B`
        <div class="refuel-recommendation">
          <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
          <span class="refuel-text">${a}</span>
        </div>
      `;const s=this._t(`confidence_${o.level}`),l=[`${this._t("confidence_title")}: ${s}`,`${this._t("confidence_span")}: ${o.span_days} ${this._t("confidence_days")}`,`${this._t("confidence_coverage")}: ${o.coverage_pct}%`,`${this._t("confidence_gap")}: ${o.gap_cents.toFixed(1)} ${this._t("confidence_cents")}`];o.span_days<14&&l.push(this._t("confidence_short_history_hint"));const c=l.join(". "),d=`refuel-confidence refuel-confidence-${o.level}`;return B`
      <div class="refuel-recommendation">
        <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon" aria-hidden="true"></ha-icon>
        <span class="refuel-text">${a}</span>
        <span
          class=${d}
          title=${c}
          aria-label=${c}
        >${s}</span>
      </div>
    `}_renderCars(e){const t=e.attributes.stations??[];if(!t.length)return W;const i=!0===this._config.show_cars,n=!1!==this._config.show_car_fillup,r=!1!==this._config.show_car_consumption;if(!i||!n&&!r)return W;const a=e.attributes.fuel_type??"",o=this._config.payment_filter??[],s=!0===this._config.payment_highlight_mode,l=(this._config.cars??[]).filter(e=>e.fuel_type===a&&e.tank_size>0&&e.name),c=n?l:l.filter(e=>Number(e.consumption)>0);if(!c.length)return W;const d=s?t:t.filter(e=>ke(e,o)),h=s?t[0]?.price:d[0]?.price;return B`
      <div class="cars-fillup">
        ${c.map(e=>this._renderCarRow(e,h,n,r))}
      </div>
    `}_renderCarRow(e,t,i,n){const r=Number(e.consumption),a=Number.isFinite(r)&&r>0?r.toFixed(1).replace(".",","):"";if(i){const i=null!=t?`€ ${(t*Number(e.tank_size)).toFixed(2).replace(".",",")}`:"–",o=null!=t&&r>0?`€ ${(t*r).toFixed(2).replace(".",",")}`:"–";return B`
        <div class="car-fillup-row">
          <span class="car-fillup-name">
            <ha-icon icon=${e.icon||"mdi:car"} class="car-icon" aria-hidden="true"></ha-icon>
            ${e.name}
            <span class="car-fillup-liters">${e.tank_size} L</span>
          </span>
          <span class="car-fillup-cost">${i}</span>
        </div>
        ${n&&r>0?B`
              <div class="car-per100-row">
                <span class="car-per100-label">${a} l/100 km</span>
                <span class="car-per100-cost">${o} / 100 km</span>
              </div>
            `:W}
      `}const o=null!=t?`€ ${(t*r).toFixed(2).replace(".",",")}`:"–";return B`
      <div class="car-fillup-row">
        <span class="car-fillup-name">
          <ha-icon icon=${e.icon||"mdi:car"} class="car-icon" aria-hidden="true"></ha-icon>
          ${e.name}
          <span class="car-fillup-liters">${a} l/100 km</span>
        </span>
        <span class="car-fillup-cost">${o} / 100 km</span>
      </div>
    `}_renderStationList(e,t){const i=e.attributes.stations??[],n=parseInt(String(this._config.max_stations),10),r=Number.isFinite(n)?Math.max(0,Math.min(5,n)):5,a=this._config.payment_filter??[],o=!0===this._config.payment_highlight_mode,s=o?i:i.filter(e=>ke(e,a));if(0===r)return W;if(!s.length&&a.length&&i.length)return B`
        <div class="empty">
          ${this._t("payment_filter_active")} — ${this._t("no_data")}
        </div>
      `;if(!s.length)return B`<div class="empty">${this._t("no_data")}</div>`;const l=!0===this._config.sort_by_distance?[...s].sort((e,t)=>(e.distance_m??Number.POSITIVE_INFINITY)-(t.distance_m??Number.POSITIVE_INFINITY)):s,c=l.slice(0,r);return B`
      <div class="stations">
        ${c.map((e,i)=>this._renderStation(e,i,t,a,o))}
      </div>
    `}_renderStation(e,t,i,n,r){const a=!1!==this._config.show_index,o=!1!==this._config.show_map_links,s=!0===this._config.show_distance,l=!1!==this._config.show_opening_hours,c=!1!==this._config.show_payment_methods,d=e.location??{},h=`${i}|${e.name??""}|${d.address??""}`,p=this._expandedStations.has(h),u=!1===e.open,m=!u&&function(e,t=new Date){if(!1===e.open)return!1;const i=e.opening_hours??[];if(!i.length)return!1;const n=t.getDay(),r=0===n?"SO":6===n?"SA":"MO",a=i.find(e=>e.day===r);if(!a||!a.to)return!1;if("00:00"===a.from&&"24:00"===a.to)return!1;const[o,s]=a.to.split(":");if(void 0===o||void 0===s)return!1;const l=parseInt(o,10),c=parseInt(s,10);if(!Number.isFinite(l)||!Number.isFinite(c))return!1;const d=new Date(t);0===l&&0===c?(d.setDate(d.getDate()+1),d.setHours(0,0,0,0)):d.setHours(l,c,0,0);const h=(d.getTime()-t.getTime())/6e4;return h>0&&h<=30}(e),_=r&&n.length>0&&ke(e,n),f=_?function(e,t,i){if(!t||!t.length)return[];const n=e.payment_methods??{},r=[];for(const e of t){const t=$e(n,e,i);null!==t&&r.push(t)}return r}(e,n,{cash:this._t("cash"),debit_card:this._t("debit_card"),credit_card:this._t("credit_card")}):[],g=l&&!!e.opening_hours?.length,v=c&&(!!(y=e.payment_methods)&&Boolean(y.cash||y.debit_card||y.credit_card||y.others&&y.others.length>0));var y;const b=g||v,x=[e.name||"–",d.city??"",Ae(e.price)].filter(Boolean).join(", "),w=b?`tsa-station-detail-${i}-${t}`:void 0,$=!!e.name,k=d.city??"",A=d.address??"",S=[d.postalCode,k].filter(e=>null!=e&&""!==e).join(" "),C=S?B`<span lang="de">${S}</span>`:W,M=A?B`<span lang="de">${A}</span>`:W,T=C!==W&&M!==W?", ":"";return B`
      <div class=${ge({station:!0,"pm-highlight":_})}>
        <div
          class="station-main"
          role=${b?"button":"group"}
          tabindex=${b?"0":"-1"}
          aria-expanded=${b?p?"true":"false":W}
          aria-controls=${w??W}
          aria-label=${x}
          @click=${()=>this._onStationClick(h)}
          @keydown=${e=>this._onStationKeydown(e,h,b)}
        >
          ${a?B`<div class="index-tile" aria-hidden="true">${t+1}</div>`:W}
          <div class="info">
            <div class="name">
              ${$?B`<span lang="de">${e.name}</span>`:"–"}
              ${u?B`<span class="flag closed">${this._t("closed")}</span>`:m?B`<span class="flag closing-soon"
                      >${this._t("closing_soon")}</span
                    >`:W}
              ${f.map(e=>B`<span class="chip match">${e}</span>`)}
            </div>
            <div class="address">
              ${C}${T}${M}
            </div>
          </div>
          <div class="price">${Ae(e.price)}</div>
          ${(()=>{let t=W;if(o){const o=(n=this._config.map_provider??"auto",a=navigator.userAgent,l=navigator.maxTouchPoints,r=/iPhone|iPad|iPod/.test(a)||/Macintosh/.test(a)&&l>1?"ios":/Android/.test(a)?"android":"desktop","google"===n||"apple"===n?n:"ios"===r?"apple":"android"===r?"geo":"google"),s=(i=function(e,t,i="google"){if(!e)return t?`https://www.google.com/search?q=${encodeURIComponent(t)}`:null;if(/\d/.test(e.address??"")){const t=`${e.postalCode??""} ${e.city??""} ${e.address??""}`.trim(),n=encodeURIComponent(t);return"apple"===i?`https://maps.apple.com/?q=${n}`:"geo"===i?`geo:0,0?q=${n}`:`https://maps.google.com/?q=${n}`}const n=[t,e.address,e.postalCode,e.city].filter(e=>null!=e&&""!==e);return 0===n.length?null:`https://www.google.com/search?q=${encodeURIComponent(n.join(" "))}`}(d,e.name??"",o),"string"!=typeof i?"":i.startsWith("geo:0,0?q=")?i:vt(i));s&&(t=B`
                  <a
                    class="icon-action map"
                    href=${s}
                    target=${s.startsWith("geo:")?"_self":"_blank"}
                    rel="noopener noreferrer"
                    aria-label=${`${this._t("map")}: ${e.name??""}`}
                    title=${this._t("map")}
                    @click=${this._onMapLinkClick}
                  >
                    <ha-icon
                      icon=${/\d/.test(d.address??"")?"mdi:map-marker":"mdi:magnify"}
                      aria-hidden="true"
                    ></ha-icon>
                  </a>
                `)}var i,n,r,a,l;const c=s&&null!=e.distance_m?B`<span class="distance" lang="de"
                    >${h=e.distance_m,null==h||!Number.isFinite(h)||h<0?"":h<1e3?`${Math.round(h)} m`:`${(h/1e3).toFixed(1).replace(".",",")} km`}</span
                  >`:W;var h;return t===W&&c===W?W:B`<div
              class=${ge({"map-action":!0,"has-distance":c!==W})}
            >
              ${t}${c}
            </div>`})()}
          ${b?B`<ha-icon
                class="expander-chevron"
                icon="mdi:chevron-down"
                aria-hidden="true"
              ></ha-icon>`:W}
        </div>
        ${b?B`
              <div
                id=${w}
                class=${ge({"station-detail":!0,expanded:p})}
              >
                <div class="detail-cols">
                  ${g?B`<div class="detail-col">${this._renderHours(e.opening_hours??[])}</div>`:W}
                  ${v?B`<div class="detail-col">${this._renderPaymentMethods(e.payment_methods)}</div>`:W}
                </div>
              </div>
            `:W}
      </div>
    `}_renderHours(e){const t=e.find(e=>"MO"===e.day)??e[0],i=e.find(e=>"SA"===e.day)??e[5],n=e.find(e=>"SO"===e.day)??e[6],r=e.find(e=>"FE"===e.day);return B`
      <div class="hours-grid">
        ${t?B`<span class="day">${this._t("mon_fri")}</span><span>${t.from} – ${t.to}</span>`:W}
        ${i?B`<span class="day">${this._t("sat")}</span><span>${i.from} – ${i.to}</span>`:W}
        ${n?B`<span class="day">${this._t("sun")}</span><span>${n.from} – ${n.to}</span>`:W}
        ${r?B`<span class="day">${this._t("holiday")}</span><span>${r.from} – ${r.to}</span>`:W}
      </div>
    `}_renderPaymentMethods(e){if(!e)return W;const t=[];e.cash&&t.push(B`
        <span class="pm-badge">
          <ha-icon icon="mdi:cash" class="pm-icon" aria-hidden="true"></ha-icon>
          ${this._t("cash")}
        </span>
      `),e.debit_card&&t.push(B`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon" aria-hidden="true"></ha-icon>
          ${this._t("debit_card")}
        </span>
      `),e.credit_card&&t.push(B`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon" aria-hidden="true"></ha-icon>
          ${this._t("credit_card")}
        </span>
      `);for(const i of e.others??[])t.push(B`<span class="pm-badge pm-other">${i}</span>`);return t.length?B`
      <div class="pm-section">
        <div class="pm-label">${this._t("payment")}</div>
        <div class="pm-badges">${t}</div>
      </div>
    `:W}_onTabClick(e){this._activeTab!==e&&(this._activeTab=e,this._expandedStations=new Set)}_onTabKeydown(e,t,i){let n=t;switch(e.key){case"ArrowRight":n=(t+1)%i;break;case"ArrowLeft":n=(t-1+i)%i;break;case"Home":n=0;break;case"End":n=i-1;break;default:return}e.preventDefault(),this._onTabClick(n),this.updateComplete.then(()=>{const e=this.shadowRoot?.querySelectorAll('.tabs [role="tab"]');e?.[n]?.focus()})}_onStationClick(e){const t=new Set(this._expandedStations);t.has(e)?t.delete(e):t.add(e),this._expandedStations=t}_onStationKeydown(e,t,i){i&&("Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._onStationClick(t)))}_onMapLinkClick(e){e.stopPropagation()}_onSparklineClick(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_onRefresh(){if(!this.hass)return;const e=Date.now();if(e-this._lastManualRefresh<ve)return;this._lastManualRefresh=e,this._noNewData=!1;const t=this._resolveEntities(),i=t[this._activeTab]??t[0],n=i?.last_updated;for(const e of t){const t=this.hass.callService("homeassistant","update_entity",{entity_id:e.entity_id});t&&"function"==typeof t.catch&&t.catch(t=>{console.warn("[Tankstellen Austria] update_entity failed for",e.entity_id,t)})}void 0!==this._postRefreshTimeout&&clearTimeout(this._postRefreshTimeout),this._postRefreshTimeout=window.setTimeout(()=>{this._postRefreshTimeout=void 0;try{const e=this._resolveEntities(),t=e[this._activeTab]??e[0];t?.last_updated===n&&(this._noNewData=!0)}catch(e){console.warn("[Tankstellen Austria] post-refresh check failed",e)}},3e3),void 0!==this._cooldownInterval&&clearInterval(this._cooldownInterval);"undefined"!=typeof window&&"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches?(void 0!==this._cooldownTimeout&&clearTimeout(this._cooldownTimeout),this._cooldownTimeout=window.setTimeout(()=>{this._cooldownTimeout=void 0,this._cooldownTick=(this._cooldownTick+1)%1e6},ve)):this._cooldownInterval=window.setInterval(()=>{Date.now()-this._lastManualRefresh>=ve&&void 0!==this._cooldownInterval&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),this._cooldownTick=(this._cooldownTick+1)%1e6},1e3)}static{this.styles=ft}constructor(...e){super(...e),this._activeTab=0,this._expandedStations=new Set,this._history={},this._versionMismatch=null,this._lastManualRefresh=0,this._noNewData=!1,this._historyError=!1,this._cooldownTick=0,this._initDone=!1,this._onDismissVersionBanner=()=>{this._versionMismatch=null},this._onVersionReload=async()=>{if(this._versionMismatch)try{sessionStorage.setItem(`tsa-reload-attempted-${this._versionMismatch}`,"1")}catch{}await async function(){try{if("undefined"!=typeof window&&"caches"in window){const e=await caches.keys();await Promise.all(e.map(e=>caches.delete(e)))}}catch{}location.reload()}()}}}kt([ue({attribute:!1})],At.prototype,"hass",void 0),kt([me()],At.prototype,"_config",void 0),kt([me()],At.prototype,"_activeTab",void 0),kt([me()],At.prototype,"_expandedStations",void 0),kt([me()],At.prototype,"_history",void 0),kt([me()],At.prototype,"_versionMismatch",void 0),kt([me()],At.prototype,"_lastManualRefresh",void 0),kt([me()],At.prototype,"_noNewData",void 0),kt([me()],At.prototype,"_historyError",void 0),kt([me()],At.prototype,"_cooldownTick",void 0),At=kt([de("tankstellen-austria-card")],At);export{At as TankstellenAustriaCard};
