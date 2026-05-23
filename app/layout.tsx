import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  weight: "400",
  variable: "--font-serif",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chatback-coral.vercel.app"),
  title: "Chatback — talk to the person your AI history remembers",
  description:
    "Turn your AI memory and chat history into a personal dashboard. Themes, open loops, decisions, recommendations — plus modes that turn the same data into shareable insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${serif.variable} ${mono.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans candle-ambient">
        {children}
      </body>
    </html>
  );
}
