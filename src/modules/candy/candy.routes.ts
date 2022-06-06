import { Router } from 'express'
import { CandyController } from './candy.controller'

const candyController = new CandyController()
const candiesRouter = Router()

candiesRouter.get('', candyController.listCandies)
candiesRouter.get('/:id', candyController.getCandy)
candiesRouter.post('', candyController.createCandy)
candiesRouter.patch('/:id', candyController.updateCandy)
candiesRouter.delete('/:id', candyController.deleteCandy)

export { candiesRouter }
