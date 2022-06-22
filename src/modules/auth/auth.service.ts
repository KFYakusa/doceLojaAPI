import { hashToken } from '@config/hashToken'
import { prismaClient } from '@db/prisma'

class AuthService {
  addRefreshTokenToWhiteList({
    refreshToken,
    userId
  }: {
    refreshToken: string
    userId: string
  }) {
    const date = new Date()
    date.setHours(date.getHours() + 4)
    return prismaClient.token.create({
      data: {
        emailToken: hashToken(refreshToken),
        userId,
        expiration: date
      }
    })
  }

  findRefreshTokenById(id: string) {
    return prismaClient.token.findUnique({
      where: {
        id
      }
    })
  }

  deleteRefreshToken(id) {
    return prismaClient.token.update({
      where: {
        id
      },
      data: {
        valid: false
      }
    })
  }

  revokeTokens(userId) {
    return prismaClient.token.updateMany({
      where: {
        userId
      },
      data: {
        valid: false
      }
    })
  }
}

const authService = new AuthService()

export { authService }
