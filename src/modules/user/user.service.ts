import { prismaClient } from "@db/prisma";
import { IUser } from "./user.interface";
import { hashSync } from 'bcrypt'

class UserService{
  getUserByEmail(email:string){
    return prismaClient.user.findUnique({
      where:{
        email
      }
    })
  }

  createUser(user:IUser){
    user.password = hashSync(user.password,12)
    return prismaClient.user.create({
      data:user
    })
  }

  getUser(id:string){
    return prismaClient.user.findUnique({
      where:{
        id
      }
    })
  }
}

const userService = new UserService()

export {userService}