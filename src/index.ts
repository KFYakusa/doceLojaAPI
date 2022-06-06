import express, { NextFunction, Request, Response } from 'express'
import { AppError } from './config/AppError'
import { HttpHeader } from './config/httpHeaderConfig'
import cors from 'cors'
import { generalRouter } from './routes/router'
import { API_PORT } from './config/environment'
const app = express()

app.use(express.json())

app.use(cors())

app.use(generalRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    })
  }
  return res.status(500).json({
    message: `Internal Server error - ${err.message}`
  })
})

HttpHeader.prepare(app)


app.listen(API_PORT)
