import{_ as Qe}from"./Alert.9ed33f40.js";import{g as Ke,W as Ye,i as Je,j as Xe,s as re,h as Ze,R as et,k as tt,v as d,x as b,y as ue,m as at,U as ce,ap as ot,o as h,r as E,w as s,a as p,t as D,z as o,A as P,d as X,c as N,b as l,N as Z,C as x,aq as lt,O as nt,ar as st,as as it,B as de,D as pe,ai as rt,H as ut,at as ct,K as dt,I as pt,J as mt,au as ft}from"./entry.c6854afe.js";import{_ as bt}from"./Table.24e3600d.js";import{_ as ht}from"./Input.3ae04d0e.js";import{_ as _t}from"./Dropdown.0e1a97fd.js";import{_ as vt}from"./FormGroup.b896c5eb.js";import{_ as yt}from"./StripeConnectCard.vue.bb561cdb.js";import{_ as gt}from"./RateTable.vue.0c7a34a1.js";import{_ as kt}from"./Toggle.9a07a8d6.js";import{_ as Ct}from"./PageBody.vue.ec8e43c6.js";import{u as St}from"./nft.0d5e0778.js";import{u as wt}from"./collection.41425ec6.js";import{u as xt}from"./stripe.04ec3c7a.js";import"./useFormGroup.8531c5da.js";import"./use-text-value.901be440.js";import"./Radio.51109a17.js";import"./index.19817b30.js";import"./v4.b87601ea.js";import"./use-controllable.73c8cf53.js";(function(){try{var T=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},B=new Error().stack;B&&(T._sentryDebugIds=T._sentryDebugIds||{},T._sentryDebugIds[B]="ee83fe67-7914-4650-b902-274572c42dca",T._sentryDebugIdIdentifier="sentry-dbid-ee83fe67-7914-4650-b902-274572c42dca")}catch{}})();const Lt={class:"text-lg font-bold font-mono"},Et=p("h3",{class:"font-bold font-mono"}," Status ",-1),Dt=p("h3",{class:"font-bold font-mono"}," Orders ",-1),Nt=p("h3",{class:"font-bold font-mono"}," Books in Collection ",-1),Tt={class:"flex flex-col gap-[8px] items-start"},Ut={class:"text-center"},Rt=p("h4",{class:"text-sm font-bold font-mono"}," Email to receive sales notifications ",-1),$t={class:"flex gap-2"},At={class:"flex justify-end items-center"},It=p("h3",{class:"font-bold font-mono"}," Sales Channel Summary ",-1),Pt={key:0,class:"font-bold font-mono"},Bt={class:"flex justify-between items-center w-full"},Wt=p("h3",{class:"font-bold font-mono"}," Advanced Settings ",-1),Ft={key:0,class:"mt-[24px] flex flex-col gap-[12px]"},Ot=p("h4",{class:"text-sm font-bold font-mono"}," Share sales data to wallets ",-1),Vt={class:"flex gap-2"},zt={class:"flex justify-end items-center"},jt=p("h3",{class:"font-bold font-mono"}," Copy Purchase Link ",-1),Gt=p("br",null,null,-1),qt=p("h3",{class:"font-bold font-mono"}," Purchase Link QR Code ",-1),da=Ke({__name:"[collectionId]",setup(T){const{CHAIN_EXPLORER_URL:B,LIKE_CO_API:q}=Ye().public,me=Je(),ee=Xe(),fe=St(),W=wt(),be=xt(),{token:te}=re(ee),{wallet:S}=re(me),{updateNFTBookCollectionById:H}=W,{getClassMetadataById:he,lazyFetchClassMetadataById:_e}=fe,{fetchStripeConnectStatusByWallet:ae}=be,ve=Ze(),ye=et(),ge=tt(),k=d(""),C=d(!1),v=d(ve.params.collectionId),U=d(void 0),r=d({}),F=d({}),M=d(!1),R=d(""),w=d([]),O=d({}),$=d([]),y=d(""),g=d(""),A=d(!1),L=d(""),I=d(!0),V=d(!1),Q=d(!1),z=d(!0),oe=b(()=>{var t;return(t=W.getCollectionById(v.value))==null?void 0:t.name}),K=b(()=>{var t;return(t=r==null?void 0:r.value)==null?void 0:t.ownerWallet}),le=b(()=>G.value.find(t=>!!t.shippingStatus)),Y=b(()=>S.value&&K.value===S.value),ke=b(()=>Y.value||S.value&&O.value[S.value]),j=b(()=>st({collectionId:v.value,channel:U.value,isUseLikerLandLink:I.value})),Ce=b(()=>G.value.length?G.value.reduce((e,n)=>{const i=n.from||"empty";return e[i]||(e[i]={count:0,totalUSD:0}),e[i].count+=1,e[i].totalUSD+=n.price,e},{}):{}),G=b(()=>{var t;return(t=F.value)!=null&&t.orders?F.value.orders.map(e=>{const n=e.timestamp,i=new Date(n),c=`${i.getDate()}/${i.getMonth()+1}/${i.getFullYear()}`;return{...e,formattedDate:c}}).sort((e,n)=>n.timestamp-e.timestamp):[]}),Se=b(()=>{const t=[{key:"actions",label:"Actions",sortable:!1},{key:"orderDate",label:"Order Date",sortable:!0},{key:"status",label:"Status",sortable:!0}];return le.value&&t.push({key:"shippingStatus",label:"Shipping Status",sortable:!0}),t.push({key:"from",label:"Sales Channel",sortable:!0},{key:"price",label:"Price",sortable:!0},{key:"quantity",label:"Quantity",sortable:!0},{key:"coupon",label:"Coupon Applied",sortable:!1},{key:"buyerEmail",label:"Buyer Email",sortable:!0},{key:"readerEmail",label:"Reader Email",sortable:!0},{key:"wallet",label:"Reader Wallet",sortable:!0},{key:"message",label:"Reader Message",sortable:!1}),le.value&&(t.push({key:"buyerPhone",label:"Buyer Phone",sortable:!0}),t.push({key:"shippingName",label:"Shipping Name",sortable:!0}),t.push({key:"shippingAddress",label:"Shipping Address",sortable:!0}),t.push({key:"shippingCountry",label:"Shipping Country",sortable:!0})),t});function we(t){const e=[];return t.status==="completed"&&t.txHash?e.push([{label:"View Transaction",icon:"i-heroicons-magnifying-glass",to:`${B}/${t.txHash}`,target:"_blank"}]):t.status==="pendingNFT"&&ke.value&&e.push([{label:"Send NFT",icon:"i-heroicons-paper-airplane",to:{name:"nft-book-store-collection-send-collectionId",params:{collectionId:t.collectionId},query:{owner_wallet:K.value,payment_id:t.id}}}]),["pendingNFT","paid"].includes(t.status)&&e.push([{label:"Mark Complete",icon:"i-heroicons-check-circle",click:()=>{Ae(t)}}]),e}function xe(t){switch(t.status){case"paid":return"Paid";case"pendingNFT":return"Pending NFT";case"completed":return"Completed";default:return t.status}}function Le(t){switch(t.status){case"paid":return"blue";case"pendingNFT":return"amber";case"completed":return"green";default:return"gray"}}const Ee=b(()=>{var t;return(t=G.value)==null?void 0:t.map((e,n)=>{var i,c,m,u;return{index:n,buyerEmail:e.email,buyerPhone:e.phone||"",readerEmail:((i=e.giftInfo)==null?void 0:i.toEmail)||e.email,status:e.status,statusLabel:xe(e),statusLabelColor:Le(e),orderDate:e.formattedDate,shippingStatus:e.shippingStatus,shippingCountry:((m=(c=e.shippingDetails)==null?void 0:c.address)==null?void 0:m.country)||"",shippingAddress:it(e.shippingDetails)||"",shippingName:((u=e.shippingDetails)==null?void 0:u.name)||"",wallet:e.wallet||"",walletLink:de(e.wallet),shortenWallet:pe(e.wallet),priceName:e.priceName,price:e.price||0,quantity:e.quantity||1,coupon:e.coupon||"",message:e.message||"",from:e.from||"",actions:we(e)}}).filter(e=>{var i,c,m,u,_;if(!R.value)return!0;const n=R.value.toLowerCase();return e.buyerEmail.toLowerCase().includes(n)||e.buyerPhone.toLowerCase().includes(n)||e.readerEmail.toLowerCase().includes(n)||((i=e.wallet)==null?void 0:i.toLowerCase().includes(n))||((c=e.priceName)==null?void 0:c.toLowerCase().includes(n))||((m=e.statusLabel)==null?void 0:m.toLowerCase().includes(n))||((u=e.orderDate)==null?void 0:u.toLowerCase().includes(n))||((_=e.from)==null?void 0:_.toLowerCase().includes(n))})}),De=b(()=>{const t=[{key:"wallet",label:"Wallet",sortable:!0}];return Y.value&&t.push({key:"authz",label:"Send NFT Grant",sortable:!1},{key:"remove",label:"",sortable:!1}),t}),Ne=b(()=>w.value?w.value.map((t,e)=>{const n=!!O.value[t];return{index:e,wallet:t,shortenWallet:pe(t),walletLink:de(t),isGranted:n,grantLabel:n?"Granted":"Grant",grantRoute:{name:"authz",query:{grantee:t}}}}):[]),Te=b(()=>{var t;return(t=$.value)==null?void 0:t.map((e,n)=>({index:n,email:e}))}),Ue=b(()=>{var e,n,i;const t=(e=r.value)==null?void 0:e.classIds;return t!=null&&t.length?[{index:1,books:(n=r.value)==null?void 0:n.classIds,price:((i=r.value)==null?void 0:i.priceInDecimal)/100,action:v.value}]:[]});function Re(t){switch(t){case"empty":return"Not set";default:return t}}const $e=b(()=>{var t;return(t=Object.entries(Ce.value))==null?void 0:t.map(([e,n])=>({id:e,idLabel:Re(e),count:n.count||0,totalUSD:n.totalUSD||0}))});ue(C,t=>{t&&(k.value="")}),ue(w,t=>{t==null||t.forEach(async e=>{if(!O.value[e])try{O.value[e]=await rt(K.value,e)}catch{}})}),at(async()=>{C.value=!0;try{r.value=(await W.fetchCollectionById(v.value)).value;const t=r.value.typePayload;t&&(r.value={...r.value,...t});const{moderatorWallets:e,notificationEmails:n,connectedWallets:i}=r.value;w.value=e,$.value=n,A.value=!!(i&&Object.keys(i).length);const c=i&&Object.keys(i)[0];c&&(L.value=c,c!==S.value&&(z.value=!1,await ae(c)));const{data:m,error:u}=await ce(`${q}/likernft/book/collection/purchase/${v.value}/orders`,{headers:{authorization:`Bearer ${te.value}`}},"$lupd0QbR4t");if(u.value)throw u.value.statusCode===403?new Error("NOT_OWNER_OF_NFT_COLLECTION"):u.value;F.value=m.value,await ae(S.value),r.value.classIds.forEach(_=>_e(_))}catch(t){console.error(t),k.value=t.toString()}finally{C.value=!1}});async function Ae(t){var m,u;if(!confirm("Do you want to skip the 'Send NFT' action and override this payment status to 'completed'?"))return;const n=(u=(m=F.value)==null?void 0:m.orders)==null?void 0:u.find(_=>_.id===t.id);if(!n)throw new Error("ORDER_NOT_FOUND");const i=n.status;n.status="completed";const{error:c}=await ce(`${q}/likernft/book/collection/purchase/${v.value}/sent/${t.id}`,{method:"POST",body:{txHash:null},headers:{authorization:`Bearer ${te.value}`}},"$1VweYFnqMU");if(c.value)throw n.status=i,c.value;r.value.pendingNFTCount-=1}function Ie(){y.value&&(w.value.push(y.value),y.value="")}function Pe(){g.value&&($.value.push(g.value),g.value="")}async function Be(t){L.value=t;try{await H(v.value,{connectedWallets:{[L.value]:100}})}catch(e){const n=e.data||e;k.value=n}finally{Q.value=!0}}async function We(){try{if(y.value)throw new Error('Please press "Add" button to add moderator wallet');if(g.value)throw new Error('Please press "Add" button to add notification email');C.value=!0;const t=A.value&&L.value?{[L.value]:100}:null;await H(v.value,{moderatorWallets:w,notificationEmails:$,connectedWallets:t}),ye.push({name:"nft-book-store-collection"})}catch(t){const e=t.data||t;console.error(e),k.value=e}finally{C.value=!1,Q.value=!1}}async function Fe(t){M.value=!0;try{await H(v.value,{shippingRates:t}),r.value=(await W.fetchCollectionById(v.value)).value;const e=r.value.typePayload;e&&(r.value={...r.value,...e})}catch(e){const n=e.data||e;k.value=n}finally{M.value=!1}}async function Oe(){await navigator.clipboard.writeText(j.value),ge.add({icon:"i-heroicons-check-circle",title:"Copied purchase link to clipboard",timeout:2e3,color:"green"})}return(t,e)=>{const n=Qe,i=ut,c=ct,m=bt,u=dt,_=ht,f=pt,ne=mt,Ve=_t,se=vt,ze=yt,je=gt,Ge=kt,qe=ot("QRCode"),He=ft,Me=Ct;return h(),E(Me,{class:"space-y-10 pb-10"},{default:s(()=>[p("h1",Lt,' NFT Book Collection Status "'+D(o(oe))+'" ',1),o(k)?(h(),E(n,{key:0,icon:"i-heroicons-exclamation-triangle",color:"red",variant:"soft",title:`${o(k)}`,"close-button":{icon:"i-heroicons-x-mark-20-solid",color:"red",variant:"link",padded:!1},onClose:e[0]||(e[0]=a=>k.value="")},null,8,["title"])):P("",!0),o(C)?(h(),E(i,{key:1,animation:"carousel"},{indicator:s(()=>[X(" Loading... ")]),_:1})):P("",!0),o(ee).isAuthenticated?(h(),N(Z,{key:2},[l(u,{ui:{body:{padding:""}}},{header:s(()=>[Et]),default:s(()=>[l(m,{columns:[{key:"pendingAction",label:"Pending Action"},{key:"sold",label:"Sold"},{key:"stock",label:"Stock"}],rows:[{pendingAction:o(r).pendingNFTCount||0,sold:o(r).sold||0,stock:o(r).stock||0}]},{"pendingAction-data":s(({row:a})=>[a.pendingAction?(h(),E(c,{key:0,label:`${a.pendingAction}`,color:"red",ui:{rounded:"rounded-full"}},null,8,["label"])):(h(),N(Z,{key:1},[X(D(a.pendingAction),1)],64))]),_:1},8,["rows"])]),_:1}),l(u,{ui:{header:{base:"flex justify-between items-center gap-4"},body:{padding:""}}},{header:s(()=>[Dt,l(_,{modelValue:o(R),"onUpdate:modelValue":e[1]||(e[1]=a=>x(R)?R.value=a:null),icon:"i-heroicons-magnifying-glass-20-solid",placeholder:"Search..."},null,8,["modelValue"])]),default:s(()=>[l(m,{columns:o(Se),rows:o(Ee)},{"buyerEmail-data":s(({row:a})=>[l(f,{label:a.buyerEmail,to:`mailto:${a.buyerEmail}`,variant:"link",padded:!1},null,8,["label","to"])]),"readerEmail-data":s(({row:a})=>[l(f,{label:a.readerEmail,to:`mailto:${a.readerEmail}`,variant:"link",padded:!1},null,8,["label","to"])]),"wallet-data":s(({row:a})=>[l(ne,{text:a.wallet},{default:s(()=>[l(f,{class:"font-mono",label:a.shortenWallet,to:a.walletLink,variant:"link",padded:!1,size:"xs",target:"_blank"},null,8,["label","to"])]),_:2},1032,["text"])]),"status-data":s(({row:a})=>[l(c,{color:a.statusLabelColor,label:a.statusLabel,variant:"outline",ui:{rounded:"rounded-full"}},null,8,["color","label"])]),"actions-data":s(({row:a})=>[l(Ve,{items:a.actions},{default:s(()=>[l(f,{class:lt({hidden:!a.actions.length}),icon:"i-heroicons-ellipsis-horizontal-20-solid",color:"gray",variant:"ghost"},null,8,["class"])]),_:2},1032,["items"])]),_:1},8,["columns","rows"])]),_:1}),l(u,{ui:{body:{padding:""}}},{header:s(()=>[Nt]),default:s(()=>[l(se,null,{default:s(()=>[l(m,{columns:[{key:"index",label:""},{key:"books",label:"Books"},{key:"price",label:"Price (USD)"},{key:"action",label:"Edit"}],rows:o(Ue)},{"books-data":s(({row:a})=>[p("div",Tt,[(h(!0),N(Z,null,nt(a==null?void 0:a.books,J=>{var ie;return h(),N("span",{key:J,class:"text-left whitespace-pre-line"},D(`${(ie=o(he)(J))==null?void 0:ie.name}
 class id: ${J} 
`),1)}),128))])]),"price-data":s(({row:a})=>[p("span",Ut,D(a.price),1)]),"action-data":s(({row:a})=>[l(f,{icon:"i-heroicons-document-magnifying-glass",to:{name:"nft-book-store-collection-status-collectionId-edit",params:{collectionId:a.collectionId}},variant:"soft",color:"gray"},null,8,["to"])]),_:1},8,["columns","rows"])]),_:1})]),_:1}),o(Y)?(h(),E(ze,{key:0,"is-stripe-connect-checked":o(A),"onUpdate:isStripeConnectChecked":e[2]||(e[2]=a=>x(A)?A.value=a:null),"is-using-default-account":o(z),"onUpdate:isUsingDefaultAccount":e[3]||(e[3]=a=>x(z)?z.value=a:null),"stripe-connect-wallet":o(L),"should-disable-setting":o(Q),"login-address":o(S),onSave:Be},null,8,["is-stripe-connect-checked","is-using-default-account","stripe-connect-wallet","should-disable-setting","login-address"])):P("",!0),l(u,{ui:{header:{base:"flex justify-between items-center"},body:{padding:""}}},{header:s(()=>[Rt,p("div",$t,[l(_,{modelValue:o(g),"onUpdate:modelValue":e[4]||(e[4]=a=>x(g)?g.value=a:null),placeholder:"abc@example.com"},null,8,["modelValue"]),l(f,{label:"Add",variant:o(g)?"outline":"solid",color:o(g)?"primary":"gray",disabled:!o(g),onClick:Pe},null,8,["variant","color","disabled"])])]),default:s(()=>[l(m,{columns:[{key:"email",label:"Email",sortable:!0},{key:"action"}],rows:o(Te)},{"email-data":s(({row:a})=>[l(f,{label:a.email,to:`mailto:${a.email}`,variant:"link",padded:!1},null,8,["label","to"])]),"action-data":s(({row:a})=>[p("div",At,[l(f,{icon:"i-heroicons-x-mark",variant:"soft",color:"red",onClick:()=>o($).splice(a.index,1)},null,8,["onClick"])])]),_:1},8,["rows"])]),_:1}),l(u,{ui:{body:{padding:""}}},{header:s(()=>[It]),default:s(()=>[l(m,{columns:[{key:"id",label:"Channel ID",sortable:!0},{key:"count",label:"Count",sortable:!0},{key:"totalUSD",label:"Total USD",sortable:!0}],rows:o($e)},{"id-data":s(({row:a})=>[a.id!=="empty"?(h(),N("span",Pt,D(a.idLabel),1)):(h(),E(c,{key:1,label:a.idLabel,ui:{rounded:"rounded-full"},color:"gray"},null,8,["label"]))]),_:1},8,["rows"])]),_:1}),l(u,{ui:{header:{base:"flex justify-between items-center"},body:{padding:"12px"}}},{default:s(()=>[p("div",Bt,[Wt,l(f,{color:"gray",variant:"ghost",icon:o(V)?"i-heroicons-chevron-up":"i-heroicons-chevron-down",onClick:e[5]||(e[5]=()=>{V.value=!o(V)})},null,8,["icon"])]),o(V)?(h(),N("div",Ft,[l(je,{"is-show-physical-goods-checkbox":!1,"is-loading":o(M),"shipping-info":o(r).shippingRates,onUpdateShippingRates:Fe},null,8,["is-loading","shipping-info"]),l(u,{ui:{header:{base:"flex justify-between items-center"},body:{padding:"",base:"space-y-8"}}},{header:s(()=>[Ot,p("div",Vt,[l(_,{modelValue:o(y),"onUpdate:modelValue":e[6]||(e[6]=a=>x(y)?y.value=a:null),class:"font-mono",placeholder:"like1..."},null,8,["modelValue"]),l(f,{label:"Add",variant:o(y)?"outline":"solid",color:o(y)?"primary":"gray",disabled:!o(y),onClick:Ie},null,8,["variant","color","disabled"])])]),default:s(()=>[l(m,{columns:o(De),rows:o(Ne)},{"wallet-data":s(({row:a})=>[l(ne,{text:a.wallet},{default:s(()=>[l(f,{class:"font-mono",label:a.shortenWallet,to:a.walletLink,variant:"link",padded:!1,size:"xs"},null,8,["label","to"])]),_:2},1032,["text"])]),"authz-data":s(({row:a})=>[l(f,{label:a.grantLabel,to:a.grantRoute,variant:a.isGranted?"outline":"solid",color:"green"},null,8,["label","to","variant"])]),"remove-data":s(({row:a})=>[p("div",zt,[l(f,{icon:"i-heroicons-x-mark",variant:"soft",color:"red",onClick:()=>o(w).splice(a.index,1)},null,8,["onClick"])])]),_:1},8,["columns","rows"])]),_:1}),l(u,{ui:{body:{base:"space-y-4"}}},{header:s(()=>[jt]),default:s(()=>[p("div",null,[l(Ge,{modelValue:o(I),"onUpdate:modelValue":e[7]||(e[7]=a=>x(I)?I.value=a:null)},null,8,["modelValue"]),X(" Use "+D(o(I)?"Liker Land":"Stripe")+" Purchase Link ",1)]),l(se,{label:"Sales channel for this link",hint:"Optional"},{default:s(()=>[l(_,{modelValue:o(U),"onUpdate:modelValue":e[8]||(e[8]=a=>x(U)?U.value=a:null),placeholder:"Channel ID"},null,8,["modelValue"])]),_:1}),l(f,{class:"font-mono break-all",label:`${o(j)}`,to:o(j),variant:"outline",color:"gray",target:"_blank"},null,8,["label","to"]),Gt,l(f,{label:"Copy Purchase Link",variant:"outline",color:"primary",onClick:Oe}),l(qe,{data:o(j),"file-name":`collection-${o(oe)}-channel_${o(U)||""}`,width:500,height:500},{header:s(()=>[qt]),_:1},8,["data","file-name"])]),_:1})])):P("",!0)]),_:1}),l(f,{label:"Save Changes",loading:o(C),size:"lg",disabled:o(C),onClick:We},null,8,["loading","disabled"])],64)):P("",!0),l(He,{transition:!1})]),_:1})}}});export{da as default};
//# sourceMappingURL=_collectionId_.0846bd03.js.map