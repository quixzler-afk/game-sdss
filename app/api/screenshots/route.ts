import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const response = await fetch(
    `https://api.rawg.io/api/games/${params.id}/screenshots?key=${process.env.RAWG_API_KEY}`
  );

  const data = await response.json();

  return NextResponse.json(data);
}