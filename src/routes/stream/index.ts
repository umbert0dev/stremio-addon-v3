import express, { NextFunction, Request, Response } from "express";
import * as streamController from "@controllers/stream";
import StremioResponse from "@models/StremioResponse";
import { BadRequestError } from "@/src/utils/errors/BadRequestError";

const router = express.Router();

router.get("/:type/:id.json", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, id } = req.params as { type: string; id: string };
    let streamList: any[] = [];
    if (type === "tv") {
        streamList = await streamController.getTvCahnnel(req, res);
    }
    else {
      throw new BadRequestError(`stream type not supported`);
    }
    const stremioResponse = new StremioResponse(streamList);
    return res.json(stremioResponse.toJson());
  } catch (error) {
    next(error)
  }
});

export = router;