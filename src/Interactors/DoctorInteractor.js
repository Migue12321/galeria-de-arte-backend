const DoctorValidator = require('../Entities/Validators/DoctorValidator');

class DoctorInteractor {

    constructor(doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    async getOneDoctorAccount(id) {
        return await this.doctorRepository.getDoctorAccountById(id);
    }

    async getAllDoctorsAccount() {
        return await this.doctorRepository.getAllDoctorAccounts();
    }
    async getDoctorById(id) {
        return await this.doctorRepository.getOne(id);
    }

    async getAll() {
        return await this.doctorRepository.getAll();
    }
    async getAllBySpecialty(specialty) {
        return await this.doctorRepository.getAllBySpecialty(specialty);
    }

    async create(doctor) {
        let doctorValidator = new DoctorValidator();
        let response = doctorValidator.validateCreate(doctor);
        if(!response.success)
            return response;
        try {
            await this.doctorRepository.saveDoctorAccount(doctor);
        } catch (error) {
            return this.prepareDBErrorResponse(error);
        }
        return response
    }

    async delete(idAuth) {
        let response;
        try {
            let doctor = await this.getDoctorById(idAuth)
            await this.doctorRepository.deleteDoctorAccount(doctor[0].accountId,doctor[0]._id);
             response = this.prepareDBDeleteResponse(idAuth, response);

        } catch (error) {
            return this.prepareDBErrorResponse(error);
        }
        return response;
    }

    async update(idAuth, user) {
        let doctorValidator = new DoctorValidator();
        let response = doctorValidator.validateUpdate(idAuth, user);
        if (!response.success) {
            return response;
        }
        try {
            await this.doctorRepository.update(idAuth, user);
        } catch (error) {
            return this.prepareDBDeleteResponse(error);
        }
        return response;
    }

    async updateAttentionSchedule(idAuth, attentionSchedule) {
        let response = true;
        try {
            this.doctorRepository.update(idAuth, attentionSchedule);
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

module.exports = DoctorInteractor;