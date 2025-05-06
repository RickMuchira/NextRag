"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  Home,
  BarChart,
  Settings,
  Users,
  MessageSquare,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

type NavItemType = {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  children?: NavItemType[]
}

export default function Sidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "course-1": true,
    "semester-1": true,
  })

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const navItems: NavItemType[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="w-5 h-5" />,
      href: "/",
    },
    {
      id: "documents",
      label: "Documents",
      icon: <FileText className="w-5 h-5" />,
      href: "/documents",
    },
    {
      id: "assistant",
      label: "AI Assistant",
      icon: <MessageSquare className="w-5 h-5" />,
      href: "/assistant",
    },
    {
      id: "quiz",
      label: "Knowledge Pulse",
      icon: <Sparkles className="w-5 h-5" />,
      href: "/quiz",
    },
    {
      id: "courses",
      label: "Courses",
      icon: <BookOpen className="w-5 h-5" />,
      children: [
        {
          id: "course-1",
          label: "Computer Science",
          icon: <BookOpen className="w-4 h-4" />,
          children: [
            {
              id: "semester-1",
              label: "Fall 2023",
              icon: <Calendar className="w-4 h-4" />,
              children: [
                {
                  id: "unit-1",
                  label: "Algorithms",
                  icon: <Layers className="w-4 h-4" />,
                  children: [
                    {
                      id: "doc-1",
                      label: "Sorting Algorithms",
                      icon: <FileText className="w-4 h-4" />,
                    },
                    {
                      id: "doc-2",
                      label: "Graph Algorithms",
                      icon: <FileText className="w-4 h-4" />,
                    },
                  ],
                },
                {
                  id: "unit-2",
                  label: "Data Structures",
                  icon: <Layers className="w-4 h-4" />,
                },
              ],
            },
            {
              id: "semester-2",
              label: "Spring 2024",
              icon: <Calendar className="w-4 h-4" />,
            },
          ],
        },
        {
          id: "course-2",
          label: "Mathematics",
          icon: <BookOpen className="w-4 h-4" />,
        },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart className="w-5 h-5" />,
      href: "/admin",
    },
    {
      id: "users",
      label: "Users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ]

  const renderNavItems = (items: NavItemType[], depth = 0) => {
    return items.map((item) => (
      <div key={item.id} className={cn("mb-1", depth > 0 && "ml-4")}>
        {item.href ? (
          <Link href={item.href}>
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-gray-300 hover:text-white transition-colors cursor-pointer",
                pathname === item.href && "bg-purple-500/20 text-white",
              )}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              <span className="flex-1 text-sm">{item.label}</span>
            </div>
          </Link>
        ) : (
          <div
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-gray-300 hover:text-white transition-colors cursor-pointer",
            )}
            onClick={() => (item.children ? toggleExpand(item.id) : null)}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <span className="flex-1 text-sm">{item.label}</span>
            {item.children &&
              (expanded[item.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
          </div>
        )}
        {item.children && expanded[item.id] && <div className="mt-1">{renderNavItems(item.children, depth + 1)}</div>}
      </div>
    ))
  }

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 h-screen bg-black/50 backdrop-blur-md border-r border-white/10 overflow-y-auto hidden md:block"
    >
      <div className="p-4">
        <Link href="/">
          <div className="flex items-center space-x-2 mb-6 px-2">
            <BookOpen className="w-8 h-8 text-purple-500" />
            <span className="text-white font-medium text-xl">EduRAG</span>
          </div>
        </Link>
        <div className="space-y-1">{renderNavItems(navItems)}</div>
      </div>
    </motion.div>
  )
}