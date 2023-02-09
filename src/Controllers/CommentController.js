const express = require("express");
const router = express.Router();

let CONNECTIONS = require("../Adapters/server.js");

const CommentRepository = require("../Adapters/Repositories/CommentRepository");

let commentRepository;

const createCommentRequestModel = require("../Adapters/DTOs/Comment/CreateCommentRequestModel");
const UpdateCommentRequestModel = require("../Adapters/DTOs/Comment/UpdateCommentRequestModel");
const CommentService = require("../Service/CommentService");

(async function () {
  commentRepository = new CommentRepository(CONNECTIONS.database);
})();

router.get("/", async function (request, response) {
  let commentService = new CommentService(commentRepository);
  let users = await commentService.getAll().catch((error) => {
    console.log("ERROR getting all comments: ", error);
  });
  response.send(users);
});

router.get("/:id", async function (request, response) {
  let id = request.params.id;
  let commentService = new CommentService(commentRepository);
  let comment = await commentService.getCommentById(id).catch((error) => {
    console.log("ERROR getting a comment with id: " + id + ": ", error);
  });
  response.send(comment);
});

router.post("/", async function (request, response) {
  let commentRequestModel = new createCommentRequestModel();
  let commentService = new CommentService(commentRepository);
  let requestModel = commentRequestModel.getRequestModel(request.body);
  let isInserted = { success: false, message: "Error inserting" };
  try {
    isInserted = await commentService.create(requestModel);
  } catch (error) {
    console.log("ERROR registering a comment: ", error);
  }
  response.send(isInserted);
});

router.put("/", async function (request, response) {
  let id = request.body.id;
  let updateCommentRequestModel = new UpdateCommentRequestModel();
  let requestModel = updateCommentRequestModel.getRequestModel(request.body);
  let commentService = new CommentService(commentRepository);
  let putResponse = false;
  try {
    putResponse = await commentService.update(id, requestModel);
  } catch (error) {
    console.log("ERROR updating a comment with id: " + id + ": ", error);
  }
  response.send(putResponse);
});

router.delete("/:id", async function (request, response) {
  let id = request.params.id;
  console.log(id);
  let commentService = new CommentService(commentRepository);
  let deleteResponse = false;
  try {
    deleteResponse = await commentService.delete(id);
  } catch (error) {
    console.log("ERROR deleting a comment with id: " + id + ": ", error);
  }
  response.send(deleteResponse);
});

module.exports = router;
