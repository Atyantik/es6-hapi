export default class CoreController {
  /**
   * Provide a String/Array/Object as message to return to user
   * @param message String/Array/Object
   * @param code Http Status Code (200, 400, 500...)
   */
  throwError(message, code = 500) {
    throw this.createError(message, code);
  }
  createError(message, code = 500) {
    let error = new Error(JSON.stringify(message));
    error.code = code;
    return error;
  }
}