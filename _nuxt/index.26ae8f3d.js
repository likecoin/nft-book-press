import{u as d}from"./fetch.138d305b.js";import{f as C,s as w,r as h,h as T,y as N,o as l,c as i,i as a,t as _,j as f,a as o}from"./entry.423ecaa0.js";import{u as O}from"./book-store-api.489942a1.js";import{u as P}from"./wallet.f6c50ac5.js";import{L as v}from"./index.4e4f5e4e.js";import"./index.2809cd66.js";const $=o("h1",null,"Stripe Connect status",-1),B={key:0,style:{color:"red"}},b={key:1,style:{color:"green"}},A=o("hr",null,null,-1),L={key:2},R=o("h2",null,"Current status",-1),x={style:{"margin-bottom":"24px"}},I=o("tr",null,[o("td",null,"Setup initiated"),o("td",null,"Setup completed")],-1),j={key:0},z={key:1},J=C({__name:"index",setup(D){const y=P(),S=O(),{wallet:k}=w(y),{token:c}=w(S),s=h(""),n=h(!1),u=h({});T(n,e=>{e&&(s.value="")}),N(async()=>{var e;try{n.value=!0;const{data:r,error:t}=await d(`${v}/likernft/book/user/connect/status?wallet=${k.value}`,{headers:{authorization:`Bearer ${c.value}`}},"$BjOmqjOMO1");if(t.value&&((e=t.value)==null?void 0:e.statusCode)!==404)throw new Error(t.value.toString());u.value=r.value||{}}catch(r){console.error(r),s.value=r.toString()}finally{n.value=!1}});async function E(){try{n.value=!0;const{data:e,error:r}=await d(`${v}/likernft/book/user/connect/login`,{method:"POST",headers:{authorization:`Bearer ${c.value}`}},"$eJkPPZssP7");if(r.value)throw new Error(r.value.toString());const t=e.value.url;if(t)window.location.href=t;else throw new Error("CANNOT_GET_STRIPE_CONNECT_RUL")}catch(e){console.error(e),s.value=e.toString()}finally{n.value=!1}}async function g(){try{n.value=!0;const{data:e,error:r}=await d(`${v}/likernft/book/user/connect/new`,{method:"POST",headers:{authorization:`Bearer ${c.value}`}},"$72P1SB2Div");if(r.value)throw new Error(r.value.toString());const t=e.value.url;if(t)window.location.href=t;else throw new Error("CANNOT_GET_STRIPE_CONNECT_RUL")}catch(e){console.error(e),s.value=e.toString()}finally{n.value=!1}}return(e,r)=>{var t,p,m;return l(),i("div",null,[$,a(s)?(l(),i("div",B,_(a(s)),1)):f("",!0),a(n)?(l(),i("div",b," Loading... ")):f("",!0),A,a(S).isAuthenticated?(l(),i("section",L,[R,o("table",x,[I,o("tr",null,[o("td",null,_(((t=a(u))==null?void 0:t.hasAccount)||!1),1),o("td",null,_(((p=a(u))==null?void 0:p.isReady)||!1),1)])]),(m=a(u))!=null&&m.isReady?(l(),i("div",j,[o("button",{onClick:E}," Login to Stripe account ")])):(l(),i("div",z,[o("button",{onClick:g}," Setup Stripe Payment Recipient Account ")]))])):f("",!0)])}}});export{J as default};