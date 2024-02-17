class apiResponse {
  constructor(status, message = "Success", data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export default apiResponse;