const Controller =
    require("../../../../../index.js").Controller;
module.exports = class WebsocketController extends Controller {
  index(params, ws, request) {
    ws.send("It worked");
    ws.close();
  }

  voodoo(params, ws, request) {
    ws.send("Voodoo worked");
    ws.close();
  }
}
