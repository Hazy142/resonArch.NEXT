import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "resonArch NEXT — Help decide what we build next",
  description:
    "Open product discovery and community signal for resonArch projects, prototypes and upcoming services."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
