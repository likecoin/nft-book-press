import{g as T,aw as ee,aD as te,l as d,r as V,ax as ae,am as ne,k as oe,m as X,aq as K,ar as le,as as se,at as ie,au as ue,av as re,F as ce,aF as P,_ as de,aK as pe,dd as fe,aM as F,a3 as q,aP as me,aQ as ve,aT as _e,aU as N,aX as ye,o as r,q as R,w as U,a as f,ae as A,c as y,b as g,v as S,aZ as ge,de as he,a6 as Z,cd as L,cN as G,n as c,t as O,df as Se,C as Ce,D as be}from"./entry.43ea1bb0.js";import{a as ke}from"./uid.471b6713.js";import{d as we,p as xe}from"./use-controllable.b230530f.js";import{_ as Ie}from"./Radio.405911cf.js";import{_ as Ae}from"./Alert.2b4e221d.js";import{_ as Ue}from"./Input.51457502.js";import{_ as Ve}from"./Progress.aeb233cd.js";import{u as z}from"./fetch.fd777a7c.js";let De=Symbol("GroupContext"),$e=T({name:"Switch",emits:{"update:modelValue":e=>!0},props:{as:{type:[Object,String],default:"button"},modelValue:{type:Boolean,default:void 0},defaultChecked:{type:Boolean,optional:!0},form:{type:String,optional:!0},name:{type:String,optional:!0},value:{type:String,optional:!0},id:{type:String,default:()=>`headlessui-switch-${ee()}`}},inheritAttrs:!1,setup(e,{emit:m,attrs:l,slots:v,expose:s}){let a=te(De,null),[t,h]=we(d(()=>e.modelValue),o=>m("update:modelValue",o),d(()=>e.defaultChecked));function u(){h(!t.value)}let _=V(null),p=a===null?_:a.switchRef,C=ae(d(()=>({as:e.as,type:l.type})),p);s({el:p,$el:p});function b(o){o.preventDefault(),u()}function D(o){o.key===P.Space?(o.preventDefault(),u()):o.key===P.Enter&&xe(o.currentTarget)}function w(o){o.preventDefault()}let k=d(()=>{var o,n;return(n=(o=ne(p))==null?void 0:o.closest)==null?void 0:n.call(o,"form")});return oe(()=>{X([k],()=>{if(!k.value||e.defaultChecked===void 0)return;function o(){h(e.defaultChecked)}return k.value.addEventListener("reset",o),()=>{var n;(n=k.value)==null||n.removeEventListener("reset",o)}},{immediate:!0})}),()=>{let{id:o,name:n,value:i,form:x,...$}=e,I={checked:t.value},E={id:o,ref:p,role:"switch",type:C.value,tabIndex:0,"aria-checked":t.value,"aria-labelledby":a==null?void 0:a.labelledby.value,"aria-describedby":a==null?void 0:a.describedby.value,onClick:b,onKeyup:D,onKeypress:w};return K(ce,[n!=null&&t.value!=null?K(le,se({features:ie.Hidden,as:"input",type:"checkbox",hidden:!0,readOnly:!0,checked:t.value,form:x,name:n,value:i})):null,ue({ourProps:E,theirProps:{...l,...re($,["modelValue","defaultChecked"])},slot:I,attrs:l,slots:v,name:"Switch"})])}}});const M=pe(F.ui.strategy,F.ui.toggle,fe),Ee=T({components:{HSwitch:$e,UIcon:q},inheritAttrs:!1,props:{id:{type:String,default:null},name:{type:String,default:null},modelValue:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},onIcon:{type:String,default:()=>M.default.onIcon},offIcon:{type:String,default:()=>M.default.offIcon},color:{type:String,default:()=>M.default.color,validator(e){return F.ui.colors.includes(e)}},class:{type:[String,Object,Array],default:void 0},ui:{type:Object,default:void 0}},emits:["update:modelValue"],setup(e,{emit:m}){const{ui:l,attrs:v}=me("toggle",ve(e,"ui"),M),{emitFormChange:s,color:a,inputId:t,name:h}=ke(e),u=d({get(){return e.modelValue},set(b){m("update:modelValue",b),s()}}),_=d(()=>_e(N(l.value.base,l.value.rounded,l.value.ring.replaceAll("{color}",a.value),(u.value?l.value.active:l.value.inactive).replaceAll("{color}",a.value)),e.class)),p=d(()=>N(l.value.icon.on.replaceAll("{color}",a.value))),C=d(()=>N(l.value.icon.off.replaceAll("{color}",a.value)));return{ui:l,attrs:v,name:h,inputId:t,active:u,switchClass:_,onIconClass:p,offIconClass:C}}});function We(e,m,l,v,s,a){const t=q,h=ye("HSwitch");return r(),R(h,ge({id:e.inputId,modelValue:e.active,"onUpdate:modelValue":m[0]||(m[0]=u=>e.active=u),name:e.name,disabled:e.disabled,class:e.switchClass},e.attrs),{default:U(()=>[f("span",{class:A([e.active?e.ui.container.active:e.ui.container.inactive,e.ui.container.base])},[e.onIcon?(r(),y("span",{key:0,class:A([e.active?e.ui.icon.active:e.ui.icon.inactive,e.ui.icon.base]),"aria-hidden":"true"},[g(t,{name:e.onIcon,class:A(e.onIconClass)},null,8,["name","class"])],2)):S("",!0),e.offIcon?(r(),y("span",{key:1,class:A([e.active?e.ui.icon.inactive:e.ui.icon.active,e.ui.icon.base]),"aria-hidden":"true"},[g(t,{name:e.offIcon,class:A(e.offIconClass)},null,8,["name","class"])],2)):S("",!0)],2)]),_:1},16,["id","modelValue","name","disabled","class"])}const Me=de(Ee,[["render",We]]),Re=he("stripe-connect",()=>{const e=V({});async function m(l){var a;e.value[l]={isReady:!1};const{data:v,error:s}=await z(`${Z}/likernft/book/user/connect/status?wallet=${l}`,"$nBk2xf0dpF");if(e.value[l]=(v==null?void 0:v.value)||{},s.value){if(s.value.statusCode!==404)throw new Error((a=s.value)==null?void 0:a.data.toString());console.error("STRIPE_CONNECT_INFO_NOT_FOUND")}}return{fetchStripeConnectStatus:m,stripeConnectStatusWalletMap:e}}),Be=f("h3",{class:"font-bold font-mono"}," Connect to a Stripe Account ",-1),Ne={key:0,class:"flex flex-col gap-[24px]"},Oe={class:"grid grid-cols-2 gap-[8px] w-full"},Fe={class:"flex flex-col w-full"},Te=f("div",null,"Use my account",-1),je={key:0,class:"flex flex-col items-start w-full"},He={class:"flex flex-col gap-[8px] mt-[12px] px-[6px] py-[4px] w-[80%]"},Ke={key:1},Pe={class:"flex flex-col w-full"},Le=f("span",null,"Use another Stripe Express account",-1),Ge={class:"flex flex-col mt-[14px] w-[80%]"},Xe={key:0,class:"text-red-700 text-[10px]"},qe={key:1,class:"flex flex-col gap-[8px] mt-[12px] px-[6px] py-[4px] w-[80%]"},Ze={key:0},ze={key:0},Je={class:"flex flex-col items-center justify-center gap-[8px] w-full"},Qe={key:0,class:"text-center text-green-800 text-[12px]"},it=T({__name:"StripeConnectCard",props:L({loginAddress:{type:String,default:""},shouldDisableSetting:{type:String,default:""},stripeConnectStatusWalletMap:{type:Object,default:()=>{}},stripeConnectWallet:{type:String,default:""},isUpdatingStripeAccount:{type:Boolean,default:!1}},{isStripeConnectChecked:{},isUsingDefaultAccount:{}}),emits:L(["save"],["update:isStripeConnectChecked","update:isUsingDefaultAccount"]),setup(e,{emit:m}){const l=Re(),{fetchStripeConnectStatus:v}=l,s=G(e,"isStripeConnectChecked"),a=G(e,"isUsingDefaultAccount"),t=e,h=m,u=V(""),_=V(""),p=V(!1),C=d(()=>{var n;return(n=t.stripeConnectStatusWalletMap[t.loginAddress])==null?void 0:n.isReady}),b=d(()=>{var n;return(n=t.stripeConnectStatusWalletMap[u.value])==null?void 0:n.isReady}),D=d(()=>!(!s.value||a.value&&!C.value||!a.value&&!b.value||_.value)),w=d(()=>t.stripeConnectStatusWalletMap[u.value]);X(()=>t.stripeConnectWallet,n=>{n&&!a.value&&(u.value=n)},{immediate:!0});async function k(n){if(!s.value)return;const i=n.target.value.trim();if(u.value=i,_.value="",!Se.test(i)){_.value="You have entered an invalid wallet address";return}if(t.stripeConnectStatusWalletMap[i])return t.stripeConnectStatusWalletMap[i];p.value=!0;try{await z(`${Z}/likernft/book/user/connect/status?wallet=${i}`,"$dZ7nAdl8XD"),await v(i)}catch(x){console.error(x)}finally{p.value=!1}}function o(){const n=a.value?t.loginAddress:u.value;h("save",n)}return(n,i)=>{const x=Me,$=Ie,I=Ae,E=Ce,J=Ue,Q=Ve,Y=be;return r(),R(Y,{ui:{divide:s.value?void 0:"",header:{base:"flex flex-wrap justify-between items-center gap-2"},body:{padding:s.value?void 0:""}}},{header:U(()=>[Be,g(x,{modelValue:s.value,"onUpdate:modelValue":i[0]||(i[0]=W=>s.value=W),name:"stripe",label:"Use a Stripe Connect account for receiving payments"},null,8,["modelValue"])]),default:U(()=>{var W,j,H;return[s.value?(r(),y("div",Ne,[f("div",Oe,[f("div",Fe,[g($,{modelValue:a.value,"onUpdate:modelValue":i[1]||(i[1]=B=>a.value=B),class:"w-[50%]",value:!0,disabled:!!t.shouldDisableSetting},{label:U(()=>[Te]),_:1},8,["modelValue","disabled"]),c(C)?(r(),y("div",je,[f("div",He,[g(I,{icon:"i-heroicons-check",color:"primary",variant:"outline",title:"Has Stripe Account"}),f("div",null,O(` Email: ${(W=t.stripeConnectStatusWalletMap[t.loginAddress])==null?void 0:W.email}`),1)])])):(r(),y("span",Ke,[g(E,{class:"mt-2",label:"Create one here",to:{name:"nft-book-store-user"},target:"_blank",variant:"outline"})]))]),f("div",Pe,[g($,{modelValue:a.value,"onUpdate:modelValue":i[2]||(i[2]=B=>a.value=B),value:!1,disabled:!!t.shouldDisableSetting},{label:U(()=>[Le]),_:1},8,["modelValue","disabled"]),f("div",Ge,[g(J,{value:c(u),color:c(_)?"rose":"white",class:"font-mono w-full",placeholder:"like1...",onInput:k},null,8,["value","color"]),c(_)?(r(),y("span",Xe,O(c(_)),1)):S("",!0)]),c(p)?(r(),R(Q,{key:0,class:"my-[6px]",animation:"carousel"})):c(w)?(r(),y("div",qe,[c(b)?(r(),y("div",Ze,[g(I,{icon:"i-heroicons-check",color:"primary",variant:"outline",title:"Has Stripe Account"}),(j=c(w))!=null&&j.email?(r(),y("span",ze,O(` Email: ${(H=c(w))==null?void 0:H.email}`),1)):S("",!0)])):(r(),R(I,{key:1,icon:"i-heroicons-x-mark",color:"red",variant:"outline",title:"No stripe account connected to this wallet yet."}))])):S("",!0)])]),f("div",Je,[g(E,{label:"Save Changes",loading:e.isUpdatingStripeAccount,color:c(D)?"primary":"gray",disabled:!c(D)||!!t.shouldDisableSetting,onClick:o},null,8,["loading","color","disabled"]),t.shouldDisableSetting?(r(),y("div",Qe," Successfully save the Stripe Connect account! ")):S("",!0)])])):S("",!0)]}),_:1},8,["ui"])}}});export{it as _,Me as a,Re as u};