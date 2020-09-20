const {
  ApplicationError,
  DatabaseError,
  UserFacingError,
} = require("./baseErrors")

class UnhandledError extends ApplicationError {
  constructor(message, options = {}) {
    super(message)

    for (const [key, value] of Object.entries(options)) {
      this[key] = value
    }
  }

  get statusCode() {
    return 500
  }
}

class BadRequestError extends UserFacingError {
  constructor(message, options = {}) {
    super(message)

    for (const [key, value] of Object.entries(options)) {
      this[key] = value
    }
  }

  get statusCode() {
    return 400
  }
}

class DataError extends BadRequestError {
  constructor(message, options = {}) {
    super(message)

    for (const [key, value] of Object.entries(options)) {
      this[key] = value
    }
  }

  get statusCode() {
    return 400.1
  }
}

class FirebaseError extends DatabaseError {
  constructor(message, options = {}) {
    super(message)

    for (const [key, value] of Object.entries(options)) {
      this[key] = value
    }
  }

  get statusCode() {
    return 401
  }
}

class NotFoundError extends UserFacingError {
  constructor(message, options = {}) {
    super(message)

    for (const [key, value] of Object.entries(options)) {
      this[key] = value
    }
  }

  get statusCode() {
    return 404
  }
}

module.exports = {
  UnhandledError,
  BadRequestError,
  DataError,
  FirebaseError,
  NotFoundError,
}
