import{_ as X}from"./Toggle.787a2c9c.js";import{_ as q}from"./Radio.db2eda8d.js";import{_ as z}from"./Alert.94c17f65.js";import{da as G,h as L,I as Y,H as Z,r as h,F as T,g as J,ca as N,cL as O,l as y,K as Q,o as i,q as U,w as g,b as r,c as u,a as c,s as a,t as I,x as m,C as ee,P as te,D as oe}from"./entry.6d4ed70f.js";import{_ as ne}from"./Input.f7c22f04.js";import{L as ae}from"./index.a4efc5ce.js";(function(){try{var s=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},d=new Error().stack;d&&(s._sentryDebugIds=s._sentryDebugIds||{},s._sentryDebugIds[d]="e3adcf65-832e-49b9-8feb-adbab583533a",s._sentryDebugIdIdentifier="sentry-dbid-e3adcf65-832e-49b9-8feb-adbab583533a")}catch{}})();const se=G("stripe-connect",()=>{const{LIKE_CO_API:s}=L().public,d=Y(),{token:v}=Z(d),_=h({});async function b(l){var x;_.value[l]={isReady:!1};const{data:n,error:e}=await T(`${s}/likernft/book/user/connect/status?wallet=${l}`,{headers:{authorization:`Bearer ${v.value}`}},"$nBk2xf0dpF");if(_.value[l]=(n==null?void 0:n.value)||{},e.value){if(e.value.statusCode!==404)throw new Error((x=e.value)==null?void 0:x.data.toString());console.error("STRIPE_CONNECT_INFO_NOT_FOUND")}}return{fetchStripeConnectStatus:b,stripeConnectStatusWalletMap:_}}),le=c("h3",{class:"font-bold font-mono"}," Connect to a Stripe Account ",-1),ie={key:0,class:"flex flex-col gap-[24px]"},ce={class:"grid grid-cols-2 gap-[8px] w-full"},re={class:"flex flex-col w-full"},ue=c("div",null,"Use my account",-1),de={key:0,class:"flex flex-col items-start w-full"},pe={class:"flex flex-col gap-[8px] mt-[12px] px-[6px] py-[4px] w-[80%]"},fe={key:1},_e={class:"flex flex-col w-full"},me=c("span",null,"Use another Stripe Express account",-1),ve={class:"flex flex-col mt-[14px] w-[80%]"},xe={key:0,class:"text-red-700 text-[10px]"},Se={key:1,class:"flex flex-col gap-[8px] mt-[12px] px-[6px] py-[4px] w-[80%]"},ye={key:0},ge={key:0},he={class:"flex flex-col items-center justify-center gap-[8px] w-full"},be={key:0,class:"text-center text-green-800 text-[12px]"},Ie=J({__name:"StripeConnectCard",props:N({loginAddress:{type:String,default:""},shouldDisableSetting:{type:Boolean,default:!1},stripeConnectStatusWalletMap:{type:Object,default:()=>{}},stripeConnectWallet:{type:String,default:""},isUpdatingStripeAccount:{type:Boolean,default:!1}},{isStripeConnectChecked:{},isUsingDefaultAccount:{}}),emits:N(["save"],["update:isStripeConnectChecked","update:isUsingDefaultAccount"]),setup(s,{emit:d}){const{LIKE_CO_API:v}=L().public,_=se(),{fetchStripeConnectStatus:b}=_,l=O(s,"isStripeConnectChecked"),n=O(s,"isUsingDefaultAccount"),e=s,x=d,p=h(""),f=h(""),C=h(!1),E=y(()=>{var t;return(t=e.stripeConnectStatusWalletMap[e.loginAddress])==null?void 0:t.isReady}),W=y(()=>{var t;return(t=e.stripeConnectStatusWalletMap[p.value])==null?void 0:t.isReady}),V=y(()=>!(!l.value||n.value&&!E.value||!n.value&&!W.value||f.value)),k=y(()=>e.stripeConnectStatusWalletMap[p.value]);Q(()=>e.stripeConnectWallet,t=>{t&&!n.value&&(p.value=t)},{immediate:!0});async function F(t){if(!l.value)return;const o=t.target.value.trim();if(p.value=o,f.value="",!ae.test(o)){f.value="You have entered an invalid wallet address";return}if(e.stripeConnectStatusWalletMap[o])return e.stripeConnectStatusWalletMap[o];C.value=!0;try{await T(`${v}/likernft/book/user/connect/status?wallet=${o}`,"$dZ7nAdl8XD"),await b(o)}catch(w){console.error(w)}finally{C.value=!1}}function P(){const t=n.value?e.loginAddress:p.value;x("save",t)}return(t,o)=>{const w=X,R=q,A=z,B=ee,K=ne,j=te,H=oe;return i(),U(H,{ui:{divide:l.value?void 0:"",header:{base:"flex flex-wrap justify-between items-center gap-2"},body:{padding:l.value?void 0:""}}},{header:g(()=>[le,r(w,{modelValue:l.value,"onUpdate:modelValue":o[0]||(o[0]=S=>l.value=S),name:"stripe",label:"Use a Stripe Connect account for receiving payments"},null,8,["modelValue"])]),default:g(()=>{var S,$,M;return[l.value?(i(),u("div",ie,[c("div",ce,[c("div",re,[r(R,{modelValue:n.value,"onUpdate:modelValue":o[1]||(o[1]=D=>n.value=D),class:"w-[50%]",value:!0,disabled:!!e.shouldDisableSetting},{label:g(()=>[ue]),_:1},8,["modelValue","disabled"]),a(E)?(i(),u("div",de,[c("div",pe,[r(A,{icon:"i-heroicons-check",color:"primary",variant:"outline",title:"Has Stripe Account"}),c("div",null,I(` Email: ${(S=e.stripeConnectStatusWalletMap[e.loginAddress])==null?void 0:S.email}`),1)])])):(i(),u("span",fe,[r(B,{class:"mt-2",label:"Create one here",to:{name:"nft-book-store-user"},target:"_blank",variant:"outline"})]))]),c("div",_e,[r(R,{modelValue:n.value,"onUpdate:modelValue":o[2]||(o[2]=D=>n.value=D),value:!1,disabled:!!e.shouldDisableSetting},{label:g(()=>[me]),_:1},8,["modelValue","disabled"]),c("div",ve,[r(K,{value:a(p),color:a(f)?"rose":"white",class:"font-mono w-full",placeholder:"like1...",onInput:F},null,8,["value","color"]),a(f)?(i(),u("span",xe,I(a(f)),1)):m("",!0)]),a(C)?(i(),U(j,{key:0,class:"my-[6px]",animation:"carousel"})):a(k)?(i(),u("div",Se,[a(W)?(i(),u("div",ye,[r(A,{icon:"i-heroicons-check",color:"primary",variant:"outline",title:"Has Stripe Account"}),($=a(k))!=null&&$.email?(i(),u("span",ge,I(` Email: ${(M=a(k))==null?void 0:M.email}`),1)):m("",!0)])):(i(),U(A,{key:1,icon:"i-heroicons-x-mark",color:"red",variant:"outline",title:"No stripe account connected to this wallet yet."}))])):m("",!0)])]),c("div",he,[r(B,{label:"Save Changes",loading:s.isUpdatingStripeAccount,color:a(V)?"primary":"gray",disabled:!a(V)||!!e.shouldDisableSetting,onClick:P},null,8,["loading","color","disabled"]),e.shouldDisableSetting?(i(),u("div",be," Successfully save the Stripe Connect account! ")):m("",!0)])])):m("",!0)]}),_:1},8,["ui"])}}});export{Ie as _,se as u};
//# sourceMappingURL=StripeConnectCard.vue.a1392d38.js.map