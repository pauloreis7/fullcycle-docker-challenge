import express, { Response } from 'express'
import { createConnection, createPool, RowDataPacket } from 'mysql2'

type UserProps = RowDataPacket & {
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

app.get('/', async (_, res: Response) => {
  let formattedUserListHtml = ''

  const databaseConnection = createConnection(mysqlConnectionConfig)
  const databasePool = createPool(mysqlConnectionConfig).promise()

  try {
    await databasePool.execute(sqlQueryInsert)

    const [users] = await databasePool.execute<UserProps[]>(sqlQuerySelect)

    users.forEach(user => {
      formattedUserListHtml = formattedUserListHtml + `<li>${user.name}</li>`
    })
  } catch (error) {
    console.error(error)

    return res.send(
      '<p> <p>&lt;h1&gt;Error to get the users!&lt;/h1&gt;</p> </p>'
    )
  } finally {
    databaseConnection.end()
  }

  return res.send(
    `
      <p> <p>&lt;h1&gt;Full Cycle Rocks!&lt;/h1&gt;</p> </p>
      <p> <p>&lt;h1&gt;Users List: &lt;/h1&gt;</p> </p>

      <ul>
        ${formattedUserListHtml}
      </ul>
    `
  )
})

app.listen(PORT, () => console.log(`🚀 API is running on port ${PORT}`))
