import { describe, expect, it } from "vitest";
import { AppError } from "./AppError.ts";

describe("AppError", () => {
	it("should set statusCode and message", () => {
		const err = new AppError(404, "Not found");
		expect(err.statusCode).toBe(404);
		expect(err.message).toBe("Not found");
	});

	it("should set name to ApiError", () => {
		const err = new AppError(500, "Error");
		expect(err.name).toBe("ApiError");
	});

	it("should set timestamp as ISO string", () => {
		const before = new Date().toISOString();
		const err = new AppError(400, "Bad request");
		const after = new Date().toISOString();
		expect(err.timestamp >= before).toBe(true);
		expect(err.timestamp <= after).toBe(true);
	});

	it("should be instance of Error", () => {
		const err = new AppError(500, "Error");
		expect(err).toBeInstanceOf(Error);
	});
});
