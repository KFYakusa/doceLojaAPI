import { Router } from 'express'
import { candiesRouter } from '../modules/candy/candies.routes'

const generalRouter = Router()

generalRouter.use('/doces', candiesRouter)

export { generalRouter }
