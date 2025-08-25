import { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/errors/AppError';
import { getErrorMessage, sendError } from '@utils/responseHelper';

export class ErrorHandler {
  static handleError = (err: unknown, req: Request,
    res: Response, next: NextFunction ) => {
    if (err instanceof AppError) {
      return sendError(res, err.statusCode, err.message);
    }
    const message = getErrorMessage(err);
    console.error('Errore non gestito:', err);
    return sendError(res, 500, 'Internal server error', { details: message });
  }
}