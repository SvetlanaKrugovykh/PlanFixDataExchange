
const HttpError = require('http-errors')
const { sendReqToDB } = require('../services/dataExchangeService')

module.exports.getDataFromDB = async function (request, _reply) {
  const { reqType, text } = request.body
  const employeesFIOArray = request.body?.employeesFIOArray
  const answer = await sendReqToDB(reqType, text, employeesFIOArray)

  if (!answer) {
    throw new HttpError[501]('Command execution failed')
  }

  return {
    answer
  }
}

