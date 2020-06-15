class DoctorValidator {

    validateCreate(doctor) {
        return this.validate(doctor);
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

    validate(doctor) {
        let response = { success: true, message: "" };
        if(!this.validateName(doctor.name)){
            console.log("name")
            response = { success: false,  message: "Error validating name"};
        }
        if(!this.validateName(doctor.lastname)){
            console.log("lastname")
            response = { success: false,  message: "Error validating lastname"};
        }
        if(!this.validateEmail(doctor.email)){
            console.log("email")

            response = { success: false,  message: "Error validating email"};
        }
        if(!this.validatePhoneNumber(doctor.phone)){
            console.log("phone")

            response = { success: false,  message: "Error validating phone"};
        }
        return response
    }

    validateName(name) {
        return name && name.length != 0 && (name.length < 200)
            && this.noStrangerCharacterArePresent(name);
    }

    validateUserID(doctorID) {
        return doctorID;
    }

    validateEmail(email) {
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email.toLowerCase());

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