"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ScrollHandlerContent() {
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

export function ScrollHandler() {
  return (
    <Suspense fallback={null}>
      <ScrollHandlerContent />
    </Suspense>
  );
}
