import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { AppError } from "../errors/AppError.ts";
import { ValidationError } from "../errors/ValidationError.ts";

vi.mock("./logger.ts", () => ({
	logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

import { errorHandler } from "./errorHandler.ts";

describe("errorHandler", () => {
	let req: object;
	let res: { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> };
	let next: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		req = {};
		res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		};
		next = vi.fn();
	});

	it("should handle ValidationError with 422 and issues array", () => {
		const result = z
			.object({ email: z.email() })
			.safeParse({ email: "invalid" });
		const err = new ValidationError(
			(result as { error: Parameters<typeof ValidationError>[0] }).error,
		);

		errorHandler(err, req as never, res as never, next);

		expect(res.status).toHaveBeenCalledWith(422);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				error: "Validation failed",
				issues: expect.any(Array),
				timestamp: expect.any(String),
			}),
		);
	});

	it("should handle AppError with correct statusCode and message", () => {
		const err = new AppError(403, "Forbidden");

		errorHandler(err, req as never, res as never, next);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				error: "Forbidden",
				timestamp: expect.any(String),
			}),
		);
	});

	it("should handle unknown error with 500 and generic message (non-development)", () => {
		const err = new Error("DB connection failed");

		errorHandler(err, req as never, res as never, next);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ error: "Internal server error" }),
		);
	});

	it("should return actual error message in development mode", async () => {
		vi.resetModules();
		vi.doMock("../../config/envs.ts", () => ({
			envs: {
				nodeEnv: "development",
				port: 3000,
				db: { url: "" },
				jwt: { secret: "test" },
			},
		}));

		const { errorHandler: devHandler } = await import("./errorHandler.ts?dev");
		const err = new Error("Actual dev error");

		devHandler(err, req as never, res as never, next);

		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({ error: "Actual dev error" }),
		);

		vi.doUnmock("../../config/envs.ts");
		vi.resetModules();
	});
});
