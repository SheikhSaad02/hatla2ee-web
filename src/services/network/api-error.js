export class ApiError extends Error {
  constructor({ message, status, statusText, data }) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}
