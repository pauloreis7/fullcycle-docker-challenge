import express, { Response } from 'express'

const PORT = Number(process.env.PORT ?? 8080)

const app = express()

app.get('/', (_, res: Response) => {
  res.send('<h1>Full Cycle</h1>')
})

app.listen(PORT, () => console.log(`🚀 API is running on port ${PORT}`))
