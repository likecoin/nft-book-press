(function(){try{var r=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},e=new Error().stack;e&&(r._sentryDebugIds=r._sentryDebugIds||{},r._sentryDebugIds[e]="ffffa417-ed95-4a7c-9f54-9a10835bd293",r._sentryDebugIdIdentifier="sentry-dbid-ffffa417-ed95-4a7c-9f54-9a10835bd293")}catch{}})();var t={"+":["conjugate","add"],"−":["negate","subtract"],"×":["signOf","multiply"],"÷":["reciprocal","divide"],"⌈":["ceiling","greaterOf"],"⌊":["floor","lesserOf"],"∣":["absolute","residue"],"⍳":["indexGenerate","indexOf"],"?":["roll","deal"],"⋆":["exponentiate","toThePowerOf"],"⍟":["naturalLog","logToTheBase"],"○":["piTimes","circularFuncs"],"!":["factorial","binomial"],"⌹":["matrixInverse","matrixDivide"],"<":[null,"lessThan"],"≤":[null,"lessThanOrEqual"],"=":[null,"equals"],">":[null,"greaterThan"],"≥":[null,"greaterThanOrEqual"],"≠":[null,"notEqual"],"≡":["depth","match"],"≢":[null,"notMatch"],"∈":["enlist","membership"],"⍷":[null,"find"],"∪":["unique","union"],"∩":[null,"intersection"],"∼":["not","without"],"∨":[null,"or"],"∧":[null,"and"],"⍱":[null,"nor"],"⍲":[null,"nand"],"⍴":["shapeOf","reshape"],",":["ravel","catenate"],"⍪":[null,"firstAxisCatenate"],"⌽":["reverse","rotate"],"⊖":["axis1Reverse","axis1Rotate"],"⍉":["transpose",null],"↑":["first","take"],"↓":[null,"drop"],"⊂":["enclose","partitionWithAxis"],"⊃":["diclose","pick"],"⌷":[null,"index"],"⍋":["gradeUp",null],"⍒":["gradeDown",null],"⊤":["encode",null],"⊥":["decode",null],"⍕":["format","formatByExample"],"⍎":["execute",null],"⊣":["stop","left"],"⊢":["pass","right"]},l=/[\.\/⌿⍀¨⍣]/,a=/⍬/,i=/[\+−×÷⌈⌊∣⍳\?⋆⍟○!⌹<≤=>≥≠≡≢∈⍷∪∩∼∨∧⍱⍲⍴,⍪⌽⊖⍉↑↓⊂⊃⌷⍋⍒⊤⊥⍕⍎⊣⊢]/,u=/←/,f=/[⍝#].*$/,o=function(r){var e;return e=!1,function(n){return e=n,n===r?e==="\\":!0}};const s={name:"apl",startState:function(){return{prev:!1,func:!1,op:!1,string:!1,escape:!1}},token:function(r,e){var n;return r.eatSpace()?null:(n=r.next(),n==='"'||n==="'"?(r.eatWhile(o(n)),r.next(),e.prev=!0,"string"):/[\[{\(]/.test(n)?(e.prev=!1,null):/[\]}\)]/.test(n)?(e.prev=!0,null):a.test(n)?(e.prev=!1,"atom"):/[¯\d]/.test(n)?(e.func?(e.func=!1,e.prev=!1):e.prev=!0,r.eatWhile(/[\w\.]/),"number"):l.test(n)||u.test(n)?"operator":i.test(n)?(e.func=!0,e.prev=!1,t[n]?"variableName.function.standard":"variableName.function"):f.test(n)?(r.skipToEnd(),"comment"):n==="∘"&&r.peek()==="."?(r.next(),"variableName.function"):(r.eatWhile(/[\w\$_]/),e.prev=!0,"keyword"))}};export{s as apl};
//# sourceMappingURL=apl.c4927234.js.map