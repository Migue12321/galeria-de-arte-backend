const CreatePatientRequestModel = require('./CreatePatientRequestModel');

class UpdatePatientRequestModel {

    getRequestModel(body) {
        let UserRequestModelInstance = new CreatePatientRequestModel();
        let userRequestModel = UserRequestModelInstance.getRequestModel(body);
        return { $set: userRequestModel }
    }
}

module.exports = UpdatePatientRequestModel;