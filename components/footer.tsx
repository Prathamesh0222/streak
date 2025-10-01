import Link from "next/link";
import { Logo } from "./logo";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 border-x">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Making habit tracking simple for everyone.
            </p>
          </div>
          <nav aria-label="Footer product links" className="md:col-span-1">
            <p className="mb-3 text-sm font-medium">Product</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Footer legal links" className="md:col-span-1">
            <p className="mb-3 text-sm font-medium">Legal</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Refunds & Cancellation
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 h-px w-full bg-border" aria-hidden="true" />

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} Streak. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Designed & Developed by Prathamesh
          </p>
        </div>
      </div>
    </footer>
  );
};
