import { NextResponse } from "next/server";
import { deletePlace, updatePlace, type PlaceUpdate } from "@/lib/my-places";

function invalidIdResponse() {
  return NextResponse.json(
    { error: "Invalid place identifier" },
    { status: 400 }
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return invalidIdResponse();
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    console.error("Failed to parse update payload", error);
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json(
      { error: "Update payload must be an object" },
      { status: 400 }
    );
  }

  const updates = payload as Record<string, unknown>;
  const filteredUpdates: PlaceUpdate = {};

  for (const [key, value] of Object.entries(updates)) {
    if (key === "visited") {
      filteredUpdates.visited = Boolean(value);
    } else if (key === "name" && typeof value === "string") {
      filteredUpdates.name = value;
    } else if (key === "notes" && typeof value === "string") {
      filteredUpdates.notes = value;
    } else if (key === "tags" && typeof value === "string") {
      filteredUpdates.tags = value;
    }
  }

  if (Object.keys(filteredUpdates).length === 0) {
    return NextResponse.json(
      { error: "No valid updates provided" },
      { status: 400 }
    );
  }

  try {
    const place = await updatePlace(id, filteredUpdates);

    if (!place) {
      return NextResponse.json(
        { error: "Place not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: place });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_ID") {
      return invalidIdResponse();
    }

    console.error("Failed to update place", error);
    return NextResponse.json(
      { error: "Unable to update place" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return invalidIdResponse();
  }

  try {
    const deleted = await deletePlace(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Place not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: { id } });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_ID") {
      return invalidIdResponse();
    }

    console.error("Failed to delete place", error);
    return NextResponse.json(
      { error: "Unable to delete place" },
      { status: 500 }
    );
  }
}
