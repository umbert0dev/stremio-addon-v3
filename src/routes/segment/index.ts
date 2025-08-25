import express, { Request, Response } from "express";
import * as segmentController from "@controllers/segment";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!req.query.s) throw new Error("missing s param");
    if (!req.query.referer) throw new Error("missing referer param");
    if (!req.query.origin) throw new Error("missing origin param");
    if (!req.query.domain) throw new Error("missing domain param");
    const s = req.query.s as string;
    const segmentPath = Buffer.from(s, "base64").toString();
    const referer = decodeURIComponent(req.query.referer as string);
    const origin = decodeURIComponent(req.query.origin as string);
    const domain = decodeURIComponent(req.query.domain as string);

    let response = await segmentController.getStreamSegment(segmentPath, referer, origin, domain);

    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (err) {
    res.status(500).send("Error fetching segment");
  }
});


export = router;