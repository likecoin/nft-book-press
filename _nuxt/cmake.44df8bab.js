(function(){try{var n=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},e=new Error().stack;e&&(n._sentryDebugIds=n._sentryDebugIds||{},n._sentryDebugIds[e]="b6c2aa75-df77-4029-bf7b-f684bafbe516",n._sentryDebugIdIdentifier="sentry-dbid-b6c2aa75-df77-4029-bf7b-f684bafbe516")}catch{}})();var u=/({)?[a-zA-Z0-9_]+(})?/;function t(n,e){for(var i,r,f=!1;!n.eol()&&(i=n.next())!=e.pending;){if(i==="$"&&r!="\\"&&e.pending=='"'){f=!0;break}r=i}return f&&n.backUp(1),i==e.pending?e.continueString=!1:e.continueString=!0,"string"}function c(n,e){var i=n.next();return i==="$"?n.match(u)?"variableName.special":"variable":e.continueString?(n.backUp(1),t(n,e)):n.match(/(\s+)?\w+\(/)||n.match(/(\s+)?\w+\ \(/)?(n.backUp(1),"def"):i=="#"?(n.skipToEnd(),"comment"):i=="'"||i=='"'?(e.pending=i,t(n,e)):i=="("||i==")"?"bracket":i.match(/[0-9]/)?"number":(n.eatWhile(/[\w-]/),null)}const a={name:"cmake",startState:function(){var n={};return n.inDefinition=!1,n.inInclude=!1,n.continueString=!1,n.pending=!1,n},token:function(n,e){return n.eatSpace()?null:c(n,e)}};export{a as cmake};
//# sourceMappingURL=cmake.44df8bab.js.map