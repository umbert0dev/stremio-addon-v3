import { BadRequestError } from "@utils/errors/BadRequestError";
import { AbstractStreamingService } from "./AbstractStreamingService";
import { ProviderManager } from "./ProviderManager";
import { RojadirectaService } from "./RojadirectaService";

const providers: Record<string, any> = {
    'rojadirecta': RojadirectaService,
};

export class StreamingStrategy {
    static async create(providerKey: string, mediaType: string, protocol: string, host: string): Promise<AbstractStreamingService> {
        const ServiceClass = providers[providerKey];
        if (!ServiceClass) {
            throw new BadRequestError(`Provider ${providerKey} not implemented`);
        }
        const provider = await ProviderManager.getProvider(providerKey);
        if (!provider) {
            throw new Error(`provider with code: ${providerKey} not found`);
        }
        return new ServiceClass(mediaType, provider, protocol, host);
    }
}