
  class UserValidator {

    validateSession(token) {
        admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
    let uid = decodedToken.uid;
    // ...
  }).catch(function(error) {
    // Handle error
  });
        return this.validate(user);
    }

    
}

module.exports = UserValidator;