import { Router } from 'express'
import { candiesRouter } from '../modules/candy/candy.routes'

const generalRouter = Router()

generalRouter.use('/doces', candiesRouter)

export { generalRouter }
