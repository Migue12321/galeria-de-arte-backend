const FirebaseConnection = require('../../Adapters/DBConection/FirebaseConection');
const MongoDBConnection = require('../../Adapters/DBConection/MongoDBConnection')
class DBConnectionFactory {
    constructor() { }

    static async createConnection(databaseTechnology, url, databaseName) {
        switch (databaseTechnology) {
            case "mongo":
                const mongo = new MongoDBConnection();
                mongo.client = await mongo.connect(url)
                    .catch(error => {
                        console.log("ERROR in connect on DBConnectionFactory: ", error);
                    });
                mongo.dataBase = mongo.client.db(databaseName);
                return mongo;
            case "firebase":
                const firebase = new FirebaseConnection();
                firebase.client =  firebase.connect();
                return firebase;
            default:
                return null;
        }
    }
}

module.exports = DBConnectionFactory;