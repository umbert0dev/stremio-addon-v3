import { Provider } from '@models/Provider';
import { BASE_DIR } from '@config/paths';
import fs from 'fs';
import path from 'path';
const providersFile = path.join(BASE_DIR, 'data/providers.json'); 

export class ProviderManager {
    static getProvider(code: string): Provider | null {
        let providers = this.readProviders();
        return providers.find(d => d.code === code) || null;
    }

    static getProviderIndex(code: string): number {
        let providers = this.readProviders();
        return providers.findIndex(d => d.code === code);
    }

    static getAllProviders(): Provider[] {
        return this.readProviders();
    }

    static async getActiveProviders() {
        return this.getAllProviders().filter(provider => provider.active == true);
    }

    static async updateProviderByCode(code: string, providerObj: Provider) {
        let providers = this.getAllProviders();
        let index = this.getProviderIndex(code);
        if (index !== -1) {
            providers[index] = providerObj;
            this.writeProviders(providers);
        }
    }
    
    static readProviders(): Provider[] {
        if (!fs.existsSync(providersFile)) return [];
        const content = fs.readFileSync(providersFile, 'utf-8');
        return JSON.parse(content);
    }

    static writeProviders(providers: Provider[]) {
        if (!fs.existsSync(providersFile)) return;
        fs.writeFileSync(providersFile, JSON.stringify(providers, null, 2), 'utf-8');
    }
}