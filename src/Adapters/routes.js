const express = require("express");
const router = express.Router();

const ImageController = require("../Controllers/ImageController");
const CommentController = require("../Controllers/CommentController");

router.use("/image", ImageController);
router.use("/comment", CommentController);
module.exports = router;
