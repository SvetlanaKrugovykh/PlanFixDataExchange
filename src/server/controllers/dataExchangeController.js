const fs = require('fs')
const path = require('path')
const HttpError = require('http-errors')
const { sendReqToDB } = require('../services/dataExchangeService')
require('dotenv').config()

const TEMP_CATALOG = process.env.TEMP_CATALOG || path.join(__dirname, '..', '..', 'temp')

module.exports.getDataFromDB = async function (request, reply) {
  const { reqType, text, offset } = request.body
  const individualCodesArray = request.body?.individualCodesArray

  let answer
  let responseData

  if (offset === undefined || offset === 0) {
    answer = await sendReqToDB(reqType, text, individualCodesArray)
    if (!answer) {
      throw new HttpError[501]('Command execution failed')
    }
    if (typeof answer === 'string') {
      reply.header('Content-Type', 'application/json; charset=utf-8')
      return { message: answer }
    }
    if (offset === undefined) {
      return answer
    }
    await writeToTempFile(answer)
  } else {
    answer = await readFromFile()
  }

  const SLICE_SIZE = Number(process.env.SLICE_SIZE) || 50
  const startIndex = offset || 0
  const endIndex = startIndex + SLICE_SIZE
  responseData = {
    subdivisions: answer.subdivisions.slice(startIndex, endIndex),
    positions: answer.positions.slice(startIndex, endIndex),
    employees: answer.employees.slice(startIndex, endIndex)
  }

  return { answer: responseData }
}


module.exports.getStatusChanges = async function (request, reply) {
  const { reqType, text, offset } = request.body
  const individualCodesArray = request.body?.individualCodesArray

  let answer
  let responseData

  if (offset === undefined || offset === 0) {
    answer = await sendReqToDB(reqType, text, individualCodesArray)
    if (!answer) {
      throw new HttpError[501]('Command execution failed')
    }
    if (typeof answer === 'string') {
      reply.header('Content-Type', 'application/json; charset=utf-8')
      return { message: answer }
    }
    if (offset === undefined) {
      return answer
    }
    await writeToTempFile(answer, 'status-change')
  } else {
    answer = await readFromFile('statusChange')
  }

  const SLICE_SIZE = Number(process.env.SLICE_SIZE) || 50
  const startIndex = offset || 0
  const endIndex = startIndex + SLICE_SIZE
  responseData = {
    hired_employees: answer.hired_employees.slice(startIndex, endIndex),
    dimissed_employees: answer.dimissed_employees.slice(startIndex, endIndex)
  }

  return { answer: responseData }
}

function readFromFile(fileName = 'tempData') {
  try {
    const fileFullName = `${TEMP_CATALOG}${fileName}.json`
    const data = fs.readFileSync(fileFullName, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading from file:', error)
    return null
  }
}

async function writeToTempFile(data, fileName = 'tempData') {
  try {
    if (!fs.existsSync(TEMP_CATALOG)) fs.mkdirSync(TEMP_CATALOG, { recursive: true })

    const fileFullName = `${TEMP_CATALOG}${fileName}.json`

    const fileDescriptor = fs.openSync(fileFullName, 'w');
    try {
      fs.writeFileSync(fileDescriptor, JSON.stringify(data))
      console.log('Data written to temp file.')
    } finally {
      fs.closeSync(fileDescriptor);
    }
  } catch (error) {
    console.error('Error writing to file:', error)
  }
}