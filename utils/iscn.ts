import { BigNumber } from 'bignumber.js'
import type { OfflineSigner } from '@cosmjs/proto-signing'
import type { DeliverTxResponse } from '@cosmjs/stargate'
import type { ISCNSignPayload } from '@likecoin/iscn-js'
import type { ISCNRegisterPayload } from './iscn.type'
import { ISCN_GAS_FEE, ISCN_GAS_MULTIPLIER, MAX_DESCRIPTION_LENGTH } from '~/constant'

import { getSigningClient } from '~/utils/cosmos'

let iscnLib: any = null

export async function getISCNLib () {
  if (!iscnLib) {
    iscnLib = await import(/* webpackChunkName: "iscn_js" */ '@likecoin/iscn-js')
  }
  return iscnLib
}

export function formatISCNTxPayload (
  payload: ISCNRegisterPayload & Record<string, unknown>
): ISCNSignPayload {
  const {
    tagsString = '',
    license,
    author,
    authorDescription,
    contentFingerprints: contentFingerprintsInput = [],
    recordNotes,
    publisher: publisherInput,
    stakeholders = [],
    ...data
  } = payload

  const contentFingerprints = [...contentFingerprintsInput]

  const authorEntity = (author && authorDescription)
    ? {
        name: author,
        description: authorDescription
      }
    : author

  return {
    ...data,
    publisher: publisherInput,
    author: authorEntity,
    keywords: tagsString.split(','),
    usageInfo: license,
    contentFingerprints: [...new Set(contentFingerprints)],
    recordNotes,
    stakeholders
  } as ISCNSignPayload
}

export async function estimateISCNTxGasAndFee (tx: ISCNSignPayload) {
  const signingClient = await getSigningClient()
  // typo in the original code
  const res = await signingClient.esimateISCNTxGasAndFee(tx)
  return res
}

export async function signISCN (
  tx: ISCNSignPayload,
  signer: OfflineSigner,
  address: string,
  {
    iscnId,
    memo,
    gas = new BigNumber(ISCN_GAS_FEE).multipliedBy(ISCN_GAS_MULTIPLIER).toFixed(0)
  }: { iscnId?: string, memo?: string, gas?: string } = {}
) {
  const { CHAIN_MINIMAL_DENOM } = useRuntimeConfig().public
  const network = getNetworkConfig()
  const DEFAULT_GAS_PRICE = [{ amount: 10000, denom: CHAIN_MINIMAL_DENOM }]
  const isUpdate = !!iscnId
  const signingClient = await getSigningClient()
  await signingClient.connectWithSigner(network.rpc, signer)
  const signingPromise = isUpdate
    ? signingClient.updateISCNRecord(address, iscnId as string, tx, {
      memo: memo || 'publish.liker.land',
      fee: {
        gas,
        amount: [{
          denom: DEFAULT_GAS_PRICE[0].denom,
          amount: new BigNumber(gas).multipliedBy(DEFAULT_GAS_PRICE[0].amount).toFixed(0)
        }]
      }
    })
    : signingClient.createISCNRecord(address, tx, {
      memo: memo || 'publish.liker.land',
      fee: {
        gas,
        amount: [{
          denom: DEFAULT_GAS_PRICE[0].denom,
          amount: new BigNumber(gas).multipliedBy(DEFAULT_GAS_PRICE[0].amount).toFixed(0)
        }]
      }
    })
  const res = await signingPromise
  return res as DeliverTxResponse
}

export async function signISCNTx (
  tx: ISCNSignPayload,
  signer: OfflineSigner,
  address: string,
  { iscnId, memo, gas }: { iscnId?: string, memo?: string, gas?: string } = {}
) {
  const signingClient = await getSigningClient()
  const client = signingClient.getISCNQueryClient()
  const res = await signISCN(tx, signer, address, { memo, iscnId, gas })
  const [newIscnId] = await client.queryISCNIdsByTx(res.transactionHash)
  return {
    iscnId: newIscnId,
    txHash: res.transactionHash
  }
}

export function validateISCNForm (data: any, maxDescriptionLength = MAX_DESCRIPTION_LENGTH): string[] {
  const errors: string[] = []
  const desc = data.description || ''

  if (!data.title) {
    errors.push('Please fill in the title')
  }

  if (!desc) {
    errors.push('Please fill in the description')
  } else if (desc.length > maxDescriptionLength) {
    errors.push(`Description cannot exceed ${maxDescriptionLength} characters`)
  }

  if (!data.author?.name) {
    errors.push('Please fill in the author name')
  }

  if (!Array.isArray(data.contentFingerprints) || !data.contentFingerprints.some((f: any) => !!f.url)) {
    errors.push('Please provide at least one content URL')
  }

  return errors
}
