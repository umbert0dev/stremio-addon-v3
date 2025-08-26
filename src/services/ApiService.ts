import { Provider } from "../models/Provider";
import { InternalServerError } from "../utils/errors/InternalServerError";
import { ProviderManager } from "./ProviderManager";
import { exec } from "child_process";

export class ApiService {
    static async updateProvider(providerObj: Provider) {
        await ProviderManager.updateProviderByCode(providerObj.code, providerObj);
    };

    static async getProviders() {
        return ProviderManager.getAllProviders();
    };

    static async getStats() {
        return exec("top -w 150 -b -n 1 | head -50", (err, stdout, stderr) => {
            if (err) throw new InternalServerError(err.message);
            return stdout;
        });
    };
}