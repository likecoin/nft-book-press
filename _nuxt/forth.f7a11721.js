(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},n=new Error().stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d2ba7586-9a18-4b40-857c-14cbd9009f0d",e._sentryDebugIdIdentifier="sentry-dbid-d2ba7586-9a18-4b40-857c-14cbd9009f0d")}catch{}})();function r(e){var n=[];return e.split(" ").forEach(function(E){n.push({name:E})}),n}var R=r("INVERT AND OR XOR 2* 2/ LSHIFT RSHIFT 0= = 0< < > U< MIN MAX 2DROP 2DUP 2OVER 2SWAP ?DUP DEPTH DROP DUP OVER ROT SWAP >R R> R@ + - 1+ 1- ABS NEGATE S>D * M* UM* FM/MOD SM/REM UM/MOD */ */MOD / /MOD MOD HERE , @ ! CELL+ CELLS C, C@ C! CHARS 2@ 2! ALIGN ALIGNED +! ALLOT CHAR [CHAR] [ ] BL FIND EXECUTE IMMEDIATE COUNT LITERAL STATE ; DOES> >BODY EVALUATE SOURCE >IN <# # #S #> HOLD SIGN BASE >NUMBER HEX DECIMAL FILL MOVE . CR EMIT SPACE SPACES TYPE U. .R U.R ACCEPT TRUE FALSE <> U> 0<> 0> NIP TUCK ROLL PICK 2>R 2R@ 2R> WITHIN UNUSED MARKER I J TO COMPILE, [COMPILE] SAVE-INPUT RESTORE-INPUT PAD ERASE 2LITERAL DNEGATE D- D+ D0< D0= D2* D2/ D< D= DMAX DMIN D>S DABS M+ M*/ D. D.R 2ROT DU< CATCH THROW FREE RESIZE ALLOCATE CS-PICK CS-ROLL GET-CURRENT SET-CURRENT FORTH-WORDLIST GET-ORDER SET-ORDER PREVIOUS SEARCH-WORDLIST WORDLIST FIND ALSO ONLY FORTH DEFINITIONS ORDER -TRAILING /STRING SEARCH COMPARE CMOVE CMOVE> BLANK SLITERAL"),O=r("IF ELSE THEN BEGIN WHILE REPEAT UNTIL RECURSE [IF] [ELSE] [THEN] ?DO DO LOOP +LOOP UNLOOP LEAVE EXIT AGAIN CASE OF ENDOF ENDCASE");function t(e,n){var E;for(E=e.length-1;E>=0;E--)if(e[E].name===n.toUpperCase())return e[E]}const f={name:"forth",startState:function(){return{state:"",base:10,coreWordList:R,immediateWordList:O,wordList:[]}},token:function(e,n){var E;if(e.eatSpace())return null;if(n.state===""){if(e.match(/^(\]|:NONAME)(\s|$)/i))return n.state=" compilation","builtin";if(E=e.match(/^(\:)\s+(\S+)(\s|$)+/),E)return n.wordList.push({name:E[2].toUpperCase()}),n.state=" compilation","def";if(E=e.match(/^(VARIABLE|2VARIABLE|CONSTANT|2CONSTANT|CREATE|POSTPONE|VALUE|WORD)\s+(\S+)(\s|$)+/i),E)return n.wordList.push({name:E[2].toUpperCase()}),"def";if(E=e.match(/^(\'|\[\'\])\s+(\S+)(\s|$)+/),E)return"builtin"}else{if(e.match(/^(\;|\[)(\s)/))return n.state="",e.backUp(1),"builtin";if(e.match(/^(\;|\[)($)/))return n.state="","builtin";if(e.match(/^(POSTPONE)\s+\S+(\s|$)+/))return"builtin"}if(E=e.match(/^(\S+)(\s+|$)/),E)return t(n.wordList,E[1])!==void 0?"variable":E[1]==="\\"?(e.skipToEnd(),"comment"):t(n.coreWordList,E[1])!==void 0?"builtin":t(n.immediateWordList,E[1])!==void 0?"keyword":E[1]==="("?(e.eatWhile(function(i){return i!==")"}),e.eat(")"),"comment"):E[1]===".("?(e.eatWhile(function(i){return i!==")"}),e.eat(")"),"string"):E[1]==='S"'||E[1]==='."'||E[1]==='C"'?(e.eatWhile(function(i){return i!=='"'}),e.eat('"'),"string"):E[1]-68719476735?"number":"atom"}};export{f as forth};
//# sourceMappingURL=forth.f7a11721.js.map