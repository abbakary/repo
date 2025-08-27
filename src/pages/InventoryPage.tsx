"use client"

import { useState } from "react"
import { AuthWrapper } from "@/components/auth-wrapper"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Package, AlertTriangle, TrendingUp, Edit, Trash2, XCircle, Shield } from "lucide-react"

// Mock data for inventory items
const mockInventoryItems = [
  {
    id: 1,
    item_code: "TIRE-001",
    name: "Michelin Pilot Sport 4",
    category: "Tires",
    brand: "Michelin",
    size: "205/55R16",
    unit_price: 450000,
    quantity_in_stock: 24,
    minimum_stock_level: 10,
    status: "in_stock",
  },
  {
    id: 2,
    item_code: "OIL-001",
    name: "Engine Oil 5W-30",
    category: "Oils & Fluids",
    brand: "Castrol",
    size: "4L",
    unit_price: 85000,
    quantity_in_stock: 5,
    minimum_stock_level: 15,
    status: "low_stock",
  },
  {
    id: 3,
    item_code: "BRAKE-001",
    name: "Brake Pads Front",
    category: "Brake Parts",
    brand: "Bosch",
    size: "Universal",
    unit_price: 120000,
    quantity_in_stock: 0,
    minimum_stock_level: 8,
    status: "out_of_stock",
  },
  {
    id: 4,
    item_code: "FILTER-001",
    name: "Air Filter",
    category: "Filters",
    brand: "Mann",
    size: "Standard",
    unit_price: 35000,
    quantity_in_stock: 18,
    minimum_stock_level: 12,
    status: "in_stock",
  },
]

const categories = ["All", "Tires", "Oils & Fluids", "Brake Parts", "Filters", "Batteries", "Spark Plugs"]

export default function InventoryPage() {
  const { isAdmin } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showAddItemDialog, setShowAddItemDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  const [newItem, setNewItem] = useState({
    item_code: "",
    name: "",
    category: "",
    brand: "",
    description: "",
    unit_price: 0,
    quantity_in_stock: 0,
    minimum_stock_level: 0,
  })

  const filteredItems = mockInventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.item_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusBadge = (status: string, quantity: number, minLevel: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (quantity <= minLevel) {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          Low Stock
        </Badge>
      )
    } else {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          In Stock
        </Badge>
      )
    }
  }

  const totalItems = mockInventoryItems.length
  const lowStockItems = mockInventoryItems.filter(
    (item) => item.quantity_in_stock <= item.minimum_stock_level && item.quantity_in_stock > 0,
  ).length
  const outOfStockItems = mockInventoryItems.filter((item) => item.quantity_in_stock === 0).length
  const totalValue = mockInventoryItems.reduce((sum, item) => sum + item.unit_price * item.quantity_in_stock, 0)

  const handleAddItem = () => {
    console.log("[v0] Adding new inventory item:", newItem)
    setShowAddItemDialog(false)
    setNewItem({
      item_code: "",
      name: "",
      category: "",
      brand: "",
      description: "",
      unit_price: 0,
      quantity_in_stock: 0,
      minimum_stock_level: 0,
    })
  }

  // Admin access control
  if (!isAdmin) {
    return (
      <AuthWrapper>
        <div className="flex h-screen bg-background">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 flex items-center justify-center p-6">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    Access Restricted
                  </CardTitle>
                  <CardDescription className="text-center">
                    Inventory Management is restricted to Admin users only. This area contains sensitive business data and stock control features.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">Admin Only Feature</p>
                    <p className="text-xs text-red-600 mt-1">
                      Contact your administrator if you need access to inventory functions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </AuthWrapper>
    )
  }

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Manage stock levels, track items, and monitor inventory</p>
        </div>
        <Button onClick={() => setShowAddItemDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items below minimum level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">Items requiring restock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TSH {totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Search and filter your inventory items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Items</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, code, or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Min Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.item_code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.size && <p className="text-sm text-muted-foreground">{item.size}</p>}
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>TSH {item.unit_price.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{item.quantity_in_stock}</TableCell>
                    <TableCell>{item.minimum_stock_level}</TableCell>
                    <TableCell>
                      {getStatusBadge(item.status, item.quantity_in_stock, item.minimum_stock_level)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No inventory items found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>Enter the details for the new inventory item</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="item_code">Item Code</Label>
              <Input
                id="item_code"
                value={newItem.item_code}
                onChange={(e) => setNewItem((prev) => ({ ...prev, item_code: e.target.value }))}
                placeholder="e.g., TIRE-001"
              />
            </div>
            <div>
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Michelin Pilot Sport 4"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newItem.category}
                onValueChange={(value) => setNewItem((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => cat !== "All")
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={newItem.brand}
                onChange={(e) => setNewItem((prev) => ({ ...prev, brand: e.target.value }))}
                placeholder="e.g., Michelin"
              />
            </div>
            <div>
              <Label htmlFor="unit_price">Unit Price (TSH)</Label>
              <Input
                id="unit_price"
                type="number"
                value={newItem.unit_price}
                onChange={(e) => setNewItem((prev) => ({ ...prev, unit_price: Number(e.target.value) }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Initial Stock Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={newItem.quantity_in_stock}
                onChange={(e) => setNewItem((prev) => ({ ...prev, quantity_in_stock: Number(e.target.value) }))}
                placeholder="0"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="minimum_level">Minimum Stock Level</Label>
              <Input
                id="minimum_level"
                type="number"
                value={newItem.minimum_stock_level}
                onChange={(e) => setNewItem((prev) => ({ ...prev, minimum_stock_level: Number(e.target.value) }))}
                placeholder="0"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter item description..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddItemDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
            </div>
          </main>
        </div>
      </div>
    </AuthWrapper>
  )
}
