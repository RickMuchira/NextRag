"use client"

import { Button } from "@/components/ui/button"
import { Bot, Menu, Bell, User } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [notifications] = useState(3)
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <div className="flex items-center space-x-2 md:hidden">
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-2">
          <Bot className="w-8 h-8 text-purple-500" />
          <span className="text-white font-medium text-xl">EduRAG</span>
        </Link>

        <Link href="/" className={`text-gray-300 hover:text-white ${pathname === "/" ? "text-white" : ""}`}>
          Home
        </Link>
        <Link
          href="/documents"
          className={`text-gray-300 hover:text-white ${pathname === "/documents" ? "text-white" : ""}`}
        >
          Documents
        </Link>
        <Link
          href="/courses"
          className={`text-gray-300 hover:text-white ${pathname === "/courses" ? "text-white" : ""}`}
        >
          Courses
        </Link>
        <Link
          href="/assistant"
          className={`text-gray-300 hover:text-white ${pathname === "/assistant" ? "text-white" : ""}`}
        >
          AI Assistant
        </Link>
        <Link href="/admin" className={`text-gray-300 hover:text-white ${pathname === "/admin" ? "text-white" : ""}`}>
          Admin
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-white">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-purple-500 rounded-full flex items-center justify-center text-[10px]">
                  {notifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-black/80 backdrop-blur-md border border-white/10 text-white"
          >
            <DropdownMenuItem className="focus:bg-white/10">
              <span>New document uploaded</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-white/10">
              <span>Course content updated</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-white/10">
              <span>New semester added</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-black/80 backdrop-blur-md border border-white/10 text-white"
          >
            <DropdownMenuItem className="focus:bg-white/10">
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-white/10">
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-white/10">
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.nav>
  )
}