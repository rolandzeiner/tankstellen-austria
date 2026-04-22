// Tankstellen Austria Card — bundled by Rollup. Edit sources in src/, then `npm run build`.
function e(e,t,i,n){var s,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(o<3?s(r):o>3?s(t,i,r):s(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),s=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new o(i,e,n)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,_=f.trustedTypes,m=_?_.emptyScript:"",g=f.reactiveElementPolyfillSupport,y=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},$=(e,t)=>!l(e,t),x={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&c(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:s}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const o=n?.call(this);s?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,n)=>{if(i)e.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of n){const n=document.createElement("style"),s=t.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=i.cssText,e.appendChild(n)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=n;const o=s.fromAttribute(t,e.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(e,t,i,n=!1,s){if(void 0!==e){const o=this.constructor;if(!1===n&&(s=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??$)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:s},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==s||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[y("elementProperties")]=new Map,b[y("finalized")]=new Map,g?.({ReactiveElement:b}),(f.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=e=>e,A=w.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,T=`<${M}>`,D=document,z=()=>D.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,P=Array.isArray,H="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,L=/>/g,R=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),O=/'/g,U=/"/g,B=/^(?:script|style|textarea|title)$/i,j=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),V=j(1),q=j(2),W=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),K=new WeakMap,Z=D.createTreeWalker(D,129);function J(e,t){if(!P(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const X=(e,t)=>{const i=e.length-1,n=[];let s,o=2===t?"<svg>":3===t?"<math>":"",r=F;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===F?"!--"===l[1]?r=I:void 0!==l[1]?r=L:void 0!==l[2]?(B.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=R):void 0!==l[3]&&(r=R):r===R?">"===l[0]?(r=s??F,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?R:'"'===l[3]?U:O):r===U||r===O?r=R:r===I||r===L?r=F:(r=R,s=void 0);const h=r===R&&e[t+1].startsWith("/>")?" ":"";o+=r===F?i+T:c>=0?(n.push(a),i.slice(0,c)+E+i.slice(c)+C+h):i+C+(-2===c?t:h)}return[J(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class Q{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let s=0,o=0;const r=e.length-1,a=this.parts,[l,c]=X(e,t);if(this.el=Q.createElement(l,i),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=Z.nextNode())&&a.length<r;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(E)){const t=c[o++],i=n.getAttribute(e).split(C),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?ne:"?"===r[1]?se:"@"===r[1]?oe:ie}),n.removeAttribute(e)}else e.startsWith(C)&&(a.push({type:6,index:s}),n.removeAttribute(e));if(B.test(n.tagName)){const e=n.textContent.split(C),t=e.length-1;if(t>0){n.textContent=A?A.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],z()),Z.nextNode(),a.push({type:2,index:++s});n.append(e[t],z())}}}else if(8===n.nodeType)if(n.data===M)a.push({type:2,index:s});else{let e=-1;for(;-1!==(e=n.data.indexOf(C,e+1));)a.push({type:7,index:s}),e+=C.length-1}s++}}static createElement(e,t){const i=D.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,n){if(t===W)return t;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const o=N(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(e),s._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(t=Y(e,s._$AS(e,t.values),s,n)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??D).importNode(t,!0);Z.currentNode=n;let s=Z.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let t;2===a.type?t=new te(s,s.nextSibling,this,e):1===a.type?t=new a.ctor(s,a.name,a.strings,this,e):6===a.type&&(t=new re(s,this,e)),this._$AV.push(t),a=i[++r]}o!==a?.index&&(s=Z.nextNode(),o++)}return Z.currentNode=D,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),N(e)?e===G||null==e||""===e?(this._$AH!==G&&this._$AR(),this._$AH=G):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>P(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==G&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(D.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Q.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new ee(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=K.get(e.strings);return void 0===t&&K.set(e.strings,t=new Q(e)),t}k(e){P(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const s of e)n===t.length?t.push(i=new te(this.O(z()),this.O(z()),this,this.options)):i=t[n],i._$AI(s),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,s){this.type=1,this._$AH=G,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(e,t=this,i,n){const s=this.strings;let o=!1;if(void 0===s)e=Y(this,e,t,0),o=!N(e)||e!==this._$AH&&e!==W,o&&(this._$AH=e);else{const n=e;let r,a;for(e=s[0],r=0;r<s.length-1;r++)a=Y(this,n[i+r],t,r),a===W&&(a=this._$AH[r]),o||=!N(a)||a!==this._$AH[r],a===G?e=G:e!==G&&(e+=(a??"")+s[r+1]),this._$AH[r]=a}o&&!n&&this.j(e)}j(e){e===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ne extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===G?void 0:e}}class se extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==G)}}class oe extends ie{constructor(e,t,i,n,s){super(e,t,i,n,s),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??G)===W)return;const i=this._$AH,n=e===G&&i!==G||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==G&&(i===G||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const ae=w.litHtmlPolyfillSupport;ae?.(Q,te),(w.litHtmlVersions??=[]).push("3.3.2");const le=globalThis;let ce=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let s=n._$litPart$;if(void 0===s){const e=i?.renderBefore??null;n._$litPart$=s=new te(t.insertBefore(z(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const he=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},pe={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:$},ue=(e=pe,t,i)=>{const{kind:n,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(void 0===o&&globalThis.litPropertyMetadata.set(s,o=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,s,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const s=this[n];t.call(this,i),this.requestUpdate(n,s,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function fe(e){return(t,i)=>"object"==typeof i?ue(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function _e(e){return fe({...e,state:!0,attribute:!1})}const me=1;class ge{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const ye=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends ge{constructor(e){if(super(e),e.type!==me||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}const i=e.element.classList;for(const e of this.st)e in t||(i.remove(e),this.st.delete(e));for(const e in t){const n=!!t[e];n===this.st.has(e)||this.nt?.has(e)||(n?(i.add(e),this.st.add(e)):(i.remove(e),this.st.delete(e)))}return W}}),ve="1.6.0",$e=12e4,xe=["DIE","SUP","GAS"];function be(e){if(!e)throw new Error("tankstellen-austria-card: config missing");const t={...e};if("string"==typeof t.entities&&(t.entities=[t.entities]),Array.isArray(t.entities)?t.entities=t.entities.filter(e=>"string"==typeof e&&e.includes(".")):null!=t.entities&&(console.warn("[Tankstellen Austria] config.entities must be an array of entity IDs — ignoring",t.entities),delete t.entities),null!=t.max_stations){const e=parseInt(String(t.max_stations),10);t.max_stations=Number.isFinite(e)?Math.max(0,Math.min(5,e)):5}return Array.isArray(t.payment_filter)?t.payment_filter=t.payment_filter.filter(e=>"string"==typeof e&&e.length>0):null!=t.payment_filter&&delete t.payment_filter,Array.isArray(t.cars)?t.cars=t.cars.map(e=>function(e){if(!e||"object"!=typeof e)return null;const t=e,i="string"==typeof t.name?t.name.slice(0,50):"",n=xe.includes(t.fuel_type)?t.fuel_type:"DIE",s=parseInt(String(t.tank_size),10),o=Number.isFinite(s)&&s>=1?Math.min(200,s):50;let r;if(null!=t.consumption){const e=parseFloat(String(t.consumption));Number.isFinite(e)&&e>=0&&(r=Math.min(30,e))}const a={name:i,fuel_type:n,tank_size:o,icon:"string"==typeof t.icon&&t.icon.startsWith("mdi:")?t.icon:"mdi:car"};return null!=r&&(a.consumption=r),a}(e)).filter(e=>null!==e):null!=t.cars&&delete t.cars,t}function we(e){return e&&e.states?Object.keys(e.states).filter(t=>{const i=e.states[t];return t.startsWith("sensor.")&&i?.attributes?.fuel_type&&Array.isArray(i.attributes.stations)}):[]}function ke(e,t){if(!t||!t.length)return!0;const i=e.payment_methods??{};return t.some(e=>"cash"===e?Boolean(i.cash):"debit_card"===e?Boolean(i.debit_card):"credit_card"===e?Boolean(i.credit_card):(i.others??[]).some(t=>t.toLowerCase()===e.toLowerCase()))}function Ae(e){return null!=e&&Number.isFinite(Number(e))?`€ ${Number(e).toFixed(3).replace(".",",")}`:"–"}function Se(e){return null!=e&&Number.isFinite(Number(e))?Number(e).toFixed(3).replace(".",","):"–"}var Ee={version:"Version",invalid_configuration:"Invalid configuration",loading:"Loading…",no_data:"No data available"},Ce={cheapest:"Cheapest price",average:"Avg. price",price:"Price",closed:"Closed",closing_soon:"Closing soon",open_now:"Open",opening_hours:"Opening hours",payment:"Payment",cash:"Cash",debit_card:"Debit card",credit_card:"Credit card",payment_filter_active:"Payment filter active",payment_highlight_active:"Payment filter (highlight)",mon_fri:"Mon–Fri",sat:"Sat",sun:"Sun",holiday:"Holiday",map:"Map",per_liter:"/l",last_7_days:"Last 7 days",min_label:"Min",max_label:"Max",refresh:"Refresh",last_updated:"Updated:",no_new_data:"No new data",version_update:"Tankstellen Austria updated to v{v} — please reload",version_reload:"Reload",fill_up:"Fill up",best_refuel_hour:"Tip: Cheapest between {h1}:00–{h2}:00",best_refuel_hour_weekday:"Tip: Cheapest between {h1}:00–{h2}:00, usually {day}",not_enough_data_hint:"Not enough data yet for a tip (min. 7 days)",confidence_high:"High",confidence_medium:"Medium",confidence_low:"Low",confidence_title:"Recommendation confidence",confidence_span:"Data span",confidence_coverage:"Coverage",confidence_gap:"Gap",confidence_days:"days",confidence_cents:"¢",confidence_short_history_hint:"Note: Home Assistant keeps only 10 days of history by default. For better recommendations raise recorder.purge_keep_days to 30.",median_delta_below:"{c}¢ below median",median_delta_above:"{c}¢ above median",median_delta_equal:"at median"},Me={DIE:"Diesel",SUP:"Super 95",GAS:"CNG"},Te=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],De={entities:"Sensors",entities_hint:"Leave empty for auto-detection",max_stations:"Number of stations",show_map_links:"Show Google Maps links",show_opening_hours:"Show opening hours",show_payment_methods:"Show payment methods",show_history:"Show price history",show_best_refuel:"Show refuel tip",show_median_line:"Show 7-day median",show_hour_envelope:"Typical hourly range (4 wk)",show_noon_markers:"Noon reset markers",recorder_hint_intro:"Home Assistant keeps only 10 days of history by default. For better recommendations, add this block to configuration.yaml and restart:",copy:"Copy",copied:"Copied",payment_filter:"Only stations with",payment_filter_custom_placeholder:"Custom, e.g. Routex",payment_filter_custom_hint:"Must match the API string exactly. Common values: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC",payment_highlight_mode:"Highlight instead of filter",section_sensors:"Sensors",section_display:"Display",section_payment_filter:"Payment filter",section_tab_labels:"Tab labels",tab_labels_hint:"Leave empty to use the default label",section_cars:"Cars",show_cars:"Show fill-up costs",show_car_fillup:"Show fill-up cost",show_car_consumption:"Show consumption",cars_both_off_hint:'No rows enabled. To hide cars entirely, use "Show fill-up costs" in Display options.',car_name_placeholder:"Name (e.g. Golf TDI)",car_tank_placeholder:"Liters",car_consumption_placeholder:"⌀ l/100km",add_car:"+ Add car"},ze={common:Ee,card:Ce,fuel_types:Me,weekdays:Te,editor:De},Ne={version:"Version",invalid_configuration:"Ungültige Konfiguration",loading:"Lädt…",no_data:"Keine Daten verfügbar"},Pe={cheapest:"Günstigster Preis",average:"Ø Preis",price:"Preis",closed:"Geschlossen",closing_soon:"Schließt bald",open_now:"Geöffnet",opening_hours:"Öffnungszeiten",payment:"Zahlungsarten",cash:"Bar",debit_card:"Bankomat",credit_card:"Kreditkarte",payment_filter_active:"Zahlungsfilter aktiv",payment_highlight_active:"Zahlungsfilter (Hervorhebung)",mon_fri:"Mo–Fr",sat:"Sa",sun:"So",holiday:"Feiertag",map:"Karte",per_liter:"/l",last_7_days:"Letzte 7 Tage",min_label:"Min",max_label:"Max",refresh:"Aktualisieren",last_updated:"Aktualisiert:",no_new_data:"Keine neuen Daten",version_update:"Tankstellen Austria wurde auf v{v} aktualisiert — bitte neu laden",version_reload:"Neu laden",fill_up:"Volltanken",best_refuel_hour:"Tipp: Am günstigsten zwischen {h1}:00–{h2}:00",best_refuel_hour_weekday:"Tipp: Am günstigsten zwischen {h1}:00–{h2}:00, meist {day}",not_enough_data_hint:"Noch zu wenig Daten für Empfehlung (mind. 7 Tage)",confidence_high:"Hoch",confidence_medium:"Mittel",confidence_low:"Niedrig",confidence_title:"Empfehlungsgüte",confidence_span:"Datenumfang",confidence_coverage:"Abdeckung",confidence_gap:"Vorsprung",confidence_days:"Tage",confidence_cents:"Cent",confidence_short_history_hint:"Hinweis: Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen recorder.purge_keep_days auf 30 erhöhen.",median_delta_below:"{c}¢ unter Median",median_delta_above:"{c}¢ über Median",median_delta_equal:"auf Median"},He={DIE:"Diesel",SUP:"Super 95",GAS:"CNG Erdgas"},Fe=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],Ie={entities:"Sensoren",entities_hint:"Leer lassen für automatische Erkennung",max_stations:"Anzahl Tankstellen",show_map_links:"Google Maps Links anzeigen",show_opening_hours:"Öffnungszeiten anzeigen",show_payment_methods:"Zahlungsarten anzeigen",show_history:"Preisverlauf anzeigen",show_best_refuel:"Tank-Tipp anzeigen",show_median_line:"7-Tage-Median einblenden",show_hour_envelope:"Typischer Stundenverlauf (4 Wo)",show_noon_markers:"12:00-Markierung (Preisreset)",recorder_hint_intro:"Home Assistant speichert standardmäßig nur 10 Tage Verlauf. Für bessere Empfehlungen diesen Block in configuration.yaml ergänzen und neu starten:",copy:"Kopieren",copied:"Kopiert",payment_filter:"Nur Tankstellen mit",payment_filter_custom_placeholder:"Benutzerdefiniert, z.B. Routex",payment_filter_custom_hint:"Der Wert muss exakt dem API-String entsprechen. Häufige Werte: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC",payment_highlight_mode:"Hervorheben statt filtern",section_sensors:"Sensoren",section_display:"Anzeige",section_payment_filter:"Zahlungsfilter",section_tab_labels:"Tab-Bezeichnungen",tab_labels_hint:"Leer lassen, um die Standard-Bezeichnung zu verwenden",section_cars:"Fahrzeuge",show_cars:"Tankkosten anzeigen",show_car_fillup:"Tankkosten anzeigen",show_car_consumption:"Verbrauch anzeigen",cars_both_off_hint:"Keine Zeile aktiv. Um Fahrzeuge komplett auszublenden, nutze „Tankkosten anzeigen“ in den Anzeige-Optionen.",car_name_placeholder:"Name (z.B. Golf TDI)",car_tank_placeholder:"Liter",car_consumption_placeholder:"⌀ l/100km",add_car:"+ Fahrzeug hinzufügen"},Le={common:Ne,card:Pe,fuel_types:He,weekdays:Fe,editor:Ie};const Re={en:Object.freeze({__proto__:null,card:Ce,common:Ee,default:ze,editor:De,fuel_types:Me,weekdays:Te}),de:Object.freeze({__proto__:null,card:Pe,common:Ne,default:Le,editor:Ie,fuel_types:He,weekdays:Fe})};function Oe(e,t){return e.split(".").reduce((e,t)=>{if(e&&"object"==typeof e&&t in e)return e[t]},t)}function Ue(e,t){const i=Oe(e,t);return"string"==typeof i?i:void 0}function Be(e,t="",i=""){const n=("undefined"!=typeof localStorage&&localStorage.getItem("selectedLanguage")||"en").replace(/['"]+/g,"").replace("-","_");let s=Ue(e,Re[n]??Re.en);return void 0===s&&(s=Ue(e,Re.en)),void 0===s&&(s=e),""!==t&&""!==i&&(s=s.replace(t,i)),s}function je(e){return(e.configLanguage||e.hassLanguage||"de").replace("-","_")}function Ve(e){const t=je(e),i=Oe("weekdays",Re[t]??Re.de);if(Array.isArray(i)&&i.every(e=>"string"==typeof e))return i;const n=Oe("weekdays",Re.de);return Array.isArray(n)?n:[]}function qe(e,t){const i=je(t),n=Oe("fuel_types",Re[i]??Re.de)??Oe("fuel_types",Re.de),s=n?.[e];return"string"==typeof s?s:e}const We=new Map,Ge=new Map;function Ke(e){if("number"==typeof e.lu)return Math.round(1e3*e.lu);const t=e.lu??e.last_updated??e.last_changed;return t?new Date(t).getTime():0}function Ze(e){const t=e.length;if(0===t)return"";if(1===t)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;if(2===t)return`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)} L ${e[1].x.toFixed(2)} ${e[1].y.toFixed(2)}`;const i=new Array(t-1);for(let n=0;n<t-1;n++){const t=e[n+1].x-e[n].x;i[n]=0===t?0:(e[n+1].y-e[n].y)/t}const n=new Array(t);n[0]=i[0],n[t-1]=i[t-2];for(let e=1;e<t-1;e++)n[e]=(i[e-1]+i[e])/2;for(let e=0;e<t-1;e++){if(0===i[e]){n[e]=0,n[e+1]=0;continue}const t=n[e]/i[e],s=n[e+1]/i[e],o=t*t+s*s;if(o>9){const r=3/Math.sqrt(o);n[e]=r*t*i[e],n[e+1]=r*s*i[e]}}let s=`M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`;for(let i=0;i<t-1;i++){const t=e[i+1].x-e[i].x,o=e[i].x+t/3,r=e[i].y+n[i]*t/3,a=e[i+1].x-t/3,l=e[i+1].y-n[i+1]*t/3;s+=` C ${o.toFixed(2)} ${r.toFixed(2)}, ${a.toFixed(2)} ${l.toFixed(2)}, ${e[i+1].x.toFixed(2)} ${e[i+1].y.toFixed(2)}`}return s}function Je(e,t,i){return Math.max(t,Math.min(i,e))}function Xe(e,t){const i=e.length;if(0===i)return NaN;if(1===i)return e[0];const n=Je(t,0,1)*(i-1),s=Math.floor(n),o=Math.ceil(n);if(s===o)return e[s];const r=n-s;return e[s]*(1-r)+e[o]*r}const Qe=280,Ye=48;function et(e){if(e.length<2)return null;const t=[...e].sort((e,t)=>e-t),i=(t.length-1)/2,n=(t[Math.floor(i)]+t[Math.ceil(i)])/2,s=100*(e[e.length-1]-n),o=Math.abs(s).toFixed(1);return s<=-.05?{key:"median_delta_below",cents:o,cls:"median-delta-good"}:s>=.05?{key:"median_delta_above",cents:o,cls:"median-delta-bad"}:{key:"median_delta_equal",cents:o,cls:"median-delta-neutral"}}function tt(e,t){const i=[...e].sort((e,t)=>e-t),n=(i.length-1)/2;return t((i[Math.floor(n)]+i[Math.ceil(n)])/2)}function it(e){const t={template:G,hoverPoints:[],medianDelta:null,viewBoxWidth:Qe,viewBoxHeight:Ye};try{const i=e.points;if(!i||i.length<2)return t;const n=function(e){const t=Date.now()-6048e5;let i=e.filter(e=>e.time>=t);if(i.length<2){const n=e.filter(e=>e.time<t),s=n.length?n[n.length-1]:null;s&&(i=[s,...i])}return i}(i);if(n.length<2)return t;const s=n.map(e=>e.value);let o=Math.min(...s),r=Math.max(...s);const a=e.showHourEnvelope?e.hourEnvelope??null:null;if(a)for(let e=0;e<24;e++){const t=a.minByHour[e],i=a.maxByHour[e];null!=t&&null!=i&&(o=Math.min(o,t),r=Math.max(r,i))}const l=r-o||.01,c=e=>44-(e-o)/l*40,d=n.map((e,t)=>({x:t/(n.length-1)*Qe,y:c(e.value)})),h=Ze(d),p=h?`${h} L ${Qe.toFixed(2)} ${Ye.toFixed(2)} L 0 ${Ye.toFixed(2)} Z`:"";let u=G;if(a){const e=[],t=[];for(let i=0;i<n.length;i++){const s=new Date(n[i].time).getHours(),o=a.maxByHour[s],r=a.minByHour[s];null!=o&&null!=r&&(e.push({x:d[i].x,y:c(o)}),t.push({x:d[i].x,y:c(r)}))}if(e.length>=2){const i=function(e,t){if(!e||!t||e.length<2||e.length!==t.length)return"";const i=Ze(e),n=Ze([...t].reverse()).replace(/^M\s+([-\d.]+)\s+([-\d.]+)/,(e,t,i)=>`L ${t} ${i}`);return`${i} ${n} Z`}(e,t);i&&(u=q`<path d=${i} fill="var(--primary-color)" fill-opacity="0.08" stroke="none"/>`)}}const f=[];if(e.showNoonMarkers&&n.length>=2){const e=n[0].time,t=n[n.length-1].time,i=new Date(e);i.setHours(12,0,0,0),i.getTime()<e&&i.setDate(i.getDate()+1);const s=i=>{if(i<=e||i>=t)return null;let s=0,o=n.length-1;for(;s<o-1;){const e=s+o>>1;n[e].time<=i?s=e:o=e}const r=n[s+1].time-n[s].time,a=r>0?(i-n[s].time)/r:0;return d[s].x+a*(d[s+1].x-d[s].x)};for(let e=i.getTime();e<=t;e+=864e5){const t=s(e);null!=t&&f.push(q`
          <line x1=${t.toFixed(1)} y1="0" x2=${t.toFixed(1)} y2=${Ye}
                stroke="var(--secondary-text-color)" stroke-width="0.9"
                stroke-dasharray="2,3" opacity="0.55"/>
        `)}}const _=e.showMedianLine?et(s):null,m=e.showMedianLine?q`<line x1="0" y1=${tt(s,c).toFixed(1)}
                  x2=${Qe} y2=${tt(s,c).toFixed(1)}
                  stroke="var(--secondary-text-color)" stroke-width="0.8"
                  stroke-dasharray="4,3" opacity="0.55"/>`:G,g=e.markerIdx??-1,y=g>=0&&g<d.length?q`
          <line x1=${d[g].x.toFixed(1)} y1="0"
                x2=${d[g].x.toFixed(1)} y2=${Ye}
                stroke="var(--success-color,#4CAF50)" stroke-width="1"
                stroke-dasharray="3,2" opacity="0.8"/>
          <circle cx=${d[g].x.toFixed(1)}
                  cy=${d[g].y.toFixed(1)} r="3.5"
                  fill="var(--success-color,#4CAF50)"
                  stroke="var(--card-background-color,#fff)" stroke-width="1.5"/>`:G,v=n.map((e,t)=>({t:e.time,v:e.value,x:+d[t].x.toFixed(1),y:+d[t].y.toFixed(1)})),$=`spark-grad-${Math.random().toString(36).slice(2,8)}`,x=e.showMedianLine?(()=>{const t=et(s);if(!t)return G;const i={median_delta_below:e.translations.median_delta_below,median_delta_above:e.translations.median_delta_above,median_delta_equal:e.translations.median_delta_equal}[t.key].replace("{c}",t.cents);return V`
            <span class="median-delta ${t.cls}">${i}</span>
          `})():G;return{template:V`
      <svg
        class="sparkline"
        viewBox="0 0 ${Qe} ${Ye}"
        preserveAspectRatio="none"
        data-points=${JSON.stringify(v)}
        data-width=${Qe}
        data-height=${Ye}
      >
        <defs>
          <linearGradient id=${$} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.3" />
            <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        ${f}
        ${u}
        <path d=${p} fill="url(#${$})" />
        ${y}
        ${m}
        <path
          d=${h}
          fill="none"
          stroke="var(--primary-color)"
          stroke-width="1.5"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        <line
          class="sparkline-hover-line"
          x1="0" y1="0" x2="0" y2=${Ye}
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
          ${Se(o)}
        </span>
        <span class="sparkline-period">
          ${e.translations.last_7_days}${x===G?G:V` · ${x}`}
        </span>
        <span>
          <span class="sparkline-minmax-label">${e.translations.max_label}</span>
          ${Se(r)}
        </span>
      </div>
    `,hoverPoints:v,medianDelta:_,viewBoxWidth:Qe,viewBoxHeight:Ye}}catch(e){return console.warn("[Tankstellen Austria] sparkline render failed:",e),t}}const nt=36e5,st=864e5,ot=14*st;function rt(e){const t=new Date(e);t.setHours(0,0,0,0);const i=t.getDay();return t.setDate(t.getDate()-(0===i?6:i-1)),t.getTime()}function at(e,t){const i=[],n=(e,t,n)=>{for(let s=Math.ceil(t/nt)*nt;s<n;s+=nt)i.push({t:s,price:e})};for(let t=0;t<e.length-1;t++)n(e[t].value,e[t].time,e[t+1].time);return n(e[e.length-1].value,e[e.length-1].time,t),i}function lt(e){const t=new Map;for(const i of e){const e=rt(i.t),n=t.get(e);n?n.push(i):t.set(e,[i])}return t}function ct(e,t){const i=e.map(e=>e.length>=t?function(e){if(0===e.length)return NaN;const t=[...e].sort((e,t)=>e.value-t.value),i=t.reduce((e,t)=>e+t.weight,0);let n=0;for(const e of t)if(n+=e.weight,n>=i/2)return e.value;return t[t.length-1].value}(e):NaN);let n=-1,s=1/0;return i.forEach((e,t)=>{!Number.isNaN(e)&&e<s&&(s=e,n=t)}),{medians:i,bestIdx:n,bestVal:s}}function dt(e,t){const i=e.medians.filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t);if(i.length<2||e.bestIdx<0)return 0;return Je(100*(Xe(i,.5)-e.bestVal)/t,0,1)}const ht=r`
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
`,pt=r`
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
`;var ut,ft;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(ut||(ut={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(ft||(ft={}));let _t=class extends ce{constructor(){super(...arguments),this._config={type:"tankstellen-austria-card"}}setConfig(e){this._config={...e}}render(){return V`
      <div class="editor">
        <div class="editor-section">
          <div class="section-header">${Be("editor.section_main")}</div>

          <ha-textfield
            label=${Be("editor.name")}
            .value=${this._config.name||""}
            .configValue=${"name"}
            @input=${this._valueChanged}
          ></ha-textfield>

          ${this.hass?V`
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{entity:{}}}
                  .value=${this._config.entity||void 0}
                  .configValue=${"entity"}
                  .label=${Be("editor.entity")}
                  .required=${!1}
                  @value-changed=${this._valueChanged}
                ></ha-selector>
              `:V`<p>${Be("common.loading")}</p>`}
        </div>

        <div class="editor-section">
          <div class="section-header">${Be("editor.section_display")}</div>

          <div class="toggle-row">
            <label>${Be("editor.show_warning")}</label>
            <ha-switch
              .checked=${this._config.show_warning??!1}
              .configValue=${"show_warning"}
              @change=${this._valueChanged}
            ></ha-switch>
          </div>

          <div class="toggle-row">
            <label>${Be("editor.show_error")}</label>
            <ha-switch
              .checked=${this._config.show_error??!1}
              .configValue=${"show_error"}
              @change=${this._valueChanged}
            ></ha-switch>
          </div>
        </div>
      </div>
    `}_valueChanged(e){if(!this._config||!this.hass)return;const t=e.target;if(!t.configValue)return;const i=void 0!==t.checked?t.checked:e.detail?.value??t.value;this._config[t.configValue]!==i&&(this._config={...this._config,[t.configValue]:i},((e,t,i,n)=>{n=n||{},i=null==i?{}:i;const s=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});s.detail=i,e.dispatchEvent(s)})(this,"config-changed",{config:this._config}))}static{this.styles=pt}};e([fe({attribute:!1})],_t.prototype,"hass",void 0),e([_e()],_t.prototype,"_config",void 0),_t=e([he("tankstellen-austria-card-editor")],_t),console.info(`%c  Tankstellen Austria Card  %c  ${Be("common.version")} ${ve}  `,"color: white; font-weight: bold; background: #DC2026","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"tankstellen-austria-card",name:"Tankstellen Austria",description:"Austrian fuel prices from E-Control with sparklines and best-refuel analytics.",preview:!0,documentationURL:"https://github.com/rolandzeiner/tankstellen-austria"});let mt=class extends ce{constructor(){super(...arguments),this._activeTab=0,this._expandedStations=new Set,this._history={},this._versionMismatch=null,this._lastManualRefresh=0,this._noNewData=!1,this._cooldownTick=0,this._initDone=!1}static getConfigElement(){return document.createElement("tankstellen-austria-card-editor")}static getStubConfig(e){const t=we(e);return{entities:t.length?[t[0]]:[],max_stations:5,show_map_links:!0,show_opening_hours:!0,show_payment_methods:!0,show_history:!0,show_best_refuel:!0,payment_filter:[],payment_highlight_mode:!0,show_cars:!1,cars:[]}}setConfig(e){this._config=be(e)}getCardSize(){return 6}shouldUpdate(e){if(!this._config)return!1;if(e.has("_config")||e.has("_activeTab")||e.has("_expandedStations")||e.has("_history")||e.has("_versionMismatch")||e.has("_lastManualRefresh")||e.has("_noNewData")||e.has("_cooldownTick"))return!0;const t=e.get("hass");if(!t)return!0;return this._trackedEntityIds().some(e=>t.states[e]!==this.hass.states[e])}_trackedEntityIds(){return this._config.entities?.length?this._config.entities:we(this.hass)}_resolveEntities(){if(!this.hass)return[];return this._trackedEntityIds().map(e=>{const t=this.hass.states[e];return t?{entity_id:e,state:t.state,attributes:t.attributes,last_updated:t.last_updated}:null}).filter(e=>null!==e)}_ctx(){return{configLanguage:this._config?.language,hassLanguage:this.hass?.language}}_t(e,t){return function(e,t,i){const n=je(t);let s=Ue(e,Re[n]??Re.de);if(void 0===s&&(s=Ue(e,Re.de)),void 0===s&&(s=e),i)for(const[e,t]of Object.entries(i))s=s.replace(`{${e}}`,t);return s}(`card.${e}`,this._ctx(),t)}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._historyInterval&&(clearInterval(this._historyInterval),this._historyInterval=void 0),void 0!==this._cooldownInterval&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),this._sparklineCleanup&&(this._sparklineCleanup(),this._sparklineCleanup=void 0),this._initDone=!1}updated(e){!this._initDone&&this.hass&&this._config&&(this._initDone=!0,this._fetchAllHistory(),this._historyInterval=window.setInterval(()=>{this._fetchAllHistory()},18e5),this._checkCardVersion()),this._reattachSparklineHover()}async _fetchAllHistory(){try{const e=this._resolveEntities();await Promise.all(e.map(async e=>{const t=await async function(e,t,i={}){if(!e?.callWS)return[];const n=Ge.get(t);if(n)return n;const s=i.days??28,o=new Date,r=new Date(o.getTime()-24*s*60*60*1e3),a=(async()=>{try{const i=await e.callWS({type:"history/history_during_period",start_time:r.toISOString(),end_time:o.toISOString(),entity_ids:[t],minimal_response:!0,significant_changes_only:!0}),n=(i?.[t]??[]).map(e=>({time:Ke(e),value:parseFloat(String(e.s??e.state??""))})).filter(e=>Number.isFinite(e.value)&&e.time>0);return We.set(t,n),n}catch(e){return console.warn("[Tankstellen Austria] history fetch failed for",t,"— sparkline and best-refuel will be empty:",e),We.get(t)??[]}finally{Ge.delete(t)}})();return Ge.set(t,a),a}(this.hass,e.entity_id);this._history={...this._history,[e.entity_id]:t}}))}catch(e){console.warn("[Tankstellen Austria] history refresh failed",e)}}async _checkCardVersion(){if(this.hass?.callWS)try{const e=await this.hass.callWS({type:"tankstellen_austria/card_version"});e?.version&&e.version!==ve&&(this._versionMismatch=e.version)}catch{}}_reattachSparklineHover(){this._sparklineCleanup&&(this._sparklineCleanup(),this._sparklineCleanup=void 0);const e=this.shadowRoot?.querySelector(".sparkline-container[data-entity]");if(!e)return;const t=Ve(this._ctx()),i=je(this._ctx());this._sparklineCleanup=function(e,t){const i=()=>{};try{const n=e.querySelector("svg.sparkline"),s=e.querySelector(".sparkline-tooltip");if(!n||!s)return i;const o=n.querySelector(".sparkline-hover-line"),r=n.querySelector(".sparkline-hover-dot"),a=s.querySelector(".sparkline-tooltip-time"),l=s.querySelector(".sparkline-tooltip-price");if(!(o&&r&&a&&l))return i;let c;try{c=JSON.parse(n.dataset.points||"[]")}catch{c=[]}if(!c.length)return i;const d=Number(n.dataset.width)||280,h=i=>{const h=n.getBoundingClientRect();if(0===h.width)return;const p=Math.max(0,Math.min(1,(i-h.left)/h.width))*d;let u=c[0],f=Math.abs(c[0].x-p);for(const e of c){const t=Math.abs(e.x-p);t<f&&(u=e,f=t)}o.setAttribute("x1",String(u.x)),o.setAttribute("x2",String(u.x)),o.setAttribute("opacity","0.5"),r.setAttribute("cx",String(u.x)),r.setAttribute("cy",String(u.y)),r.setAttribute("opacity","1"),a.textContent=t.formatTime(u.t),l.textContent=t.formatPrice(u.v),s.hidden=!1;const _=e.getBoundingClientRect(),m=u.x/d*h.width+(h.left-_.left);s.style.left="0px";const g=s.offsetWidth,y=m-g/2,v=Math.max(0,Math.min(_.width-g,y));s.style.left=`${v}px`},p=()=>{o.setAttribute("opacity","0"),r.setAttribute("opacity","0"),s.hidden=!0},u=e=>h(e.clientX),f=e=>{e.touches[0]&&h(e.touches[0].clientX)};return n.addEventListener("mousemove",u),n.addEventListener("mouseleave",p),n.addEventListener("touchstart",f,{passive:!0}),n.addEventListener("touchmove",f,{passive:!0}),n.addEventListener("touchend",p),()=>{n.removeEventListener("mousemove",u),n.removeEventListener("mouseleave",p),n.removeEventListener("touchstart",f),n.removeEventListener("touchmove",f),n.removeEventListener("touchend",p)}}catch(e){return console.warn("[Tankstellen Austria] sparkline hover setup failed:",e),i}}(e,{formatTime:e=>{const n=new Date(e);return`${t[n.getDay()]?.slice(0,2)??""} ${"de"===i?`${n.getDate()}.${n.getMonth()+1}.`:`${n.getMonth()+1}/${n.getDate()}`} ${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`},formatPrice:Ae})}render(){if(!this.hass||!this._config)return V`<ha-card></ha-card>`;const e=this._resolveEntities(),t=this._activeTab>=e.length?0:this._activeTab;if(!e.length)return V`
        <ha-card>
          ${this._renderVersionBanner()}
          <div class="empty">${this._t("no_data")}</div>
        </ha-card>
      `;const i=e[t]??e[0];return V`
      <ha-card>
        ${this._renderVersionBanner()}
        ${this._renderTabs(e,t)}
        ${this._renderHeader(i)}
        ${this._renderCars(i)}
        ${this._renderStationList(i,t)}
      </ha-card>
    `}_renderVersionBanner(){if(!this._versionMismatch)return G;const e=this._t("version_update",{v:this._versionMismatch});return V`
      <div class="version-notice">
        <span>${e}</span>
        <button class="version-reload-btn" @click=${this._onVersionReload}>
          ${this._t("version_reload")}
        </button>
      </div>
    `}_renderTabs(e,t){if(e.length<=1)return G;const i=this._config.tab_labels??{};return V`
      <div class="tabs">
        ${e.map((e,n)=>{const s=i[e.entity_id];let o;if("string"==typeof s&&s.trim().length>0)o=s;else{if(o=qe(e.attributes.fuel_type??"",this._ctx()),!0===e.attributes.dynamic_mode){const t=e.attributes.dynamic_entity,i=t?this.hass.states[t]?.attributes?.friendly_name||t.split(".")[1]:null;i&&(o+=` · ${i}`)}}return V`
            <button
              class=${ye({tab:!0,active:n===t})}
              @click=${()=>this._onTabClick(n)}
            >
              ${o}
            </button>
          `})}
      </div>
    `}_renderHeader(e){const t=e.attributes.stations??[];if(!t.length)return G;const i=e.attributes.fuel_type??"",n=e.attributes.fuel_type_name||qe(i,this._ctx()),s=e.attributes.average_price,o=t[0]?.price,r=!0===e.attributes.dynamic_mode,a=!1!==this._config.show_history;return V`
      <div class="card-header">
        <div class="header-top">
          <div class="fuel-label">
            <ha-icon icon="mdi:gas-station" class="fuel-icon"></ha-icon>
            <span>${n}</span>
          </div>
          ${r?this._renderDynamicHeader(e):V`
                <div class="header-prices">
                  <div class="header-price-item">
                    <span class="header-price-label">${this._t("cheapest")}</span>
                    <span class="header-price-value">${Ae(o)}</span>
                  </div>
                  ${null!=s?V`
                        <div class="header-price-item">
                          <span class="header-price-label">${this._t("average")}</span>
                          <span class="header-price-value avg">${Ae(s)}</span>
                        </div>
                      `:G}
                </div>
              `}
        </div>
        ${a&&!r?this._renderSparkline(e):G}
      </div>
    `}_renderDynamicHeader(e){const t=e.last_updated?new Date(e.last_updated).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"",i=$e-(Date.now()-this._lastManualRefresh),n=i>0,s=n?(()=>{const e=Math.ceil(i/1e3);return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`})():"";return V`
      <div class="dynamic-meta">
        <div class="dynamic-meta-inner">
          ${t?V`<span class="last-updated">${this._t("last_updated")} ${t}</span>`:G}
          ${this._noNewData?V`<span class="no-new-data">${this._t("no_new_data")}</span>`:G}
        </div>
      </div>
      <button
        class=${ye({"refresh-btn":!0,cooling:n})}
        @click=${this._onRefresh}
      >
        <ha-icon icon="mdi:refresh" class="refresh-icon"></ha-icon>
        ${n?s:this._t("refresh")}
      </button>
    `}_renderSparkline(e){const t=e.entity_id,i=this._history[t]??[];if(i.length<2)return G;const n=!0===this._config.show_median_line,s=!0===this._config.show_hour_envelope,o=!0===this._config.show_noon_markers,r=s?function(e){if(!e||e.length<2)return null;const t=Date.now();if(t-e[0].time<7*st)return null;const i=at(e,t);if(0===i.length)return null;const n=lt(i),s=Array.from({length:24},()=>[]);for(const e of n.values()){if(e.length<24)continue;const t=e.map(e=>e.price).sort((e,t)=>e-t),i=Xe(t,.05),n=Xe(t,.95);for(const t of e){const e=Je(t.price,i,n);s[new Date(t.t).getHours()].push(e)}}const o=new Array(24).fill(null),r=new Array(24).fill(null);let a=0;for(let e=0;e<24;e++){const t=s[e];if(t.length<3)continue;const i=[...t].sort((e,t)=>e-t);o[e]=Xe(i,.1),r[e]=Xe(i,.9),a++}return a<6?null:{minByHour:o,maxByHour:r}}(i):null,a=!1!==this._config.show_best_refuel?function(e){if(!e||e.length<2)return null;const t=Date.now(),i=t-e[0].time;if(i<7*st)return{hasEnoughData:!1};const n=at(e,t);if(0===n.length)return{hasEnoughData:!1};const s=lt(n),o=[];for(const e of s.values()){if(e.length<24)continue;const i=e.map(e=>e.price).sort((e,t)=>e-t),n=Xe(i,.05),s=Xe(i,.95);let r=0;const a=e.map(e=>{const t=Je(e.price,n,s);return r+=t,{t:e.t,price:t}}),l=r/a.length;for(const{t:e,price:i}of a)o.push({t:e,delta:i-l,weight:Math.pow(.5,(t-e)/ot)})}if(0===o.length)return{hasEnoughData:!1};const r=Array.from({length:24},()=>[]),a=Array.from({length:7},()=>[]);for(const{t:e,delta:t,weight:i}of o){const n=new Date(e);r[n.getHours()].push({value:t,weight:i}),a[n.getDay()].push({value:t,weight:i})}const l=ct(r,3);if(l.bestIdx<0)return{hasEnoughData:!1};const c=ct(a,3),d=i/st,h=Math.min(1,d/28),p=r.filter(e=>e.length>=3).length/24,u=dt(l,1.5),f=l.medians.filter(e=>!Number.isNaN(e)).sort((e,t)=>e-t),_=f.length>=2?100*(Xe(f,.5)-l.bestVal):0,m=(h+p+u)/3,g=m>=.75?"high":m>=.5?"medium":"low",y=a.filter(e=>e.length>=3).length/7,v=dt(c,.8),$=(c.bestIdx>=0?(h+y+v)/3:0)>=.75;return{hasEnoughData:!0,hour:l.bestIdx,weekday:$?c.bestIdx:null,confidence:{level:g,score:m,span_days:Math.round(d),coverage_pct:Math.round(100*p),gap_cents:Math.round(10*_)/10}}}(i):null,l=function(e,t){if(!t?.hasEnoughData||null==t.hour)return-1;const i=new Date,n=new Date(i);if(null!=t.weekday){let e=(i.getDay()-t.weekday+7)%7;0===e&&i.getHours()<t.hour&&(e=7),n.setDate(n.getDate()-e)}else i.getHours()<t.hour&&n.setDate(n.getDate()-1);n.setHours(t.hour,0,0,0);const s=n.getTime();let o=1/0,r=-1;for(let t=0;t<e.length;t++){const i=Math.abs(e[t].time-s);i<o&&(o=i,r=t)}return r}(i,a),c=it({points:i,showMedianLine:n,showHourEnvelope:s,showNoonMarkers:o,hourEnvelope:r,markerIdx:l,translations:{min_label:this._t("min_label"),max_label:this._t("max_label"),last_7_days:this._t("last_7_days"),median_delta_below:this._t("median_delta_below"),median_delta_above:this._t("median_delta_above"),median_delta_equal:this._t("median_delta_equal")}});return c.template===G?G:V`
      <div
        class="sparkline-container"
        data-entity=${t}
        @click=${()=>this._onSparklineClick(t)}
      >
        ${c.template}
        ${this._renderRecommendation(a)}
      </div>
    `}_renderRecommendation(e){if(!e)return G;if(!e.hasEnoughData)return V`
        <div class="refuel-hint">
          <ha-icon icon="mdi:information-outline" class="refuel-icon"></ha-icon>
          ${this._t("not_enough_data_hint")}
        </div>
      `;const t=e.hour??0,i=String(t).padStart(2,"0"),n=String((t+1)%24).padStart(2,"0");let s;if(null!=e.weekday){const t=Ve(this._ctx())[e.weekday]??"";s=this._t("best_refuel_hour_weekday",{h1:i,h2:n,day:t})}else s=this._t("best_refuel_hour",{h1:i,h2:n});const o=e.confidence;if(!o)return V`
        <div class="refuel-recommendation">
          <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon"></ha-icon>
          <span class="refuel-text">${s}</span>
        </div>
      `;const r=this._t(`confidence_${o.level}`),a=[`${this._t("confidence_title")}: ${r}`,`• ${this._t("confidence_span")}: ${o.span_days} ${this._t("confidence_days")}`,`• ${this._t("confidence_coverage")}: ${o.coverage_pct}%`,`• ${this._t("confidence_gap")}: ${o.gap_cents.toFixed(1)} ${this._t("confidence_cents")}`];o.span_days<14&&a.push("",this._t("confidence_short_history_hint"));const l=function(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}(a.join("\n")),c=`refuel-confidence refuel-confidence-${o.level}`;return V`
      <div class="refuel-recommendation">
        <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon"></ha-icon>
        <span class="refuel-text">${s}</span>
        <span class=${c} title=${l}>${r}</span>
      </div>
    `}_renderCars(e){const t=e.attributes.stations??[];if(!t.length)return G;const i=!0===this._config.show_cars,n=!1!==this._config.show_car_fillup,s=!1!==this._config.show_car_consumption;if(!i||!n&&!s)return G;const o=e.attributes.fuel_type??"",r=this._config.payment_filter??[],a=!0===this._config.payment_highlight_mode,l=(this._config.cars??[]).filter(e=>e.fuel_type===o&&e.tank_size>0&&e.name),c=n?l:l.filter(e=>Number(e.consumption)>0);if(!c.length)return G;const d=a?t:t.filter(e=>ke(e,r)),h=a?t[0]?.price:d[0]?.price;return V`
      <div class="cars-fillup">
        ${c.map(e=>this._renderCarRow(e,h,n,s))}
      </div>
    `}_renderCarRow(e,t,i,n){const s=Number(e.consumption),o=Number.isFinite(s)&&s>0?s.toFixed(1).replace(".",","):"";if(i){const i=null!=t?`€ ${(t*Number(e.tank_size)).toFixed(2).replace(".",",")}`:"–",r=null!=t&&s>0?`€ ${(t*s).toFixed(2).replace(".",",")}`:"–";return V`
        <div class="car-fillup-row">
          <span class="car-fillup-name">
            <ha-icon icon=${e.icon||"mdi:car"} class="car-icon"></ha-icon>
            ${e.name}
            <span class="car-fillup-liters">${e.tank_size} L</span>
          </span>
          <span class="car-fillup-cost">${i}</span>
        </div>
        ${n&&s>0?V`
              <div class="car-per100-row">
                <span class="car-per100-label">${o} l/100 km</span>
                <span class="car-per100-cost">${r} / 100 km</span>
              </div>
            `:G}
      `}const r=null!=t?`€ ${(t*s).toFixed(2).replace(".",",")}`:"–";return V`
      <div class="car-fillup-row">
        <span class="car-fillup-name">
          <ha-icon icon=${e.icon||"mdi:car"} class="car-icon"></ha-icon>
          ${e.name}
          <span class="car-fillup-liters">${o} l/100 km</span>
        </span>
        <span class="car-fillup-cost">${r} / 100 km</span>
      </div>
    `}_renderStationList(e,t){const i=e.attributes.stations??[],n=parseInt(String(this._config.max_stations),10),s=Number.isFinite(n)?Math.max(0,Math.min(5,n)):5,o=this._config.payment_filter??[],r=!0===this._config.payment_highlight_mode,a=r?i:i.filter(e=>ke(e,o));if(0===s)return G;if(!a.length&&o.length&&i.length)return V`
        <div class="empty">
          ${this._t("payment_filter_active")} — ${this._t("no_data")}
        </div>
      `;if(!a.length)return V`<div class="empty">${this._t("no_data")}</div>`;const l=a.slice(0,s);return V`
      <div class="stations">
        ${l.map((e,i)=>this._renderStation(e,i,t,o,r))}
      </div>
    `}_renderStation(e,t,i,n,s){const o=!1!==this._config.show_map_links,r=!1!==this._config.show_opening_hours,a=!1!==this._config.show_payment_methods,l=e.location??{},c=`${i}-${t}`,d=this._expandedStations.has(c),h=!1===e.open,p=!h&&function(e,t=new Date){if(!1===e.open)return!1;const i=e.opening_hours??[];if(!i.length)return!1;const n=t.getDay(),s=0===n?"SO":6===n?"SA":"MO",o=i.find(e=>e.day===s);if(!o||!o.to)return!1;if("00:00"===o.from&&"24:00"===o.to)return!1;const[r,a]=o.to.split(":"),l=parseInt(r,10),c=parseInt(a,10);if(!Number.isFinite(l)||!Number.isFinite(c))return!1;const d=new Date(t);0===l&&0===c?(d.setDate(d.getDate()+1),d.setHours(0,0,0,0)):d.setHours(l,c,0,0);const h=(d.getTime()-t.getTime())/6e4;return h>0&&h<=30}(e),u=s&&n.length>0&&ke(e,n),f=u?function(e,t,i){if(!t||!t.length)return[];const n=e.payment_methods??{},s=[];for(const e of t)if("cash"===e&&n.cash)s.push(i.cash);else if("debit_card"===e&&n.debit_card)s.push(i.debit_card);else if("credit_card"===e&&n.credit_card)s.push(i.credit_card);else{const t=(n.others??[]).find(t=>t.toLowerCase()===e.toLowerCase());t&&s.push(t)}return s}(e,n,{cash:this._t("cash"),debit_card:this._t("debit_card"),credit_card:this._t("credit_card")}):[],_=r&&!!e.opening_hours?.length,m=a&&(!!(g=e.payment_methods)&&Boolean(g.cash||g.debit_card||g.credit_card||g.others&&g.others.length>0));var g;const y=_||m;return V`
      <div class=${ye({station:!0,"pm-highlight":u})}>
        <div
          class="station-main"
          @click=${()=>this._onStationClick(c)}
        >
          <div class="rank">${t+1}</div>
          <div class="info">
            <div class="name">
              ${e.name||"–"}
              ${h?V`<span class="badge closed">${this._t("closed")}</span>`:p?V`<span class="badge closing-soon">${this._t("closing_soon")}</span>`:G}
              ${f.map(e=>V`<span class="pm-match-chip">${e}</span>`)}
            </div>
            <div class="address">
              ${l.postalCode??""} ${l.city??""},
              ${l.address??""}
            </div>
          </div>
          <div class="price">${Ae(e.price)}</div>
          ${o?V`
                <a
                  class="map-link"
                  href=${function(e,t){if(!e)return"#";if(/\d/.test(e.address??"")){const t=`${e.postalCode??""} ${e.city??""} ${e.address??""}`.trim();return`https://maps.google.com/?q=${encodeURIComponent(t)}`}const i=[t,e.address,e.postalCode,e.city].filter(e=>null!=e&&""!==e);return`https://www.google.com/search?q=${encodeURIComponent(i.join(" "))}`}(l,e.name??"")}
                  target="_blank"
                  rel="noopener noreferrer"
                  title=${this._t("map")}
                  @click=${this._onMapLinkClick}
                >
                  <ha-icon
                    icon=${/\d/.test(l.address??"")?"mdi:map-marker":"mdi:magnify"}
                    class="map-icon"
                  ></ha-icon>
                </a>
              `:G}
        </div>
        ${y?V`
              <div class=${ye({"station-detail":!0,expanded:d})}>
                <div class="detail-cols">
                  ${_?V`<div class="detail-col">${this._renderHours(e.opening_hours??[])}</div>`:G}
                  ${m?V`<div class="detail-col">${this._renderPaymentMethods(e.payment_methods)}</div>`:G}
                </div>
              </div>
            `:G}
      </div>
    `}_renderHours(e){const t=e.find(e=>"MO"===e.day)??e[0],i=e.find(e=>"SA"===e.day)??e[5],n=e.find(e=>"SO"===e.day)??e[6],s=e.find(e=>"FE"===e.day);return V`
      <div class="hours-grid">
        ${t?V`<span class="day">${this._t("mon_fri")}</span><span>${t.from} – ${t.to}</span>`:G}
        ${i?V`<span class="day">${this._t("sat")}</span><span>${i.from} – ${i.to}</span>`:G}
        ${n?V`<span class="day">${this._t("sun")}</span><span>${n.from} – ${n.to}</span>`:G}
        ${s?V`<span class="day">${this._t("holiday")}</span><span>${s.from} – ${s.to}</span>`:G}
      </div>
    `}_renderPaymentMethods(e){if(!e)return G;const t=[];e.cash&&t.push(V`
        <span class="pm-badge">
          <ha-icon icon="mdi:cash" class="pm-icon"></ha-icon>
          ${this._t("cash")}
        </span>
      `),e.debit_card&&t.push(V`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon"></ha-icon>
          ${this._t("debit_card")}
        </span>
      `),e.credit_card&&t.push(V`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon"></ha-icon>
          ${this._t("credit_card")}
        </span>
      `);for(const i of e.others??[])t.push(V`<span class="pm-badge pm-other">${i}</span>`);return t.length?V`
      <div class="pm-section">
        <div class="pm-label">${this._t("payment")}</div>
        <div class="pm-badges">${t}</div>
      </div>
    `:G}_onTabClick(e){this._activeTab!==e&&(this._activeTab=e,this._expandedStations=new Set)}_onStationClick(e){const t=new Set(this._expandedStations);t.has(e)?t.delete(e):t.add(e),this._expandedStations=t}_onMapLinkClick(e){e.stopPropagation()}_onSparklineClick(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_onRefresh(){if(!this.hass)return;const e=Date.now();if(e-this._lastManualRefresh<$e)return;this._lastManualRefresh=e,this._noNewData=!1;const t=this._resolveEntities(),i=t[this._activeTab]??t[0],n=i?.last_updated;for(const e of t){const t=this.hass.callService("homeassistant","update_entity",{entity_id:e.entity_id});t&&"function"==typeof t.catch&&t.catch(t=>{console.warn("[Tankstellen Austria] update_entity failed for",e.entity_id,t)})}window.setTimeout(()=>{try{const e=this._resolveEntities(),t=e[this._activeTab]??e[0];t?.last_updated===n&&(this._noNewData=!0)}catch(e){console.warn("[Tankstellen Austria] post-refresh check failed",e)}},3e3),void 0!==this._cooldownInterval&&clearInterval(this._cooldownInterval),this._cooldownInterval=window.setInterval(()=>{Date.now()-this._lastManualRefresh>=$e&&void 0!==this._cooldownInterval&&(clearInterval(this._cooldownInterval),this._cooldownInterval=void 0),this._cooldownTick=(this._cooldownTick+1)%1e6},1e3)}async _onVersionReload(){try{if("undefined"!=typeof window&&"caches"in window){const e=await caches.keys();await Promise.all(e.map(e=>caches.delete(e)))}}catch{}location.reload()}static{this.styles=ht}};e([fe({attribute:!1})],mt.prototype,"hass",void 0),e([_e()],mt.prototype,"_config",void 0),e([_e()],mt.prototype,"_activeTab",void 0),e([_e()],mt.prototype,"_expandedStations",void 0),e([_e()],mt.prototype,"_history",void 0),e([_e()],mt.prototype,"_versionMismatch",void 0),e([_e()],mt.prototype,"_lastManualRefresh",void 0),e([_e()],mt.prototype,"_noNewData",void 0),e([_e()],mt.prototype,"_cooldownTick",void 0),mt=e([he("tankstellen-austria-card")],mt);export{mt as TankstellenAustriaCard};
