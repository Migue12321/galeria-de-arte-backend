const PatientValidator = require('../Entities/Validators/PatientValidator');

class PatientInteractor {

    constructor(patientRepository, appointmentInteractor) {
        this.patientRepository = patientRepository;
        this.appointmentInteractor = appointmentInteractor;
    }

    async getPatientDataById(id) {
        return await this.patientRepository.getPatientAccountById(id);
    }

    async getAllPatientData() {
        return await this.patientRepository.getAllPatientAccounts();
    }
    async getPatientById(id) {
        return await this.patientRepository.getOne(id);
    }

    async getAllPatients() {
        return await this.patientRepository.getAll();
    }

    async create(patient) {
        let patientValidator = new PatientValidator();
        let response = patientValidator.validateCreate(patient);
        if(!response.success)
            return response;
        try {
            response = await this.patientRepository.savePatientAccount(patient);
        } catch (error) {
            return this.prepareDBErrorResponse(error);
        }
        return response
    }

    async delete(idAuth) {
        let appointments = [];
        let response;
        try {
            let patient = await this.getPatientById(idAuth)
            await this.patientRepository.deletePatientAccount(patient[0].accountId, patient[0]._id);
            appointments = await this.appointmentInteractor.getAllAppointmentsByPatientId(idAuth)
            for (const appointment of appointments) {
                await this.appointmentInteractor.delete(appointment._id)
            }
            response = this.prepareDBDeleteResponse(idAuth, response);

        } catch (error) {
            return this.prepareDBErrorResponse(error);
        }
        return response;
    }

    async update(idAuth, user) {
        let userValidator = new PatientValidator();
        let response = userValidator.validateUpdate(idAuth, user);
        if (!response.success) {
            return response;
        }
        try {
            await this.patientRepository.update(idAuth, user);
           // this.userRepository.update(idAccountData, user);
        } catch (error) {
            return this.prepareDBDeleteResponse(error);
        }
        return response;
    }
    
    prepareDBDeleteResponse(id, response) {
        response = { success: true, message: "" };
        response.message = "The item " + id + " was deleted successfully";
        return response
    }
    
    prepareDBErrorResponse(error) {
        return { success: false, message: error.toString() };
    }

}

module.exports = PatientInteractor;