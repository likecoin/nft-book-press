import{n as be,$ as ve,q as ge,v as _e,s as ee,V as he,u as ye,x as xe,r as i,C as q,h as ke,z as we,Y as oe,o as A,c as Ve,b as t,w as l,U as Ue,a as u,t as te,G as a,B as G,d as y,H as Ie,J as r,ar as Pe,at as Ee,M as Te,L as Se,O as Ne,as as Ce}from"./D-vwML4j.js";import{_ as $e}from"./BY9aUTR5.js";import{_ as Ae}from"./B4xDVTbH.js";import{_ as De}from"./n2vW2kNR.js";import{j as Re,_ as Me,a as ze,b as Oe,u as le,c as Be,p as Fe,d as Le}from"./KcnoPIom.js";import{a as je}from"./St_vjssp.js";import{_ as qe}from"./DqiMQVCY.js";import{D as Ge,M as D}from"./DYwSpA89.js";import"./IEhbL9cD.js";import"./BAfLZpvV.js";import"./CB-u_xr4.js";import"./B0iZceak.js";import"./BBn7zdp2.js";(function(){try{var g=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},_=new Error().stack;_&&(g._sentryDebugIds=g._sentryDebugIds||{},g._sentryDebugIds[_]="2017137b-b0c7-41f6-b724-8aba64237be4",g._sentryDebugIdIdentifier="sentry-dbid-2017137b-b0c7-41f6-b724-8aba64237be4")}catch{}})();const He={class:"font-bold font-mono"},io=be({__name:"new",setup(g){const{LIKE_CO_API:_}=ve().public,R=ge(),M=_e(),{connect:ae}=R,{wallet:x,signer:z}=ee(R),{token:H}=ee(M),{updateBookListingSetting:ne}=M,W=he(),K=ye(),O=xe(),m=i(K.params.classId),ie=i(K.query.priceIndex),p=i(!1),B=i({}),se=q(()=>{var o,e;return((e=(o=B==null?void 0:B.value)==null?void 0:o.prices)==null?void 0:e.length)>1}),c=i(Ge),k=i(1),f=i("auto"),Q=i("Thanks for purchasing this NFT ebook."),w=i("Standard Edition"),V=i("標準版"),U=i(""),I=i(""),P=i(!1),F=i([]),b=i(!1),h=i(!0),E=i(!1),L=i(!1),T=q(()=>se.value?"edition":"book"),Y=["bold","italic","strikeThrough","title","-","unorderedList","orderedList","-","code","link","=","preview"],Z={en:"Product description in English...",zh:"產品中文描述..."},re=q(()=>"Add Edition");Re({markdownItConfig(o){o.options.html=!1}}),ke(c,(o,e)=>{Number(e)!==0&&Number(o)===0&&(h.value=!0)}),we(async()=>{var o;try{p.value=!0;const e=await oe(`${_}/likernft/book/store/${m.value}`,{headers:{authorization:`Bearer ${H.value}`}},"$8O7KSYQXM9"),s=(o=e==null?void 0:e.data)==null?void 0:o.value;if(s&&(F.value=s.shippingRates,(s==null?void 0:s.ownerWallet)!==x.value))throw new Error("NOT_OWNER_OF_NFT_CLASS")}catch(e){console.error(e),O.add({icon:"i-heroicons-exclamation-circle",title:e.toString(),timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{p.value=!1}});function J(o=""){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function X(o){return Fe.sanitize(o)}function ue(){W.push({name:"nft-book-store-status-classId",params:{classId:m.value}})}async function de(o){var e;L.value=!0;try{await ne(m.value,{shippingRates:o});const{data:s}=await oe(`${_}/likernft/book/store/${m.value}`,{headers:{authorization:`Bearer ${H.value}`}},"$o64Gg3CnQx");F.value=((e=s.value)==null?void 0:e.shippingRates)||[]}catch(s){const S=s.data||s;console.error(S),O.add({icon:"i-heroicons-exclamation-circle",title:S,timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{L.value=!1}}async function me(){try{const o={name:{en:w.value,zh:V.value},description:{en:J(U.value),zh:J(I.value)},priceInDecimal:Math.round(Number(c.value)*100),price:Number(c.value),stock:Number(k.value),isAutoDeliver:!b.value&&f.value==="auto",autoMemo:f.value==="auto"&&Q.value||"",hasShipping:P.value||!1,isPhysicalOnly:b.value||!1,isAllowCustomPrice:h.value??!0,isUnlisted:E.value??!1};if(!o||o.price===void 0)throw new Error("Please input price of edition");if(o.price!==0&&o.price<D)throw new Error(`Price of each edition must be at least $${D} or $0 (free)`);if(!o.stock&&o.stock!==0)throw new Error("Please input stock of edition");if(o.stock<0)throw new Error("Stock cannot be negative");if(!o.name.en||!o.name.zh)throw new Error("Please input product name");if(o.isAutoDeliver&&!confirm(`NFT Book Press - Reminder
Once you choose automatic delivery, you can't switch it back to manual delivery.  Are you sure?`))return;p.value=!0;let e;if(o.isAutoDeliver&&o.stock>0){if((!x.value||!z.value)&&await ae(),!x.value||!z.value)throw new Error("Unable to connect to wallet");e=await Ee([m.value],o.stock,z.value,x.value)}await M.addEditionPrice(m.value,ie.value,{price:o,autoDeliverNFTsTxHash:e}),W.push({name:"nft-book-store-status-classId",params:{classId:m.value}})}catch(o){const e=o.data||o;console.error(e),O.add({icon:"i-heroicons-exclamation-circle",title:e,timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}finally{p.value=!1}}return(o,e)=>{const s=Te,S=Se,v=$e,d=Ae,N=Ne,pe=De,C=Ce,$=Le,j=je,ce=qe,fe=Ue;return A(),Ve("div",null,[t(fe,{"model-value":!0,ui:{width:"sm:max-w-7xl"}},{default:l(()=>[t(N,{ui:{header:{base:"flex justify-between items-center"},body:{base:"space-y-4"},footer:{base:"flex justify-end items-center"}}},{header:l(()=>[u("h2",He,te(a(re)),1),t(s,{color:"gray",variant:"ghost",icon:"i-heroicons-x-mark-20-solid",class:"-my-1",onClick:ue})]),footer:l(()=>[t(s,{label:"Add Edition",loading:a(p),size:"lg",disabled:a(p),onClick:me},null,8,["loading","disabled"])]),default:l(()=>[a(p)?(A(),G(S,{key:0,animation:"carousel"},{indicator:l(()=>e[12]||(e[12]=[y(" Loading... ")])),_:1})):Ie("",!0),t(N,{ui:{body:{base:"space-y-4"}}},{header:l(()=>e[13]||(e[13]=[u("h2",{class:"font-bold font-mono"}," Class Info ",-1)])),default:l(()=>[t(d,{label:"NFT Class ID"},{default:l(()=>[t(v,{class:"font-mono",value:a(m),readonly:!0,disabled:!0},null,8,["value"])]),_:1})]),_:1}),t(N,{ui:{body:{base:"flex flex-col gap-[20px]"},base:"overflow-visible"}},{header:l(()=>e[14]||(e[14]=[u("h3",{class:"font-bold font-mono"}," Pricing and Availability ",-1)])),default:l(()=>[t(d,{label:`Price(USD) of this ${a(T)} (Minimal ${a(D)} or $0 (free))`},{default:l(()=>[t(v,{modelValue:a(c),"onUpdate:modelValue":e[0]||(e[0]=n=>r(c)?c.value=n:null),type:"number",step:"0.01",min:a(D)},null,8,["modelValue","min"])]),_:1},8,["label"]),t(d,{label:`Total number of NFT for sale of this ${a(T)}`},{default:l(()=>[t(v,{modelValue:a(k),"onUpdate:modelValue":e[1]||(e[1]=n=>r(k)?k.value=n:null),type:"number",step:"1",min:0},null,8,["modelValue"])]),_:1},8,["label"]),t(pe,{modelValue:a(f),"onUpdate:modelValue":e[2]||(e[2]=n=>r(f)?f.value=n:null),disabled:a(b),legend:`Delivery method of this ${a(T)}`,options:a(Pe)},null,8,["modelValue","disabled","legend","options"]),a(f)==="auto"?(A(),G(d,{key:0},{label:l(()=>[y(te(`Memo of this ${a(T)}`)+" ",1),t($,null,{image:l(()=>e[15]||(e[15]=[u("img",{src:Me,class:"object-cover",alt:""},null,-1)])),default:l(()=>[t(C,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:l(()=>[t(v,{value:a(Q),onInput:e[3]||(e[3]=n=>o.updatePrice(n,"autoMemo",o.index))},null,8,["value"])]),_:1})):(A(),G(d,{key:1,label:"Is Physical only good"},{default:l(()=>[t(j,{modelValue:a(b),"onUpdate:modelValue":e[4]||(e[4]=n=>r(b)?b.value=n:null),name:"isPhysicalOnly",label:"This edition does not contain digital file/NFT"},null,8,["modelValue"])]),_:1})),t(d,null,{label:l(()=>[e[17]||(e[17]=y(" Allow custom price ")),t($,{"image-style":{width:"300px"}},{image:l(()=>e[16]||(e[16]=[u("img",{src:ze,class:"object-cover",alt:""},null,-1)])),default:l(()=>[t(C,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:l(()=>[t(j,{modelValue:a(h),"onUpdate:modelValue":e[5]||(e[5]=n=>r(h)?h.value=n:null),name:"isAllowCustomPrice",label:"Allow user to pay more than defined price"},null,8,["modelValue"])]),_:1}),t(d,{label:"Unlist Edition"},{default:l(()=>[t(j,{modelValue:a(E),"onUpdate:modelValue":e[6]||(e[6]=n=>r(E)?E.value=n:null),name:"isUnlisted",label:"Pause selling of this Edition"},null,8,["modelValue"])]),_:1})]),_:1}),t(N,{ui:{body:{base:"flex flex-col gap-[20px]"},base:"overflow-visible"}},{header:l(()=>e[18]||(e[18]=[u("h3",{class:"font-bold font-mono"}," Product Information ",-1)])),default:l(()=>[t(d,{label:"Product Name",ui:{container:"space-y-2"}},{label:l(()=>[e[20]||(e[20]=y(" Product Name ")),t($,{"image-style":{width:"250px"}},{image:l(()=>e[19]||(e[19]=[u("img",{src:Oe,class:"object-cover",alt:""},null,-1)])),default:l(()=>[t(C,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:l(()=>[t(v,{modelValue:a(w),"onUpdate:modelValue":e[7]||(e[7]=n=>r(w)?w.value=n:null),placeholder:"Product name in English"},null,8,["modelValue"]),e[21]||(e[21]=u("span",{class:"block text-[14px] text-[#374151] mt-[8px]"},"Description (Optional)",-1)),t(a(le),{modelValue:a(U),"onUpdate:modelValue":e[8]||(e[8]=n=>r(U)?U.value=n:null),language:"en-US","editor-id":"en",placeholder:Z.en,toolbars:Y,sanitize:X,style:{height:"200px",width:"100%",marginTop:"0px"}},null,8,["modelValue","placeholder"])]),_:1}),t(d,{ui:{container:"space-y-2 my-[20px]"}},{label:l(()=>[e[23]||(e[23]=y(" 產品名稱 ")),t($,{"image-style":{width:"250px"}},{image:l(()=>e[22]||(e[22]=[u("img",{src:Be,class:"object-cover",alt:""},null,-1)])),default:l(()=>[t(C,{name:"i-heroicons-question-mark-circle"})]),_:1})]),default:l(()=>[t(v,{modelValue:a(V),"onUpdate:modelValue":e[9]||(e[9]=n=>r(V)?V.value=n:null),placeholder:"產品中文名字"},null,8,["modelValue"]),e[24]||(e[24]=u("span",{class:"block text-[14px] text-[#374151] mt-[8px]"},"描述 (選填)",-1)),t(a(le),{modelValue:a(I),"onUpdate:modelValue":e[10]||(e[10]=n=>r(I)?I.value=n:null),language:"en-US","editor-id":"zh",placeholder:Z.zh,toolbars:Y,sanitize:X,style:{height:"200px",width:"100%",marginTop:"0px"}},null,8,["modelValue","placeholder"])]),_:1})]),_:1}),t(ce,{modelValue:a(P),"onUpdate:modelValue":e[11]||(e[11]=n=>r(P)?P.value=n:null),"is-show-physical-goods-checkbox":!0,"shipping-info":a(F),"is-loading":a(L),onUpdateShippingRates:de},null,8,["modelValue","shipping-info","is-loading"])]),_:1})]),_:1})])}}});export{io as default};
//# sourceMappingURL=DZS5O1o7.js.map