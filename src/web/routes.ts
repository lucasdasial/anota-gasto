import { Router } from "express";
import { AuthController } from "./controllers/auth.controller.ts";
import { authenticate } from "./middlewares/authenticate.ts";

function publicRoutes(): Router {
    const router = Router();
    router.post("/auth/register", AuthController.register);
    router.post("/auth/login", AuthController.login);
    return router;
}

function authenticatedRoutes(): Router {
    const router = Router();
    // router.use("/expenses", expenseRoutes());
    return router;
}

export function registerApiRouter(): Router {
    const router = Router();
    router.use("/", publicRoutes());
    router.use("/", authenticate, authenticatedRoutes());
    return router;
}
