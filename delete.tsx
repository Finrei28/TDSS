import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.user.update({
    where: { email: "finlaywong@gmail.com" },
    data: {
      role: "ADMIN",
    },
  })
  console.log("All data deleted from table")
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
