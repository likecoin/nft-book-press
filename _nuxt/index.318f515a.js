import{f as E,s as L,g as A,r as h,h as F,o as i,c,i as r,t as w,j as m,a as e,F as g,k as G,l as R,v as S,m as x}from"./entry.423ecaa0.js";import{u as z}from"./wallet.f6c50ac5.js";import{g as W,s as U,a as O}from"./cosmos.d761c510.js";import"./index.2809cd66.js";import"./index.4e4f5e4e.js";const P=e("h1",null,"Send NFT Authz Grants management page",-1),Y={key:0,style:{color:"red"}},B={key:1,style:{color:"green"}},D=e("hr",null,null,-1),I={key:2},M=e("h2",null,"Connect your wallet",-1),V=["disabled"],$=e("h2",null,"*Warning*",-1),j=e("p",{style:{color:"red"}}," Granting other wallet send NFT authz permission allows them to send away *ANY* NFT you own, not limited to NFT books or NFT you created. ",-1),q=e("p",{style:{color:"red"}}," Use with CAUTION and ONLY grant to those you absolutely trust! ",-1),H=e("hr",null,null,-1),J=e("h2",null,"Current grants",-1),K=e("thead",null,[e("tr",null,[e("th",null,"Wallet"),e("th",null,"Expiration"),e("th",null,"Renew"),e("th",null,"Revoke")])],-1),Q=["onClick"],X=["onClick"],Z=e("hr",null,null,-1),ee=e("h2",null,"Grant new send NFT authz",-1),te=["disabled"],ue=E({__name:"index",setup(ne){const y=z(),{wallet:o,signer:d}=L(y),{connect:k}=y,p=A(),l=h(""),u=h(p.query.grantee||""),_=h([]),a=h(!1);F(o,async n=>{if(n){l.value="";try{await v()}catch{}u.value&&!_.value.find(t=>t.grantee===u.value)&&f(u.value)}else _.value=[]},{immediate:!0});async function v(){const n=await W(o.value);_.value=n}async function f(n=u.value){try{if(l.value="",a.value=!0,!o.value||!d.value)throw new Error("NO_WALLET");if(!n)throw new Error("WALLET_INPUT_EMPTY");const t=await U(n,d.value,o.value);console.log(t),await v()}catch(t){console.error(t),l.value=t.toString()}finally{a.value=!1}}function N(n){f(n)}async function T(n){try{if(l.value="",a.value=!0,!o.value||!d.value)throw new Error("NO_WALLET");if(!n)throw new Error("WALLET_INPUT_EMPTY");const t=await O(n,d.value,o.value);console.log(t),await v()}catch(t){console.error(t),l.value=t.toString()}finally{a.value=!1}}async function C(){try{if(l.value="",a.value=!0,o.value||await k(),!o.value)return}catch(n){console.error(n),l.value=n.toString()}finally{a.value=!1}}return(n,t)=>(i(),c("div",null,[P,r(l)?(i(),c("div",Y,w(r(l)),1)):m("",!0),r(a)?(i(),c("div",B," Loading... ")):m("",!0),D,r(o)?(i(),c(g,{key:3},[$,j,q,H,J,e("table",null,[K,e("tbody",null,[(i(!0),c(g,null,G(r(_),s=>(i(),c("tr",{key:s.grantee},[e("td",null,w(s.grantee),1),e("td",null,w(new Date(s.expiration.seconds.toNumber()*1e3)),1),e("td",null,[e("button",{onClick:b=>N(s.grantee)}," Renew ",8,Q)]),e("td",null,[e("button",{onClick:b=>T(s.grantee)}," Revoke ",8,X)])]))),128))])]),Z,ee,R(e("input",{"onUpdate:modelValue":t[0]||(t[0]=s=>x(u)?u.value=s:null),placeholder:"like1..."},null,512),[[S,r(u)]]),e("button",{disabled:r(a),onClick:t[1]||(t[1]=s=>f())}," Submit ",8,te)],64)):(i(),c("section",I,[M,e("div",null,[e("button",{disabled:r(a),onClick:C}," Connect ",8,V)])]))]))}});export{ue as default};