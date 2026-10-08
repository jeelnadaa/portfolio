import { NextResponse } from "next/server";
import { getGithubData } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getGithubData({ forceFresh: true });
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("Failed to fetch fresh GitHub telemetry:", err);
    return NextResponse.json(
      { error: "Failed to fetch GitHub telemetry data" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
