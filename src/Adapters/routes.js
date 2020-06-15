const express = require('express');
const router = express.Router();

const ImageController = require('../Controllers/ImageController');
const PatientController = require('../Controllers/PatientController');
const UserController = require('../Controllers/UserController');

router.use("/image", ImageController);
router.use("/patient", PatientController);
router.use("/user", UserController);

module.exports = router;