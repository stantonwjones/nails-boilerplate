import nails, {Controller} from "../../../../../index.ts";

export default class ErrorController extends Controller {
  // DO NOT OVERRIDE CONSTRUCTOR
  index(params, request, response) {
    response.json({
      classbased_index: true
    });
  }

  fivehundred(params, request, response) {
    objectThatIsUndefined.attempt_to_access_field_erroneously();
    return {value: "will never get here"};
  }

  testaction(params, request, response) {
    response.json({
      classbased_testaction: true
    });
  }

  async testpromise(params, request, response) {
    response.json({
      classbased_testpromise: true
    });
  }
}