import { AppError } from "./AppError";

export class MethodNotAllowedError extends AppError {
  constructor(message = 'Method Not Allowed') {
    super(message, 405);
    this.name = 'MethodNotAllowedError';
  }
}