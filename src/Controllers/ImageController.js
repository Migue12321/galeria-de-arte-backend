const express = require('express');
const router = express.Router();

let CONNECTIONS = require('../Adapters/server.js');

const ImageRepository = require('../Adapters/Repositories/ImageRepository');

let imageRepository;

const createImageRequestModel = require("../Adapters/DTOs/Image/CreateImageRequestModel");
const UpdateImageRequestModel = require("../Adapters/DTOs/Image/UpdateImageRequestModel");
const ImageInteractor = require('../Interactors/ImageInteractor');

(async function () {
    imageRepository = new ImageRepository(CONNECTIONS.database);
})();

router.get("", async function (request, response) {
    let imageInteractor = new ImageInteractor(imageRepository);
    let users = await imageInteractor.getAll()
        .catch(error => {
            console.log("ERROR getting all doctors: ", error);
        });
    response.send(users);
});

router.get("/:id", async function (request, response) {
    let id = request.params.id;
    let imageInteractor = new ImageInteractor(imageRepository);
    let doctor = await imageInteractor.getImageById(id)
        .catch(error => { 
            console.log("ERROR getting a doctor with id: "+ id + ": ", error);
        });
    response.send(doctor);
});
router.get("/for-sale", async function (request, response) {
    let imageInteractor = new ImageInteractor(imageRepository);
    let doctor = await imageInteractor.getAllForSale()
        .catch(error => {
            console.log("ERROR getting doctors: ", error);
        });
    response.send(doctor);
});


router.post("/", async function (request, response) {
    let imageRequestModel = new createImageRequestModel();
    let imageInteractor = new ImageInteractor(imageRepository);
    let requestModel = imageRequestModel.getRequestModel(request.body);
    let isInserted = {success:false, message: "Error inserting"};
    try {
        isInserted = await imageInteractor.create(requestModel);
    } catch (error) {
        console.log("ERROR registering a doctor: ", error);
    }
    response.send(isInserted);
});

router.put("", async function (request, response) {
    let id = request.body.id;
    let updateDoctorRequestModel = new UpdateImageRequestModel();
    let requestModel = updateDoctorRequestModel.getRequestModel(request.body);
    let doctorInteractor = new ImageInteractor(imageRepository);
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
    let updateDoctorRequestModel = new UpdateImageRequestModel();
    let requestModel = updateDoctorRequestModel.getRequestModel(request.body);
    let doctorInteractor = new ImageInteractor(imageRepository);
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
    let doctorInteractor = new ImageInteractor(imageRepository);
    let deleteResponse = false;
    try {
        deleteResponse = await doctorInteractor.delete(id);
    } catch (error) {
        console.log("ERROR deleting a doctor with id: "+ id + ": ", error);
    }
    response.send(deleteResponse);
});

module.exports = router;