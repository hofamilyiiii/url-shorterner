const yup = require("yup")
const { nanoid } = require("nanoid")

const db = require("../db/firebase")

const url_schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/^[\w\-]+$/i),
  url: yup.string().trim().url().required(),
})

const initSlug = slug => {
  return new Promise(async (resolve, reject) => {
    if (!slug) {
      slug = nanoid(5)
    } else {
      const isExist = await db.getUrlBySlug(slug).catch(reject)

      if (isExist) {
        reject("Slug in use. 🍔")
      }
    }

    slug = slug.toLowerCase()

    resolve(slug)
  })
}

module.exports.addUrl = newUrl => {
  return new Promise(async (resolve, reject) => {
    await url_schema.validate(newUrl).catch(reject)

    newUrl.slug = await initSlug(newUrl.slug).catch(reject)

    const insertResponse = await db.addUrl(newUrl).catch(reject)

    resolve(insertResponse)
  })
}
