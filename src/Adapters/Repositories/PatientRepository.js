const admin = require("firebase-admin");
const mongo = require('mongodb');

class PatientRepository {

    constructor(DBConnection) {
        this.DBConection = DBConnection;
        this.collection = this.DBConection.obtainCollection('patient');
    }

    async getOne(id) {
        let o_id;
        if (id)
            o_id = new mongo.ObjectID(id);
        let searchCriteria = { '_id': o_id };
        return await this.DBConection.getOne(searchCriteria, this.collection)
            .catch(error => {
                console.log("Error in getOne on PatientRepository: ", error);
                return {success: false, message: error.toString()};
            });
    }

    async getAll() {
        return this.DBConection.getAll(this.collection)
            .catch(error => {
                console.log("Error in getAll on PatientRepository: ", error);
                return {success: false, message: error.toString()};
            });
    }

    async insert(object) {
        return this.DBConection.insert(object, this.collection).then(() => {
            console.log("The patient was created successfully");
            return { success: true, message: "The patient was created successfully" };
        }).catch(error => {
                console.log("Error in insert on PatientRepository: ", error);
            });
    }

    async savePatientAccount(object) {
      let context = this;
        return await admin.auth().createUser({
            email: object.email,
            password: object.password,
            displayName: object.username
          }).then((userRecord) =>{
                console.log('Account successful created');
                object["accountId"] = userRecord.uid;
                object["password"] = "";
                return  context.insert(object);
            }).catch(function(error) {
                console.log('Error creating new patient:', error);
                return { success: false, message: error.toString() };
            });
    }

    async updatePatientAccount(idAuth, patient){
        let context = this;
        admin.auth().updateUser(idAuth, {
            email: patient.$set.email,
            password: patient.$set.password,
            displayName: patient.$set.username
          })
            .then(function() {
                console.log('Account successful updated');
                return context.update(idAuth,patient);
            })
            .catch(function(error) {
              console.log('Error updating user:', error);
            });
    }

    async update(id, object) {
        let o_id;
        if (id)
            o_id = new mongo.ObjectID(id);
        let searchCriteria = {'_id': o_id};
        return this.DBConection.update(searchCriteria, object, this.collection).then(() => {
            console.log("The patient was updated successfully");
            return { success: true, message: "The patient was updated successfully" };
        }).catch(error => {
                console.log("Error in update on PatientRepository: ", error);
                return {success: false, message: error.toString()};
            });
    }

    async deletePatientAccount(uid, mongoId) {
        let context = this;
        return await admin.auth().deleteUser(uid)
            .then(function () {
                console.log('Successfully deleted user');
                return context.delete(mongoId).then(() => {
                    return {success: true, message: "Successfully deleted doctor"};
                }).catch(error => {
                    console.log("Error in delete on DoctorRepository: ", error);
                    return {success: false, message: error.toString()};
                });
            })
            .catch(function (error) {
                console.log('Error deleting user:', error);
                return {success: false, message: error.toString()};
            });
    }
    async delete(id) {
        let o_id;
        if (id)
            o_id = new mongo.ObjectID(id);
        let searchCriteria = {'_id': o_id};
        return this.DBConection.delete(searchCriteria, this.collection)
            .catch(error => {
                console.log("Error in delete on PatientRepository: ", error);
                return {success: false, message: error.toString()};
            });

    }

    async getAllPatientAccounts(nextPageToken) {
      let users = Array(0);
     return admin.auth().listUsers(1000, nextPageToken)
        .then(function(listUsersResult) {
          listUsersResult.users.forEach(function(userRecord) {
            users.push({
              'id': userRecord.toJSON().uid,
              'email': userRecord.toJSON().email,
              'username': userRecord.toJSON().displayName
            });
          });
          if (listUsersResult.pageToken) {
            listAllUsers(listUsersResult.pageToken);
          }
          console.log(users);
          return users;
        })
        .catch(function(error) {
          console.log('Error listing users:', error);
        });
    }
    
    async getPatientAccountById(id){
      return admin.auth().getUser(id)
        .then(function(userRecord) {
          return  {
            'id': userRecord.toJSON().uid,
            'email': userRecord.toJSON().email,
            'username': userRecord.toJSON().displayName
          }
        })
        .catch(function(error) {
          console.log('Error fetching user data:', error);
        });
    }
}

module.exports = PatientRepository;