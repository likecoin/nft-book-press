(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},n=new Error().stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="25bfca6a-4e5f-478b-936b-de0d6066653c",e._sentryDebugIdIdentifier="sentry-dbid-25bfca6a-4e5f-478b-936b-de0d6066653c")}catch{}})();var i={slash:0,parenthesis:1},c={comment:0,_string:1,characterClass:2};const r={name:"ebnf",startState:function(){return{stringType:null,commentType:null,braced:0,lhs:!0,localState:null,stack:[],inDefinition:!1}},token:function(e,n){if(e){switch(n.stack.length===0&&(e.peek()=='"'||e.peek()=="'"?(n.stringType=e.peek(),e.next(),n.stack.unshift(c._string)):e.match("/*")?(n.stack.unshift(c.comment),n.commentType=i.slash):e.match("(*")&&(n.stack.unshift(c.comment),n.commentType=i.parenthesis)),n.stack[0]){case c._string:for(;n.stack[0]===c._string&&!e.eol();)e.peek()===n.stringType?(e.next(),n.stack.shift()):e.peek()==="\\"?(e.next(),e.next()):e.match(/^.[^\\\"\']*/);return n.lhs?"property":"string";case c.comment:for(;n.stack[0]===c.comment&&!e.eol();)n.commentType===i.slash&&e.match("*/")||n.commentType===i.parenthesis&&e.match("*)")?(n.stack.shift(),n.commentType=null):e.match(/^.[^\*]*/);return"comment";case c.characterClass:for(;n.stack[0]===c.characterClass&&!e.eol();)e.match(/^[^\]\\]+/)||e.match(".")||n.stack.shift();return"operator"}var t=e.peek();switch(t){case"[":return e.next(),n.stack.unshift(c.characterClass),"bracket";case":":case"|":case";":return e.next(),"operator";case"%":if(e.match("%%"))return"header";if(e.match(/[%][A-Za-z]+/))return"keyword";if(e.match(/[%][}]/))return"bracket";break;case"/":if(e.match(/[\/][A-Za-z]+/))return"keyword";case"\\":if(e.match(/[\][a-z]+/))return"string.special";case".":if(e.match("."))return"atom";case"*":case"-":case"+":case"^":if(e.match(t))return"atom";case"$":if(e.match("$$"))return"builtin";if(e.match(/[$][0-9]+/))return"variableName.special";case"<":if(e.match(/<<[a-zA-Z_]+>>/))return"builtin"}return e.match("//")?(e.skipToEnd(),"comment"):e.match("return")?"operator":e.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)?e.match(/(?=[\(.])/)?"variable":e.match(/(?=[\s\n]*[:=])/)?"def":"variableName.special":["[","]","(",")"].indexOf(e.peek())!=-1?(e.next(),"bracket"):(e.eatSpace()||e.next(),null)}}};export{r as ebnf};
//# sourceMappingURL=CGNbjxzI.js.map