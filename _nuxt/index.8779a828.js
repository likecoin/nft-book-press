import{_ as M}from"./Alert.94c17f65.js";import{g as $,i as j,j as q,I as z,H,r as y,l as S,K,m as G,o as b,q as k,w as c,s as d,x as N,d as J,b as g,v as O,a as B,t as Q,P as W,C as X,D as Y}from"./entry.6d4ed70f.js";import{_ as Z}from"./Table.82ac636b.js";import{_ as ee}from"./Tabs.78076109.js";import{_ as oe}from"./PageBody.vue.5f2b9d53.js";import{u as te}from"./nft.a40983e1.js";import{u as ne}from"./collection.8dca751d.js";import"./useFormGroup.08dac1ae.js";(function(){try{var i=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},u=new Error().stack;u&&(i._sentryDebugIds=i._sentryDebugIds||{},i._sentryDebugIds[u]="1a640201-c36d-4f41-9c7d-c20685a1a44e",i._sentryDebugIdIdentifier="sentry-dbid-1a640201-c36d-4f41-9c7d-c20685a1a44e")}catch{}})();const se=B("h2",{class:"text-xl font-bold font-mono"}," NFT Book Collections ",-1),ae={class:"font-bold font-mono"},pe=$({__name:"index",setup(i){const u=j(),I=q(),P=te(),T=z(),U=ne(),{listNFTBookCollections:D,listModeratedNFTBookCollections:V}=U,{getClassMetadataById:R,lazyFetchClassMetadataById:C}=P,{token:A}=H(T),m=y(""),h=y(!1),v=y([]),w=y([]),_=[{label:"Current Collection Listing",key:"current"},{label:"Viewable Collection Listing",key:"viewable"}],p=S({get(){const e=_.findIndex(o=>o.key===u.query.tab);return e===-1?0:e},set(e){I.replace({query:{tab:_[e].key}})}});K(h,e=>{e&&(m.value="")});const L=[{key:"name",label:"Collection Name",sortable:!0},{key:"priceInUSD",label:"Price in USD",sortable:!0},{key:"pendingAction",label:"Pending Action",sortable:!0},{key:"sold",label:"Sold",sortable:!0},{key:"stock",label:"Remaining Stock",sortable:!0}];G(async()=>{var a,l;const e=[D()];A.value&&e.push(V());const[o,n]=await Promise.all(e);v.value=(a=o==null?void 0:o.value)==null?void 0:a.list,v.value.forEach(s=>{s.classIds.forEach(t=>C(t))}),w.value=((l=n==null?void 0:n.value)==null?void 0:l.list)||[],w.value.forEach(s=>{s.classIds.forEach(t=>C(t))})});const E=S(()=>(_[p.value].key==="viewable"?w:v).value.map(e=>{var o,n,a,l,s,t;return{collectionId:e.id,name:(o=e.name)==null?void 0:o.en,priceInUSD:((n=e.typePayload)==null?void 0:n.priceInDecimal)/100,classIds:e.classIds,classNames:(a=e.classIds)==null?void 0:a.map(x=>{var f;return(f=R(x))==null?void 0:f.name}),pendingAction:((l=e.typePayload)==null?void 0:l.pendingNFTCount)||0,sold:((s=e.typePayload)==null?void 0:s.sold)||0,stock:((t=e.typePayload)==null?void 0:t.stock)||0}}));function F(e){I.push({name:"nft-book-store-collection-status-collectionId",params:{collectionId:e.collectionId}})}return(e,o)=>{const n=M,a=W,l=X,s=Z,t=Y,x=ee,f=oe;return b(),k(f,{ui:{constrained:""}},{default:c(()=>[d(m)?(b(),k(n,{key:0,class:"mt-4",icon:"i-heroicons-exclamation-triangle",color:"red",variant:"soft",title:`${d(m)}`,"close-button":{icon:"i-heroicons-x-mark-20-solid",color:"red",variant:"link",padded:!1},onClose:o[0]||(o[0]=r=>m.value="")},null,8,["title"])):N("",!0),d(h)?(b(),k(a,{key:1,animation:"carousel"},{indicator:c(()=>[J(" Loading... ")]),_:1})):N("",!0),g(t,{ui:{header:{base:"flex justify-between items-center gap-4"}}},{header:c(()=>[se,g(l,{icon:"i-heroicons-plus-circle",label:"New Collection",to:{name:"nft-book-store-collection-new"}})]),default:c(()=>[g(x,{modelValue:d(p),"onUpdate:modelValue":o[1]||(o[1]=r=>O(p)?p.value=r:null),class:"w-full",items:_},{item:c(({item:r})=>[(b(),k(t,{key:r.key,ui:{header:{base:"flex justify-between items-center gap-4"},body:{base:"divide-y divide-gray-200 dark:divide-gray-700",padding:""}}},{header:c(()=>[B("h2",ae,Q(r.label),1)]),default:c(()=>[g(s,{columns:L,rows:d(E),onSelect:F},null,8,["rows"])]),_:2},1024))]),_:1},8,["modelValue"])]),_:1})]),_:1})}}});export{pe as default};
//# sourceMappingURL=index.8779a828.js.map