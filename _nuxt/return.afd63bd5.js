import{a as f,p,s as m,r as c,w as v,z as k,o as s,f as n,u as a,t as y,h as u,j as t}from"./entry.9a7c6b95.js";import{u as S}from"./fetch.10681172.js";import{u as g}from"./book-store-api.1e3b3f6b.js";import{L as A}from"./index.4e4f5e4e.js";import"./index.bce8604d.js";import"./wallet.6d0f4bb9.js";const w=t("h1",null,"Stripe connect status",-1),B={key:0,style:{color:"red"}},R={key:1,style:{color:"green"}},E=t("hr",null,null,-1),L={key:2},b=t("h2",null,"Refreshing Stripe connect Account status",-1),C=t("div",null,[t("p",null,"Refreshing...")],-1),I=[b,C],T=f({__name:"return",setup(P){const h=p(),l=g(),{token:_}=m(l),o=c(""),r=c(!1),d=c(!1);return v(r,e=>{e&&(o.value="")}),k(async()=>{try{r.value=!0;const{data:e,error:i}=await S(`${A}/likernft/book/user/connect/refresh`,{method:"POST",headers:{authorization:`Bearer ${_.value}`}},"$Agv8npqPIr");if(i.value)throw new Error(i.value.toString());d.value=e.isReady,h.push({name:"nft-book-store-user"})}catch(e){console.error(e),o.value=e.toString()}finally{r.value=!1}}),(e,i)=>(s(),n("div",null,[w,a(o)?(s(),n("div",B,y(a(o)),1)):u("",!0),a(r)?(s(),n("div",R," Loading... ")):u("",!0),E,a(l).isAuthenticated?(s(),n("section",L,I)):u("",!0)]))}});export{T as default};