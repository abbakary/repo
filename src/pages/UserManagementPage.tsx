"use client"

import { useState } from "react"
import { AuthWrapper } from "@/components/auth-wrapper"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield, 
  User, 
  Mail, 
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Settings
} from "lucide-react"
import { useUser } from "@/lib/user-context"

// Mock data for users
const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@autocare.co.tz",
    full_name: "Admin User",
    user_type: "admin",
    is_active: true,
    last_login: "2024-01-20 14:30:00",
    created_at: "2024-01-01 00:00:00",
    total_actions: 1247,
    permissions: ["full_access", "user_management", "inventory", "reports"],
  },
  {
    id: 2,
    username: "manager",
    email: "manager@autocare.co.tz",
    full_name: "Manager User",
    user_type: "office_manager",
    is_active: true,
    last_login: "2024-01-20 13:45:00",
    created_at: "2024-01-05 00:00:00",
    total_actions: 856,
    permissions: ["customer_management", "orders", "job_cards", "invoices", "time_tracking"],
  },
  {
    id: 3,
    username: "manager2",
    email: "manager2@autocare.co.tz",
    full_name: "John Mwangi",
    user_type: "office_manager",
    is_active: false,
    last_login: "2024-01-15 16:20:00",
    created_at: "2024-01-10 00:00:00",
    total_actions: 234,
    permissions: ["customer_management", "orders", "job_cards"],
  },
]

export default function UserManagementPage() {
  const { isAdmin } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    full_name: "",
    user_type: "office_manager",
    password: "",
  })

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <AuthWrapper>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                Access Denied
              </CardTitle>
              <CardDescription>
                User Management is only accessible to Admin users.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </AuthWrapper>
    )
  }

  const filteredUsers = mockUsers.filter((user) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddUser = () => {
    console.log("Adding new user:", newUser)
    setShowAddUserDialog(false)
    setNewUser({
      username: "",
      email: "",
      full_name: "",
      user_type: "office_manager",
      password: "",
    })
  }

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-muted-foreground">
                <span>Admin Panel</span>
                <span className="mx-2">/</span>
                <span className="text-foreground">User Management</span>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                  <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Admin Only
                  </Badge>
                  <Button onClick={() => setShowAddUserDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Total Users</p>
                        <p className="text-2xl font-bold">{mockUsers.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Active Users</p>
                        <p className="text-2xl font-bold">{mockUsers.filter(u => u.is_active).length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">Admins</p>
                        <p className="text-2xl font-bold">{mockUsers.filter(u => u.user_type === "admin").length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium">Managers</p>
                        <p className="text-2xl font-bold">{mockUsers.filter(u => u.user_type === "office_manager").length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Management Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>System Users</CardTitle>
                      <CardDescription>Manage user accounts and access permissions</CardDescription>
                    </div>
                    <div className="relative w-80">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Actions</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Operations</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              {user.is_active ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{user.full_name}</p>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span>{user.email}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">@{user.username}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={user.user_type === "admin" ? "destructive" : "secondary"}
                              >
                                {user.user_type === "admin" ? "Administrator" : "Manager"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.last_login}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-medium">{user.total_actions}</span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.created_at.split(" ")[0]}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setEditingUser(user)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* User Permissions Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Permission Matrix</CardTitle>
                  <CardDescription>Overview of user roles and their access permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-red-600 mb-2">Administrator Permissions</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Full system access</li>
                          <li>• User management</li>
                          <li>• Inventory control</li>
                          <li>• All reports & analytics</li>
                          <li>• Manager oversight</li>
                          <li>• System configuration</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium text-blue-600 mb-2">Manager Permissions</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Customer management</li>
                          <li>• Order processing</li>
                          <li>• Job card tracking</li>
                          <li>• Invoice generation</li>
                          <li>• Time tracking</li>
                          <li>• Basic reports (limited)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>

        {/* Add User Dialog */}
        <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account with appropriate permissions</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="johndoe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@autocare.co.tz"
                />
              </div>

              <div>
                <Label htmlFor="user_type">User Role</Label>
                <Select
                  value={newUser.user_type}
                  onValueChange={(value) => setNewUser(prev => ({ ...prev, user_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office_manager">Office Manager</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="password">Initial Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Create secure password"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthWrapper>
  )
}
