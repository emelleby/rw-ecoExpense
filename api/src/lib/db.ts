// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient, Prisma } from '@prisma/client'

import { emitLogLevels, handlePrismaLogging } from '@redwoodjs/api/logger'

import { logger } from './logger'

const prismaClient = new PrismaClient({
  log: emitLogLevels(['info', 'warn', 'error']),
})

handlePrismaLogging({
  db: prismaClient,
  logger,
  logLevels: ['info', 'warn', 'error'],
})

// Add middleware for NOK amount calculation
const expenseExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    query: {
      expense: {
        async create({ args, query }) {
          if (args.data.amount && args.data.exchangeRate) {
            args.data.nokAmount =
              Number(args.data.amount) * Number(args.data.exchangeRate)
          }
          return query(args)
        },
        async update({ args, query }) {
          if (args.data.amount && args.data.exchangeRate) {
            args.data.nokAmount =
              Number(args.data.amount) * Number(args.data.exchangeRate)
          }
          return query(args)
        },
      },
    },
  })
})

export const db = prismaClient.$extends(expenseExtension)

/**
 * Global Prisma client extensions should be added here, as $extend
 * returns a new instance.
 * export const db = prismaClient.$extend(...)
 * Add any .$on hooks before using $extend
 */
// export const db = prismaClient
