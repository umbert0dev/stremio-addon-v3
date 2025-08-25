import { Request, Response } from "express";
import { DomainService } from '@services/DomainService';

export const getDomains = async (req: Request, res: Response) => {
    return DomainService.getAllDomains();
};

export const updateDomain = async (req: Request, res: Response) => {
    const { code } = req.params;
    const { baseURL, active } = req.body;
    if (code) {
        let domainObj = {
            code,
            baseURL,
            active: active
        };
        await DomainService.updateDomainByCode(code, domainObj);
    }

    return { success: true };
};