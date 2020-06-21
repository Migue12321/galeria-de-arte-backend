class DoctorValidator {

    validateCreate(image) {
        return this.validate(image);
    }

    validateUpdate(objectID, doctor) {
        let response = { success: true, message: "" };
        let mongoIdResponse = this.validateUserID(objectID);
        let responseValidator = this.validate(doctor.$set);
        if(!(mongoIdResponse)){
            response = { success: false,  message: "Error validating ID "};
        }
        if(!responseValidator.success){
            response = responseValidator;
        }
        return response;
    }

    validate(image) {
        let response = { success: true, message: "" };
        if(!this.validateTitle(image.title)){
            console.log("title")
            response = { success: false,  message: "Error validating title"};
        }
        if(!this.validateNumber(image.height)){
            console.log("height")

            response = { success: false,  message: "Error validating height"};
        }
        if(!this.validateNumber(image.width)){
            console.log("width")
            response = { success: false,  message: "Error validating width"};
        }
        return response
    }

    validateTitle(name) {
        console.log(name)
        return name && name.length != 0 && (name.length < 200);
    }

    validateUserID(doctorID) {
        return doctorID;
    }

    validateNumber(number) {
        if(number){
            return true;
        }
        else
            return false;

    }

    noStrangerCharacterArePresent(word) {
        let regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ-ñÑ ]+$/;
        return regex.test(word);
    }
    nonStandardsAsciiArePresent(word) {
        let regex = /[^\x00-\x7F]+/;
        return regex.test(word);
    }

    validatePhoneNumber(number){
        let regex = /(\+591\b)(?!.*\1)((\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){7})/;
        return regex.test(number);
    }
}

module.exports = DoctorValidator;