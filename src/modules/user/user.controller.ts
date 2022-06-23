import { defaultLimit, defaultPage } from '@config/pagination'
import { Request, Response } from 'express'
import { IUser } from './user.interface'
import { userService } from './user.service'
// import { candyService } from './candy.service'

export class UserController {
  async listUsers(req: Request, res: Response) {
    const queryParams = req.params

    const { page, limit, searchString, orderBy } = queryParams
    const orderByString =
      orderBy == 'asc' || orderBy == 'desc' ? orderBy : 'asc'

    const userList = await userService.getList(
      page ? parseInt(page) : defaultPage,
      limit ? parseInt(limit) : defaultLimit,
      searchString,
      orderByString
    )
    if (Object.keys(userList).length === 0)
      res.status(500).json({ status: 500, message: 'something went wrong' })
    res.status(200).json(userList)
  }

  async getUser(req: Request, res: Response) {
    const { id } = req.params
    const user = await userService.find(id)

    if (!user || Object.keys(user).includes('code')) {
      res.status(400).json({ status: 400, message: ' wrong code' })
    } else {
      res.status(200).json(user)
    }
  }

  async createUser(req: Request, res: Response) {
    const { name, email, password } = req.body
    const newUser: IUser = { name, email, password }
    const retornoDoce = await userService.create(newUser)
    if (retornoDoce)
      return res
        .status(500)
        .json({ status: 500, message: 'something went wrong' })
    return res.status(201).json(retornoDoce)
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params
    const old = req.body
    const user = await userService.update(old, id)

    if (!user || Object.keys(user).includes('code')) {
      res.status(400).json({ status: 400, message: ' wrong code' })
    } else {
      res.status(200).json(user)
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params
    const user = await userService.delete(id)
    if (!user || Object.keys(user).includes('code')) {
      res.status(400).json({ status: 400, message: ' wrong code' })
    } else {
      res.status(200).json(user)
    }
  }
}
