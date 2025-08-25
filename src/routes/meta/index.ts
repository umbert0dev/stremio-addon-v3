import express, { NextFunction, Request, Response } from "express";
import * as MetaController from "@controllers/meta";
import { BadRequestError } from "@/src/utils/errors/BadRequestError";

const router = express.Router();

router.options("/:type/:id.json", async (req: Request, res: Response) => {
  res.status(200).send();
});

router.get("/:type/:id.json", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, id } = req.params as { type: string; id: string };
    const host = req.get("host") || "";
    const protocol = req.protocol;
    if (type === "tv") {
      const meta = await MetaController.getTvChannelMeta(type, id, host, protocol);
      res.json({ meta });
    }
    else {
      throw new BadRequestError(`stream type not supported`);
    }
  } catch (error) {
    next(error)
  }
});

export = router;
