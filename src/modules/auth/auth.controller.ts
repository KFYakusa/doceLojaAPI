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
      const alreadyExist = await userService.getUserByEmail(inputData.email)
      if (alreadyExist) {
        res.status(400).json({ message: ' Email already in use' })
        return
      }

      const user = await userService.createUser(inputData)
      const { accessToken, refreshToken } = generateTokens(user)
      await authService.addRefreshTokenToWhiteList({
        refreshToken,
        userId: user.id
      })
      res.status(200).json({
        accessToken,
        refreshToken
      })
    } catch (err) {
      next(err)
    }
  }

  async login(req:Request,res:Response,next:NextFunction){
    try{
      const inputData: IAuth = req.body

      if(!inputData.email || !inputData.password){
        res.status(400).json({message: "required email and password"})
        return
      }
      const doesExist = await userService.getUserByEmail(inputData.email)
      if(!doesExist){
        res.status(400).json({message:"Invalid login credentials"})
        return
      }
      const validPassword = await compare(inputData.password, doesExist.password)
      if(!validPassword){
        res.status(400).json({message:"invalid login credentials"})
        return
      }
      const {accessToken, refreshToken} = generateTokens(doesExist)
      await authService.addRefreshTokenToWhiteList({refreshToken,userId:doesExist.id})
      res.status(200).json({
        accessToken,
        refreshToken
      })

    }catch(e){
      next(e)
    }
  }
}
