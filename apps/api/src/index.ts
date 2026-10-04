import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { productsRouter } from './routes/products.js'
import { ordersRouter } from './routes/orders.js'

const app = express()
const port = Number(process.env.API_PORT || 3001)

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://woodex.com',
    'https://admin.woodex.com',
  ],
  credentials: true,
}))
app.use(helmet())
app.use(express.json({ limit: '2mb' }))
app.use(morgan('combined'))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'woodex-api', timestamp: new Date().toISOString() })
})

app.use('/products', productsRouter)
app.use('/orders', ordersRouter)

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

app.listen(port, () => {
  console.log(`WOODEX API running on http://localhost:${port}`)
})
