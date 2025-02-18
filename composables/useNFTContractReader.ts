import { readContract } from '@wagmi/vue/actions'
import { LIKE_NFT_CLASS_ABI } from '~/contracts/likeNFT'
import { config } from '~/utils/wagmi/config'

export const useNFTContractReader = () => {
  const getClassMetadata = async (classId: string) => {
    const dataString = await readContract(config, {
      abi: LIKE_NFT_CLASS_ABI,
      address: classId as any,
      functionName: 'contractURI'
    })

    if (!(dataString as string)?.startsWith('data:application/json')) {
      return null
    }

    try {
      const data = JSON.parse(
        (dataString as string).replace('data:application/json;utf8,', '')
      )
      return data
    } catch (e) {
      return null
    }
  }

  const getClassOwner = async (classId: string) => {
    return await readContract(config, {
      abi: LIKE_NFT_CLASS_ABI,
      address: classId as any,
      functionName: 'owner'
    })
  }

  const getNFTMetadata = async (classId: string, tokenId: number) => {
    const dataString = await readContract(config, {
      abi: LIKE_NFT_CLASS_ABI,
      address: classId as any,
      functionName: 'tokenURI',
      args: [tokenId]
    })

    if (!(dataString as string)?.startsWith('data:application/json')) {
      return null
    }

    try {
      const data = JSON.parse(
        (dataString as string).replace('data:application/json;utf8,', '')
      )
      return data
    } catch (e) {
      return null
    }
  }

  const getNFTOwner = async (classId: string, tokenId: number) => {
    return await readContract(config, {
      abi: LIKE_NFT_CLASS_ABI,
      address: classId as any,
      functionName: 'ownerOf',
      args: [tokenId]
    })
  }

  return {
    getClassMetadata,
    getClassOwner,
    getNFTMetadata,
    getNFTOwner
  }
}
