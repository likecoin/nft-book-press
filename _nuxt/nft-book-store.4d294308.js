import{a as b,s as k,r as p,w as B,z as N,o,f as r,u as s,t as x,h as m,j as n,c as A,bA as C}from"./entry.9a7c6b95.js";import{u as M}from"./wallet.6d0f4bb9.js";import{u as V}from"./book-store-api.1e3b3f6b.js";import"./fetch.10681172.js";import"./index.bce8604d.js";import"./index.4e4f5e4e.js";const W=n("h1",null,"NFT Book Store management page",-1),z={key:0,style:{color:"red"}},I={key:1,style:{color:"green"}},J=n("hr",null,null,-1),L={key:2},O=n("h2",null,"Verify your wallet address",-1),T=["disabled"],G=b({__name:"nft-book-store",setup(j){const _=M(),i=V(),{wallet:l,signer:d}=k(_),{connect:f,signMessageMemo:h}=_,{authenticate:y,restoreSession:g}=i,{token:v,wallet:w}=k(i),a=p(""),t=p(!1);B(t,e=>{e&&(a.value="")}),N(async()=>{try{const e=window.sessionStorage.getItem("likecoin_nft_book_press_token");if(e){const{wallet:c,token:u}=JSON.parse(e);g(c,u),await f()}}catch{}});async function S(){try{if(t.value=!0,(!l.value||!d.value)&&await f(),!l.value||!d.value)return;const e=await h("authorize",["read:nftbook","write:nftbook"]);await y(l.value,e);try{window.sessionStorage.setItem("likecoin_nft_book_press_token",JSON.stringify({wallet:w.value,token:v.value}))}catch{}}catch(e){console.error(e),a.value=e.toString()}finally{t.value=!1}}return(e,c)=>{const u=C;return o(),r("div",null,[W,s(a)?(o(),r("div",z,x(s(a)),1)):m("",!0),s(t)?(o(),r("div",I," Loading... ")):m("",!0),J,s(i).isAuthenticated?(o(),A(u,{key:3})):(o(),r("section",L,[O,n("div",null,[n("button",{disabled:s(t),onClick:S}," Sign ",8,T)])]))])}}});export{G as default};