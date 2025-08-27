import { Button } from "./ui/button"
import { Plus, Search, FileText, Clock, Shield, Eye, Package, BarChart3, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { useUser } from "../lib/user-context"

export function DashboardActions() {
  const { isAdmin } = useUser()

  // Admin gets oversight and management actions
  const adminActions = [
    {
      href: "/manager-activities",
      label: "Manager Activities",
      icon: Eye,
      className: "bg-red-500 hover:bg-red-600 text-white"
    },
    {
      href: "/user-management",
      label: "User Management",
      icon: Shield,
      className: "bg-purple-500 hover:bg-purple-600 text-white"
    },
    {
      href: "/inventory",
      label: "Inventory Control",
      icon: Package,
      className: "bg-blue-500 hover:bg-blue-600 text-white"
    },
    {
      href: "/reports",
      label: "Full Analytics",
      icon: BarChart3,
      className: "bg-green-500 hover:bg-green-600 text-white"
    }
  ]

  // Managers get operational actions
  const managerActions = [
    {
      href: "/customers",
      label: "Register Customer",
      icon: Plus,
      className: "bg-primary hover:bg-primary/90 text-primary-foreground"
    },
    {
      href: "/customers",
      label: "Search Customer",
      icon: Search,
      className: "border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
    },
    {
      href: "/job-cards",
      label: "Manage Job Cards",
      icon: FileText,
      className: "bg-orange-500 hover:bg-orange-600 text-white"
    },
    {
      href: "/time-tracking",
      label: "Time Tracking",
      icon: Clock,
      className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
    }
  ]

  const actionsToShow = isAdmin ? adminActions : managerActions

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          {isAdmin ? "Admin Quick Actions" : "Manager Quick Actions"}
        </h3>
      </div>

      <div className="flex gap-4 flex-wrap">
        {actionsToShow.map((action, index) => (
          <Link key={index} to={action.href}>
            <Button
              className={action.className}
              variant={action.className.includes("bg-transparent") ? "outline" : "default"}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          </Link>
        ))}

        {/* Common action for both roles */}
        <Link to="/customers">
          <Button variant="outline" className="border-gray-300">
            <Users className="h-4 w-4 mr-2" />
            View All Customers
          </Button>
        </Link>
      </div>
    </div>
  )
}
