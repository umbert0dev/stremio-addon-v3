import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../utils/errors/BadRequestError";
import { ApiService } from "../services/ApiService";

export class ApiController {
    static async updateProvider(req: Request, res: Response, next: NextFunction) {
        try {
            const { code } = req.params;
            const { baseURL, active } = req.body;
            if(!code) throw new BadRequestError(`missing code query param`);
            if(!baseURL) throw new BadRequestError(`missing baseURL body param`);
            if(!active) throw new BadRequestError(`missing active body param`);

            let providerObj = {
                code,
                baseURL,
                active: active
            };
            await ApiService.updateProvider(providerObj);
            res.json({ success: true });
        } catch (error) {
            next(error)
        }
    };

    static async getProviders(req: Request, res: Response, next: NextFunction) {
        try {
            let providers = await ApiService.getProviders();
            res.json(providers);
        } catch (error) {
            next(error)
        }
    };

    static async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            let stdout = await ApiService.getStats();
            res.json({ output: stdout });
        } catch (error) {
            next(error)
        }
    };
}