const express = require('express');
const router = express.Router();
const cron = require("node-cron");

let CONNECTIONS = require('../Adapters/server.js');

const AppointmentRepository = require('../Adapters/Repositories/AppointmentRepository');
const DoctorRepository = require('../Adapters/Repositories/ImageRepository');
const PatientRepository = require('../Adapters/Repositories/PatientRepository');

let appointmentRepository;
let doctorRepository;
let patientRepository;

const CreateAppointmentRequestModel = require("../Adapters/DTOs/Appointment/CreateAppointmentRequestModel");
const UpdateAppointmentRequestModel =require("../Adapters/DTOs/Appointment/UpdateAppointmentRequestModel");

const AppointmentInteractor = require('../Interactors/AppointmentInteractor');

let cancelAppointmentInteractor;
let appointmentInteractor

(async function () {
    appointmentRepository = new AppointmentRepository(CONNECTIONS.database);
    doctorRepository = new DoctorRepository(CONNECTIONS.database)
    patientRepository = new PatientRepository(CONNECTIONS.database)
})();
const scheduledTime = "0 40 21 * * *";

cron.schedule(scheduledTime, () => {
    cancelAppointmentInteractor = new AppointmentInteractor(appointmentRepository,doctorRepository,patientRepository);
    cancelAppointmentInteractor.cancelAllNotConfirmedAppointments().then();
},{
    scheduled: true,
    timezone: "America/La_Paz"
});

router.get("", async function (request, response) {
    appointmentInteractor = new AppointmentInteractor(appointmentRepository,doctorRepository);
    let users = await appointmentInteractor.getAllAppointments()
        .catch(error => {
            console.log("ERROR getting all appointments: ", error);
        });
    response.send(users);
});

router.get("/:id", async function (request, response) {
    let id = request.params.id;
    appointmentInteractor = new AppointmentInteractor(appointmentRepository,doctorRepository);
    let users = await appointmentInteractor.getAppointmentById(id)
        .catch(error => {
            console.log("ERROR getting appointment with id: "+ id, error);
        });
    response.send(users);
});

router.get("/doctor/:id", async function (request, response) {
    let id = request.params.id;
    appointmentInteractor = new AppointmentInteractor(appointmentRepository, doctorRepository);
    let appointments = await appointmentInteractor.getAllAppointmentsByDoctorId(id)
        .catch(error => {
            console.log("ERROR getting appointments of doctor with id: "+ id, error);
        });
    response.send(appointments);

});
router.get("/free-hour/:doctorId", async function (request, response) {
    let id = request.params.doctorId;
    appointmentInteractor = new AppointmentInteractor(appointmentRepository,doctorRepository);
    let appointments = await appointmentInteractor.getAllFreeHours(id)
        .catch(error => {
            console.log("ERROR getting free hours of doctor with id: "+ id, error);
        });
    response.send(appointments);

});

router.get("/patient/:id", async function (request, response) {
    let id = request.params.id;
    appointmentInteractor = new AppointmentInteractor(appointmentRepository,doctorRepository);
    let appointments = await appointmentInteractor.getAllAppointmentsByPatientId(id)
        .catch(error => {
            console.log("ERROR getting appointments of patient with id: "+id, error);
        });
    response.send(appointments);

});
router.post("/", async function (request, response) {
    let appointmentRequestModel = new CreateAppointmentRequestModel();
    appointmentInteractor = new AppointmentInteractor(appointmentRepository,doctorRepository);
    let requestModel = appointmentRequestModel.getRequestModel(request.body);
    let isInsertedAppointment = {success:false,  message: 'ERROR inserting a appointment'};
    try {
        isInsertedAppointment = await insertAppointmentInteractor.create(requestModel);
    } catch (error) {
        console.log("ERROR inserting a appointment", error);
    }
    response.send(isInsertedAppointment);
});

router.put("/", async function (request, response) {
    let id = request.body.id;
    let updateAppointmentRequestModel = new UpdateAppointmentRequestModel();
    let requestModel = updateAppointmentRequestModel.getRequestModel(request.body);
    appointmentInteractor = new AppointmentInteractor(appointmentRepository,doctorRepository);
    let putResponse  = {success:false,  message: 'ERROR updating a appointment'};
    try {
        putResponse = await appointmentInteractor.update(id, requestModel);
    } catch (error) {
        console.log("ERROR updating a appointment with id:" + id, error);
    }
    response.send(putResponse);
});

router.delete("/:id", async function (request, response) {
    let id = request.params.id;
    appointmentInteractor = new AppointmentInteractor(appointmentRepository,doctorRepository);
    let deleteResponse = {success:false,  message: 'ERROR deleting a appointment'};
    try {
        deleteResponse = await appointmentInteractor.delete(id);
    } catch (error) {
        console.log("ERROR deleting a appointment with id:" + id, error);
    }
    response.send(deleteResponse);
});

module.exports = router;