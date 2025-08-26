import { Request, Response } from "express";
import { ProviderManager } from "@services/ProviderManager";
import { StreamingStrategy } from "@services/StreamingStrategy";
import { CatalogChannel } from "@models/CatalogChannel";

export const getChannelList = async (req: Request, res: Response): Promise<CatalogChannel[]> => {
    const { type } = req.params;
    const host = req.get("host") || "";
    const protocol = req.protocol;

    let combinedChannels: CatalogChannel[] = [];

    if (type) {
        const providers = await ProviderManager.getActiveProviders();
        const channelPromises = providers.map(async (provider) => {
            let channelList = [];
            const realService = await StreamingStrategy.create(provider.code, type, protocol, host);
            channelList = await realService.getChannelList();
            return channelList;
        });
        const channels = await Promise.all(channelPromises);
        combinedChannels = channels.flat();
    }

    return combinedChannels;
};