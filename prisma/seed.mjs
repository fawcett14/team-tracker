import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const name = process.env.TEAM_NAME || 'Our Team'
const logoUrl = process.env.TEAM_LOGO_URL || null

await prisma.team.upsert({
  where: { id: 1 },
  update: { name, logoUrl },
  create: { id: 1, name, logoUrl },
})

console.log(`Seeded team: ${name}`)
await prisma.$disconnect()
