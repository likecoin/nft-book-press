import{_ as $}from"./Alert.6416b35b.js";import{_ as P}from"./Progress.8d54b100.js";import{g as V,h as B,s as I,i as O,r as h,j as Y,k as j,o as _,c as k,l as o,m as y,n as N,w as n,d as m,b as l,F as M,a as u,q,v as D,x as H,y as J,z as K,A as Q,B as X,C as Z,D as ee,E as te}from"./entry.14901e5c.js";import{_ as oe}from"./Table.fac10249.js";import{_ as ne}from"./Input.61292172.js";import"./uid.75d69dea.js";const ae={class:"space-y-4"},le=u("h1",{class:"text-xl font-bold font-mono"}," Send NFT Authz Grants Management Page ",-1),se=u("h2",{class:"font-bold font-mono"}," Connect your wallet ",-1),re=u("b",null,"ANY",-1),ie=u("b",null,"CAUTION",-1),ce=u("b",null,"ONLY",-1),ue=u("h2",{class:"font-bold font-mono"}," Current Grants ",-1),de={class:"flex items-center gap-2"},_e=u("h2",{class:"font-bold font-mono"}," Grant new send NFT Authz ",-1),ye=V({__name:"index",setup(me){const g=B(),{wallet:i,signer:f}=I(g),{connect:T}=g,C=O(),s=h(""),c=h(C.query.grantee||""),v=h([]),a=h(!1),A=Y(()=>v.value.map(e=>({wallet:e.grantee,shortenWallet:D(e.grantee),expiration:new Date(e.expiration.seconds.toNumber()*1e3)})));j(i,async e=>{if(e){s.value="";try{await b()}catch{}c.value&&!v.value.find(t=>t.grantee===c.value)&&w(c.value)}else v.value=[]},{immediate:!0});async function b(){const e=await H(i.value);v.value=e}async function w(e=c.value){try{if(s.value="",a.value=!0,!i.value||!f.value)throw new Error("NO_WALLET");if(!e)throw new Error("WALLET_INPUT_EMPTY");const t=await J(e,f.value,i.value);console.log(t),await b()}catch(t){console.error(t),s.value=t.toString()}finally{a.value=!1}}function U(e){w(e)}async function E(e){try{if(s.value="",a.value=!0,!i.value||!f.value)throw new Error("NO_WALLET");if(!e)throw new Error("WALLET_INPUT_EMPTY");const t=await K(e,f.value,i.value);console.log(t),await b()}catch(t){console.error(t),s.value=t.toString()}finally{a.value=!1}}async function G(){try{if(s.value="",a.value=!0,i.value||await T(),!i.value)return}catch(e){console.error(e),s.value=e.toString()}finally{a.value=!1}}return(e,t)=>{const x=$,L=P,d=Q,p=X,F=Z,R=ee,W=oe,z=ne;return _(),k("div",ae,[le,o(s)?(_(),y(x,{key:0,icon:"i-heroicons-exclamation-triangle",color:"red",variant:"soft",title:`${o(s)}`,"close-button":{icon:"i-heroicons-x-mark-20-solid",color:"red",variant:"link",padded:!1},onClose:t[0]||(t[0]=r=>s.value="")},null,8,["title"])):N("",!0),o(a)?(_(),y(L,{key:1,animation:"carousel"},{indicator:n(()=>[m(" Loading... ")]),_:1})):N("",!0),o(i)?(_(),k(M,{key:3},[l(x,{icon:"i-heroicons-exclamation-triangle",color:"amber",variant:"soft",title:"Warning",ui:{title:"font-bold font-mono",description:"leading-5"}},{description:n(()=>[m(" Granting other wallet send NFT Authz permission allows them to send away "),re,m(" NFT you own, not limited to NFT books or NFT you created. Use with "),ie,m(" and "),ce,m(" grant to those you absolutely trust! ")]),_:1}),l(p,null,{header:n(()=>[ue]),default:n(()=>[l(p,{ui:{body:{padding:""}}},{default:n(()=>[l(W,{columns:[{key:"wallet",label:"Wallet",sortable:!0},{key:"expiration",label:"Expiration",sortable:!0},{key:"actions"}],rows:o(A),sort:{column:"expiration",direction:"desc"}},{"wallet-data":n(({row:r})=>[l(R,{text:r.wallet},{default:n(()=>[l(d,{class:"font-mono",label:r.shortenWallet,to:o(te)(r.wallet),variant:"link",padded:!1,size:"xs",target:"_blank"},null,8,["label","to"])]),_:2},1032,["text"])]),"actions-data":n(({row:r})=>[u("div",de,[l(d,{label:"Renew",variant:"outline",disabled:o(a),onClick:S=>U(r.wallet)},null,8,["disabled","onClick"]),l(d,{label:"Revoke",variant:"outline",disabled:o(a),onClick:S=>E(r.wallet)},null,8,["disabled","onClick"])])]),_:1},8,["rows"])]),_:1})]),_:1}),l(p,null,{header:n(()=>[_e]),footer:n(()=>[l(d,{label:"Submit",loading:o(a),disabled:!o(c)||o(a),onClick:t[2]||(t[2]=r=>w())},null,8,["loading","disabled"])]),default:n(()=>[l(z,{modelValue:o(c),"onUpdate:modelValue":t[1]||(t[1]=r=>q(c)?c.value=r:null),class:"font-mono",placeholder:"like1..."},null,8,["modelValue"])]),_:1})],64)):(_(),y(F,{key:2,class:"flex justify-center items-center py-8"},{default:n(()=>[l(p,{ui:{body:{base:"flex justify-center items-center"}}},{header:n(()=>[se]),default:n(()=>[l(d,{label:"Connect",loading:o(a),disabled:o(a),onClick:G},null,8,["loading","disabled"])]),_:1})]),_:1}))])}}});export{ye as default};