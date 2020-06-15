const mongo = require('mongodb');

class AppointmentRepository {

    constructor(DBConnection) {
        this.DBConection = DBConnection;
        this.collection = this.DBConection.obtainCollection('appointment');
    }

    async getOne(id) {
        let o_id;
        if (id)
            o_id = new mongo.ObjectID(id);
        let searchCriteria = { '_id': o_id };
        return await this.DBConection.getOne(searchCriteria, this.collection)
            .catch(error => {
                console.log("Error in getOne on AppointmentRepository: ", error);
                return {success: false, message: error.toString()};
            });
    }

    async getByDoctorId(doctorId) {
        let query = { doctorId: doctorId };
        return this.collection.find(query).toArray().catch(error =>{
            console.log('Error in getByDoctorId on AppointmentRepository:', error);
            return { success: false, message: error.toString() }
        });
    }
    async getByPatientId(patientId) {
        let query = {patientId: patientId};
        return this.collection.find(query).toArray().catch(error =>{
            console.log('Error in getByPatientId on AppointmentRepository:', error);
            return { success: false, message: error.toString() }
        });
    }

    async getAll() {
        return this.DBConection.getAll(this.collection)
            .catch(error => {
                console.log("Error in getAll on AppointmentRepository: ", error);
                return {success: false, message: error.toString()};
            });
    }


    async insert(object,) {
        return this.DBConection.insert(object, this.collection).then(() => {
            console.log("The appointment was created successfully");
            return { success: true, message: "The appointment was created successfully" };
        }).catch(error => {
                console.log("Error in insert on AppointmentRepository: ", error);
                return {success: false, message: error.toString()};
            });
    }

    async update(id, object) {
        let o_id;
        if (id)
            o_id = new mongo.ObjectID(id);
        let searchCriteria = {'_id': o_id};
        return this.DBConection.update(searchCriteria, object, this.collection).then(() => {
            console.log("The appointment was updated successfully");
            return { success: true, message: "The appointment was updated successfully" };
        }).catch(error => {
                console.log("Error in update on AppointmentRepository: ", error);
                return {success: false, message: error.toString()};
            });
    }


    async delete(id) {
        let o_id;
        if (id)
            o_id = new mongo.ObjectID(id);
        let searchCriteria = {'_id': o_id};
        return this.DBConection.delete(searchCriteria, this.collection).then(() => {
            console.log("The appointment was deleted successfully");
            return { success: true, message: "The appointment was deleted successfully" };
        }).catch(error => {
                console.log("Error in delete on AppointmentRepository: ", error);
                return {success: false, message: error.toString()};

            });
    }

}

module.exports = AppointmentRepository;