import express, { urlencoded } from 'express';
import { createTerminus } from '@godaddy/terminus';
import { MongoClient } from 'mongodb';
import http from 'http';
import routes from "./routes";
import * as dotenv from 'dotenv';

const app = express();
const port = 3000;

app.use(express.json());

dotenv.config();

const username = encodeURIComponent(process.env.username as string);
const password = encodeURIComponent(process.env.password as string);

const mongoUrl = `mongodb://${username}:${password}@localhost:27017/?authMechanism=DEFAULT`;
const client: MongoClient = new MongoClient(mongoUrl);

app.get("/recipes", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("munchy");
    const recipes = database.collection("recipes");

    const findResult = await recipes.find({}).toArray();

    console.log(findResult);
    res.send(findResult);
  } catch {
    res.send("Error with mongo");
  } finally {
    await client.close();
  }
});

async function healthCheck(): Promise<void> {
  return Promise.resolve();
}

async function signalHandler(): Promise<void> {
  console.log("Server is shutting down.");
}

const server = http.createServer(app);
createTerminus(server, {
  signal: "SIGINT",
  healthChecks: {
    "/healthcheck": healthCheck,
  },
  onSignal: signalHandler
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});