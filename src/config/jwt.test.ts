import { describe, expect, it } from "vitest";
import { signToken, verifyToken } from "./jwt.ts";

describe("signToken", () => {
	it("should return a JWT string with 3 parts", () => {
		const token = signToken({ sub: "user-123" });
		expect(typeof token).toBe("string");
		expect(token.split(".")).toHaveLength(3);
	});
});

describe("verifyToken", () => {
	it("should return payload with sub", () => {
		const token = signToken({ sub: "user-123" });
		const payload = verifyToken(token);
		expect(payload.sub).toBe("user-123");
	});

	it("should throw on invalid token", () => {
		expect(() => verifyToken("invalid.token.here")).toThrow();
	});

	it("should throw on tampered token", () => {
		const token = signToken({ sub: "user-123" });
		expect(() => verifyToken(`${token}tampered`)).toThrow();
	});
});
