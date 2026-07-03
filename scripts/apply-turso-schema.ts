import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("TURSO_DATABASE_URL is not set.");
  process.exit(1);
}

const client = createClient({ url, authToken });
const sql = readFileSync("turso-init.sql", "utf-8");

const statements = sql
  .split(";")
  .map((chunk) =>
    chunk
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .trim()
      // Idempotent, so a retry after a partial run (e.g. network reset)
      // doesn't fail on objects created in the previous attempt.
      .replace(/^CREATE TABLE "/, 'CREATE TABLE IF NOT EXISTS "')
      .replace(/^CREATE UNIQUE INDEX "/, 'CREATE UNIQUE INDEX IF NOT EXISTS "')
  )
  .filter((s) => s.length > 0);

async function main() {
  for (const statement of statements) {
    console.log(statement.split("\n")[0].slice(0, 60) + "...");
    await client.execute(statement);
  }
  console.log(`Applied ${statements.length} statements to Turso.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
