"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

enum SubscriptionTier {
  FREE = "FREE",
  PRO = "PRO",
}

interface UserSubscription {
  subscription: SubscriptionTier;
  limits: {
    maxHabits: number;
    aiAssistantDaily: number;
    calendarDays: number;
  };
}

export const useSubscription = () => {
  const { data: session } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["subscription", session?.user?.id],
    queryFn: async (): Promise<UserSubscription> => {
      const response = await axios.get("/api/subscription");
      return response.data;
    },
    enabled: !!session?.user?.id,
  });

  const isFreePlan = data?.subscription === SubscriptionTier.FREE;
  const isPremium = data?.subscription === SubscriptionTier.PRO;
  const calenderDaysLimit = data?.limits.calendarDays || 7;

  const getEarliestAccessDate = () => {
    if (isPremium) {
      return null;
    }

    const today = new Date();
    const earliestDate = new Date(today);
    earliestDate.setDate(today.getDate() - calenderDaysLimit);
    return earliestDate;
  };

  return {
    subscription: data?.subscription || SubscriptionTier.FREE,
    limits: data?.limits,
    isFreePlan,
    isPremium,
    getEarliestAccessDate,
    isLoading,
    error,
  };
};
