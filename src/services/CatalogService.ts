import { CatalogChannel } from "@models/CatalogChannel";
import { StreamingStrategy } from "./StreamingStrategy";
import { RequestContext } from "../models/RequestContext";

export class CatalogService {
  static async getChannelList(context: RequestContext): Promise<CatalogChannel[]> {
    const realService = await StreamingStrategy.create(context);
    return realService.getChannelList();
  }
}