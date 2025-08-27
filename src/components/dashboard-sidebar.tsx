"use client"

import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Badge } from "./ui/badge"
import { useUser } from "../lib/user-context"
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  Package,
  BarChart3,
  Car,
  Wrench,
  FolderOpen,
  MessageSquare,
  Bookmark,
  Phone,
  CheckSquare,
  Calendar,
  Share2,
  Grid3X3,
  Shield,
  Eye,
  HelpCircle,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

// Role-based navigation configuration
const getNavigationItems = (userType: string) => {
  const commonItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      roles: ["admin", "office_manager"],
    },
    {
      title: "Customer Registration",
      href: "/customers",
      icon: Users,
      roles: ["admin", "office_manager"],
    },
    {
      title: "Orders & Services",
      href: "/orders",
      icon: ClipboardList,
      roles: ["admin", "office_manager"],
    },
    {
      title: "Job Cards & Tracking",
      href: "/job-cards",
      icon: Wrench,
      roles: ["admin", "office_manager"],
    },
    {
      title: "Time Tracking",
      href: "/time-tracking",
      icon: Car,
      roles: ["admin", "office_manager"],
    },
    {
      title: "Invoices & Payments",
      href: "/invoices",
      icon: FileText,
      roles: ["admin", "office_manager"],
    },
    {
      title: "Customer Inquiries",
      href: "/inquiries",
      icon: HelpCircle,
      roles: ["admin", "office_manager"],
    },
  ]

  const adminOnlyItems = [
    {
      title: "Inventory Management",
      href: "/inventory",
      icon: Package,
      roles: ["admin"],
      badge: "ADMIN ONLY",
    },
    {
      title: "Analytics & Reports",
      href: "/reports",
      icon: BarChart3,
      roles: ["admin", "office_manager"],
    },
    {
      title: "Manager Activities",
      href: "/manager-activities",
      icon: Eye,
      roles: ["admin"],
      badge: "OVERSIGHT",
    },
    {
      title: "User Management",
      href: "/user-management",
      icon: Shield,
      roles: ["admin"],
      badge: "ADMIN ONLY",
    },
  ]

  return [...commonItems, ...adminOnlyItems].filter(item =>
    item.roles.includes(userType)
  )
}

export function DashboardSidebar({ className }: SidebarProps) {
  const location = useLocation()
  const pathname = location.pathname
  const { currentUser, isAdmin } = useUser()

  const navigation = getNavigationItems(currentUser?.user_type || "office_manager")

  return (
    <div className={cn("flex h-full w-64 flex-col bg-teal-600 text-white", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center">
            <div className="w-6 h-6 bg-yellow-400 rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <span className="text-xl font-bold text-white">POS-Tracker</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-12 px-4 text-white/90 hover:bg-white/10 hover:text-white rounded-lg font-medium relative",
                  pathname === item.href &&
                    "bg-white/20 text-white hover:bg-white/20",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-yellow-400 text-teal-800 hover:bg-yellow-300"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-white/10">
          <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-sm font-semibold text-teal-600">
              {currentUser?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentUser?.full_name || "User"}
            </p>
            <p className="text-xs text-white/70 truncate">
              {currentUser?.email || "user@autocare.com"}
            </p>
            <Badge
              variant="outline"
              className={cn(
                "text-xs mt-1 border-white/30 text-white",
                isAdmin
                  ? "bg-red-500/20 border-red-300/50"
                  : "bg-blue-500/20 border-blue-300/50"
              )}
            >
              {isAdmin ? "ADMIN ACCESS" : "MANAGER ACCESS"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
