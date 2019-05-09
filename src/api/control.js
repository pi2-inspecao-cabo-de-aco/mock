import express from 'express'

export default () => {
  let router = express.Router()
  router.get('/', async (req, res) => {
    res.send({ oi: false })
  })

  router.post('/', async (req, res) => {
    console.log(req.body)
    res.send({ success: true })
  })
  return router
}
