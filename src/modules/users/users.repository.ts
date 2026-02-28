import { eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { NewUser, users } from "../../db/schema/users.ts";

export async function findUserByEmail(email: string) {
    return db.select().from(users).where(eq(users.email, email)).limit(1).then((r) => r[0] ?? null);
}

export async function findUserById(id: string) {
    return db.select().from(users).where(eq(users.id, id)).limit(1).then((r) => r[0] ?? null);
}

export async function createUser(data: NewUser) {
    return db.insert(users).values(data).returning().then((r) => r[0]);
}
