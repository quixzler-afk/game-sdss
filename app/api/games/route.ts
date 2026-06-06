import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
) {
  const searchParams =
    request.nextUrl.searchParams;

  const page =
    searchParams.get("page") || "1";

  const search =
    searchParams.get("search") || "";

  const genre =
    searchParams.get("genre") || "";

  const platform =
    searchParams.get("platform") || "";

  let url =
    `https://api.rawg.io/api/games` +
    `?key=${process.env.RAWG_API_KEY}` +
    `&page=${page}` +
    `&page_size=24`;

  if (search) {
    url += `&search=${encodeURIComponent(
      search
    )}`;
  }

  if (genre) {
    url += `&genres=${genre}`;
  }

  if (platform) {
    url += `&platforms=${platform}`;
  }

  const response =
    await fetch(url, {
      cache: "no-store",
    });

  if (!response.ok) {
    return NextResponse.json(
      {
        error:
          "Failed to fetch games",
      },
      {
        status:
          response.status,
      }
    );
  }

  const data =
    await response.json();

  return NextResponse.json(
    data
  );
}