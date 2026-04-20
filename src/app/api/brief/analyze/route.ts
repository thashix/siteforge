import { NextRequest, NextResponse } from "next/server";
import { userBriefSchema } from "@/core/brief/schemas";
import { analyzeBrief } from "@/lib/ai";

// =============================================================================
// POST /api/brief/analyze
// =============================================================================
// Receives a UserBrief, sends it to Claude for analysis,
// returns a validated SiteBrief JSON.
//
// Request body: { description: string, businessName?: string, ... }
// Response: { success: true, data: SiteBrief } | { success: false, error: string }
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate input
    const validation = userBriefSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // 2. Call AI analyzer
    const result = await analyzeBrief(validation.data);

    // 3. Return result
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 422 });
    }
  } catch (err) {
    console.error("[API] /brief/analyze error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
