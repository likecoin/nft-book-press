import{g as $,r as h,aw as j,az as ue,ax as ae,l as g,aJ as H,Y as W,m as z,K as te,aG as ie,as as m,aA as B,aB as oe,U as q,aC as le,X as ne,aI as U,aD as de,aF as K,aq as R,aK as x,b7 as L,b8 as ce,aE as fe,b9 as O,ba as k,_ as ve,aP as pe,aQ as J,aS as be,aT as Q,bb as me,ak as E,o as C,q as V,w as F,b as X,al as A,b2 as ge,a as N,c as Y,T as Z,Z as _,t as ee,d as he,b0 as ye}from"./entry.6d4ed70f.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},o=new Error().stack;o&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[o]="856c9e59-f5b4-4ff7-a537-23cc1de5f2cf",e._sentryDebugIdIdentifier="sentry-dbid-856c9e59-f5b4-4ff7-a537-23cc1de5f2cf")}catch{}})();const we={wrapper:"relative space-y-2",container:"relative w-full",base:"focus:outline-none",list:{base:"relative",background:"bg-gray-100 dark:bg-gray-800",rounded:"rounded-lg",shadow:"",padding:"p-1",height:"h-10",width:"w-full",marker:{wrapper:"absolute top-[4px] left-[4px] duration-200 ease-out focus:outline-none",base:"w-full h-full",background:"bg-white dark:bg-gray-900",rounded:"rounded-md",shadow:"shadow-sm"},tab:{base:"relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 dark:ui-focus-visible:ring-primary-400 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out",background:"",active:"text-gray-900 dark:text-white",inactive:"text-gray-500 dark:text-gray-400",height:"h-8",padding:"px-3",size:"text-sm",font:"font-medium",rounded:"rounded-md",shadow:""}}};let Ie=$({props:{onFocus:{type:Function,required:!0}},setup(e){let o=h(!0);return()=>o.value?j(ae,{as:"button",type:"button",features:ue.Focusable,onFocus(c){c.preventDefault();let f,s=50;function t(){var r;if(s--<=0){f&&cancelAnimationFrame(f);return}if((r=e.onFocus)!=null&&r.call(e)){o.value=!1,cancelAnimationFrame(f);return}f=requestAnimationFrame(t)}f=requestAnimationFrame(t)}}):null}});var Te=(e=>(e[e.Forwards=0]="Forwards",e[e.Backwards=1]="Backwards",e))(Te||{}),xe=(e=>(e[e.Less=-1]="Less",e[e.Equal=0]="Equal",e[e.Greater=1]="Greater",e))(xe||{});let se=Symbol("TabsContext");function D(e){let o=U(se,null);if(o===null){let c=new Error(`<${e} /> is missing a parent <TabGroup /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(c,D),c}return o}let M=Symbol("TabsSSRContext"),ke=$({name:"TabGroup",emits:{change:e=>!0},props:{as:{type:[Object,String],default:"template"},selectedIndex:{type:[Number],default:null},defaultIndex:{type:[Number],default:0},vertical:{type:[Boolean],default:!1},manual:{type:[Boolean],default:!1}},inheritAttrs:!1,setup(e,{slots:o,attrs:c,emit:f}){var s;let t=h((s=e.selectedIndex)!=null?s:e.defaultIndex),r=h([]),d=h([]),v=g(()=>e.selectedIndex!==null),p=g(()=>v.value?e.selectedIndex:t.value);function i(l){var a;let u=H(n.tabs.value,m),y=H(n.panels.value,m),P=u.filter(I=>{var T;return!((T=m(I))!=null&&T.hasAttribute("disabled"))});if(l<0||l>u.length-1){let I=R(t.value===null?0:Math.sign(l-t.value),{[-1]:()=>1,[0]:()=>R(Math.sign(l),{[-1]:()=>0,[0]:()=>0,[1]:()=>1}),[1]:()=>0}),T=R(I,{[0]:()=>u.indexOf(P[0]),[1]:()=>u.indexOf(P[P.length-1])});T!==-1&&(t.value=T),n.tabs.value=u,n.panels.value=y}else{let I=u.slice(0,l),T=[...u.slice(l),...I].find(re=>P.includes(re));if(!T)return;let G=(a=u.indexOf(T))!=null?a:n.selectedIndex.value;G===-1&&(G=n.selectedIndex.value),t.value=G,n.tabs.value=u,n.panels.value=y}}let n={selectedIndex:g(()=>{var l,a;return(a=(l=t.value)!=null?l:e.defaultIndex)!=null?a:null}),orientation:g(()=>e.vertical?"vertical":"horizontal"),activation:g(()=>e.manual?"manual":"auto"),tabs:r,panels:d,setSelectedIndex(l){p.value!==l&&f("change",l),v.value||i(l)},registerTab(l){var a;if(r.value.includes(l))return;let u=r.value[t.value];r.value.push(l),r.value=H(r.value,m);let y=(a=r.value.indexOf(u))!=null?a:t.value;y!==-1&&(t.value=y)},unregisterTab(l){let a=r.value.indexOf(l);a!==-1&&r.value.splice(a,1)},registerPanel(l){d.value.includes(l)||(d.value.push(l),d.value=H(d.value,m))},unregisterPanel(l){let a=d.value.indexOf(l);a!==-1&&d.value.splice(a,1)}};W(se,n);let b=h({tabs:[],panels:[]}),w=h(!1);z(()=>{w.value=!0}),W(M,g(()=>w.value?null:b.value));let S=g(()=>e.selectedIndex);return z(()=>{te([S],()=>{var l;return i((l=e.selectedIndex)!=null?l:e.defaultIndex)},{immediate:!0})}),ie(()=>{if(!v.value||p.value==null||n.tabs.value.length<=0)return;let l=H(n.tabs.value,m);l.some((a,u)=>m(n.tabs.value[u])!==m(a))&&n.setSelectedIndex(l.findIndex(a=>m(a)===m(n.tabs.value[p.value])))}),()=>{let l={selectedIndex:t.value};return j(q,[r.value.length<=0&&j(Ie,{onFocus:()=>{for(let a of r.value){let u=m(a);if((u==null?void 0:u.tabIndex)===0)return u.focus(),!0}return!1}}),B({theirProps:{...c,...oe(e,["selectedIndex","defaultIndex","manual","vertical","onChange"])},ourProps:{},slot:l,slots:o,attrs:c,name:"TabGroup"})])}}}),Pe=$({name:"TabList",props:{as:{type:[Object,String],default:"div"}},setup(e,{attrs:o,slots:c}){let f=D("TabList");return()=>{let s={selectedIndex:f.selectedIndex.value},t={role:"tablist","aria-orientation":f.orientation.value};return B({ourProps:t,theirProps:e,slot:s,attrs:o,slots:c,name:"TabList"})}}}),Se=$({name:"Tab",props:{as:{type:[Object,String],default:"button"},disabled:{type:[Boolean],default:!1},id:{type:String,default:()=>`headlessui-tabs-tab-${le()}`}},setup(e,{attrs:o,slots:c,expose:f}){let s=D("Tab"),t=h(null);f({el:t,$el:t}),z(()=>s.registerTab(t)),ne(()=>s.unregisterTab(t));let r=U(M),d=g(()=>{if(r.value){let a=r.value.tabs.indexOf(e.id);return a===-1?r.value.tabs.push(e.id)-1:a}return-1}),v=g(()=>{let a=s.tabs.value.indexOf(t);return a===-1?d.value:a}),p=g(()=>v.value===s.selectedIndex.value);function i(a){var u;let y=a();if(y===L.Success&&s.activation.value==="auto"){let P=(u=fe(t))==null?void 0:u.activeElement,I=s.tabs.value.findIndex(T=>m(T)===P);I!==-1&&s.setSelectedIndex(I)}return y}function n(a){let u=s.tabs.value.map(y=>m(y)).filter(Boolean);if(a.key===x.Space||a.key===x.Enter){a.preventDefault(),a.stopPropagation(),s.setSelectedIndex(v.value);return}switch(a.key){case x.Home:case x.PageUp:return a.preventDefault(),a.stopPropagation(),i(()=>O(u,k.First));case x.End:case x.PageDown:return a.preventDefault(),a.stopPropagation(),i(()=>O(u,k.Last))}if(i(()=>R(s.orientation.value,{vertical(){return a.key===x.ArrowUp?O(u,k.Previous|k.WrapAround):a.key===x.ArrowDown?O(u,k.Next|k.WrapAround):L.Error},horizontal(){return a.key===x.ArrowLeft?O(u,k.Previous|k.WrapAround):a.key===x.ArrowRight?O(u,k.Next|k.WrapAround):L.Error}}))===L.Success)return a.preventDefault()}let b=h(!1);function w(){var a;b.value||(b.value=!0,!e.disabled&&((a=m(t))==null||a.focus({preventScroll:!0}),s.setSelectedIndex(v.value),ce(()=>{b.value=!1})))}function S(a){a.preventDefault()}let l=de(g(()=>({as:e.as,type:o.type})),t);return()=>{var a;let u={selected:p.value},{id:y,...P}=e,I={ref:t,onKeydown:n,onMousedown:S,onClick:w,id:y,role:"tab",type:l.value,"aria-controls":(a=m(s.panels.value[v.value]))==null?void 0:a.id,"aria-selected":p.value,tabIndex:p.value?0:-1,disabled:e.disabled?!0:void 0};return B({ourProps:I,theirProps:P,slot:u,attrs:o,slots:c,name:"Tab"})}}}),$e=$({name:"TabPanels",props:{as:{type:[Object,String],default:"div"}},setup(e,{slots:o,attrs:c}){let f=D("TabPanels");return()=>{let s={selectedIndex:f.selectedIndex.value};return B({theirProps:e,ourProps:{},slot:s,attrs:c,slots:o,name:"TabPanels"})}}}),Oe=$({name:"TabPanel",props:{as:{type:[Object,String],default:"div"},static:{type:Boolean,default:!1},unmount:{type:Boolean,default:!0},id:{type:String,default:()=>`headlessui-tabs-panel-${le()}`},tabIndex:{type:Number,default:0}},setup(e,{attrs:o,slots:c,expose:f}){let s=D("TabPanel"),t=h(null);f({el:t,$el:t}),z(()=>s.registerPanel(t)),ne(()=>s.unregisterPanel(t));let r=U(M),d=g(()=>{if(r.value){let i=r.value.panels.indexOf(e.id);return i===-1?r.value.panels.push(e.id)-1:i}return-1}),v=g(()=>{let i=s.panels.value.indexOf(t);return i===-1?d.value:i}),p=g(()=>v.value===s.selectedIndex.value);return()=>{var i;let n={selected:p.value},{id:b,tabIndex:w,...S}=e,l={ref:t,id:b,role:"tabpanel","aria-labelledby":(i=m(s.tabs.value[v.value]))==null?void 0:i.id,tabIndex:p.value?w:-1};return!p.value&&e.unmount&&!e.static?j(ae,{as:"span",...l}):B({ourProps:l,theirProps:S,slot:n,attrs:o,slots:c,features:K.Static|K.RenderStrategy,visible:p.value,name:"TabPanel"})}}});const Ae=pe(J.ui.strategy,J.ui.tabs,we),He=$({components:{HTabGroup:ke,HTabList:Pe,HTab:Se,HTabPanels:$e,HTabPanel:Oe},inheritAttrs:!1,props:{modelValue:{type:Number,default:void 0},orientation:{type:String,default:"horizontal",validator:e=>["horizontal","vertical"].includes(e)},defaultIndex:{type:Number,default:0},items:{type:Array,default:()=>[]},class:{type:[String,Object,Array],default:()=>""},ui:{type:Object,default:()=>({})}},emits:["update:modelValue","change"],setup(e,{emit:o}){const{ui:c,attrs:f}=be("tabs",Q(e,"ui"),Ae,Q(e,"class")),s=h(),t=h([]),r=h(),d=h(e.modelValue||e.defaultIndex);function v(i){var b;const n=(b=t.value[i])==null?void 0:b.$el;n&&r.value&&(r.value.style.top=`${n.offsetTop}px`,r.value.style.left=`${n.offsetLeft}px`,r.value.style.width=`${n.offsetWidth}px`,r.value.style.height=`${n.offsetHeight}px`)}function p(i){d.value=i,o("change",i),e.modelValue!==void 0&&o("update:modelValue",d.value),v(d.value)}return me(s,()=>{v(d.value)}),te(()=>e.modelValue,i=>{d.value=i,v(d.value)}),z(()=>v(d.value)),{ui:c,attrs:f,listRef:s,itemRefs:t,markerRef:r,selectedIndex:d,onChange:p}}}),Ee={class:"truncate"};function Ce(e,o,c,f,s,t){const r=E("HTab"),d=E("HTabList"),v=E("HTabPanel"),p=E("HTabPanels"),i=E("HTabGroup");return C(),V(i,ye({vertical:e.orientation==="vertical","selected-index":e.selectedIndex,as:"div",class:e.ui.wrapper},e.attrs,{onChange:e.onChange}),{default:F(()=>[X(d,{ref:"listRef",class:A([e.ui.list.base,e.ui.list.background,e.ui.list.rounded,e.ui.list.shadow,e.ui.list.padding,e.ui.list.width,e.orientation==="horizontal"&&e.ui.list.height,e.orientation==="horizontal"&&"inline-grid items-center"]),style:ge([e.orientation==="horizontal"&&`grid-template-columns: repeat(${e.items.length}, minmax(0, 1fr))`])},{default:F(()=>[N("div",{ref:"markerRef",class:A(e.ui.list.marker.wrapper)},[N("div",{class:A([e.ui.list.marker.base,e.ui.list.marker.background,e.ui.list.marker.rounded,e.ui.list.marker.shadow])},null,2)],2),(C(!0),Y(q,null,Z(e.items,(n,b)=>(C(),V(r,{key:b,ref_for:!0,ref:"itemRefs",disabled:n.disabled,as:"template"},{default:F(({selected:w,disabled:S})=>[N("button",{class:A([e.ui.list.tab.base,e.ui.list.tab.background,e.ui.list.tab.height,e.ui.list.tab.padding,e.ui.list.tab.size,e.ui.list.tab.font,e.ui.list.tab.rounded,e.ui.list.tab.shadow,w?e.ui.list.tab.active:e.ui.list.tab.inactive])},[_(e.$slots,"default",{item:n,index:b,selected:w,disabled:S},()=>[N("span",Ee,ee(n.label),1)])],2)]),_:2},1032,["disabled"]))),128))]),_:3},8,["class","style"]),X(p,{class:A(e.ui.container)},{default:F(()=>[(C(!0),Y(q,null,Z(e.items,(n,b)=>(C(),V(v,{key:b,class:A(e.ui.base),tabindex:"-1"},{default:F(({selected:w})=>[_(e.$slots,n.slot||"item",{item:n,index:b,selected:w},()=>[he(ee(n.content),1)])]),_:2},1032,["class"]))),128))]),_:3},8,["class"])]),_:3},16,["vertical","selected-index","class","onChange"])}const ze=ve(He,[["render",Ce]]);export{ze as _};
//# sourceMappingURL=Tabs.78076109.js.map