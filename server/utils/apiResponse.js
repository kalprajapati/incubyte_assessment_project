class ApiResponse {
  constructor(statusCode, message = 'Success', data = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    if (data !== null) {
      this.data = data;
    }
  }

  static send(res, statusCode, message, data) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
  }
}

module.exports = ApiResponse;
