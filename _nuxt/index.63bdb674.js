import{_ as z}from"./PageHeader.vue.392c3f0c.js";import{_ as S}from"./Alert.94c17f65.js";import{g as V,G as D,H as B,i as O,r as w,l as M,K as Y,o as y,q as x,w as o,b as n,s as a,x as N,d as _,a as u,v as q,L as H,M as K,N as Q,O as j,P as J,C as X,Q as Z,D as ee,R as te}from"./entry.6d4ed70f.js";import{_ as oe}from"./Table.82ac636b.js";import{_ as ne}from"./Input.f7c22f04.js";import{_ as ae}from"./PageBody.vue.5f2b9d53.js";import{_ as le}from"./AuthRequiredView.vue.9b6ad360.js";import{_ as se}from"./PageContainer.b2cc4d72.js";import"./useFormGroup.08dac1ae.js";(function(){try{var d=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},f=new Error().stack;f&&(d._sentryDebugIds=d._sentryDebugIds||{},d._sentryDebugIds[f]="17ae7529-f98d-4edb-b6fc-1832089cf169",d._sentryDebugIdIdentifier="sentry-dbid-17ae7529-f98d-4edb-b6fc-1832089cf169")}catch{}})();const re=u("b",null,"ANY",-1),ie=u("b",null,"CAUTION",-1),ce=u("b",null,"ONLY",-1),ue=u("h2",{class:"font-bold font-mono"}," Current Grants ",-1),de={class:"flex items-center gap-2"},_e=u("h2",{class:"font-bold font-mono"}," Grant new send NFT Authz ",-1),xe=V({__name:"index",setup(d){const f=D(),{wallet:c,signer:m}=B(f),T=O(),r=w(""),i=w(T.query.grantee||""),p=w([]),s=w(!1),A=M(()=>p.value.map(t=>({wallet:t.grantee,shortenWallet:H(t.grantee),expiration:new Date(t.expiration.seconds.toNumber()*1e3)})));Y(c,async t=>{if(t){r.value="";try{await b()}catch{}i.value&&!p.value.find(e=>e.grantee===i.value)&&g(i.value)}else p.value=[]},{immediate:!0});async function b(){const t=await K(c.value);p.value=t}async function g(t=i.value){try{if(r.value="",s.value=!0,!c.value||!m.value)throw new Error("NO_WALLET");if(!t)throw new Error("WALLET_INPUT_EMPTY");const e=await Q(t,m.value,c.value);console.log(e),await b()}catch(e){console.error(e),r.value=e.toString()}finally{s.value=!1}}function C(t){g(t)}async function G(t){try{if(r.value="",s.value=!0,!c.value||!m.value)throw new Error("NO_WALLET");if(!t)throw new Error("WALLET_INPUT_EMPTY");const e=await j(t,m.value,c.value);console.log(e),await b()}catch(e){console.error(e),r.value=e.toString()}finally{s.value=!1}}return(t,e)=>{const L=z,k=S,U=J,v=X,E=Z,R=oe,h=ee,P=ne,W=ae,$=le,F=se;return y(),x(F,null,{default:o(()=>[n(L,{title:" Send NFT Authz Grants Management Page"}),n($,null,{default:o(()=>[n(W,{class:"grow space-y-4"},{default:o(()=>[a(r)?(y(),x(k,{key:0,icon:"i-heroicons-exclamation-triangle",color:"red",variant:"soft",title:`${a(r)}`,"close-button":{icon:"i-heroicons-x-mark-20-solid",color:"red",variant:"link",padded:!1},onClose:e[0]||(e[0]=l=>r.value="")},null,8,["title"])):N("",!0),a(s)?(y(),x(U,{key:1,animation:"carousel"},{indicator:o(()=>[_(" Loading... ")]),_:1})):N("",!0),n(k,{icon:"i-heroicons-exclamation-triangle",color:"amber",variant:"soft",title:"Warning",ui:{title:"font-bold font-mono",description:"leading-5"}},{description:o(()=>[_(" Granting other wallet send NFT Authz permission allows them to send away "),re,_(" NFT you own, not limited to NFT books or NFT you created. Use with "),ie,_(" and "),ce,_(" grant to those you absolutely trust! ")]),_:1}),n(h,null,{header:o(()=>[ue]),default:o(()=>[n(h,{ui:{body:{padding:""}}},{default:o(()=>[n(R,{columns:[{key:"wallet",label:"Wallet",sortable:!0},{key:"expiration",label:"Expiration",sortable:!0},{key:"actions"}],rows:a(A),sort:{column:"expiration",direction:"desc"}},{"wallet-data":o(({row:l})=>[n(E,{text:l.wallet},{default:o(()=>[n(v,{class:"font-mono",label:l.shortenWallet,to:a(te)(l.wallet),variant:"link",padded:!1,size:"xs",target:"_blank"},null,8,["label","to"])]),_:2},1032,["text"])]),"actions-data":o(({row:l})=>[u("div",de,[n(v,{label:"Renew",variant:"outline",disabled:a(s),onClick:I=>C(l.wallet)},null,8,["disabled","onClick"]),n(v,{label:"Revoke",variant:"outline",disabled:a(s),onClick:I=>G(l.wallet)},null,8,["disabled","onClick"])])]),_:1},8,["rows"])]),_:1})]),_:1}),n(h,null,{header:o(()=>[_e]),footer:o(()=>[n(v,{label:"Submit",loading:a(s),disabled:!a(i)||a(s),onClick:e[2]||(e[2]=l=>g())},null,8,["loading","disabled"])]),default:o(()=>[n(P,{modelValue:a(i),"onUpdate:modelValue":e[1]||(e[1]=l=>q(i)?i.value=l:null),class:"font-mono",placeholder:"like1..."},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1})}}});export{xe as default};
//# sourceMappingURL=index.63bdb674.js.map