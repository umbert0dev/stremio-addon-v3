import { AbstractStreamingService } from "./AbstractStreamingService";
import { DomainService } from "./DomainService";
import { RojadirectaService } from "./RojadirectaService";

const providers: Record<string, any> = {
    'rojadirecta': RojadirectaService,
};

export class StreamingStrategy {
    static async create(providerKey: string, mediaType: string, protocol: string, host: string): Promise<AbstractStreamingService | null> {
        const ServiceClass = providers[providerKey];
        if (!ServiceClass) return null;
        const domain = await DomainService.getDomain(providerKey);
        if (!domain) {
            throw new Error(`Dominio non trovato per il codice: ${providerKey}`);
        }
        return new ServiceClass(mediaType, domain.baseURL, protocol, host);
    }
}