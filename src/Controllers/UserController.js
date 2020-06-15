const express = require('express');
const router = express.Router();

let CONNECTIONS = require('../Adapters/server.js');

const DoctorRepository = require('../Adapters/Repositories/ImageRepository');
const PatientRepository = require('../Adapters/Repositories/PatientRepository');

let doctorRepository;
let patientRepository;

const UserInteractor = require('../Interactors/UserInteractor');

(async function () {
    doctorRepository = new DoctorRepository(CONNECTIONS.database);
    patientRepository = new PatientRepository(CONNECTIONS.database);
})();

router.get("/role/:id", async function (request, response) {
    let id = request.params.id;
    let userInteractor = new UserInteractor(doctorRepository, patientRepository);
    let user = await userInteractor.getRole(id)
        .catch(error => {
            console.log("ERROR getting role of user with id: " + id + ": ", error);
        });
    response.send(user);
});





module.exports = router;