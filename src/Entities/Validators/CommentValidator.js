const ObjectId = require("mongoose").Types.ObjectId;

class CommentValidator {
  validateCreate(comment) {
    return this.validate(comment);
  }

  validateUpdate(objectID, comment) {
    let response = { success: true, message: "" };
    let mongoIdResponse = this.validateObjectId(objectID);
    let responseValidator = this.validate(comment.$set);
    if (!mongoIdResponse) {
      response = { success: false, message: "Error validating ID " };
    }
    if (!responseValidator.success) {
      response = responseValidator;
    }
    return response;
  }

  validate(comment) {
    let response = { success: true, message: "" };
    if (!this.validateComment(comment.comment)) {
      console.log("comment");
      return { success: false, message: "Error validating comment" };
    }
    if (!this.validateObjectId(comment.imageId)) {
      console.log("imageId");
      return { success: false, message: "Error validating image Id" };
    }
    return response;
  }

  validateComment(comment) {
    console.log(comment)
    return (
      comment && comment.length > 0 && comment.length < 500 && comment != null
    );
  }

  validateObjectId(imageId) {
    return ObjectId.isValid(imageId)
      ? String(new ObjectId(imageId)) === imageId
      : false;
  }
}

module.exports = CommentValidator;
