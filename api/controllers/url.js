const yup = require("yup")
const { nanoid } = require("nanoid")

const db = require("../db/firebase")
const messages = require("../resources/messages/index.json")
const { DataError } = require("../errors/server-errors")
const { validateSchema } = require("../utils")

const url_schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/^[\w\-]+$/i),
  url: yup.string().trim().url().required(),
})

const assignSlug = slug => {
  return new Promise(async (resolve, reject) => {
    if (!slug) {
      slug = nanoid(5)
    } else {
      const isExist = await db.getUrlBySlug(slug).catch(reject)

      if (isExist) {
        reject(
          new DataError(messages.errors.duplicated.message, {
            errorCode: messages.errors.duplicated.code,
          })
        )
      }
    }

    slug = slug.toLowerCase()

    resolve(slug)
  })
}

const checkUrlIsExist = url => {
  return new Promise(async (resolve, reject) => {
    const urls = await db.getUrlByUrl(url).catch(reject)

    if (urls && urls.length > 0) {
      reject(
        new DataError(messages.errors.duplicated.message, {
          errorCode: messages.errors.duplicated.code,
        })
      )
    } else {
      resolve()
    }
  })
}

module.exports.addUrl = newUrl => {
  return new Promise(async (resolve, reject) => {
    await validateSchema(url_schema, newUrl).catch(reject)

    // Validate Slug & Url exist duplication
    await checkUrlIsExist(newUrl.url).catch(reject)
    newUrl.slug = await assignSlug(newUrl.slug).catch(reject)

    db.addUrl(newUrl).then(resolve).catch(reject)
  })
}
