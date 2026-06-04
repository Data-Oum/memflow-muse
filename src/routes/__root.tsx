import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              reset();
              window.location.reload();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Amit Chakraborty — Principal Frontend Engineer" },
      {
        name: "description",
        content:
          "Production portfolio for Amit Chakraborty, Principal Architect and AI-native frontend engineer.",
      },
      { name: "author", content: "Amit Chakraborty" },
      { property: "og:title", content: "Amit Chakraborty — Principal Frontend Engineer" },
      {
        property: "og:description",
        content:
          "Production portfolio with live mem0 memory API demo, shipped systems, and AI workflow evidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@devamitch" },
      { name: "twitter:title", content: "Amit Chakraborty — Principal Frontend Engineer" },
      {
        name: "twitter:description",
        content:
          "Production portfolio with live mem0 memory API demo, shipped systems, and AI workflow evidence.",
      },
      {
        property: "og:image",
        content: "https://devamit.co.in/amit-portrait.jpg",
      },
      {
        name: "twitter:image",
        content: "https://devamit.co.in/amit-portrait.jpg",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/icon-192.png" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Lenis smooth scroll (initialised once at root — all pages benefit)
  useSmoothScroll();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const isPreview =
      window.self !== window.top ||
      window.location.hostname.startsWith("id-preview--") ||
      window.location.hostname.startsWith("preview--") ||
      window.location.hostname.endsWith(".lovableproject.com") ||
      window.location.hostname.endsWith(".lovableproject-dev.com") ||
      window.location.hostname.endsWith(".beta.lovable.dev") ||
      window.location.search.includes("sw=off");

    if (!import.meta.env.PROD || isPreview) {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => registrations
          .filter((registration) => registration.active?.scriptURL.endsWith("/sw.js"))
          .forEach((registration) => void registration.unregister()))
        .catch(() => undefined);
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.warn("[SW] Registration failed:", err));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
