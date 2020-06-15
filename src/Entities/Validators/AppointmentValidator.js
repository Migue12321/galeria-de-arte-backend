const moment = require('moment');

class AppointmentValidator {

    validateUpdate(objectID, appointment) {
        let response = { success: true, message: "" };
        let mongoIdResponse = this.validateMongoID(objectID);
        let validateResponse = this.validate(appointment.$set);
        if(!(mongoIdResponse )){
            response = { success: false,  message: "Error validating MongoID"};
        }
        if(!(validateResponse.success )){
            response = { success: false,  message: "Error validating Appointment"};
        }
        return response;
    }
    validate(appointment){
        let response = { success: true, message: "" };
        if(!this.validateStartFormat(appointment.start)){
            response = { success: false, message: "Error validating Start" };
        }
        return response
    }

    validateCreate(appointment, appointments) {
        let response = { success: true, message: "" };
        if(!this.validateStart(appointment.start)){
            console.log("Error validating Start, the date must be greater than today's date")
            response = { success: false, message: "Error validating Start, the date must be greater than today's date " };
        }
        if(!this.validateStartFormat(appointment.start)){
            console.log("Error validating Start format" )
            response = { success: false, message: "Error validating Start format" };
        }
        if(!this.validatePendingAppointment(appointments, appointment.doctorId)){
            console.log("Error, user have a pending appointment yet" )
            response = { success: false, message: "Error, user have a pending appointment yet" };
        }
        return response;
    }


    validateMongoID(objectID) {
        return objectID;
    }

    validateString(name) {
        return name && this.isNameInCorrectFormat(name);
    }


    isNameInCorrectFormat(appointment) {
        let regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{1,300}$/;
        return regex.test(appointment);
    }

    validateStartFormat(start) {
        //Validate that the format is ISO-8601 (example: 2020-01-31T23: 00: 00Z)
        let regex = /^(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,9})?(?:Z|[+-][01]\d:[0-5]\d)$/;
        return regex.test(start) ;
   }

    validateStart(start) {
        let today = moment();
        start = moment(start);
        return today.isBefore(start) ;
    }

    validatePendingAppointment(appointments, doctorId) {
        let response = true;
        if(this.hasANotPendingAppointmentInTheFuture(appointments,doctorId)){
            response = false;
        }
        return response;
    }

    hasANotPendingAppointmentInTheFuture(appointments,doctorId){
        let now = moment();
        let response = false;
        appointments.forEach(registeredAppointment =>{
            if(registeredAppointment.doctorId.toString() === doctorId.toString()) {
                if (moment(registeredAppointment.start).isAfter(now)) {
                    if (!this.statusIsNotConfirmed(registeredAppointment)) {
                        response = true;
                    }
                }
            }
        });
        return response;
    }

    statusIsNotConfirmed(appointment){
        let response = true;
        if(appointment.status.toString() !== "not confirmed"){
            response = false;
        }
        return response;

    }
}

module.exports = AppointmentValidator;