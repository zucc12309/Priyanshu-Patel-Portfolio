"use client";

// Same-document view transitions around Next's client router.
// startViewTransition snapshots the old page, we push the route, and the
// RouteChangeNotifier (in the root layout) resolves once the new page commits.

import { playSound } from "@/lib/sound";

let resolveCommit: (() => void) | null = null;

type Router = { push: (href: string) => void };

export function notifyRouteCommitted() {
  resolveCommit?.();
  resolveCommit = null;
}

export function navigateWithTransition(router: Router, href: string, source?: Element | null) {
  const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> } };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduced) {
    router.push(href);
    return;
  }

  // Tag the clicked card's title + visual so they morph into the case page's.
  const card = source?.closest("[data-vt-card]");
  const title = card?.querySelector<HTMLElement>("[data-vt='title']");
  const media = card?.querySelector<HTMLElement>("[data-vt='media']");
  if (title) title.style.viewTransitionName = "vt-title";
  if (media) media.style.viewTransitionName = "vt-media";
  document.documentElement.dataset.vt = "on";
  playSound("whoosh");

  const transition = doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        resolveCommit = resolve;
        router.push(href);
        // Never hold the page hostage if the commit signal is missed.
        window.setTimeout(notifyRouteCommitted, 1800);
      }),
  );
  transition.finished.finally(() => {
    delete document.documentElement.dataset.vt;
    if (title) title.style.viewTransitionName = "";
    if (media) media.style.viewTransitionName = "";
  });
}
