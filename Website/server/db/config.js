import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
// Local: next to this file. Netlify: included_files keeps the repo-relative path under cwd / LAMBDA_TASK_ROOT.
const candidates = [
  path.resolve(here, "eco_env.sqlite"),
  path.resolve(process.cwd(), "server/db/eco_env.sqlite"),
  path.resolve(process.env.LAMBDA_TASK_ROOT || "", "server/db/eco_env.sqlite"),
  path.resolve(process.env.LAMBDA_TASK_ROOT || "", "Website/server/db/eco_env.sqlite"),
];

let dbPromise;
function getDb() {
  if (!dbPromise) {
    const filename = candidates.find((p) => fs.existsSync(p));
    if (!filename) throw new Error("eco_env.sqlite not found. Tried: " + candidates.join(", "));
    dbPromise = open({ filename, driver: sqlite3.Database, mode: sqlite3.OPEN_READONLY });
  }
  return dbPromise;
}

// Same interface the routes already use: db.all / db.get
export const db = {
  all: async (...a) => (await getDb()).all(...a),
  get: async (...a) => (await getDb()).get(...a),
};
