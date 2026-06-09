import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RAWG_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "RAWG API KEY not found" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.rawg.io/api/games/${id}?key=${apiKey}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("RAWG DETAIL ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch game detail",
      },
      {
        status: 500,
      }
    );
  }
}