import { waitForTransactionReceipt as wagmiWaitForTransactionReceipt } from '@wagmi/vue/actions'

export async function waitForTransactionReceipt (
  config: Parameters<typeof wagmiWaitForTransactionReceipt>[0],
  parameters: Parameters<typeof wagmiWaitForTransactionReceipt>[1]
) {
  let receipt
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
