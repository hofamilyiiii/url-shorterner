const express = require("express")
const morgan = require("morgan")
const helmet = require("helmet")
require("dotenv").config()

const url_controller = require("./controllers/url")
const messages = require("../resources/messages")

const app = express()
const port = process.env.PORT || 1337

app.enable("trust proxy")
app.use(helmet())
app.use(morgan("common"))
app.use(express.json())
app.use(express.static("./public"))

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

app.post("/url", async (req, res, next) => {
  const { slug, url } = req.body,
    newUrl = {
      url,
      slug,
    }

  try {
    const created = await url_controller.addUrl(newUrl).catch(error => {
      throw Error(error)
    })

    res.json({
      isSuccess: true,
      message: messages.success.add_url,
      data: newUrl,
    })
  } catch (error) {
    next(error)
  }
})
