import { describe, expect, it, vi } from "vitest";
import { UsersRepository } from "./users.repository.ts";

vi.mock("drizzle-orm", () => ({
	eq: vi.fn(() => "eq-condition"),
}));

function makeMockDb(rows: unknown[] = []) {
	const chain = {
		from: vi.fn().mockReturnThis(),
		where: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnValue(Promise.resolve(rows)),
	};
	return {
		select: vi.fn(() => chain),
		insert: vi.fn(() => ({
			values: vi.fn().mockReturnThis(),
			returning: vi.fn().mockReturnValue(Promise.resolve(rows)),
		})),
		_chain: chain,
	};
}

const baseUser = {
	id: "user-123",
	name: "Test User",
	email: "test@test.com",
	password: "hashed",
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe("UsersRepository", () => {
	describe("findByEmail", () => {
		it("should return user when found", async () => {
			const db = makeMockDb([baseUser]);
			const repo = new UsersRepository(db as never);

			const result = await repo.findByEmail("test@test.com");

			expect(result).toEqual(baseUser);
			expect(db.select).toHaveBeenCalled();
		});

		it("should return null when not found", async () => {
			const db = makeMockDb([]);
			const repo = new UsersRepository(db as never);

			const result = await repo.findByEmail("notfound@test.com");

			expect(result).toBeNull();
		});
	});

	describe("findById", () => {
		it("should return user when found", async () => {
			const db = makeMockDb([baseUser]);
			const repo = new UsersRepository(db as never);

			const result = await repo.findById("user-123");

			expect(result).toEqual(baseUser);
		});

		it("should return null when not found", async () => {
			const db = makeMockDb([]);
			const repo = new UsersRepository(db as never);

			const result = await repo.findById("nonexistent");

			expect(result).toBeNull();
		});
	});

	describe("create", () => {
		it("should insert and return the created user", async () => {
			const db = makeMockDb([baseUser]);
			const repo = new UsersRepository(db as never);

			const result = await repo.create({
				name: "Test User",
				email: "test@test.com",
				password: "hashed",
			});

			expect(result).toEqual(baseUser);
			expect(db.insert).toHaveBeenCalled();
		});
	});
});
