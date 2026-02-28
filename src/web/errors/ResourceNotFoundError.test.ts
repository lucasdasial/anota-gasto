import { describe, expect, it } from "vitest";
import { AppError } from "./AppError.ts";
import { ResourceNotFoundError } from "./ResourceNotFoundError.ts";

describe("ResourceNotFoundError", () => {
	it("should have statusCode 404", () => {
		const err = new ResourceNotFoundError("User");
		expect(err.statusCode).toBe(404);
	});

	it("should format message with resource name", () => {
		const err = new ResourceNotFoundError("User");
		expect(err.message).toBe("User not found");
	});

	it("should be instance of AppError", () => {
		const err = new ResourceNotFoundError("User");
		expect(err).toBeInstanceOf(AppError);
	});
});
