import { useWriteContract } from '@wagmi/vue'
import { readContract, getBalance } from '@wagmi/vue/actions'
import { LIKE_NFT_CLASS_ABI } from '~/contracts/likeNFT'

export const useNFTContractWriter = () => {
  const { writeContractAsync } = useWriteContract()
  const { $wagmiConfig: config } = useNuxtApp()
  const checkAndGrantRole = async (
    { classId, wallet }: { classId: string; wallet: string },
    role: string
  ) => {
    const roleData = await readContract(config, {
      abi: LIKE_NFT_CLASS_ABI,
      address: classId as `0x${string}`,
      functionName: role
    })
    const hasRole = await readContract(config, {
      abi: LIKE_NFT_CLASS_ABI,
      address: classId as `0x${string}`,
      functionName: 'hasRole',
      args: [roleData, wallet]
    })
    if (!hasRole) {
      const txHash = await writeContractAsync({
        abi: LIKE_NFT_CLASS_ABI,
        address: classId as `0x${string}`,
        functionName: 'grantRole',
        args: [roleData, wallet]
      })
      // eslint-disable-next-line no-console
      console.log(`Granted ${role} to ${wallet} in class ${classId}. Transaction hash: ${txHash}`)
    }
  }
  const checkAndGrantUpdater = async ({ classId, wallet }: { classId: string, wallet: string }) => {
    await assertPositiveWalletBalance({ wallet })
    return checkAndGrantRole({ classId, wallet }, 'UPDATER_ROLE')
  }
  const checkAndGrantMinter = async ({ classId, wallet }: { classId: string, wallet: string }) => {
    await assertPositiveWalletBalance({ wallet })
    return checkAndGrantRole({ classId, wallet }, 'MINTER_ROLE')
  }
  const assertPositiveWalletBalance = async ({ wallet }: { wallet: string }) => {
    const balance = await getBalance(config, {
      address: wallet as `0x${string}`
    })
    if (balance.value <= 0n) {
      throw new Error('Insufficient OP-ETH balance')
    }
    return balance
  }
  return {
    checkAndGrantUpdater,
    checkAndGrantMinter,
    assertPositiveWalletBalance
  }
}
