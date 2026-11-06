import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";

// NOTE: no import.meta.url here: Netlify bundles functions to CommonJS, where it is undefined.
// cwd is Website/ for `npm start` and `netlify dev`; LAMBDA_TASK_ROOT is used when deployed.
const candidates = [
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
