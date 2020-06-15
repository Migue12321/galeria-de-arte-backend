const express = require('express');
const router = express.Router();
const cron = require("node-cron");


let CONNECTIONS = require('../Adapters/server.js');

const EmailInteractor = require('../Interactors/EmailInteractor');
const AppointmentInteractor = require('../Interactors/AppointmentInteractor');

const AppointmentRepository = require('../Adapters/Repositories/AppointmentRepository');
const DoctorRepository = require('../Adapters/Repositories/ImageRepository');
const PatientRepository = require('../Adapters/Repositories/PatientRepository');

let appointmentRepository;
let doctorRepository;
let patientRepository;

let appointmentInteractor ;
let emailInteractor;

const scheduledTime = "0 30 22 * * *";

(async function () {
    appointmentRepository = new AppointmentRepository(CONNECTIONS.database);
    doctorRepository = new DoctorRepository(CONNECTIONS.database);
    patientRepository = new PatientRepository(CONNECTIONS.database);
    appointmentInteractor = new AppointmentInteractor(appointmentRepository, doctorRepository, patientRepository);
    emailInteractor = new EmailInteractor(appointmentInteractor, doctorRepository);
})();

cron.schedule(scheduledTime, () => {
    emailInteractor.sendPatientReminder().then();
    emailInteractor.sendDoctorReminder().then();
},{
    scheduled: true,
    timezone: "America/La_Paz"
});


module.exports = router;