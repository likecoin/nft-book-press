import { jwtDecode } from 'jwt-decode'
import { checkIsEVMAddress } from '~/utils/index'
import { useFetchLikerInfoByWallet } from '~/utils/api'

export default defineEventHandler(async (event) => {
  let body: {
    walletAddress: string
    message: string
    signature: string
    email?: string
    loginMethod: string
    jwtid?: string
    expiresIn?: string
    token?: string
    intercomToken?: string
  } | undefined
  try {
    body = await readBody(event)
  } catch (error) {
    console.error(error)
    throw createError({
      status: 400,
      message: 'INVALID_BODY'
    })
  }
  if (!body) {
    throw createError({
      status: 400,
      message: 'MISSING_BODY'
    })
  }
  if (!body.walletAddress) {
    throw createError({
      status: 400,
      message: 'MISSING_ADDRESS'
    })
  }
  if (!checkIsEVMAddress(body.walletAddress)) {
    throw createError({
      status: 400,
      message: 'INVALID_ADDRESS'
    })
  }
  if (!body.message) {
    throw createError({
      status: 400,
      message: 'MISSING_MESSAGE'
    })
  }
  if (!body.signature) {
    throw createError({
      status: 400,
      message: 'MISSING_SIGNATURE'
    })
  }
  if (!body.token) {
    throw createError({
      status: 400,
      message: 'MISSING_TOKEN'
    })
  }
  if (!body.jwtid) {
    throw createError({
      status: 400,
      message: 'MISSING_JWTID'
    })
  }

  const likeWallet = jwtDecode<{ wallet: string }>(body.token).wallet
  if (!likeWallet) {
    throw createError({
      status: 401,
      message: 'INVALID_TOKEN'
    })
  }
  let userInfoRes: FetchLikerInfoResult | undefined
  try {
    userInfoRes = await useFetchLikerInfoByWallet(likeWallet)
  } catch (error) {
    console.error('Failed to fetch user info for wallet', error)
    throw createError({
      status: 401,
      message: 'LOGIN_WITHOUT_LIKER_ID'
    })
  }
  if (!userInfoRes) {
    throw createError({
      status: 401,
      message: 'CANNOT_FETCH_USER_INFO'
    })
  }

  const userInfo = {
    evmWallet: body.walletAddress,
    likeWallet,
    token: body.token,
    jwtId: body.jwtid,
    likerId: userInfoRes.user,
    displayName: userInfoRes.displayName,
    description: userInfoRes.description,
    avatar: userInfoRes.avatar,
    email: body.email,
    loginMethod: body.loginMethod,
    isLikerPlus: userInfoRes.isLikerPlus || false,
    intercomToken: body.intercomToken
  }
  await setUserSession(event, { user: userInfo })

  return userInfo
})
