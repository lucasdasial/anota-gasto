import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { loginUser, registerUser } from "../../modules/users/users.service.ts";
import { ValidationError } from "../errors/ValidationError.ts";

const registerSchema = z.object({
    name: z.string({ error: "Nome é obrigatório." }).min(2),
    email: z.email({ error: "E-mail inválido." }),
    password: z.string({ error: "Senha é obrigatório." }).min(8, { error: "Senha deve ter no mínimo 8 caracteres." }),
});

const loginSchema = z.object({
    email: z.email({ error: "E-mail inválido." }),
    password: z.string({ error: "Senha é obrigatório." }).min(1),
});

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            return next(new ValidationError(result.error));
        }

        const user = await registerUser(result.data).catch(next);
        res.status(201).json(user);
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return next(new ValidationError(result.error));
        }

        const data = await loginUser(result.data).catch(next);
        res.status(200).json(data);
    }
}



