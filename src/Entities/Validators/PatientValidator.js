class PatientValidator {

    validateCreate(user) {
        return this.validate(user);
    }

    validateUpdate(objectID, patient) {
        let response = { success: true, message: "" };
        let mongoIdResponse = this.validateUserID(objectID);
        let responseValidator = this.validate(patient.$set);
        if(!(mongoIdResponse)){
            response = { success: false,  message: "Error validating ID "};
        }
        if(!responseValidator.success){
            response = responseValidator;
        }
        return response;
    }

    validate(patient) {
        let response = { success: true, message: "" };
        if(!this.validateName(patient.name)){
            console.log("name")
            response = { success: false,  message: "Error validating name"};
        }
        if(!this.validateName(patient.lastname)){
            console.log("lastname")
            response = { success: false,  message: "Error validating lastname"};
        }
        if(!this.validateEmail(patient.email)){
            console.log("email")

            response = { success: false,  message: "Error validating email"};
        }
        if(!this.validatePhoneNumber(patient.phone)){
            console.log("phone")

            response = { success: false,  message: "Error validating phone"};
        }
        return response
    }


    validateName(name) {
        return name && name.length != 0 && this.noStrangerCharacterArePresent(name)
            && (name.length < 200);
    }

    validateUserID(patientID) {
        return patientID;
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

module.exports = PatientValidator;