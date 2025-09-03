"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    markAllRead,
    markRead,
    isMarkAllReadPending,
    isMarkReadPending,
  } = useNotifications();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="relative p-2 rounded-xl hover:bg-accent transition">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[650px]">
        <DialogHeader className="flex items-center">
          <DialogTitle className="text-xl">Notifications</DialogTitle>
        </DialogHeader>

        <div className="max-h-96 overflow-auto space-y-2">
          {isLoading && (
            <div className="text-sm text-muted-foreground">Loading...</div>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="text-sm text-muted-foreground">
              You're all caught up.
            </div>
          )}
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="gap-2 cursor-pointer text-sm"
              onClick={() => markAllRead()}
              disabled={isMarkAllReadPending}
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          </div>

          {notifications.map((n) => {
            const isUnread = !n.readAt;
            return (
              <button
                key={n.id}
                onClick={() => isUnread && markRead([n.id])}
                disabled={isMarkReadPending}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition hover:border-primary",
                  isUnread
                    ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
                    : "border-border"
                )}
              >
                <div className="text-sm font-semibold">{n.title}</div>
                <div className="text-sm text-muted-foreground">{n.body}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {formatDistanceToNow(new Date(n.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
