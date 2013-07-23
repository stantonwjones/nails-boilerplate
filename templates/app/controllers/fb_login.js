module.exports = function FBLoginController() {
    this.login = function(params, request, response) {
        response.render('jsonview', {message: 'got the login'});
    };
    
};
