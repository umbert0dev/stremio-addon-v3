import { Request, Response } from "express";
import { ProviderManager } from '@services/ProviderManager';

export const getProviders = async (req: Request, res: Response) => {
    return ProviderManager.getAllProviders();
};

export const updateProvider = async (req: Request, res: Response) => {
    const { code } = req.params;
    const { baseURL, active } = req.body;
    if (code) {
        let providerObj = {
            code,
            baseURL,
            active: active
        };
        await ProviderManager.updateProviderByCode(code, providerObj);
    }

    return { success: true };
};