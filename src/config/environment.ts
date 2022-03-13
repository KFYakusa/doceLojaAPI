import { config } from 'dotenv'

config({
  path: '.env'
})
const DATABASE_URL = process.env.DATABASE_URL || ''

const API_PORT = process.env.API_PORT || 3000

export { DATABASE_URL, API_PORT }
