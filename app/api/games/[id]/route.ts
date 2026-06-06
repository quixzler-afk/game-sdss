import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: any
) {
  const id = context?.params?.id;

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
    { cache: "no-store" }
  );

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}