const admin = require("firebase-admin")
const serviceAccount = require("../firebase-adminsdk-configs.json")
const config = require("../configs.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.database_url,
})

const db = admin.firestore()
const urlsCollectionRef = db.collection("urls")

module.exports.getUrlBySlug = slug => {
  return new Promise((resolve, reject) => {
    urlsCollectionRef
      .doc(slug)
      .get()
      .then(response => resolve(response.data()))
      .catch(reject)
  })
}

module.exports.getUrlByUrl = url => {
  return new Promise((resolve, reject) => {
    urlsCollectionRef
      .where("url", "==", url)
      .get()
      .then(response => resolve(response.data()))
      .catch(reject)
  })
}

module.exports.addUrl = newUrl => {
  return new Promise((resolve, reject) => {
    urlsCollectionRef
      .doc(newUrl.slug)
      .set({
        url: newUrl.url,
        createdDate: admin.firestore.Timestamp.now(),
      })
      .then(response => {
        console.log(response)

        resolve({
          time: response.writeTime,
          data: newUrl,
        })res
      })
      .catch(reject)
  })
}
