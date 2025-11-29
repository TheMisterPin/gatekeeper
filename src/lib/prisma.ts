import 'dotenv/config'
import { PrismaMssql } from '@prisma/adapter-mssql'
import { PrismaClient } from '../../generated/prisma/client'
import { DB_NAME, DB_PASSWORD, DB_USER, HOST } from './constants'


const config = {
  server: HOST!,
  port: 1433,
  database: DB_NAME!,
  user: DB_USER!,
  password: DB_PASSWORD!,
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true, // Use this if you're using self-signed certificates
  },
}

const adapter = new PrismaMssql(config)
export const prisma = new PrismaClient({ adapter })