import { StreamingStrategy } from "./StreamingStrategy";

export class StreamService {
    static async getMediaLinks(providerKey: string, externalId: string, type: string, protocol: string, host: string) {
        const realService = await StreamingStrategy.create(providerKey, type, protocol, host);
        return await realService.getMediaLinks(externalId);
    };
}