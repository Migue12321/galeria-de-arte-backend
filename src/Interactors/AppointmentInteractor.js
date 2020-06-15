const moment = require('moment');
const AppointmentValidator = require('../Entities/Validators/AppointmentValidator');
require('../Adapters/DTOs/Image/CreateImageRequestModel');

class AppointmentInteractor {

    constructor(appointmentRepository, doctorRepository, patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    async getAppointmentById(id) {
        return await this.appointmentRepository.getOne(id);
    }

    async getAllAppointments() {
        return await this.appointmentRepository.getAll();
    }

    async getAllAppointmentsByDoctorId(id){
        return await this.appointmentRepository.getByDoctorId(id);
    }
    async getAllAppointmentsByPatientId(id) {
        return await this.appointmentRepository.getByPatientId(id);
    }

    async getAllFreeHours(id){
        let appointments = await this.getAllAppointmentsByDoctorId(id);
        let freeHours = await this.getWorkingHoursWithFormat(id);
        appointments.forEach(appointment => {
            freeHours = this.deleteAppointmentHour(freeHours,appointment.start);
        });
        return freeHours;
    }


    deleteAppointmentHour(array,elem) {
        return array.filter(e=> e.start!==elem);
    }

    async getWorkingHoursWithFormat(id) {
        let doctorWorkingHours = (await this.doctorRepository.getOne(id))[0].attentionSchedule;
        let doctorWorkingHoursWithFormat = [];
        let day;
        let today= moment().format()
        let end2Weeks = moment().add(15,"d").format()
        for (let i = 0; i < doctorWorkingHours.length; i++) {
            day = moment()
                .startOf('month')
                .day((doctorWorkingHours)[i]["daysOfWeek"][0]);
            if (7 < day.date())
                day.add(7, 'd');
            let year = day.year();
            let formatDay;
            let time;
            let formatDate;
            while (year === day.year()) {
                if(day.isBetween(today,end2Weeks)){
                    formatDay = day;
                    time = formatDay.format('YYYY-MM-DD');
                    formatDate = time + "T" + (doctorWorkingHours)[i]["startTime"] + ".000Z";
                    doctorWorkingHoursWithFormat.push({
                        "start": moment(formatDate).add(4,"h").toISOString()
                    });
                }

                day.add(7, 'd');
            }
        }
        return doctorWorkingHoursWithFormat;
    }

    async create(appointment) {
        let appointmentValidator = new AppointmentValidator();
        let appointments = await this.getAllAppointmentsByPatientId(appointment.patientId);
        let response = appointmentValidator.validateCreate(appointment, appointments);
        if(!response.success)
            return response;
        try {
            appointment.status = "pending";
            this.appointmentRepository.insert(appointment);
        } catch (error) {
            return this.prepareDBErrorResponse(error);
        }
        return response
    }
    async delete(id) {
        let response;
            try {
            response = this.appointmentRepository.delete(id);
        } catch (error) {
            response = this.prepareDBDeleteResponse(error);
        }
        return response;
    }

    async update(id, appointment) {
        let appointmentValidator = new AppointmentValidator();
        let response = appointmentValidator.validateUpdate(id, appointment);
        if (!response.success) {
            return response;
        }
        try {
            await this.appointmentRepository.update(id, appointment);
        } catch (error) {
            return this.prepareDBDeleteResponse(error);
        }
        return response;
    }
    async cancelAllNotConfirmedAppointments(){
        let appointments = await this.getAppointmentsForTomorrow();
        appointments.forEach(appointment =>{
            if(appointment.status === "pending"){
                // this.delete(appointment._id);
                appointment.status = "not confirmed";

                this.update(appointment._id, {$set: appointment});
                }
        })
    }
    async getAppointmentsWithDoctorDataAndPatientEmail(){
        let appointments =  await this.appointmentRepository.getAll();
        let doctors = await this.doctorRepository.getAll();
        let patients = await this.patientRepository.getAll();
        let appointmentsWithDoctorName = [];
        appointments.forEach(appointment => {
            doctors.forEach(doctor => {
                if(doctor._id.toString()=== appointment.doctorId) {
                    appointment["doctorName"] = doctor.name + " " + doctor.lastname;
                    appointment["doctorEmail"] = doctor.email;
                }
            })
            patients.forEach(patient => {
                if(patient._id.toString()=== appointment.patientId) {
                    appointment["patientEmail"] = patient.email;
                }
                if(appointment.patientId === ""){
                    appointment["patientEmail"] = "";
                }
            })
            appointmentsWithDoctorName.push(appointment);
        })
        return  appointmentsWithDoctorName;
    }

    async getAppointmentsForTomorrow() {
        let appointmentsForTomorrow = [];
        let appointments = await this.getAppointmentsWithDoctorDataAndPatientEmail().then(res => res).catch((error) => {
            console.log(error.toString());
            return []
        });
        let tomorrow = moment().add(1, 'days');
        let appointmentDate;
        appointments.forEach(appointment => {
            appointmentDate = moment(appointment.start)
            if(appointmentDate.month() === tomorrow.month()
                && appointmentDate.date() === tomorrow.date()
                && appointmentDate.year() === tomorrow.year()){
                if(appointment.status === "confirmed"){
                    appointmentsForTomorrow.push(appointment);

                }
            }
        });
        return appointmentsForTomorrow;
    }

    prepareDBDeleteResponse(id, response) {
        response = { success: false, message: "" };
        response.message = "The item " + id + " wasn't deleted successfully";
        return response
    }

    prepareDBErrorResponse(error) {
        return { success: false, message: error.toString() };
    }

}

module.exports = AppointmentInteractor;