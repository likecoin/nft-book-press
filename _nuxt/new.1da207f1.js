import{_ as Fe}from"./Alert.8bdec41a.js";import{_ as Me}from"./Progress.9d72182d.js";import{_ as ze,a as Be}from"./Table.1a14edc7.js";import{_ as Le}from"./Input.40089d50.js";import{g as $e,h as Oe,i as je,s as Ge,k as qe,j as We,r as s,a4 as He,n as H,m as Ze,q as re,o as w,c as Z,v as e,x as K,y as D,w as a,d as I,F as Ke,b as o,a as i,z as f,J as Je,a5 as Qe,E as Xe,G as Ye,a6 as eo,a7 as R,a8 as oo,a9 as lo,p as to,f as ao,R as no,S as so,aa as io,_ as ro}from"./entry.4f29fb51.js";import{_ as uo}from"./FormGroup.2d5f6b71.js";import{j as co,p as mo,_ as po,a as fo,u as ue,b as ho,c as _o,d as bo,e as vo}from"./purify.es.fc6c5dd1.js";import{_ as go}from"./RateTable.vue.0178ec70.js";import{u as yo,_ as wo}from"./StripeConnectCard.vue.0637bd7e.js";import{u as ko}from"./nft.4f0a35d4.js";import{u as xo}from"./collection.976b750c.js";import"./uid.461d515f.js";import"./punycode.6230297d.js";import"./Modal.32c300cc.js";import"./v4.a960c1f4.js";import"./use-controllable.e942bb26.js";const u=F=>(to("data-v-a6dc4ffe"),F=F(),ao(),F),Vo={class:"space-y-4"},Co=u(()=>i("h2",{class:"font-bold font-mono"}," Collection Info ",-1)),So={class:"flex items-start gap-[12px] w-full px-[12px] mb-[12px]"},Uo=u(()=>i("h3",{class:"font-bold font-mono"}," Pricing and Availability ",-1)),Po=u(()=>i("img",{src:ho,class:"object-cover",alt:""},null,-1)),Io=u(()=>i("img",{src:_o,class:"object-cover",alt:""},null,-1)),To=u(()=>i("h3",{class:"font-bold font-mono"}," Product Information ",-1)),No=u(()=>i("img",{src:bo,class:"object-cover",alt:""},null,-1)),Ao=u(()=>i("span",{class:"block text-[14px] text-[#374151] mt-[8px]"},"Description (Optional)",-1)),Eo=u(()=>i("img",{src:vo,class:"object-cover",alt:""},null,-1)),Do=u(()=>i("span",{class:"block text-[14px] text-[#374151] mt-[8px]"},"描述 (選填)",-1)),Ro=["src"],Fo=u(()=>i("h4",{class:"text-sm font-bold font-mono"}," Email to receive sales notifications ",-1)),Mo={class:"flex gap-2"},zo={class:"flex justify-end items-center"},Bo={class:"flex justify-between items-center w-full"},Lo=u(()=>i("h3",{class:"font-bold font-mono"}," Advanced Settings ",-1)),$o={key:0,class:"mt-[24px] flex flex-col gap-[12px]"},Oo=u(()=>i("h3",{class:"font-bold font-mono"}," Default Currency ",-1)),jo=u(()=>i("span",{class:"text-[14px] text-gray-500"}," (Includes physical good that requires shipping) ",-1)),Go=u(()=>i("h4",{class:"text-sm font-bold font-mono"}," Share sales data to wallets ",-1)),qo={class:"flex gap-2"},Wo={class:"flex justify-end items-center"},Ho=u(()=>i("h3",{class:"font-bold font-mono"}," DRM Options ",-1)),Zo={class:"grid md:grid-cols-2 gap-4"},Ko=$e({__name:"new",setup(F){const ee=Oe(),de=je(),ce=xo(),me=ko(),pe=yo(),{wallet:g,signer:J}=Ge(ee),{connect:fe}=ee,{newNFTBookCollection:he}=ce,{getClassMetadataById:_e,lazyFetchClassMetadataById:be}=me,{fetchStripeConnectStatus:ve,stripeConnectStatusWalletMap:oe}=pe,ge=qe(),ye=We(),T=s(""),y=s(!1),le=s({en:"Collection description in English...",zh:"套裝中文描述..."}),M=s("New Book Collection Name"),z=s("新書集名稱"),B=s(""),L=s(""),S=s(""),k=s(""),U=s([]),r=s({price:He,stock:Number(ye.query.count||1),hasShipping:!1,isPhysicalOnly:!1,isAllowCustomPrice:!0,deliveryMethod:"auto",autoMemo:"Thank you for your support. It means a lot to me."}),P=s([]),N=s([]),Q=s({}),$=s([]),_=s(""),b=s(""),O=s(!0),j=s(!1),G=s(!1),A=s(!1),E=s(""),X=s(!1),Y=s(!0),te=["bold","italic","strikeThrough","title","-","unorderedList","orderedList","-","code","link","=","preview"],we=H(()=>"Submit"),ke=H(()=>[{key:"wallet",label:"Wallet",sortable:!0},{key:"authz",label:"Send NFT Grant",sortable:!1},{key:"remove",label:"",sortable:!1}]),xe=H(()=>N.value.map((n,l)=>{const v=!!Q.value[n];return{index:l,wallet:n,walletLink:Je(n),isGranted:v,grantLabel:v?"Granted":"Grant",grantRoute:{name:"authz",query:{grantee:n}}}})),Ve=H(()=>$.value.map((n,l)=>({index:l,email:n})));co({markdownItConfig(n){n.options.html=!1}}),Ze(async()=>{var n;try{y.value=!0,await ve(g.value),(n=oe[g.value])!=null&&n.isReady&&(A.value=!0,E.value=g.value)}catch(l){console.error(l)}finally{y.value=!1}}),re(y,n=>{n&&(T.value="")}),re(N,n=>{n==null||n.forEach(async l=>{if(!Q.value[l])try{Q.value[l]=await Qe(g.value,l)}catch{}})});function Ce(n){Number(n.data)===0&&(r.value.isAllowCustomPrice=!0)}function Se(){U.value.push(k.value),be(k.value),k.value=""}function Ue(n){P.value=n}function Pe(){_.value&&(N.value.push(_.value),_.value="")}function Ie(){b.value&&($.value.push(b.value),b.value="")}function Te(n){E.value=n,X.value=!0}function Ne(n){return{priceInDecimal:Math.round(Number(n.price)*100),stock:Number(n.stock),hasShipping:!!(n.hasShipping||P.value.length),isPhysicalOnly:!!n.isPhysicalOnly,isAllowCustomPrice:!!(n.isAllowCustomPrice??!0),isAutoDeliver:!n.isPhysicalOnly&&n.deliveryMethod==="auto",autoMemo:n.autoMemo}}function ae(n=""){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ne(n){return mo.sanitize(n)}async function Ae(){try{if(k.value)throw new Error('Please press "Add" button to add NFT class ID');if(!U.value.length)throw new Error('Please press "Add" button to add NFT class ID');if(_.value)throw new Error('Please press "Add" button to add moderator wallet');if(b.value)throw new Error('Please press "Add" button to add notification email');if(y.value=!0,await Promise.all(U.value.map(async h=>{var c,W,x,V,C;const{data:m,error:d}=await no(`${so}/cosmos/nft/v1beta1/classes/${h}`,"$dGveLzPbKm");if(d.value&&((c=d.value)==null?void 0:c.statusCode)!==404)throw new Error(d.value.toString());const p=((C=(V=(x=(W=m==null?void 0:m.value)==null?void 0:W.class)==null?void 0:x.data)==null?void 0:V.metadata)==null?void 0:C.nft_meta_collection_id)||"";if(!p.includes("nft_book")&&!p.includes("book_nft"))throw new Error("NFT Class not in NFT BOOK meta collection")})),Number(r.value.price)!==0&&r.value.price<R)throw new Error(`Price of each edition must be at least $${R} or $0 (free)`);const n=A.value&&E.value?{[E.value]:100}:null,l=P.value.length?P.value.map(h=>({name:{en:h.nameEn,zh:h.nameZh},priceInDecimal:Math.round(Number(h.price)*100),price:Number(h.price)})):void 0,v=Ne(r.value);let q;if(v.isAutoDeliver){if(!confirm(`NFT Book Press - Reminder
Once you choose automatic delivery, you can't switch it back to manual delivery. Are you sure?`))return;if(v.stock>0){if((!g.value||!J.value)&&await fe(),!g.value||!J.value)throw new Error("Unable to connect to wallet");q=await io(U.value,v.stock,J.value,g.value)}}await he({classIds:U.value,defaultPaymentCurrency:"USD",connectedWallets:n,moderatorWallets:N,notificationEmails:$,shippingRates:l,name:{en:M.value,zh:z.value},description:{en:ae(B.value),zh:ae(L.value)},image:S.value,hideDownload:j,mustClaimToView:O,autoDeliverNFTsTxHash:q,...v}),ge.push({name:"nft-book-store-collection"})}catch(n){const l=n.data||n;console.error(l),T.value=l}finally{X.value=!1,y.value=!1}}function Ee(){return Ae()}return(n,l)=>{const v=Fe,q=Me,h=ze,m=Le,d=Xe,p=Ye,c=uo,W=po,x=eo,V=fo,C=Be,se=go,De=wo;return w(),Z("div",Vo,[e(T)?(w(),K(v,{key:0,icon:"i-heroicons-exclamation-triangle",color:"red",variant:"soft",title:`${e(T)}`,"close-button":{icon:"i-heroicons-x-mark-20-solid",color:"red",variant:"link",padded:!1},onClose:l[0]||(l[0]=t=>T.value="")},null,8,["title"])):D("",!0),e(y)?(w(),K(q,{key:1,animation:"carousel"},{indicator:a(()=>[I(" Loading... ")]),_:1})):D("",!0),e(de).isAuthenticated?(w(),Z(Ke,{key:2},[o(p,{ui:{body:{base:"space-y-4"}}},{header:a(()=>[Co]),default:a(()=>[o(c,{label:"Books in Collection"},{default:a(()=>[o(p,{ui:{body:{padding:""}}},{default:a(()=>[o(h,{columns:[{key:"classId",label:"Class ID"},{key:"name",label:"Book Name"}],rows:e(U).map((t,Re)=>{var ie;return{index:Re,classId:t,name:(ie=e(_e)(t))==null?void 0:ie.name}})},null,8,["rows"]),i("div",So,[o(m,{modelValue:e(k),"onUpdate:modelValue":l[1]||(l[1]=t=>f(k)?k.value=t:null),class:"font-mono w-full",placeholder:"likenft...."},null,8,["modelValue"]),o(d,{onClick:Se},{default:a(()=>[I(" Add ")]),_:1})])]),_:1})]),_:1}),o(c,{label:"Total number of packages available for sale"},{default:a(()=>[o(m,{modelValue:e(r).stock,"onUpdate:modelValue":l[2]||(l[2]=t=>e(r).stock=t),type:"number",step:"0.01",min:e(R)},null,8,["modelValue","min"])]),_:1})]),_:1}),o(p,{ui:{body:{base:"flex flex-col gap-[20px]"},base:"overflow-visible"}},{header:a(()=>[Uo]),default:a(()=>[o(c,{label:`Price(USD) of this collection (Minimal ${e(R)} or $0 (free))`},{default:a(()=>[o(m,{modelValue:e(r).price,"onUpdate:modelValue":l[3]||(l[3]=t=>e(r).price=t),type:"number",step:"0.01",min:e(R),onInput:Ce},null,8,["modelValue","min"])]),_:1},8,["label"]),o(W,{modelValue:e(r).deliveryMethod,"onUpdate:modelValue":l[4]||(l[4]=t=>e(r).deliveryMethod=t),disabled:e(r).isPhysicalOnly,legend:"Delivery method of this collection",options:e(oo)},null,8,["modelValue","disabled","options"]),e(r).deliveryMethod==="auto"?(w(),K(c,{key:0},{label:a(()=>[I(" Memo of this collection "),o(V,null,{image:a(()=>[Po]),default:a(()=>[o(x,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[o(m,{modelValue:e(r).autoMemo,"onUpdate:modelValue":l[5]||(l[5]=t=>e(r).autoMemo=t)},null,8,["modelValue"])]),_:1})):(w(),K(c,{key:1,label:"Is Physical only good",ui:{label:{base:"font-mono font-bold"}}},{default:a(()=>[o(C,{modelValue:e(r).isPhysicalOnly,"onUpdate:modelValue":l[6]||(l[6]=t=>e(r).isPhysicalOnly=t),name:"isPhysicalOnly",label:"This collection does not contain any digital file/NFT"},null,8,["modelValue"])]),_:1})),o(c,null,{label:a(()=>[I(" Allow custom price "),o(V,{"image-style":{width:"300px"}},{image:a(()=>[Io]),default:a(()=>[o(x,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[o(C,{modelValue:e(r).isAllowCustomPrice,"onUpdate:modelValue":l[7]||(l[7]=t=>e(r).isAllowCustomPrice=t),name:"isAllowCustomPrice",label:"Allow user to pay more than defined price"},null,8,["modelValue"])]),_:1})]),_:1}),o(p,{ui:{body:{base:"flex flex-col gap-[20px]"},base:"overflow-visible"}},{header:a(()=>[To]),default:a(()=>[o(c,{label:"Product Name",ui:{container:"space-y-2"}},{label:a(()=>[I(" Product Name "),o(V,{"image-style":{width:"250px"}},{image:a(()=>[No]),default:a(()=>[o(x,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[o(m,{modelValue:e(M),"onUpdate:modelValue":l[8]||(l[8]=t=>f(M)?M.value=t:null),placeholder:"Product name in English"},null,8,["modelValue"]),Ao,o(e(ue),{modelValue:e(B),"onUpdate:modelValue":l[9]||(l[9]=t=>f(B)?B.value=t:null),language:"en-US","editor-id":"en",placeholder:e(le).en,toolbars:te,sanitize:ne,style:{height:"200px",width:"100%",marginTop:"0px"}},null,8,["modelValue","placeholder"])]),_:1}),o(c,{ui:{container:"space-y-2 my-[20px]"}},{label:a(()=>[I(" 產品名稱 "),o(V,{"image-style":{width:"250px"}},{image:a(()=>[Eo]),default:a(()=>[o(x,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[o(m,{modelValue:e(z),"onUpdate:modelValue":l[10]||(l[10]=t=>f(z)?z.value=t:null),placeholder:"產品中文名字"},null,8,["modelValue"]),Do,o(e(ue),{modelValue:e(L),"onUpdate:modelValue":l[11]||(l[11]=t=>f(L)?L.value=t:null),language:"en-US","editor-id":"zh",placeholder:e(le).zh,toolbars:te,sanitize:ne,style:{height:"200px",width:"100%",marginTop:"0px"}},null,8,["modelValue","placeholder"])]),_:1}),o(c,{label:"Image of this book collection",ui:{container:"space-y-2"}},{default:a(()=>[o(m,{modelValue:e(S),"onUpdate:modelValue":l[12]||(l[12]=t=>f(S)?S.value=t:null),class:"font-mono",placeholder:"https://, ar://, ipfs://...."},null,8,["modelValue"]),e(S)?(w(),Z("img",{key:0,src:("parseImageURLFromMetadata"in n?n.parseImageURLFromMetadata:e(lo))(e(S)),class:"w-1/3"},null,8,Ro)):D("",!0)]),_:1}),o(se,{modelValue:e(r).hasShipping,"onUpdate:modelValue":l[13]||(l[13]=t=>e(r).hasShipping=t),"is-show-physical-goods-checkbox":!0,"is-show-setting-modal-button":!0,"shipping-info":e(P)},null,8,["modelValue","shipping-info"])]),_:1}),o(De,{"is-stripe-connect-checked":e(A),"onUpdate:isStripeConnectChecked":l[14]||(l[14]=t=>f(A)?A.value=t:null),"is-using-default-account":e(Y),"onUpdate:isUsingDefaultAccount":l[15]||(l[15]=t=>f(Y)?Y.value=t:null),"stripe-connect-wallet":e(E),"stripe-connect-status-wallet-map":e(oe),"should-disable-setting":e(X),"login-address":e(g),onSave:Te},null,8,["is-stripe-connect-checked","is-using-default-account","stripe-connect-wallet","stripe-connect-status-wallet-map","should-disable-setting","login-address"]),o(p,{ui:{header:{base:"flex justify-between items-center"},body:{padding:""}}},{header:a(()=>[Fo,i("div",Mo,[o(m,{modelValue:e(b),"onUpdate:modelValue":l[16]||(l[16]=t=>f(b)?b.value=t:null),placeholder:"abc@example.com"},null,8,["modelValue"]),o(d,{label:"Add",variant:e(b)?"outline":"solid",color:e(b)?"primary":"gray",disabled:!e(b),onClick:Ie},null,8,["variant","color","disabled"])])]),default:a(()=>[o(h,{columns:[{key:"email",label:"Email",sortable:!0},{key:"action"}],rows:e(Ve)},{"email-data":a(({row:t})=>[o(d,{label:t.email,to:`mailto:${t.email}`,variant:"link",padded:!1},null,8,["label","to"])]),"action-data":a(({row:t})=>[i("div",zo,[o(d,{icon:"i-heroicons-x-mark",variant:"soft",color:"red",onClick:()=>e($).splice(t.index,1)},null,8,["onClick"])])]),_:1},8,["rows"])]),_:1}),o(p,{ui:{header:{base:"flex justify-between items-center"},body:{padding:"12px"}}},{default:a(()=>[i("div",Bo,[Lo,o(d,{color:"gray",variant:"ghost",icon:e(G)?"i-heroicons-chevron-up":"i-heroicons-chevron-down",onClick:l[17]||(l[17]=()=>{G.value=!e(G)})},null,8,["icon"])]),e(G)?(w(),Z("div",$o,[o(p,{ui:{header:{base:"flex justify-between items-center gap-2"}}},{header:a(()=>[Oo]),_:1}),o(se,{"is-show-physical-goods-checkbox":!1,"shipping-info":e(P),"is-show-setting-modal-button":!0,onUpdateShippingRates:Ue},{header:a(()=>[jo]),_:1},8,["shipping-info"]),o(p,{ui:{header:{base:"flex justify-between items-center"},body:{padding:"",base:"space-y-8"}}},{header:a(()=>[Go,i("div",qo,[o(m,{modelValue:e(_),"onUpdate:modelValue":l[18]||(l[18]=t=>f(_)?_.value=t:null),class:"font-mono",placeholder:"like1..."},null,8,["modelValue"]),o(d,{label:"Add",variant:e(_)?"outline":"solid",color:e(_)?"primary":"gray",disabled:!e(_),onClick:Pe},null,8,["variant","color","disabled"])])]),default:a(()=>[o(h,{columns:e(ke),rows:e(xe)},{"wallet-data":a(({row:t})=>[o(d,{class:"font-mono",label:t.wallet,to:t.walletLink,variant:"link",padded:!1},null,8,["label","to"])]),"authz-data":a(({row:t})=>[o(d,{label:t.grantLabel,to:t.grantRoute,variant:t.isGranted?"outline":"solid",color:"green"},null,8,["label","to","variant"])]),"remove-data":a(({row:t})=>[i("div",Wo,[o(d,{icon:"i-heroicons-x-mark",variant:"soft",color:"red",onClick:()=>e(N).splice(t.index,1)},null,8,["onClick"])])]),_:1},8,["columns","rows"])]),_:1}),o(p,{ui:{body:{base:"space-y-8"}}},{header:a(()=>[Ho]),default:a(()=>[i("div",Zo,[o(c,{label:"Force NFT claim before view",ui:{label:{base:"font-mono font-bold"}}},{default:a(()=>[o(C,{modelValue:e(O),"onUpdate:modelValue":l[19]||(l[19]=t=>f(O)?O.value=t:null),name:"mustClaimToView",label:"Must claim NFT to view"},null,8,["modelValue"])]),_:1}),o(c,{label:"Disable File Download",ui:{label:{base:"font-mono font-bold"}}},{default:a(()=>[o(C,{modelValue:e(j),"onUpdate:modelValue":l[20]||(l[20]=t=>f(j)?j.value=t:null),name:"hideDownload",label:"Disable Download"},null,8,["modelValue"])]),_:1})])]),_:1})])):D("",!0)]),_:1}),o(d,{label:e(we),loading:e(y),size:"lg",disabled:e(y),onClick:Ee},null,8,["label","loading","disabled"])],64)):D("",!0)])}}});const ml=ro(Ko,[["__scopeId","data-v-a6dc4ffe"]]);export{ml as default};