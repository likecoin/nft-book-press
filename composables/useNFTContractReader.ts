import { readContract } from '@wagmi/vue/actions'
import { LIKE_NFT_ABI, LIKE_NFT_CLASS_ABI } from '~/contracts/likeNFT'

function parseURIString (dataString: string): Record<string, any> | null {
  const dataUriPattern = /^data:application\/json(?:; ?charset=utf-8|; ?utf8)?(;base64)?,/i
  const match = dataString.match(dataUriPattern)
  if (!match) {
    return null
  }
  const isBase64 = !!match[1]
  dataString = dataString.replace(dataUriPattern, '')
  if (isBase64) {
    dataString = Buffer.from(dataString, 'base64').toString('utf-8')
  }
  try {
    const data = JSON.parse(dataString)
    return data
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse class metadata:', e)
    return null
  }
}

export const useNFTContractReader = () => {
  const { LIKE_NFT_CONTRACT_ADDRESS } = useRuntimeConfig().public
  const { $wagmiConfig: config } = useNuxtApp()

  const getClassMetadata = async (classId: string) => {
    const dataString = await readContract(config, {
      abi: LIKE_NFT_CLASS_ABI,
      address: classId as any,
      functionName: 'contractURI'
    }) as string
    return parseURIString(dataString)
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
    }) as string
    return parseURIString(dataString)
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

  const getClassCurrentTokenId = async (classId: string) => {
    return await readContract(config, {
      abi: LIKE_NFT_CLASS_ABI,
      address: classId as any,
      functionName: 'getCurrentIndex'
    })
  }

  const checkNFTClassIsBookNFT = async (classId: string) => {
    return await readContract(config, {
      address: LIKE_NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: LIKE_NFT_ABI,
      functionName: 'isBookNFT',
      args: [classId]
    })
  }

  const getNFTClassConfig = async (classId: string) => {
    return await readContract(config, {
      abi: LIKE_NFT_CLASS_ABI,
      address: classId as `0x${string}`,
      functionName: 'getBookConfig'
    })
  }

  return {
    getClassMetadata,
    getClassOwner,
    getNFTMetadata,
    getNFTOwner,
    getBalanceOf,
    getTokenIdByOwnerIndex,
    getClassCurrentTokenId,
    checkNFTClassIsBookNFT,
    getNFTClassConfig
  }
}
