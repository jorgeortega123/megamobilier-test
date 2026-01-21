import { Hono } from 'hono'

const app = new Hono()

app.get('/sanitizar/datos', (c) => {
  // return c.text('Hello Hono!')
})


export default app
