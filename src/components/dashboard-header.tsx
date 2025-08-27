import { useLocation } from "react-router-dom"
import { Search, Bell, User } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useUser, createDemoUser } from "../lib/user-context"

// Define page-specific content
const getPageContent = (pathname: string, userName: string, userType: string) => {
  const isAdmin = userType === "admin"
  const baseGreeting = isAdmin ? "Admin" : "Manager"

  switch (pathname) {
    case "/":
      return {
        title: `Welcome ${baseGreeting}`,
        subtitle: "Track operations and customer services.",
        searchPlaceholder: "Search customers, job cards..."
      }
    case "/customers":
      return {
        title: "Customer Management",
        subtitle: isAdmin ? "Manage customer records and history." : "View and update customer information.",
        searchPlaceholder: "Search customers, phone numbers..."
      }
    case "/orders":
      return {
        title: "Orders & Services",
        subtitle: "Manage orders and track progress.",
        searchPlaceholder: "Search orders, service types..."
      }
    case "/job-cards":
      return {
        title: "Job Cards & Tracking",
        subtitle: "Monitor job cards and technician progress.",
        searchPlaceholder: "Search job cards, vehicles..."
      }
    case "/time-tracking":
      return {
        title: "Time Tracking",
        subtitle: "Track work hours and completion times.",
        searchPlaceholder: "Search technicians, activities..."
      }
    case "/invoices":
      return {
        title: "Invoices & Payments",
        subtitle: "Generate invoices and manage payments.",
        searchPlaceholder: "Search invoices, customers..."
      }
    case "/inquiries":
      return {
        title: "Customer Inquiries",
        subtitle: "Manage and respond to customer questions.",
        searchPlaceholder: "Search inquiries, customers..."
      }
    case "/inventory":
      return {
        title: "Inventory Management",
        subtitle: isAdmin ? "Control inventory and stock management." : "Access restricted - Admin only.",
        searchPlaceholder: "Search parts, categories..."
      }
    case "/reports":
      return {
        title: "Analytics & Reports",
        subtitle: isAdmin ? "Business analytics and financial reports." : "View reports and performance metrics.",
        searchPlaceholder: "Search reports, metrics..."
      }
    default:
      return {
        title: `Welcome ${baseGreeting}`,
        subtitle: "AutoCare Management System",
        searchPlaceholder: "Search..."
      }
  }
}

export function DashboardHeader() {
  const location = useLocation()
  const pathname = location.pathname
  const { currentUser, setCurrentUser, logout, isAdmin } = useUser()

  const pageContent = getPageContent(
    pathname,
    currentUser?.full_name || "User",
    currentUser?.user_type || "office_manager"
  )

  const handleSwitchUser = () => {
    // Demo function to switch between admin and manager
    const newUserType = isAdmin ? "office_manager" : "admin"
    setCurrentUser(createDemoUser(newUserType))
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      {/* Welcome Message */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{pageContent.title}</h1>
          <p className="text-sm text-muted-foreground">{pageContent.subtitle}</p>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={pageContent.searchPlaceholder} className="pl-10 bg-background" />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-destructive">3</Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/${currentUser?.user_type}-avatar.png`} alt={currentUser?.full_name} />
                <AvatarFallback>
                  {currentUser?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser?.full_name}</p>
                <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
                <Badge variant="outline" className="w-fit mt-1 text-xs">
                  {currentUser?.user_type === "admin" ? "Admin" : "Manager"}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSwitchUser} className="text-blue-600">
              <span>Switch to {isAdmin ? "Manager" : "Admin"} (Demo)</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
