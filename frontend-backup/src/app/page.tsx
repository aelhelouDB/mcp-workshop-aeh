import Link from "next/link";

const sections = [
  {
    title: "Managed MCP Servers",
    description: "Learn how to use Databricks' built-in MCP servers for Vector Search, Unity Catalog functions, and Genie spaces.",
    href: "/managed-mcp",
    icon: "🔧",
    color: "bg-blue-500",
    features: ["Vector Search", "UC Functions", "Genie Spaces"]
  },
  {
    title: "External MCP Servers", 
    description: "Connect to third-party MCP servers using Unity Catalog HTTP connections for seamless integration.",
    href: "/external-mcp",
    icon: "🔗", 
    color: "bg-green-500",
    features: ["HTTP Connections", "OAuth", "AI Playground"]
  },
  {
    title: "Custom MCP Servers",
    description: "Build and deploy your own MCP servers as Databricks Apps to create custom tools and integrations.", 
    href: "/custom-mcp",
    icon: "⚙️",
    color: "bg-orange-500", 
    features: ["Databricks Apps", "Custom Tools", "Deployment"]
  },
  {
    title: "Local IDE Setup",
    description: "Set up your local development environment to work with Databricks MCP servers and build agents.",
    href: "/local-ide", 
    icon: "💻",
    color: "bg-purple-500",
    features: ["Local Dev", "Agent Building", "SDK Integration"]
  }
];

export default function Home() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute right-[-120px] top-10 h-60 w-60 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-sky-200">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            Interactive • Copy-Paste Ready • Production Patterns
          </div>

          <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl xl:text-[3.25rem]">
            Master Databricks Model Context Protocol
          </h1>
          <p className="mt-5 max-w-3xl text-base sm:text-lg text-slate-200">
            Build intelligent agents that safely access data, tools, and custom services across Databricks. Follow curated tutorials, production deployment guides, and hands-on examples that you can run today.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/managed-mcp"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
            >
              Start with Managed MCP
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/local-ide"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40 hover:text-white"
            >
              Build Locally
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Choose your path
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Each track blends documentation highlights, real-world scenarios, and code you can run immediately inside your workspace.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
            Updated for 2025 MCP release
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-6 transition duration-200 hover:border-sky-400/60 hover:bg-slate-900"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl text-white shadow-lg shadow-black/20 ${section.color}`}
                >
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    {section.description}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {section.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <span className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-transparent to-transparent" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 text-center backdrop-blur">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          Ready to ship an MCP-powered agent?
        </h2>
        <p className="mt-3 max-w-3xl mx-auto text-sm text-slate-200">
          Follow the end-to-end flow from discovery to deployment. Start with managed servers, extend with custom apps, and ship to Databricks Apps with confidence.
        </p>
      </section>
    </div>
  );
}