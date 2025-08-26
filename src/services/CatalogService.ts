import { CatalogChannel } from "@models/CatalogChannel";
import { StreamingStrategy } from "./StreamingStrategy";

export class CatalogService {
  static async getChannelList(type: string, providerCode: string, host: string, protocol: string): Promise<CatalogChannel[]> {
    const realService = await StreamingStrategy.create(providerCode, type, protocol, host);
    return realService.getChannelList();
  }
}