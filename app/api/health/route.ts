import { NextResponse } from "next/server";

import { getMongoClient } from "@/lib/mongodb";

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { status: "error", message: "MongoDB connection not configured" },
      { status: 500 }
    );
  }

  try {
    const client = await getMongoClient();
    await client.db().command({ ping: 1 });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("MongoDB health check failed", error);

    return NextResponse.json(
      { status: "error", message: "Unable to connect to MongoDB" },
      { status: 500 }
    );
  }
}
