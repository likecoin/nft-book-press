import{g as ge,h as ye,G as ke,I as xe,H as ie,j as we,i as Ve,k as Ie,r as i,l as $,K as se,m as Pe,F as re,o as F,c as Te,b as a,w as l,a as m,t as ue,s as t,q as J,d as D,x as Se,v as d,n as Ue,af as Ee,C as Ae,P as Ce,D as Ne,ac as $e,E as De,ad as Me}from"./entry.6d4ed70f.js";import{_ as ze}from"./Input.f7c22f04.js";import{_ as Fe}from"./FormGroup.c4f5bf88.js";import{_ as Re}from"./RadioGroup.7f461ae2.js";import{j as Be,a as Oe,b as Le,c as je,d as qe,p as We,_ as He,u as ce}from"./purify.es.82421046.js";import{a as Ge}from"./Table.82ac636b.js";import{_ as Ke}from"./RateTable.vue.5a91b7e2.js";import{D as Ze,M as R}from"./index.a4efc5ce.js";import"./useFormGroup.08dac1ae.js";import"./Radio.db2eda8d.js";import"./punycode.9153f513.js";import"./Alert.94c17f65.js";import"./v4.b87601ea.js";(function(){try{var x=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},w=new Error().stack;w&&(x._sentryDebugIds=x._sentryDebugIds||{},x._sentryDebugIds[w]="ca63b307-c173-47b4-950f-417a4147a45a",x._sentryDebugIdIdentifier="sentry-dbid-ca63b307-c173-47b4-950f-417a4147a45a")}catch{}})();const Je={class:"font-bold font-mono"},Qe=m("h2",{class:"font-bold font-mono"}," Class Info ",-1),Xe=m("h3",{class:"font-bold font-mono"}," Pricing and Availability ",-1),Ye=m("img",{src:Oe,class:"object-cover",alt:""},null,-1),eo=m("img",{src:Le,class:"object-cover",alt:""},null,-1),oo=m("h3",{class:"font-bold font-mono"}," Product Information ",-1),to=m("img",{src:je,class:"object-cover",alt:""},null,-1),ao=m("span",{class:"block text-[14px] text-[#374151] mt-[8px]"},"Description (Optional)",-1),lo=m("img",{src:qe,class:"object-cover",alt:""},null,-1),no=m("span",{class:"block text-[14px] text-[#374151] mt-[8px]"},"描述 (選填)",-1),yo=ge({__name:"[editionIndex]",setup(x){const{LIKE_CO_API:w}=ye().public,B=ke(),O=xe(),{connect:de}=B,{wallet:M,signer:L}=ie(B),{token:Q}=ie(O),{updateBookListingSetting:me}=O,X=we(),Y=Ve(),j=Ie(),v=i(Y.params.classId),q=i(Y.params.editionIndex),h=i(!1),V=i({}),ee=$(()=>{var o,e;return((e=(o=V==null?void 0:V.value)==null?void 0:o.prices)==null?void 0:e.length)>1}),_=i(Ze),I=i(1),y=i("auto"),P=i("Thanks for purchasing this NFT ebook."),T=i("Standard Edition"),S=i("標準版"),U=i(""),E=i(""),A=i(!1),b=i(!1),k=i(!0),W=i([]),H=i(!1),G=i(0),C=i(!1),N=$(()=>ee.value?"edition":"book"),K=$(()=>y.value==="auto"),Z=$(()=>C.value?G.value:0),oe=i(["bold","italic","strikeThrough","title","-","unorderedList","orderedList","-","code","link","=","preview"]),te=i({en:"Product description in English...",zh:"產品中文描述..."}),pe=$(()=>`Edit ${N.value} ${ee.value?`#${q.value}`:"price"} info`);Be({markdownItConfig(o){o.options.html=!1}}),se(_,(o,e)=>{Number(e)!==0&&Number(o)===0&&(k.value=!0)}),se(K,o=>{o&&(confirm(`NFT Book Press - Reminder
Once you choose automatic delivery, you can't switch it back to manual delivery.  Are you sure?`)?P.value||(P.value="Thanks for purchasing this NFT ebook."):Ue(()=>{y.value="manual"}))}),Pe(async()=>{var o,e,u,g,p;try{h.value=!0;const r=await re(`${w}/likernft/book/store/${v.value}`,{headers:{authorization:`Bearer ${Q.value}`}},"$VmWp4AJPcU"),c=(o=r==null?void 0:r.data)==null?void 0:o.value;if(c){if(W.value=(c==null?void 0:c.shippingRates)||[],(c==null?void 0:c.ownerWallet)!==M.value)throw new Error("NOT_OWNER_OF_NFT_CLASS");V.value=c;const s=V.value.prices.filter(f=>f.index.toString()===q.value)[0];if(s){_.value=s.price||0,I.value=s.stock||0,y.value=s.isAutoDeliver?"auto":"manual",P.value=s.autoMemo||"",T.value=((e=s.name)==null?void 0:e.en)||s.name||"",S.value=((u=s.name)==null?void 0:u.zh)||s.name||"";const f=typeof s.description=="string"?s.description:void 0;U.value=((g=s.description)==null?void 0:g.en)||f||" ",E.value=((p=s.description)==null?void 0:p.zh)||f||" ",A.value=!!s.hasShipping||!1,b.value=s.isPhysicalOnly||!1,k.value=s.isAllowCustomPrice??!0,G.value=s.stock,C.value=s.isAutoDeliver}}}catch(r){console.error(r),j.add({icon:"i-heroicons-exclamation-circle",title:r.toString(),timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{h.value=!1}});function ae(o=""){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function le(o){return We.sanitize(o)}function fe(){X.push({name:"nft-book-store-status-classId",params:{classId:v.value}})}async function ve(o){var e;H.value=!0;try{await me(v.value,{shippingRates:o});const{data:u}=await re(`${w}/likernft/book/store/${v.value}`,{headers:{authorization:`Bearer ${Q.value}`}},"$BOTxWfMIB7");W.value=((e=u.value)==null?void 0:e.shippingRates)||[]}catch(u){const g=u.data||u;console.error(g),j.add({icon:"i-heroicons-exclamation-circle",title:g,timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{H.value=!1}}async function he(){try{const o={name:{en:T.value,zh:S.value},description:{en:ae(U.value),zh:ae(E.value)},priceInDecimal:Math.round(Number(_.value)*100),price:Number(_.value),stock:Number(I.value),isAutoDeliver:!b.value&&K.value,autoMemo:P.value||"",hasShipping:A.value||!1,isPhysicalOnly:b.value||!1,isAllowCustomPrice:k.value??!0};if(!o||o.price===void 0)throw new Error("Please input price of edition");if(o.price!==0&&o.price<R)throw new Error(`Price of each edition must be at least $${R} or $0 (free)`);if(!o.stock&&o.stock!==0)throw new Error("Please input stock of edition");if(o.stock<Z.value)throw new Error(`Stock cannot be less than ${Z.value}`);if(C.value&&!o.isAutoDeliver)throw new Error("Cannot change automatic delivery to manual delivery");if(!o.name.en||!o.name.zh)throw new Error("Please input product name");h.value=!0;let e=0;o.isAutoDeliver&&(e=C.value?o.stock-G.value:o.stock);let u;if(e>0){if((!M.value||!L.value)&&await de(),!M.value||!L.value)throw new Error("Unable to connect to wallet");u=await Ee([v.value],e,L.value,M.value)}await O.updateEditionPrice(v.value,q.value,{price:o,autoDeliverNFTsTxHash:u}),X.push({name:"nft-book-store-status-classId",params:{classId:v.value}})}catch(o){const e=o.data||o;console.error(e),j.add({icon:"i-heroicons-exclamation-circle",title:e,timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{h.value=!1}}return(o,e)=>{const u=Ae,g=Ce,p=ze,r=Fe,c=Ne,s=Re,f=$e,z=He,ne=Ge,_e=Ke,be=De;return F(),Te("div",null,[a(be,{"model-value":!0,ui:{width:"sm:max-w-7xl"}},{default:l(()=>[a(c,{ui:{header:{base:"flex justify-between items-center"},body:{base:"space-y-4"},footer:{base:"flex justify-end items-center"}}},{header:l(()=>[m("h2",Je,ue(t(pe)),1),a(u,{color:"gray",variant:"ghost",icon:"i-heroicons-x-mark-20-solid",class:"-my-1",onClick:fe})]),footer:l(()=>[a(u,{label:"Save Changes",loading:t(h),size:"lg",disabled:t(h),onClick:he},null,8,["loading","disabled"])]),default:l(()=>[t(h)?(F(),J(g,{key:0,animation:"carousel"},{indicator:l(()=>[D(" Loading... ")]),_:1})):Se("",!0),a(c,{ui:{body:{base:"space-y-4"}}},{header:l(()=>[Qe]),default:l(()=>[a(r,{label:"NFT Class ID"},{default:l(()=>[a(p,{class:"font-mono",value:t(v),readonly:!0,disabled:!0},null,8,["value"])]),_:1})]),_:1}),a(c,{ui:{body:{base:"flex flex-col gap-[20px]"},base:"overflow-visible"}},{header:l(()=>[Xe]),default:l(()=>[a(r,{label:`Price(USD) of this ${t(N)} (Minimal ${t(R)} or $0 (free))`},{default:l(()=>[a(p,{modelValue:t(_),"onUpdate:modelValue":e[0]||(e[0]=n=>d(_)?_.value=n:null),type:"number",step:"0.01",min:t(R)},null,8,["modelValue","min"])]),_:1},8,["label"]),a(r,{label:`Total number of NFT for sale of this ${t(N)}`},{default:l(()=>[a(p,{modelValue:t(I),"onUpdate:modelValue":e[1]||(e[1]=n=>d(I)?I.value=n:null),type:"number",step:"1",min:t(Z)},null,8,["modelValue","min"])]),_:1},8,["label"]),a(s,{modelValue:t(y),"onUpdate:modelValue":e[2]||(e[2]=n=>d(y)?y.value=n:null),disabled:t(C)||t(b),legend:`Delivery method of this ${t(N)}`,options:t(Me)},null,8,["modelValue","disabled","legend","options"]),t(K)?(F(),J(r,{key:0},{label:l(()=>[D(ue(`Memo of this ${t(N)}`)+" ",1),a(z,null,{image:l(()=>[Ye]),default:l(()=>[a(f,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:l(()=>[a(p,{value:t(P),onInput:e[3]||(e[3]=n=>o.updatePrice(n,"autoMemo",o.index))},null,8,["value"])]),_:1})):(F(),J(r,{key:1,label:"Is Physical only good",ui:{label:{base:"font-mono font-bold"}}},{default:l(()=>[a(ne,{modelValue:t(b),"onUpdate:modelValue":e[4]||(e[4]=n=>d(b)?b.value=n:null),name:"isPhysicalOnly",label:"This edition does not contain digital file/NFT"},null,8,["modelValue"])]),_:1})),a(r,null,{label:l(()=>[D(" Allow custom price "),a(z,{"image-style":{width:"300px"}},{image:l(()=>[eo]),default:l(()=>[a(f,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:l(()=>[a(ne,{modelValue:t(k),"onUpdate:modelValue":e[5]||(e[5]=n=>d(k)?k.value=n:null),name:"isAllowCustomPrice",label:"Allow user to pay more than defined price"},null,8,["modelValue"])]),_:1})]),_:1}),a(c,{ui:{body:{base:"flex flex-col gap-[20px]"},base:"overflow-visible"}},{header:l(()=>[oo]),default:l(()=>[a(r,{label:"Product Name",ui:{container:"space-y-2"}},{label:l(()=>[D(" Product Name "),a(z,{"image-style":{width:"250px"}},{image:l(()=>[to]),default:l(()=>[a(f,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:l(()=>[a(p,{modelValue:t(T),"onUpdate:modelValue":e[6]||(e[6]=n=>d(T)?T.value=n:null),placeholder:"Product name in English"},null,8,["modelValue"]),ao,a(t(ce),{modelValue:t(U),"onUpdate:modelValue":e[7]||(e[7]=n=>d(U)?U.value=n:null),language:"en-US","editor-id":"en",placeholder:t(te).en,toolbars:t(oe),sanitize:le,style:{height:"200px",width:"100%",marginTop:"0px"}},null,8,["modelValue","placeholder","toolbars"])]),_:1}),a(r,{ui:{container:"space-y-2 my-[20px]"}},{label:l(()=>[D(" 產品名稱 "),a(z,{"image-style":{width:"250px"}},{image:l(()=>[lo]),default:l(()=>[a(f,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:l(()=>[a(p,{modelValue:t(S),"onUpdate:modelValue":e[8]||(e[8]=n=>d(S)?S.value=n:null),placeholder:"產品中文名字"},null,8,["modelValue"]),no,a(t(ce),{modelValue:t(E),"onUpdate:modelValue":e[9]||(e[9]=n=>d(E)?E.value=n:null),language:"en-US","editor-id":"zh",placeholder:t(te).zh,toolbars:t(oe),sanitize:le,style:{height:"200px",width:"100%",marginTop:"0px"}},null,8,["modelValue","placeholder","toolbars"])]),_:1})]),_:1}),a(_e,{modelValue:t(A),"onUpdate:modelValue":e[10]||(e[10]=n=>d(A)?A.value=n:null),"is-show-physical-goods-checkbox":!0,"shipping-info":t(W),"is-loading":t(H),onUpdateShippingRates:ve},null,8,["modelValue","shipping-info","is-loading"])]),_:1})]),_:1})])}}});export{yo as default};
//# sourceMappingURL=_editionIndex_.66cffb51.js.map