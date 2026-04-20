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

FASHION/RETAIL:
- 1441986300917-64674bd600d8 (clothing store)
- 1558171813-4c2ab4e38ee0 (fashion model)
- 1445205170230-053b530db579 (shopping bags)
- 1490481651871-ab68de25d43d (fashion editorial)
- 1469334031218-e382a71b716b (wardrobe)
- 1515886657613-9f3515b0c78f (luxury fashion)

FITNESS/WELLNESS:
- 1534438327276-14e5300c3a48 (gym interior)
- 1571019613454-1cb2f99b2d8b (yoga pose)
- 1517836357463-d25dfeac3438 (fitness workout)
- 1544367567-0f2fcb009e0b (running)
- 1518611012118-696072aa579a (healthy food)
- 1574680096145-d05b474e2155 (meditation)

REAL ESTATE:
- 1512917774080-9991f1c4c750 (luxury home)
- 1502672260266-1c1ef2d93688 (modern interior)
- 1560448204-e02f11c3d0e2 (apartment)
- 1600596542815-ffad4c1539a9 (kitchen design)
- 1600585154340-be6161a56a0c (living room)
- 1523217553-2e1e3f5ded16 (house exterior)

EDUCATION/COACHING:
- 1524178232363-1fb2b075b655 (university)
- 1427504494785-3a9ca7044f45 (books library)
- 1522202176988-66273c2fd55f (classroom)
- 1531482615713-2afd69097998 (lecture)
- 1552664730-d307ca884978 (studying)
- 1509062522246-3755977927d7 (graduation)

### Structure — AI-DRIVEN, UNIQUE PER SITE
You MUST choose the sections, their order, and their layout based on what makes sense for THIS specific business. DO NOT always use the same structure. Think like a real designer.

Available section types (pick 8-12 that fit the business):

**REQUIRED (always include):**
- **Navigation** — Sticky header. Be creative: transparent, solid, centered logo, left logo, mega menu...
- **Hero** — The first impression. Vary the layout: fullscreen image, split-screen, video-style, minimal text, slider feel, overlapping elements...
- **Footer** — Be creative: 4 columns, 3 columns, minimal, large with newsletter, with map...

**CHOOSE based on the business (pick 5-9):**
- **Services/Offerings** — Cards, rows, icons, bento grid, alternating left-right, numbered list...
- **About/Story** — Split image+text, timeline, team grid, full-width story, stats counters...
- **Gallery/Portfolio** — Grid, masonry, carousel feel, full-bleed images, lightbox style...
- **Testimonials/Reviews** — Cards, large quotes, slider feel, with ratings, with photos...
- **Pricing/Packages** — 3 columns, comparison table, simple list, toggle monthly/yearly...
- **FAQ** — Accordion, two-column, searchable feel, categorized...
- **Contact** — Form + info, full-width map + form, minimal, with booking calendar mention...
- **CTA/Banner** — Full-color, gradient, with image background, minimal, with countdown feel...
- **Features/Benefits** — Icon grid, alternating rows, numbered steps, with illustrations...
- **Team** — Grid with photos, cards with social links, minimal list...
- **Process/How it works** — Numbered steps, timeline, icons with arrows...
- **Stats/Numbers** — Counter section with big numbers and labels...
- **Blog/News preview** — Article cards with images, dates, excerpts...
- **Partners/Logos** — Logo bar, grid of client/partner logos...
- **Newsletter** — Email signup section with compelling copy...

**IMPORTANT LAYOUT RULES:**
- Alternate between light and dark background sections for visual rhythm
- Vary section heights — not all sections should be the same size
- Use different layouts within section types (don't always use the same card grid)
- The hero MUST be visually stunning and unique — it's what sells the site
- Think like a designer, not a template engine
- A restaurant needs a menu section, not a pricing section
- A photographer needs a massive gallery, not a FAQ
- A coach needs a process/how-it-works section
- A boutique needs a lookbook gallery, not a generic portfolio

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
