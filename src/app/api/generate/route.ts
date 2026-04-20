import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// POST /api/generate — Lightweight Single-Page Generation
// =============================================================================
// Optimized for Anthropic Tier 1 (8K output tokens/min):
//   - Single page (not multi-page)
//   - 7K max tokens
//   - Web search optional with fast timeout
//   - Retry on 429
// =============================================================================

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

export async function POST(request: NextRequest) {
  try {
    const { description, businessName } = await request.json();

    if (!description || description.length < 10) {
      return NextResponse.json({ success: false, error: "Description trop courte" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "AI service not configured" }, { status: 500 });
    }

    // Design variety
    const seeds = [
      "asymmetric layout with overlapping elements",
      "cinematic hero with parallax feel",
      "split-screen hero with image right",
      "editorial style with large typography",
      "geometric shapes with strong contrast",
      "organic curves and soft gradients",
      "luxury minimal with massive whitespace",
      "dark immersive with light text",
    ];
    const seed = seeds[Math.floor(Math.random() * seeds.length)];

    const response = await fetchWithRetry(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 7000,
        temperature: 0.8,
        system: SYSTEM_PROMPT,
        messages: [{
          role: "user",
          content: `Business: ${businessName || "Mon Entreprise"}
Brief: ${description}
Design direction: ${seed}

Generate the complete HTML now. Start with <!DOCTYPE html>:`,
        }],
      }),
    });

    if (!response) {
      return NextResponse.json({ success: false, error: "API non disponible, réessayez dans 1 minute" }, { status: 429 });
    }

    if (!response.ok) {
      const err = await response.text();
      console.error("[Generate] Error:", response.status, err);
      return NextResponse.json({ success: false, error: `Erreur: ${response.status}` }, { status: 422 });
    }

    const data = await response.json();
    const text = data.content?.find((b: { type: string }) => b.type === "text")?.text;
    if (!text) {
      return NextResponse.json({ success: false, error: "Pas de réponse" }, { status: 422 });
    }

    const html = extractHtml(text);
    if (!html) {
      return NextResponse.json({ success: false, error: "HTML invalide" }, { status: 422 });
    }

    return NextResponse.json({ success: true, html, title: businessName || "Mon Site" });

  } catch (err) {
    console.error("[Generate] Error:", err);
    return NextResponse.json({ success: false, error: "Erreur interne" }, { status: 500 });
  }
}

// =============================================================================
// SYSTEM PROMPT — Compact, single-page, <7K tokens output
// =============================================================================

const SYSTEM_PROMPT = `You are an elite web designer. Generate a COMPLETE standalone HTML file for a premium one-page website.

OUTPUT: Only HTML. Start with <!DOCTYPE html>, end with </html>. No markdown, no backticks, no explanation.

STRUCTURE (one page, scroll sections):
1. Nav — sticky, backdrop-blur, logo + anchor links + CTA button
2. Hero — MUST have: fullscreen background image with dark overlay (rgba(0,0,0,0.5)), large white headline (4-5rem), subtitle, CTA button
3. 4-6 more sections chosen from: Services, About, Gallery, Testimonials, Pricing/Menu, FAQ, Stats, CTA Banner, Contact
4. Footer — columns with brand, links, social icons, copyright

Choose sections that fit the business. A restaurant needs a Menu, not Pricing. A photographer needs Gallery, not FAQ.

IMAGES — Use Unsplash:
https://images.unsplash.com/photo-{ID}?w={W}&h={H}&fit=crop&q=80

IDs by sector:
- Food: 1517248135467-4c7edcad34c4, 1414235077428-338989a2e8c0, 1504674900247-0877df9cc836, 1555396273-367ea4eb4db5, 1466978913421-dad2ebd01d17
- Beauty: 1560066984-138dadb4c035, 1522337360788-8b13dee7a37e, 1487412947147-5cebf100ffc2, 1516975080664-ed2fc6a32937
- Tech: 1497366216548-37526070297c, 1460925895917-afdab827c52f, 1551434678-e076c223a692, 1498050108023-c5249f4df085
- Photo: 1606993907291-d86efa9b94db, 1554048612-b6a83d2ed2c4, 1542038784456-1ea8e935640e, 1493863641943-9b68992a8d07
- Fashion: 1441986300917-64674bd600d8, 1558171813-4c2ab4e38ee0, 1490481651871-ab68de25d43d, 1515886657613-9f3515b0c78f
- Fitness: 1534438327276-14e5300c3a48, 1571019613454-1cb2f99b2d8b, 1517836357463-d25dfeac3438
- Real Estate: 1512917774080-9991f1c4c750, 1502672260266-1c1ef2d93688, 1600596542815-ffad4c1539a9
- General: 1486406146926-c627a92ad1ab, 1497366811353-6870744d04b2, 1553877522-43269d4ea984

DESIGN RULES:
- Google Fonts: 2 fonts (serif/display headings + sans body)
- CSS custom properties for colors
- Alternate light/dark section backgrounds
- Generous padding: 80-120px per section
- Hover effects on all cards, buttons, links
- IntersectionObserver scroll reveal animations
- Mobile responsive with hamburger menu
- Form uses mailto: for submission
- Add data-editable="text" on text elements, data-editable="image" on images

COLOR SCHEMES (pick based on brief):
- Dark/luxury: bg #0D0D0D, accent #C8A45C
- Modern/tech: bg #0F172A or #FFF, accent #6366F1
- Warm/organic: bg #FDFAF5, accent #B5754E
- Clean/medical: bg #FFF, accent #2563EB
- Creative: bg #18181B, accent #E24B4A
- Feminine: bg #FFF5F5, accent #D4748E

FONTS (pick based on tone):
- Luxury: Playfair Display + Lato
- Modern: Space Grotesk + DM Sans
- Sophisticated: Cormorant Garamond + Montserrat
- Friendly: Sora + Inter
- Creative: DM Serif Display + Plus Jakarta Sans

CRITICAL:
- Hero MUST have visible text (white/light) OVER the dark overlay
- ALL text must be readable (proper contrast)
- NO empty sections, NO placeholder text
- Content must be SPECIFIC to the business (use their name, services, location)
- Write in the same language as the brief
- Keep total HTML under 6000 tokens — be concise in CSS, avoid redundancy`;

// =============================================================================

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response | null> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      const wait = (i + 1) * 8000;
      console.log(`[Generate] Rate limit, waiting ${wait}ms (${i + 1}/${retries})`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    return res;
  }
  return null;
}

function extractHtml(text: string): string | null {
  const t = text.trim();
  if (t.startsWith("<!DOCTYPE") || t.startsWith("<!doctype") || t.startsWith("<html")) return t;
  const m = t.match(/```(?:html)?\s*\n?([\s\S]*?)\n?```/);
  if (m) return m[1].trim();
  const s = Math.max(t.indexOf("<!DOCTYPE"), t.indexOf("<!doctype"), t.indexOf("<html"));
  if (s !== -1) {
    const e = t.lastIndexOf("</html>");
    return e !== -1 ? t.slice(s, e + 7) : t.slice(s);
  }
  return null;
}
