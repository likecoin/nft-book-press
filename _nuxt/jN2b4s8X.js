import{dk as j}from"./D-vwML4j.js";(function(){try{var a=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},f=new Error().stack;f&&(a._sentryDebugIds=a._sentryDebugIds||{},a._sentryDebugIds[f]="1dfd3df9-c034-4f65-9e8c-d93707e353d6",a._sentryDebugIdIdentifier="sentry-dbid-1dfd3df9-c034-4f65-9e8c-d93707e353d6")}catch{}})();function E(a,f){for(var d=0;d<f.length;d++){const r=f[d];if(typeof r!="string"&&!Array.isArray(r)){for(const c in r)if(c!=="default"&&!(c in a)){const l=Object.getOwnPropertyDescriptor(r,c);l&&Object.defineProperty(a,c,l.get?l:{enumerable:!0,get:()=>r[c]})}}}return Object.freeze(Object.defineProperty(a,Symbol.toStringTag,{value:"Module"}))}var g={exports:{}};(function(a,f){(function(d,r){r()})(j,function(){function d(e,t){return typeof t>"u"?t={autoBom:!1}:typeof t!="object"&&(console.warn("Deprecated: Expected third argument to be a object"),t={autoBom:!t}),t.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\uFEFF",e],{type:e.type}):e}function r(e,t,s){var n=new XMLHttpRequest;n.open("GET",e),n.responseType="blob",n.onload=function(){p(n.response,t,s)},n.onerror=function(){console.error("could not download file")},n.send()}function c(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch{}return 200<=t.status&&299>=t.status}function l(e){try{e.dispatchEvent(new MouseEvent("click"))}catch{var t=document.createEvent("MouseEvents");t.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(t)}}var i=typeof window=="object"&&window.window===window?window:typeof self=="object"&&self.self===self?self:typeof globalThis=="object"&&globalThis.global===globalThis?globalThis:void 0,y=i.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),p=i.saveAs||(typeof window!="object"||window!==i?function(){}:"download"in HTMLAnchorElement.prototype&&!y?function(e,t,s){var n=i.URL||i.webkitURL,o=document.createElement("a");t=t||e.name||"download",o.download=t,o.rel="noopener",typeof e=="string"?(o.href=e,o.origin===location.origin?l(o):c(o.href)?r(e,t,s):l(o,o.target="_blank")):(o.href=n.createObjectURL(e),setTimeout(function(){n.revokeObjectURL(o.href)},4e4),setTimeout(function(){l(o)},0))}:"msSaveOrOpenBlob"in navigator?function(e,t,s){if(t=t||e.name||"download",typeof e!="string")navigator.msSaveOrOpenBlob(d(e,s),t);else if(c(e))r(e,t,s);else{var n=document.createElement("a");n.href=e,n.target="_blank",setTimeout(function(){l(n)})}}:function(e,t,s,n){if(n=n||open("","_blank"),n&&(n.document.title=n.document.body.innerText="downloading..."),typeof e=="string")return r(e,t,s);var o=e.type==="application/octet-stream",h=/constructor/i.test(i.HTMLElement)||i.safari,m=/CriOS\/[\d]+/.test(navigator.userAgent);if((m||o&&h||y)&&typeof FileReader<"u"){var v=new FileReader;v.onloadend=function(){var u=v.result;u=m?u:u.replace(/^data:[^;]*;/,"data:attachment/file;"),n?n.location.href=u:location=u,n=null},v.readAsDataURL(e)}else{var b=i.URL||i.webkitURL,w=b.createObjectURL(e);n?n.location=w:location.href=w,n=null,setTimeout(function(){b.revokeObjectURL(w)},4e4)}});i.saveAs=p.saveAs=p,a.exports=p})})(g);var _=g.exports;const T=E({__proto__:null},[_]);export{T as F};
//# sourceMappingURL=jN2b4s8X.js.map