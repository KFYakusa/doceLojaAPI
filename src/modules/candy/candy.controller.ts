import { defaultLimit, defaultPage } from '@config/pagination'
import { Request, Response } from 'express'
import { candyService } from './candy.service'

export class CandyController {

  async listCandies(req: Request, res: Response) {
    const queryParams = req.params

    const { page, limit, searchString, orderBy } = queryParams
    const orderByString =
      orderBy == 'asc' || orderBy == 'desc' ? orderBy : 'asc'

    const listofCandies = await candyService.getList(
      page ? parseInt(page) : defaultPage,
      limit ? parseInt(limit) : defaultLimit,
      searchString,
      orderByString
    )
    if (Object.keys(listofCandies).length === 0)
      res.status(500).json({ status: 500, message: 'something went wrong' })
    res.status(200).json(listofCandies)
  }

  async getCandy(req: Request, res: Response) {
    const { id } = req.params
    const doce = await candyService.getSingle(id)

    if (Object.keys(doce).length === 0 || Object.keys(doce).includes('code')) {
      res.status(400).json({ status: 400, message: ' wrong code' })
    } else {
      res.status(200).json(doce)
    }
  }

  async createCandy(req: Request, res: Response) {
    const { name, description, price } = req.body
    const retornoDoce = await candyService.create(name, description, price)
    if (retornoDoce)
      return res.status(500).json({ status: 500, message: 'something went wrong' })
    return res.status(201).json(retornoDoce)
  }

  async updateCandy(req: Request, res: Response) {
    console.log('wow, just updated a new candy! awesome!')
    const { id } = req.params
    const old = req.body
    const doce = await candyService.update(id, old)

    if (Object.keys(doce).length === 0 || Object.keys(doce).includes('code')) {
      res.status(400).json({ status: 400, message: ' wrong code' })
    } else {
      res.status(200).json(doce)
    }
  }

  async deleteCandy(req: Request, res: Response) {
    const { id } = req.params
    const candy = await candyService.delete(id)
    if (Object.keys(candy).length === 0 || Object.keys(candy).includes('code')) {
      res.status(400).json({ status: 400, message: ' wrong code' })
    } else {
      res.status(200).json(candy)
    }
  }
}
