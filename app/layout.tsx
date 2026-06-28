import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "ZERO",
  description:
    "A living catalogue of planetary cooling possibilities, built from interventions, field prototypes, and trusted climate evidence."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <footer className="border-t border-zero-rule py-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-sm text-zero-muted sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <p>ZERO is a living roadmap toward zero additional heat.</p>
            <p>Everything here is provisional. Better evidence should update the system.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
