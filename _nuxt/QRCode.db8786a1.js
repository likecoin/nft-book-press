import{g as O,r as S,an as be,l as g,aI as ge,aJ as ye,am as w,K as _e,ao as he,ak as Ie,ap as q,au as K,aw as Y,ax as Me,aB as ke,az as ee,k as Z,aC as Se,aA as we,ac as N,aD as Ce,aF as I,d7 as Re,b5 as te,d8 as le,aE as Te,_ as X,aK as ue,d9 as Ve,aM as B,a3 as se,aO as re,da as ie,aP as de,aQ as G,aR as De,aS as Pe,db as $e,aX as L,o as _,q as P,w as h,b as M,L as J,a as D,c as V,ae as $,a$ as pe,a_ as Oe,aZ as x,v as z,F as j,a7 as H,aY as Ae,t as ae,d as Ne,e as Ue,dc as xe,aT as ne,aU as U,d1 as Be,cV as Ee,i as Le,j as ze,m as ce,n as C,x as W,C as me,D as ve,bm as oe}from"./entry.43ea1bb0.js";import{p as Fe,b as je,u as He,x as qe,a as R}from"./use-text-value.8715ba87.js";import{_ as Ke}from"./Input.51457502.js";import{_ as Qe}from"./FormGroup.8043780e.js";import{a as Ge}from"./uid.471b6713.js";import{_ as Je}from"./Modal.d6ceaf86.js";import{_ as We}from"./Select.fd7396c3.js";var Ye=(e=>(e[e.Open=0]="Open",e[e.Closed=1]="Closed",e))(Ye||{}),Ze=(e=>(e[e.Pointer=0]="Pointer",e[e.Other=1]="Other",e))(Ze||{});function Xe(e){requestAnimationFrame(()=>requestAnimationFrame(e))}let fe=Symbol("MenuContext");function Q(e){let m=Ce(fe,null);if(m===null){let u=new Error(`<${e} /> is missing a parent <Menu /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(u,Q),u}return m}let et=O({name:"Menu",props:{as:{type:[Object,String],default:"template"}},setup(e,{slots:m,attrs:u}){let b=S(1),t=S(null),f=S(null),n=S([]),s=S(""),r=S(null),i=S(1);function a(o=d=>d){let d=r.value!==null?n.value[r.value]:null,p=Te(o(n.value.slice()),v=>w(v.dataRef.domRef)),l=d?p.indexOf(d):null;return l===-1&&(l=null),{items:p,activeItemIndex:l}}let c={menuState:b,buttonRef:t,itemsRef:f,items:n,searchQuery:s,activeItemIndex:r,activationTrigger:i,closeMenu:()=>{b.value=1,r.value=null},openMenu:()=>b.value=0,goToItem(o,d,p){let l=a(),v=qe(o===R.Specific?{focus:R.Specific,id:d}:{focus:o},{resolveItems:()=>l.items,resolveActiveIndex:()=>l.activeItemIndex,resolveId:k=>k.id,resolveDisabled:k=>k.dataRef.disabled});s.value="",r.value=v,i.value=p??1,n.value=l.items},search(o){let d=s.value!==""?0:1;s.value+=o.toLowerCase();let p=(r.value!==null?n.value.slice(r.value+d).concat(n.value.slice(0,r.value+d)):n.value).find(v=>v.dataRef.textValue.startsWith(s.value)&&!v.dataRef.disabled),l=p?n.value.indexOf(p):-1;l===-1||l===r.value||(r.value=l,i.value=1)},clearSearch(){s.value=""},registerItem(o,d){let p=a(l=>[...l,{id:o,dataRef:d}]);n.value=p.items,r.value=p.activeItemIndex,i.value=1},unregisterItem(o){let d=a(p=>{let l=p.findIndex(v=>v.id===o);return l!==-1&&p.splice(l,1),p});n.value=d.items,r.value=d.activeItemIndex,i.value=1}};return be([t,f],(o,d)=>{var p;c.closeMenu(),ge(d,ye.Loose)||(o.preventDefault(),(p=w(t))==null||p.focus())},g(()=>b.value===0)),_e(fe,c),he(g(()=>Ie(b.value,{[0]:q.Open,[1]:q.Closed}))),()=>{let o={open:b.value===0,close:c.closeMenu};return K({ourProps:{},theirProps:e,slot:o,slots:m,attrs:u,name:"Menu"})}}}),tt=O({name:"MenuButton",props:{disabled:{type:Boolean,default:!1},as:{type:[Object,String],default:"button"},id:{type:String,default:()=>`headlessui-menu-button-${Y()}`}},setup(e,{attrs:m,slots:u,expose:b}){let t=Q("MenuButton");b({el:t.buttonRef,$el:t.buttonRef});function f(i){switch(i.key){case I.Space:case I.Enter:case I.ArrowDown:i.preventDefault(),i.stopPropagation(),t.openMenu(),N(()=>{var a;(a=w(t.itemsRef))==null||a.focus({preventScroll:!0}),t.goToItem(R.First)});break;case I.ArrowUp:i.preventDefault(),i.stopPropagation(),t.openMenu(),N(()=>{var a;(a=w(t.itemsRef))==null||a.focus({preventScroll:!0}),t.goToItem(R.Last)});break}}function n(i){switch(i.key){case I.Space:i.preventDefault();break}}function s(i){e.disabled||(t.menuState.value===0?(t.closeMenu(),N(()=>{var a;return(a=w(t.buttonRef))==null?void 0:a.focus({preventScroll:!0})})):(i.preventDefault(),t.openMenu(),Xe(()=>{var a;return(a=w(t.itemsRef))==null?void 0:a.focus({preventScroll:!0})})))}let r=Me(g(()=>({as:e.as,type:m.type})),t.buttonRef);return()=>{var i;let a={open:t.menuState.value===0},{id:c,...o}=e,d={ref:t.buttonRef,id:c,type:r.value,"aria-haspopup":"menu","aria-controls":(i=w(t.itemsRef))==null?void 0:i.id,"aria-expanded":t.menuState.value===0,onKeydown:f,onKeyup:n,onClick:s};return K({ourProps:d,theirProps:o,slot:a,attrs:m,slots:u,name:"MenuButton"})}}}),at=O({name:"MenuItems",props:{as:{type:[Object,String],default:"div"},static:{type:Boolean,default:!1},unmount:{type:Boolean,default:!0},id:{type:String,default:()=>`headlessui-menu-items-${Y()}`}},setup(e,{attrs:m,slots:u,expose:b}){let t=Q("MenuItems"),f=S(null);b({el:t.itemsRef,$el:t.itemsRef}),Fe({container:g(()=>w(t.itemsRef)),enabled:g(()=>t.menuState.value===0),accept(a){return a.getAttribute("role")==="menuitem"?NodeFilter.FILTER_REJECT:a.hasAttribute("role")?NodeFilter.FILTER_SKIP:NodeFilter.FILTER_ACCEPT},walk(a){a.setAttribute("role","none")}});function n(a){var c;switch(f.value&&clearTimeout(f.value),a.key){case I.Space:if(t.searchQuery.value!=="")return a.preventDefault(),a.stopPropagation(),t.search(a.key);case I.Enter:if(a.preventDefault(),a.stopPropagation(),t.activeItemIndex.value!==null){let o=t.items.value[t.activeItemIndex.value];(c=w(o.dataRef.domRef))==null||c.click()}t.closeMenu(),le(w(t.buttonRef));break;case I.ArrowDown:return a.preventDefault(),a.stopPropagation(),t.goToItem(R.Next);case I.ArrowUp:return a.preventDefault(),a.stopPropagation(),t.goToItem(R.Previous);case I.Home:case I.PageUp:return a.preventDefault(),a.stopPropagation(),t.goToItem(R.First);case I.End:case I.PageDown:return a.preventDefault(),a.stopPropagation(),t.goToItem(R.Last);case I.Escape:a.preventDefault(),a.stopPropagation(),t.closeMenu(),N(()=>{var o;return(o=w(t.buttonRef))==null?void 0:o.focus({preventScroll:!0})});break;case I.Tab:a.preventDefault(),a.stopPropagation(),t.closeMenu(),N(()=>Re(w(t.buttonRef),a.shiftKey?te.Previous:te.Next));break;default:a.key.length===1&&(t.search(a.key),f.value=setTimeout(()=>t.clearSearch(),350));break}}function s(a){switch(a.key){case I.Space:a.preventDefault();break}}let r=ke(),i=g(()=>r!==null?(r.value&q.Open)===q.Open:t.menuState.value===0);return()=>{var a,c;let o={open:t.menuState.value===0},{id:d,...p}=e,l={"aria-activedescendant":t.activeItemIndex.value===null||(a=t.items.value[t.activeItemIndex.value])==null?void 0:a.id,"aria-labelledby":(c=w(t.buttonRef))==null?void 0:c.id,id:d,onKeydown:n,onKeyup:s,role:"menu",tabIndex:0,ref:t.itemsRef};return K({ourProps:l,theirProps:p,slot:o,attrs:m,slots:u,features:ee.RenderStrategy|ee.Static,visible:i.value,name:"MenuItems"})}}}),nt=O({name:"MenuItem",inheritAttrs:!1,props:{as:{type:[Object,String],default:"template"},disabled:{type:Boolean,default:!1},id:{type:String,default:()=>`headlessui-menu-item-${Y()}`}},setup(e,{slots:m,attrs:u,expose:b}){let t=Q("MenuItem"),f=S(null);b({el:f,$el:f});let n=g(()=>t.activeItemIndex.value!==null?t.items.value[t.activeItemIndex.value].id===e.id:!1),s=je(f),r=g(()=>({disabled:e.disabled,get textValue(){return s()},domRef:f}));Z(()=>t.registerItem(e.id,r)),Se(()=>t.unregisterItem(e.id)),we(()=>{t.menuState.value===0&&n.value&&t.activationTrigger.value!==0&&N(()=>{var l,v;return(v=(l=w(f))==null?void 0:l.scrollIntoView)==null?void 0:v.call(l,{block:"nearest"})})});function i(l){if(e.disabled)return l.preventDefault();t.closeMenu(),le(w(t.buttonRef))}function a(){if(e.disabled)return t.goToItem(R.Nothing);t.goToItem(R.Specific,e.id)}let c=He();function o(l){c.update(l)}function d(l){c.wasMoved(l)&&(e.disabled||n.value||t.goToItem(R.Specific,e.id,0))}function p(l){c.wasMoved(l)&&(e.disabled||n.value&&t.goToItem(R.Nothing))}return()=>{let{disabled:l}=e,v={active:n.value,disabled:l,close:t.closeMenu},{id:k,...T}=e;return K({ourProps:{id:k,ref:f,role:"menuitem",tabIndex:l===!0?void 0:-1,"aria-disabled":l===!0?!0:void 0,disabled:void 0,onClick:i,onFocus:a,onPointerenter:o,onMouseenter:o,onPointermove:d,onMousemove:d,onPointerleave:p,onMouseleave:p},theirProps:{...u,...T},slot:v,attrs:u,slots:m,name:"MenuItem"})}}});const ot=ue(B.ui.strategy,B.ui.dropdown,Ve),lt=O({components:{HMenu:et,HMenuButton:tt,HMenuItems:at,HMenuItem:nt,UIcon:se,UAvatar:re,UKbd:ie},inheritAttrs:!1,props:{items:{type:Array,default:()=>[]},mode:{type:String,default:"click",validator:e=>["click","hover"].includes(e)},disabled:{type:Boolean,default:!1},popper:{type:Object,default:()=>({})},openDelay:{type:Number,default:0},closeDelay:{type:Number,default:0},class:{type:[String,Object,Array],default:void 0},ui:{type:Object,default:void 0}},setup(e){const{ui:m,attrs:u}=de("dropdown",G(e,"ui"),ot,G(e,"class")),b=g(()=>De(e.mode==="hover"?{offsetDistance:0}:{},e.popper,m.value.popper)),[t,f]=Pe(b.value),n=S(null);let s=null,r=null;Z(()=>{setTimeout(()=>{var l;const d=(l=t.value)==null?void 0:l.$.provides;if(!d)return;const p=Object.getOwnPropertySymbols(d);n.value=p.length&&d[p[0]]},200)});const i=g(()=>{var p,l;const d=((p=e.popper)==null?void 0:p.offsetDistance)||((l=m.value.popper)==null?void 0:l.offsetDistance)||8;return e.mode==="hover"?{paddingTop:`${d}px`,paddingBottom:`${d}px`}:{}});function a(){e.mode!=="hover"||!n.value||(r&&(clearTimeout(r),r=null),n.value.menuState!==0&&(s=s||setTimeout(()=>{n.value.openMenu&&n.value.openMenu(),s=null},e.openDelay)))}function c(){e.mode!=="hover"||!n.value||(s&&(clearTimeout(s),s=null),n.value.menuState!==1&&(r=r||setTimeout(()=>{n.value.closeMenu&&n.value.closeMenu(),r=null},e.closeDelay)))}return{ui:m,attrs:u,popper:b,trigger:t,container:f,containerStyle:i,onMouseOver:a,onMouseLeave:c,omit:$e,NuxtLink:Ue}}}),ut=["disabled"],st={class:"truncate"};function rt(e,m,u,b,t,f){const n=L("HMenuButton"),s=se,r=re,i=ie,a=L("HMenuItem"),c=L("HMenuItems"),o=L("HMenu");return _(),P(o,x({as:"div",class:e.ui.wrapper},e.attrs,{onMouseleave:e.onMouseLeave}),{default:h(({open:d})=>[M(n,{ref:"trigger",as:"div",disabled:e.disabled,class:"inline-flex w-full",role:"button",onMouseover:e.onMouseOver},{default:h(()=>[J(e.$slots,"default",{open:d,disabled:e.disabled},()=>[D("button",{disabled:e.disabled}," Open ",8,ut)])]),_:2},1032,["disabled","onMouseover"]),d&&e.items.length?(_(),V("div",{key:0,ref:"container",class:$([e.ui.container,e.ui.width]),style:pe(e.containerStyle),onMouseover:m[0]||(m[0]=(...p)=>e.onMouseOver&&e.onMouseOver(...p))},[M(Oe,x({appear:""},e.ui.transition),{default:h(()=>[D("div",null,[e.popper.arrow?(_(),V("div",{key:0,"data-popper-arrow":"",class:$(["invisible before:visible before:block before:rotate-45 before:z-[-1]",Object.values(e.ui.arrow)])},null,2)):z("",!0),M(c,{class:$([e.ui.base,e.ui.divide,e.ui.ring,e.ui.rounded,e.ui.shadow,e.ui.background,e.ui.height]),static:""},{default:h(()=>[(_(!0),V(j,null,H(e.items,(p,l)=>(_(),V("div",{key:l,class:$(e.ui.padding)},[(_(!0),V(j,null,H(p,(v,k)=>(_(),P(a,{key:k,disabled:v.disabled},{default:h(({active:T,disabled:y})=>[(_(),P(Ae(v.to?e.NuxtLink:"button"),x(e.omit(v,["label","slot","icon","iconClass","avatar","shortcuts","disabled","click"]),{class:[e.ui.item.base,e.ui.item.padding,e.ui.item.size,e.ui.item.rounded,T?e.ui.item.active:e.ui.item.inactive,y&&e.ui.item.disabled],onClick:v.click}),{default:h(()=>[J(e.$slots,v.slot||"item",{item:v},()=>{var A;return[v.icon?(_(),P(s,{key:0,name:v.icon,class:$([e.ui.item.icon.base,T?e.ui.item.icon.active:e.ui.item.icon.inactive,v.iconClass])},null,8,["name","class"])):v.avatar?(_(),P(r,x({key:1},{size:e.ui.item.avatar.size,...v.avatar},{class:e.ui.item.avatar.base}),null,16,["class"])):z("",!0),D("span",st,ae(v.label),1),(A=v.shortcuts)!=null&&A.length?(_(),V("span",{key:2,class:$(e.ui.item.shortcuts)},[(_(!0),V(j,null,H(v.shortcuts,E=>(_(),P(i,{key:E},{default:h(()=>[Ne(ae(E),1)]),_:2},1024))),128))],2)):z("",!0)]})]),_:2},1040,["class","onClick"]))]),_:2},1032,["disabled"]))),128))],2))),128))]),_:3},8,["class"])])]),_:3},16)],38)):z("",!0)]),_:3},16,["class","onMouseleave"])}const wt=X(lt,[["render",rt]]),F=ue(B.ui.strategy,B.ui.range,xe),it=O({inheritAttrs:!1,props:{modelValue:{type:Number,default:0},id:{type:String,default:null},name:{type:String,default:null},disabled:{type:Boolean,default:!1},min:{type:Number,default:0},max:{type:Number,default:100},step:{type:Number,default:1},size:{type:String,default:null,validator(e){return Object.keys(F.size).includes(e)}},color:{type:String,default:()=>F.default.color,validator(e){return B.ui.colors.includes(e)}},inputClass:{type:String,default:null},class:{type:[String,Object,Array],default:void 0},ui:{type:Object,default:void 0}},emits:["update:modelValue","change"],setup(e,{emit:m}){const{ui:u,attrs:b}=de("range",G(e,"ui"),F),{emitFormChange:t,inputId:f,color:n,size:s,name:r}=Ge(e,F),i=g({get(){return e.modelValue},set(k){m("update:modelValue",k)}}),a=k=>{m("change",k),t()},c=g(()=>ne(U(u.value.wrapper,u.value.size[s.value]),e.class)),o=g(()=>ne(U(u.value.base,u.value.background,u.value.rounded,u.value.ring.replaceAll("{color}",n.value),u.value.size[s.value]),e.inputClass)),d=g(()=>U(u.value.thumb.base,u.value.thumb.color.replaceAll("{color}",n.value),u.value.thumb.ring,u.value.thumb.background,u.value.thumb.size[s.value])),p=g(()=>U(u.value.track.base,u.value.track.background,u.value.track.rounded,u.value.track.size[s.value])),l=g(()=>U(u.value.progress.base,u.value.progress.rounded,u.value.progress.background.replaceAll("{color}",n.value),u.value.progress.size[s.value])),v=g(()=>{const{modelValue:k,min:T,max:y}=e;return{width:`${(Math.max(T,Math.min(k,y))-T)/(y-T)*100}%`}});return{ui:u,attrs:b,name:r,inputId:f,value:i,wrapperClass:c,inputClass:o,thumbClass:d,trackClass:p,progressClass:l,progressStyle:v,onChange:a}}}),dt=["id","name","min","max","disabled","step"];function pt(e,m,u,b,t,f){return _(),V("div",{class:$(e.wrapperClass)},[Be(D("input",x({id:e.inputId,ref:"input","onUpdate:modelValue":m[0]||(m[0]=n=>e.value=n),name:e.name,min:e.min,max:e.max,disabled:e.disabled,step:e.step,type:"range",class:[e.inputClass,e.thumbClass,e.trackClass]},e.attrs,{onChange:m[1]||(m[1]=(...n)=>e.onChange&&e.onChange(...n))}),null,16,dt),[[Ee,e.value,void 0,{number:!0}]]),D("span",{class:$(e.progressClass),style:pe(e.progressStyle)},null,6)],2)}const ct=X(it,[["render",pt]]),mt=D("h3",{class:"font-bold font-mono"}," New Coupon ",-1),vt={class:"flex gap-4 items-center"},ft={class:"flex gap-1"},Ct=O({__name:"NewCouponModal",props:{modelValue:{type:Boolean}},emits:["update:modelValue","add"],setup(e,{emit:m}){const u=Le(),b=ze(),t=e,f=m,n=g({get(){return!!u.query.new_coupon},set(c){f("update:modelValue",c),b.replace({query:{...u.query,new_coupon:c?"1":void 0}})}}),s=S({id:"",discount:1,expireTs:""}),r=[50,70,80,85,90,95].map(c=>({label:`${100-c}%`,value:c})),i=g({get(){return s.value.discount*100},set(c){s.value.discount=c/100}});ce(()=>t.modelValue,c=>{n.value=c,c&&(s.value={id:"",discount:1,expireTs:""})},{immediate:!0});function a(){n.value=!1,f("add",{...s.value,expireTs:s.value.expireTs?new Date(s.value.expireTs).getTime():null})}return(c,o)=>{const d=Ke,p=Qe,l=ct,v=me,k=ve,T=Je;return _(),P(T,{modelValue:C(n),"onUpdate:modelValue":o[5]||(o[5]=y=>W(n)?n.value=y:null)},{default:h(()=>[M(k,{ui:{body:{base:"space-y-4"},footer:{base:"flex justify-end gap-2"}}},{header:h(()=>[mt]),footer:h(()=>[M(v,{label:"Cancel",color:"gray",onClick:o[4]||(o[4]=y=>n.value=!1)}),M(v,{label:"Add",disabled:!(C(s).id&&C(s).discount),onClick:a},null,8,["disabled"])]),default:h(()=>[M(p,{label:"Coupon Code"},{default:h(()=>[M(d,{modelValue:C(s).id,"onUpdate:modelValue":o[0]||(o[0]=y=>C(s).id=y),placeholder:"coupon_code",ui:{base:"font-mono"}},null,8,["modelValue"])]),_:1}),M(p,{label:"Discount Multiplier",description:"Between 0.01x and 1x"},{help:h(()=>[D("ul",ft,[(_(!0),V(j,null,H(C(r),({label:y,value:A})=>(_(),V("li",{key:y},[M(v,{label:y,color:C(i)===A?"primary":"gray",size:"2xs",onClick:E=>i.value=A},null,8,["label","color","onClick"])]))),128))])]),default:h(()=>[D("div",vt,[M(l,{modelValue:C(i),"onUpdate:modelValue":o[1]||(o[1]=y=>W(i)?i.value=y:null),step:5},null,8,["modelValue"]),M(d,{modelValue:C(s).discount,"onUpdate:modelValue":o[2]||(o[2]=y=>C(s).discount=y),type:"number",step:.01,min:.01,max:1,ui:{base:"min-w-[80px] text-right"}},null,8,["modelValue"])])]),_:1}),M(p,{label:"Expiry Date"},{default:h(()=>[M(d,{modelValue:C(s).expireTs,"onUpdate:modelValue":o[3]||(o[3]=y=>C(s).expireTs=y),type:"date"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"])}}}),bt=""+new URL("logo.a394d739.png",import.meta.url).href,gt=O({__name:"QRCode",props:{data:{type:String,default:""},fileName:{type:String,default:""},width:{type:Number,default:300},height:{type:Number,default:300}},setup(e){const m=e,u=S("svg"),b=S({width:m.width,height:m.height,type:"svg",image:bt,margin:10,imageOptions:{hideBackgroundDots:!0,imageSize:.3,margin:10},dotsOptions:{color:"#28646e",type:"rounded"},backgroundOptions:{color:"#ffffff"},cornersSquareOptions:{color:"#28646e",type:"extra-rounded"},cornersDotOptions:{color:"#28646e",type:"dot"}}),t=g(()=>({...b.value,data:m.data})),f=S(null),n=S(null);ce(()=>m.data,()=>{var r;(r=f.value)==null||r.update(t.value)}),Z(async()=>{const{default:r}=await oe(()=>import("./qr-code-styling.058a609a.js").then(i=>i.q),["./qr-code-styling.058a609a.js","./entry.43ea1bb0.js","./entry.cba18cc1.css"],import.meta.url);f.value=new r(t.value),n.value&&f.value.append(n.value)});async function s(){const{default:r}=await oe(()=>import("./qr-code-styling.058a609a.js").then(a=>a.q),["./qr-code-styling.058a609a.js","./entry.43ea1bb0.js","./entry.cba18cc1.css"],import.meta.url);new r(t.value).download({extension:u.value,name:m.fileName})}return(r,i)=>{const a=We,c=me,o=ve;return _(),P(o,{ui:{body:{padding:""},footer:{base:"flex items-center gap-2"}}},{header:h(()=>[J(r.$slots,"header",{},void 0,!0)]),footer:h(()=>[M(a,{modelValue:C(u),"onUpdate:modelValue":i[0]||(i[0]=d=>W(u)?u.value=d:null),options:[{value:"svg",label:"SVG"},{value:"png",label:"PNG"},{value:"jpeg",label:"JPEG"},{value:"webp",label:"WEBP"}]},null,8,["modelValue"]),M(c,{label:"Download",variant:"outline",color:"primary",onClick:s})]),default:h(()=>[D("div",{id:"qr-code",ref_key:"qrCodeRef",ref:n},null,512)]),_:3})}}});const Rt=X(gt,[["__scopeId","data-v-eaf80cec"]]);export{wt as _,Ct as a,Rt as b};