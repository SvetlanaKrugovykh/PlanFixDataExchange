const dataExchangeController = require('../controllers/dataExchangeController')
const isAuthorizedGuard = require('../guards/is-authorized.guard')
const dataExchangeSchema = require('../schemas/dataExchange.schema')
module.exports = (fastify, _opts, done) => {

  fastify.route({
    method: 'POST',
    url: '/planfix-data-exchange/get-data/',
    handler: dataExchangeController.getDataFromDB,
    preHandler: [
      isAuthorizedGuard
    ],
    schema: dataExchangeSchema
  })

  done()
}

