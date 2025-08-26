import express, { NextFunction, Request, Response } from "express";
import { param } from "express-validator";
import { validateRequest } from "@/src/middlewares/validateRequest";
import { MetaController } from "@/src/controllers/MetaController";

const router = express.Router();

router.options("/:type/:id.json", async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send();
});

router.get("/:type/:id.json",
  [
    param("type").exists().withMessage("missing type path param").isString(),
    param("id").exists().withMessage("missing id path param").isString(),
    validateRequest
  ],
  MetaController.getTvChannelMeta
);

export = router;
