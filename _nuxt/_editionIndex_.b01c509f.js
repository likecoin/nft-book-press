import{g as ye,W as ke,i as xe,j as we,s as se,R as Ve,h as Ue,k as Ie,v as i,x as D,y as re,m as Pe,U as ue,o as F,c as Te,b as l,w as a,a as m,t as de,z as t,r as X,d as z,A as Se,C as c,ah as Ee,L as Ae,ak as Ce,I as Ne,H as $e,K as De,aj as ze,Q as Re}from"./entry.c6854afe.js";import{_ as Me}from"./Input.3ae04d0e.js";import{_ as Fe}from"./FormGroup.b896c5eb.js";import{_ as Be}from"./RadioGroup.67690bb0.js";import{j as Oe,u as ce,a as Le,b as je,c as We,d as qe,p as He,_ as Ge}from"./purify.es.1da5b914.js";import{a as Ke}from"./Table.24e3600d.js";import{_ as Ze}from"./RateTable.vue.0c7a34a1.js";import{M as B,D as Je}from"./index.19817b30.js";import"./useFormGroup.8531c5da.js";import"./Radio.51109a17.js";import"./punycode.dd2dd1b4.js";import"./Alert.9ed33f40.js";import"./v4.b87601ea.js";(function(){try{var w=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},V=new Error().stack;V&&(w._sentryDebugIds=w._sentryDebugIds||{},w._sentryDebugIds[V]="724f2a4e-b5af-4ff4-9d4d-15e4a0afd172",w._sentryDebugIdIdentifier="sentry-dbid-724f2a4e-b5af-4ff4-9d4d-15e4a0afd172")}catch{}})();const Qe={class:"font-bold font-mono"},Xe=m("h2",{class:"font-bold font-mono"}," Class Info ",-1),Ye=m("h3",{class:"font-bold font-mono"}," Pricing and Availability ",-1),eo=m("img",{src:Le,class:"object-cover",alt:""},null,-1),oo=m("img",{src:je,class:"object-cover",alt:""},null,-1),to=m("h3",{class:"font-bold font-mono"}," Product Information ",-1),lo=m("img",{src:We,class:"object-cover",alt:""},null,-1),ao=m("span",{class:"block text-[14px] text-[#374151] mt-[8px]"},"Description (Optional)",-1),no=m("img",{src:qe,class:"object-cover",alt:""},null,-1),io=m("span",{class:"block text-[14px] text-[#374151] mt-[8px]"},"描述 (選填)",-1),ko=ye({__name:"[editionIndex]",setup(w){const{LIKE_CO_API:V}=ke().public,O=xe(),L=we(),{connect:me}=O,{wallet:R,signer:j}=se(O),{token:Y}=se(L),{updateBookListingSetting:pe}=L,ee=Ve(),oe=Ue(),W=Ie(),v=i(oe.params.classId),q=i(oe.params.editionIndex),h=i(!1),U=i({}),te=D(()=>{var o,e;return((e=(o=U==null?void 0:U.value)==null?void 0:o.prices)==null?void 0:e.length)>1}),_=i(Je),I=i(1),k=i("auto"),b=i("Thanks for purchasing this NFT ebook."),P=i("Standard Edition"),T=i("標準版"),S=i(""),E=i(""),A=i(!1),g=i(!1),x=i(!0),C=i(!1),H=i([]),G=i(!1),K=i(0),N=i(!1),$=D(()=>te.value?"edition":"book"),Z=D(()=>k.value==="auto"),J=D(()=>N.value?K.value:0),le=i(["bold","italic","strikeThrough","title","-","unorderedList","orderedList","-","code","link","=","preview"]),ae=i({en:"Product description in English...",zh:"產品中文描述..."}),fe=D(()=>`Edit ${$.value} ${te.value?`#${q.value}`:"price"} info`);Oe({markdownItConfig(o){o.options.html=!1}}),re(_,(o,e)=>{Number(e)!==0&&Number(o)===0&&(x.value=!0)}),re(Z,o=>{o&&(confirm(`NFT Book Press - Reminder
Once you choose automatic delivery, you can't switch it back to manual delivery.  Are you sure?`)?b.value||(b.value="Thanks for purchasing this NFT ebook."):Ae(()=>{k.value="manual"}))}),Pe(async()=>{var o,e,u,y,p;try{h.value=!0;const r=await ue(`${V}/likernft/book/store/${v.value}`,{headers:{authorization:`Bearer ${Y.value}`}},"$VmWp4AJPcU"),d=(o=r==null?void 0:r.data)==null?void 0:o.value;if(d){if(H.value=(d==null?void 0:d.shippingRates)||[],(d==null?void 0:d.ownerWallet)!==R.value)throw new Error("NOT_OWNER_OF_NFT_CLASS");U.value=d;const s=U.value.prices.filter(f=>f.index.toString()===q.value)[0];if(s){_.value=s.price||0,I.value=s.stock||0,k.value=s.isAutoDeliver?"auto":"manual",b.value=s.autoMemo||"",P.value=((e=s.name)==null?void 0:e.en)||s.name||"",T.value=((u=s.name)==null?void 0:u.zh)||s.name||"";const f=typeof s.description=="string"?s.description:void 0;S.value=((y=s.description)==null?void 0:y.en)||f||" ",E.value=((p=s.description)==null?void 0:p.zh)||f||" ",A.value=!!s.hasShipping||!1,g.value=s.isPhysicalOnly||!1,x.value=s.isAllowCustomPrice??!0,C.value=s.isUnlisted??!1,K.value=s.stock,N.value=s.isAutoDeliver}}}catch(r){console.error(r),W.add({icon:"i-heroicons-exclamation-circle",title:r.toString(),timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{h.value=!1}});function ne(o=""){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ie(o){return He.sanitize(o)}function ve(){ee.push({name:"nft-book-store-status-classId",params:{classId:v.value}})}async function he(o){var e;G.value=!0;try{await pe(v.value,{shippingRates:o});const{data:u}=await ue(`${V}/likernft/book/store/${v.value}`,{headers:{authorization:`Bearer ${Y.value}`}},"$BOTxWfMIB7");H.value=((e=u.value)==null?void 0:e.shippingRates)||[]}catch(u){const y=u.data||u;console.error(y),W.add({icon:"i-heroicons-exclamation-circle",title:y,timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{G.value=!1}}async function _e(){try{const o={name:{en:P.value,zh:T.value},description:{en:ne(S.value),zh:ne(E.value)},priceInDecimal:Math.round(Number(_.value)*100),price:Number(_.value),stock:Number(I.value),isAutoDeliver:!g.value&&Z.value,autoMemo:b.value||"",hasShipping:A.value||!1,isPhysicalOnly:g.value||!1,isAllowCustomPrice:x.value??!0,isUnlisted:C.value??!1};if(!o||o.price===void 0)throw new Error("Please input price of edition");if(o.price!==0&&o.price<B)throw new Error(`Price of each edition must be at least $${B} or $0 (free)`);if(!o.stock&&o.stock!==0)throw new Error("Please input stock of edition");if(o.stock<J.value)throw new Error(`Stock cannot be less than ${J.value}`);if(N.value&&!o.isAutoDeliver)throw new Error("Cannot change automatic delivery to manual delivery");if(!o.name.en||!o.name.zh)throw new Error("Please input product name");h.value=!0;let e=0;o.isAutoDeliver&&(e=N.value?o.stock-K.value:o.stock);let u;if(e>0){if((!R.value||!j.value)&&await me(),!R.value||!j.value)throw new Error("Unable to connect to wallet");u=await Ce([v.value],e,j.value,R.value)}await L.updateEditionPrice(v.value,q.value,{price:o,autoDeliverNFTsTxHash:u}),ee.push({name:"nft-book-store-status-classId",params:{classId:v.value}})}catch(o){const e=o.data||o;console.error(e),W.add({icon:"i-heroicons-exclamation-circle",title:e,timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{h.value=!1}}return(o,e)=>{const u=Ne,y=$e,p=Me,r=Fe,d=De,s=Be,f=ze,M=Ge,Q=Ke,be=Ze,ge=Re;return F(),Te("div",null,[l(ge,{"model-value":!0,ui:{width:"sm:max-w-7xl"}},{default:a(()=>[l(d,{ui:{header:{base:"flex justify-between items-center"},body:{base:"space-y-4"},footer:{base:"flex justify-end items-center"}}},{header:a(()=>[m("h2",Qe,de(t(fe)),1),l(u,{color:"gray",variant:"ghost",icon:"i-heroicons-x-mark-20-solid",class:"-my-1",onClick:ve})]),footer:a(()=>[l(u,{label:"Save Changes",loading:t(h),size:"lg",disabled:t(h),onClick:_e},null,8,["loading","disabled"])]),default:a(()=>[t(h)?(F(),X(y,{key:0,animation:"carousel"},{indicator:a(()=>[z(" Loading... ")]),_:1})):Se("",!0),l(d,{ui:{body:{base:"space-y-4"}}},{header:a(()=>[Xe]),default:a(()=>[l(r,{label:"NFT Class ID"},{default:a(()=>[l(p,{class:"font-mono",value:t(v),readonly:!0,disabled:!0},null,8,["value"])]),_:1})]),_:1}),l(d,{ui:{body:{base:"flex flex-col gap-[20px]"},base:"overflow-visible"}},{header:a(()=>[Ye]),default:a(()=>[l(r,{label:`Price(USD) of this ${t($)} (Minimal ${t(B)} or $0 (free))`},{default:a(()=>[l(p,{modelValue:t(_),"onUpdate:modelValue":e[0]||(e[0]=n=>c(_)?_.value=n:null),type:"number",step:"0.01",min:t(B)},null,8,["modelValue","min"])]),_:1},8,["label"]),l(r,{label:`Total number of NFT for sale of this ${t($)}`},{default:a(()=>[l(p,{modelValue:t(I),"onUpdate:modelValue":e[1]||(e[1]=n=>c(I)?I.value=n:null),type:"number",step:"1",min:t(J)},null,8,["modelValue","min"])]),_:1},8,["label"]),l(s,{modelValue:t(k),"onUpdate:modelValue":e[2]||(e[2]=n=>c(k)?k.value=n:null),disabled:t(N)||t(g),legend:`Delivery method of this ${t($)}`,options:t(Ee)},null,8,["modelValue","disabled","legend","options"]),t(Z)?(F(),X(r,{key:0},{label:a(()=>[z(de(`Memo of this ${t($)}`)+" ",1),l(M,null,{image:a(()=>[eo]),default:a(()=>[l(f,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[l(p,{modelValue:t(b),"onUpdate:modelValue":e[3]||(e[3]=n=>c(b)?b.value=n:null)},null,8,["modelValue"])]),_:1})):(F(),X(r,{key:1,label:"Is Physical only good",ui:{label:{base:"font-mono font-bold"}}},{default:a(()=>[l(Q,{modelValue:t(g),"onUpdate:modelValue":e[4]||(e[4]=n=>c(g)?g.value=n:null),name:"isPhysicalOnly",label:"This edition does not contain digital file/NFT"},null,8,["modelValue"])]),_:1})),l(r,null,{label:a(()=>[z(" Allow custom price "),l(M,{"image-style":{width:"300px"}},{image:a(()=>[oo]),default:a(()=>[l(f,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[l(Q,{modelValue:t(x),"onUpdate:modelValue":e[5]||(e[5]=n=>c(x)?x.value=n:null),name:"isAllowCustomPrice",label:"Allow user to pay more than defined price"},null,8,["modelValue"])]),_:1}),l(r,{label:"Unlist Edition"},{default:a(()=>[l(Q,{modelValue:t(C),"onUpdate:modelValue":e[6]||(e[6]=n=>c(C)?C.value=n:null),name:"isUnlisted",label:"Pause selling of this Edition"},null,8,["modelValue"])]),_:1})]),_:1}),l(d,{ui:{body:{base:"flex flex-col gap-[20px]"},base:"overflow-visible"}},{header:a(()=>[to]),default:a(()=>[l(r,{label:"Product Name",ui:{container:"space-y-2"}},{label:a(()=>[z(" Product Name "),l(M,{"image-style":{width:"250px"}},{image:a(()=>[lo]),default:a(()=>[l(f,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[l(p,{modelValue:t(P),"onUpdate:modelValue":e[7]||(e[7]=n=>c(P)?P.value=n:null),placeholder:"Product name in English"},null,8,["modelValue"]),ao,l(t(ce),{modelValue:t(S),"onUpdate:modelValue":e[8]||(e[8]=n=>c(S)?S.value=n:null),language:"en-US","editor-id":"en",placeholder:t(ae).en,toolbars:t(le),sanitize:ie,style:{height:"200px",width:"100%",marginTop:"0px"}},null,8,["modelValue","placeholder","toolbars"])]),_:1}),l(r,{ui:{container:"space-y-2 my-[20px]"}},{label:a(()=>[z(" 產品名稱 "),l(M,{"image-style":{width:"250px"}},{image:a(()=>[no]),default:a(()=>[l(f,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:a(()=>[l(p,{modelValue:t(T),"onUpdate:modelValue":e[9]||(e[9]=n=>c(T)?T.value=n:null),placeholder:"產品中文名字"},null,8,["modelValue"]),io,l(t(ce),{modelValue:t(E),"onUpdate:modelValue":e[10]||(e[10]=n=>c(E)?E.value=n:null),language:"en-US","editor-id":"zh",placeholder:t(ae).zh,toolbars:t(le),sanitize:ie,style:{height:"200px",width:"100%",marginTop:"0px"}},null,8,["modelValue","placeholder","toolbars"])]),_:1})]),_:1}),l(be,{modelValue:t(A),"onUpdate:modelValue":e[11]||(e[11]=n=>c(A)?A.value=n:null),"is-show-physical-goods-checkbox":!0,"shipping-info":t(H),"is-loading":t(G),onUpdateShippingRates:he},null,8,["modelValue","shipping-info","is-loading"])]),_:1})]),_:1})])}}});export{ko as default};
//# sourceMappingURL=_editionIndex_.b01c509f.js.map