import * as React from "react";

import { cn } from "@/lib/utils";

function CustomCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-1",
        className
      )}
      {...props}
    />
  );
}

function CustomContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-0.5", className)}
      {...props}
    />
  );
}

export { CustomCard, CustomContent };
