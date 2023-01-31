class CreateImageRequestModel {
  getRequestModel(body) {
    let title = body.title ? body.title.trim() : "";
    let width = body.width ? body.width.trim() : "";
    let height = body.height ? body.height.trim() : "";
    let forSale = body.forSale;
    let url = body.url;
    return {
      title: title,
      width: width,
      height: height,
      forSale: forSale,
      url: url,
    };
  }
}

module.exports = CreateImageRequestModel;
