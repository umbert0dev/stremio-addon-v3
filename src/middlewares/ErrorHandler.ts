import { Request, Response, NextFunction } from 'express';
import { InternalServerError } from '@/src/utils/errors/InternalServerError';
import { ResponseHelper } from '@/src/utils/ResponseHelper';

export class ErrorHandler {
  static handleError = (err: unknown, req: Request,
    res: Response, next: NextFunction ) => {
    if (err instanceof InternalServerError) {
      return ResponseHelper.sendError(res, err.statusCode, err.message);
    }
    const message = ResponseHelper.getErrorMessage(err);
    console.error('Unhandled error:', err);
    return ResponseHelper.sendError(res, 500, 'Internal server error', { details: message });
  }
}