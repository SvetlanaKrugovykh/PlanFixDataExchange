const HttpError = require('http-errors')
const { sendReqToDB } = require('../services/dataExchangeService')

module.exports.getDataFromDB = async function (request, _reply) {
  const { reqType, text } = request.body
  const message = await sendReqToDB(reqType, text)

  if (!message) {
    throw new HttpError[501]('Command execution failed')
  }

  return {
    message: `Sign on ${message}`
  }
}

