const admin = require("firebase-admin")

const serviceAccount = require("../firebase-adminsdk-configs.json")
const config = require("../configs.json")
const { FirebaseError } = require("../errors/server-errors")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.database_url,
})

const db = admin.firestore()
const urlsCollectionRef = db.collection("urls")

const errorHandler = error => {
  return new FirebaseError(error.message, { errorCode: error.status })
}

module.exports.getUrlBySlug = slug => {
  return new Promise((resolve, reject) => {
    urlsCollectionRef
      .doc(slug)
      .get()
      .then(response => {
        resolve(response.data())
      })
      .catch(error => reject(errorHandler(error)))
  })
}

module.exports.getUrlByUrl = url => {
  return new Promise((resolve, reject) => {
    urlsCollectionRef
      .where("url", "==", url)
      .get()
      .then(response => {
        resolve(response.docs)
      })
      .catch(error => reject(errorHandler(error)))
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
      .then(() => {
        resolve({
          data: newUrl,
        })
      })
      .catch(error => reject(errorHandler(error)))
  })
}
