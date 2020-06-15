const express = require('express');
const router = express.Router();

let CONNECTIONS = require('../Adapters/server.js');

const DoctorRepository = require('../Adapters/Repositories/ImageRepository');

let doctorRepository;

const CreateDoctorRequestModel = require("../Adapters/DTOs/Image/CreateImageRequestModel");
const UpdateDoctorRequestModel = require("../Adapters/DTOs/Image/UpdateImageRequestModel");
const DoctorInteractor = require('../Interactors/DoctorInteractor');

(async function () {
    doctorRepository = new DoctorRepository(CONNECTIONS.database);
})();

router.get("", async function (request, response) {
    let doctorInteractor = new DoctorInteractor(doctorRepository);
    let users = await doctorInteractor.getAll()
        .catch(error => {
            console.log("ERROR getting all doctors: ", error);
        });
    response.send(users);
});

router.get("/:id", async function (request, response) {
    let id = request.params.id;
    let doctorInteractor = new DoctorInteractor(doctorRepository);
    let doctor = await doctorInteractor.getDoctorById(id)
        .catch(error => { 
            console.log("ERROR getting a doctor with id: "+ id + ": ", error);
        });
    response.send(doctor);
});
router.get("/search_specialty/:specialty", async function (request, response) {
    let specialty = request.params.specialty;
    let doctorInteractor = new DoctorInteractor(doctorRepository);
    let doctor;
    if(specialty === " ")
        doctor = await doctorInteractor.getAll()
            .catch(error => {
            console.log("ERROR getting doctors: ", error);
        });
    else
        doctor = await doctorInteractor.getAllBySpecialty(specialty)
            .catch(error => {
            console.log("ERROR getting doctors: ", error);
        });
    response.send(doctor);
});


router.post("/register", async function (request, response) {
    let doctorRequestModel = new CreateDoctorRequestModel();
    let insertDoctorInteractor = new DoctorInteractor(doctorRepository);
    let requestModel = doctorRequestModel.getRequestModel(request.body);
    let isInsertedDoctor = false;
    try {
        isInsertedDoctor = await insertDoctorInteractor.create(requestModel);
    } catch (error) {
        console.log("ERROR registering a doctor: ", error);
    }
    response.send(isInsertedDoctor);
});

router.put("", async function (request, response) {
    let id = request.body.id;
    let updateDoctorRequestModel = new UpdateDoctorRequestModel();
    let requestModel = updateDoctorRequestModel.getRequestModel(request.body);
    let doctorInteractor = new DoctorInteractor(doctorRepository);
    let putResponse = false;
    try {
        putResponse = await doctorInteractor.update(id, requestModel);
    } catch (error) {
        console.log("ERROR updating a doctor with id: "+ id + ": " , error);
    }
    response.send(putResponse);
});
router.put("/update-attention-schedule/", async function (request, response) {
    let id = request.body.id;
    let updateDoctorRequestModel = new UpdateDoctorRequestModel();
    let requestModel = updateDoctorRequestModel.getRequestModel(request.body);
    let doctorInteractor = new DoctorInteractor(doctorRepository);
    let putResponse = false;
    try {
        putResponse = await doctorInteractor.updateAttentionSchedule(id, requestModel);
    } catch (error) {
        console.log("ERROR updating a doctor:", error);
    }
    response.send(putResponse);
});


router.delete("/:id", async function (request, response) {
    let id = request.params.id;
    let doctorInteractor = new DoctorInteractor(doctorRepository);
    let deleteResponse = false;
    try {
        deleteResponse = await doctorInteractor.delete(id);
    } catch (error) {
        console.log("ERROR deleting a doctor with id: "+ id + ": ", error);
    }
    response.send(deleteResponse);
});

module.exports = router;