import {
  ObjectId,
  type Collection,
  type OptionalUnlessRequiredId,
  type WithId,
} from "mongodb";
import { getDatabase } from "./mongodb";

const DEFAULT_DB_NAME = "paw-places";
const COLLECTION_NAME = "my_places";

type PlaceSchema = {
  userId: string;
  name: string;
  notes: string;
  tags: string;
  visited: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PlaceDocument = WithId<PlaceSchema>;

export type PlaceInput = {
  name: string;
  notes?: string;
  tags?: string;
};

export type PlaceUpdate = {
  name?: string;
  notes?: string;
  tags?: string;
  visited?: boolean;
};

export type PlaceDto = {
  id: string;
  name: string;
  notes: string;
  tags: string;
  visited: boolean;
  createdAt: string;
  updatedAt: string;
};

async function getPlacesCollection(): Promise<Collection<PlaceSchema>> {
  const dbName = process.env.MONGODB_DB || DEFAULT_DB_NAME;
  const database = await getDatabase(dbName);
  return database.collection<PlaceSchema>(COLLECTION_NAME);
}

function normalizePlaceDocument(document: PlaceDocument): PlaceDto {
  return {
    id: document._id.toString(),
    name: document.name,
    notes: document.notes,
    tags: document.tags,
    visited: document.visited,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

export async function listPlaces(userId: string): Promise<PlaceDto[]> {
  const collection = await getPlacesCollection();
  const documents = await collection
    .find({ userId }, { sort: { createdAt: -1 } })
    .toArray();

  return documents.map(normalizePlaceDocument);
}

export async function createPlace(
  userId: string,
  input: PlaceInput
): Promise<PlaceDto> {
  const collection = await getPlacesCollection();
  const timestamp = new Date().toISOString();
  const document: OptionalUnlessRequiredId<PlaceSchema> = {
    userId,
    name: input.name,
    notes: input.notes?.trim() ?? "",
    tags: input.tags?.trim() ?? "",
    visited: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const result = await collection.insertOne(document);
  return normalizePlaceDocument({
    _id: result.insertedId,
    ...document,
  } as PlaceDocument);
}

export async function updatePlace(
  userId: string,
  id: string,
  updates: PlaceUpdate
): Promise<PlaceDto | null> {
  if (!ObjectId.isValid(id)) {
    throw new Error("INVALID_ID");
  }

  const collection = await getPlacesCollection();
  const timestamp = new Date().toISOString();
  const setUpdates: Partial<PlaceSchema> & { updatedAt: string } = {
    updatedAt: timestamp,
  };

  if (Object.prototype.hasOwnProperty.call(updates, "name")) {
    setUpdates.name = updates.name?.trim() ?? "";
  }

  if (Object.prototype.hasOwnProperty.call(updates, "notes")) {
    setUpdates.notes = updates.notes?.trim() ?? "";
  }

  if (Object.prototype.hasOwnProperty.call(updates, "tags")) {
    setUpdates.tags = updates.tags?.trim() ?? "";
  }

  if (Object.prototype.hasOwnProperty.call(updates, "visited")) {
    setUpdates.visited = updates.visited ?? false;
  }

  const updatedDocument = await collection.findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: setUpdates },
    { returnDocument: "after" }
  );

  if (!updatedDocument) {
    return null;
  }

  return normalizePlaceDocument(updatedDocument);
}

export async function deletePlace(userId: string, id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    throw new Error("INVALID_ID");
  }

  const collection = await getPlacesCollection();
  const result = await collection.deleteOne({
    _id: new ObjectId(id),
    userId,
  });
  return result.deletedCount === 1;
}

export { normalizePlaceDocument as mapPlaceDocumentToDto };
