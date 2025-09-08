import { generateHabitSuggestions } from "@/lib/assistant";
import { authOptions } from "@/lib/auth";
import { checkApiRateLimit, recordApiUsage } from "@/lib/subscription";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await checkApiRateLimit(session.user.id, "AI_ASSISTANT");

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message:
            "You've reached your daily limit for AI assistant requests. Upgrade to Pro for more requests!",
          remaining: rateLimit.remaining,
          resetTime: rateLimit.resetTime,
          upgradeRequired: true,
        },
        { status: 429 }
      );
    }

    const { prompt, existingHabits } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const suggestions = await generateHabitSuggestions(
      prompt,
      existingHabits || []
    );

    await recordApiUsage(session.user.id, "AI_ASSISTANT");

    return NextResponse.json({
      suggestions,
      success: true,
      rateLimit: {
        remaining: rateLimit.remaining - 1,
        resetTime: rateLimit.resetTime,
      },
    });
  } catch (error) {
    console.error("AI Assistant error:", error);
    return NextResponse.json(
      { error: "Failed to generate habit suggestions" },
      { status: 500 }
    );
  }
};
