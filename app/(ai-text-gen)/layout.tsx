import { ClerkProvider } from "@clerk/nextjs";
import '../globals.css';
import type { Metadata } from 'next'
import { Alegreya_Sans } from 'next/font/google'
import Topbar from "@/components/shared/Topbar";
import Link from "next/link";

const inter = Alegreya_Sans({ weight: ["100", "300", "400", "500", "700", "800", "900"], display: "swap", subsets: ["latin"] });

export const metadata = {
  title: 'TStream | AI Text Generation',
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
          <main>
              <div className="mt-[68px] w-full">
                {children}
              </div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
