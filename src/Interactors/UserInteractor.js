const UserValidator = require('../Entities/Validators/UserValidator');

class UserInteractor {

    constructor(doctorRepository, patientRepository) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    async getRole(id) {
        let doctors = await this.doctorRepository.getAll();
        let patients =await this.patientRepository.getAll();
        let users = doctors.concat(patients);
        let role = null;
        let userId = null
        users.forEach(user =>{
            if(user["accountId"] === id){
                role = user["role"];
                userId = user._id
            }

        })
        return {"role":role, "id": userId};
    }


    async getAllUserData() {
        return await this.doctorRepository.getAllDoctorAccounts();
    }
    async getUserById(id) {
        return await this.doctorRepository.getOne(id);
    }

    async getAllUsers() {
        return await this.doctorRepository.getAll();
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

module.exports = UserInteractor;