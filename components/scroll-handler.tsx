"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ScrollHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const target = searchParams.get("scrollTo");
    if (!target) return;
    const el = document.getElementById(target);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "/");
    });
  }, [searchParams]);

  return null;
}
