import serverless from "serverless-http";
import app from "../../routes/app.js";

const PREFIX = "/.netlify/functions/api";
const inner = serverless(app);

// Normalise the path so Express always sees /api/...
export const handler = (event, context) => {
  if (event.path?.startsWith(PREFIX)) event.path = event.path.slice(PREFIX.length) || "/";
  return inner(event, context);
};
