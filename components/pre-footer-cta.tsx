import Link from "next/link";
import { Flame } from "lucide-react";

export function PreFooterCTA() {
  return (
    <div className="border-t w-full">
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 border-x">
        <div className="p-20 border rounded-2xl bg-gradient-to-br dark:from-red-600 dark:via-red-800 dark:to-red-900 from-red-300 via-red-400 to-red-500">
          <div className="text-center mb-10">
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-red-300/70 border-red-500 text-red-700 dark:bg-red-900/50 border dark:border-red-500 dark:text-red-500 font-bold">
              Get Started
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              Ready to build unstoppable habits?
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who are transforming their lives one habit
              at a time. Track progress, earn achievements, and build lasting
              streaks.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-center items-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-background border border-input shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2"
            >
              View Pricing
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-red-600 text-white shadow-xs hover:bg-red-700 h-9 px-4 py-2"
            >
              <Flame className="w-4 h-4" />
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
