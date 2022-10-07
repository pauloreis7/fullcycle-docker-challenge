import express, { Response } from 'express'
import { createConnection } from 'mysql2'

type UserProps = {
  id: number
  name: string
}

const PORT = Number(process.env.PORT ?? 8080)

const app = express()

const mysqlConnectionConfig = {
  host: 'mysql-db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
}

const sqlQueryInsert = "INSERT INTO users(name) values('paulo reis')"
const sqlQuerySelect = 'SELECT * FROM users'

app.get('/', (_, res: Response) => {
  let formattedUserListHtml = ''
  const databaseConnection = createConnection(mysqlConnectionConfig)

  databaseConnection.query(sqlQueryInsert)

  databaseConnection.query(sqlQuerySelect, (err, result: UserProps[]) => {
    if (err) throw err

    result.forEach(user => {
      console.log('formattedUserListHtml ==>', formattedUserListHtml)
      console.log(`<li>${user.name}</li>`)

      formattedUserListHtml = `${formattedUserListHtml} <li>${user.name}</li>`
    })
  })

  databaseConnection.end()

  res.send(
    `
      <p> <p>&lt;h1&gt;Full Cycle Rocks!&lt;/h1&gt;</p> </p>
      <ul>
        ${formattedUserListHtml}
      </ul>
    `
  )
})

app.listen(PORT, () => console.log(`🚀 API is running on port ${PORT}`))
