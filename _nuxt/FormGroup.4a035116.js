import{_ as j,aL as N,ds as q,aN as v,g as G,aQ as I,aR as S,aE as O,l as d,r as P,K as R,o as r,c as s,af as l,a as B,L as a,bf as i,a_ as o,F as n,d as t,t as p,v as f,bg as V}from"./entry.87a04d2e.js";import{u as w}from"./uid.4a8cc4bb.js";const y=N(v.ui.strategy,v.ui.formGroup,q),A=G({inheritAttrs:!1,props:{name:{type:String,default:null},size:{type:String,default:null,validator(e){return Object.keys(y.size).includes(e)}},label:{type:String,default:null},description:{type:String,default:null},required:{type:Boolean,default:!1},help:{type:String,default:null},error:{type:[String,Boolean],default:null},hint:{type:String,default:null},class:{type:[String,Object,Array],default:void 0},ui:{type:Object,default:void 0}},setup(e){const{ui:h,attrs:b}=I("formGroup",S(e,"ui"),y,S(e,"class")),u=O("form-errors",null),m=d(()=>{var k,z;return e.error&&typeof e.error=="string"||typeof e.error=="boolean"?e.error:(z=(k=u==null?void 0:u.value)==null?void 0:k.find(C=>C.path===e.name))==null?void 0:z.message}),g=d(()=>h.value.size[e.size??y.default.size]),$=P(w());return R("form-group",{error:m,inputId:$,name:d(()=>e.name),size:d(()=>e.size)}),{ui:h,attrs:b,inputId:$,size:g,error:m}}}),F=["for"];function L(e,h,b,u,m,g){return r(),s("div",o({class:e.ui.wrapper},e.attrs),[e.label||e.$slots.label?(r(),s("div",{key:0,class:l([e.ui.label.wrapper,e.size])},[B("label",{for:e.inputId,class:l([e.ui.label.base,e.required?e.ui.label.required:""])},[e.$slots.label?a(e.$slots,"label",i(o({key:0},{error:e.error,label:e.label,name:e.name,hint:e.hint,description:e.description,help:e.help}))):(r(),s(n,{key:1},[t(p(e.label),1)],64))],10,F),e.hint||e.$slots.hint?(r(),s("span",{key:0,class:l([e.ui.hint])},[e.$slots.hint?a(e.$slots,"hint",i(o({key:0},{error:e.error,label:e.label,name:e.name,hint:e.hint,description:e.description,help:e.help}))):(r(),s(n,{key:1},[t(p(e.hint),1)],64))],2)):f("",!0)],2)):f("",!0),e.description||e.$slots.description?(r(),s("p",{key:1,class:l([e.ui.description,e.size])},[e.$slots.description?a(e.$slots,"description",i(o({key:0},{error:e.error,label:e.label,name:e.name,hint:e.hint,description:e.description,help:e.help}))):(r(),s(n,{key:1},[t(p(e.description),1)],64))],2)):f("",!0),B("div",{class:l([e.label?e.ui.container:""])},[a(e.$slots,"default",i(V({error:e.error}))),typeof e.error=="string"&&e.error||e.$slots.error?(r(),s("p",{key:0,class:l([e.ui.error,e.size])},[e.$slots.error?a(e.$slots,"error",i(o({key:0},{error:e.error,label:e.label,name:e.name,hint:e.hint,description:e.description,help:e.help}))):(r(),s(n,{key:1},[t(p(e.error),1)],64))],2)):e.help||e.$slots.help?(r(),s("p",{key:1,class:l([e.ui.help,e.size])},[e.$slots.help?a(e.$slots,"help",i(o({key:0},{error:e.error,label:e.label,name:e.name,hint:e.hint,description:e.description,help:e.help}))):(r(),s(n,{key:1},[t(p(e.help),1)],64))],2)):f("",!0)],2)],16)}const K=j(A,[["render",L]]);export{K as _};