import{_ as C,r as $}from"./Radio.8317e4d0.js";import{_ as k,aT as O,aU as l,g as U,aW as b,aX as u,W as z,k as B,o as r,c as i,a as j,ao as y,X as v,d as w,t as G,v as N,J as F,S as T,m as P,w as W,cf as S,c0 as A,b9 as o}from"./entry.86b36dbd.js";import{a as X}from"./useFormGroup.67781319.js";const D={wrapper:"relative flex items-start",legend:"text-sm font-medium text-gray-700 dark:text-gray-200 mb-1",default:{color:"primary"}},d=O(l.ui.strategy,l.ui.radioGroup,D),E=O(l.ui.strategy,l.ui.radio,$),I=U({components:{URadio:C},inheritAttrs:!1,props:{modelValue:{type:[String,Number,Object],default:""},name:{type:String,default:null},legend:{type:String,default:null},options:{type:Array,default:()=>[]},optionAttribute:{type:String,default:"label"},valueAttribute:{type:String,default:"value"},disabled:{type:Boolean,default:!1},color:{type:String,default:()=>d.default.color,validator(e){return l.ui.colors.includes(e)}},class:{type:[String,Object,Array],default:()=>""},ui:{type:Object,default:()=>({})},uiRadio:{type:Object,default:()=>({})}},emits:["update:modelValue","change"],setup(e,{emit:n}){const{ui:c,attrs:m}=b("radioGroup",u(e,"ui"),d,u(e,"class")),{ui:g}=b("radio",u(e,"uiRadio"),E),{emitFormChange:f,color:s,name:t}=X(e,d);z("radio-group",{color:s,name:t});const p=a=>{n("update:modelValue",a),n("change",a),f()},R=a=>o(a,e.valueAttribute,o(a,e.optionAttribute)),_=a=>o(a,e.optionAttribute,o(a,e.valueAttribute)),h=a=>["string","number","boolean"].includes(typeof a)?{value:a,label:a}:{...a,value:R(a),label:_(a)},V=B(()=>e.options.map(a=>h(a)));return{ui:c,uiRadio:g,attrs:m,normalizedOptions:V,onUpdate:p}}});function J(e,n,c,m,g,f){const s=C;return r(),i("div",{class:y(e.ui.wrapper)},[j("fieldset",S(A(e.attrs)),[e.legend||e.$slots.legend?(r(),i("legend",{key:0,class:y(e.ui.legend)},[v(e.$slots,"legend",{},()=>[w(G(e.legend),1)])],2)):N("",!0),(r(!0),i(F,null,T(e.normalizedOptions,t=>(r(),P(s,{key:t.value,label:t.label,"model-value":e.modelValue,value:t.value,disabled:t.disabled||e.disabled,ui:e.uiRadio,onChange:p=>e.onUpdate(t.value)},{label:W(()=>[v(e.$slots,"label",S(A({option:t})))]),_:2},1032,["label","model-value","value","disabled","ui","onChange"]))),128))],16)],2)}const K=k(I,[["render",J]]);export{K as _};