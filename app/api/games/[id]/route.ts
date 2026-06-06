import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const apiKey = process.env.RAWG_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "RAWG API KEY not found" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.rawg.io/api/games/${id}?key=${apiKey}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch game detail" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Game detail error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}