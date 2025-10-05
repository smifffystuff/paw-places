import { NextResponse } from "next/server";
import { createPlace, listPlaces } from "@/lib/my-places";

export async function GET() {
  try {
    const places = await listPlaces();
    return NextResponse.json({ data: places });
  } catch (error) {
    console.error("Failed to list places", error);
    return NextResponse.json(
      { error: "Unable to fetch saved places" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload || typeof payload.name !== "string" || !payload.name.trim()) {
      return NextResponse.json(
        { error: "Place name is required" },
        { status: 400 }
      );
    }

    const place = await createPlace({
      name: payload.name,
      notes: typeof payload.notes === "string" ? payload.notes : undefined,
      tags: typeof payload.tags === "string" ? payload.tags : undefined,
    });

    return NextResponse.json({ data: place }, { status: 201 });
  } catch (error) {
    console.error("Failed to create place", error);
    return NextResponse.json(
      { error: "Unable to save place" },
      { status: 500 }
    );
  }
}
