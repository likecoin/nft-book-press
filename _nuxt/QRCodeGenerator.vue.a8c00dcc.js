import{g as F,k as b,r as d,I as Q,l as G,B as O,o as w,m as U,w as u,X as j,q as l,c as A,J as M,b as i,s as h,v as D,a as S,R as T,C as J,D as z}from"./entry.86b36dbd.js";import{_ as W}from"./RadioGroup.351551c7.js";import{_ as X}from"./FormGroup.dff7daf8.js";import{_ as $}from"./Input.7ce145e7.js";import{_ as H}from"./Select.c1a9b54f.js";const K=""+new URL("nfc.78bae51f.png",import.meta.url).href,Y=""+new URL("logo.a394d739.png",import.meta.url).href,Z=[{value:"likecoin",label:"LikeCoin"},{value:"nfc",label:"NFC"},{value:"none",label:"None"}],k="likecoin",R="#28646e",E={likecoin:Y,nfc:K};function ee(r=k){return E[r]||E[k]}function oe({data:r="",width:m=300,height:e=300,fillColor:s=R,bgColor:_="#ffffff",margin:o=10,image:t=void 0}){return{width:m,height:e,type:"svg",image:t,margin:o,imageOptions:{hideBackgroundDots:!0,imageSize:.3,margin:10},dotsOptions:{color:s,type:"rounded"},backgroundOptions:{color:_},cornersSquareOptions:{color:s,type:"extra-rounded"},cornersDotOptions:{color:s,type:"dot"},data:r}}const te={class:"grid grid-cols-2 gap-4 p-4 print:hidden"},se=F({__name:"QRCodeGenerator",props:{data:{type:String,default:""},fileName:{type:String,default:""},icon:{type:String,default:k},color:{type:String,default:R},width:{type:Number,default:300},height:{type:Number,default:300},mode:{type:String,default:"download"}},emits:["save","update:icon","update:color"],setup(r,{emit:m}){const e=r,s=b(()=>e.mode==="download"),_=b(()=>e.mode==="config"),o=d(e.icon),t=d(e.color),p=d("svg"),f=m,v=b(()=>oe({width:e.width,height:e.height,data:e.data,fillColor:t.value,image:o.value==="none"?void 0:ee(o.value)})),g=d(null),y=d(null);Q([o,t,()=>e.data],()=>{var a;(a=g.value)==null||a.update(v.value)}),G(async()=>{const{default:a}=await O(()=>import("./qr-code-styling.1aa1a37d.js").then(n=>n.q),["./qr-code-styling.1aa1a37d.js","./entry.86b36dbd.js","./entry.a8f8d0e2.css"],import.meta.url);g.value=new a(v.value),y.value&&g.value.append(y.value)});async function N(){const{default:a}=await O(()=>import("./qr-code-styling.1aa1a37d.js").then(C=>C.q),["./qr-code-styling.1aa1a37d.js","./entry.86b36dbd.js","./entry.a8f8d0e2.css"],import.meta.url);new a(v.value).download({extension:p.value,name:e.fileName})}function I(){f("update:icon",o.value),f("update:color",t.value),f("save",{icon:o.value,color:t.value})}return(a,n)=>{const C=W,x=X,L=$,q=T,B=H,V=J,P=z;return w(),U(P,{ui:{header:{base:"flex justify-between items-center gap-2"},body:{padding:""},footer:{base:"flex justify-center items-center gap-2"}}},{header:u(()=>[j(a.$slots,"header")]),footer:u(()=>[l(s)?(w(),A(M,{key:0},[i(B,{modelValue:l(p),"onUpdate:modelValue":n[2]||(n[2]=c=>h(p)?p.value=c:null),options:[{value:"svg",label:"SVG"},{value:"png",label:"PNG"},{value:"jpeg",label:"JPEG"},{value:"webp",label:"WEBP"}]},null,8,["modelValue"]),i(V,{label:"Download",variant:"outline",color:"primary",onClick:N})],64)):D("",!0),l(_)?(w(),U(V,{key:1,label:"Save Config",variant:"outline",color:"primary",onClick:I})):D("",!0)]),default:u(()=>[S("div",te,[i(x,{label:"Pick an icon"},{default:u(()=>[i(C,{modelValue:l(o),"onUpdate:modelValue":n[0]||(n[0]=c=>h(o)?o.value=c:null),options:l(Z)},null,8,["modelValue","options"])]),_:1}),i(x,{label:"Pick a color"},{default:u(()=>[i(L,{modelValue:l(t),"onUpdate:modelValue":n[1]||(n[1]=c=>h(t)?t.value=c:null),type:"color",placeholder:l(R)},null,8,["modelValue","placeholder"])]),_:1})]),i(q),S("div",{id:"qr-code",ref_key:"qrCodeRef",ref:y,class:"flex justify-center items-center py-2"},null,512)]),_:3})}}});export{k as D,se as _,ee as a,R as b,oe as g};