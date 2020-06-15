class CreatePatientRequestModel {
    getRequestModel(body) {
        let accountId;
        if(body.accountId=== undefined){
            accountId = "";
        }else{
            accountId = body.accountId ;
        }
        let name = body.name ? body.name.trim() : "";
        let lastname = body.lastname ? body.lastname.trim() : "";
        let email = body.email ? body.email.trim() : "";
        let role = "patient";
        let password = body.password ? body.password.trim() : "";
        let phone = body.phone ? body.phone.trim() : "";
        return {
            accountId:accountId,
            lastname: lastname,
            name: name,
            password:password,
            email: email,
            role: role,
            phone: phone
        };
    } 
} 

module.exports = CreatePatientRequestModel;