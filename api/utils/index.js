const { DataError } = require("../errors/server-errors")
const messages = require("../resources/messages/index.json")

module.exports.validateSchema = (schema, value) => {
  return new Promise((resolve, reject) => {
    schema
      .validate(value, { abortEarly: false })
      .then(resolve)
      .catch(error =>
        reject(
          new DataError(error.errors.join("; "), {
            errorCode: messages.errors.invalidSchema.code,
          })
        )
      )
  })
}
