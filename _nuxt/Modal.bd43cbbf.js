import{_ as C,aT as T,aU as m,g as k,dg as B,dh as V,di as D,dj as H,aW as $,aX as g,k as y,an as s,o as v,m as h,w as o,b as u,b4 as d,a as p,ao as r,v as j,X as F}from"./entry.86b36dbd.js";const O={wrapper:"relative z-50",inner:"fixed inset-0 overflow-y-auto",container:"flex min-h-full items-end sm:items-center justify-center text-center",padding:"p-4 sm:p-0",margin:"sm:my-8",base:"relative text-left rtl:text-right overflow-hidden flex flex-col",overlay:{base:"fixed inset-0 transition-opacity",background:"bg-gray-200/75 dark:bg-gray-800/75",transition:{enter:"ease-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0"}},background:"bg-white dark:bg-gray-900",ring:"",rounded:"rounded-lg",shadow:"shadow-xl",width:"w-full sm:max-w-lg",height:"",fullscreen:"w-screen h-screen",transition:{enter:"ease-out duration-300",enterFrom:"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",enterTo:"opacity-100 translate-y-0 sm:scale-100",leave:"ease-in duration-200",leaveFrom:"opacity-100 translate-y-0 sm:scale-100",leaveTo:"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"}},P=T(m.ui.strategy,m.ui.modal,O),R=k({components:{HDialog:B,HDialogPanel:V,TransitionRoot:D,TransitionChild:H},inheritAttrs:!1,props:{modelValue:{type:Boolean,default:!1},appear:{type:Boolean,default:!1},overlay:{type:Boolean,default:!0},transition:{type:Boolean,default:!0},preventClose:{type:Boolean,default:!1},fullscreen:{type:Boolean,default:!1},class:{type:[String,Object,Array],default:()=>""},ui:{type:Object,default:()=>({})}},emits:["update:modelValue","close","close-prevented"],setup(e,{emit:t}){const{ui:l,attrs:c}=$("modal",g(e,"ui"),P,g(e,"class")),i=y({get(){return e.modelValue},set(a){t("update:modelValue",a)}}),f=y(()=>e.transition?{...l.value.transition}:{});function n(a){if(e.preventClose){t("close-prevented");return}i.value=a,t("close")}return{ui:l,attrs:c,isOpen:i,transitionClass:f,close:n}}});function N(e,t,l,c,i,f){const n=s("TransitionChild"),a=s("HDialogPanel"),w=s("HDialog"),b=s("TransitionRoot");return v(),h(b,{appear:e.appear,show:e.isOpen,as:"template"},{default:o(()=>[u(w,d({class:e.ui.wrapper},e.attrs,{onClose:e.close}),{default:o(()=>[e.overlay?(v(),h(n,d({key:0,as:"template",appear:e.appear},e.ui.overlay.transition),{default:o(()=>[p("div",{class:r([e.ui.overlay.base,e.ui.overlay.background])},null,2)]),_:1},16,["appear"])):j("",!0),p("div",{class:r(e.ui.inner)},[p("div",{class:r([e.ui.container,!e.fullscreen&&e.ui.padding])},[u(n,d({as:"template",appear:e.appear},e.transitionClass),{default:o(()=>[u(a,{class:r([e.ui.base,e.ui.background,e.ui.ring,e.ui.shadow,e.fullscreen?e.ui.fullscreen:[e.ui.width,e.ui.height,e.ui.rounded,e.ui.margin]])},{default:o(()=>[F(e.$slots,"default")]),_:3},8,["class"])]),_:3},16,["appear"])],2)],2)]),_:3},16,["class","onClose"])]),_:3},8,["appear","show"])}const U=C(R,[["render",N]]);export{U as _};