import { Router } from 'express'
import { isAuth } from 'src/middlewares/isAuth'
import { AuthController } from './auth.controller'

const authController = new AuthController()
const authRouter = Router()

authRouter.post('/signup', authController.signup)
authRouter.post('/login', authController.login)
authRouter.post('/logout', isAuth, authController.logout)
authRouter.post('/keepSession', isAuth, authController.keepSession)
authRouter.post('/recoverAccount', authController.recoverAccount)

export { authRouter }
