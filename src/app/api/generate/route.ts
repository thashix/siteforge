import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// POST /api/generate — Gemini Flash Site Generation
// =============================================================================
// Uses Google Gemini Flash for site generation:
//   - 10x cheaper than Claude
//   - Much higher rate limits
//   - 1M token context window
//   - Fast generation
// =============================================================================

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function POST(request: NextRequest) {
  try {
    const { description, businessName } = await request.json();

    if (!description || description.length < 10) {
      return NextResponse.json({ success: false, error: "Description trop courte" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Gemini API key not configured" }, { status: 500 });
    }

    // Design variety seed
    const seeds = [
      "asymmetric layout with overlapping elements and bold typography",
      "cinematic hero with parallax feel and dramatic lighting",
      "split-screen hero with image right and elegant transitions",
      "editorial magazine style with large whitespace",
      "geometric shapes with strong contrast and angular design",
      "organic curves with soft gradients and warm tones",
      "luxury minimal with massive typography and thin lines",
      "dark immersive with full-bleed images and neon accents",
    ];
    const seed = seeds[Math.floor(Math.random() * seeds.length)];

    const prompt = buildPrompt(businessName || "Mon Entreprise", description, seed);

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 20000,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[Generate] Gemini error:", response.status, err);
      return NextResponse.json({ success: false, error: `Erreur Gemini: ${response.status}` }, { status: 422 });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("[Generate] No text in Gemini response:", JSON.stringify(data).slice(0, 500));
      return NextResponse.json({ success: false, error: "Pas de réponse de Gemini" }, { status: 422 });
    }

    const html = extractHtml(text);
    if (!html) {
      console.error("[Generate] Failed to extract HTML, response starts with:", text.slice(0, 200));
      return NextResponse.json({ success: false, error: "HTML invalide" }, { status: 422 });
    }

    return NextResponse.json({ success: true, html, title: businessName || "Mon Site" });

  } catch (err) {
    console.error("[Generate] Error:", err);
    return NextResponse.json({ success: false, error: "Erreur interne" }, { status: 500 });
  }
}

// =============================================================================
// PROMPT
// =============================================================================

function buildPrompt(businessName: string, description: string, seed: string): string {
  return `You are an elite web designer. Generate a COMPLETE, STANDALONE, PREMIUM HTML file for a website.

BUSINESS: ${businessName}
BRIEF: ${description}
DESIGN DIRECTION: ${seed}

## RULES
- Output ONLY the HTML. Start with <!DOCTYPE html>, end with </html>
- No markdown, no backticks, no explanation. JUST THE HTML CODE.
- The website must look like it was designed by a top agency charging €10,000+

## STRUCTURE
Generate a ONE-PAGE website with these scroll sections (choose 8-10 that fit the business):

REQUIRED:
- Navigation: sticky, backdrop-blur, logo + anchor links + CTA button. On mobile: hamburger menu.
- Hero: FULL SCREEN with background image (Unsplash), DARK OVERLAY (rgba(0,0,0,0.5)), LARGE WHITE headline (4-5rem), subtitle, CTA button. The text MUST be visible over the image.
- Footer: 3-4 columns (brand+tagline+socials, navigation links, services, contact info), copyright bar

CHOOSE 5-7 based on the business:
- Services/Offerings (cards with icons, hover effects)
- About/Story (split: image left + text right, or full-width)
- Gallery/Portfolio (image grid with hover zoom + caption overlay)
- Testimonials (quote cards with avatar, name, role)
- Pricing/Menu (3 columns, middle highlighted, or menu items for restaurants)
- FAQ (accordion with open/close animation)
- Contact (form with mailto: + contact info with icons)
- CTA Banner (full-width accent color, headline + button)
- Stats/Numbers (big counter numbers with labels)
- Team (grid with photos and roles)
- Process/How it works (numbered steps)

IMPORTANT: Choose sections that FIT the business. A restaurant needs a Menu section, not Pricing. A photographer needs a big Gallery. A coach needs a Process section.

## IMAGES — Use Unsplash
https://images.unsplash.com/photo-{ID}?w={W}&h={H}&fit=crop&q=80

IDs by sector (use relevant ones):
- Food: 1517248135467-4c7edcad34c4, 1414235077428-338989a2e8c0, 1504674900247-0877df9cc836, 1555396273-367ea4eb4db5, 1466978913421-dad2ebd01d17, 1528605248644-14dd04022da1
- Beauty: 1560066984-138dadb4c035, 1522337360788-8b13dee7a37e, 1487412947147-5cebf100ffc2, 1516975080664-ed2fc6a32937
- Tech/Agency: 1497366216548-37526070297c, 1460925895917-afdab827c52f, 1551434678-e076c223a692, 1498050108023-c5249f4df085
- Photo: 1606993907291-d86efa9b94db, 1554048612-b6a83d2ed2c4, 1542038784456-1ea8e935640e, 1493863641943-9b68992a8d07
- Fashion: 1441986300917-64674bd600d8, 1558171813-4c2ab4e38ee0, 1490481651871-ab68de25d43d, 1515886657613-9f3515b0c78f
- Fitness: 1534438327276-14e5300c3a48, 1571019613454-1cb2f99b2d8b, 1517836357463-d25dfeac3438
- Real Estate: 1512917774080-9991f1c4c750, 1502672260266-1c1ef2d93688, 1600596542815-ffad4c1539a9
- General: 1486406146926-c627a92ad1ab, 1497366811353-6870744d04b2, 1553877522-43269d4ea984

## DESIGN
- Google Fonts: 2 fonts (serif/display for headings + sans for body)
- CSS custom properties in :root for colors
- Alternate light/dark backgrounds between sections
- Generous padding: 80-120px per section
- Hover effects on ALL cards, buttons, links (transform, shadow, color)
- IntersectionObserver scroll-reveal animations (fade-up with stagger)
- Mobile responsive with hamburger menu
- Form uses mailto: for submission
- Add data-editable="text" on text elements, data-editable="image" on images

COLOR SCHEMES (pick based on brief):
- Dark/luxury: --bg: #0D0D0D, --accent: #C8A45C
- Modern/tech: --bg: #0F172A or #FFF, --accent: #6366F1
- Warm/organic: --bg: #FDFAF5, --accent: #B5754E
- Clean/medical: --bg: #FFF, --accent: #2563EB
- Creative: --bg: #18181B, --accent: #E24B4A
- Feminine: --bg: #FFF5F5, --accent: #D4748E

FONTS (pick based on tone):
- Luxury: Playfair Display + Lato
- Modern: Space Grotesk + DM Sans
- Sophisticated: Cormorant Garamond + Montserrat
- Friendly: Sora + Inter

## CRITICAL CHECKLIST
- Hero has dark overlay + visible white text + CTA button
- ALL text is readable (proper contrast everywhere)
- NO placeholder text, NO Lorem ipsum
- Content is SPECIFIC to this business
- Write in the same language as the brief
- Images are real Unsplash URLs that work
- Mobile hamburger menu works with JavaScript
- Scroll reveal animations work
- Footer has social icons (SVG)

Generate the complete HTML now. Start with <!DOCTYPE html>:`;
}

// =============================================================================
// HTML EXTRACTION
// =============================================================================

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
