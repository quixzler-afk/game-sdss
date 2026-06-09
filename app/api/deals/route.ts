import { NextResponse } from "next/server";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const title =
      searchParams.get("title");

    if (!title) {
      return NextResponse.json([]);
    }

    const response = await fetch(
      `https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(
        title
      )}&limit=10`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json([]);
    }

    const data =
      await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json([]);
  }
}