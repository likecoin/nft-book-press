(function(){try{var n=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},i=new Error().stack;i&&(n._sentryDebugIds=n._sentryDebugIds||{},n._sentryDebugIds[i]="32ec9633-a72b-4f31-a6f3-05b110b84a5e",n._sentryDebugIdIdentifier="sentry-dbid-32ec9633-a72b-4f31-a6f3-05b110b84a5e")}catch{}})();function y(n){a(n,"start");var i={},e=n.languageData||{},u=!1;for(var o in n)if(o!=e&&n.hasOwnProperty(o))for(var p=i[o]=[],r=n[o],t=0;t<r.length;t++){var f=r[t];p.push(new h(f,n)),(f.indent||f.dedent)&&(u=!0)}return{name:e.name,startState:function(){return{state:"start",pending:null,indent:u?[]:null}},copyState:function(d){var g={state:d.state,pending:d.pending,indent:d.indent&&d.indent.slice(0)};return d.stack&&(g.stack=d.stack.slice(0)),g},token:l(i),indent:x(i,e),languageData:e}}function a(n,i){if(!n.hasOwnProperty(i))throw new Error("Undefined state "+i+" in simple mode")}function c(n,i){if(!n)return/(?:)/;var e="";return n instanceof RegExp?(n.ignoreCase&&(e="i"),n=n.source):n=String(n),new RegExp("^(?:"+n+")",e)}function s(n){if(!n)return null;if(n.apply)return n;if(typeof n=="string")return n.replace(/\./g," ");for(var i=[],e=0;e<n.length;e++)i.push(n[e]&&n[e].replace(/\./g," "));return i}function h(n,i){(n.next||n.push)&&a(i,n.next||n.push),this.regex=c(n.regex),this.token=s(n.token),this.data=n}function l(n){return function(i,e){if(e.pending){var u=e.pending.shift();return e.pending.length==0&&(e.pending=null),i.pos+=u.text.length,u.token}for(var o=n[e.state],p=0;p<o.length;p++){var r=o[p],t=(!r.data.sol||i.sol())&&i.match(r.regex);if(t){r.data.next?e.state=r.data.next:r.data.push?((e.stack||(e.stack=[])).push(e.state),e.state=r.data.push):r.data.pop&&e.stack&&e.stack.length&&(e.state=e.stack.pop()),r.data.indent&&e.indent.push(i.indentation()+i.indentUnit),r.data.dedent&&e.indent.pop();var f=r.token;if(f&&f.apply&&(f=f(t)),t.length>2&&r.token&&typeof r.token!="string"){e.pending=[];for(var d=2;d<t.length;d++)t[d]&&e.pending.push({text:t[d],token:r.token[d-1]});return i.backUp(t[0].length-(t[1]?t[1].length:0)),f[0]}else return f&&f.join?f[0]:f}}return i.next(),null}}function x(n,i){return function(e,u){if(e.indent==null||i.dontIndentStates&&i.doneIndentState.indexOf(e.state)>-1)return null;var o=e.indent.length-1,p=n[e.state];n:for(;;){for(var r=0;r<p.length;r++){var t=p[r];if(t.data.dedent&&t.data.dedentIfLineStart!==!1){var f=t.regex.exec(u);if(f&&f[0]){o--,(t.next||t.push)&&(p=n[t.next||t.push]),u=u.slice(f[0].length);continue n}}}break}return o<0?0:e.indent[o]}}export{y as s};
//# sourceMappingURL=7or5I6YJ.js.map