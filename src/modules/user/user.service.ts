import { prismaClient } from '@db/prisma'
import { IListUser, IUser } from './user.interface'
import { hashSync } from 'bcrypt'

class UserService {
  async getList(
    page: number,
    limit: number,
    searchString: string,
    orderBy: 'asc' | 'desc'
  ): Promise<IListUser> {
    const search = searchString
      ? {
          OR: [
            { name: { contains: searchString } },
            { email: { contains: searchString } }
          ]
        }
      : {}

    const where = {
      ...search
    }
    const total = await prismaClient.user.count({ where })
    const pagination = {
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
    const users = await prismaClient.user.findMany({
      where,
      take: pagination.limit,
      skip: pagination.limit * (pagination.page - 1),
      orderBy: {
        updated_at: orderBy
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        created_at: true,
        updated_at: true
      }
    })
    return {
      users,
      ...pagination
    } as IListUser
  }

  async find(id: string): Promise<IUser | null> {
    return await prismaClient.user.findUnique({
      where: {
        id
      }
    })
  }

  async findEmail(email: string): Promise<IUser | null> {
    return await prismaClient.user.findUnique({
      where: {
        email
      }
    })
  }

  async create(user: IUser): Promise<IUser | null> {
    user.password = hashSync(user.password, 12)
    return await prismaClient.user.create({
      data: user
    })
  }

  async update(old: IUser, id: string): Promise<IUser | null> {
    const where = { id }
    const { name, email } = old
    // old.password = hashSync(old.password, 12)
    try {
      const updatedUser = await prismaClient.user.update({
        where,
        data: {
          name,
          email
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          created_at: true,
          updated_at: true
        }
      })

      return updatedUser
    } catch (e) {
      return null
    }
  }

  async delete(id: string): Promise<IUser | null> {
    const where = { id }
    try {
      const user = await prismaClient.user.delete({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          created_at: true,
          updated_at: true
        }
      })
      return user
    } catch (e) {
      return null
    }
  }
}

const userService = new UserService()

export { userService }
