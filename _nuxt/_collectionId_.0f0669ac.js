import{_ as at}from"./Alert.2ddbcf28.js";import{_ as ot}from"./Progress.b8763a00.js";import{g as lt,h as nt,s as pe,i as st,j as it,ae as rt,r,l as b,m as me,k as ut,a7 as fe,o as h,c as T,a as c,t as N,n as o,q as E,v as L,w as n,d as te,F as ae,b as l,x as y,af as ct,a8 as dt,a2 as pt,ag as mt,H as be,y as he,a3 as ft,ah as bt,D as ht,C as _t,G as vt,ai as yt,aj as gt}from"./entry.87a04d2e.js";import{_ as kt}from"./Table.59f0cd3a.js";import{_ as Ct}from"./Input.522a78ce.js";import{_ as St,a as wt,b as xt}from"./QRCode.b6fe92ed.js";import{_ as Dt}from"./FormGroup.4a035116.js";import{u as Ut,_ as Tt,a as Nt}from"./StripeConnectCard.vue.e698a04d.js";import{_ as Et}from"./Radio.02cf86c0.js";import{_ as Lt}from"./RateTable.vue.e5ae86fa.js";import{_ as $t}from"./Select.b395aea3.js";import{u as _e}from"./fetch.807d72f6.js";import{u as Rt}from"./book-store-api.fc7886ee.js";import{u as At}from"./nft.fd8f6d73.js";import{u as Pt}from"./collection.98fb6609.js";import"./uid.4a8cc4bb.js";import"./use-text-value.ae06ec2a.js";import"./Modal.3095628c.js";import"./use-controllable.0e105b12.js";import"./v4.a960c1f4.js";const Vt={class:"space-y-10 pb-10"},Ot={class:"text-lg font-bold font-mono"},Ft=c("h3",{class:"font-bold font-mono"}," Status ",-1),Wt=c("h3",{class:"font-bold font-mono"}," Orders ",-1),It=c("h3",{class:"font-bold font-mono"}," Books in Collection ",-1),Bt={class:"flex flex-col gap-[8px] items-start"},jt={class:"text-center"},zt=c("h4",{class:"text-sm font-bold font-mono"}," Email to receive sales notifications ",-1),Mt={class:"flex gap-2"},Gt={class:"flex justify-end items-center"},Ht=c("h3",{class:"font-bold font-mono"}," Sales Channel Summary ",-1),qt={key:0,class:"font-bold font-mono"},Kt={class:"flex justify-between items-center w-full"},Qt=c("h3",{class:"font-bold font-mono"}," Advance Settings ",-1),Yt={key:0,class:"mt-[24px] flex flex-col gap-[12px]"},Xt=c("h3",{class:"font-bold font-mono"}," Default Currency ",-1),Jt=c("h4",{class:"text-sm font-bold font-mono"}," Share sales data to wallets ",-1),Zt={class:"flex gap-2"},ea={class:"flex justify-end items-center"},ta=c("h3",{class:"font-bold font-mono"}," Coupon Codes ",-1),aa={class:"font-mono"},oa=c("h3",{class:"font-bold font-mono"}," Copy Purchase Link ",-1),la=c("br",null,null,-1),na=c("h3",{class:"font-bold font-mono"}," Purchase Link QR Code ",-1),Ua=lt({__name:"[collectionId]",setup(sa){const ve=nt(),oe=Rt(),ye=At(),W=Pt(),ge=Ut(),{token:le}=pe(oe),{wallet:x}=pe(ve),{updateNFTBookCollectionById:Q}=W,{getClassMetadataById:ke,lazyFetchClassMetadataById:Ce}=ye,{fetchStripeConnectStatus:ne,stripeConnectStatusWalletMap:Se}=ge,we=st(),xe=it(),De=rt(),C=r(""),S=r(!1),_=r(we.params.collectionId),R=r(void 0),A=r(""),d=r({}),I=r({}),Y=r(!1),P=r(""),D=r([]),B=r({}),U=r({}),V=r([]),g=r(""),k=r(""),O=r(!1),$=r(""),F=r(!0),j=r(!1),z=r(!1),w=r(pt.USD),X=r(!1),M=r(!0),se=r(!1),ie=b(()=>{var t;return(t=W.getCollectionById(_.value))==null?void 0:t.name}),J=b(()=>{var t;return(t=d==null?void 0:d.value)==null?void 0:t.ownerWallet}),re=b(()=>H.value.find(t=>!!t.shippingStatus)),Z=b(()=>x.value&&J.value===x.value),Ue=b(()=>Z.value||x.value&&B.value[x.value]),G=b(()=>{const t={from:R.value||""};A.value&&(t.coupon=A.value);const e=`?${new URLSearchParams(t).toString()}`,s=`https://liker.land/nft/collection/${_.value}${e}`,i=`https://api.like.co/likernft/book/collection/purchase/${_.value}/new${e}`;return F.value?s:i}),Te=b(()=>H.value.length?H.value.reduce((e,s)=>{const i=s.from||"empty";return e[i]||(e[i]={count:0,totalUSD:0}),e[i].count+=1,e[i].totalUSD+=s.price,e},{}):{}),H=b(()=>{var t;return(t=I.value)!=null&&t.orders?I.value.orders.map(e=>{const s=e.timestamp,i=new Date(s),f=`${i.getDate()}/${i.getMonth()+1}/${i.getFullYear()}`;return{...e,formattedDate:f}}).sort((e,s)=>s.timestamp-e.timestamp):[]}),ue=b(()=>U.value?Object.entries(U.value).map(([t,e])=>({id:t,expireTs:e.expireTs?new Date(e.expireTs):"",discount:e.discount})):[]),Ne=b(()=>{const t=[{key:"actions",label:"Actions",sortable:!1},{key:"orderDate",label:"Order Date",sortable:!0},{key:"status",label:"Status",sortable:!0}];return re.value&&t.push({key:"shippingStatus",label:"Shipping Status",sortable:!0}),t.push({key:"from",label:"Sales Channel",sortable:!0},{key:"price",label:"Price",sortable:!0},{key:"coupon",label:"Coupon Applied",sortable:!1},{key:"buyerEmail",label:"Buyer Email",sortable:!0},{key:"readerEmail",label:"Reader Email",sortable:!0},{key:"wallet",label:"Reader Wallet",sortable:!0},{key:"message",label:"Reader Message",sortable:!1}),re.value&&(t.push({key:"buyerPhone",label:"Buyer Phone",sortable:!0}),t.push({key:"shippingName",label:"Shipping Name",sortable:!0}),t.push({key:"shippingAddress",label:"Shipping Address",sortable:!0}),t.push({key:"shippingCountry",label:"Shipping Country",sortable:!0})),t});function Ee(t){const e=[];return t.status==="completed"&&t.txHash?e.push([{label:"View Transaction",icon:"i-heroicons-magnifying-glass",to:`${gt}/${t.txHash}`,target:"_blank"}]):t.status==="pendingNFT"&&Ue.value&&e.push([{label:"Send NFT",icon:"i-heroicons-paper-airplane",to:{name:"nft-book-store-collection-send-collectionId",params:{collectionId:t.collectionId},query:{owner_wallet:J.value,payment_id:t.id}}}]),["pendingNFT","paid"].includes(t.status)&&e.push([{label:"Mark Complete",icon:"i-heroicons-check-circle",click:()=>{Ie(t)}}]),e}function Le(t){switch(t.status){case"paid":return"Paid";case"pendingNFT":return"Pending NFT";case"completed":return"Completed";default:return t.status}}function $e(t){switch(t.status){case"paid":return"blue";case"pendingNFT":return"amber";case"completed":return"green";default:return"gray"}}const Re=b(()=>{var t;return(t=H.value)==null?void 0:t.map((e,s)=>{var i,f,m,u;return{index:s,buyerEmail:e.email,buyerPhone:e.phone||"",readerEmail:((i=e.giftInfo)==null?void 0:i.toEmail)||e.email,status:e.status,statusLabel:Le(e),statusLabelColor:$e(e),orderDate:e.formattedDate,shippingStatus:e.shippingStatus,shippingCountry:((m=(f=e.shippingDetails)==null?void 0:f.address)==null?void 0:m.country)||"",shippingAddress:mt(e.shippingDetails)||"",shippingName:((u=e.shippingDetails)==null?void 0:u.name)||"",wallet:e.wallet||"",walletLink:be(e.wallet),shortenWallet:he(e.wallet),priceName:e.priceName,price:e.price||0,coupon:e.coupon||"",message:e.message||"",from:e.from||"",actions:Ee(e)}}).filter(e=>{var i,f,m,u,v;if(!P.value)return!0;const s=P.value.toLowerCase();return e.buyerEmail.toLowerCase().includes(s)||e.buyerPhone.toLowerCase().includes(s)||e.readerEmail.toLowerCase().includes(s)||((i=e.wallet)==null?void 0:i.toLowerCase().includes(s))||((f=e.priceName)==null?void 0:f.toLowerCase().includes(s))||((m=e.statusLabel)==null?void 0:m.toLowerCase().includes(s))||((u=e.orderDate)==null?void 0:u.toLowerCase().includes(s))||((v=e.from)==null?void 0:v.toLowerCase().includes(s))})}),Ae=b(()=>{const t=[{key:"wallet",label:"Wallet",sortable:!0}];return Z.value&&t.push({key:"authz",label:"Send NFT Grant",sortable:!1},{key:"remove",label:"",sortable:!1}),t}),Pe=b(()=>D.value?D.value.map((t,e)=>{const s=!!B.value[t];return{index:e,wallet:t,shortenWallet:he(t),walletLink:be(t),isGranted:s,grantLabel:s?"Granted":"Grant",grantRoute:{name:"authz",query:{grantee:t}}}}):[]),Ve=b(()=>{var t;return(t=V.value)==null?void 0:t.map((e,s)=>({index:s,email:e}))}),Oe=b(()=>{var e,s,i;const t=(e=d.value)==null?void 0:e.classIds;return t!=null&&t.length?[{index:1,books:(s=d.value)==null?void 0:s.classIds,price:((i=d.value)==null?void 0:i.priceInDecimal)/100,action:_.value}]:[]});function Fe(t){switch(t){case"empty":return"Not set";default:return t}}const We=b(()=>{var t;return(t=Object.entries(Te.value))==null?void 0:t.map(([e,s])=>({id:e,idLabel:Fe(e),count:s.count||0,totalUSD:s.totalUSD||0}))});me(S,t=>{t&&(C.value="")}),me(D,t=>{t==null||t.forEach(async e=>{if(!B.value[e])try{B.value[e]=await ft(J.value,e)}catch{}})}),ut(async()=>{S.value=!0;try{d.value=(await W.fetchCollectionById(_.value)).value;const t=d.value.typePayload;t&&(d.value={...d.value,...t});const{moderatorWallets:e,notificationEmails:s,connectedWallets:i,coupons:f,defaultPaymentCurrency:m}=d.value;D.value=e,V.value=s,O.value=!!(i&&Object.keys(i).length);const u=i&&Object.keys(i)[0];u!==x.value&&($.value=u,M.value=!1,await ne(u)),m&&(w.value=m),U.value=f||{};const{data:v,error:p}=await _e(`${fe}/likernft/book/collection/purchase/${_.value}/orders`,{headers:{authorization:`Bearer ${le.value}`}},"$lupd0QbR4t");if(p.value)throw p.value.statusCode===403?new Error("NOT_OWNER_OF_NFT_COLLECTION"):p.value;I.value=v.value,await ne(x.value),d.value.classIds.forEach(q=>Ce(q))}catch(t){console.error(t),C.value=t.toString()}finally{S.value=!1}});async function Ie(t){var m,u;if(!confirm("Do you want to skip the 'Send NFT' action and override this payment status to 'completed'?"))return;const s=(u=(m=I.value)==null?void 0:m.orders)==null?void 0:u.find(v=>v.id===t.id);if(!s)throw new Error("ORDER_NOT_FOUND");const i=s.status;s.status="completed";const{error:f}=await _e(`${fe}/likernft/book/collection/purchase/${_.value}/sent/${t.id}`,{method:"POST",body:{txHash:null},headers:{authorization:`Bearer ${le.value}`}},"$1VweYFnqMU");if(f.value)throw s.status=i,f.value;d.value.pendingNFTCount-=1}function Be(t){U.value[t.id]={discount:t.discount,expireTs:t.expireTs}}function je(){g.value&&(D.value.push(g.value),g.value="")}function ze(){k.value&&(V.value.push(k.value),k.value="")}async function Me(t){$.value=t,se.value=!0;try{await Q(_.value,{connectedWallets:{[$.value]:100}})}catch(e){const s=e.data||e;C.value=s}finally{se.value=!1,X.value=!0}}async function Ge(){try{if(g.value)throw new Error('Please press "Add" button to add moderator wallet');if(k.value)throw new Error('Please press "Add" button to add notification email');S.value=!0;const t=O.value&&$.value?{[$.value]:100}:null;await Q(_.value,{defaultPaymentCurrency:w,moderatorWallets:D,notificationEmails:V,connectedWallets:t,coupons:U}),xe.push({name:"nft-book-store-collection"})}catch(t){const e=t.data||t;console.error(e),C.value=e}finally{S.value=!1,X.value=!1}}async function He(t){Y.value=!0;try{await Q(_.value,{shippingRates:t}),d.value=(await W.fetchCollectionById(_.value)).value;const e=d.value.typePayload;e&&(d.value={...d.value,...e})}catch(e){const s=e.data||e;C.value=s}finally{Y.value=!1}}async function qe(){await navigator.clipboard.writeText(G.value),De.add({icon:"i-heroicons-check-circle",title:"Copied purchase link to clipboard",timeout:2e3,color:"green"})}return(t,e)=>{const s=at,i=ot,f=bt,m=kt,u=ht,v=Ct,p=_t,q=vt,Ke=St,K=Dt,Qe=Tt,ce=Et,Ye=Lt,Xe=wt,Je=Nt,Ze=$t,et=xt,tt=yt;return h(),T("main",Vt,[c("h1",Ot,' NFT Book Collection Status "'+N(o(ie))+'" ',1),o(C)?(h(),E(s,{key:0,icon:"i-heroicons-exclamation-triangle",color:"red",variant:"soft",title:`${o(C)}`,"close-button":{icon:"i-heroicons-x-mark-20-solid",color:"red",variant:"link",padded:!1},onClose:e[0]||(e[0]=a=>C.value="")},null,8,["title"])):L("",!0),o(S)?(h(),E(i,{key:1,animation:"carousel"},{indicator:n(()=>[te(" Loading... ")]),_:1})):L("",!0),o(oe).isAuthenticated?(h(),T(ae,{key:2},[l(u,{ui:{body:{padding:""}}},{header:n(()=>[Ft]),default:n(()=>[l(m,{columns:[{key:"pendingAction",label:"Pending Action"},{key:"sold",label:"Sold"},{key:"stock",label:"Stock"}],rows:[{pendingAction:o(d).pendingNFTCount||0,sold:o(d).sold||0,stock:o(d).stock||0}]},{"pendingAction-data":n(({row:a})=>[a.pendingAction?(h(),E(f,{key:0,label:`${a.pendingAction}`,color:"red",ui:{rounded:"rounded-full"}},null,8,["label"])):(h(),T(ae,{key:1},[te(N(a.pendingAction),1)],64))]),_:1},8,["rows"])]),_:1}),l(u,{ui:{header:{base:"flex justify-between items-center gap-4"},body:{padding:""}}},{header:n(()=>[Wt,l(v,{modelValue:o(P),"onUpdate:modelValue":e[1]||(e[1]=a=>y(P)?P.value=a:null),icon:"i-heroicons-magnifying-glass-20-solid",placeholder:"Search..."},null,8,["modelValue"])]),default:n(()=>[l(m,{columns:o(Ne),rows:o(Re)},{"buyerEmail-data":n(({row:a})=>[l(p,{label:a.buyerEmail,to:`mailto:${a.buyerEmail}`,variant:"link",padded:!1},null,8,["label","to"])]),"readerEmail-data":n(({row:a})=>[l(p,{label:a.readerEmail,to:`mailto:${a.readerEmail}`,variant:"link",padded:!1},null,8,["label","to"])]),"wallet-data":n(({row:a})=>[l(q,{text:a.wallet},{default:n(()=>[l(p,{class:"font-mono",label:a.shortenWallet,to:a.walletLink,variant:"link",padded:!1,size:"xs",target:"_blank"},null,8,["label","to"])]),_:2},1032,["text"])]),"status-data":n(({row:a})=>[l(f,{color:a.statusLabelColor,label:a.statusLabel,variant:"outline",ui:{rounded:"rounded-full"}},null,8,["color","label"])]),"actions-data":n(({row:a})=>[l(Ke,{items:a.actions},{default:n(()=>[l(p,{class:ct({hidden:!a.actions.length}),icon:"i-heroicons-ellipsis-horizontal-20-solid",color:"gray",variant:"ghost"},null,8,["class"])]),_:2},1032,["items"])]),_:1},8,["columns","rows"])]),_:1}),l(u,{ui:{body:{padding:""}}},{header:n(()=>[It]),default:n(()=>[l(K,null,{default:n(()=>[l(m,{columns:[{key:"index",label:""},{key:"books",label:"Books"},{key:"price",label:"Price (USD)"},{key:"action",label:"Edit"}],rows:o(Oe)},{"books-data":n(({row:a})=>[c("div",Bt,[(h(!0),T(ae,null,dt(a==null?void 0:a.books,ee=>{var de;return h(),T("span",{key:ee,class:"text-left whitespace-pre-line"},N(`${(de=o(ke)(ee))==null?void 0:de.name}
 class id: ${ee} 
`),1)}),128))])]),"price-data":n(({row:a})=>[c("span",jt,N(a.price),1)]),"action-data":n(({row:a})=>[l(p,{icon:"i-heroicons-document-magnifying-glass",to:{name:"nft-book-store-collection-status-collectionId-edit",params:{collectionId:a.collectionId}},variant:"soft",color:"gray"},null,8,["to"])]),_:1},8,["columns","rows"])]),_:1})]),_:1}),o(Z)?(h(),E(Qe,{key:0,"is-stripe-connect-checked":o(O),"onUpdate:isStripeConnectChecked":e[2]||(e[2]=a=>y(O)?O.value=a:null),"is-using-default-account":o(M),"onUpdate:isUsingDefaultAccount":e[3]||(e[3]=a=>y(M)?M.value=a:null),"stripe-connect-wallet":o($),"stripe-connect-status-wallet-map":o(Se),"should-disable-setting":o(X),"login-address":o(x),onSave:Me},null,8,["is-stripe-connect-checked","is-using-default-account","stripe-connect-wallet","stripe-connect-status-wallet-map","should-disable-setting","login-address"])):L("",!0),l(u,{ui:{header:{base:"flex justify-between items-center"},body:{padding:""}}},{header:n(()=>[zt,c("div",Mt,[l(v,{modelValue:o(k),"onUpdate:modelValue":e[4]||(e[4]=a=>y(k)?k.value=a:null),placeholder:"abc@example.com"},null,8,["modelValue"]),l(p,{label:"Add",variant:o(k)?"outline":"solid",color:o(k)?"primary":"gray",disabled:!o(k),onClick:ze},null,8,["variant","color","disabled"])])]),default:n(()=>[l(m,{columns:[{key:"email",label:"Email",sortable:!0},{key:"action"}],rows:o(Ve)},{"email-data":n(({row:a})=>[l(p,{label:a.email,to:`mailto:${a.email}`,variant:"link",padded:!1},null,8,["label","to"])]),"action-data":n(({row:a})=>[c("div",Gt,[l(p,{icon:"i-heroicons-x-mark",variant:"soft",color:"red",onClick:()=>o(V).splice(a.index,1)},null,8,["onClick"])])]),_:1},8,["rows"])]),_:1}),l(u,{ui:{body:{padding:""}}},{header:n(()=>[Ht]),default:n(()=>[l(m,{columns:[{key:"id",label:"Channel ID",sortable:!0},{key:"count",label:"Count",sortable:!0},{key:"totalUSD",label:"Total USD",sortable:!0}],rows:o(We)},{"id-data":n(({row:a})=>[a.id!=="empty"?(h(),T("span",qt,N(a.idLabel),1)):(h(),E(f,{key:1,label:a.idLabel,ui:{rounded:"rounded-full"},color:"gray"},null,8,["label"]))]),_:1},8,["rows"])]),_:1}),l(u,{ui:{header:{base:"flex justify-between items-center"},body:{padding:"12px"}}},{default:n(()=>[c("div",Kt,[Qt,l(p,{color:"gray",variant:"ghost",icon:o(z)?"i-heroicons-chevron-up":"i-heroicons-chevron-down",onClick:e[5]||(e[5]=()=>{z.value=!o(z)})},null,8,["icon"])]),o(z)?(h(),T("div",Yt,[l(u,{ui:{header:{base:"flex justify-between items-center gap-2"}}},{header:n(()=>[Xt]),default:n(()=>[l(K,{label:"Default Display Currency at Checkout",help:"Note that price setting is always in USD "},{default:n(()=>[l(ce,{modelValue:o(w),"onUpdate:modelValue":e[6]||(e[6]=a=>y(w)?w.value=a:null),label:"USD",name:"USD",value:"USD"},null,8,["modelValue"]),l(ce,{modelValue:o(w),"onUpdate:modelValue":e[7]||(e[7]=a=>y(w)?w.value=a:null),label:"HKD",name:"HKD",value:"HKD"},null,8,["modelValue"])]),_:1})]),_:1}),l(Ye,{"is-show-physical-goods-checkbox":!1,"is-loading":o(Y),"shipping-info":o(d).shippingRates,onUpdateShippingRates:He},null,8,["is-loading","shipping-info"]),l(u,{ui:{header:{base:"flex justify-between items-center"},body:{padding:"",base:"space-y-8"}}},{header:n(()=>[Jt,c("div",Zt,[l(v,{modelValue:o(g),"onUpdate:modelValue":e[8]||(e[8]=a=>y(g)?g.value=a:null),class:"font-mono",placeholder:"like1..."},null,8,["modelValue"]),l(p,{label:"Add",variant:o(g)?"outline":"solid",color:o(g)?"primary":"gray",disabled:!o(g),onClick:je},null,8,["variant","color","disabled"])])]),default:n(()=>[l(m,{columns:o(Ae),rows:o(Pe)},{"wallet-data":n(({row:a})=>[l(q,{text:a.wallet},{default:n(()=>[l(p,{class:"font-mono",label:a.shortenWallet,to:a.walletLink,variant:"link",padded:!1,size:"xs"},null,8,["label","to"])]),_:2},1032,["text"])]),"authz-data":n(({row:a})=>[l(p,{label:a.grantLabel,to:a.grantRoute,variant:a.isGranted?"outline":"solid",color:"green"},null,8,["label","to","variant"])]),"remove-data":n(({row:a})=>[c("div",ea,[l(p,{icon:"i-heroicons-x-mark",variant:"soft",color:"red",onClick:()=>o(D).splice(a.index,1)},null,8,["onClick"])])]),_:1},8,["columns","rows"])]),_:1}),l(u,{ui:{header:{base:"flex justify-between items-center"},body:{padding:""}}},{header:n(()=>[ta,l(p,{label:"Add New",icon:"i-heroicons-plus-circle",variant:"outline",color:"primary",onClick:e[9]||(e[9]=a=>j.value=!0)})]),default:n(()=>[o(ue).length?(h(),E(m,{key:0,columns:[{key:"id",label:"Code",sortable:!0},{key:"discount",label:"Discount Multiplier"},{key:"expireTs",label:"Expiry Date"}],rows:o(ue)},{"id-data":n(({row:a})=>[c("span",aa,N(a.id),1)]),_:1},8,["rows"])):L("",!0)]),_:1}),l(Xe,{modelValue:o(j),"onUpdate:modelValue":e[10]||(e[10]=a=>y(j)?j.value=a:null),onAdd:Be},null,8,["modelValue"]),l(u,{ui:{body:{base:"space-y-4"}}},{header:n(()=>[oa]),default:n(()=>[c("div",null,[l(Je,{modelValue:o(F),"onUpdate:modelValue":e[11]||(e[11]=a=>y(F)?F.value=a:null)},null,8,["modelValue"]),te(" Use "+N(o(F)?"Liker Land":"Stripe")+" Purchase Link ",1)]),l(K,{label:"Sales channel for this link",hint:"Optional"},{default:n(()=>[l(v,{modelValue:o(R),"onUpdate:modelValue":e[12]||(e[12]=a=>y(R)?R.value=a:null),placeholder:"Channel ID"},null,8,["modelValue"])]),_:1}),Object.keys(o(U)).length?(h(),E(K,{key:0,label:"Active coupon",hint:"Optional"},{default:n(()=>[l(Ze,{modelValue:o(A),"onUpdate:modelValue":e[13]||(e[13]=a=>y(A)?A.value=a:null),options:[""].concat(Object.keys(o(U)))},null,8,["modelValue","options"])]),_:1})):L("",!0),l(p,{class:"font-mono break-all",label:`${o(G)}`,to:o(G),variant:"outline",color:"gray",target:"_blank"},null,8,["label","to"]),la,l(p,{label:"Copy Purchase Link",variant:"outline",color:"primary",onClick:qe}),l(et,{data:o(G),"file-name":`collection-${o(ie)}-channel_${o(R)||""}`,width:500,height:500},{header:n(()=>[na]),_:1},8,["data","file-name"])]),_:1})])):L("",!0)]),_:1}),l(p,{label:"Save Changes",loading:o(S),size:"lg",disabled:o(S),onClick:Ge},null,8,["loading","disabled"])],64)):L("",!0),l(tt,{transition:!1})])}}});export{Ua as default};