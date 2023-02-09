const admin = require("firebase-admin");
const mongo = require("mongodb");

class ImageRepository {
  constructor(DBConnection) {
    this.DBConnection = DBConnection;
    this.collection = this.DBConnection.obtainCollection("image");
  }

  async getOne(id) {
    let o_id;
    if (id) o_id = new mongo.ObjectID(id);
    let searchCriteria = { _id: o_id };
    return await this.DBConnection.getOne(
      searchCriteria,
      this.collection
    ).catch((error) => {
      console.log("Error in getOne on ImageRepository: ", error);
      return { success: false, message: error.toString() };
    });
  }

  async getAll() {
    return this.DBConnection.getAll(this.collection).catch((error) => {
      console.log("Error in getAll on ImageRepository: ", error);
      return { success: false, message: error.toString() };
    });
  }

  async insert(object) {
    return this.DBConnection.insert(object, this.collection)
      .then(() => {
        console.log("The image was created successfully");
        return { success: true, message: "The image was created successfully" };
      })
      .catch((error) => {
        console.log("Error in insert on ImageRepository: ", error);
      });
  }

  async update(id, object) {
    let o_id;
    if (id) o_id = new mongo.ObjectID(id);
    let searchCriteria = { _id: o_id };
    return this.DBConnection.update(searchCriteria, object, this.collection)
      .then(() => {
        console.log("The image was updated successfully");
        return {
          success: true,
          message: "The image was updated successfully",
        };
      })
      .catch((error) => {
        console.log("Error in update on ImageRepository: ", error);
        return { success: false, message: error.toString() };
      });
  }

  async delete(id) {
    let o_id;
    if (id) o_id = new mongo.ObjectID(id);
    let searchCriteria = { _id: o_id };
    return this.DBConnection.delete(searchCriteria, this.collection).catch(
      (error) => {
        console.log("Error in delete on ImageRepository: ", error);
        return { success: false, message: error.toString() };
      }
    );
  }
}

module.exports = ImageRepository;
