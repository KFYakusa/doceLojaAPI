import { User } from '@prisma/client'
import { sign } from 'jsonwebtoken'
import { IUser } from 'src/modules/user/user.interface'
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from './environment'
// import { User } from "src/modules/user/user.interface";

function generateAccessToken(user: IUser) {
  return sign({ userId: user.id }, JWT_ACCESS_SECRET, {
    expiresIn: '5m'
  })
}

function generateRefreshToken(user: IUser) {
  return sign({ userId: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: '8h'
  })
}

function generateTokens(user: IUser) {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  return {
    accessToken,
    refreshToken
  }
}

export { generateAccessToken, generateRefreshToken, generateTokens }
