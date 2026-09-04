import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Missing required environment variable: "MONGODB_URI"');
}

const options = {};

// Reuse the client across hot reloads in development and across invocations
// in production so we don't open a new connection pool on every request.
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

const client = globalForMongo._mongoClientPromise
  ? undefined
  : new MongoClient(uri, options);

export const clientPromise: Promise<MongoClient> =
  globalForMongo._mongoClientPromise ??
  (globalForMongo._mongoClientPromise = client!.connect());

export async function getDb() {
  const client = await clientPromise;
  return client.db();
}
