import type { Db, Document } from "mongodb";
import { MongoClient, MongoClientOptions, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Set it in your environment to connect to MongoDB."
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

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
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise as Promise<MongoClient>;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDatabase<TSchema = Document>(
  dbName: string
): Promise<Db<TSchema>> {
  const mongoClient = await getMongoClient();
  return mongoClient.db<TSchema>(dbName);
}

export default clientPromise;
