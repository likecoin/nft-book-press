import{_}from"./BsCyrypI.js";import{n as m,q as p,s as y,v as b,u as h,x,y as k,z as S,A as B,o as R,B as I,w as v,a as A}from"./D-vwML4j.js";(function(){try{var o=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},e=new Error().stack;e&&(o._sentryDebugIds=o._sentryDebugIds||{},o._sentryDebugIds[e]="2fdade3e-bb03-4198-9e5e-8749e3e9adfd",o._sentryDebugIdIdentifier="sentry-dbid-2fdade3e-bb03-4198-9e5e-8749e3e9adfd")}catch{}})();const C=m({__name:"redirect",setup(o){const e=p(),{handleConnectorRedirect:a}=e,{wallet:r,signer:i}=y(e),{signMessageMemo:c,disconnect:d}=e,u=b(),{authenticate:l,clearSession:f}=u,w=h(),g=x();return k({title:"Redirecting ..."}),S(async()=>{const{method:s,code:n}=w.query;if(s&&n)try{if(await a({method:s,params:{code:n}}),!i.value)throw new Error("Failed to authenticate: no signer");const t=await c("authorize",["read:nftbook","write:nftbook","read:nftcollection","write:nftcollection"]);if(!t)throw new Error("Failed to authenticate: no signature");await l(r.value,t)}catch(t){d(),f(),g.add({icon:"i-heroicons-exclamation-circle",title:t.toString(),timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}B()}),(s,n)=>{const t=_;return R(),I(t,{class:"flex flex-col items-center justify-center"},{default:v(()=>n[0]||(n[0]=[A("h1",{class:"text-24"}," Redirecting ",-1)])),_:1})}}});export{C as default};
//# sourceMappingURL=BWuvDZqC.js.map