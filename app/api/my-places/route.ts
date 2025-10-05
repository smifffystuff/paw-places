import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createPlace, listPlaces } from "@/lib/my-places";

function requireUser() {
  const { userId } = auth();

  if (!userId) {
    return {
      response: NextResponse.json(
        { error: "You must be signed in to manage saved places" },
        { status: 401 }
      ),
    } as const;
  }

  return { userId } as const;
}

export async function GET() {
  const result = requireUser();

  if ("response" in result) {
    return result.response;
  }

  try {
    const places = await listPlaces(result.userId);
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
  const result = requireUser();

  if ("response" in result) {
    return result.response;
  }

  try {
    const payload = await request.json();

    if (!payload || typeof payload.name !== "string" || !payload.name.trim()) {
      return NextResponse.json(
        { error: "Place name is required" },
        { status: 400 }
      );
    }

    const place = await createPlace(result.userId, {
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
