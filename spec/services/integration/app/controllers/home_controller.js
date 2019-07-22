module.exports = function HomeController() {
  this.index = function(params, request, response) {
    response.json({
      home_index: true
    });
  };
  this.testaction = function(params, request, response) {
    response.json({
      home_testaction: true
    });
  }
  this.test_ejs = function() {
  };
/*
  this.public_index = function(params, request, response) {
    response.public({path: 'index.html'});
  };
  this.json = function(params, request, response) {
    response.json({test: 'json'});
  };
  // By setting a method to asynchronous, Nails will wait for an
  // explicit response to the client. Otherwise, it will attempt
  // to respond with a view immediately after the action terminates.
  this.json.async = true;

  this.test_model = function(params, request, response) {
    var u = new User();
    u.set('created_at', (new Date()).getTime());
    u.save();
    response.json({new_user_id: u.id.toString()});
  };
  this.test_id_template = function(params, request, response) {
    var varz = {};
    varz.id = params.id || "no id set";
    response.render('test_id', varz);
  };
  */
}
