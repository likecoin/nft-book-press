import{_ as W}from"./PageHeader.vue.a441cd52.js";import{_ as $}from"./Alert.9ed33f40.js";import{g as V,i as B,s as D,h as M,v,x as O,y as Y,l as q,o as y,r as k,w as o,b as n,z as a,A as T,d as _,B as H,a as c,C as J,D as K,E as j,F as Q,G as X,H as Z,I as ee,J as te,K as oe}from"./entry.c6854afe.js";import{_ as ne}from"./Table.24e3600d.js";import{_ as ae}from"./Input.3ae04d0e.js";import{_ as le}from"./PageBody.vue.ec8e43c6.js";import{_ as se}from"./AuthRequiredView.vue.ae6eb7da.js";import{_ as re}from"./PageContainer.c1e4f271.js";import"./app.2745523d.js";import"./useFormGroup.8531c5da.js";(function(){try{var d=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},m=new Error().stack;m&&(d._sentryDebugIds=d._sentryDebugIds||{},d._sentryDebugIds[m]="8bafb633-b213-42a2-bd33-b97aa6184431",d._sentryDebugIdIdentifier="sentry-dbid-8bafb633-b213-42a2-bd33-b97aa6184431")}catch{}})();const ie=c("b",null,"ANY",-1),ue=c("b",null,"CAUTION",-1),ce=c("b",null,"ONLY",-1),de=c("h2",{class:"font-bold font-mono"}," Current Grants ",-1),_e={class:"flex items-center gap-2"},me=c("h2",{class:"font-bold font-mono"}," Grant new send NFT Authz ",-1),Te=V({__name:"index",setup(d){const m=B(),{wallet:u,signer:f}=D(m),N=M(),r=v(""),i=v(N.query.grantee||""),p=v([]),s=v(!1),A=O(()=>p.value.map(t=>({wallet:t.grantee,shortenWallet:K(t.grantee),expiration:new Date(t.expiration.seconds.toNumber()*1e3)})));Y(u,async t=>{if(t){r.value="";try{await w()}catch{}i.value&&!p.value.find(e=>e.grantee===i.value)&&g(i.value)}else p.value=[]},{immediate:!0}),q({title:"Send LikeCoin NFT Authz Grants Management",ogTitle:"Send LikeCoin NFT Authz Grants Management"});async function w(){const t=await j(u.value);p.value=t}async function g(t=i.value){try{if(r.value="",s.value=!0,!u.value||!f.value)throw new Error("NO_WALLET");if(!t)throw new Error("WALLET_INPUT_EMPTY");const e=await Q(t,f.value,u.value);console.log(e),await w()}catch(e){console.error(e),r.value=e.toString()}finally{s.value=!1}}function C(t){g(t)}async function G(t){try{if(r.value="",s.value=!0,!u.value||!f.value)throw new Error("NO_WALLET");if(!t)throw new Error("WALLET_INPUT_EMPTY");const e=await X(t,f.value,u.value);console.log(e),await w()}catch(e){console.error(e),r.value=e.toString()}finally{s.value=!1}}return(t,e)=>{const L=W,x=$,E=Z,b=ee,U=te,F=ne,h=oe,z=ae,R=le,S=se,I=re;return y(),k(I,null,{default:o(()=>[n(L,{title:" Send NFT Authz Grants Management Page"}),n(S,null,{default:o(()=>[n(R,{class:"grow space-y-4"},{default:o(()=>[a(r)?(y(),k(x,{key:0,icon:"i-heroicons-exclamation-triangle",color:"red",variant:"soft",title:`${a(r)}`,"close-button":{icon:"i-heroicons-x-mark-20-solid",color:"red",variant:"link",padded:!1},onClose:e[0]||(e[0]=l=>r.value="")},null,8,["title"])):T("",!0),a(s)?(y(),k(E,{key:1,animation:"carousel"},{indicator:o(()=>[_(" Loading... ")]),_:1})):T("",!0),n(x,{icon:"i-heroicons-exclamation-triangle",color:"amber",variant:"soft",title:"Warning",ui:{title:"font-bold font-mono",description:"leading-5"}},{description:o(()=>[_(" Granting other wallet send NFT Authz permission allows them to send away "),ie,_(" NFT you own, not limited to NFT books or NFT you created. Use with "),ue,_(" and "),ce,_(" grant to those you absolutely trust! ")]),_:1}),n(h,null,{header:o(()=>[de]),default:o(()=>[n(h,{ui:{body:{padding:""}}},{default:o(()=>[n(F,{columns:[{key:"wallet",label:"Wallet",sortable:!0},{key:"expiration",label:"Expiration",sortable:!0},{key:"actions"}],rows:a(A),sort:{column:"expiration",direction:"desc"}},{"wallet-data":o(({row:l})=>[n(U,{text:l.wallet},{default:o(()=>[n(b,{class:"font-mono",label:l.shortenWallet,to:a(H)(l.wallet),variant:"link",padded:!1,size:"xs",target:"_blank"},null,8,["label","to"])]),_:2},1032,["text"])]),"actions-data":o(({row:l})=>[c("div",_e,[n(b,{label:"Renew",variant:"outline",disabled:a(s),onClick:P=>C(l.wallet)},null,8,["disabled","onClick"]),n(b,{label:"Revoke",variant:"outline",disabled:a(s),onClick:P=>G(l.wallet)},null,8,["disabled","onClick"])])]),_:1},8,["rows"])]),_:1})]),_:1}),n(h,null,{header:o(()=>[me]),footer:o(()=>[n(b,{label:"Submit",loading:a(s),disabled:!a(i)||a(s),onClick:e[2]||(e[2]=l=>g())},null,8,["loading","disabled"])]),default:o(()=>[n(z,{modelValue:a(i),"onUpdate:modelValue":e[1]||(e[1]=l=>J(i)?i.value=l:null),class:"font-mono",placeholder:"like1..."},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1})}}});export{Te as default};
//# sourceMappingURL=index.3ee98ada.js.map