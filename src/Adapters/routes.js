const express = require('express');
const router = express.Router();

const DoctorController = require('../Controllers/DoctorController');
const PatientController = require('../Controllers/PatientController');
const UserController = require('../Controllers/UserController');
const AppointmentController = require('../Controllers/AppointmentController');
const MailController = require('../Controllers/EmailController');

router.use('/email', MailController);
router.use("/doctor", DoctorController);
router.use("/patient", PatientController);
router.use("/user", UserController);
router.use("/appointment", AppointmentController);

module.exports = router;