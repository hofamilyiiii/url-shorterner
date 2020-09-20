const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const rfs = require("rotating-file-stream")
const path = require("path")
require("dotenv").config()

const url_controller = require("./controllers/url")
const messages = require("./resources/messages/index.json")

const app = express()
const port = process.env.PORT || 1337

app.enable("trust proxy")
app.use(helmet())
app.use(morgan("common"))
app.use(
  morgan("common", {
    stream: rfs.createStream("access.log", {
      interval: "1d", // rotate daily
      path: path.join(__dirname, "log"),
    }),
  })
)

app.use(express.json())
app.use(express.static("./public"))

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

const successHandler = (res, refCode, message, data) => {
  return res.json({ refCode, message, data })
}

const errorHandler = (next, isUnhandled, refCode, error, data) => {
  if (isUnhandled) {
    return next(new UnhandledError(error.message, { refCode, data }))
  } else {
    error.refCode = refCode
    return next(error)
  }
}

app.post("/url", (req, res, next) => {
  const refCode = messages.methods.insert

  const { slug, url } = req.body,
    newUrl = {
      url,
      slug,
    }

  try {
    url_controller
      .addUrl(newUrl)
      .then(response => {
        successHandler(res, refCode, messages.success.insert, response.data)
      })
      .catch(error => {
        errorHandler(next, false, refCode, error, newUrl)
      })
  } catch (error) {
    errorHandler(next, true, refCode, error, newUrl)
  }
})

// app.put("/url", (req, res, next) => {
//   const refCode = messages.methods.update

//   const { slug, url } = req.body,
//     newUrl = {
//       url,
//       slug,
//     }

//   try {
//     url_controller
//       .addUrl(newUrl)
//       .then(response => {
//         successHandler(res, refCode, messages.success.insert, response.data)
//       })
//       .catch(error => {
//         errorHandler(next, false, refCode, error, newUrl)
//       })
//   } catch (error) {
//     errorHandler(next, true, refCode, error, newUrl)
//   }
// })

app.use((err, _req, res, _next) => {
  res.status(err.statusCode).send({
    error: {
      refCode: err.refCode,
      code: err.errorCode ? err.errorCode : "",
      message: err.message,
    },
  })
})
