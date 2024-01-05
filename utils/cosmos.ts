import { BigNumber } from 'bignumber.js'
import { OfflineSigner } from '@cosmjs/proto-signing'
import { ISCNSigningClient, ISCNRecordData } from '@likecoin/iscn-js'
import { parseAndCalculateStakeholderRewards } from '@likecoin/iscn-js/dist/iscn/parsing'
import { MsgSend } from 'cosmjs-types/cosmos/nft/v1beta1/tx'
import { DeliverTxResponse } from '@cosmjs/stargate'
import { PageRequest } from 'cosmjs-types/cosmos/base/query/v1beta1/pagination'
import { parseAuthzGrant } from '@likecoin/iscn-js/dist/messages/parsing'
import { GenericAuthorization } from 'cosmjs-types/cosmos/authz/v1beta1/authz'
import { formatMsgSend } from '@likecoin/iscn-js/dist/messages/likenft'
import { addParamToUrl } from '.'
import { RPC_URL, LIKER_NFT_FEE_WALLET } from '~/constant'
import network from '~/constant/network'

const DEFAULT_GAS_AMOUNT = 200000
const DEFAULT_GAS_PRICE = 10000

export const royaltyRateBasisPoints = 1000 // 10% as in current chain config
export const royaltyFeeAmount = 25000 // 2.5%
export const royaltyUserAmount = 1000000 - royaltyFeeAmount // 1000000 - fee

let iscnSigningClient: ISCNSigningClient | null = null

export async function getSigningClient (): Promise<ISCNSigningClient> {
  if (!iscnSigningClient) {
    const c = new ISCNSigningClient()
    await c.connect(RPC_URL)
    iscnSigningClient = c
  }
  return iscnSigningClient
}

export async function getSigningClientWithSigner (signer: OfflineSigner): Promise<ISCNSigningClient> {
  const signingClient = await getSigningClient()
  await signingClient.connectWithSigner(RPC_URL, signer)
  return signingClient
}

export function getGasFee (count: number) {
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
  if (!g?.grants) { return [] }
  const grants = g.grants.map(parseAuthzGrant).filter(g => (g?.authorization?.value as GenericAuthorization)?.msg === '/cosmos.nft.v1beta1.MsgSend')
  return grants
}

export async function getNFTAuthzGrants (granter: string, grantee: string) {
  const c = (await getSigningClient()).getISCNQueryClient()
  const client = await c.getQueryClient()
  const g = await client.authz.grants(granter, grantee, '/cosmos.nft.v1beta1.MsgSend')
  if (!g?.grants) { return null }
  const grants = g.grants.map(parseAuthzGrant)
  return grants[0]
}

export async function getNFTs ({ classId = '', owner = '', needCount }) {
  const needPages = Math.ceil(needCount / 100)
  const c = (await getSigningClient()).getISCNQueryClient()
  const client = await c.getQueryClient()
  const nfts = []
  let next: Uint8Array | undefined = new Uint8Array([0x00])
  let pageCounts = 0
  do {
    const res = await client.nft.NFTs(
      classId,
      owner,
      PageRequest.fromPartial({ key: next })
    );
    (next = res.pagination?.nextKey)
    nfts.push(...res.nfts)
    if (pageCounts > needPages) { break }
    pageCounts += 1
  } while (next && next.length)
  return { nfts }
}

export async function signCreateISCNRecord (
  data: any,
  signer: OfflineSigner,
  address: string,
  memo?: string
) {
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
  const attribute = event.attributes.find(a => a.key === 'class_id')
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
  try {
    const rateBasisPoints = royaltyRateBasisPoints
    const feeAmount = royaltyFeeAmount
    const totalAmount = royaltyUserAmount
    const signingClient = await getSigningClient()
    await signingClient.connectWithSigner(RPC_URL, signer)
    const rewardMap = await parseAndCalculateStakeholderRewards(
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
    // Don't throw on royalty create, not critical for now
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
  const signingClient = await getSigningClient()
  await signingClient.connectWithSigner(RPC_URL, signer)
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
  const signingClient = await getSigningClient()
  await signingClient.connectWithSigner(RPC_URL, signer)
  const res = await signingClient.revokeGenericGrant(address, grantee, '/cosmos.nft.v1beta1.MsgSend', { memo })
  return res
}

export function shortenWalletAddress (address: string) {
  if (!address) { return '-' }
  return `${address.slice(0, 10)}...${address.slice(-6)}`
}
