import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { envs } from "../config/envs.ts";
import * as schema from "./schema/users.ts";

const client = postgres(envs.db.url);

export const db = drizzle(client, { schema });
