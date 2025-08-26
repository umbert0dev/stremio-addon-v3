import axios from "axios";
import { UtilityHelper } from "@utils/UtilityHelper";
import { NotFoundError } from "@utils/errors/NotFoundError";
import { InternalServerError } from "@utils/errors/InternalServerError";
import { Meta } from "@models/Meta";
import { StreamingStrategy } from "./StreamingStrategy";

export class MetaService {
  static async getTvChannelMeta(providerKey: string, externalId: string, streamType: string, protocol: string, host: string): Promise<Meta> {
    const realService = await StreamingStrategy.create(providerKey, streamType, protocol, host);
    return await realService.getTvChannelMeta(externalId);
  };
}