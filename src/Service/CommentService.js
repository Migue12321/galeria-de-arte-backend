const CommentValidator = require("../Entities/Validators/CommentValidator");

class CommentService {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async getCommentById(id) {
    return await this.commentRepository.getOne(id);
  }

  async getAll() {
    return await this.commentRepository.getAll();
  }

  async create(comment) {
    let commentValidator = new CommentValidator();
    let response = commentValidator.validateCreate(comment);
    if (response.success) {
      try {
        response = await this.commentRepository.insert(comment);
      } catch (error) {
        return this.prepareDBErrorResponse(error);
      }
    }
    return response;
  }

  async delete(idAuth) {
    let response = { success: false, message: "" };
    try {
      await this.commentRepository.delete(idAuth);
      response = this.prepareDBDeleteResponse(idAuth, response);
    } catch (error) {
      return this.prepareDBErrorResponse(error);
    }
    return response;
  }

  async update(idAuth, comment) {
    let commentValidator = new CommentValidator();
    let response = commentValidator.validateUpdate(idAuth, comment);
    if (!response.success) {
      return response;
    }
    try {
      return await this.commentRepository.update(idAuth, comment);
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

module.exports = CommentService;
