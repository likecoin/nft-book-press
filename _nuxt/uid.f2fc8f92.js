import{ai as t,r as F,a3 as B,j as m,aB as h}from"./entry.504ce77b.js";const C=(a,v)=>{const u=t("form-events",void 0),e=t("form-group",void 0),i=t("form-inputs",void 0),d=F(a==null?void 0:a.id);B(()=>{d.value=(a==null?void 0:a.id)??(e==null?void 0:e.inputId.value),e&&(e.inputId.value=d.value,i&&(i.value[e.name.value]=d))});const z=F(!1);function c(l,n){u&&u.emit({type:l,path:n})}function I(){c("blur",e==null?void 0:e.name.value),z.value=!0}function s(){c("change",e==null?void 0:e.name.value)}const b=h(()=>{z.value&&c("input",e==null?void 0:e.name.value)},300);return{inputId:d,name:m(()=>(a==null?void 0:a.name)??(e==null?void 0:e.name.value)),size:m(()=>{var n;const l=v.size[e==null?void 0:e.size.value]?e==null?void 0:e.size.value:null;return(a==null?void 0:a.size)??l??((n=v==null?void 0:v.default)==null?void 0:n.size)}),color:m(()=>{var l;return(l=e==null?void 0:e.error)!=null&&l.value?"red":a==null?void 0:a.color}),emitFormBlur:I,emitFormInput:b,emitFormChange:s}};let j=0;function D(){return`nuid-${j++}`}export{D as a,C as u};