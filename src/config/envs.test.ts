import { describe, expect, it } from "vitest";

describe("envs", () => {
	it("should load required env vars from process.env", async () => {
		const { envs } = await import("./envs.ts");
		expect(envs.db.url).toBe(process.env.DB_URL);
		expect(envs.jwt.secret).toBe(process.env.JWT_SECRET);
	});

	it("should throw if a required env var is missing", async () => {
		vi.resetModules();
		const original = process.env.DB_URL;
		delete process.env.DB_URL;

		await expect(import("./envs.ts")).rejects.toThrow("DB_URL");

		process.env.DB_URL = original;
		vi.resetModules();
	});
});

import { vi } from "vitest";
