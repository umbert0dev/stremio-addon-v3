import { BadRequestError } from "../utils/errors/BadRequestError";
import { AbstractStreamingService } from "./AbstractStreamingService";
import { DomainService } from "./DomainService";
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
        const domain = await DomainService.getDomain(providerKey);
        if (!domain) {
            throw new Error(`Domain with code: ${providerKey} not found`);
        }
        return new ServiceClass(mediaType, domain.baseURL, protocol, host);
    }
}