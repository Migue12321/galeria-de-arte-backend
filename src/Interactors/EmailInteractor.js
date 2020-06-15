const nodemailer = require('nodemailer');
const moment = require('moment');
const EV = require("../Config/EnviromentVariables");

class EmailInteractor {
    constructor(appointmentInteractor, doctorRepository) {
        this.appointmentInteractor = appointmentInteractor;
        this.doctorRepository = doctorRepository;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EV.contactEmail,
                pass: EV.password
            }
        });
        this.mailOptions = {
            from: 'Equipo "Tu Cita!!"',
            to: '',
            subject: '',
            text: ''
        };


    }
    async sendManyEmail(res, recipientList) {
        for(let i=0; i<recipientList.length; i++){
            this.mailOptions.to = recipientList[i];
            await this.sendEmail(res);
        }
    }
    async sendEmail(res) {
        await this.transporter.sendMail(this.mailOptions, function(error){
            if (error){
                console.log(error);
                return res.send( {success: false, message: error.toString()});
            } else {
                console.log("Email sent");
                return res.status(200).send({success: true, message: "Email sent"});
            }
        });
    }
    async sendEmails() {
        await this.transporter.sendMail(this.mailOptions, function(error){
            if (error){
                console.log(error);
            } else {
                console.log("Email sent");
            }
        });
    }
    async sendPatientReminder(){
        let appointmentsForTomorrow = await this.appointmentInteractor.getAppointmentsForTomorrow();
        moment.locale('es');
        let tomorrow = moment().add(1,"day");
        if(appointmentsForTomorrow.length>0){
            this.mailOptions.subject = 'Recordatorio de Cita Medica';
            appointmentsForTomorrow.forEach(appointment => {
                if(appointment.patientEmail !== ""){
                    this.mailOptions.to = appointment.patientEmail;
                    this.mailOptions.text = "Estimado " + appointment.patient + ": " +
                        "El equipo de \"Tu Cita!!\" desea recordarle que el dia de mañana " + tomorrow.format('dddd') + tomorrow.format(" D") + " de " + tomorrow.format(" MMMM ")
                        + "del" + moment().format(" YYYY") + " usted tiene una cita medica con el doctor "+ appointment.doctorName +" a las " + moment(appointment.start).format('h:mm')
                        +"\nUn cordial saludo \nAtentamente: "+ this.mailOptions.from;
                    this.sendEmail();
                }
            });
        }

    }

    async sendDoctorReminder(){
        let haveConfirmedAppointments =false;
        let appointmentsByDoctorForTomorrow = await this.getAppointmentsFroTomorrowSortedByDoctor();
        moment.locale('es');
        let tomorrow = moment().add(1,"day");
        if(appointmentsByDoctorForTomorrow.length>0){
            this.mailOptions.subject = "Recordatorio de Citas Medicas - " + tomorrow.format('dddd') + tomorrow.format(" D") + " de " + tomorrow.format(" MMMM ");
            appointmentsByDoctorForTomorrow.forEach(appointments => {
                if(appointments.length>0){
                   this.mailOptions.to = appointments[0].doctorEmail;
                   this.mailOptions.text = "Estimado Dr. " + appointments[0].doctorName + ": " +
                            "El equipo de \"HeyDoc!\" desea recordarle que el dia de mañana " + tomorrow.format('dddd') + tomorrow.format(" D") + " de " + tomorrow.format(" MMMM ")
                            + "del" + tomorrow.format(" YYYY") + " usted tiene las siguientes citas:\n";
                    appointments.forEach(appointment => {
                        if(appointment.status !=="not confirmed"){
                            haveConfirmedAppointments = true;
                            this.mailOptions.text =  this.mailOptions.text  + appointment.patient +" a las "  + moment(appointment.start).format('h:mm')+ "\n";
                        }
                    })
                    this.mailOptions.text =  this.mailOptions.text  +"\nUn cordial saludo \nAtentamente: "+ this.mailOptions.from;
                    console.log("haveConfirmedAppointments", haveConfirmedAppointments)
                    if(haveConfirmedAppointments){
                        this.sendEmail();
                    }
                }
            });
        }
    }
    async getAppointmentsFroTomorrowSortedByDoctor(){
        let appointmentsForTomorrow = await this.appointmentInteractor.getAppointmentsForTomorrow();
        let doctors = await this.doctorRepository.getAll();
        let doctorAppointments=[];
        for (let i = 0; i < doctors.length; i++) {
            for (let j = 0; j < appointmentsForTomorrow.length; j++) {
                doctorAppointments.push([]);
                if (doctors[i]._id === appointmentsForTomorrow[j].doctorId) {
                    doctorAppointments[i].push(appointmentsForTomorrow[j]);
                }
            }
        }
        return doctorAppointments;
    }



}
module.exports = EmailInteractor;