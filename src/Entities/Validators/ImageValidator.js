class ImageValidator {
  validateCreate(image) {
    return this.validate(image);
  }

  validateUpdate(objectID, image) {
    let response = { success: true, message: "" };
    let mongoIdResponse = this.validateUserID(objectID);
    let responseValidator = this.validate(image.$set);
    if (!mongoIdResponse) {
      response = { success: false, message: "Error validating ID " };
    }
    if (!responseValidator.success) {
      response = responseValidator;
    }
    return response;
  }

  validate(image) {
    let response = { success: true, message: "" };
    if (!this.validateTitle(image.title)) {
      console.log("title");
      return { success: false, message: "Error validating title" };
    }
    if (!this.validateNumber(image.height)) {
      console.log("height");
      return { success: false, message: "Error validating height" };
    }
    if (!this.validateNumber(image.width)) {
      console.log("width");
      return { success: false, message: "Error validating width" };
    }
    if (!this.validateUrl(image.url)) {
      console.log("url");
      return { success: false, message: "Error validating url" };
    }
    return response;
  }

  validateTitle(title) {
    console.log(title);
    return title && title.length != 0 && title.length < 200 && title != null;
  }

  validateUrl(url) {
    console.log(url);
    let regex =
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    return regex.test(url);
  }

  validateUserID(imageId) {
    return imageId;
  }

  validateNumber(number) {
    if (number) {
      return true;
    } else return false;
  }
}

module.exports = ImageValidator;
