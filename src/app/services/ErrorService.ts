export class ApiError extends Error {
  status;
  errors;
  constructor(status: number, message: string, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
  static UnautorizedError() {
    return new ApiError(401, 'user is unautorized');
  }
  static BadRequest(massage: string, errors = []) {
    return new ApiError(400, massage, errors);
  }
  static Internal(massage: string) {
    return new ApiError(500, massage);
  }
}
