import { readContract } from '@wagmi/vue/actions'
import { LIKE_NFT_ABI, LIKE_NFT_CLASS_ABI, LIKE_NFT_CONTRACT_ADDRESS } from '~/contracts/likeNFT'
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

  const getBalanceOf = async (classId: string, address: string) => {
    return await readContract(config, {
      abi: LIKE_NFT_CLASS_ABI,
      address: classId as any,
      functionName: 'balanceOf',
      args: [address]
    })
  }

  const getTokenIdByOwnerIndex = async (
    classId: string,
    address: string,
    index: number
  ) => {
    return await readContract(config, {
      abi: LIKE_NFT_CLASS_ABI,
      address: classId as any,
      functionName: 'tokenOfOwnerByIndex',
      args: [address, index]
    })
  }

  const checkNFTClassIsBookNFT = async (classId: string) => {
    return await readContract(config, {
      address: LIKE_NFT_CONTRACT_ADDRESS,
      abi: LIKE_NFT_ABI,
      functionName: 'isBookNFT',
      args: [classId]
    })
  }
  return {
    getClassMetadata,
    getClassOwner,
    getNFTMetadata,
    getNFTOwner,
    getBalanceOf,
    getTokenIdByOwnerIndex,
    checkNFTClassIsBookNFT
  }
}
