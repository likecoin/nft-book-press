import{I as y,r as h,e as k}from"./entry.d4d0584e.js";var p=function(t,c){c||(c={}),typeof c=="function"&&(c={cmp:c});var r=typeof c.cycles=="boolean"?c.cycles:!1,f=c.cmp&&function(l){return function(e){return function(n,i){var a={key:n,value:e[n]},s={key:i,value:e[i]};return l(a,s)}}}(c.cmp),o=[];return function l(e){if(e&&e.toJSON&&typeof e.toJSON=="function"&&(e=e.toJSON()),e!==void 0){if(typeof e=="number")return isFinite(e)?""+e:"null";if(typeof e!="object")return JSON.stringify(e);var n,i;if(Array.isArray(e)){for(i="[",n=0;n<e.length;n++)n&&(i+=","),i+=l(e[n])||"null";return i+"]"}if(e===null)return"null";if(o.indexOf(e)!==-1){if(r)return JSON.stringify("__cycle__");throw new TypeError("Converting circular structure to JSON")}var a=o.push(e)-1,s=Object.keys(e).sort(f&&f(e));for(i="",n=0;n<s.length;n++){var m=s[n],g=l(e[m]);g&&(i&&(i+=","),i+=JSON.stringify(m)+":"+g)}return o.splice(a,1),"{"+i+"}"}}(t)};const b={chainId:"likecoin-mainnet-2",chainName:"LikeCoin",chainSymbolImageUrl:"https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/likecoin-mainnet/chain.png",rpc:"https://mainnet-node-rpc.like.co",rest:"https://mainnet-node.like.co",nodeProvider:{name:"like.co",email:"team@like.co",website:"https://like.co/"},bip44:{coinType:118},bech32Config:{bech32PrefixAccAddr:"like",bech32PrefixAccPub:"likepub",bech32PrefixValAddr:"likevaloper",bech32PrefixValPub:"likevaloperpub",bech32PrefixConsAddr:"likevalcons",bech32PrefixConsPub:"likevalconspub"},currencies:[{coinDenom:"LIKE",coinMinimalDenom:"nanolike",coinDecimals:9,coinGeckoId:"likecoin"}],feeCurrencies:[{coinDenom:"LIKE",coinMinimalDenom:"nanolike",coinDecimals:9,coinGeckoId:"likecoin",gasPriceStep:{low:1,average:10,high:1e3}}],stakeCurrency:{coinDenom:"LIKE",coinMinimalDenom:"nanolike",coinDecimals:9,coinGeckoId:"likecoin"},features:[]},u={...b},S=y("wallet",()=>{const t=h([]),c=h(null),r=k(()=>{var n;return(n=t.value[0])==null?void 0:n.address}),f=k(()=>!!r.value);async function o(){if(!window.keplr)return;const{keplr:n}=window;if(await n.experimentalSuggestChain(u),await n.enable(u.chainId),!window.getOfflineSigner)throw new Error("CANNOT_FIND_OFFLINE_SIGNER");const i=window.getOfflineSigner(u.chainId);c.value=i;const a=await i.getAccounts();t.value=a}async function l(n,i){if((!c.value||!r.value)&&await o(),!c.value||!r.value)throw new Error("WALLET_NOT_INITED");const a=Date.now(),s=JSON.stringify({action:n,permissions:i,likeWallet:r.value,ts:a}),m={chain_id:u.chainId,memo:s,msgs:[],fee:{gas:"0",amount:[{denom:u.feeCurrencies[0].coinDenom,amount:"0"}]},sequence:"0",account_number:"0"},{signed:g,signature:v}=await c.value.signAmino(r.value,m);return{signature:v.signature,publicKey:v.pub_key.value,message:p(g),wallet:r.value,signMethod:"memo"}}function e(){c.value=null,t.value=[]}return{accounts:t,signer:c,wallet:r,isConnected:f,connect:o,disconnect:e,signMessageMemo:l}});export{p as f,S as u};