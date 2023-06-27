export class ApiError extends Error {
  status;
  errors;
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
  static UnautorizedError() {
    return new ApiError(401, "user is unautorized");
  }
  static BadRequest(massage, errors = []) {
    return new ApiError(400, massage, errors);
  }
}
