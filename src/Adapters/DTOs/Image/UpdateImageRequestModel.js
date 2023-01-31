const CreateImageRequestModel = require("./CreateImageRequestModel");

class UpdateImageRequestModel {
  getRequestModel(body) {
    let ImageRequestModelInstance = new CreateImageRequestModel();
    let imageRequestModel = ImageRequestModelInstance.getRequestModel(body);
    return { $set: imageRequestModel };
  }
}

module.exports = UpdateImageRequestModel;