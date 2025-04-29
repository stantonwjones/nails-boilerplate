import nails from "nails-boilerplate";

export default class HomeController extends nails.Controller {
    index(params, request, response) {
      return {
        title: "My first Nails Service",
        welcome_message: "Welcome to Nails"
      };
    }
  };
