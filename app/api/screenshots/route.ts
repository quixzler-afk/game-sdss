import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: any
) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing id" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RAWG_API_KEY;

  const response = await fetch(
    `https://api.rawg.io/api/games/${id}/screenshots?key=${apiKey}`,
    { cache: "no-store" }
  );

  const data = await response.json();

  return NextResponse.json(data);
}