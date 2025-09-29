import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

const navigationItems = [
  {
    href: "/managed-mcp",
    label: "Managed Servers",
    description: "Built-in MCP tools",
    icon: "🔧",
  },
  {
    href: "/external-mcp",
    label: "External Servers",
    description: "Third-party integrations",
    icon: "🔗",
  },
  {
    href: "/custom-mcp",
    label: "Custom Servers",
    description: "Build your own",
    icon: "⚙️",
  },
  {
    href: "/local-ide",
    label: "Local IDE",
    description: "Development setup",
    icon: "💻",
  },
];

export const metadata: Metadata = {
  title: "Databricks MCP Workshop",
  description:
    "A comprehensive workshop to learn about Databricks Model Context Protocol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning className="bg-slate-950 text-slate-100 antialiased">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
            <div className="absolute top-1/2 right-[-200px] h-96 w-96 -translate-y-1/2 rounded-full bg-purple-600/15 blur-3xl sm:opacity-80 lg:opacity-100" />
            <div className="absolute bottom-[-180px] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative z-20 flex min-h-screen flex-col lg:flex-row">
            <aside className="relative hidden w-[320px] flex-shrink-0 flex-col border-r border-white/10 bg-slate-900/60 px-8 py-10 backdrop-blur lg:flex xl:w-[340px] overflow-y-auto">
              <div className="flex h-full flex-col gap-10">
                <Link href="/" className="block">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-sky-300/80">
                      Databricks
                    </span>
                    <h1 className="mt-2 text-2xl font-semibold text-white">
                      MCP Workshop
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                      Build production-grade MCP agents with Databricks tooling.
                    </p>
                  </div>
                </Link>

                <nav className="flex flex-col gap-3">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group relative flex items-start gap-3 overflow-hidden rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition-all duration-200 hover:border-sky-400/60 hover:bg-slate-900/80"
                    >
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900/70 text-lg">
                        {item.icon}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-white">
                          {item.label}
                        </span>
                        <span className="block text-xs text-slate-400">
                          {item.description}
                        </span>
                      </span>
                      <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                        <span className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-transparent to-transparent" />
                      </span>
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                  <h2 className="text-sm font-semibold text-white">
                    Need a refresher?
                  </h2>
                  <p className="text-sm text-slate-400">
                    Each section maps to hands-on docs, sample code, and deployment patterns across Databricks.
                  </p>
                  <Link
                    href="/managed-mcp"
                    className="inline-flex items-center gap-2 text-sm font-medium text-sky-300 hover:text-white"
                  >
                    Jump to the walkthrough
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                <div className="text-xs text-slate-500">
                  © {new Date().getFullYear()} Databricks. Updated for MCP on
                  Databricks Apps.
                </div>
              </div>
            </aside>

            <div className="flex-1 overflow-hidden">
              <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur lg:hidden">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Link
                      href="/"
                      className="text-base font-semibold text-white"
                    >
                      Databricks MCP Workshop
                    </Link>
                  </div>
                  <nav className="flex gap-2 overflow-x-auto pb-1">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="inline-flex min-w-fit items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300"
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </header>

              <main className="relative flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-12">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}