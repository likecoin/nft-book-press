import{r as o,f as v,aU as b,aH as g}from"./D-vwML4j.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},n=new Error().stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2ec2a648-4044-43be-96fb-cad081f711e6",e._sentryDebugIdIdentifier="sentry-dbid-2ec2a648-4044-43be-96fb-cad081f711e6")}catch{}})();function f(e){return[e.screenX,e.screenY]}function m(){let e=o([-1,-1]);return{wasMoved(n){let r=f(n);return e.value[0]===r[0]&&e.value[1]===r[1]?!1:(e.value=r,!0)},update(n){e.value=f(n)}}}function y({container:e,accept:n,walk:r,enabled:l}){v(()=>{let u=e.value;if(!u||l!==void 0&&!l.value)return;let t=b(e);if(!t)return;let i=Object.assign(d=>n(d),{acceptNode:n}),a=t.createTreeWalker(u,NodeFilter.SHOW_ELEMENT,i,!1);for(;a.nextNode();)r(a.currentNode)})}function D(e){throw new Error("Unexpected object: "+e)}var p=(e=>(e[e.First=0]="First",e[e.Previous=1]="Previous",e[e.Next=2]="Next",e[e.Last=3]="Last",e[e.Specific=4]="Specific",e[e.Nothing=5]="Nothing",e))(p||{});function w(e,n){let r=n.resolveItems();if(r.length<=0)return null;let l=n.resolveActiveIndex(),u=l??-1;switch(e.focus){case 0:{for(let t=0;t<r.length;++t)if(!n.resolveDisabled(r[t],t,r))return t;return l}case 1:{u===-1&&(u=r.length);for(let t=u-1;t>=0;--t)if(!n.resolveDisabled(r[t],t,r))return t;return l}case 2:{for(let t=u+1;t<r.length;++t)if(!n.resolveDisabled(r[t],t,r))return t;return l}case 3:{for(let t=r.length-1;t>=0;--t)if(!n.resolveDisabled(r[t],t,r))return t;return l}case 4:{for(let t=0;t<r.length;++t)if(n.resolveId(r[t],t,r)===e.id)return t;return l}case 5:return null;default:D(e)}}let s=/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;function c(e){var n,r;let l=(n=e.innerText)!=null?n:"",u=e.cloneNode(!0);if(!(u instanceof HTMLElement))return l;let t=!1;for(let a of u.querySelectorAll('[hidden],[aria-hidden],[role="img"]'))a.remove(),t=!0;let i=t?(r=u.innerText)!=null?r:"":l;return s.test(i)&&(i=i.replace(s,"")),i}function F(e){let n=e.getAttribute("aria-label");if(typeof n=="string")return n.trim();let r=e.getAttribute("aria-labelledby");if(r){let l=r.split(" ").map(u=>{let t=document.getElementById(u);if(t){let i=t.getAttribute("aria-label");return typeof i=="string"?i.trim():c(t).trim()}return null}).filter(Boolean);if(l.length>0)return l.join(", ")}return c(e).trim()}function E(e){let n=o(""),r=o("");return()=>{let l=g(e);if(!l)return"";let u=l.innerText;if(n.value===u)return r.value;let t=F(l).trim().toLowerCase();return n.value=u,r.value=t,t}}export{p as c,w as f,y as i,E as p,m as u};
//# sourceMappingURL=DUClJSIL.js.map