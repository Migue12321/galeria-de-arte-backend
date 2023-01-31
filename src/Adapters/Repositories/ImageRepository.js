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

  async getAllForSale() {
    let query = { forSale: true };
    return this.collection
      .find(query)
      .toArray()
      .catch((error) => {
        console.log("Error recovering for sale images:", error);
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
        console.log("The doctor was updated successfully");
        return {
          success: true,
          message: "The doctor was updated successfully",
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

  async getAllDoctorAccounts(nextPageToken) {
    let users = Array(0);
    return admin
      .auth()
      .listUsers(1000, nextPageToken)
      .then(function (listUsersResult) {
        listUsersResult.users.forEach(function (userRecord) {
          users.push({
            id: userRecord.toJSON().uid,
            email: userRecord.toJSON().email,
            username: userRecord.toJSON().displayName,
          });
        });
        if (listUsersResult.pageToken) {
          listAllUsers(listUsersResult.pageToken);
        }
        return users;
      })
      .catch(function (error) {
        console.log("Error listing users:", error);
      });
  }

  async getDoctorAccountById(id) {
    return admin
      .auth()
      .getUser(id)
      .then(function (userRecord) {
        return {
          id: userRecord.toJSON().uid,
          email: userRecord.toJSON().email,
          username: userRecord.toJSON().displayName,
        };
      })
      .catch(function (error) {
        console.log("Error fetching user data:", error);
      });
  }
}

module.exports = ImageRepository;
