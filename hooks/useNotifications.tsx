"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await axios.get("/api/notifications");
      return data.notifications as Array<{
        id: string;
        type: string;
        title: string;
        body: string;
        actionUrl?: string;
        readAt?: string | null;
        createdAt: string;
      }>;
    },
    refetchInterval: (query) => {
      const hasUnread = query.state.data?.some((n) => !n.readAt);

      if (hasUnread) {
        return 5000;
      } else {
        return 15000;
      }
    },
  });

  const unreadCount = (data || []).filter((n) => !n.readAt).length;

  const markAllRead = useMutation({
    mutationFn: async () =>
      axios.patch("/api/notifications", { markAll: true }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markRead = useMutation({
    mutationFn: async (ids: string[]) =>
      axios.patch("/api/notifications", { ids }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return {
    notifications: data || [],
    unreadCount,
    isLoading,
    markAllRead: () => markAllRead.mutate(),
    isMarkAllReadPending: markAllRead.isPending,
    markRead: (ids: string[]) => markRead.mutate(ids),
    isMarkReadPending: markRead.isPending,
  };
};
