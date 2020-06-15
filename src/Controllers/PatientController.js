const express = require('express');
const router = express.Router();
let CONNECTIONS = require('../Adapters/server.js');

const PatientRepository = require('../Adapters/Repositories/PatientRepository');

let patientRepository;

const CreatePatientRequestModel = require("../Adapters/DTOs/Patient/CreatePatientRequestModel");
const UpdatePatientRequestModel = require('../Adapters/DTOs/Patient/UpdatePatientRequestModel');

const PatientInteractor = require('../Interactors/PatientInteractor');

(async function () {
    patientRepository = new PatientRepository(CONNECTIONS.database);
})();

router.get("", async function (request, response) {
    let patientInteractor = new PatientInteractor(patientRepository);
    let users = await patientInteractor.getAllPatients()
        .catch(error => {
            console.log("ERROR getting all patients: ", error);
        });
    response.send(users);
});

router.get("/:id", async function (request, response) {
    let id = request.params.id;
    let patientInteractor = new PatientInteractor(patientRepository);
    let patient = await patientInteractor.getPatientById(id)
        .catch(error => {
            console.log("ERROR getting a patient with id: "+ id + ": ", error);
        });
    response.send(patient);
});

router.post("/register", async function (request, response) {
    let patientRequestModel = new CreatePatientRequestModel();
    let insertPatientInteractor = new PatientInteractor(patientRepository);
    let requestModel = patientRequestModel.getRequestModel(request.body);
    let isInsertedPatient = false;
    try {
        isInsertedPatient = await insertPatientInteractor.create(requestModel);
    } catch (error) {
        console.log("ERROR registering a patient", error);
    }
    response.send(isInsertedPatient);
});

router.put("", async function (request, response) {
    let id = request.body.id;
    let updatePatientRequestModel = new UpdatePatientRequestModel();
    let requestModel = updatePatientRequestModel.getRequestModel(request.body);
    let patientInteractor = new PatientInteractor(patientRepository);
    let putResponse = false;
    try {
        putResponse = await patientInteractor.update(id, requestModel);
    } catch (error) {
        console.log("ERROR updating a patient with id: "+ id + ": ", error);
    }
    response.send(putResponse);
});

router.delete("/:id", async function (request, response) {
    let id = request.params.id;
    let patientInteractor = new PatientInteractor(patientRepository, appointmentInteractor);
    let deleteResponse = false;
    try {
        deleteResponse = await patientInteractor.delete(id);

    } catch (error) {
        console.log("ERROR deleting a patient with id: "+ id + ": ", error);
    }
    response.send(deleteResponse);
});

module.exports = router;