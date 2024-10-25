export class ApiError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static UnautorizedError() {
        return new ApiError(401, 'user is unautorized');
    }
    static BadRequest(massage, errors = []) {
        return new ApiError(400, massage, errors);
    }
    static Internal(massage) {
        return new ApiError(500, massage);
    }
}
