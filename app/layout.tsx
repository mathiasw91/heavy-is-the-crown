import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from './ui/nav';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Heavy is the Crown",
  description: "a board games leaderboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='h-full'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased grid grid-rows-[auto_1fr] h-full overflow-hidden`}>
        <Nav />
        <main className="p-4 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
