import nails from "../../../../../index.js";

export default class WebsocketController extends nails.Controller {
  index(params, ws, request) {
    ws.send("It worked");
    ws.close();
  }

  voodoo(params, ws, request) {
    ws.send("Voodoo worked");
    ws.close();
  }
}
