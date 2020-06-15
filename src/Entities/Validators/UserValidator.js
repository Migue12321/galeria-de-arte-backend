class UserValidator {

    validateCreate(user) {
        return this.validate(user);
    }

    validateUpdate(objectID, user) {
        let response = { success: true, message: "" };
        let mongoIdresponse = this.validateID(objectID);
        let responseValidator = this.validate(user.$set);
        if(!(mongoIdresponse )){
            response = { success: false,  message: "Error validating ID "};
        }
        if(!responseValidator.success){
            response = responseValidator;
        }
        return response;
    }

    validate(user) {
        let response = { success: true, message: "" };
        if(!this.validateName(user.name)){
            response = { success: false,  message: "Error validating name"};
        }
        if(!this.validateEmail(user.email)){
            response = { success: false,  message: "Error validating email"};
        }
        return response
    }

    validateID(objectID) {
        return objectID;
    }

    validateName(name) {
        return name && name.length != 0 && !this.nonStandardsAsciiArePresent(name)
            && (name.length < 200);
    }

    validatelastname(lastname) {
        return lastname && lastname.length != 0 && !this.nonStandardsAsciiArePresent(lastname)
            && (lastname.length < 200);
    }

    validateUserID(userID) {
        return userID && userID.length != 0 && !this.nonStandardsAsciiArePresent(userID)
            && (userID.length < 500);
    }

    validateEmail(email) {
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email.toLowerCase());

    }

    nonStandardsAsciiArePresent(word) {
        let regex = /[^\x00-\x7F]+/;
        return regex.test(word);
    }
}

module.exports = UserValidator;