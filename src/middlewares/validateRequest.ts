// src/middlewares/validateRequest.ts
import { Request, Response, NextFunction } from "express";
import * as expressValidator from "express-validator";

const { validationResult } = expressValidator;

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  next();
};