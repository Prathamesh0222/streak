import { ModeToggle } from "./mode-toggle";
import { NotificationBell } from "./notifications-bell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export const DashboardHeader = () => {
  const { data: session } = useSession();

  return (
    <header className="px-8 py-4 border w-full mx-auto rounded-2xl border-red-500/20">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-medium text-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h1>
        <div className="flex gap-4 items-center">
          <NotificationBell />
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 dark:focus-visible:ring-red-600">
              <div className="w-10 h-10 rounded-full border border-border bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 flex items-center justify-center hover:shadow-md transition-all duration-200 cursor-pointer">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-10 h-10 object-cover rounded-full"
                    width={40}
                    height={40}
                  />
                ) : (
                  <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                    {session?.user?.name?.charAt(0) || "?"}
                  </span>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {session?.user?.name ?? "Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
