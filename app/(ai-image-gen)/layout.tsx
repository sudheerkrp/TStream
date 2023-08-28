import { ClerkProvider } from "@clerk/nextjs";
import '../globals.css';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Topbar from "@/components/shared/Topbar";
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TStream | AI Image Generation',
  description: 'TStream, a social media platform with extraordinary AI features.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />
          <header className="w-full flex justify-between items-center sm:px-8 px-4 mt-[74px] py-4 border-b bottom-b-[#e6ebf4]">
            <Link href="/ai-img-gen" className="text-heading3-bold">
              AI Img Gen
            </Link>
            <Link href="/ai-img-gen/gen-img" className="font-inter font-medium bg-[#6469ff] text-white-1 px-4 py-2 rounded-md">
              Create
            </Link>
          </header>
          <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-147px)]">
              <div className="w-full max-w-4xl">
                {children}
              </div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
