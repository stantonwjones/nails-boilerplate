module.exports =
  class HomeController extends require("nails-boilerplate").Controller {
    index(params, request, response) {
      return {
        title: "My first Nails Service",
        welcome_message: "Welcome to Nails"
      };
    }
  };
