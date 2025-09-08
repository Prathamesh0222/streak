import { prisma } from "./prisma";

export interface SubscriptionLimits {
  maxHabits: number;
  aiAssistantDaily: number;
  calendarDays: number;
}

export const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  FREE: {
    maxHabits: 10,
    aiAssistantDaily: 10,
    calendarDays: 7,
  },
  PRO: {
    maxHabits: -1,
    aiAssistantDaily: 50,
    calendarDays: -1,
  },
};
export const checkHabitLimit = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        subscription: true,
      },
    });

    if (!user) {
      return { allowed: false, current: 0, limit: 0 };
    }

    const limits = SUBSCRIPTION_LIMITS[user.subscription];
    const currentHabits = await prisma.habit.count({
      where: {
        userId,
      },
    });

    const allowed = limits.maxHabits === -1 || currentHabits < limits.maxHabits;

    return {
      allowed,
      current: currentHabits,
      limit: limits.maxHabits,
    };
  } catch (error) {
    console.error("Check habit limit error:", error);
    return { allowed: false, current: 0, limit: 0 };
  }
};

export const checkApiRateLimit = async (
  userId: string,
  apiType: "AI_ASSISTANT"
): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        subscription: true,
      },
    });

    if (!user) {
      return { allowed: false, remaining: 0, resetTime: new Date() };
    }

    const limits = SUBSCRIPTION_LIMITS[user.subscription];
    const dailyLimit = limits.aiAssistantDaily;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayUsage = await prisma.apiUsage.count({
      where: {
        userId,
        apiType,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const remaining = Math.max(0, dailyLimit - todayUsage);
    const allowed = todayUsage < dailyLimit;

    return {
      allowed,
      remaining,
      resetTime: tomorrow,
    };
  } catch (error) {
    console.error("Rate limit check error:", error);
    return { allowed: false, remaining: 0, resetTime: new Date() };
  }
};

export const recordApiUsage = async (
  userId: string,
  apiType: "AI_ASSISTANT"
): Promise<void> => {
  try {
    await prisma.apiUsage.create({
      data: {
        userId,
        apiType,
        date: new Date(),
      },
    });
  } catch (error) {
    console.error("Record API usage error:", error);
  }
};

export const getUserSubscriptionInfo = async (
  userId: string
): Promise<{
  tier: string;
  limits: SubscriptionLimits;
  usage: {
    habits: { current: number; limit: number };
    aiAssistant: { used: number; limit: number; remaining: number };
  };
}> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        subscription: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const limits = SUBSCRIPTION_LIMITS[user.subscription];

    const [habitCount, today] = await Promise.all([
      prisma.habit.count({
        where: {
          userId,
        },
      }),
      new Date(),
    ]);

    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const aiAssistantUsed = await prisma.apiUsage.count({
      where: {
        userId,
        apiType: "AI_ASSISTANT",
        date: { gte: today, lt: tomorrow },
      },
    });

    return {
      tier: user.subscription,
      limits,
      usage: {
        habits: {
          current: habitCount,
          limit: limits.maxHabits,
        },
        aiAssistant: {
          used: aiAssistantUsed,
          limit: limits.aiAssistantDaily,
          remaining: Math.max(0, limits.aiAssistantDaily - aiAssistantUsed),
        },
      },
    };
  } catch (error) {
    console.error("Get subscription info error:", error);
    throw error;
  }
};
