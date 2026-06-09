import { NextResponse } from "next/server";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "Missing id",
        },
        {
          status: 400,
        }
      );
    }

    const apiKey =
      process.env.RAWG_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "RAWG_API_KEY not found",
        },
        {
          status: 500,
        }
      );
    }

    const response = await fetch(
      `https://api.rawg.io/api/games/${id}/screenshots?key=${apiKey}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Failed to fetch screenshots",
        },
        {
          status: response.status,
        }
      );
    }

    const data =
      await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "SCREENSHOTS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}