import{b3 as S,b4 as p,_ as I,n as V,b8 as q,b9 as m,a6 as B,aX as D,C as y,bd as $,be as N,o as s,c as n,a as u,df as j,d5 as A,bk as O,an as t,a9 as E,d as F,t as v,H as f}from"./D-vwML4j.js";import{u as G}from"./IEhbL9cD.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},a=new Error().stack;a&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[a]="2d07ce52-d4e6-468c-9e48-312a32c7ab88",e._sentryDebugIdIdentifier="sentry-dbid-2d07ce52-d4e6-468c-9e48-312a32c7ab88")}catch{}})();const M={wrapper:"relative flex items-start",container:"flex items-center h-5",base:"h-4 w-4 dark:checked:bg-current dark:checked:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent",form:"form-radio",color:"text-{color}-500 dark:text-{color}-400",background:"bg-white dark:bg-gray-900",border:"border border-gray-300 dark:border-gray-700",ring:"focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",inner:"ms-3 flex flex-col",label:"text-sm font-medium text-gray-700 dark:text-gray-200",required:"text-sm text-red-500 dark:text-red-400",help:"text-sm text-gray-500 dark:text-gray-400",default:{color:"primary"}},c=S(p.ui.strategy,p.ui.radio,M),R=V({inheritAttrs:!1,props:{id:{type:String,default:null},value:{type:[String,Number,Boolean],default:null},modelValue:{type:[String,Number,Boolean,Object],default:null},name:{type:String,default:null},disabled:{type:Boolean,default:!1},help:{type:String,default:null},label:{type:String,default:null},required:{type:Boolean,default:!1},color:{type:String,default:()=>c.default.color,validator(e){return p.ui.colors.includes(e)}},inputClass:{type:String,default:null},class:{type:[String,Object,Array],default:()=>""},ui:{type:Object,default:()=>({})}},emits:["update:modelValue","change"],setup(e,{emit:a}){const{ui:r,attrs:g}=q("radio",m(e,"ui"),c,m(e,"class")),b=e.id??B(),i=D("radio-group",null),{emitFormChange:l,color:o,name:k}=i??G(e,c),h=y({get(){return e.modelValue},set(d){a("update:modelValue",d),i||l()}});function C(d){a("change",d.target.value)}const w=y(()=>$(N(r.value.base,r.value.form,r.value.background,r.value.border,o.value&&r.value.ring.replaceAll("{color}",o.value),o.value&&r.value.color.replaceAll("{color}",o.value)),e.inputClass));return{inputId:b,ui:r,attrs:g,pick:h,name:k,inputClass:w,onChange:C}}}),U=["data-n-ids"],z=["id","name","required","value","disabled"],H=["for"];function J(e,a,r,g,b,i){return s(),n("div",{class:t(e.ui.wrapper),"data-n-ids":e.attrs["data-n-ids"]},[u("div",{class:t(e.ui.container)},[j(u("input",O({id:e.inputId,"onUpdate:modelValue":a[0]||(a[0]=l=>e.pick=l),name:e.name,required:e.required,value:e.value,disabled:e.disabled,type:"radio",class:e.inputClass},e.attrs,{onChange:a[1]||(a[1]=(...l)=>e.onChange&&e.onChange(...l))}),null,16,z),[[A,e.pick]])],2),e.label||e.$slots.label?(s(),n("div",{key:0,class:t(e.ui.inner)},[u("label",{for:e.inputId,class:t(e.ui.label)},[E(e.$slots,"label",{},()=>[F(v(e.label),1)]),e.required?(s(),n("span",{key:0,class:t(e.ui.required)},"*",2)):f("",!0)],10,H),e.help?(s(),n("p",{key:0,class:t(e.ui.help)},v(e.help),3)):f("",!0)],2)):f("",!0)],10,U)}const X=I(R,[["render",J]]);export{X as _,M as r};
//# sourceMappingURL=BAfLZpvV.js.map