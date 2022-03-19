// import '@config/environment'
import {hash} from 'bcrypt'
import {prismaClient} from './prisma'
const seed  = async ()=>{
  console.log("seeding...")

  const user = await prismaClient.user.create({
    data:{
      firstName:"daniel",
      surname: "Nicolau Saito",
      email:"daniel_fuzion@hotmail.com",
      password: await hash('daniel',5)
    }
  })

  const candy = await prismaClient.candy.create({
    data:{
      name:"ovo do coelho da páscoa",
      price:" 20,00",
      description:" um ovo de páscoa com recheio de chocolate e cobertura de chocolate e bom... inteiro de chocolate"
    }
  })
}

seed().catch(e=>{
  console.error(e)
  process.exit(1)
}).finally(async ()=>{
  await prismaClient.$disconnect
})
