import{g as he,O as be,s as ge,j as ye,i as ke,k as xe,r as s,l as oe,m as we,n as Ie,o as S,c as le,b as o,w as a,x as l,v as q,d as D,B as ae,y as c,a as m,am as Ve,I as Ue,V as Pe,J as Ce,aj as Te,M as Ne,ak as Se,al as De}from"./entry.332b1c56.js";import{_ as Re}from"./Input.69712f94.js";import{_ as Ee}from"./FormGroup.d137d318.js";import{_ as Me,a as Ae}from"./Table.8893d7c8.js";import{_ as Be}from"./RadioGroup.e060d4c7.js";import{j as Fe,a as ze,b as Le,c as je,d as Oe,p as $e,_ as qe,u as te}from"./purify.es.c3bbd445.js";import{_ as He}from"./RateTable.vue.648b454d.js";import{D as Ge,M as B}from"./index.0c152690.js";import{u as We}from"./collection.8cc79778.js";import{u as Ze}from"./nft.4e2a5a49.js";import"./useFormGroup.61d943f9.js";import"./Radio.dc8e2d0e.js";import"./punycode.f9acf74d.js";import"./Alert.f13a4f9e.js";import"./v4.b87601ea.js";(function(){try{var k=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},p=new Error().stack;p&&(k._sentryDebugIds=k._sentryDebugIds||{},k._sentryDebugIds[p]="f0be0ea8-ff64-4689-8684-95bbee21cd68",k._sentryDebugIdIdentifier="sentry-dbid-f0be0ea8-ff64-4689-8684-95bbee21cd68")}catch{}})();const Je=m("h2",{class:"font-bold font-mono"}," Edit collection info ",-1),Ke=m("h2",{class:"font-bold font-mono"}," Class Info ",-1),Qe=m("h3",{class:"font-bold font-mono"}," Pricing and Availability ",-1),Xe=m("img",{src:ze,class:"object-cover",alt:""},null,-1),Ye=m("img",{src:Le,class:"object-cover",alt:""},null,-1),eo=m("h3",{class:"font-bold font-mono"}," Product Information ",-1),oo=m("img",{src:je,class:"object-cover",alt:""},null,-1),lo=m("span",{class:"block text-[14px] text-[#374151] mt-[8px]"},"Description (Optional)",-1),ao=m("img",{src:Oe,class:"object-cover",alt:""},null,-1),to=m("span",{class:"block text-[14px] text-[#374151] mt-[8px]"},"描述 (選填)",-1),no=["src"],xo=he({__name:"edit",setup(k){const p=We(),H=Ze(),G=be(),{connect:ne}=G,{wallet:F,signer:z}=ge(G),W=ye(),se=ke(),L=xe(),f=s(se.params.collectionId),v=s(!1),i=s({}),R=s([]),_=s(Ge),x=s(1),w=s("auto"),I=s("Thanks for purchasing this NFT ebook."),V=s("Standard Edition"),U=s("標準版"),P=s(""),C=s(""),h=s(""),T=s(!1),y=s(!0),b=s(!1),j=s([]),O=s(!1),$=s(0),E=s(!1),Z=s(["bold","italic","strikeThrough","title","-","unorderedList","orderedList","-","code","link","=","preview"]),J=s({en:"Product description in English...",zh:"產品中文描述..."}),K=oe(()=>w.value==="auto"),ie=oe(()=>E.value?$.value:0),{getClassMetadataById:ue}=H;Fe({markdownItConfig(t){t.options.html=!1}}),we(_,(t,e)=>{Number(e)!==0&&Number(t)===0&&(y.value=!0)}),Ie(async()=>{var t,e,u,g;try{v.value=!0,i.value=(await p.fetchCollectionById(f.value)).value;const r=i.value.typePayload;r&&(i.value={...i.value,...r}),R.value=i.value.classIds||[],_.value=i.value.priceInDecimal/100||0,x.value=i.value.stock||0,V.value=((t=i.value.name)==null?void 0:t.en)||"",U.value=((e=i.value.name)==null?void 0:e.zh)||"",h.value=i.value.image||"",P.value=((u=i.value.description)==null?void 0:u.en)||" ",C.value=((g=i.value.description)==null?void 0:g.zh)||" ",T.value=i.value.hasShipping||!1,j.value=i.value.shippingRates||[],b.value=i.value.isPhysicalOnly||!1,y.value=i.value.isAllowCustomPrice||!1,w.value=i.value.isAutoDeliver?"auto":"manual",I.value=i.value.autoMemo||"",$.value=i.value.stock,E.value=i.value.isAutoDeliver}catch(r){console.error(r),L.add({icon:"i-heroicons-exclamation-circle",title:r.toString(),timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{v.value=!1}});function Q(t=""){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function X(t){return $e.sanitize(t)}function re(){W.push({name:"nft-book-store-collection-status-collectionId",params:{collectionId:f.value}})}async function ce(t){var e;O.value=!0;try{await p.updateNFTBookCollectionById(f.value,{shippingRates:t});const u=(await p.fetchCollectionById(f.value)).value;j.value=(e=u==null?void 0:u.typePayload)==null?void 0:e.shippingRates}catch(u){const g=u.data||u;console.error(g),L.add({icon:"i-heroicons-exclamation-circle",title:g,timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{O.value=!1}}async function de(){try{const t={classIds:R.value,name:{en:V.value,zh:U.value},description:{en:Q(P.value),zh:Q(C.value)},image:h.value,priceInDecimal:Math.round(Number(_.value)*100),price:Number(_.value),stock:Number(x.value),isAutoDeliver:!b.value&&K.value,autoMemo:I.value||"",hasShipping:T.value||!1,isPhysicalOnly:b.value||!1,isAllowCustomPrice:y.value??!0};if(!t||t.price===void 0)throw new Error("Please input price of edition");if(t.price!==0&&t.price<B)throw new Error(`Price of each edition must be at least $${B} or $0 (free)`);if(!t.stock&&t.stock!==0)throw new Error("Please input stock of edition");if(t.stock<0)throw new Error("Stock cannot be negative");if(!t.name.en||!t.name.zh)throw new Error("Please input product name");v.value=!0;let e=0;t.isAutoDeliver&&(e=E.value?t.stock-$.value:t.stock);let u;if(e>0){if((!F.value||!z.value)&&await ne(),!F.value||!z.value)throw new Error("Unable to connect to wallet");u=await Ve(R.value,e,z.value,F.value)}await p.updateNFTBookCollectionById(f.value,{autoDeliverNFTsTxHash:u,...t}),W.push({name:"nft-book-store-collection-status-collectionId",params:{collectionId:f.value}})}catch(t){const e=t.data||t;console.error(e),L.add({icon:"i-heroicons-exclamation-circle",title:e,timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{v.value=!1}}return(t,e)=>{const u=Ue,g=Pe,r=Re,d=Ee,me=Me,N=Ce,pe=Be,M=Te,A=qe,Y=Ae,fe=He,ve=Ne;return S(),le("div",null,[o(ve,{"model-value":!0,ui:{width:"sm:max-w-7xl"}},{default:a(()=>[o(N,{ui:{header:{base:"flex justify-between items-center"},body:{base:"space-y-4"},footer:{base:"flex justify-end items-center"}}},{header:a(()=>[Je,o(u,{color:"gray",variant:"ghost",icon:"i-heroicons-x-mark-20-solid",class:"-my-1",onClick:re})]),footer:a(()=>[o(u,{label:"Save Changes",loading:l(v),size:"lg",disabled:l(v),onClick:de},null,8,["loading","disabled"])]),default:a(()=>[l(v)?(S(),q(g,{key:0,animation:"carousel"},{indicator:a(()=>[D(" Loading... ")]),_:1})):ae("",!0),o(N,{ui:{body:{base:"space-y-4"}}},{header:a(()=>[Ke]),default:a(()=>[o(d,{label:"NFT collection ID"},{default:a(()=>[o(r,{class:"font-mono",value:l(f),readonly:!0,disabled:!0},null,8,["value"])]),_:1}),o(d,{label:"Books in Collection"},{default:a(()=>[o(N,{ui:{body:{padding:""}}},{default:a(()=>[o(me,{columns:[{key:"classId",label:"Class ID"},{key:"name",label:"Book Name"}],rows:l(R).map((n,_e)=>{var ee;return{index:_e,classId:n,name:(ee=l(ue)(n))==null?void 0:ee.name}})},null,8,["rows"])]),_:1})]),_:1})]),_:1}),o(N,{ui:{body:{base:"flex flex-col gap-[20px]"},base:"overflow-visible"}},{header:a(()=>[Qe]),default:a(()=>[o(d,{label:`Price(USD) of this collection (Minimal ${l(B)} or $0 (free))`},{default:a(()=>[o(r,{modelValue:l(_),"onUpdate:modelValue":e[0]||(e[0]=n=>c(_)?_.value=n:null),type:"number",step:"0.01",min:l(B)},null,8,["modelValue","min"])]),_:1},8,["label"]),o(d,{label:"Total number of NFT for sale of this collection"},{default:a(()=>[o(r,{modelValue:l(x),"onUpdate:modelValue":e[1]||(e[1]=n=>c(x)?x.value=n:null),type:"number",step:"1",min:l(ie)},null,8,["modelValue","min"])]),_:1}),o(pe,{modelValue:l(w),"onUpdate:modelValue":e[2]||(e[2]=n=>c(w)?w.value=n:null),disabled:l(E)||l(b),legend:"Delivery method of this collection",options:l(Se)},null,8,["modelValue","disabled","options"]),l(K)?(S(),q(d,{key:0},{label:a(()=>[D(" Memo of this collection "),o(A,null,{image:a(()=>[Xe]),default:a(()=>[o(M,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[o(r,{modelValue:l(I),"onUpdate:modelValue":e[3]||(e[3]=n=>c(I)?I.value=n:null)},null,8,["modelValue"])]),_:1})):(S(),q(d,{key:1,label:"Is Physical only good",ui:{label:{base:"font-mono font-bold"}}},{default:a(()=>[o(Y,{modelValue:l(b),"onUpdate:modelValue":e[4]||(e[4]=n=>c(b)?b.value=n:null),name:"isPhysicalOnly",label:"This collection does not contain any digital file/NFT"},null,8,["modelValue"])]),_:1})),o(d,null,{label:a(()=>[D(" Allow custom price "),o(A,{"image-style":{width:"300px"}},{image:a(()=>[Ye]),default:a(()=>[o(M,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[o(Y,{modelValue:l(y),"onUpdate:modelValue":e[5]||(e[5]=n=>c(y)?y.value=n:null),name:"isAllowCustomPrice",label:"Allow user to pay more than defined price"},null,8,["modelValue"])]),_:1})]),_:1}),o(N,{ui:{body:{base:"flex flex-col gap-[20px]"},base:"overflow-visible"}},{header:a(()=>[eo]),default:a(()=>[o(d,{label:"Product Name",ui:{container:"space-y-2"}},{label:a(()=>[D(" Product Name "),o(A,{"image-style":{width:"250px"}},{image:a(()=>[oo]),default:a(()=>[o(M,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[o(r,{modelValue:l(V),"onUpdate:modelValue":e[6]||(e[6]=n=>c(V)?V.value=n:null),placeholder:"Product name in English"},null,8,["modelValue"]),lo,o(l(te),{modelValue:l(P),"onUpdate:modelValue":e[7]||(e[7]=n=>c(P)?P.value=n:null),language:"en-US","editor-id":"en",placeholder:l(J).en,toolbars:l(Z),sanitize:X,style:{height:"200px",width:"100%",marginTop:"0px"}},null,8,["modelValue","placeholder","toolbars"])]),_:1}),o(d,{ui:{container:"space-y-2 my-[20px]"}},{label:a(()=>[D(" 產品名稱 "),o(A,{"image-style":{width:"250px"}},{image:a(()=>[ao]),default:a(()=>[o(M,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[o(r,{modelValue:l(U),"onUpdate:modelValue":e[8]||(e[8]=n=>c(U)?U.value=n:null),placeholder:"產品中文名字"},null,8,["modelValue"]),to,o(l(te),{modelValue:l(C),"onUpdate:modelValue":e[9]||(e[9]=n=>c(C)?C.value=n:null),language:"en-US","editor-id":"zh",placeholder:l(J).zh,toolbars:l(Z),sanitize:X,style:{height:"200px",width:"100%",marginTop:"0px"}},null,8,["modelValue","placeholder","toolbars"])]),_:1}),o(d,{label:"Image of this book collection",ui:{container:"space-y-2"}},{default:a(()=>[o(r,{modelValue:l(h),"onUpdate:modelValue":e[10]||(e[10]=n=>c(h)?h.value=n:null),class:"font-mono",placeholder:"https://, ar://, ipfs://...."},null,8,["modelValue"]),l(h)?(S(),le("img",{key:0,src:("parseImageURLFromMetadata"in t?t.parseImageURLFromMetadata:l(De))(l(h)),class:"w-1/3"},null,8,no)):ae("",!0)]),_:1})]),_:1}),o(fe,{modelValue:l(T),"onUpdate:modelValue":e[11]||(e[11]=n=>c(T)?T.value=n:null),"is-show-physical-goods-checkbox":!0,"shipping-info":l(j),"is-loading":l(O),onUpdateShippingRates:ce},null,8,["modelValue","shipping-info","is-loading"])]),_:1})]),_:1})])}}});export{xo as default};
//# sourceMappingURL=edit.72289a3f.js.map