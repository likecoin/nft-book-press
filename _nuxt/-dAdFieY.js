import{ds as d,$ as l,v as b,s as p,r as S,C as v,Y as y}from"./D-vwML4j.js";(function(){try{var t=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},o=new Error().stack;o&&(t._sentryDebugIds=t._sentryDebugIds||{},t._sentryDebugIds[o]="e5ccaa7c-bb47-410b-a9b5-8f57026879cc",t._sentryDebugIdIdentifier="sentry-dbid-e5ccaa7c-bb47-410b-a9b5-8f57026879cc")}catch{}})();function c(){return{isReady:!1,hasAccount:!1,email:"",stripeConnectAccountId:""}}const C=d("stripe-connect",()=>{const{LIKE_CO_API:t}=l().public,o=b(),{token:a}=p(o),n=S({}),i=v(()=>e=>n.value[e]||c());async function f(e){var u;n.value[e]||(n.value[e]=c());const{data:r,error:s}=await y(`${t}/likernft/book/user/connect/status`,{headers:{authorization:`Bearer ${a.value}`},query:{wallet:e}},"$nBk2xf0dpF");if(s.value&&s.value.statusCode!==404)throw new Error((u=s.value)==null?void 0:u.data.toString());return r.value?(n.value[e]=r==null?void 0:r.value,r.value):n.value[e]}return{stripeConnectStatusWalletMap:n,getStripeConnectStatusByWallet:i,fetchStripeConnectStatusByWallet:f}});export{C as u};
//# sourceMappingURL=-dAdFieY.js.map