import { config } from 'dotenv'

config({
  path: '.env'
})
const DATABASE_URL = process.env.DATABASE_URL || ''

const API_PORT = process.env.API_PORT || 3000

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || ''
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '' 

export { DATABASE_URL, API_PORT, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET }
