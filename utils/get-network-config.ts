export default function () {
  const config = useRuntimeConfig().public
  const coinDenom = config.CHAIN_DENOM
  const coinMinimalDenom = config.CHAIN_MINIMAL_DENOM
  const coinGeckoId = config.COINGECKO_ID || undefined
  return {
    chainId: config.CHAIN_ID,
    chainName: config.CHAIN_NAME,
    rpc: config.RPC_URL,
    rest: config.LCD_URL,
    nodeProvider: {
      name: 'like.co',
      email: 'team@like.co',
      website: 'https://like.co/'
    },
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: 'like',
      bech32PrefixAccPub: 'likepub',
      bech32PrefixValAddr: 'likevaloper',
      bech32PrefixValPub: 'likevaloperpub',
      bech32PrefixConsAddr: 'likevalcons',
      bech32PrefixConsPub: 'likevalconspub'
    },
    currencies: [
      {
        coinDenom,
        coinMinimalDenom,
        coinDecimals: 9,
        coinGeckoId
      }
    ],
    feeCurrencies: [
      {
        coinDenom,
        coinMinimalDenom,
        coinDecimals: 9,
        coinGeckoId,
        gasPriceStep: {
          low: 1,
          average: 10,
          high: 1000
        }
      }
    ],
    stakeCurrency: {
      coinDenom,
      coinMinimalDenom,
      coinDecimals: 9,
      coinGeckoId
    },
    features: []
  }
}
