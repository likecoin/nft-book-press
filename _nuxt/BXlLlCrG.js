const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./DfH2dYqK.js","./D-vwML4j.js","./entry.DOdxP3M6.css"])))=>i.map(i=>d[i]);
import{n as G,x as L,r as g,C as M,h as S,y as N,z as j,P as H,Q as J,o as c,B,w as C,a as u,b as a,G as p,J as R,c as y,R as w,S as U,t as K,T as W,M as X,U as Y}from"./D-vwML4j.js";import{_ as Z}from"./BY9aUTR5.js";import{_ as ee}from"./B4xDVTbH.js";import{_ as te}from"./B9L8OFIb.js";import{g as oe,a as ne,D as ae,b as le,d as se,_ as re}from"./U2VuAgG4.js";import{_ as ie}from"./BsCyrypI.js";import{p as de}from"./Cp2hUfLz.js";import"./IEhbL9cD.js";import"./n2vW2kNR.js";import"./BAfLZpvV.js";import"./C8VIr0GA.js";(function(){try{var v=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},k=new Error().stack;k&&(v._sentryDebugIds=v._sentryDebugIds||{},v._sentryDebugIds[k]="449f6a46-8ed1-4c50-966d-d692261be73f",v._sentryDebugIdIdentifier="sentry-dbid-449f6a46-8ed1-4c50-966d-d692261be73f")}catch{}})();const ce={class:"print:hidden flex justify-center"},ue={class:"flex justify-center items-center gap-2 print:hidden"},pe={class:"flex flex-col items-center gap-[2cm] print:gap-0"},_e={class:"text-xs text-center font-mono"},I="key,url",V=12,we=G({__name:"batch-qrcode",setup(v){const k=L(),n=g(""),q=`${I}
example01,https://example01.com
example02,https://example02.com`,_=g(ae),b=g(le),f=g(!1),Q=g(void 0),s=g([]),P=M(()=>{const t=[];for(let e=0;e<s.value.length;e+=V)t.push(s.value.slice(e,e+V));return t});S(n,()=>{s.value=[]}),S(_,()=>{s.value=[]}),N({title:"Batch Create Book QR Codes",ogTitle:"Batch Create Book QR Codes"}),j(()=>{try{const t=sessionStorage.getItem("nft_book_press_batch_qrcode");t&&(n.value=t,sessionStorage.removeItem("nft_book_press_batch_qrcode")),H(()=>{n.value&&D()})}catch(t){console.error(t)}});async function D(){try{let e=n.value;e.includes(I)||(e=`${I}
${e}`),s.value=de(e,{columns:!0,skip_empty_lines:!0})}catch(e){console.error(e),k.add({icon:"i-heroicons-exclamation-circle",title:"Failed to parse CSV input",timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}const{default:t}=await J(async()=>{const{default:e}=await import("./DfH2dYqK.js").then(r=>r.q);return{default:e}},__vite__mapDeps([0,1,2]),import.meta.url);s.value.forEach((e,r)=>{var d,i,x;const m=new t(oe({margin:0,data:e.url,image:_.value==="none"?void 0:ne(_.value),fillColor:b.value})),l=(d=Q.value)==null?void 0:d[r];l&&((i=l.querySelector("svg"))==null||i.remove(),m.append(l),(x=l.querySelector("svg"))==null||x.setAttribute("viewBox","0 0 300 300"))})}function T(t){if(!t)return;const[e]=t,r=new FileReader;r.onload=m=>{var d;const l=(d=m.target)==null?void 0:d.result;typeof l=="string"&&(n.value=l)},r.readAsText(e)}function A(){n.value&&window.print()}function F(){se(s.value.map(t=>({filename:t.key,url:t.url})))}return(t,e)=>{const r=Z,m=ee,l=W,d=te,i=X,x=re,O=Y,$=ie;return c(),B($,{class:"print:space-y-0 print:p-0"},{default:C(()=>{var E;return[e[8]||(e[8]=u("h1",{class:"text-lg font-bold font-mono print:hidden"}," Batch Create Book QR Codes ",-1)),a(m,{label:"Upload CSV file",class:"print:hidden"},{default:C(()=>[a(r,{type:"file",accept:"csv",onChange:T})]),_:1}),a(l,{class:"print:hidden",label:"OR"}),a(m,{class:"print:hidden",label:"Input CSV content"},{default:C(()=>[a(d,{modelValue:p(n),"onUpdate:modelValue":e[0]||(e[0]=o=>R(n)?n.value=o:null),class:"font-mono",placeholder:q,resize:!0},null,8,["modelValue"])]),_:1}),u("div",ce,[a(i,{label:"QR Code Appearance",variant:"outline",onClick:e[1]||(e[1]=o=>f.value=!0)})]),a(O,{modelValue:p(f),"onUpdate:modelValue":e[6]||(e[6]=o=>R(f)?f.value=o:null)},{default:C(()=>[a(x,{icon:p(_),"onUpdate:icon":e[3]||(e[3]=o=>R(_)?_.value=o:null),color:p(b),"onUpdate:color":e[4]||(e[4]=o=>R(b)?b.value=o:null),data:"https://books.liker.land",width:500,height:500,mode:"config",onSave:e[5]||(e[5]=o=>f.value=!1)},{header:C(()=>[e[7]||(e[7]=u("h3",{class:"font-bold font-mono"}," QR Code Config ",-1)),a(i,{icon:"i-heroicons-x-mark",color:"gray",variant:"ghost",onClick:e[2]||(e[2]=o=>f.value=!1)})]),_:1},8,["icon","color"])]),_:1},8,["modelValue"]),u("nav",ue,[(E=p(s))!=null&&E.length?(c(),y(w,{key:1},[a(i,{label:"Print",size:"lg",variant:"outline",onClick:A}),a(i,{label:"Download",size:"lg",variant:"outline",onClick:F})],64)):(c(),B(i,{key:0,label:"Generate",size:"lg",disabled:!p(n),onClick:D},null,8,["disabled"]))]),u("div",pe,[(c(!0),y(w,null,U(p(P),(o,z)=>(c(),y("ul",{key:z,class:"w-[20cm] grid grid-cols-3 items-center gap-[0.25cm] py-[0.5cm] break-before-page"},[(c(!0),y(w,null,U(o,h=>(c(),y("li",{key:h.key||h.url},[u("figure",{ref_for:!0,ref_key:"qrCodeRef",ref:Q,class:"qrcode"},[u("figcaption",_e,K(h.key||h.url),1)],512)]))),128))]))),128))])]}),_:1})}}});export{we as default};
//# sourceMappingURL=BXlLlCrG.js.map