import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// POST /api/generate
// =============================================================================
// Approach A — AI generates complete HTML/CSS/JS website directly.
// Each generation is unique, premium, with real images from Unsplash.
//
// Input: { description, businessName }
// Output: { success, html, title }
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

    const systemPrompt = buildSystemPrompt();
    // Add design seed for variety
    const designSeeds = [
      "Use asymmetric layouts with off-grid elements",
      "Use a cinematic wide-screen hero with parallax feel",
      "Use a split-screen hero with image on the right",
      "Use a minimal hero with large typography and no image",
      "Use a video-style hero with dark overlay and centered text",
      "Use a magazine-editorial style with overlapping elements",
      "Use a bold geometric style with angular shapes",
      "Use an organic flowing style with curves and rounded shapes",
    ];
    const seed = designSeeds[Math.floor(Math.random() * designSeeds.length)];
    
    const userMessage = `Business name: ${businessName || "Mon Entreprise"}\n\nBrief:\n${description}\n\nDESIGN DIRECTION: ${seed}\n\nGenerate a UNIQUE website that stands out. Do NOT create a generic template.`;

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 16000,
        temperature: 0.9,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[Generate] API error:", response.status, err);
      return NextResponse.json({ success: false, error: `API error: ${response.status}` }, { status: 422 });
    }

    const data = await response.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
    if (!textBlock?.text) {
      return NextResponse.json({ success: false, error: "No response from AI" }, { status: 422 });
    }

    // Extract HTML from the response
    const html = extractHtml(textBlock.text);
    if (!html) {
      return NextResponse.json({ success: false, error: "Failed to extract HTML" }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      html,
      title: businessName || "Mon Site",
    });

  } catch (err) {
    console.error("[Generate] Error:", err);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

function buildSystemPrompt(): string {
  return `You are an elite web designer who creates stunning, premium, one-page websites. You generate COMPLETE, STANDALONE HTML files.

## YOUR OUTPUT
Output ONLY the complete HTML code. Start with <!DOCTYPE html> and end with </html>.
No explanation, no markdown, no backticks. JUST THE HTML.

## DESIGN REQUIREMENTS

### Visual Quality — PREMIUM LEVEL
- The site must look like it was designed by a top agency charging €10,000+
- Rich, immersive hero sections with full-screen backgrounds
- Generous spacing (sections: 100-140px padding)
- Sophisticated typography hierarchy
- Micro-interactions and hover effects on every interactive element
- Smooth scroll behavior
- Professional color harmony

### Images — USE UNSPLASH
- Use real images from Unsplash via: https://images.unsplash.com/photo-{id}?w={width}&h={height}&fit=crop&q=80
- Pick images that match the business sector
- Hero: full-screen background image with dark overlay
- Gallery: 6 real, relevant images
- About: team/workspace image
- Use different images, never repeat the same one

Here are Unsplash image IDs by sector (use these, they are real and working):

PHOTOGRAPHY/CREATIVE:
- 1606993907291-d86efa9b94db (dark studio)
- 1554048612-b6a83d2ed2c4 (camera closeup)
- 1542038784456-1ea8e935640e (portrait session)
- 1493863641943-9b68992a8d07 (gallery wall)
- 1507003211169-0a1dd7228f2d (portrait man)
- 1494790108377-be9c29b29330 (portrait woman)

BEAUTY/SALON:
- 1560066984-138dadb4c035 (salon interior)
- 1522337360788-8b13dee7a37e (hair styling)
- 1487412947147-5cebf100ffc2 (makeup)
- 1516975080664-ed2fc6a32937 (spa)
- 1507003211169-0a1dd7228f2d (face portrait)
- 1580618672591-3c4eb24e7c54 (beauty products)

RESTAURANT/FOOD:
- 1517248135467-4c7edcad34c4 (restaurant interior)
- 1414235077428-338989a2e8c0 (fine dining plate)
- 1504674900247-0877df9cc836 (food closeup)
- 1555396273-367ea4eb4db5 (chef cooking)
- 1466978913421-dad2ebd01d17 (wine glass)
- 1528605248644-14dd04022da1 (restaurant ambiance)

TECH/AGENCY:
- 1497366216548-37526070297c (modern office)
- 1460925895917-afdab827c52f (workspace)
- 1522071820038-ad15a96e97c3 (team meeting)
- 1551434678-e076c223a692 (coding screen)
- 1498050108023-c5249f4df085 (laptop code)
- 1504384308090-c894fdcc538d (tech workspace)

GENERAL/CORPORATE:
- 1486406146926-c627a92ad1ab (city skyline)
- 1497366811353-6870744d04b2 (office handshake)
- 1553877522-43269d4ea984 (meeting room)
- 1542744173-8e7e53415bb0 (professional team)
- 1497215728101-856f4ea42174 (modern building)
- 1519389950473-47ba0277781c (conference)

### Structure — MULTI-SECTION ONE-PAGE
Generate these sections in order:
1. **Navigation** — Sticky, transparent/blur on scroll, logo text + page anchor links + CTA button
2. **Hero** — Full-screen with background image, dark overlay (60-70% opacity), massive headline, subtitle, CTA button
3. **Services** — 3-6 service cards in a grid, icons/emoji, hover effects
4. **About** — Split layout: image + text with key highlights
5. **Gallery/Portfolio** — 6 images in a grid with hover zoom + overlay caption
6. **Testimonials** — 3-4 client quotes with avatar initials, names, roles
7. **Pricing** — 3 plans, middle one featured/highlighted
8. **FAQ** — 4-6 accordion items with open/close animation
9. **CTA Banner** — Full-width colored banner with headline + button
10. **Contact** — Split: contact info (email, phone, address with icons) + working form
11. **Footer** — 4 columns (brand+socials, navigation, services, contact) + copyright bar

### CSS — SOPHISTICATED
- Use CSS custom properties for the color scheme
- Google Fonts (load 2: one serif/display for headings, one sans for body)
- CSS animations: @keyframes for entrance, hover transitions
- IntersectionObserver for scroll reveal (fade-up with stagger)
- Responsive: mobile-first, hamburger menu on mobile
- Smooth scrolling: html { scroll-behavior: smooth }
- Box-shadows for depth on cards
- Backdrop-filter: blur for nav

### JavaScript — INTERACTIVE
- Scroll reveal animation (IntersectionObserver)
- Mobile hamburger menu toggle
- FAQ accordion (click to open/close)
- Smooth scroll to sections on nav click
- Form submission via mailto: link
- Navbar background change on scroll

### Typography Pairing — Pick ONE based on the tone:
- Luxurious/Elegant: Playfair Display + Lato
- Modern/Tech: Space Grotesk + DM Sans
- Sophisticated: Cormorant Garamond + Montserrat
- Friendly/Warm: Sora + Inter
- Creative/Bold: Clash Display + Cabinet Grotesk (use Sora + Inter as fallback from Google Fonts)
- Artistic: Fraunces + Outfit

### Color Scheme — Match the brief:
- If "noir/dark/sombre/luxe" → Dark background (#0D0D0D), gold accents (#C8A45C)
- If "modern/tech/agency" → Dark or white bg, purple/blue accents (#6366F1)
- If "warm/natural/organic" → Cream bg (#FDFAF5), sage green (#7C9A6E)
- If "clean/medical/pro" → White bg, blue accents (#2563EB)
- If "creative/bold" → Dark bg, vibrant accent (#E24B4A or #6366F1)
- Otherwise: choose what best fits the business

### Content — REALISTIC & SPECIFIC
- Write content that is SPECIFIC to this exact business, not generic
- Use the business name throughout
- Use the language of the brief (French if brief is in French)
- Testimonial names should feel real
- Pricing should have realistic amounts
- FAQ answers should be detailed (2-3 sentences)
- Contact info: use any details from the brief, or generate realistic ones

### Quality Checklist:
- [ ] Hero image is full-screen and relevant
- [ ] All sections have generous padding (80-120px)
- [ ] Typography is elegant and well-sized (hero: 4-6rem, section titles: 2.5-3rem)
- [ ] Hover effects on all cards, buttons, links
- [ ] Scroll animations on every section
- [ ] Mobile responsive
- [ ] Gallery has real Unsplash images
- [ ] Footer has 4 columns with social icons
- [ ] Color scheme matches the brief
- [ ] CTA buttons stand out visually
- [ ] No placeholder text like "Lorem ipsum"

IMPORTANT: The HTML must be COMPLETE and SELF-CONTAINED. One single file. All CSS in a <style> tag. All JS in a <script> tag. Google Fonts loaded via <link>. Images via Unsplash URLs.`;
}

function extractHtml(text: string): string | null {
  const trimmed = text.trim();

  // If it starts with <!DOCTYPE or <html, it's pure HTML
  if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html") || trimmed.startsWith("<!doctype")) {
    return trimmed;
  }

  // Try to extract from code fences
  const fenceMatch = trimmed.match(/```(?:html)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }

  // Find <!DOCTYPE or <html in the string
  const docIdx = trimmed.indexOf("<!DOCTYPE");
  const htmlIdx = trimmed.indexOf("<html");
  const start = docIdx !== -1 ? docIdx : htmlIdx;
  if (start !== -1) {
    const end = trimmed.lastIndexOf("</html>");
    if (end !== -1) {
      return trimmed.slice(start, end + 7);
    }
    return trimmed.slice(start);
  }

  return null;
}
