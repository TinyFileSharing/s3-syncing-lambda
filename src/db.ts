import postgres from 'postgres'

const sql = postgres({
  host: process.env.POSTGRES_HOST as string,
  port: process.env.POSTGRES_PORT as unknown as number,
  database: process.env.POSTGRES_DATABASE as string,
  username: process.env.POSTGRES_USERNAME as string,
  password: process.env.POSTGRES_PASSWORD as string,
  ssl: {
    rejectUnauthorized: false
  }
})

export default sql
