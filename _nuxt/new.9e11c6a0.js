import{g as pe,h as fe,s as X,j as _e,i as he,ae as ve,r as i,l as F,m as be,k as ge,a7 as Y,o as N,c as xe,b as t,w as a,a as u,t as J,n as l,q as O,d as v,v as ye,x as r,a1 as ke,a5 as C,ba as we,C as Ve,D as Pe,a4 as Ue,b9 as Ie}from"./entry.87a04d2e.js";import{_ as Te}from"./Progress.b8763a00.js";import{_ as Se}from"./Input.522a78ce.js";import{_ as Ee}from"./FormGroup.4a035116.js";import{_ as Ne,a as Ce}from"./memo.bd12e4e1.js";import{j as $e,a as Ae,b as Re,c as Me,p as ze,_ as De,u as ee}from"./purify.es.f803d229.js";import{a as Fe}from"./Table.59f0cd3a.js";import{_ as Oe}from"./RateTable.vue.e5ae86fa.js";import{_ as Be}from"./Modal.3095628c.js";import{u as oe}from"./fetch.807d72f6.js";import{u as Le}from"./book-store-api.fc7886ee.js";import"./uid.4a8cc4bb.js";import"./Radio.02cf86c0.js";import"./punycode.0e025d3c.js";import"./Alert.2ddbcf28.js";import"./v4.a960c1f4.js";const je={class:"font-bold font-mono"},qe=u("h2",{class:"font-bold font-mono"}," Class Info ",-1),We=u("h3",{class:"font-bold font-mono"}," Pricing and Availability ",-1),Ge=u("img",{src:Ne,class:"object-cover",alt:""},null,-1),He=u("img",{src:Ae,class:"object-cover",alt:""},null,-1),Ke=u("h3",{class:"font-bold font-mono"}," Product Information ",-1),Qe=u("img",{src:Re,class:"object-cover",alt:""},null,-1),Ze=u("span",{class:"block text-[14px] text-[#374151] mt-[8px]"},"Description (Optional)",-1),Xe=u("img",{src:Me,class:"object-cover",alt:""},null,-1),Ye=u("span",{class:"block text-[14px] text-[#374151] mt-[8px]"},"描述 (選填)",-1),vo=pe({__name:"new",setup(Je){const B=fe(),$=Le(),{connect:te}=B,{wallet:b,signer:A}=X(B),{token:L}=X($),{updateBookListingSetting:ae}=$,j=_e(),q=he(),R=ve(),c=i(q.params.classId),le=i(q.query.priceIndex),m=i(!1),M=i({}),ne=F(()=>{var o,e;return((e=(o=M==null?void 0:M.value)==null?void 0:o.prices)==null?void 0:e.length)>1}),p=i(ke),g=i(1),f=i("auto"),W=i("Thanks for purchasing this NFT ebook."),x=i("Standard Edition"),y=i("標準版"),k=i(""),w=i(""),V=i(!1),z=i([]),P=i(!1),h=i(!1),D=i(!1),U=F(()=>ne.value?"edition":"book"),G=["bold","italic","strikeThrough","title","-","unorderedList","orderedList","-","code","link","=","preview"],H={en:"Product description in English...",zh:"產品中文描述..."},ie=F(()=>"Add Edition");$e({markdownItConfig(o){o.options.html=!1}}),be(p,(o,e)=>{Number(e)!==0&&Number(o)===0&&(h.value=!0)}),ge(async()=>{var o;try{m.value=!0;const e=await oe(`${Y}/likernft/book/store/${c.value}`,{headers:{authorization:`Bearer ${L.value}`}},"$8O7KSYQXM9"),s=(o=e==null?void 0:e.data)==null?void 0:o.value;if(s&&(z.value=s.shippingRates,(s==null?void 0:s.ownerWallet)!==b.value))throw new Error("NOT_OWNER_OF_NFT_CLASS")}catch(e){console.error(e),R.add({icon:"i-heroicons-exclamation-circle",title:e.toString(),timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{m.value=!1}});function K(o=""){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Q(o){return ze.sanitize(o)}function se(){j.push({name:"nft-book-store-status-classId",params:{classId:c.value}})}async function re(o){var e;D.value=!0;try{await ae(c.value,{shippingRates:o});const{data:s}=await oe(`${Y}/likernft/book/store/${c.value}`,{headers:{authorization:`Bearer ${L.value}`}},"$o64Gg3CnQx");z.value=((e=s.value)==null?void 0:e.shippingRates)||[]}catch(s){const I=s.data||s;console.error(I),R.add({icon:"i-heroicons-exclamation-circle",title:I,timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{D.value=!1}}async function ue(){try{const o={name:{en:x.value,zh:y.value},description:{en:K(k.value),zh:K(w.value)},priceInDecimal:Math.round(Number(p.value)*100),price:Number(p.value),stock:Number(g.value),isAutoDeliver:f.value==="auto",autoMemo:f.value==="auto"&&W.value||"",hasShipping:V.value||!1,isPhysicalOnly:P.value||!1,isAllowCustomPrice:h.value||!1};if(!o||o.price===void 0)throw new Error("Please input price of edition");if(o.price!==0&&o.price<C)throw new Error(`Price of each edition must be at least $${C} or $0 (free)`);if(!o.stock&&o.stock!==0)throw new Error("Please input stock of edition");if(o.stock<0)throw new Error("Stock cannot be negative");if(!o.name.en||!o.name.zh)throw new Error("Please input product name");if(o.isAutoDeliver&&!confirm(`NFT Book Press - Reminder
Once you choose automatic delivery, you can't switch it back to manual delivery.  Are you sure?`))return;m.value=!0;let e;if(o.isAutoDeliver&&o.stock>0){if((!b.value||!A.value)&&await te(),!b.value||!A.value)throw new Error("Unable to connect to wallet");e=await we(c.value,o.stock,A.value,b.value)}await $.addEditionPrice(c.value,le.value,{price:o,autoDeliverNFTsTxHash:e}),j.push({name:"nft-book-store-status-classId",params:{classId:c.value}})}catch(o){const e=o.data||o;console.error(e),R.add({icon:"i-heroicons-exclamation-circle",title:e,timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{m.value=!1}}return(o,e)=>{const s=Ve,I=Te,_=Se,d=Ee,T=Pe,ce=Ce,S=Ue,E=De,Z=Fe,de=Oe,me=Be;return N(),xe("div",null,[t(me,{"model-value":!0,ui:{width:"sm:max-w-7xl"}},{default:a(()=>[t(T,{ui:{header:{base:"flex justify-between items-center"},body:{base:"space-y-4"},footer:{base:"flex justify-end items-center"}}},{header:a(()=>[u("h2",je,J(l(ie)),1),t(s,{color:"gray",variant:"ghost",icon:"i-heroicons-x-mark-20-solid",class:"-my-1",onClick:se})]),footer:a(()=>[t(s,{label:"Add Edition",loading:l(m),size:"lg",disabled:l(m),onClick:ue},null,8,["loading","disabled"])]),default:a(()=>[l(m)?(N(),O(I,{key:0,animation:"carousel"},{indicator:a(()=>[v(" Loading... ")]),_:1})):ye("",!0),t(T,{ui:{body:{base:"space-y-4"}}},{header:a(()=>[qe]),default:a(()=>[t(d,{label:"NFT Class ID"},{default:a(()=>[t(_,{class:"font-mono",value:l(c),readonly:!0,disabled:!0},null,8,["value"])]),_:1})]),_:1}),t(T,{ui:{body:{base:"flex flex-col gap-[20px]"},base:"overflow-visible"}},{header:a(()=>[We]),default:a(()=>[t(d,{label:`Price(USD) of this ${l(U)} (Minimal ${l(C)} or $0 (free))`},{default:a(()=>[t(_,{modelValue:l(p),"onUpdate:modelValue":e[0]||(e[0]=n=>r(p)?p.value=n:null),type:"number",step:"0.01",min:l(C)},null,8,["modelValue","min"])]),_:1},8,["label"]),t(d,{label:`Total number of NFT for sale of this ${l(U)}`},{default:a(()=>[t(_,{modelValue:l(g),"onUpdate:modelValue":e[1]||(e[1]=n=>r(g)?g.value=n:null),type:"number",step:"1",min:0},null,8,["modelValue"])]),_:1},8,["label"]),t(ce,{modelValue:l(f),"onUpdate:modelValue":e[2]||(e[2]=n=>r(f)?f.value=n:null),legend:`Delivery method of this ${l(U)}`,options:l(Ie)},null,8,["modelValue","legend","options"]),l(f)==="auto"?(N(),O(d,{key:0},{label:a(()=>[v(J(`Memo of this ${l(U)}`)+" ",1),t(E,null,{image:a(()=>[Ge]),default:a(()=>[t(S,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[t(_,{value:l(W),onInput:e[3]||(e[3]=n=>o.updatePrice(n,"autoMemo",o.index))},null,8,["value"])]),_:1})):(N(),O(d,{key:1,label:"Is Physical only good"},{default:a(()=>[t(Z,{modelValue:l(P),"onUpdate:modelValue":e[4]||(e[4]=n=>r(P)?P.value=n:null),name:"isPhysicalOnly",label:"This edition does not contain digital file/NFT"},null,8,["modelValue"])]),_:1})),t(d,null,{label:a(()=>[v(" Allow custom price "),t(E,{"image-style":{width:"300px"}},{image:a(()=>[He]),default:a(()=>[t(S,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[t(Z,{modelValue:l(h),"onUpdate:modelValue":e[5]||(e[5]=n=>r(h)?h.value=n:null),name:"isAllowCustomPrice",label:"Allow user to pay more than defined price"},null,8,["modelValue"])]),_:1})]),_:1}),t(T,{ui:{body:{base:"flex flex-col gap-[20px]"},base:"overflow-visible"}},{header:a(()=>[Ke]),default:a(()=>[t(d,{label:"Product Name",ui:{container:"space-y-2"}},{label:a(()=>[v(" Product Name "),t(E,{"image-style":{width:"250px"}},{image:a(()=>[Qe]),default:a(()=>[t(S,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[t(_,{modelValue:l(x),"onUpdate:modelValue":e[6]||(e[6]=n=>r(x)?x.value=n:null),placeholder:"Product name in English"},null,8,["modelValue"]),Ze,t(l(ee),{modelValue:l(k),"onUpdate:modelValue":e[7]||(e[7]=n=>r(k)?k.value=n:null),language:"en-US","editor-id":"en",placeholder:H.en,toolbars:G,sanitize:Q,style:{height:"200px",width:"100%",marginTop:"0px"}},null,8,["modelValue","placeholder"])]),_:1}),t(d,{ui:{container:"space-y-2 my-[20px]"}},{label:a(()=>[v(" 產品名稱 "),t(E,{"image-style":{width:"250px"}},{image:a(()=>[Xe]),default:a(()=>[t(S,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[t(_,{modelValue:l(y),"onUpdate:modelValue":e[8]||(e[8]=n=>r(y)?y.value=n:null),placeholder:"產品中文名字"},null,8,["modelValue"]),Ye,t(l(ee),{modelValue:l(w),"onUpdate:modelValue":e[9]||(e[9]=n=>r(w)?w.value=n:null),language:"en-US","editor-id":"zh",placeholder:H.zh,toolbars:G,sanitize:Q,style:{height:"200px",width:"100%",marginTop:"0px"}},null,8,["modelValue","placeholder"])]),_:1})]),_:1}),t(de,{modelValue:l(V),"onUpdate:modelValue":e[10]||(e[10]=n=>r(V)?V.value=n:null),"is-show-physical-goods-checkbox":!0,"shipping-info":l(z),"is-loading":l(D),onUpdateShippingRates:re},null,8,["modelValue","shipping-info","is-loading"])]),_:1})]),_:1})])}}});export{vo as default};