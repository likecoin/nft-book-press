(function(){try{var n=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},e=new Error().stack;e&&(n._sentryDebugIds=n._sentryDebugIds||{},n._sentryDebugIds[e]="f21eea46-cabf-42a7-b8bf-1b7f7cb88db3",n._sentryDebugIdIdentifier="sentry-dbid-f21eea46-cabf-42a7-b8bf-1b7f7cb88db3")}catch{}})();function c(n){for(var e={},t=0;t<n.length;t++)e[n[t]]=!0;return e}var l=c(["_","var","let","actor","class","enum","extension","import","protocol","struct","func","typealias","associatedtype","open","public","internal","fileprivate","private","deinit","init","new","override","self","subscript","super","convenience","dynamic","final","indirect","lazy","required","static","unowned","unowned(safe)","unowned(unsafe)","weak","as","is","break","case","continue","default","else","fallthrough","for","guard","if","in","repeat","switch","where","while","defer","return","inout","mutating","nonmutating","isolated","nonisolated","catch","do","rethrows","throw","throws","async","await","try","didSet","get","set","willSet","assignment","associativity","infix","left","none","operator","postfix","precedence","precedencegroup","prefix","right","Any","AnyObject","Type","dynamicType","Self","Protocol","__COLUMN__","__FILE__","__FUNCTION__","__LINE__"]),d=c(["var","let","actor","class","enum","extension","import","protocol","struct","func","typealias","associatedtype","for"]),p=c(["true","false","nil","self","super","_"]),v=c(["Array","Bool","Character","Dictionary","Double","Float","Int","Int8","Int16","Int32","Int64","Never","Optional","Set","String","UInt8","UInt16","UInt32","UInt64","Void"]),h="+-/*%=|&<>~^?!",s=":;,.(){}[]",b=/^\-?0b[01][01_]*/,y=/^\-?0o[0-7][0-7_]*/,_=/^\-?0x[\dA-Fa-f][\dA-Fa-f_]*(?:(?:\.[\dA-Fa-f][\dA-Fa-f_]*)?[Pp]\-?\d[\d_]*)?/,g=/^\-?\d[\d_]*(?:\.\d[\d_]*)?(?:[Ee]\-?\d[\d_]*)?/,k=/^\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1/,w=/^\.(?:\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1)/,x=/^\#[A-Za-z]+/,z=/^@(?:\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1)/;function f(n,e,t){if(n.sol()&&(e.indented=n.indentation()),n.eatSpace())return null;var i=n.peek();if(i=="/"){if(n.match("//"))return n.skipToEnd(),"comment";if(n.match("/*"))return e.tokenize.push(a),a(n,e)}if(n.match(x))return"builtin";if(n.match(z))return"attribute";if(n.match(b)||n.match(y)||n.match(_)||n.match(g))return"number";if(n.match(w))return"property";if(h.indexOf(i)>-1)return n.next(),"operator";if(s.indexOf(i)>-1)return n.next(),n.match(".."),"punctuation";var r;if(r=n.match(/("""|"|')/)){var o=A.bind(null,r[0]);return e.tokenize.push(o),o(n,e)}if(n.match(k)){var u=n.current();return v.hasOwnProperty(u)?"type":p.hasOwnProperty(u)?"atom":l.hasOwnProperty(u)?(d.hasOwnProperty(u)&&(e.prev="define"),"keyword"):t=="define"?"def":"variable"}return n.next(),null}function I(){var n=0;return function(e,t,i){var r=f(e,t,i);if(r=="punctuation"){if(e.current()=="(")++n;else if(e.current()==")"){if(n==0)return e.backUp(1),t.tokenize.pop(),t.tokenize[t.tokenize.length-1](e,t);--n}}return r}}function A(n,e,t){for(var i=n.length==1,r,o=!1;r=e.peek();)if(o){if(e.next(),r=="(")return t.tokenize.push(I()),"string";o=!1}else{if(e.match(n))return t.tokenize.pop(),"string";e.next(),o=r=="\\"}return i&&t.tokenize.pop(),"string"}function a(n,e){for(var t;t=n.next();)if(t==="/"&&n.eat("*"))e.tokenize.push(a);else if(t==="*"&&n.eat("/")){e.tokenize.pop();break}return"comment"}function O(n,e,t){this.prev=n,this.align=e,this.indented=t}function m(n,e){var t=e.match(/^\s*($|\/[\/\*]|[)}\]])/,!1)?null:e.column()+1;n.context=new O(n.context,t,n.indented)}function S(n){n.context&&(n.indented=n.context.indented,n.context=n.context.prev)}const C={name:"swift",startState:function(){return{prev:null,context:null,indented:0,tokenize:[]}},token:function(n,e){var t=e.prev;e.prev=null;var i=e.tokenize[e.tokenize.length-1]||f,r=i(n,e,t);if(!r||r=="comment"?e.prev=t:e.prev||(e.prev=r),r=="punctuation"){var o=/[\(\[\{]|([\]\)\}])/.exec(n.current());o&&(o[1]?S:m)(e,n)}return r},indent:function(n,e,t){var i=n.context;if(!i)return 0;var r=/^[\]\}\)]/.test(e);return i.align!=null?i.align-(r?1:0):i.indented+(r?0:t.unit)},languageData:{indentOnInput:/^\s*[\)\}\]]$/,commentTokens:{line:"//",block:{open:"/*",close:"*/"}},closeBrackets:{brackets:["(","[","{","'",'"',"`"]}}};export{C as swift};
//# sourceMappingURL=swift.dcc25f67.js.map