const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const EV = require("../Config/EnviromentVariables")
const DBConnectionFactory = require('../Entities/Factories/DBConectionFactory');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const serverPort = process.env.PORT || '4000';
app.set('port', serverPort);

let mongoMemoryServer;
if (process.env.ENV === 'TEST') {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoMemoryServer = new MongoMemoryServer();
}

let DBConnection;
let FirebaseConnection;

(async function () {
    let mongoUri;
    let mongoDBName;
    if (process.env.ENV == 'TEST') {
        mongoUri = await mongoMemoryServer.getConnectionString();
        mongoDBName = await mongoMemoryServer.getDbName();
    }
    if (process.env.ENV == 'DEV' || !process.env.ENV) {
        mongoUri =  EV.mongoUri
        mongoDBName = EV.mongoDBName;
    }
    if (process.env.ENV == 'PROD' || !process.env.ENV) {
        mongoUri = EV.mongoUri;
        mongoDBName = EV.mongoDBName;
    }
    DBConnection = await DBConnectionFactory.createConnection('mongo',mongoUri, mongoDBName)
        .catch(error => {
            console.log("Error creating connection: ", error);
        });

    FirebaseConnection = await DBConnectionFactory.createConnection('firebase')
        .catch(error => {
            console.log("Error creating connection: ", error);
        });

    let CONNECTIONS = {
        database: DBConnection,
        firebase: FirebaseConnection,
    }
    module.exports = CONNECTIONS;
    const routes = require('./routes');
    app.use('/api', routes);
    const host = process.env.HOST || '0.0.0.0'
    let server = http.createServer(app);

    server.listen(serverPort, function () {
        console.log('Running on port ' + serverPort);
    });
})();
