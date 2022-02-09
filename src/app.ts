import * as dotenv from 'dotenv';
dotenv.config();

import express, { urlencoded } from 'express';
import cors from 'cors';
import { createTerminus } from '@godaddy/terminus';
import { MongoClient } from 'mongodb';
import http from 'http';

import getRoutes from "./getRoutes";
import postRoutes from './postRoutes';

const app = express();
const port = 3000;

const username = encodeURIComponent(process.env.username as string);
const password = encodeURIComponent(process.env.password as string);
const host = encodeURIComponent(process.env.host as string);

const mongoUrl = `mongodb://${username}:${password}@${host}:27017/?authMechanism=DEFAULT`;
const client: MongoClient = new MongoClient(mongoUrl);

app.use(cors({origin: "*"}));
app.use(express.json());
app.use("/", getRoutes);
app.use("/", postRoutes);

async function healthCheck(): Promise<void> {
  return Promise.resolve();
}

async function signalHandler(): Promise<void> {
  console.log("Server is shutting down.");
  app.locals.db.close();
}

const server = http.createServer(app);

createTerminus(server, {
  signal: "SIGINT",
  healthChecks: {
    "/healthcheck": healthCheck,
  },
  onSignal: signalHandler
});

client.connect((err, db) => {
  if (err) {
    console.error(err);
  }
  
  app.locals.db = db;
  
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
});