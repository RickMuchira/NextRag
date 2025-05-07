import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import Sidebar from "@/components/sidebar"
import { FloatingPaper } from "@/components/floating-paper"
import type { ReactNode } from "react"

interface PageLayoutProps {
  children: ReactNode
  showFloatingPapers?: boolean
}

export default function PageLayout({ children, showFloatingPapers = true }: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Ambient background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      {/* Floating papers background */}
      {showFloatingPapers && (
        <div className="absolute inset-0 overflow-hidden z-0">
          <FloatingPaper count={6} />
        </div>
      )}

      <div className="relative z-10 flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </main>
  )
}