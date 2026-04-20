import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// POST /api/checkout
// =============================================================================
// Creates a Stripe Checkout session for buying credit packs.
// If Stripe is not configured, returns a dev-mode flag so the frontend
// can simulate the purchase.
// =============================================================================

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Credit pack definitions (must match frontend)
const PACKS: Record<string, { credits: number; price: number; name: string }> = {
  starter: { credits: 10, price: 900, name: "Starter" }, // price in cents
  pro: { credits: 30, price: 1900, name: "Pro" },
  business: { credits: 100, price: 4900, name: "Business" },
};

export async function POST(request: NextRequest) {
  try {
    const { packId } = await request.json();
    const pack = PACKS[packId];

    if (!pack) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }

    // If Stripe is not configured, return dev mode flag
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json({
        error: "stripe_not_configured",
        message: "Stripe not configured — credits added in dev mode",
      });
    }

    // Create Stripe Checkout Session via API (no SDK needed)
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "mode": "payment",
        "success_url": `${APP_URL}/credits/success?pack=${packId}&credits=${pack.credits}`,
        "cancel_url": `${APP_URL}/dashboard`,
        "line_items[0][price_data][currency]": "eur",
        "line_items[0][price_data][product_data][name]": `SiteForge — Pack ${pack.name}`,
        "line_items[0][price_data][product_data][description]": `${pack.credits} crédits de génération`,
        "line_items[0][price_data][unit_amount]": String(pack.price),
        "line_items[0][quantity]": "1",
        "metadata[pack_id]": packId,
        "metadata[credits]": String(pack.credits),
      }).toString(),
    });

    const session = await response.json();

    if (session.error) {
      console.error("[Stripe] Error:", session.error);
      return NextResponse.json({ error: session.error.message }, { status: 400 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[Checkout] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
