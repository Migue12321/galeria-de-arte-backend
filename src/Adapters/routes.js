const express = require("express");
const router = express.Router();

const ImageController = require("../Controllers/ImageController");

router.use("/image", ImageController);

module.exports = router;
