import Nails from "../../../../../index.js";

export default class WebsocketController extends Nails.Controller {
  index(params, ws, request) {
    ws.send("It worked");
    ws.close();
  }

  voodoo(params, ws, request) {
    ws.send("Voodoo worked");
    ws.close();
  }
}
