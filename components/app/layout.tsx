import type React from "react"
import "./globals.css"
import Link from "next/link"

export const metadata = {
  title: "Synapse Job-Candidate Matching",
  description: "Match candidates to jobs using vector similarity",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <header className="bg-slate-100 p-4 border-b">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl">
              Synapse Matching
            </Link>
            <nav className="flex gap-4">
              <Link href="/jobs" className="hover:underline">
                Jobs
              </Link>
              <Link href="/candidates" className="hover:underline">
                Candidates
              </Link>
              <Link href="/match" className="hover:underline">
                Match
              </Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}
