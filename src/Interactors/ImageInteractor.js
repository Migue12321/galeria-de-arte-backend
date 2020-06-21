const ImageValidator = require('../Entities/Validators/ImageValidator');

class ImageInteractor {

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

    async create(doctor) {
        let imageValidator = new ImageValidator();
        let response = imageValidator.validateCreate(doctor);
        // if(!response.success)
        //     return response;
        try {
           response = await this.imageRepository.insert(doctor);
        } catch (error) {
            return this.prepareDBErrorResponse(error);
        }
        return response
    }

    async delete(idAuth) {
        let response;
        try {
            let doctor = await this.getImageById(idAuth)
            await this.imageRepository.deleteDoctorAccount(doctor[0].accountId,doctor[0]._id);
             response = this.prepareDBDeleteResponse(idAuth, response);

        } catch (error) {
            return this.prepareDBErrorResponse(error);
        }
        return response;
    }

    async update(idAuth, user) {
        let imageValidator = new ImageInteractor();
        let response = imageValidator.validateUpdate(idAuth, user);
        if (!response.success) {
            return response;
        }
        try {
            await this.imageRepository.update(idAuth, user);
        } catch (error) {
            return this.prepareDBDeleteResponse(error);
        }
        return response;
    }

    async updateAttentionSchedule(idAuth, attentionSchedule) {
        let response = true;
        try {
            this.imageRepository.update(idAuth, attentionSchedule);
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

module.exports = ImageInteractor;