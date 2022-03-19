import { Router } from 'express'
import { AuthController } from './auth.controller'


const authController = new AuthController()
const authRouter = Router()

// candiesRouter.get('', docesController.listDoces)
// candiesRouter.get('/:id', docesController.getDoce)
authRouter.post('/', authController.signup)
// candiesRouter.patch('/:id', docesController.updateDoce)
// candiesRouter.delete('/:id', docesController.deleteDoce)

export { authRouter }