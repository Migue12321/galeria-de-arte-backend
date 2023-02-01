const express = require("express");
const router = express.Router();

let CONNECTIONS = require("../Adapters/server.js");

const ImageRepository = require("../Adapters/Repositories/ImageRepository");

let imageRepository;

const createImageRequestModel = require("../Adapters/DTOs/Image/CreateImageRequestModel");
const UpdateImageRequestModel = require("../Adapters/DTOs/Image/UpdateImageRequestModel");
const ImageInteractor = require("../Interactors/ImageInteractor");

(async function () {
  imageRepository = new ImageRepository(CONNECTIONS.database);
})();

router.get("/", async function (request, response) {
  let imageInteractor = new ImageInteractor(imageRepository);
  let users = await imageInteractor.getAll().catch((error) => {
    console.log("ERROR getting all images: ", error);
  });
  response.send(users);
});

router.get("/:id", async function (request, response) {
  let id = request.params.id;
  let imageInteractor = new ImageInteractor(imageRepository);
  let image = await imageInteractor.getImageById(id).catch((error) => {
    console.log("ERROR getting a image with id: " + id + ": ", error);
  });
  response.send(image);
});
router.get("/for-sale", async function (request, response) {
  let imageInteractor = new ImageInteractor(imageRepository);
  let image = await imageInteractor.getAllForSale().catch((error) => {
    console.log("ERROR getting images: ", error);
  });
  response.send(image);
});

router.post("/", async function (request, response) {
  let imageRequestModel = new createImageRequestModel();
  let imageInteractor = new ImageInteractor(imageRepository);
  let requestModel = imageRequestModel.getRequestModel(request.body);
  let isInserted = { success: false, message: "Error inserting" };
  try {
    isInserted = await imageInteractor.create(requestModel);
  } catch (error) {
    console.log("ERROR registering a image: ", error);
  }
  response.send(isInserted);
});

router.put("/", async function (request, response) {
  let id = request.body.id;
  let updateImageRequestModel = new UpdateImageRequestModel();
  let requestModel = updateImageRequestModel.getRequestModel(request.body);
  let imageInteractor = new ImageInteractor(imageRepository);
  let putResponse = false;
  try {
    putResponse = await imageInteractor.update(id, requestModel);
  } catch (error) {
    console.log("ERROR updating a image with id: " + id + ": ", error);
  }
  response.send(putResponse);
});

router.delete("/:id", async function (request, response) {
  let id = request.params.id;
  console.log(id);
  let imageInteractor = new ImageInteractor(imageRepository);
  let deleteResponse = false;
  try {
    deleteResponse = await imageInteractor.delete(id);
  } catch (error) {
    console.log("ERROR deleting a image with id: " + id + ": ", error);
  }
  response.send(deleteResponse);
});

module.exports = router;
