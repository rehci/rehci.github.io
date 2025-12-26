import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { getAllCategories } from "@/lib/markdown";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Encyclopedia - Your Knowledge Base",
  description: "A comprehensive encyclopedia with articles on various topics",
  keywords: ["encyclopedia", "knowledge", "articles", "information"],
  openGraph: {
    title: "Encyclopedia - Your Knowledge Base",
    description: "A comprehensive encyclopedia with articles on various topics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Encyclopedia - Your Knowledge Base",
    description: "A comprehensive encyclopedia with articles on various topics",
  },
};

/**
 * Root layout component for the entire application.
 * Provides the HTML structure, fonts, global styles, navigation, and footer.
 * Fetches categories server-side and passes them to the Navigation component.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {Promise<JSX.Element>} Root HTML structure with navigation and footer
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getAllCategories();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}
      >
        <Navigation categories={categories} />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Encyclopedia. Built with Next.js and Meilisearch.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
