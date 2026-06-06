import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const gameId = url.searchParams.get("id");

    if (!gameId) {
      return NextResponse.json(
        { error: "Missing game id" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.rawg.io/api/games/${gameId}/screenshots?key=${process.env.RAWG_API_KEY}`,
      { cache: "no-store" }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch screenshots" },
      { status: 500 }
    );
  }
}