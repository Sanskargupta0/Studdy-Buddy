import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_5PSAbl2WvYxZ@ep-tiny-bird-a1bnpzx8-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
});
