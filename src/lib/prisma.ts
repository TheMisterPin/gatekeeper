import 'dotenv/config'
import { PrismaMssql } from '@prisma/adapter-mssql'
import { PrismaClient } from '../../generated/prisma/client'

const config = {
  server: 'localhost',
  port: 1433,
  database: 'mydb',
  user: 'sa',
  password: 'mypassword',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true, // Use this if you're using self-signed certificates
  },
}

const adapter = new PrismaMssql(config)
export const prisma = new PrismaClient({ adapter })