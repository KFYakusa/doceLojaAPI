import { Router } from 'express'
import { CandyController } from './candies.controller'

const docesController = new CandyController()
const candiesRouter = Router()

candiesRouter.get('', docesController.listDoces)
candiesRouter.get('/:id', docesController.getDoce)
candiesRouter.post('', docesController.createDoce)
candiesRouter.patch('/:id', docesController.updateDoce)
candiesRouter.delete('/:id', docesController.deleteDoce)

export { candiesRouter }
