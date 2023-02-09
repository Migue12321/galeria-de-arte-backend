class CreateCommentRequestModel {
  getRequestModel(body) {
    let comment = body.comment ? body.comment.trim() : "";
    let imageId = body.imageId;
    return {
      comment: comment,
      imageId: imageId,      
    };
  }
}

module.exports = CreateCommentRequestModel;
