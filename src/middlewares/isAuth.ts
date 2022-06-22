import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '@config/environment'
import { hashToken } from '@config/hashToken'
import { prismaClient } from '@db/prisma'
import { NextFunction, Request, Response } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'
import * as crypto from 'crypto'

declare module 'express-serve-static-core' {
  interface Request {
    userData?: string
  }
}

function isAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: 'There must be an authorization to compare'
    })
  }
  const token = req.headers.authorization!.split(' ')[1]

  verify(token, JWT_ACCESS_SECRET, (err, decoded: JwtPayload) => {
    if (err) {
      if (req.body.refreshToken)
        return verify(
          req.body.refreshToken,
          JWT_REFRESH_SECRET,
          (err, decoded) => {
            if (err) {
              res.status(401).json({
                message: 'Auth failed: error decoding refresh Token',
                info: err
              })
              return
            }

            if (decoded) {
              const comparison = prismaClient.token
                .findFirst({
                  where: { AND: [{ userId: decoded.userId }, { valid: true }] },
                  select: {
                    emailToken: true
                  }
                })
                .then(comparison => {
                  if (
                    !comparison ||
                    comparison.emailToken != hashToken(req.body.refreshToken)
                  ) {
                    res
                      .status(401)
                      .json({ message: 'Auth Failed: decoding dont match' })
                    return
                  }
                  req.userData = decoded.userId
                  next()
                })
                .catch(e => {
                  console.log(e)
                  res.status(500).json({
                    message: 'something Went wrong trying to renew your access'
                  })
                  return
                })
              return comparison
            }
          }
        )
    }
    req.userData = decoded.userId
    next()
  })
}

export { isAuth }
