import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ControlRoom } from "@/components/control-room";
import { FooterFact } from "@/components/footer-fact";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { SiteHeader } from "@/components/site-header";
import { TypographicCopy } from "@/components/typographic-copy";
import { UnlockLetter } from "@/components/unlock-letter";
import { VisitRecorder } from "@/components/visit-recorder";

export const metadata: Metadata = {
  title: "ZERO",
  description:
    "A living catalogue of planetary cooling possibilities, built from interventions, field prototypes, and trusted climate evidence."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=switzer@300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('zero-theme-mode')==='white'){document.documentElement.dataset.theme='light'}}catch(e){}"
          }}
        />
      </head>
      <body>
        <SiteHeader />
        <VisitRecorder />
        <TypographicCopy />
        <KeyboardShortcuts />
        <ControlRoom />
        <UnlockLetter />
        {children}
        <footer className="py-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-3 text-sm text-zero-muted sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <p>ZERO is a living roadmap toward zero additional heat.</p>
            <FooterFact />
          </div>
        </footer>
      </body>
    </html>
  );
}
