import{_ as ce}from"./Alert.626e23da.js";import{_ as ue}from"./Input.7ce145e7.js";import{de,H as ae,G as O,r as E,E as S,L as g,g as fe,F as me,I as Z,l as pe,k as _e,o as u,m as d,w as l,q as t,v as L,c as V,b as i,$ as ee,d as D,t as F,J as te,s as he,a as w,db as ve,C as ye,D as be,P as ke,aq as Se,dk as ge,ab as oe}from"./entry.86b36dbd.js";import{_ as Ee}from"./FormGroup.dff7daf8.js";import{_ as Ie,a as we}from"./Table.90c7ed51.js";import{_ as xe}from"./PageBody.vue.44f09796.js";import{u as Ce}from"./nft.6add67a7.js";import{u as $e}from"./collection.6737af1f.js";import"./useFormGroup.67781319.js";const Be=de("user",()=>{const G=ae(),{token:x}=O(G),p=E(null);async function C(){const{error:y,data:_}=await S(`${g}/likernft/book/user/profile`,{headers:{authorization:`Bearer ${x.value}`}},"$skGXEh7uod");if(y.value)throw y.value;return p.value=_.value,p.value}function $(){return p.value?p.value:C()}async function B(y){const{error:_}=await S(`${g}/likernft/book/user/profile`,{method:"POST",body:y,headers:{authorization:`Bearer ${x.value}`}},"$dHxgorQbTP");if(_.value)throw _.value;return p.value={...p.value,...y},p.value}return{bookUser:p,fetchBookUserProfile:C,lazyFetchBookUserProfile:$,updateBookUserProfile:B}}),Ue=w("h1",{class:"text-center font-bold font-mono"}," Book Affiliation Program ",-1),Pe={key:1},Te=w("h1",{class:"text-center font-bold font-mono"}," Stripe Connect Status ",-1),Le=w("h1",{class:"text-center font-bold font-mono"}," User Setting ",-1),Ne=w("h1",{class:"text-center font-bold font-mono"}," Book Sales Commission History ",-1),Ae=["href"],Re=["href"],Ke=fe({__name:"index",setup(G){const x=Ce(),p=me(),C=ae(),$=$e(),B=Be(),{wallet:y}=O(p),{token:_}=O(C),{bookUser:b}=O(B),h=E(""),c=E(!1),f=E({}),U=E({}),N=E([]),P=E(!0);Z(b,e=>{P.value=(e==null?void 0:e.isEnableNotificationEmails)||!1}),Z(c,e=>{e&&(h.value="")}),pe(async()=>{await Promise.all([H(),le(),j(),B.lazyFetchBookUserProfile()])});const ne=_e(()=>N.value.map(e=>{let o=e.type;switch(o){case"connectedWallet":o="royalties";break;case"channelCommission":o="channel";break}return{...e,type:o,amount:`${e.currency}${e.amount/100}`,amountTotal:`${e.currency}${e.amountTotal/100}`,timestamp:new Date(e.timestamp).toLocaleString()}}));async function H(){var e,o;try{c.value=!0;const{data:a,error:m}=await S(`${g}/likernft/book/user/commissions/list`,{headers:{authorization:`Bearer ${_.value}`}},"$BjOmqjOMO1");if(m.value&&((e=m.value)==null?void 0:e.statusCode)!==404)throw new Error(m.value.toString());N.value=((o=a.value)==null?void 0:o.commissions)||[],new Set(N.value.filter(s=>s.classId).map(s=>s.classId)).forEach(s=>x.lazyFetchClassMetadataById(s)),new Set(N.value.filter(s=>s.collectionId).map(s=>s.collectionId)).forEach(s=>$.lazyFetchCollectionById(s))}catch(a){console.error(a),h.value=a.toString()}finally{c.value=!1}}async function le(){var e;try{c.value=!0;const{data:o,error:a}=await S(`${g}/users/addr/${y.value}/min`,"$eJkPPZssP7");if(a.value&&((e=a.value)==null?void 0:e.statusCode)!==404)throw new Error(a.value.toString());U.value=o.value||{}}catch(o){console.error(o),h.value=o.toString()}finally{c.value=!1}}async function j(){var e,o,a;try{if(await Y(),(e=f.value)!=null&&e.hasAccount&&!((o=f.value)!=null&&o.isReady)){const{data:m,error:I}=await S(`${g}/likernft/book/user/connect/refresh`,{method:"POST",headers:{authorization:`Bearer ${_.value}`}},"$72P1SB2Div");if(I.value&&((a=I.value)==null?void 0:a.statusCode)!==404)throw new Error(I.value.toString());m.value.isReady&&(f.value.isReady=!0,await Y())}}catch(m){console.error(m),h.value=m.toString()}finally{c.value=!1}}async function Y(){var e;try{c.value=!0;const{data:o,error:a}=await S(`${g}/likernft/book/user/connect/status?wallet=${y.value}`,{headers:{authorization:`Bearer ${_.value}`}},"$g7gsI0Ayag");if(a.value&&((e=a.value)==null?void 0:e.statusCode)!==404)throw new Error(a.value.toString());f.value=o.value||{}}catch(o){console.error(o),h.value=o.toString()}finally{c.value=!1}}async function K(){try{c.value=!0;const{data:e,error:o}=await S(`${g}/likernft/book/user/connect/login`,{method:"POST",headers:{authorization:`Bearer ${_.value}`}},"$AGBeSGom2U");if(o.value)throw new Error(o.value.toString());const a=e.value.url;if(a)window.open(a);else throw new Error("CANNOT_GET_STRIPE_CONNECT_RUL")}catch(e){console.error(e),h.value=e.toString()}finally{c.value=!1}}async function re(){try{c.value=!0;const{data:e,error:o}=await S(`${g}/likernft/book/user/connect/new`,{method:"POST",headers:{authorization:`Bearer ${_.value}`}},"$gAENUviUw9");if(o.value)throw new Error(o.value.toString());const a=e.value.url;if(a)window.open(a);else throw new Error("CANNOT_GET_STRIPE_CONNECT_RUL")}catch(e){console.error(e),h.value=e.toString()}finally{c.value=!1}}async function ie(){await B.updateBookUserProfile({isEnableNotificationEmails:P.value})}return(e,o)=>{const a=ce,m=ue,I=ve,T=Ee,s=ye,A=be,M=ke,R=Se,q=Ie,J=we,se=xe;return u(),d(se,null,{default:l(()=>{var W,Q,X;return[t(h)?(u(),d(a,{key:0,icon:"i-heroicons-exclamation-triangle",color:"red",variant:"soft",title:`${t(h)}`,"close-button":{icon:"i-heroicons-x-mark-20-solid",color:"red",variant:"link",padded:!1},onClose:o[0]||(o[0]=n=>h.value="")},null,8,["title"])):L("",!0),(W=t(f))!=null&&W.isReady?L("",!0):(u(),d(a,{key:1,icon:"i-heroicons-exclamation-circle",color:"orange",variant:"soft",title:"You need to have a Stripe Express account to use the auto-payout service of Liker Land Bookstore.",description:"A Stripe Express account is separated from any full-featured Stripe account. If you have a full-featured Stripe account, you must also register again here to create a Stripe Express account under Liker Land."})),t(C).isAuthenticated?(u(),V(te,{key:2},[i(A,{ui:{header:{base:"flex justify-between items-center"},footer:{base:"text-center"}}},ee({header:l(()=>[Ue]),default:l(()=>{var n;return[(n=t(U))!=null&&n.user?(u(),d(T,{key:0,label:"Your affiliation channel ID",size:"xl"},ee({default:l(()=>{var r;return[i(m,{placeholder:"Affiliation ID",value:`@${(r=t(U))==null?void 0:r.user}`,disabled:""},null,8,["value"])]}),_:2},[t(f).isReady?{name:"help",fn:l(()=>[D(" Append "),i(I,{class:"font-mono"},{default:l(()=>{var r;return[D(" ?from=@"+F((r=t(U))==null?void 0:r.user),1)]}),_:1}),D(" in any book store page to earn commission from book sales. ")]),key:"1"}:{name:"help",fn:l(()=>[D(" Please setup your stripe account below to participate in the book affiliation program. ")]),key:"0"}]),1024)):(u(),V("p",Pe," You have not setup your channel ID yet. "))]}),_:2},[(Q=t(U))!=null&&Q.user?void 0:{name:"footer",fn:l(()=>[i(s,{label:"Setup your ID",size:"lg",rel:"noopener",target:"_blank",to:`${t(ge)}/in`},null,8,["to"])]),key:"0"}]),1024),i(A,{ui:{header:{base:"flex justify-between items-center"},body:{padding:""},footer:{base:"text-center"}}},{header:l(()=>[Te,i(M,{text:"Refresh Status",popper:{placement:"left"}},{default:l(()=>[i(s,{icon:"i-heroicons-arrow-path",variant:"outline",disabled:t(c),onClick:j},null,8,["disabled"])]),_:1})]),footer:l(()=>{var n;return[t(c)?(u(),d(s,{key:0,label:"Loading",size:"lg",loading:!0,onClick:K})):(n=t(f))!=null&&n.isReady?(u(),d(s,{key:1,label:"Login to Stripe account",size:"lg",onClick:K})):(u(),d(s,{key:2,label:"Setup Stripe Payment Recipient Account",size:"lg",onClick:re}))]}),default:l(()=>{var n,r;return[i(q,{columns:[{key:"initiated",label:"Setup Initiated"},{key:"completed",label:"Setup Completed"}],rows:[{initiated:((n=t(f))==null?void 0:n.hasAccount)||!1,completed:((r=t(f))==null?void 0:r.isReady)||!1}],ui:{th:{base:"text-center"},td:{base:"text-center"}}},{"initiated-data":l(({row:v})=>[v.initiated?(u(),d(R,{key:0,label:"Yes",color:"green",variant:"outline"})):(u(),d(R,{key:1,label:"No",color:"red",variant:"outline"}))]),"completed-data":l(({row:v})=>{var k;return[v.completed?(u(),d(R,{key:0,label:((k=t(f))==null?void 0:k.notificationEmail)||"Yes",color:"green",variant:"outline"},null,8,["label"])):(u(),d(R,{key:1,label:"No",color:"red",variant:"outline"}))]}),_:1},8,["rows"])]}),_:1}),(X=t(f))!=null&&X.isReady?(u(),V(te,{key:0},[i(A,{ui:{header:{base:"flex justify-between items-center"},body:{padding:""},footer:{base:"text-center"}}},{header:l(()=>[Le]),footer:l(()=>[i(s,{label:"Update",color:"gray",onClick:ie})]),default:l(()=>[i(T,{label:"Liker ID Email"},{default:l(()=>{var n;return[i(m,{value:(n=t(b))==null?void 0:n.notificationEmail,label:"Liker ID Email",disabled:"",ui:{base:"font-mono"}},null,8,["value"])]}),_:1}),i(T,{label:"Is Liker ID Email verified"},{default:l(()=>{var n,r;return[i(J,{value:(n=t(b))==null?void 0:n.isEmailVerified,checked:(r=t(b))==null?void 0:r.notificationEmail,label:"Is Liker ID Email verified",disabled:"",ui:{base:"font-mono"}},null,8,["value","checked"])]}),_:1}),i(T,{label:"Email Notification Settings"},{default:l(()=>{var n,r,v,k;return[(n=t(b))!=null&&n.notificationEmail&&((r=t(b))!=null&&r.isEmailVerified)?L("",!0):(u(),d(a,{key:0,icon:"i-heroicons-exclamation-circle",color:"orange",variant:"soft",title:"Please setup email in Liker ID.",description:"To enable email notifications, setup and verify your Liker ID email"})),i(J,{modelValue:t(P),"onUpdate:modelValue":o[1]||(o[1]=z=>he(P)?P.value=z:null),name:"isEnalbeNotificationEmails",label:"Enable email notifications about commissions",disabled:!((v=t(b))!=null&&v.notificationEmail&&((k=t(b))!=null&&k.isEmailVerified))},null,8,["modelValue","disabled"])]}),_:1})]),_:1}),i(A,{ui:{header:{base:"flex justify-between items-center"},body:{padding:""},footer:{base:"text-center"}}},{header:l(()=>[Ne,i(M,{text:"Refresh Status",popper:{placement:"left"}},{default:l(()=>[i(s,{icon:"i-heroicons-arrow-path",variant:"outline",disabled:t(c),onClick:H},null,8,["disabled"])]),_:1})]),default:l(()=>[i(q,{columns:[{key:"timestamp",label:"Timestamp"},{key:"type",label:"Commission Type"},{key:"amount",label:"Commission"},{key:"classId",label:"Book Id"},{key:"collectionId",label:"Book Collection Id"},{key:"currency",label:"Currency"},{key:"amountTotal",label:"Sale Amount"}],rows:t(ne),ui:{th:{base:"text-center"},td:{base:"text-center"}}},{"classId-data":l(({row:n})=>{var r;return[w("a",{href:`${t(oe)}/nft/class/${n.classId}`,target:"_blank"},F((r=t(x).getClassMetadataById(n.classId))==null?void 0:r.name),9,Ae)]}),"collectionId-data":l(({row:n})=>{var r,v,k,z;return[w("a",{href:`${t(oe)}/nft/collection/${n.collectionId}`,target:"_blank"},F(((v=(r=t($).getCollectionById(n.collectionId))==null?void 0:r.name)==null?void 0:v.zh)||((z=(k=t($).getCollectionById(n.collectionId))==null?void 0:k.name)==null?void 0:z.en)),9,Re)]}),_:1},8,["rows"])]),_:1})],64)):L("",!0)],64)):L("",!0)]}),_:1})}}});export{Ke as default};