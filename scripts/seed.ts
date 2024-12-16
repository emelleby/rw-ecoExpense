import { db } from 'api/src/lib/db'

import { categories } from './seeds/categories'
import { sectors } from './seeds/sectors'

// Manually apply seeds via the `yarn rw prisma db seed` command.
// REDWOOD_SEED_ARGS="categories" yarn rw prisma db seed
// # or
// REDWOOD_SEED_ARGS="sectors" yarn rw prisma db seed
//
// Seeds automatically run the first time you run the `yarn rw prisma migrate dev`
// command and every time you run the `yarn rw prisma migrate reset` command.
//
// See https://redwoodjs.com/docs/database-seeds for more info
const seedSectors = async () => {
  try {
    await db.sector.createMany({
      data: sectors,
      skipDuplicates: true,
    })
    console.info('✓ Sectors seeded successfully')
  } catch (error) {
    console.error('✗ Error seeding sectors:', error)
    throw error
  }
}

const seedCategories = async () => {
  try {
    await db.expenseCategory.createMany({
      data: categories,
      skipDuplicates: true,
    })
    console.info('✓ Categories seeded successfully')
  } catch (error) {
    console.error('✗ Error seeding categories:', error)
    throw error
  }
}

const seedFunctions = {
  sectors: seedSectors,
  categories: seedCategories,
}

export default async () => {
  // Debug logging
  console.log('Arguments:', process.argv)

  // Parse command line arguments differently
  const args = process.env.REDWOOD_SEED_ARGS?.split(' ') || []
  const seedType = args[0]

  console.log('Seed args:', args)
  console.log('Seed type:', seedType)

  if (!seedType) {
    console.info('Available seeds:', Object.keys(seedFunctions).join(', '))
    console.info('Usage: yarn rw prisma db seed -- <seedType>')
    return
  }

  if (!(seedType in seedFunctions)) {
    console.error(
      `Invalid seed type "${seedType}". Available types: ${Object.keys(seedFunctions).join(', ')}`
    )
    process.exit(1)
  }

  try {
    await seedFunctions[seedType]()
    console.log(`✓ Completed seeding ${seedType}`)
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}
// export default async () => {
//   try {
//     // Create your database records here! For example, seed some users:
//     //
//     // const users = [
//     //   { name: 'Alice', email: 'alice@redwoodjs.com' },
//     //   { name: 'Bob', email: 'bob@redwoodjs.com' },
//     // ]
//     //
//     // await db.user.createMany({ data: users })

//     console.info(
//       '\n  No seed data, skipping. See scripts/seed.ts to start seeding your database!\n'
//     )
//   } catch (error) {
//     console.error(error)
//   }
// }
