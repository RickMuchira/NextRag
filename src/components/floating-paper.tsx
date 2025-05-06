"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FileText } from "lucide-react"

interface PaperProps {
  x: number
  y: number
  x2: number
  y2: number
  x3: number
  y3: number
  duration: number
}

export function FloatingPaper({ count = 5 }) {
  const [papers, setPapers] = useState<PaperProps[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only run on client side
    setMounted(true)
    
    // Generate paper positions only on client side
    const width = window.innerWidth
    const height = window.innerHeight
    
    const generatedPapers = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      x2: Math.random() * width,
      y2: Math.random() * height,
      x3: Math.random() * width,
      y3: Math.random() * height,
      duration: 20 + Math.random() * 10
    }))
    
    setPapers(generatedPapers)

    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      
      // Regenerate papers on resize
      setPapers(Array.from({ length: count }).map(() => ({
        x: Math.random() * newWidth,
        y: Math.random() * newHeight,
        x2: Math.random() * newWidth,
        y2: Math.random() * newHeight,
        x3: Math.random() * newWidth,
        y3: Math.random() * newHeight,
        duration: 20 + Math.random() * 10
      })))
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [count])

  // Return null during SSR
  if (!mounted) {
    return null
  }

  return (
    <div className="relative w-full h-full">
      {papers.map((paper, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: paper.x,
            y: paper.y,
            rotate: 0
          }}
          animate={{
            x: [paper.x, paper.x2, paper.x3],
            y: [paper.y, paper.y2, paper.y3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: paper.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="relative w-16 h-20 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transform hover:scale-110 transition-transform">
            <FileText className="w-8 h-8 text-purple-400/50" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}