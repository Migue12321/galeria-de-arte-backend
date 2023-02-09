const CreateCommentRequestModel = require("./CreateCommentRequestModel");

class UpdateCommentRequestModel {
  getRequestModel(body) {
    let CommentRequestModelInstance = new CreateCommentRequestModel();
    let commentRequestModel = CommentRequestModelInstance.getRequestModel(body);
    return { $set: commentRequestModel };
  }
}

module.exports = UpdateCommentRequestModel;