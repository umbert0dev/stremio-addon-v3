import { StreamingStrategy } from "@services/StreamingStrategy";
import { CatalogChannel } from "@models/CatalogChannel";

export const getChannelList = async (type: string, providerCode: string, host: string, protocol: string): Promise<CatalogChannel[]> => {
    let channelList: CatalogChannel[] = [];
    const realService = await StreamingStrategy.create(providerCode, type, protocol, host);
    channelList = await realService.getChannelList();
    return channelList;
};