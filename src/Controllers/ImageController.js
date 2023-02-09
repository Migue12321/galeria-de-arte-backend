const express = require("express");
const router = express.Router();

let CONNECTIONS = require("../Adapters/server.js");

const ImageRepository = require("../Adapters/Repositories/ImageRepository");

let imageRepository;

const createImageRequestModel = require("../Adapters/DTOs/Image/CreateImageRequestModel");
const UpdateImageRequestModel = require("../Adapters/DTOs/Image/UpdateImageRequestModel");
const ImageService = require("../Service/ImageService");

(async function () {
  imageRepository = new ImageRepository(CONNECTIONS.database);
})();

router.get("/", async function (request, response) {
  let imageService = new ImageService(imageRepository);
  let users = await imageService.getAll().catch((error) => {
    console.log("ERROR getting all images: ", error);
  });
  response.send(users);
});

router.get("/:id", async function (request, response) {
  let id = request.params.id;
  let imageService = new ImageService(imageRepository);
  let image = await imageService.getImageById(id).catch((error) => {
    console.log("ERROR getting a image with id: " + id + ": ", error);
  });
  response.send(image);
});

router.post("/", async function (request, response) {
  let imageRequestModel = new createImageRequestModel();
  let imageService = new ImageService(imageRepository);
  let requestModel = imageRequestModel.getRequestModel(request.body);
  let isInserted = { success: false, message: "Error inserting" };
  try {
    isInserted = await imageService.create(requestModel);
  } catch (error) {
    console.log("ERROR registering a image: ", error);
  }
  response.send(isInserted);
});

router.put("/", async function (request, response) {
  let id = request.body.id;
  let updateImageRequestModel = new UpdateImageRequestModel();
  let requestModel = updateImageRequestModel.getRequestModel(request.body);
  let imageService = new ImageService(imageRepository);
  let putResponse = false;
  try {
    putResponse = await imageService.update(id, requestModel);
  } catch (error) {
    console.log("ERROR updating a image with id: " + id + ": ", error);
  }
  response.send(putResponse);
});

router.delete("/:id", async function (request, response) {
  let id = request.params.id;
  console.log(id);
  let imageService = new ImageService(imageRepository);
  let deleteResponse = false;
  try {
    deleteResponse = await imageService.delete(id);
  } catch (error) {
    console.log("ERROR deleting a image with id: " + id + ": ", error);
  }
  response.send(deleteResponse);
});

module.exports = router;
