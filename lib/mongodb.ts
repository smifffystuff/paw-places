import type { Db } from "mongodb";
import { MongoClient, MongoClientOptions, ServerApiVersion } from "mongodb";

let clientPromise: Promise<MongoClient> | undefined;

const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  clientPromise = global._mongoClientPromise;

  if (!clientPromise && process.env.MONGODB_URI) {
    const client = new MongoClient(process.env.MONGODB_URI, options);
    clientPromise = client.connect();
    global._mongoClientPromise = clientPromise;
  }
} else if (process.env.MONGODB_URI) {
  const client = new MongoClient(process.env.MONGODB_URI, options);
  clientPromise = client.connect();
}

function ensureClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI environment variable. Set it in your environment to connect to MongoDB."
    );
  }

  if (!clientPromise) {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
  return ensureClientPromise();
}

export async function getDatabase(
  dbName: string
): Promise<Db> {
  const mongoClient = await ensureClientPromise();
  return mongoClient.db(dbName);
}

export default clientPromise;
