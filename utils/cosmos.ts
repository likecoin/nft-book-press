import { BigNumber } from 'bignumber.js'
import { MsgSend } from 'cosmjs-types/cosmos/nft/v1beta1/tx'
import { PageRequest } from 'cosmjs-types/cosmos/base/query/v1beta1/pagination'
import { GenericAuthorization } from 'cosmjs-types/cosmos/authz/v1beta1/authz'

import type { OfflineSigner } from '@cosmjs/proto-signing'
import type { DeliverTxResponse } from '@cosmjs/stargate'
import type { ISCNRecordData, ISCNSigningClient } from '@likecoin/iscn-js'

import { addParamToUrl } from '.'
import { TRANSFER_GAS } from '~/constant'

const DEFAULT_GAS_AMOUNT = 200000
const DEFAULT_GAS_PRICE = 10000

export const royaltyRateBasisPoints = 1000 // 10% as in current chain config
export const royaltyFeeAmount = 25000 // 2.5%
export const royaltyUserAmount = 1000000 - royaltyFeeAmount // 1000000 - fee

let iscnSigningClient: any = null
let iscnLib: any = null
let cosmLib: any = null

async function getISCNLib () {
  if (!iscnLib) {
    const lib = await import(/* webpackChunkName: "iscn" */ '@likecoin/iscn-js')
    const [parsing, msgParsing, likenft] = await Promise.all([
      await import(/* webpackChunkName: "iscn" */ '@likecoin/iscn-js/dist/iscn/parsing'),
      await import(/* webpackChunkName: "iscn" */ '@likecoin/iscn-js/dist/messages/parsing'),
      await import(/* webpackChunkName: "iscn" */ '@likecoin/iscn-js/dist/messages/likenft')
    ])
    iscnLib = {
      ...lib,
      parseAndCalculateStakeholderRewards: parsing.parseAndCalculateStakeholderRewards,
      parseAuthzGrant: msgParsing.parseAuthzGrant,
      parseTxInfoFromIndexedTx: msgParsing.parseTxInfoFromIndexedTx,
      formatMsgSend: likenft.formatMsgSend
    }
  }
  return iscnLib
}

async function getCosmLib () {
  if (!cosmLib) {
    cosmLib = await import(/* webpackChunkName: "cosmjs" */ '@cosmjs/stargate')
  }
  return cosmLib
}

export async function getSigningClient (): Promise<ISCNSigningClient> {
  if (!iscnSigningClient) {
    const { RPC_URL } = useRuntimeConfig().public
    const { ISCNSigningClient } = await getISCNLib()
    const c = new ISCNSigningClient()
    await c.connect(RPC_URL)
    iscnSigningClient = c
  }
  return iscnSigningClient
}

export async function getSigningClientWithSigner (signer: OfflineSigner): Promise<ISCNSigningClient> {
  const { RPC_URL } = useRuntimeConfig().public
  const signingClient = await getSigningClient()
  await signingClient.connectWithSigner(RPC_URL, signer)
  return signingClient
}

export function getGasFee (count: number) {
  const network = getNetworkConfig()
  return {
    amount: [
      {
        denom: network.feeCurrencies[0].coinMinimalDenom,
        amount: new BigNumber(count)
          .multipliedBy(DEFAULT_GAS_AMOUNT)
          .multipliedBy(DEFAULT_GAS_PRICE)
          .toFixed(0)
      }
    ],
    gas: new BigNumber(count)
      .multipliedBy(DEFAULT_GAS_AMOUNT)
      .toFixed(0)
  }
}

export async function queryTxByHash (txHash: string) {
  const client = await (await getSigningClient()).getISCNQueryClient().getStargateClient()
  const tx = await client.getTx(txHash)
  if (!tx) { return null }
  const { code } = tx
  if (code) { throw new Error(`Tx failed with code: ${code}`) }
  const { parseTxInfoFromIndexedTx } = await getISCNLib()
  const parsed = parseTxInfoFromIndexedTx(tx)
  return parsed
}

export async function queryISCNById (iscnId: string) {
  const c = (await getSigningClient()).getISCNQueryClient()
  const res = await c.queryRecordsById(iscnId)
  if (!res?.records[0].data) { return null }
  return {
    owner: res.owner,
    data: res.records[0].data
  }
}

export async function getNFTOwner (classId: string, nftId: string) {
  const c = (await getSigningClient()).getISCNQueryClient()
  const client = await c.getQueryClient()
  const res = await client.nft.owner(
    classId,
    nftId
  )
  return { owner: res.owner }
}

export async function getNFTAuthzGranterGrants (granter: string) {
  const c = (await getSigningClient()).getISCNQueryClient()
  const client = await c.getQueryClient()
  const g = await client.authz.granterGrants(granter)
  if (!g?.grants) {
    return []
  }
  const { parseAuthzGrant } = await getISCNLib()
  const grants = g.grants
    .map(parseAuthzGrant)
    .filter(
      (g: any) =>
        (g?.authorization?.value as GenericAuthorization)?.msg ===
        '/cosmos.nft.v1beta1.MsgSend'
    )
  return grants
}

export async function getNFTAuthzGrants (granter: string, grantee: string) {
  const c = (await getSigningClient()).getISCNQueryClient()
  const client = await c.getQueryClient()
  const g = await client.authz.grants(granter, grantee, '/cosmos.nft.v1beta1.MsgSend')
  if (!g?.grants) { return null }
  const { parseAuthzGrant } = await getISCNLib()
  const grants = g.grants.map(parseAuthzGrant)
  return grants[0]
}

export async function getNFTs ({ classId = '', owner = '', nftId = '', needCount = 0 }) {
  const c = (await getSigningClient()).getISCNQueryClient()
  const client = await c.getQueryClient()
  let nfts = []
  let next: Uint8Array | undefined = new Uint8Array([0x00])
  let nftCounts = 0
  let isNftIdFound = !nftId
  do {
    const res = await client.nft.NFTs(
      classId,
      owner,
      PageRequest.fromPartial({ key: next })
    );
    (next = res.pagination?.nextKey)
    if (!isNftIdFound) {
      const foundIndex = res.nfts.findIndex(nft => nft.id >= nftId)
      if (foundIndex >= 0) {
        isNftIdFound = true
        res.nfts = res.nfts.slice(foundIndex)
      }
    }
    if (isNftIdFound) {
      nfts.push(...res.nfts)
      nftCounts += res.nfts.length
      if (needCount && nftCounts > needCount) { break }
    }
  } while (next && next.length)
  if (needCount && nfts.length > needCount) {
    nfts = nfts.slice(0, needCount)
  }
  return { nfts }
}

export async function signCreateISCNRecord (
  data: any,
  signer: OfflineSigner,
  address: string,
  memo?: string
) {
  const { RPC_URL } = useRuntimeConfig().public
  const signingClient = await getSigningClient()
  await signingClient.connectWithSigner(RPC_URL, signer)
  const { contentMetadata, ...otherData } = data
  const parsedData = { ...otherData, ...contentMetadata }
  const res = await signingClient.createISCNRecord(address, parsedData, { memo })
  const queryClient = await signingClient.getISCNQueryClient()
  const [iscnId] = await queryClient.queryISCNIdsByTx((res as DeliverTxResponse).transactionHash)
  return iscnId
}

export async function signCreateNFTClass (
  data: any,
  iscnId: string,
  signer: OfflineSigner,
  address: string,
  { nftMaxSupply }: { nftMaxSupply?: number } = {},
  memo?: string
) {
  const { RPC_URL } = useRuntimeConfig().public
  const signingClient = await getSigningClient()
  await signingClient.connectWithSigner(RPC_URL, signer)
  let classConfig: any = null
  if (nftMaxSupply) { classConfig = { nftMaxSupply } }

  let { uri } = data
  const isUriHttp = uri && uri.startsWith('https://')
  if (isUriHttp) { uri = addParamToUrl(uri, { iscn_id: iscnId }) }
  const res = await signingClient.createNFTClass(
    address,
    iscnId,
    {
      ...data,
      uri
    },
    classConfig,
    { memo }
  )
  const rawLogs = JSON.parse((res as DeliverTxResponse).rawLog || '')
  const event = rawLogs[0].events.find(
    (e: any) => e.type === 'likechain.likenft.v1.EventNewClass'
  )
  const attribute = event.attributes.find((a: any) => a.key === 'class_id')
  const classId = ((attribute && attribute.value) || '').replace(/^"(.*)"$/, '$1')
  return classId
}

export async function signCreateRoyltyConfig (
  classId: string,
  iscnData: ISCNRecordData,
  iscnOwner: string,
  isUpdate: boolean,
  signer: OfflineSigner,
  address: string
) {
  const { RPC_URL, LIKER_NFT_FEE_WALLET } = useRuntimeConfig().public
  try {
    const rateBasisPoints = royaltyRateBasisPoints
    const feeAmount = royaltyFeeAmount
    const totalAmount = royaltyUserAmount
    const signingClient = await getSigningClient()
    await signingClient.connectWithSigner(RPC_URL, signer)
    const { parseAndCalculateStakeholderRewards } = await getISCNLib()
    const rewardMap: Map<string, {
      amount: string;
    }> = await parseAndCalculateStakeholderRewards(
      iscnData,
      iscnOwner,
      {
        precision: 0,
        totalAmount
      }
    )
    const rewards = Array.from(rewardMap.entries())
    const stakeholders = rewards.map((r) => {
      const [address, { amount }] = r
      return {
        account: address,
        weight: parseInt(amount, 10)
      }
    })
    stakeholders.push({
      account: LIKER_NFT_FEE_WALLET,
      weight: feeAmount
    })
    if (isUpdate) {
      await signingClient.createRoyaltyConfig(address, classId, {
        rateBasisPoints,
        stakeholders
      })
    } else {
      await signingClient.createRoyaltyConfig(address, classId, {
        rateBasisPoints,
        stakeholders
      })
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
}

export async function signMintNFT (
  nfts: any[],
  classId: string,
  signer: OfflineSigner,
  address: string,
  memo?: string
) {
  const { RPC_URL } = useRuntimeConfig().public
  const signingClient = await getSigningClient()
  await signingClient.connectWithSigner(RPC_URL, signer)
  const res = await signingClient.mintNFTs(
    address,
    classId,
    nfts,
    { memo }
  )
  return res
}

export async function signSendNFTs (
  targetAddress: string,
  classIds: string[],
  nftIds: string[],
  signer: OfflineSigner,
  address: string,
  memo?: string
) {
  const { RPC_URL } = useRuntimeConfig().public
  const signingClient = await getSigningClient()
  await signingClient.connectWithSigner(RPC_URL, signer)
  const { formatMsgSend } = await getISCNLib()
  const messages = classIds.map((classId, index) => formatMsgSend(
    address,
    targetAddress,
    classId,
    nftIds[index]
  ))
  const res = await signingClient.sendMessages(
    address,
    messages,
    { memo }
  ) as DeliverTxResponse
  return res
}

export async function signGrantNFTSendAuthz (
  grantee: string,
  signer: OfflineSigner,
  address: string,
  memo?: string
) {
  const { RPC_URL } = useRuntimeConfig().public
  const signingClient = await getSigningClient()
  await signingClient.connectWithSigner(RPC_URL, signer)
  const expirationInMs = Date.now() + 1000 * 5184000 // 60 days
  const res = await signingClient.createGenericGrant(address, grantee, '/cosmos.nft.v1beta1.MsgSend', expirationInMs, { memo })
  return res
}

export async function signExecNFTSendAuthz (
  targetAddress: string,
  ownerAddress: string,
  classIds: string[],
  nftIds: string[],
  signer: OfflineSigner,
  address: string,
  memo?: string
) {
  const { RPC_URL } = useRuntimeConfig().public
  const signingClient = await getSigningClient()
  await signingClient.connectWithSigner(RPC_URL, signer)
  const messages = [{
    typeUrl: '/cosmos.authz.v1beta1.MsgExec',
    value: {
      grantee: address,
      msgs: classIds.map((classId, index) => ({
        typeUrl: '/cosmos.nft.v1beta1.MsgSend',
        value: MsgSend.encode(
          MsgSend.fromPartial({
            sender: ownerAddress,
            receiver: targetAddress,
            classId,
            id: nftIds[index]
          })
        ).finish()
      }))
    }
  }]
  const res = await signingClient.sendMessages(
    address,
    messages,
    { memo }
  ) as DeliverTxResponse
  return res
}

export async function signRevokeNFTSendAuthz (
  grantee: string,
  signer: OfflineSigner,
  address: string,
  memo?: string
) {
  const { RPC_URL } = useRuntimeConfig().public
  const signingClient = await getSigningClient()
  await signingClient.connectWithSigner(RPC_URL, signer)
  const res = await signingClient.revokeGenericGrant(address, grantee, '/cosmos.nft.v1beta1.MsgSend', { memo })
  return res
}

export function shortenWalletAddress (address: string) {
  if (!address) { return '-' }
  return `${address.slice(0, 10)}...${address.slice(-6)}`
}

export async function sendNFTsToAPIWallet (
  classIds: string[],
  nftIds: string[],
  nftCount: number,
  signer: OfflineSigner,
  ownerAddress: string
) {
  if (nftCount <= 0) { return '' }

  if (!ownerAddress) {
    throw new Error('Missing owner address')
  }

  if (!signer) {
    throw new Error('Missing signer')
  }

  const results = await Promise.all(classIds.map((classId, index) => getNFTs({
    classId,
    nftId: nftIds[index],
    owner: ownerAddress,
    needCount: nftCount
  })))

  let totalClassIds: string[] = []
  let totalNftIds: string[] = []
  results.forEach(({ nfts }, index) => {
    const nftIds = nfts.map(nft => nft.id).slice(0, nftCount)
    const classId = classIds[index]
    if (nftIds.length < nftCount) {
      throw new Error(`Not enough NFTs, has ${nftIds.length} but need ${nftCount}`)
    }
    totalNftIds = totalNftIds.concat(nftIds)
    totalClassIds = totalClassIds.concat(nftIds.map(_ => classId))
  })

  const { LIKER_NFT_TARGET_ADDRESS } = useRuntimeConfig().public
  const { transactionHash, code } = await signSendNFTs(
    LIKER_NFT_TARGET_ADDRESS,
    totalClassIds,
    totalNftIds,
    signer,
    ownerAddress,
    'Commission Liker Land to help issue this NFT ebook'
  )

  if (!transactionHash || code !== 0) {
    throw new Error('Failed to sign and send NFTs')
  }

  for (let tryCount = 0; tryCount < 3; tryCount++) {
    await sleep(3000)
    try {
      const tx = await queryTxByHash(transactionHash)
      if (tx) {
        break
      }
    } catch {}
  }

  return transactionHash
}

export function amountToLIKE (likecoin: any, denom: string) {
  if (!likecoin) { return -1 }
  if (likecoin.denom === denom) {
    return (new BigNumber(likecoin.amount)).shiftedBy(-9).toFixed()
  }
  console.error(`${likecoin.denom} is not supported denom`)
  return -1
}

export async function getAccountBalance (address: string) {
  const { CHAIN_MINIMAL_DENOM } = useRuntimeConfig().public
  const c = (await getSigningClient()).getISCNQueryClient()
  const client = await c.getQueryClient()
  const balance = await client.bank.balance(address, CHAIN_MINIMAL_DENOM)
  return new BigNumber(amountToLIKE(balance, CHAIN_MINIMAL_DENOM))
}

export async function sendLIKE (
  fromAddress: string,
  toAddress: string,
  amount: string,
  signer: OfflineSigner,
  memo: string
) {
  const network = getNetworkConfig()
  const { CHAIN_MINIMAL_DENOM } = useRuntimeConfig().public
  const DEFAULT_TRANSFER_FEE = {
    gas: TRANSFER_GAS.toString(),
    amount: [{
      amount: new BigNumber(TRANSFER_GAS).multipliedBy(DEFAULT_GAS_PRICE).toFixed(0, 0),
      denom: CHAIN_MINIMAL_DENOM
    }]
  }

  const { SigningStargateClient, assertIsDeliverTxSuccess } = await getCosmLib()
  const client = await SigningStargateClient.connectWithSigner(network.rpc, signer)
  const coins = [{
    amount: new BigNumber(amount).shiftedBy(9).toFixed(0, 0),
    denom: CHAIN_MINIMAL_DENOM
  }]
  const res = await client.sendTokens(fromAddress, toAddress, coins, DEFAULT_TRANSFER_FEE, memo)
  assertIsDeliverTxSuccess(res)
  return res
}
