(function(){try{var n=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},e=new Error().stack;e&&(n._sentryDebugIds=n._sentryDebugIds||{},n._sentryDebugIds[e]="88fe328a-9ed6-45a5-ae7a-2d7a8f71c9d5",n._sentryDebugIdIdentifier="sentry-dbid-88fe328a-9ed6-45a5-ae7a-2d7a8f71c9d5")}catch{}})();let u;const i=new Uint8Array(16);function y(){if(!u&&(u=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!u))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return u(i)}const d=[];for(let n=0;n<256;++n)d.push((n+256).toString(16).slice(1));function r(n,e=0){return(d[n[e+0]]+d[n[e+1]]+d[n[e+2]]+d[n[e+3]]+"-"+d[n[e+4]]+d[n[e+5]]+"-"+d[n[e+6]]+d[n[e+7]]+"-"+d[n[e+8]]+d[n[e+9]]+"-"+d[n[e+10]]+d[n[e+11]]+d[n[e+12]]+d[n[e+13]]+d[n[e+14]]+d[n[e+15]]).toLowerCase()}const a=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),o={randomUUID:a};function p(n,e,c){if(o.randomUUID&&!e&&!n)return o.randomUUID();n=n||{};const t=n.random||(n.rng||y)();return t[6]=t[6]&15|64,t[8]=t[8]&63|128,r(t)}export{p as v};
//# sourceMappingURL=BBn7zdp2.js.map