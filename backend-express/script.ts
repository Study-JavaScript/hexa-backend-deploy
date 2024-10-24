import { PrismaClient } from '../infrastructure/node_modules/@prisma/client'
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient()

async function main() {
  // const users = await prisma.user.findMany()
  // console.log(users)
  // const user = await prisma.user.create({
    //   data: {
      //     name: 'Bob',
      //     email: 'bob@prisma.io',
  //     posts: {
    //       create: [
      //         {
        //           title: 'Hello World',
        //           published: true
        //         },
        //         {
  //           title: 'My second post',
  //           content: 'This is still a draft'
  //         }
  //       ],
  //     },
  //   },
  // })
  // console.log(user)
  // const usersWithPosts = await prisma.user.findMany({
    //   include: {
      //     posts: true,
      //   },
      // })
      // const usersWithPosts = await readAll()
      // console.dir(usersWithPosts, { depth: null })
      
      const deletedUsers = await prisma.user.deleteMany({})
      const res = await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'User';`
      console.log("Restart: ",res)
      console.log(`Eliminados: ${deletedUsers.count} usuarios`)

      const hashedPassword = await bcrypt.hash("firstAdmin", 10);
      
      const user = await prisma.user.create({
        data: {
          name: 'FirstAdminUser',
          email: 'firstAdmin@prisma.io',
          password: hashedPassword,
          role: "ADMIN",
        },
      })
      console.log(user)
    }

main()
.then(async () => {
  await prisma.$disconnect()
})
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })