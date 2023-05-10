import{_ as D}from"./nuxt-link.c89651b7.js";import{a as T,s as F,b as B,r as u,e as b,w as E,q as O,o as s,f as r,j as t,t as l,u as n,h as f,F as g,x as C,i as R,v as U,k as A,c as P,z as V,p as M}from"./entry.712e2c55.js";import{u as w}from"./fetch.50084ecf.js";import{L,C as q}from"./index.4e4f5e4e.js";import{u as z}from"./book-store-api.a1910588.js";import"./wallet.47d7c9b9.js";const j={key:0,style:{color:"red"}},H={key:1,style:{color:"green"}},X=t("hr",null,null,-1),K={key:2},W=t("h3",null,"Status",-1),Y=t("tr",null,[t("td",null,"Price in USD"),t("td",null,"Pending action"),t("td",null,"Sold"),t("td",null,"Remaining Stock")],-1),G=t("h3",null,"Orders",-1),J=t("tr",null,[t("td",null,"email"),t("td",null,"status"),t("td",null,"wallet"),t("td",null,"buyer message"),t("td",null,"sales channel"),t("td",null,"Action")],-1),Q=["href"],Z={key:2},tt=t("h3",null,"Sales Channel Summary",-1),et=t("tr",null,[t("td",null,"Channel ID"),t("td",null,"Count"),t("td",null,"USD")],-1),lt=t("hr",null,null,-1),nt=t("h3",null,"Copy Purchase Link",-1),ot=t("label",null,"Sales channel for this link (Optional)",-1),st=t("br",null,null,-1),at=["href"],rt=t("br",null,null,-1),ut=t("hr",null,null,-1),ft=T({__name:"[classId]",setup(it){const k=z(),{token:v}=F(k),I=B(),h=u(""),S=u(!1),_=u(I.params.classId),c=u(void 0),d=u({}),m=u([]),$=u(q),p=b(()=>{const a=c.value?`?from=${c.value}`:"";return`https://api.like.co/likernft/book/purchase/${_.value}/new${a}`}),N=b(()=>m.value.length?m.value.reduce((o,i)=>{const e=i.from||"(empty)";return o[e]||(o[e]={count:0,totalUSD:0}),o[e].count+=1,o[e].totalUSD+=i.price,o},{}):{});E(S,a=>{a&&(h.value="")}),O(async()=>{try{const{data:a,error:o}=await w(`${L}/likernft/book/store/${_.value}`,{headers:{authorization:`Bearer ${v.value}`}},"$80pyXr6MSB");if(o.value)throw o.value;d.value=a.value;const{data:i,error:e}=await w(`${L}/likernft/book/purchase/${_.value}/orders`,{headers:{authorization:`Bearer ${v.value}`}},"$pYc8wb7Ii0");if(e.value)throw e.value.statusCode===403?new Error("NOT_OWNER_OF_NFT_CLASS"):e.value;m.value=i.value.orders}catch(a){console.error(a),h.value=a.toString()}});async function x(){await navigator.clipboard.writeText(p.value)}return(a,o)=>{const i=D;return s(),r("div",null,[t("h1",null,"NFT Book Status "+l(n(_)),1),n(h)?(s(),r("div",j,l(n(h)),1)):f("",!0),n(S)?(s(),r("div",H," Loading... ")):f("",!0),X,n(k).isAuthenticated?(s(),r("section",K,[W,t("table",null,[Y,t("tr",null,[t("td",null,l(n(d).price),1),t("td",null,l(n(d).pendingNFTCount),1),t("td",null,l(n(d).sold),1),t("td",null,l(n(d).stock),1)])]),G,t("table",null,[J,(s(!0),r(g,null,C(n(m),e=>(s(),r("tr",{key:e.classId},[t("td",null,l(e.email),1),t("td",null,l(e.status),1),t("td",null,l(e.wallet),1),t("td",null,l(e.message),1),t("td",null,l(e.from),1),t("td",null,[e.status==="pendingNFT"?(s(),P(i,{key:0,to:{name:"nft-book-store-send-classId",params:{classId:e.classId},query:{payment_id:e.id}}},{default:V(()=>[M(" Send NFT ")]),_:2},1032,["to"])):e.status==="completed"?(s(),r("a",{key:1,href:`${n($)}/${e.txHash}`,target:"_blank"}," View Transaction ",8,Q)):(s(),r("span",Z," - "))])]))),128))]),tt,t("table",null,[et,(s(!0),r(g,null,C(Object.entries(n(N)),([e,y])=>(s(),r("tr",{key:e},[t("td",null,l(e),1),t("td",null,l(y.count),1),t("td",null,l(y.totalUSD),1)]))),128))]),lt,nt,t("p",null,[ot,R(t("input",{"onUpdate:modelValue":o[0]||(o[0]=e=>A(c)?c.value=e:null),placeholder:"Channel ID"},null,512),[[U,n(c)]])]),st,t("a",{href:n(p),target:"_blank"},l(n(p)),9,at),rt,t("button",{onClick:x},"Copy Purchase Link"),ut])):f("",!0)])}}});export{ft as default};
