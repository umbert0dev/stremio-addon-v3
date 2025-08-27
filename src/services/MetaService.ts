import axios from "axios";
import { UtilityHelper } from "@utils/UtilityHelper";
import { NotFoundError } from "@utils/errors/NotFoundError";
import { InternalServerError } from "@utils/errors/InternalServerError";
import { Meta } from "@models/Meta";
import { StreamingStrategy } from "./StreamingStrategy";
import { RequestContext } from "../models/RequestContext";

export class MetaService {
  static async getTvChannelMeta(context: RequestContext, channelMediaId: string): Promise<Meta> {
    const realService = await StreamingStrategy.create(context);
    return await realService.getTvChannelMeta(channelMediaId);
  };
}