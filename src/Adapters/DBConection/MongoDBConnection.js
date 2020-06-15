const MongoClient = require('mongodb').MongoClient;

class MongoDBConnection {
    constructor() {
        this.client = null;
        this.dataBase = null;
    }

    connect(url) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true},
                (error, client) => {
                    if (error)
                        reject(error);
                    else {
                        console.log("connected to MongoDB");
                        resolve(client); 
                    }
                });
        })
    }

    obtainCollection(name) {
        return this.dataBase.collection(name);
    }

    closeConnection() {
        this.client.close();
    }

    getOne(searchCriteria, collection) {
        return new Promise(function (resolve, reject) {
            collection.find(searchCriteria).toArray(function (error, results) {
                if (error)
                    reject(error)
                else
                    resolve(results);
            })
        })
    }

    getAll(collection) {
        return new Promise(function (resolve, reject) {
            collection.find({}).toArray(function (error, results) {
                if (error)
                    reject(error);
                else
                    resolve(results);
            })
        })
    }

    insert(objectToInsert, collection) {
        return new Promise(function (resolve, reject) {
            collection.insertOne(objectToInsert, function (error, resp) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(resp);
                }
            })
        })
    }

    insertMany(objectsToInsert, collection) {
        return new Promise(function (resolve, reject) {
            collection.insertMany(objectsToInsert, collection, function (error, resp) {
                if (error)
                    reject(error);
                else
                    resolve(resp);
            });
        })
    }

    update(searchCriteria, updatedObject, collection) {
        return new Promise(function (resolve, reject) {
            collection.updateOne(searchCriteria, updatedObject, function (error, resp) {
                if (error) {
                    reject(error);
                }
                else
                    resolve(resp);
            })
        })
    }

    delete(searchCriteria, collection) {
        return new Promise(function (resolve, reject) {
            collection.removeOne(searchCriteria, function (error, resp) {
                if (error)
                    reject(error);
                else
                    resolve(resp);
            })
        })
    }
}

module.exports = MongoDBConnection;