"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { navigateWithTransition } from "@/lib/view-transition";

/** Internal link that animates into the next page with a view transition. */
export function TransitionLink({ href, children, onMouseEnter, ...props }: { href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const router = useRouter();
  return (
    <a
      href={href}
      {...props}
      onMouseEnter={(e) => {
        router.prefetch(href);
        onMouseEnter?.(e);
      }}
      onFocus={() => router.prefetch(href)}
      onClick={(e) => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigateWithTransition(router, href, e.currentTarget);
      }}
    >
      {children}
    </a>
  );
}
