import { Router } from 'express'
import { authRouter } from 'src/modules/auth/auth.routes'
import { candiesRouter } from '../modules/candy/candy.routes'

const generalRouter = Router()

generalRouter.use('/doces', candiesRouter)
generalRouter.use('/auth', authRouter)

export { generalRouter }
