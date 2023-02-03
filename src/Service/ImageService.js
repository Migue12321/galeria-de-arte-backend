const ImageValidator = require("../Entities/Validators/ImageValidator");

class ImageService {
  constructor(imageRepository) {
    this.imageRepository = imageRepository;
  }

  async getImageById(id) {
    return await this.imageRepository.getOne(id);
  }

  async getAll() {
    return await this.imageRepository.getAll();
  }
  async getAllForSale() {
    return await this.imageRepository.getAllForSale();
  }

  async create(image) {
    let imageValidator = new ImageValidator();
    let response = imageValidator.validateCreate(image);
    if (response.success) {
      try {
        response = await this.imageRepository.insert(image);
      } catch (error) {
        return this.prepareDBErrorResponse(error);
      }
    }
    return response;
  }

  async delete(idAuth) {
    let response = { success: false, message: "" };
    try {
      await this.imageRepository.delete(idAuth);
      response = this.prepareDBDeleteResponse(idAuth, response);
    } catch (error) {
      return this.prepareDBErrorResponse(error);
    }
    return response;
  }

  async update(idAuth, image) {
    let imageValidator = new ImageValidator();
    let response = imageValidator.validateUpdate(idAuth, image);
    if (!response.success) {
      return response;
    }
    try {
      await this.imageRepository.update(idAuth, image);
      return this.prepareDBDeleteResponse(idAuth)
    } catch (error) {
      return this.prepareDBErrorResponse(error);
    }
  }


  prepareDBDeleteResponse(id, response) {
    response = { success: true, message: "" };
    response.message = "The item " + id + " was deleted successfully";
    return response;
  }

  prepareDBErrorResponse(error) {
    return { success: false, message: error.toString() };
  }
}

module.exports = ImageService;
