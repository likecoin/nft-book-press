import{g as z,k as M,v as g,x as G,y as S,l as N,m as j,L as H,M as J,o as d,r as U,w as y,b as l,z as u,C as R,a as _,c as b,N as w,O as V,P as K,I as W,Q as X,t as Y}from"./entry.c6854afe.js";import{_ as Z}from"./Input.3ae04d0e.js";import{_ as ee}from"./FormGroup.b896c5eb.js";import{_ as te}from"./Textarea.c83481c5.js";import{g as oe,a as ne,D as ae,b as le,d as se,_ as re}from"./QRCodeGenerator.vue.155bedea.js";import{_ as ie}from"./PageBody.vue.ec8e43c6.js";import{p as ce}from"./sync.539634c1.js";import"./useFormGroup.8531c5da.js";import"./RadioGroup.67690bb0.js";import"./Radio.51109a17.js";import"./Select.904b5df6.js";(function(){try{var v=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},h=new Error().stack;h&&(v._sentryDebugIds=v._sentryDebugIds||{},v._sentryDebugIds[h]="d9cbaebe-f9a1-43dd-9481-0b36cadc2d83",v._sentryDebugIdIdentifier="sentry-dbid-d9cbaebe-f9a1-43dd-9481-0b36cadc2d83")}catch{}})();const de=_("h1",{class:"text-lg font-bold font-mono print:hidden"}," Batch Create QR Codes ",-1),ue={class:"print:hidden flex justify-center"},_e=_("h3",{class:"font-bold font-mono"}," QR Code Config ",-1),pe={class:"flex justify-center items-center gap-2 print:hidden"},fe={class:"flex flex-col items-center gap-[2cm] print:gap-0"},me={class:"text-xs text-center font-mono"},I="key,url",q=12,Qe=z({__name:"batch-qrcode",setup(v){const h=M(),n=g(""),B=`${I}
example01,https://example01.com
example02,https://example02.com`,p=g(ae),x=g(le),f=g(!1),Q=g(void 0),r=g([]),P=G(()=>{const t=[];for(let e=0;e<r.value.length;e+=q)t.push(r.value.slice(e,e+q));return t});S(n,()=>{r.value=[]}),S(p,()=>{r.value=[]}),N({title:"Batch Create QR Codes",ogTitle:"Batch Create QR Codes"}),j(()=>{try{const t=sessionStorage.getItem("nft_book_press_batch_qrcode");t&&(n.value=t,sessionStorage.removeItem("nft_book_press_batch_qrcode")),H(()=>{n.value&&D()})}catch(t){console.error(t)}});async function D(){try{let e=n.value;e.includes(I)||(e=`${I}
${e}`),r.value=ce(e,{columns:!0,skip_empty_lines:!0})}catch(e){console.error(e),h.add({icon:"i-heroicons-exclamation-circle",title:"Failed to parse CSV input",timeout:0,color:"red",ui:{title:"text-red-400 dark:text-red-400"}})}const{default:t}=await J(()=>import("./qr-code-styling.ce47970e.js").then(e=>e.q),["./qr-code-styling.ce47970e.js","./entry.c6854afe.js","./entry.04eaf832.css"],import.meta.url);r.value.forEach((e,C)=>{var m,a,c;const i=new t(oe({margin:0,data:e.url,image:p.value==="none"?void 0:ne(p.value),fillColor:x.value})),s=(m=Q.value)==null?void 0:m[C];s&&((a=s.querySelector("svg"))==null||a.remove(),i.append(s),(c=s.querySelector("svg"))==null||c.setAttribute("viewBox","0 0 300 300"))})}function O(t){var s;if(!(t!=null&&t.target))return;const e=(s=t.target)==null?void 0:s.files;if(!e)return;const[C]=e,i=new FileReader;i.onload=m=>{var c;const a=(c=m.target)==null?void 0:c.result;typeof a=="string"&&(n.value=a)},i.readAsText(C)}function T(){n.value&&window.print()}function A(){se(r.value.map(t=>({filename:t.key,url:t.url})))}return(t,e)=>{const C=Z,i=ee,s=K,m=te,a=W,c=re,F=X,$=ie;return d(),U($,{class:"print:space-y-0 print:p-0"},{default:y(()=>{var E;return[de,l(i,{label:"Upload CSV file",class:"print:hidden"},{default:y(()=>[l(C,{type:"file",accept:"csv",onChange:O})]),_:1}),l(s,{class:"print:hidden",label:"OR"}),l(i,{class:"print:hidden",label:"Input CSV content"},{default:y(()=>[l(m,{modelValue:u(n),"onUpdate:modelValue":e[0]||(e[0]=o=>R(n)?n.value=o:null),class:"font-mono",placeholder:B,resize:!0},null,8,["modelValue"])]),_:1}),_("div",ue,[l(a,{label:"QR Code Appearance",variant:"outline",onClick:e[1]||(e[1]=o=>f.value=!0)})]),l(F,{modelValue:u(f),"onUpdate:modelValue":e[6]||(e[6]=o=>R(f)?f.value=o:null)},{default:y(()=>[l(c,{icon:u(p),"onUpdate:icon":e[3]||(e[3]=o=>R(p)?p.value=o:null),color:u(x),"onUpdate:color":e[4]||(e[4]=o=>R(x)?x.value=o:null),data:"https://books.liker.land",width:500,height:500,mode:"config",onSave:e[5]||(e[5]=o=>f.value=!1)},{header:y(()=>[_e,l(a,{icon:"i-heroicons-x-mark",color:"gray",variant:"ghost",onClick:e[2]||(e[2]=o=>f.value=!1)})]),_:1},8,["icon","color"])]),_:1},8,["modelValue"]),_("nav",pe,[(E=u(r))!=null&&E.length?(d(),b(w,{key:1},[l(a,{label:"Print",size:"lg",variant:"outline",onClick:T}),l(a,{label:"Download",size:"lg",variant:"outline",onClick:A})],64)):(d(),U(a,{key:0,label:"Generate",size:"lg",disabled:!u(n),onClick:D},null,8,["disabled"]))]),_("div",fe,[(d(!0),b(w,null,V(u(P),(o,L)=>(d(),b("ul",{key:L,class:"w-[20cm] grid grid-cols-3 items-center gap-[0.25cm] py-[0.5cm] break-before-page"},[(d(!0),b(w,null,V(o,k=>(d(),b("li",{key:k.key||k.url},[_("figure",{ref_for:!0,ref_key:"qrCodeRef",ref:Q,class:"qrcode"},[_("figcaption",me,Y(k.key||k.url),1)],512)]))),128))]))),128))])]}),_:1})}}});export{Qe as default};
//# sourceMappingURL=batch-qrcode.41487dd7.js.map