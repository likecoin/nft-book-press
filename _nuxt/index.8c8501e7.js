import{_ as Re}from"./PageHeader.vue.f4f4c5f9.js";import{_ as je}from"./Alert.626e23da.js";import{_ as Ae,g as ye,U as Me,l as he,V as Le,r as y,W as ie,o as N,c as ge,X as Je,Y as Be,i as Pe,h as qe,F as We,G as Ye,Z as Ze,k as ue,I as ne,m as k,w as l,b as n,q as a,v as F,s as L,d as T,a as P,t as _e,$ as He,J as Ke,E as X,a0 as Q,a1 as ze,a2 as Ge,a3 as Xe,a4 as Qe,a5 as ea,a6 as aa,a7 as ta,a8 as na,a9 as la,y as ce,R as oa,C as sa,D as ra,aa as ia,ab as ua,z as ca}from"./entry.86b36dbd.js";import{_ as da}from"./Input.7ce145e7.js";import{_ as fa}from"./FormGroup.dff7daf8.js";import{_ as ma}from"./Textarea.1c50f9da.js";import{u as va}from"./useFormGroup.67781319.js";import{_ as pa}from"./Tabs.e7a0c451.js";import{_ as _a}from"./Progress.19f52ba6.js";import{_ as ba}from"./PageBody.vue.44f09796.js";import{_ as ya}from"./PageContainer.348c7119.js";import{p as be}from"./sync.4a718702.js";import{v as ha}from"./v4.a960c1f4.js";class le extends Error{constructor(C){super(C),this.message=C,Object.setPrototypeOf(this,le.prototype)}}const ga=ye({props:{schema:{type:Object,default:void 0},state:{type:Object,required:!0},validate:{type:Function,default:()=>[]},validateOn:{type:Array,default:()=>["blur","input","change","submit"]}},emits:["submit","error"],setup(r,{expose:C,emit:_}){const w=Me(`form-${va()}`);he(()=>{w.on(async s=>{var m;s.type!=="submit"&&((m=r.validateOn)!=null&&m.includes(s.type))&&await q(s.path,{silent:!0})})}),Le(()=>{w.reset()});const d=y([]);ie("form-errors",d),ie("form-events",w);const I=y({});ie("form-inputs",I);async function O(){let s=await r.validate(r.state);if(r.schema)if(Ia(r.schema))s=s.concat(await Sa(r.state,r.schema));else if(wa(r.schema))s=s.concat(await Na(r.state,r.schema));else if(ka(r.schema))s=s.concat(await Fa(r.state,r.schema));else if(Ta(r.schema))s=s.concat(await Ua(r.state,r.schema));else throw new Error("Form validation failed: Unsupported form schema");return s}async function q(s,m={silent:!1}){let f=s;if(s&&!Array.isArray(s)&&(f=[s]),f){const S=d.value.filter(x=>!f.includes(x.path)),$=(await O()).filter(x=>f.includes(x.path));d.value=S.concat($)}else d.value=await O();if(!m.silent&&d.value.length>0)throw new le(`Form validation failed: ${JSON.stringify(d.value,null,2)}`);return r.state}async function W(s){var f;const m=s;try{(f=r.validateOn)!=null&&f.includes("submit")&&await q();const S={...m,data:r.state};_("submit",S)}catch(S){if(!(S instanceof le))throw S;const $={...m,errors:d.value.map(x=>({...x,id:I.value[x.path]}))};_("error",$)}}return C({validate:q,errors:d,setErrors(s,m){d.value=s,m?d.value=d.value.filter(f=>f.path!==m).concat(s):d.value=s},async submit(){await W(new Event("submit"))},getErrors(s){return s?d.value.filter(m=>m.path===s):d.value},clear(s){s?d.value=d.value.filter(m=>m.path!==s):d.value=[]}}),{onSubmit:W}}});function wa(r){return r.validate&&r.__isYupSchema__}function Ca(r){return r.inner!==void 0}async function Na(r,C){try{return await C.validate(r,{abortEarly:!1}),[]}catch(_){if(Ca(_))return _.inner.map(w=>({path:w.path??"",message:w.message}));throw _}}function Ia(r){return r.parse!==void 0}async function Sa(r,C){const _=await C.safeParseAsync(r);return _.success===!1?_.error.issues.map(w=>({path:w.path.join("."),message:w.message})):[]}function ka(r){return r.validateAsync!==void 0&&r.id!==void 0}function xa(r){return r.isJoi===!0}async function Fa(r,C){try{return await C.validateAsync(r,{abortEarly:!1}),[]}catch(_){if(xa(_))return _.details.map(w=>({path:w.path.join("."),message:w.message}));throw _}}function Ta(r){return r._parse!==void 0}async function Ua(r,C){const _=await C._parse(r);return _.issues?_.issues.map(w=>{var d;return{path:((d=w.path)==null?void 0:d.map(I=>I.key).join("."))||"",message:w.message}}):[]}function Da(r,C,_,w,d,I){return N(),ge("form",{onSubmit:C[0]||(C[0]=Be((...O)=>r.onSubmit&&r.onSubmit(...O),["prevent"]))},[Je(r.$slots,"default")],32)}const $a=Ae(ga,[["render",Da]]),Va=P("h2",{class:"font-bold font-mono"}," 1. Select or Create ISCN ",-1),Ea=P("h2",{class:"font-bold font-mono"}," ISCN Information ",-1),Oa={class:"font-bold font-mono"},Ra=P("h3",{class:"font-bold"}," Mint NFT by uploading data files ",-1),ja=P("br",null,null,-1),Aa=P("h3",{class:"font-bold"}," Mint NFT by filling required information ",-1),Ma=P("h3",null,"NFT Class Information",-1),et=ye({__name:"index",setup(r){const C=Pe(),_=qe(),w=We(),{wallet:d,signer:I}=Ye(w),{connect:O}=w,q=ia,W=ua,s=y(1),m=y(""),f=y(!1),S=y(""),$=y(""),x=y(null),R=y(null),K=Ze({nftIdPrefix:"BOOKSN"}),oe=y(!1),j=y(""),z=y(""),Y=y(""),ee=y(null),D=y(void 0),A=y(null),U=y([]),E=y(null),g=y(100),we=y(null),de=y(""),fe=y(0),ae=ue(()=>{var e;return(e=R.value)==null?void 0:e["@id"]}),V=ue(()=>{var e;return(e=ee.value)==null?void 0:e.id}),Z=ue(()=>!V.value&&s.value===2),se=y(!1);ne(ae,e=>{e&&C.replace({query:{..._.query,iscn_id:e}})}),ne(V,e=>{e&&C.replace({query:{..._.query,class_id:e}})}),ne(f,e=>{e&&(m.value="")}),ne(R,e=>{var t;e&&(j.value=((t=e.contentMetadata)==null?void 0:t.thumbnailUrl)||"")}),he(()=>{S.value=_.query.class_id||_.query.iscn_id||""});const Ce=e=>{oe.value=!1;const t=[];return/^[a-zA-Z][a-zA-Z0-9/:-]{2,100}$/.test(e.nftIdPrefix)||(oe.value=!0,t.push({path:"prefix",message:"NFT ID cannot contain spaces"})),t};async function Ne(){var e,t,h;try{if(f.value=!0,S.value.startsWith("iscn://")){const{data:c,error:v}=await X(`${Q}/iscn/records/id?iscn_id=${encodeURIComponent(S.value)}`,"$2PvvmhBMH0");if(v.value)throw new Error(v.value);const{records:u,owner:i}=c.value;R.value=u[0].data,$.value=i,s.value=2}else if(S.value.startsWith("likenft")){const{data:c}=await X(`${Q}/cosmos/nft/v1beta1/classes/${encodeURIComponent(S.value)}`,"$FJ2w5pmi7L");if(!(c!=null&&c.value))throw new Error("INVALID_NFT_CLASS_ID");ee.value=c.value.class;const v=(h=(t=(e=ee.value)==null?void 0:e.data)==null?void 0:t.parent)==null?void 0:h.iscn_id_prefix,{data:u}=await X(`${Q}/iscn/records/id?iscn_id=${encodeURIComponent(v)}`,"$dTIPOPNbJ2"),{records:i,owner:o}=u.value;R.value=i[0].data,$.value=o,s.value=3}else throw new Error("Invalid ISCN ID or NFT Class ID")}catch(c){console.error(c),m.value=c.toString()}finally{f.value=!1}}async function Ie(){try{if(f.value=!0,(!d.value||!I.value)&&await O(),!d.value||!I.value)throw new Error("NO_WALLET");if(!x.value)throw new Error("NO_ISCN_DATA");const e=await ze(x.value,I.value,d.value);await Ge(6e3);const{data:t}=await X(`${Q}/iscn/records/id?iscn_id=${encodeURIComponent(e)}`,"$FCIXcWVl0c");if(!(t!=null&&t.value))throw new Error("INVALID_ISCN_ID");const{records:h,owner:c}=t.value;R.value=h[0].data,$.value=c,s.value=2}catch(e){console.error(e),m.value=e.toString()}finally{f.value=!1}}function Se(e){var v;if(!(e!=null&&e.target))return;const t=(v=e.target)==null?void 0:v.files;if(!t)return;const[h]=t,c=new FileReader;c.onload=u=>{var i;try{const o=(i=u.target)==null?void 0:i.result;if(typeof o!="string")return;const p=JSON.parse(o);if(!p||!p.contentMetadata)throw new Error("Invalid ISCN data json");x.value=p}catch(o){console.error(o),m.value=o.toString()}},c.readAsText(h)}function ke({prefix:e,nftExisitngCount:t=0,nftMintCount:h,imgUrl:c,uri:v}){const u=[];for(let i=t;i<=t+h-1;i++){const o=`${e}-${i.toString().padStart(4,"0")}`;u.push({nftId:o,uri:v,image:c,metadata:""})}return ca(u)}async function xe(){f.value=!0;const{contentMetadata:e}=R.value,t={name:e.name,description:e.description,symbol:"BOOK",uri:Y.value||"",metadata:{name:e.name,image:j.value,external_url:z.value,nft_meta_collection_id:"nft_book",nft_meta_collection_name:"NFT Book",nft_meta_collection_descrption:"NFT Book by Liker Land"}},h={uri:Y.value||"",metadata:{name:e.name,image:j.value,external_url:z.value}};if(!Z.value){const{nfts:u}=await Xe({classId:V.value});fe.value=u.length}typeof g.value!="number"&&(g.value=Number(g.value));const c=ke({prefix:K.nftIdPrefix,nftMintCount:g.value,nftExisitngCount:fe.value,imgUrl:j.value,uri:Y.value}),v=be(c,{columns:!0});A.value=t,E.value=h,U.value=v,g.value=v.length;try{s.value===2&&await me(),await ve(),se.value=!0}catch(u){console.error(u)}finally{f.value=!1}}async function Fe(){f.value=!0;try{s.value===2&&await me(),await ve(),se.value=!1}catch(e){console.error(e)}finally{f.value=!1}}async function me(){try{if(f.value=!0,(!d.value||!I.value)&&await O(),!d.value||!I.value)return;if(!A.value)throw new Error("NO_CLASS_DATA");const e=await Qe(A.value,ae.value,I.value,d.value,{nftMaxSupply:D.value});await ea(e,R.value,$.value,!1,I.value,d.value);const{data:t}=await X(`${Q}/cosmos/nft/v1beta1/classes/${encodeURIComponent(e)}`,"$eA1tg4Ymj6");if(!(t!=null&&t.value))throw new Error("INVALID_NFT_CLASS_ID");ee.value=t.value.class,s.value=3}catch(e){console.error(e),m.value=e.toString()}finally{f.value=!1}}function Te(e){var v;if(!(e!=null&&e.target))return;const t=(v=e.target)==null?void 0:v.files;if(!t)return;const[h]=t,c=new FileReader;c.onload=u=>{var i;try{const o=(i=u.target)==null?void 0:i.result;if(typeof o!="string")return;const p=JSON.parse(o);if(!p||!p.name)throw new Error("Invalid Class data json");A.value=p}catch(o){console.error(o),m.value=o.toString()}},c.readAsText(h)}async function ve(){try{if(f.value=!0,(!d.value||!I.value)&&await O(),!d.value||!I.value)return;if(!E.value)throw new Error("NO_MINT_DATA");if(U.value.length&&U.value.length!==g.value)throw new Error(`NFT csv data length ${U.value.length} must match nft mint amount ${g.value}`);const e=E.value.uri,t=E.value.metadata,h=[...Array(g.value).keys()].map(v=>{var b;const{nftId:u,uri:i,image:o,metadata:p,...G}=((b=U==null?void 0:U.value)==null?void 0:b[v])||{},re=JSON.parse(p||"{}"),H={...t,...re};o&&(H.image=o),Object.entries(G).forEach(([M,B])=>{if(B)try{H[M]=JSON.parse(B)}catch{H[M]=B}});const te=u||`nft-${ha()}`;let J=i||e||"";return J&&J.startsWith("https://")&&(J=aa(J,{class_id:V.value,nft_id:te})),{id:te,uri:J,metadata:H}});de.value=ta(h,{header:!0});const c=await na(h,V.value,I.value,d.value);we.value=c,s.value=4}catch(e){console.error(e),m.value=e.toString()}finally{f.value=!1}}function Ue(e){var v;if(!(e!=null&&e.target))return;const t=(v=e.target)==null?void 0:v.files;if(!t)return;const[h]=t,c=new FileReader;c.onload=u=>{var i;try{const o=(i=u.target)==null?void 0:i.result;if(typeof o!="string")return;const p=JSON.parse(o);if(!p||p.uri===void 0)throw new Error("Invalid NFT default data json");E.value=p}catch(o){console.error(o),m.value=o.toString()}},c.readAsText(h)}function De(e){var v;if(!(e!=null&&e.target))return;const t=(v=e.target)==null?void 0:v.files;if(!t)return;const[h]=t,c=new FileReader;c.onload=u=>{var i;try{const o=(i=u.target)==null?void 0:i.result;if(typeof o!="string")return;const p=be(o,{columns:!0});U.value=p,g.value=p.length}catch(o){console.error(o),m.value=o.toString()}},c.readAsText(h)}function $e(e){e&&e.preventDefault(),la(de.value,"nft_result.csv","text/csv;charset=utf-8;")}function Ve(e){e&&e.preventDefault(),ce({data:A.value,fileName:"nft_class.json",fileType:"json"})}function Ee(e){e&&e.preventDefault(),ce({data:E.value,fileName:"nfts_default.json",fileType:"json"})}function Oe(e){e&&e.preventDefault(),ce({data:U.value,fileName:"nfts.csv",fileType:"csv"})}return(e,t)=>{const h=Re,c=je,v=oa,u=da,i=fa,o=sa,p=ra,G=ma,re=$a,H=pa,te=_a,J=ba,pe=ya;return N(),k(pe,{key:a(_).path},{default:l(()=>[n(h,{title:"Mint LikeCoin NFT/NFT Book"}),n(J,{class:"flex flex-col items-stretch grow space-y-4"},{default:l(()=>[a(m)?(N(),k(c,{key:0,icon:"i-heroicons-exclamation-triangle",color:"red",variant:"soft",title:`${a(m)}`,"close-button":{icon:"i-heroicons-x-mark-20-solid",color:"red",variant:"link",padded:!1},onClose:t[0]||(t[0]=b=>m.value="")},null,8,["title"])):F("",!0),n(v,{label:`Steps ${a(s)} / 4`},null,8,["label"]),a(s)===1?(N(),k(p,{key:1,ui:{body:{base:"space-y-4"}}},{header:l(()=>[Va]),default:l(()=>[a(x)?F("",!0):(N(),k(p,{key:0,ui:{body:{base:"space-y-4"}}},{default:l(()=>[n(i,{label:"Enter ISCN ID or NFT Class ID"},{default:l(()=>[n(u,{modelValue:a(S),"onUpdate:modelValue":t[1]||(t[1]=b=>L(S)?S.value=b:null),class:"font-mono",placeholder:"iscn://... or likenft...."},null,8,["modelValue"])]),_:1}),n(o,{type:"submit",label:"Submit",disabled:a(f)||!a(S),onClick:Ne},null,8,["disabled"])]),_:1})),n(v,{label:"OR"}),n(p,{ui:{body:{base:"space-y-4"}}},{default:l(()=>[n(i,null,{label:l(()=>[T(" Upload ISCN data json file "),n(o,{to:"https://github.com/likecoin/iscn-nft-tools/blob/master/mint-nft/samples/iscn.json",padded:!1,variant:"link",target:"_blank"},{default:l(()=>[T(" (iscn.json) ")]),_:1})]),default:l(()=>[n(u,{class:"my-4",type:"file",accept:"application/json",onChange:Se})]),_:1}),n(c,{title:"",icon:"i-heroicons-light-bulb",color:"primary",variant:"soft"},{title:l(()=>[T(" You can also create your ISCN using "),n(o,{to:`${a(q)}/new`,padded:!1,variant:"link",target:"_blank"},{default:l(()=>[T(" app.like.co ")]),_:1},8,["to"])]),_:1}),a(x)?(N(),k(G,{key:0,value:JSON.stringify(a(x),null,2),cols:"100",rows:10,readonly:""},null,8,["value"])):F("",!0),n(o,{label:"Create",disabled:a(f)||!a(x),onClick:Ie},null,8,["disabled"])]),_:1})]),_:1})):a(s)>1?(N(),k(p,{key:2,ui:{body:{base:"space-y-4"}}},{header:l(()=>[Ea]),default:l(()=>[n(i,{label:"ISCN ID"},{default:l(()=>[n(o,{class:"font-mono",label:a(ae),to:`${a(q)}/iscn/${encodeURIComponent(a(ae))}`,target:"_blank",variant:"link",padded:!1},null,8,["label","to"])]),_:1}),n(i,{label:"ISCN Owner"},{default:l(()=>[n(o,{label:a($),to:`${a(W)}/${encodeURIComponent(a($))}`,target:"_blank",variant:"link",padded:!1},null,8,["label","to"])]),_:1}),n(i,{label:"ISCN Title"},{default:l(()=>{var b,M;return[n(u,{value:(M=(b=a(R))==null?void 0:b.contentMetadata)==null?void 0:M.name,readonly:!0,variant:"none",padded:!1},null,8,["value"])]}),_:1})]),_:1})):F("",!0),a(s)===2||a(s)===3?(N(),k(p,{key:3,ui:{body:{base:"space-y-4"}}},{header:l(()=>[P("h2",Oa,_e(a(s))+". "+_e(a(Z)?"Create NFT Class":"Mint NFT"),1)]),default:l(()=>[n(H,{class:"w-full",items:[{label:"By filling required information",slot:"input"},{label:"By uploading data files",slot:"upload"}]},{upload:l(()=>[n(p,{ui:{body:{base:"space-y-4"}}},{header:l(()=>[Ra]),footer:l(()=>[n(o,{label:"Mint",disabled:a(f)||!((!a(Z)||a(A))&&a(E)&&a(U)),onClick:Fe},null,8,["disabled"])]),default:l(()=>{var b,M;return[a(Z)?(N(),k(i,{key:0,label:"Max number of supply for this NFT Class (optional):"},{default:l(()=>[n(u,{modelValue:a(D),"onUpdate:modelValue":t[2]||(t[2]=B=>L(D)?D.value=B:null),type:"number",min:a(g)},null,8,["modelValue","min"])]),_:1})):F("",!0),n(i,{label:"Number of NFT to mint:"},{default:l(()=>[n(u,{modelValue:a(g),"onUpdate:modelValue":t[3]||(t[3]=B=>L(g)?g.value=B:null),type:"number",min:0,max:a(D)},null,8,["modelValue","max"])]),_:1}),a(Z)?(N(),k(i,{key:1},{label:l(()=>[T(" Upload NFT Class data JSON file ("),n(o,{label:"nft_class.json",to:"https://github.com/likecoin/iscn-nft-tools/blob/master/mint-nft/samples/nft_class.json",variant:"link",padded:!1,target:"_blank"}),T(") ")]),default:l(()=>[n(u,{type:"file",accept:"application/json",onChange:Te}),a(A)?(N(),k(G,{key:0,value:JSON.stringify(a(A),null,2),class:"mt-2",cols:"100",rows:10,readonly:""},null,8,["value"])):F("",!0)]),_:1})):F("",!0),n(i,null,{label:l(()=>[T(" Upload NFT default data JSON file"),ja,T("("),n(o,{label:"nfts_default.json",to:"https://github.com/likecoin/iscn-nft-tools/blob/master/mint-nft/samples/nfts_default.json",variant:"link",padded:!1,target:"_blank"}),T(") ")]),default:l(()=>[n(u,{type:"file",accept:"application/json",onChange:Ue}),a(E)?(N(),k(G,{key:0,value:JSON.stringify(a(E),null,2),cols:"100",rows:10,readonly:""},null,8,["value"])):F("",!0)]),_:1}),n(i,null,{label:l(()=>[T(" Upload NFT CSV file ("),n(o,{label:"nfts.csv",to:"https://github.com/likecoin/iscn-nft-tools/blob/master/mint-nft/samples/nfts.csv",variant:"link",padded:!1,target:"_blank"}),T(") ")]),default:l(()=>[n(u,{type:"file",accept:".csv",onChange:De})]),_:1}),(b=a(U))!=null&&b.length?(N(),k(c,{key:2,title:`Number of NFT data in CSV: ${(M=a(U))==null?void 0:M.length}`},null,8,["title"])):F("",!0)]}),_:1})]),input:l(()=>[n(p,{class:"flex-1",ui:{body:{base:"space-y-4"}}},{header:l(()=>[Aa]),footer:l(()=>[n(o,{label:"Mint",disabled:a(f)||!(a(K).nftIdPrefix&&a(g)&&a(j))||a(oe),onClick:xe},null,8,["disabled"])]),default:l(()=>[n(re,{validate:Ce,state:a(K)},{default:l(()=>[n(i,{label:"NFT ID Prefix:",name:"prefix",required:""},{default:l(()=>[n(u,{modelValue:a(K).nftIdPrefix,"onUpdate:modelValue":t[4]||(t[4]=b=>a(K).nftIdPrefix=b),placeholder:"English only ex.MoneyVerse"},null,8,["modelValue"])]),_:1}),n(i,{label:"Number of NFT to mint:",required:""},{default:l(()=>[n(u,{modelValue:a(g),"onUpdate:modelValue":t[5]||(t[5]=b=>L(g)?g.value=b:null),placeholder:"0-100",type:"number",min:0,max:a(D)},null,8,["modelValue","max"])]),_:1}),n(i,{label:"Image URL:",required:""},{default:l(()=>[n(u,{modelValue:a(j),"onUpdate:modelValue":t[6]||(t[6]=b=>L(j)?j.value=b:null),placeholder:"ipfs:// ... or ar://...."},null,8,["modelValue"])]),_:1}),n(i,{label:"External URL (optional):"},{default:l(()=>[n(u,{modelValue:a(z),"onUpdate:modelValue":t[7]||(t[7]=b=>L(z)?z.value=b:null),placeholder:"https://"},null,8,["modelValue"])]),_:1}),n(i,{label:"URI (optional):"},{default:l(()=>[n(u,{modelValue:a(Y),"onUpdate:modelValue":t[8]||(t[8]=b=>L(Y)?Y.value=b:null),placeholder:"https://"},null,8,["modelValue"])]),_:1}),a(Z)?(N(),k(i,{key:0,label:"Max number of supply for this NFT Class (optional):"},He({default:l(()=>[n(u,{modelValue:a(D),"onUpdate:modelValue":t[9]||(t[9]=b=>L(D)?D.value=b:null),type:"number",min:a(g),placeholder:`> ${a(g)}`},null,8,["modelValue","min","placeholder"])]),_:2},[a(D)&&a(D)<a(g)?{name:"help",fn:l(()=>[n(c,{class:"mt-1",icon:"i-heroicons-exclamation-triangle",title:"Should be more than number of NFT to mint",color:"red",variant:"subtle"})]),key:"0"}:void 0]),1024)):F("",!0)]),_:1},8,["state"])]),_:1})]),_:1})]),_:1})):a(s)>2&&a(V)?(N(),k(p,{key:4},{header:l(()=>[Ma]),default:l(()=>[n(i,{label:"NFT Class ID"},{default:l(()=>[n(o,{label:a(V),to:`${a(W)}/nft/class/${encodeURIComponent(a(V))}`,target:"_blank",variant:"link",padded:!1},null,8,["label","to"])]),_:1})]),_:1})):F("",!0),a(s)>3?(N(),k(p,{key:5,ui:{header:{base:"font-bold font-mono"},body:{base:"flex flex-wrap items-center justify-center gap-2"},footer:{base:"flex flex-wrap items-center justify-end gap-2"}}},{header:l(()=>[T(" 🎉 Success! ")]),footer:l(()=>[n(o,{label:"View your NFT",variant:"outline",target:"_blank",to:`${a(W)}/nft/class/${encodeURIComponent(a(V))}`},null,8,["to"]),n(o,{to:{name:"nft-book-store-new",query:{class_id:a(V),count:a(g)}},label:"Continue to publish NFT Book",variant:"solid"},null,8,["to"])]),default:l(()=>[n(o,{label:"Download NFT result csv",disabled:a(f),variant:"outline",onClick:$e},null,8,["disabled"]),a(se)?(N(),ge(Ke,{key:0},[n(o,{label:"Download nft_class.json",disabled:a(f),variant:"outline",onClick:Ve},null,8,["disabled"]),n(o,{label:"Download nft_default.json",disabled:a(f),variant:"outline",onClick:Ee},null,8,["disabled"]),n(o,{label:"Download nfts.csv",disabled:a(f),variant:"outline",onClick:Oe},null,8,["disabled"])],64)):F("",!0)]),_:1})):F("",!0),a(f)?(N(),k(te,{key:6,animation:"carousel"},{indicator:l(()=>[T(" Loading... ")]),_:1})):F("",!0)]),_:1})]),_:1})}}});export{et as default};