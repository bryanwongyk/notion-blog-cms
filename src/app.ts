import axios from "axios"
import * as dotenv from "dotenv"
import express from "express"
import knex from "knex"

import { Client } from "@notionhq/client"
import { getDatabase } from "@notionhq/client/build/src/api-endpoints"
import * as Sentry from "@sentry/node"
import * as Tracing from "@sentry/tracing"

import knexConfig from "../database/knexfile"
import AccountsRepositoryImpl from "./repository/AccountsRepositoryImpl"
import AuthorizationsRepositoryImpl from "./repository/AuthorizationsRepositoryImpl"
import NotionRepositoryImpl from "./repository/NotionRepositoryImpl"
import logger from "./utils/logger"
import logJson from "./utils/logJson"

// Set up application
dotenv.config();
const app = express();
const port = 3000;

// Set up Sentry (performance monitoring)
process.env.NODE_ENV === "production" &&
  Sentry.init({
    dsn: "https://4eb19615c4ae46bb9ddffe994e487054@o4504661408022528.ingest.sentry.io/4504661415690240",
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value to something lower in production (e.g. 0.2) as you only want to measure performance inproduction.
    tracesSampleRate: 1.0,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({
        // to trace all requests to the default router
        app,
        // alternatively, you can specify the routes you want to trace:
        // router: someRouter,
      }),
    ],
    environment: process.env.NODE_ENV,
  });

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());

// Set up knex
const knexTemplate =
  process.env.NODE_ENV == "development" && knex(knexConfig.development);
const accountsRepository = new AccountsRepositoryImpl(knexTemplate);
const authorizationsRepository = new AuthorizationsRepositoryImpl(knexTemplate);
let notionRepository: NotionRepositoryImpl | undefined;

// Set up requests
const keySecret = `${process.env.OAUTH_CLIENT_ID}:${process.env.OAUTH_CLIENT_SECRET}`;
const encodedKeySecret = Buffer.from(keySecret, "utf8").toString("base64");
const databaseId = "97980d26d14f4bbcb1dd280f62463872"; // In future, fetch from the user

// API
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/get-content", async (req, res) => {
  res.send("Hello Dashboard!");

  // Query for database
  const database = notionRepository.getNotionDatabase(databaseId);

  // Query for page
  logger.info(database);

  // Query for blocks
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.get("/notion/auth", async (req, res) => {
  const authCode = req.query.code as string;
  const auth = await authNotion(authCode);
  const accessToken = auth.data.access_token;
  const workspaceId = auth.data.workspace_id;
  const botId = auth.data.bot_id;
  const userId = auth.data.owner.user.id;
  const userName = auth.data.owner.user.name;

  // Insert user's access token into database so it can be reused in future
  knexTemplate.transaction(() => {
    accountsRepository.upsertAccount(userId, userName);
    authorizationsRepository.upsertAuthorization(
      userId,
      workspaceId,
      accessToken,
      botId
    );
  });

  // Instantiate Notion client with access token
  notionRepository = new NotionRepositoryImpl(accessToken);

  return res.redirect("/get-content");
});

const authNotion = async (authCode: string) => {
  try {
    console.log(`Authenticating Notion with authCode: ${authCode}`);
    const authorizationOptions = {
      method: "POST",
      url: "https://api.notion.com/v1/oauth/token",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Basic ${encodedKeySecret}`,
      },
      data: {
        code: authCode,
        redirect_uri: "http://localhost:3000/notion/auth",
        grant_type: "authorization_code",
      },
    };
    const auth = await axios.request(authorizationOptions);
    logger.info(`Authenticated Notion with authCode: ${authCode}`);
    return auth;
  } catch (err) {
    logger.error(err);
    Sentry.captureException(err);
  }
};

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
