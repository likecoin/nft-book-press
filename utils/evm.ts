import { waitForTransactionReceipt as wagmiWaitForTransactionReceipt } from '@wagmi/vue/actions'
import { getConfig as getWagmiConfig } from '~/utils/wagmi/config'

export async function waitForTransactionReceipt (
  parameters: Parameters<typeof wagmiWaitForTransactionReceipt>[1]
) {
  let receipt
  const config = getWagmiConfig()
  try {
    receipt = await wagmiWaitForTransactionReceipt(config, parameters)
  } catch (error) {
    // Sometimes a TransactionReceiptNotFoundError would be thrown
    // https://github.com/wevm/viem/issues/1056
    await sleep(3000)
    receipt = await wagmiWaitForTransactionReceipt(config, parameters)
  }
  return receipt
}
