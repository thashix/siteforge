import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// POST /api/section/modify
// =============================================================================
// Receives: { instruction, section, context }
// Calls Claude to modify the section content based on the user's instruction.
// Returns: { success, data (updated content), message }
// =============================================================================

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

export async function POST(request: NextRequest) {
  try {
    const { instruction, section, context } = await request.json();

    if (!instruction || !section) {
      return NextResponse.json(
        { success: false, error: "Instruction and section required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "AI service not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = buildModifyPrompt(section, context);

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          { role: "user", content: instruction },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[SectionModify] API error:", response.status, errorBody);
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: 422 }
      );
    }

    const data = await response.json();
    const textContent = data.content?.find(
      (block: { type: string }) => block.type === "text"
    );

    if (!textContent?.text) {
      return NextResponse.json(
        { success: false, error: "No response from AI" },
        { status: 422 }
      );
    }

    // Parse the JSON response
    const parsed = extractJson(textContent.text);
    if (!parsed) {
      return NextResponse.json(
        { success: false, error: "Failed to parse AI response" },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parsed,
      message: "Section modifiée avec succès",
    });
  } catch (err) {
    console.error("[SectionModify] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal error" },
      { status: 500 }
    );
  }
}

function buildModifyPrompt(
  section: { type: string; variant: string; content: Record<string, unknown> },
  context: { businessName?: string; sector?: string; tone?: string }
): string {
  return `You are the AI editor of SiteForge. Your job is to modify a website section's content based on the user's instruction.

## CONTEXT
- Business: ${context.businessName || "Unknown"}
- Sector: ${context.sector || "general"}
- Tone: ${context.tone || "professional"}
- Section type: ${section.type}
- Section variant: ${section.variant}

## CURRENT SECTION CONTENT
${JSON.stringify(section.content, null, 2)}

## RULES
1. Output ONLY valid JSON — the updated section content object.
2. Keep the same structure and "type" field as the current content.
3. Modify ONLY what the user asks. Keep everything else unchanged.
4. If the user asks to add items (services, testimonials, FAQ), add them to the existing array.
5. If the user asks to remove items, remove them from the array.
6. Write content in the SAME LANGUAGE as the existing content.
7. Make the content feel professional, authentic, and specific to the business.
8. No markdown, no backticks, no explanation — ONLY the JSON object.
9. The "type" field must remain "${section.type}".`;
}

function extractJson(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();
  try { return JSON.parse(trimmed); } catch {}
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) { try { return JSON.parse(fenceMatch[1].trim()); } catch {} }
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first !== -1 && last > first) { try { return JSON.parse(trimmed.slice(first, last + 1)); } catch {} }
  return null;
}
