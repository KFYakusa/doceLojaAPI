import { generateTokens } from '@config/jwt'
import { compare } from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import { IUser } from '../user/user.interface'
import { userService } from '../user/user.service'
import { IAuth } from './auth.interface'
import { authService } from './auth.service'
// import { authService } from "./auth.service";
export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    const inputData: IUser = req.body
    try {
      if (!inputData.email || !inputData.password) {
        res.status(400).json({
          message: 'must provide email and password'
        })
        return
      }
      const alreadyExist = await userService.findEmail(inputData.email)
      if (alreadyExist) {
        res.status(400).json({ message: ' Email already in use' })
        return
      }

      const user = await userService.create(inputData)
      if (!user) {
        res.status(500).json({
          message: '[ERROR] Could not Create user'
        })
        return
      }
      const { accessToken, refreshToken } = generateTokens(user)
      await authService.addRefreshTokenToWhiteList({
        refreshToken,
        userId: user.id!
      })
      res.status(200).json({
        accessToken,
        refreshToken
      })
      return
    } catch (err) {
      next(err)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const inputData: IAuth = req.body

      if (!inputData.email || !inputData.password) {
        res.status(400).json({ message: 'required email and password' })
        return
      }
      const doesExist = await userService.findEmail(inputData.email)
      if (!doesExist) {
        res.status(400).json({ message: 'Invalid login credentials' })
        return
      }
      const validPassword = await compare(
        inputData.password,
        doesExist.password
      )
      if (!validPassword) {
        res.status(400).json({ message: 'invalid login credentials' })
        return
      }
      const { accessToken, refreshToken } = generateTokens(doesExist)
      await authService.addRefreshTokenToWhiteList({
        refreshToken,
        userId: doesExist.id!
      })
      res.status(200).json({
        accessToken,
        refreshToken
      })
    } catch (e) {
      next(e)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const userId = req.userData!
    try {
      const user = await userService.find(userId)

      if (!user) {
        res.status(404).json({
          message: 'User does not exist'
        })
        return
      }

      authService
        .revokeTokens(user.id)
        .then(deletedTokes =>
          res.status(200).json({
            message: 'Logout Successfull'
          })
        )
        .catch(e => {
          res.status(500).json({
            message: 'Error deletig tokens'
          })
        })
    } catch (e) {
      res.status(500).json({
        message: 'Something went wrong trying to logout',
        info: e
      })
    }
  }

  async keepSession(req: Request, res: Response, next: NextFunction) {
    const userId = req.userData!

    try {
      const user = await userService.find(userId)
      if (!user) {
        res.status(404).json({
          message: 'No user was found with this credentials'
        })
        return
      }

      const { accessToken, refreshToken } = generateTokens(user)
      await authService.revokeTokens(user.id)
      await authService.addRefreshTokenToWhiteList({
        refreshToken,
        userId: user.id!
      })
      res.status(200).json({
        accessToken,
        refreshToken
      })
    } catch (e) {
      res.status(500).json({
        message: 'something went wrong renewing your tokens'
      })
      return
    }
  }

  async recoverAccount(req: Request, res: Response, next: NextFunction) {}
}
