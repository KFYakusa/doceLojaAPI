// import { NotFoundException } from '@config/Exceptions'
import { prismaClient } from '@db/prisma'
import { ICandy, IListCandy } from './candy.interface'

class CandyService {
  constructor() {}
  
  async getList(
    page: number,
    limit: number,
    searchString: string,
    orderBy: 'asc' | 'desc'
  ): Promise<IListCandy> {
    const search = searchString ? { name: { contains: searchString } } : {}

    const where = {
      ...search
    }
    const total = await prismaClient.candy.count({ where })
    const pagination = {
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
    const candies = await prismaClient.candy.findMany({
      where,
      take: pagination.limit,
      skip: pagination.limit * (pagination.page - 1),
      orderBy: {
        updated_at: orderBy
      },
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        name: true,
        description: true,
        price: true
      }
    })
    return {
      candies,
      ...pagination
    } as IListCandy
  }
  async getSingle(id: string): Promise<ICandy> {
    const where = { id }
    try {
      const candy = await prismaClient.candy.findUnique({
        where,
        select: {
          id: true,
          created_at: true,
          updated_at: true,
          name: true,
          description: true,
          price: true
        }
      })

      if (candy === null) return {} as ICandy

      return candy
    } catch (err) {
      // throw new NotFoundException(err)
      return err
    }
  }

  async create(
    name: string,
    description: string,
    price: string
  ): Promise<ICandy> {
    try {
      const novoDoce = await prismaClient.candy.create({
        data: {
          name,
          description,
          price
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          created_at: true,
          updated_at: true
        }
      })
      console.log('wow, just created a new candy! awesome!')
      return novoDoce
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }

  async update(id: string, old: ICandy): Promise<ICandy> {
    const where = { id }
    const { name, description, price } = old
    try {
      const doceNew = await prismaClient.candy.update({
        where,
        data: {
          name,
          description,
          price
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          created_at: true,
          updated_at: true
        }
      })
      return doceNew
    } catch (err) {
      return err
    }
  }

  async delete(id: string): Promise<ICandy> {
    const where = { id }
    try {
      const doce = await prismaClient.candy.delete({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          created_at: true,
          updated_at: true
        }
      })
      return doce
    } catch (err) {
      console.log(err)
      return err
    }
  }
}

const candyService = new CandyService()

export { candyService }
