import { useWriteContract } from '@wagmi/vue'
import { readContract } from '@wagmi/vue/actions'
import { LIKE_NFT_CLASS_ABI } from '~/contracts/likeNFT'
import { config } from '~/utils/wagmi/config'

export const useNFTContractWriter = () => {
  const { writeContractAsync } = useWriteContract()
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
  const checkAndGrantUpdater = ({ classId, wallet }: { classId: string, wallet: string }) => {
    return checkAndGrantRole({ classId, wallet }, 'UPDATER_ROLE')
  }
  const checkAndGrantMinter = ({ classId, wallet }: { classId: string, wallet: string }) => {
    return checkAndGrantRole({ classId, wallet }, 'MINTER_ROLE')
  }
  return {
    checkAndGrantUpdater,
    checkAndGrantMinter
  }
}
