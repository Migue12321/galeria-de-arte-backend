const admin = require("firebase-admin");
const serviceAccount = require("../../Config/sdk.json");

class FirebaseConnection {
  constructor() {
    this.client = admin;
    this.dataBase = null;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  connect() {
    console.log("connected to Firebase");
    return admin.firestore();
  }

  obtainCollection(name) {
    return this.client.collection(name);
  }

  closeConnection() {
    firebase.database().goOffline();
  }

  getOne(searchCriteria, collection) {
    return collection
      .get()
      .then((querySnapshot) => {
        let results = [];
        querySnapshot.forEach((doc) => {
          if (doc.id === searchCriteria) {
            let docRef = collection.doc(doc.id);
            results.push(
              docRef.get().then((doc) => {
                return doc.data();
              })
            );
          }
        });
        return Promise.all(results);
      })
      .catch((err) => {
        console.log("Error getting document", err);
      });
  }

  getAll(collection) {
    return collection
      .get()
      .then((querySnapshot) => {
        let results = [];
        querySnapshot.forEach((doc) => {
          let docRef = collection.doc(doc.id);
          results.push(
            docRef.get().then((doc) => {
              return { id: doc.id, user: doc.data() };
            })
          );
        });
        return Promise.all(results);
      })
      .catch((err) => {
        console.log("Error getting document", err);
      });
  }

  getAllByCriteria(criteria, id, collection) {
    return collection
      .where(criteria, "==", id)
      .get()
      .then((querySnapshot) => {
        let results = [];
        querySnapshot.forEach((doc) => {
          let docRef = collection.doc(doc.id);
          results.push(
            docRef.get().then((doc) => {
              return { id: doc.id, user: doc.data() };
            })
          );
        });
        return Promise.all(results);
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  }

  insert(objectToInsert, collection) {
    return new Promise(function () {
      collection
        .add(objectToInsert)
        .then(function () {
          console.log("Document successfully written!");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    });
  }

  async insertWithId(objectToInsert, collection, id) {
    return new Promise(function () {
      collection
        .doc(id)
        .set(objectToInsert)
        .then(function () {
          console.log("Document successfully written!");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    });
  }

  async update(searchCriteria, updatedObject, collection) {
    return new Promise(() => {
      let docRef = collection.doc(searchCriteria);
      docRef
        .set(updatedObject)
        .then(function () {
          console.log("Document successfully updated!");
        })
        .catch(function (error) {
          console.error("Error updating document: ", error);
        });
    });
  }

  delete(searchCriteria, collection) {
    return new Promise(function () {
      return collection
        .doc(searchCriteria)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((err) => {
          console.log("Error deleting document", err);
        });
    });
  }
}

module.exports = FirebaseConnection;
