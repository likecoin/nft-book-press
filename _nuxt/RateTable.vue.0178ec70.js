import{_ as K,aO as W,bf as ee,aQ as D,g as P,aT as ne,aU as z,aH as oe,n as h,aX as te,aY as ae,o as t,c as x,a as l,d3 as ie,cV as le,b1 as se,N as H,d as Q,t as O,ai as A,y as C,r as $,x as m,w as i,b as p,v as n,b0 as F,F as de,ac as ue,Q as pe,E as J,G as X,a6 as re,q as T,z as Z}from"./entry.4f29fb51.js";import{u as ce,a as me}from"./uid.461d515f.js";import{_ as he,a as fe}from"./Table.1a14edc7.js";import{_ as _e}from"./Alert.8bdec41a.js";import{_ as Y}from"./FormGroup.2d5f6b71.js";import{_ as ge}from"./Input.40089d50.js";import{_ as ye}from"./Modal.32c300cc.js";import{v as L}from"./v4.a960c1f4.js";const q=W(D.ui.strategy,D.ui.radio,ee),ve=P({inheritAttrs:!1,props:{id:{type:String,default:()=>ce()},value:{type:[String,Number,Boolean],default:null},modelValue:{type:[String,Number,Boolean,Object],default:null},name:{type:String,default:null},disabled:{type:Boolean,default:!1},help:{type:String,default:null},label:{type:String,default:null},required:{type:Boolean,default:!1},color:{type:String,default:()=>q.default.color,validator(e){return D.ui.colors.includes(e)}},inputClass:{type:String,default:null},class:{type:[String,Object,Array],default:void 0},ui:{type:Object,default:void 0}},emits:["update:modelValue","change"],setup(e,{emit:g}){const{ui:o,attrs:b}=ne("radio",z(e,"ui"),q,z(e,"class")),a=oe("radio-group",null),{emitFormChange:r,color:y,name:s}=a??me(e,q),S=h({get(){return e.modelValue},set(v){g("update:modelValue",v),g("change",v),a||r()}}),V=h(()=>te(ae(o.value.base,o.value.background,o.value.border,o.value.ring.replaceAll("{color}",y.value),o.value.color.replaceAll("{color}",y.value)),e.inputClass));return{ui:o,attrs:b,pick:S,name:s,inputClass:V}}}),be={class:"flex items-center h-5"},Se=["id","name","required","value","disabled"],ke={key:0,class:"ms-3 inline-flex items-center"},xe=["for"];function Ce(e,g,o,b,a,r){return t(),x("div",{class:A(e.ui.wrapper)},[l("div",be,[ie(l("input",se({id:e.id,"onUpdate:modelValue":g[0]||(g[0]=y=>e.pick=y),name:e.name,required:e.required,value:e.value,disabled:e.disabled,type:"radio",class:["form-radio",e.inputClass]},e.attrs),null,16,Se),[[le,e.pick]])]),e.label||e.$slots.label?(t(),x("div",ke,[l("label",{for:e.id,class:A(e.ui.label)},[H(e.$slots,"label",{},()=>[Q(O(e.label),1)]),e.required?(t(),x("span",{key:0,class:A(e.ui.required)},"*",2)):C("",!0)],10,xe),e.help?(t(),x("p",{key:0,class:A(e.ui.help)},O(e.help),3)):C("",!0)])):C("",!0)],2)}const Je=K(ve,[["render",Ce]]),Ve={class:"flex justify-between items-center"},Ie={class:"flex justify-center"},we={key:1,class:"flex justify-center items-center w-full gap-[8px] py-[36px]"},Me=l("span",null," No items ",-1),Oe={class:"flex justify-end items-center"},$e={key:1,class:"flex justify-end items-center"},Be=P({__name:"InfoModal",props:{modelValue:{type:Boolean},readOnly:{type:Boolean,default:!1},shippingInfo:{type:Array,default:()=>[]}},emits:["update:modelValue","update-shipping-rates"],setup(e,{emit:g}){const o=e,b=g,a=h(()=>!V.value),r=h(()=>V.value),y=h(()=>a.value?"Editing Shipping Options":"Shipping Options Info"),s=$(o.shippingInfo.length?o.shippingInfo.map(d=>{var w,u;return{price:d.priceInDecimal/100,nameEn:(w=d.name)==null?void 0:w.en,nameZh:(u=d.name)==null?void 0:u.zh}}):[]),S=h(()=>s.value.length>1),V=$(o.readOnly);function v(){b("update:modelValue",!1)}function N(){V.value=!1}function I(d,w,u){var k;s.value[u][w]=(k=d.target)==null?void 0:k.value}function B(){if(!s.value.length){s.value.push({index:L(),price:10,nameEn:"Standard Shipping",nameZh:"標準寄送"});return}s.value.push({index:L(),price:20,nameEn:"International Shipping",nameZh:"國際寄送"})}function f(d){s.value.splice(d,1)}function _(){b("update-shipping-rates",s.value.map(d=>({name:{en:d.nameEn,zh:d.nameZh},priceInDecimal:Math.round(Number(d.price)*100)}))),v()}return(d,w)=>{const u=J,k=ge,U=Y,R=X,G=re,c=ye;return t(),m(c,{"model-value":e.modelValue},{default:i(()=>[p(R,{ui:{header:{base:"font-bold font-mono"}}},{header:i(()=>[l("div",Ve,[Q(O(n(y))+" ",1),p(u,{color:"gray",variant:"ghost",icon:"i-heroicons-x-mark-20-solid",onClick:v})])]),footer:i(()=>[l("div",Oe,[n(a)?(t(),m(u,{key:0,label:"Save",onClick:_})):(t(),x("div",$e,[p(u,{label:"Set Shipping Options",variant:"outline",onClick:N},{trailing:i(()=>[p(G,{name:"i-heroicons-arrow-right-20-solid"})]),_:1})]))])]),default:i(()=>[n(s).length?(t(),m(F(n(S)?"ul":"div"),{key:0,class:"space-y-4"},{default:i(()=>[(t(!0),x(de,null,ue(n(s),(E,j)=>(t(),m(F(n(S)?"li":"div"),{key:E.index},{default:i(()=>[p(R,{ui:{body:{base:"space-y-4"},footer:{base:"flex justify-end items-center"}}},pe({default:i(()=>[p(U,{label:"Name of this shipping option",ui:{container:"space-y-2"}},{default:i(()=>[p(k,{value:E.nameEn,placeholder:"Shipping option name",disabled:n(r),onInput:M=>I(M,"nameEn",j)},null,8,["value","disabled","onInput"]),p(k,{placeholder:"運送選項名稱",value:E.nameZh,disabled:n(r),onInput:M=>I(M,"nameZh",j)},null,8,["value","disabled","onInput"])]),_:2},1024),p(U,{label:"Price(USD) of this shipping option"},{default:i(()=>[p(k,{value:E.price,type:"number",step:"0.01",min:0,disabled:n(r),onInput:M=>I(M,"price",j)},null,8,["value","disabled","onInput"])]),_:2},1024)]),_:2},[n(S)&&n(a)?{name:"footer",fn:i(()=>[p(u,{label:"Delete",variant:"outline",color:"red",onClick:M=>f(j)},null,8,["onClick"])]),key:"0"}:void 0]),1024)]),_:2},1024))),128)),l("div",Ie,[n(a)?(t(),m(u,{key:0,label:"Add Options",variant:"outline",icon:"i-heroicons-plus-20-solid",onClick:B})):C("",!0)])]),_:1})):(t(),x("div",we,[Me,n(a)?(t(),m(u,{key:0,label:"Add Options",variant:"outline",icon:"i-heroicons-plus-20-solid",onClick:B})):C("",!0)]))]),_:1})]),_:1},8,["model-value"])}}}),Ue={class:"flex flex-row justify-between items-center"},Re={class:"flex justify-start items-center gap-[8px]"},Ee=l("h3",{class:"font-bold font-mono"}," Shipping Options ",-1),je={class:"flex flex-col gap-[8px] items-start"},Ae={class:"text-center"},Ne={class:"text-center"},Ge={class:"text-center"},qe={key:1,class:"px-[24px] py-[12px]"},De={class:"flex flex-col gap-[16px]"},Xe=P({__name:"RateTable",props:{isLoading:{type:Boolean,default:!1},isShowPhysicalGoodsCheckbox:{type:Boolean,default:!1},shippingInfo:{type:Array,default:()=>[]},modelValue:{type:Boolean},isShowSettingModalButton:{type:Boolean,default:!1}},emits:["update:modelValue","update-shipping-rates"],setup(e,{emit:g}){const o=e,b=g,a=$(!1),r=$(o.modelValue),y=$(o.isShowPhysicalGoodsCheckbox);T(()=>o.modelValue,f=>{r.value=f}),T(r,f=>{b("update:modelValue",f)});const s=h(()=>!o.isShowPhysicalGoodsCheckbox),S=h(()=>o.isShowPhysicalGoodsCheckbox),V=h(()=>!!(S.value&&o.isShowSettingModalButton)),v=h(()=>{if(s.value)return o.shippingInfo.length?{icon:"i-heroicons-pencil-square",text:"Edit",action:I}:{icon:"i-heroicons-plus-20-solid",text:"Add",action:I};if(S.value)return o.shippingInfo.length?{icon:"i-heroicons-eye-20-solid",text:"View Current Shipping Options",action:I}:{icon:"i-heroicons-plus-20-solid",text:"Add Shipping Options",action:B}}),N=h(()=>o.shippingInfo.length?o.shippingInfo.map((f,_)=>({index:_+1,name:f.name,price:f.priceInDecimal/100})):[]);function I(){a.value=!0}function B(){y.value=!1,a.value=!0}return(f,_)=>{const d=J,w=he,u=fe,k=_e,U=Y,R=Be,G=X;return t(),m(G,{ui:{body:{padding:""}}},{header:i(()=>[l("div",Ue,[l("div",Re,[Ee,H(f.$slots,"header")]),n(V)?C("",!0):(t(),m(d,{key:0,icon:n(v).icon,label:n(v).text,loading:e.isLoading,onClick:n(v).action},null,8,["icon","label","loading","onClick"]))])]),default:i(()=>[n(s)?(t(),m(w,{key:0,columns:[{key:"index"},{key:"name",label:"Name"},{key:"price",label:"Price (USD)"}],rows:n(N)},{"name-data":i(({row:c})=>[l("div",je,[l("span",Ae,"en: "+O(c.name.en),1),l("span",Ne,"zh: "+O(c.name.zh),1)])]),"price-data":i(({row:c})=>[l("span",Ge,O(c.price),1)]),_:1},8,["columns","rows"])):(t(),x("div",qe,[p(U,{label:"Physical Goods",ui:{label:{base:"font-mono font-bold"}}},{default:i(()=>[l("div",De,[p(u,{modelValue:n(r),"onUpdate:modelValue":_[0]||(_[0]=c=>Z(r)?r.value=c:null),name:"hasShipping",label:"Includes physical good that requires shipping",disabled:!e.shippingInfo.length},null,8,["modelValue","disabled"]),e.shippingInfo.length?C("",!0):(t(),m(k,{key:0,icon:"i-heroicons-face-frown-solid",color:"yellow",variant:"solid",title:"Please enable this feature in the advanced settings."}))])]),_:1})])),n(a)?(t(),m(R,{key:2,modelValue:n(a),"onUpdate:modelValue":_[1]||(_[1]=c=>Z(a)?a.value=c:null),"read-only":n(y),"shipping-info":e.shippingInfo,onUpdateShippingRates:_[2]||(_[2]=c=>b("update-shipping-rates",c))},null,8,["modelValue","read-only","shipping-info"])):C("",!0)]),_:3})}}});export{Xe as _,Je as a};