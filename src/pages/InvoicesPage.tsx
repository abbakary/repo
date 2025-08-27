import { useState, useEffect } from "react"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { DashboardHeader } from "../components/dashboard-header"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Plus, Search, Filter, Eye, Download, DollarSign, AlertTriangle, Calendar, FileText, CheckCircle, Send, Printer } from "lucide-react"
import { InvoiceDetails } from "../components/invoice-details"
import { PaymentForm } from "../components/payment-form"
import { InvoiceGenerator } from "../components/invoice-generator"
import { InvoiceAnalytics } from "../components/invoice-analytics"
import type { Invoice } from "../lib/types"

// Enhanced mock data for invoices - connected to our order management system
const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoice_number: "INV-2024-001",
    job_card_id: 1,
    customer_id: 1,
    status: "paid",
    subtotal: 120000,
    tax_rate: 18.0,
    tax_amount: 21600,
    discount_amount: 0,
    total_amount: 141600,
    paid_amount: 141600,
    balance_due: 0,
    invoice_date: "2024-01-20",
    due_date: "2024-02-04",
    paid_date: "2024-01-22",
    payment_method: "Cash",
    payment_reference: "CASH-001",
    generated_by: 1,
    created_at: "2024-01-20T10:30:00",
    updated_at: "2024-01-22T14:20:00",
  },
  {
    id: 2,
    invoice_number: "INV-2024-002",
    job_card_id: 2,
    customer_id: 2,
    status: "sent",
    subtotal: 320000,
    tax_rate: 18.0,
    tax_amount: 57600,
    discount_amount: 16000,
    total_amount: 361600,
    paid_amount: 0,
    balance_due: 361600,
    invoice_date: "2024-01-19",
    due_date: "2024-02-18",
    payment_method: null,
    payment_reference: null,
    generated_by: 1,
    created_at: "2024-01-19T14:15:00",
    updated_at: "2024-01-19T14:15:00",
  },
  {
    id: 3,
    invoice_number: "INV-2024-003",
    job_card_id: 3,
    customer_id: 3,
    status: "overdue",
    subtotal: 85000,
    tax_rate: 18.0,
    tax_amount: 15300,
    discount_amount: 4250,
    total_amount: 96050,
    paid_amount: 50000,
    balance_due: 46050,
    invoice_date: "2024-01-10",
    due_date: "2024-01-25",
    payment_method: "Partial - M-Pesa",
    payment_reference: "MP240110001",
    generated_by: 1,
    created_at: "2024-01-10T09:20:00",
    updated_at: "2024-01-15T16:45:00",
  },
  {
    id: 4,
    invoice_number: "INV-2024-004",
    job_card_id: 4,
    customer_id: 1,
    status: "draft",
    subtotal: 95000,
    tax_rate: 18.0,
    tax_amount: 17100,
    discount_amount: 0,
    total_amount: 112100,
    paid_amount: 0,
    balance_due: 112100,
    invoice_date: "2024-01-22",
    due_date: "2024-02-06",
    payment_method: null,
    payment_reference: null,
    generated_by: 1,
    created_at: "2024-01-22T11:00:00",
    updated_at: "2024-01-22T11:00:00",
  },
]

// Mock data for related entities
const mockCustomers = [
  { id: 1, name: "John Mwalimu", customer_code: "CUST001", phone: "+255 712 345 678", customer_type: "personal" },
  { id: 2, name: "Tanzania Revenue Authority", customer_code: "CUST002", phone: "+255 22 211 1111", customer_type: "government" },
  { id: 3, name: "Mama Fatuma", customer_code: "CUST003", phone: "+255 754 987 654", customer_type: "bodaboda" },
]

const mockJobCards = [
  { id: 1, job_card_number: "JC-2024-001", work_description: "Car service - Oil change and brake inspection" },
  { id: 2, job_card_number: "JC-2024-002", work_description: "Tire sales - 4 Michelin tires installation" },
  { id: 3, job_card_number: "JC-2024-003", work_description: "Engine diagnostic and minor repair" },
  { id: 4, job_card_number: "JC-2024-004", work_description: "Brake system overhaul" },
]

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCustomerType, setSelectedCustomerType] = useState("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false)
  const [activeTab, setActiveTab] = useState("invoices")
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)

  const filteredInvoices = invoices.filter((invoice) => {
    const customer = mockCustomers.find(c => c.id === invoice.customer_id)
    const jobCard = mockJobCards.find(jc => jc.id === invoice.job_card_id)
    
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobCard?.job_card_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || invoice.status === selectedStatus
    const matchesCustomerType = selectedCustomerType === "all" || customer?.customer_type === selectedCustomerType
    
    return matchesSearch && matchesStatus && matchesCustomerType
  })

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowInvoiceDetails(true)
  }

  const handleRecordPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowPaymentForm(true)
  }

  const handleInvoiceUpdate = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === updatedInvoice.id ? updatedInvoice : inv
    ))
  }

  const handleSendInvoice = async (invoiceId: number) => {
    try {
      // Update invoice status to sent
      setInvoices(prev => prev.map(inv => 
        inv.id === invoiceId ? { ...inv, status: "sent", updated_at: new Date().toISOString() } : inv
      ))
      
      // Show success notification
      alert("Invoice sent successfully!")
    } catch (error) {
      console.error("Error sending invoice:", error)
    }
  }

  const getInvoiceStats = () => {
    const stats = {
      total: invoices.length,
      draft: invoices.filter(inv => inv.status === "draft").length,
      sent: invoices.filter(inv => inv.status === "sent").length,
      paid: invoices.filter(inv => inv.status === "paid").length,
      overdue: invoices.filter(inv => inv.status === "overdue").length,
    }
    return stats
  }

  const getFinancialSummary = () => {
    const totalRevenue = invoices
      .filter(inv => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.total_amount, 0)
    
    const pendingAmount = invoices
      .filter(inv => inv.status === "sent")
      .reduce((sum, inv) => sum + inv.balance_due, 0)
    
    const overdueAmount = invoices
      .filter(inv => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.balance_due, 0)
    
    const draftAmount = invoices
      .filter(inv => inv.status === "draft")
      .reduce((sum, inv) => sum + inv.total_amount, 0)

    return { totalRevenue, pendingAmount, overdueAmount, draftAmount }
  }

  const invoiceStats = getInvoiceStats()
  const financialSummary = getFinancialSummary()

  const formatCurrency = (amount: number) => `TSH ${amount.toLocaleString()}`
  const isOverdue = (dueDate: string, status: string) => 
    status !== "paid" && new Date(dueDate) < new Date()

  const getCustomerName = (customerId: number) => {
    const customer = mockCustomers.find(c => c.id === customerId)
    return customer?.name || "Unknown Customer"
  }

  const getCustomerInfo = (customerId: number) => {
    return mockCustomers.find(c => c.id === customerId)
  }

  const getJobCardInfo = (jobCardId: number) => {
    return mockJobCards.find(jc => jc.id === jobCardId)
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Financial Management</span>
              <span className="mx-2">/</span>
              <span className="text-foreground">Invoicing & Payments</span>
            </div>

            {/* Header Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Invoice Management</h1>
                <p className="text-muted-foreground">Track payments, manage invoices, and analyze financial performance</p>
              </div>
              <Button onClick={() => setShowInvoiceGenerator(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>
            </div>

            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="invoices">Invoice Management</TabsTrigger>
                <TabsTrigger value="analytics">Financial Analytics</TabsTrigger>
                <TabsTrigger value="reports">Payment Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="invoices" className="space-y-6">
                {/* Financial Summary */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(financialSummary.totalRevenue)}
                          </div>
                          <p className="text-sm text-muted-foreground">Total Revenue</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(financialSummary.pendingAmount)}
                          </div>
                          <p className="text-sm text-muted-foreground">Pending Payments</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <div className="text-2xl font-bold text-red-600">
                            {formatCurrency(financialSummary.overdueAmount)}
                          </div>
                          <p className="text-sm text-muted-foreground">Overdue Amount</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="text-2xl font-bold text-gray-600">
                            {formatCurrency(financialSummary.draftAmount)}
                          </div>
                          <p className="text-sm text-muted-foreground">Draft Invoices</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Status Overview */}
                <div className="grid gap-4 md:grid-cols-5">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary">{invoiceStats.total}</div>
                      <p className="text-sm text-muted-foreground">Total Invoices</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-600">{invoiceStats.draft}</div>
                      <p className="text-sm text-muted-foreground">Draft</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">{invoiceStats.sent}</div>
                      <p className="text-sm text-muted-foreground">Sent</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">{invoiceStats.paid}</div>
                      <p className="text-sm text-muted-foreground">Paid</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-red-600">{invoiceStats.overdue}</div>
                      <p className="text-sm text-muted-foreground">Overdue</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Search and Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Search & Filter Invoices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search by invoice number, customer, job card, or payment reference..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedCustomerType} onValueChange={setSelectedCustomerType}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Customer Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="ngo">NGO</SelectItem>
                          <SelectItem value="bodaboda">Bodaboda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Invoices List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Invoices ({filteredInvoices.length} invoices)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[12%]">Invoice</TableHead>
                            <TableHead className="w-[18%]">Customer</TableHead>
                            <TableHead className="w-[12%] hidden lg:table-cell">Job Card</TableHead>
                            <TableHead className="w-[12%]">Amount</TableHead>
                            <TableHead className="w-[10%] hidden md:table-cell">Paid</TableHead>
                            <TableHead className="w-[10%] hidden md:table-cell">Balance</TableHead>
                            <TableHead className="w-[10%] hidden lg:table-cell">Due Date</TableHead>
                            <TableHead className="w-[10%]">Status</TableHead>
                            <TableHead className="w-[16%]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInvoices.map((invoice) => {
                            const customer = getCustomerInfo(invoice.customer_id)
                            const jobCard = getJobCardInfo(invoice.job_card_id)
                            
                            return (
                              <TableRow key={invoice.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{invoice.invoice_number}</div>
                                    <div className="text-sm text-muted-foreground">{invoice.invoice_date}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{customer?.name}</div>
                                    <div className="text-sm text-muted-foreground capitalize">
                                      {customer?.customer_type} • {customer?.customer_code}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  <Button variant="link" className="p-0 h-auto">
                                    {jobCard?.job_card_number || "N/A"}
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{formatCurrency(invoice.total_amount)}</div>
                                    {invoice.discount_amount > 0 && (
                                      <div className="text-sm text-muted-foreground">
                                        Discount: {formatCurrency(invoice.discount_amount)}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{formatCurrency(invoice.paid_amount)}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <span className={`font-medium ${
                                    invoice.balance_due > 0 ? "text-red-600" : "text-green-600"
                                  }`}>
                                    {formatCurrency(invoice.balance_due)}
                                  </span>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  <div className={isOverdue(invoice.due_date, invoice.status) ? "text-red-600" : ""}>
                                    {invoice.due_date}
                                    {isOverdue(invoice.due_date, invoice.status) && (
                                      <AlertTriangle className="h-4 w-4 inline ml-1" />
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={statusColors[invoice.status]}>
                                    {invoice.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice)}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Printer className="h-4 w-4" />
                                    </Button>
                                    {invoice.status === "draft" && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleSendInvoice(invoice.id)}
                                        className="text-blue-600"
                                      >
                                        <Send className="h-4 w-4" />
                                      </Button>
                                    )}
                                    {invoice.balance_due > 0 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRecordPayment(invoice)}
                                        className="text-green-600 hover:text-green-700"
                                      >
                                        <DollarSign className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <InvoiceAnalytics invoices={invoices} />
              </TabsContent>

              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Reports</CardTitle>
                    <CardDescription>Detailed payment and collection reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Payment reports functionality coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Invoice Details Modal */}
      {showInvoiceDetails && selectedInvoice && (
        <InvoiceDetails
          invoice={selectedInvoice}
          onClose={() => {
            setShowInvoiceDetails(false)
            setSelectedInvoice(null)
          }}
          onUpdate={handleInvoiceUpdate}
        />
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && selectedInvoice && (
        <PaymentForm
          invoice={selectedInvoice}
          onClose={() => {
            setShowPaymentForm(false)
            setSelectedInvoice(null)
          }}
          onSave={(payment) => {
            console.log("Recording payment:", payment)
            // Update invoice with payment
            const updatedInvoice = {
              ...selectedInvoice,
              paid_amount: selectedInvoice.paid_amount + payment.amount,
              balance_due: selectedInvoice.balance_due - payment.amount,
              status: (selectedInvoice.balance_due - payment.amount) === 0 ? "paid" : selectedInvoice.status,
              paid_date: (selectedInvoice.balance_due - payment.amount) === 0 ? new Date().toISOString().split('T')[0] : selectedInvoice.paid_date,
              payment_method: payment.method,
              payment_reference: payment.reference,
              updated_at: new Date().toISOString(),
            }
            handleInvoiceUpdate(updatedInvoice)
            setShowPaymentForm(false)
            setSelectedInvoice(null)
          }}
        />
      )}

      {/* Invoice Generator Modal */}
      {showInvoiceGenerator && (
        <InvoiceGenerator
          onClose={() => setShowInvoiceGenerator(false)}
          onGenerate={(invoiceData) => {
            const newInvoice: Invoice = {
              id: invoices.length + 1,
              invoice_number: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
              ...invoiceData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            setInvoices(prev => [...prev, newInvoice])
            setShowInvoiceGenerator(false)
          }}
        />
      )}
    </div>
  )
}
