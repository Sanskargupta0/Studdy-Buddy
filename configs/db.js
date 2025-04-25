import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING);
