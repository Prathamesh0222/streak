"use client";

import { Bell, CheckCheck, Check } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import Image from "next/image";
import { getNotificationImage } from "@/types/notifications-types";
import { Badge } from "./ui/badge";

export const NotificationBell = () => {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
          <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-white border-0 text-[10px] font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[85vw] sm:w-[380px] md:w-[420px] max-h-[70vh] sm:max-h-[500px] overflow-y-auto bg-background border border-red-200 dark:border-red-500/30 p-0"
      >
        <div className="flex items-center justify-between py-4 px-3 border-b border-red-100 dark:border-red-900/50 sticky top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 z-10">
          <div>
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-[10px] text-muted-foreground">
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                markAllRead();
              }}
              disabled={isMarkAllReadPending}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 h-7 px-2 text-[10px] font-medium"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="divide-y divide-red-50 dark:divide-red-950/30">
          {isLoading ? (
            <div className="p-6 text-center text-xs text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            notifications.map((n) => {
              const isUnread = !n.readAt;
              const notificationImage = getNotificationImage(n.type);

              return (
                <DropdownMenuItem
                  key={n.id}
                  className={cn(
                    "p-3 cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/20 relative",
                    isUnread
                      ? "bg-red-50/70 dark:bg-red-950/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isUnread) {
                      markRead([n.id]);
                    }
                  }}
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className="flex gap-2 w-full">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <h4
                          className={cn(
                            "text-xs font-semibold leading-tight",
                            isUnread
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-700 dark:text-gray-300"
                          )}
                        >
                          {n.title}
                        </h4>
                        {isUnread && (
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
                        {n.body}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-500">
                        {formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>

                    {notificationImage && (
                      <div className="flex-shrink-0">
                        <Image
                          src={notificationImage.src}
                          alt={notificationImage.alt}
                          width={50}
                          height={50}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      </div>
                    )}

                    {isUnread && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          markRead([n.id]);
                        }}
                        disabled={isMarkReadPending}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
