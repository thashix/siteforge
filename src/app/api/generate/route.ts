import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// POST /api/generate — Premium Site Generation
// =============================================================================
// Flow:
//   1. Search the web for design inspiration based on the business sector
//   2. Generate a multi-page HTML website with inline editing attributes
//   3. Return { pages: [{name, slug, html}], nav: string }
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

    // -----------------------------------------------------------------------
    // STEP 1: Try web search for inspiration (skip if rate limited)
    // -----------------------------------------------------------------------
    let inspiration = "";
    try {
      const searchController = new AbortController();
      const searchTimeout = setTimeout(() => searchController.abort(), 8000); // 8s timeout

      const searchResponse = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        signal: searchController.signal,
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 800,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{
            role: "user",
            content: `Find 3 premium website designs for: ${description.slice(0, 150)}. Briefly describe their visual style, colors, and layout.`,
          }],
        }),
      });

      clearTimeout(searchTimeout);

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        const texts = searchData.content
          ?.filter((b: { type: string }) => b.type === "text")
          ?.map((b: { text: string }) => b.text)
          ?.join("\n");
        if (texts) inspiration = texts;
      }
    } catch {
      console.log("[Generate] Web search skipped (timeout or rate limit)");
    }

    // Wait 2 seconds between API calls to avoid rate limiting
    await new Promise((r) => setTimeout(r, 2000));

    // -----------------------------------------------------------------------
    // STEP 2: Generate the full multi-page website
    // -----------------------------------------------------------------------
    const designSeeds = [
      "asymmetric layouts with off-grid elements and overlapping layers",
      "cinematic wide-screen hero with parallax scrolling feel",
      "split-screen hero with dramatic image on the right",
      "magazine-editorial style with overlapping typography and images",
      "bold geometric style with angular shapes and strong contrast",
      "organic flowing style with curves, rounded shapes and soft gradients",
      "luxury minimal with massive whitespace and thin typography",
      "dark immersive with full-bleed images and light text overlays",
    ];
    const seed = designSeeds[Math.floor(Math.random() * designSeeds.length)];

    const systemPrompt = buildSystemPrompt(inspiration);
    const userMessage = buildUserMessage(businessName, description, seed);

    // Retry logic for rate limiting
    let response: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 12000,
          temperature: 0.85,
          system: systemPrompt,
          messages: [{ role: "user", content: userMessage }],
        }),
      });

      if (response.status === 429) {
        // Rate limited — wait and retry
        const waitTime = (attempt + 1) * 5000; // 5s, 10s, 15s
        console.log(`[Generate] Rate limited, waiting ${waitTime}ms (attempt ${attempt + 1}/3)`);
        await new Promise((r) => setTimeout(r, waitTime));
        continue;
      }
      break;
    }

    if (!response || !response.ok) {
      const err = response ? await response.text() : "No response";
      console.error("[Generate] API error:", response?.status, err);
      return NextResponse.json({ success: false, error: `API error: ${response?.status || "unknown"}` }, { status: 422 });
    }

    const data = await response.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
    if (!textBlock?.text) {
      return NextResponse.json({ success: false, error: "No response from AI" }, { status: 422 });
    }

    // Extract HTML
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

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

function buildSystemPrompt(inspiration: string): string {
  const inspirationBlock = inspiration
    ? `\n## DESIGN INSPIRATION FROM REAL WEBSITES\nUse these as inspiration for your design decisions:\n${inspiration}\n`
    : "";

  return `You are an elite web designer creating stunning, premium websites. You generate COMPLETE, STANDALONE HTML files.
${inspirationBlock}
## YOUR OUTPUT
Output ONLY the complete HTML code. Start with <!DOCTYPE html> and end with </html>.
No explanation, no markdown, no backticks. JUST THE HTML.

## INLINE EDITING SUPPORT
Add these data attributes to all editable elements so users can click to edit them:
- data-editable="text" on all text elements (h1, h2, h3, p, span, a, li, button text)
- data-editable="image" on all img tags and background-image divs
- data-editable="link" on all links/buttons with href
- data-editable="section" on each <section> tag
Each editable element should have a unique data-id="element-{number}" attribute.

## MULTI-PAGE STRUCTURE
Generate a MULTI-PAGE site using JavaScript-based page switching (all in one HTML file).
Each "page" is a <div class="page" data-page="slug"> that is shown/hidden.

Required pages (adapt names to the business language):
- Home (data-page="home") — hero + key sections
- About (data-page="about") — story, team, values
- Services/Menu/Products (data-page="services") — what the business offers (adapt name)
- Gallery/Portfolio (data-page="gallery") — visual showcase
- Contact (data-page="contact") — form + info

The navigation must switch between pages with smooth transitions.
Include this JavaScript for page switching:
\`\`\`
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => {
    p.style.display = 'none';
    p.classList.remove('page-active');
  });
  const target = document.querySelector('[data-page="' + page + '"]');
  if (target) {
    target.style.display = 'block';
    target.classList.add('page-active');
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  document.querySelectorAll('[data-nav]').forEach(n => {
    n.classList.toggle('nav-active', n.getAttribute('data-nav') === page);
  });
}
\`\`\`

## DESIGN REQUIREMENTS — PREMIUM LEVEL

### Visual Quality
- The site must look like it was designed by a top agency charging €10,000+
- Rich, immersive hero sections with full-screen backgrounds
- Generous spacing (sections: 100-140px vertical padding)
- Sophisticated typography hierarchy with dramatic size contrast
- Micro-interactions and hover effects on EVERY interactive element
- Smooth scroll behavior and entrance animations
- Professional color harmony with strong accent usage

### Images — USE UNSPLASH
Use real images from Unsplash: https://images.unsplash.com/photo-{id}?w={width}&h={height}&fit=crop&q=80

PHOTOGRAPHY/CREATIVE:
- 1606993907291-d86efa9b94db, 1554048612-b6a83d2ed2c4, 1542038784456-1ea8e935640e
- 1493863641943-9b68992a8d07, 1507003211169-0a1dd7228f2d, 1494790108377-be9c29b29330

BEAUTY/SALON:
- 1560066984-138dadb4c035, 1522337360788-8b13dee7a37e, 1487412947147-5cebf100ffc2
- 1516975080664-ed2fc6a32937, 1580618672591-3c4eb24e7c54

RESTAURANT/FOOD:
- 1517248135467-4c7edcad34c4, 1414235077428-338989a2e8c0, 1504674900247-0877df9cc836
- 1555396273-367ea4eb4db5, 1466978913421-dad2ebd01d17, 1528605248644-14dd04022da1

TECH/AGENCY:
- 1497366216548-37526070297c, 1460925895917-afdab827c52f, 1522071820038-ad15a96e97c3
- 1551434678-e076c223a692, 1498050108023-c5249f4df085, 1504384308090-c894fdcc538d

FASHION/RETAIL:
- 1441986300917-64674bd600d8, 1558171813-4c2ab4e38ee0, 1445205170230-053b530db579
- 1490481651871-ab68de25d43d, 1469334031218-e382a71b716b, 1515886657613-9f3515b0c78f

FITNESS/WELLNESS:
- 1534438327276-14e5300c3a48, 1571019613454-1cb2f99b2d8b, 1517836357463-d25dfeac3438
- 1544367567-0f2fcb009e0b, 1518611012118-696072aa579a

REAL ESTATE:
- 1512917774080-9991f1c4c750, 1502672260266-1c1ef2d93688, 1560448204-e02f11c3d0e2
- 1600596542815-ffad4c1539a9, 1600585154340-be6161a56a0c

GENERAL/CORPORATE:
- 1486406146926-c627a92ad1ab, 1497366811353-6870744d04b2, 1553877522-43269d4ea984
- 1542744173-8e7e53415bb0, 1497215728101-856f4ea42174

### Section Selection — ADAPT TO THE BUSINESS
Choose sections that make sense for THIS business. Examples:
- Restaurant → Menu/Carte section (NOT pricing), reservation form, chef story, ambiance gallery
- Photographer → Massive portfolio gallery, process section, booking
- Boutique → Lookbook, collections, newsletter signup
- Coach → Process/methodology, transformation stories, booking
- Agency → Case studies, team, process, stats
- Salon → Services with prices, before/after gallery, booking

DO NOT use the same sections for every business.

### CSS — SOPHISTICATED
- CSS custom properties for color scheme consistency
- Google Fonts (2 fonts: display/serif for headings, sans for body)
- @keyframes animations for entrances
- IntersectionObserver for scroll reveal with staggered delays
- Responsive: works perfectly on mobile with hamburger menu
- Backdrop-filter: blur for nav and overlays
- Creative use of gradients, overlays, and blend modes
- box-shadow and transform for depth and hover effects

### JavaScript — INTERACTIVE
- Page navigation (show/hide pages)
- Scroll reveal IntersectionObserver
- Mobile hamburger menu toggle
- FAQ accordion if FAQ section exists
- Smooth scroll within pages
- Form mailto: submission
- Navbar background change on scroll
- Counter animation for stats sections

### Typography — Match the tone:
- Luxurious: Playfair Display + Lato
- Modern/Tech: Space Grotesk + DM Sans  
- Sophisticated: Cormorant Garamond + Montserrat
- Friendly: Sora + Inter
- Creative: DM Serif Display + Plus Jakarta Sans
- Organic/Warm: Fraunces + Outfit

### Color Scheme — Match the brief:
- Dark/luxury → #0D0D0D bg, #C8A45C accent
- Modern/tech → #0F172A bg or #FFFFFF, #6366F1 accent
- Warm/organic → #FDFAF5 bg, #B5754E accent
- Clean/medical → #FFFFFF bg, #2563EB accent
- Creative/bold → #18181B bg, #E24B4A accent
- Feminine/soft → #FFF5F5 bg, #D4748E accent
- Nature/eco → #F0F4EE bg, #5B8C5A accent

### Content Quality
- ALL content must be SPECIFIC to this exact business — no generic text
- Use the business name, location, and details from the brief
- Testimonial names should feel real and diverse
- FAQ answers: 2-3 detailed sentences each
- Contact info: use details from the brief or generate realistic ones
- Write in the same language as the brief

### Quality Checklist:
- [ ] Hero is full-screen, dramatic, and unique
- [ ] All sections have generous padding (min 80px top/bottom)
- [ ] Typography: hero title 4-6rem, section titles 2.5-3rem, body 1rem+
- [ ] Hover effects on ALL interactive elements
- [ ] Scroll animations on every section
- [ ] Mobile responsive with hamburger menu
- [ ] Real Unsplash images everywhere (NO placeholders)
- [ ] Footer has multiple columns with social icons
- [ ] Color scheme matches the brief's mood
- [ ] Multi-page navigation works
- [ ] data-editable attributes on all text/image/link elements
- [ ] Each page has unique, relevant content
- [ ] NO Lorem ipsum or placeholder text anywhere`;
}

function buildUserMessage(businessName: string, description: string, seed: string): string {
  return `Business name: ${businessName || "Mon Entreprise"}

Brief:
${description}

DESIGN DIRECTION: ${seed}

Generate a UNIQUE, PREMIUM, MULTI-PAGE website. Each page must have distinct content.
Make it look like a €10,000 agency-designed website. Start with <!DOCTYPE html>:`;
}

// =============================================================================
// HTML EXTRACTION
// =============================================================================

function extractHtml(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html") || trimmed.startsWith("<!doctype")) {
    return trimmed;
  }
  const fenceMatch = trimmed.match(/```(?:html)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) return fenceMatch[1].trim();
  const docIdx = trimmed.indexOf("<!DOCTYPE");
  const htmlIdx = trimmed.indexOf("<html");
  const start = docIdx !== -1 ? docIdx : htmlIdx;
  if (start !== -1) {
    const end = trimmed.lastIndexOf("</html>");
    if (end !== -1) return trimmed.slice(start, end + 7);
    return trimmed.slice(start);
  }
  return null;
}
