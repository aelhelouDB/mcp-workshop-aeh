import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Databricks MCP Workshop",
  description: "A comprehensive workshop to learn about Databricks Model Context Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-950 text-white antialiased">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 overflow-hidden bg-white">
            {/* Mobile Header */}
            <header className="lg:hidden border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DB</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">MCP Workshop</h1>
                </div>
              </Link>
            </header>

            {/* Content Area */}
            <div className="h-full overflow-y-auto bg-white text-slate-900">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}