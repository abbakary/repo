"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Download, Printer, Send, DollarSign, Calendar, User, FileText } from "lucide-react"

interface InvoiceDetailsProps {
  invoice: any
  onClose: () => void
}

// Mock invoice line items
const mockLineItems = [
  {
    id: 1,
    description: "Oil Change Service",
    quantity: 1,
    unit_price: 45000,
    total_price: 45000,
  },
  {
    id: 2,
    description: "Brake Pad Replacement",
    quantity: 1,
    unit_price: 85000,
    total_price: 85000,
  },
  {
    id: 3,
    description: "Engine Oil - 5W30",
    quantity: 4,
    unit_price: 8750,
    total_price: 35000,
  },
]

const mockPaymentHistory = [
  {
    id: 1,
    date: "2024-01-22",
    amount: 100000,
    method: "Cash",
    reference: "CASH-001",
    notes: "Partial payment",
  },
  {
    id: 2,
    date: "2024-01-25",
    amount: 41600,
    method: "M-Pesa",
    reference: "MP240125001",
    notes: "Final payment",
  },
]

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-red-100 text-red-800",
}

export function InvoiceDetails({ invoice, onClose }: InvoiceDetailsProps) {
  const [activeTab, setActiveTab] = useState("details")

  const formatCurrency = (amount: number) => {
    return `TSH ${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB")
  }

  const isOverdue = () => {
    return invoice.status !== "paid" && new Date(invoice.due_date) < new Date()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{invoice.invoice_number}</DialogTitle>
              <p className="text-muted-foreground">
                {invoice.customer_name} - {formatDate(invoice.invoice_date)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusColors[invoice.status as keyof typeof statusColors]}>
                {invoice.status.toUpperCase()}
              </Badge>
              {isOverdue() && <Badge className="bg-red-100 text-red-800">OVERDUE</Badge>}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            {invoice.status === "draft" && (
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send Invoice
              </Button>
            )}
            {invoice.balance_due > 0 && (
              <Button className="bg-green-600 hover:bg-green-700">
                <DollarSign className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            )}
          </div>

          {/* Invoice Header Information */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">{invoice.customer_name}</span>
                </div>
                <div className="text-sm text-muted-foreground capitalize">{invoice.customer_type} Customer</div>
                <div className="text-sm">
                  <span className="font-medium">Job Card:</span> {invoice.job_card_number}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Invoice Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Invoice Date:</span>
                  <span className="font-medium">{formatDate(invoice.invoice_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Due Date:</span>
                  <span className={`font-medium ${isOverdue() ? "text-red-600" : ""}`}>
                    {formatDate(invoice.due_date)}
                  </span>
                </div>
                {invoice.paid_date && (
                  <div className="flex justify-between">
                    <span className="text-sm">Paid Date:</span>
                    <span className="font-medium text-green-600">{formatDate(invoice.paid_date)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm">Generated By:</span>
                  <span className="font-medium">{invoice.generated_by}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Line Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.total_price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              {/* Invoice Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(invoice.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>VAT ({invoice.tax_rate}%):</span>
                  <span>{formatCurrency(invoice.tax_amount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(invoice.total_amount)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Amount Paid:</span>
                  <span>{formatCurrency(invoice.paid_amount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Balance Due:</span>
                  <span className={invoice.balance_due > 0 ? "text-red-600" : "text-green-600"}>
                    {formatCurrency(invoice.balance_due)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          {invoice.paid_amount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPaymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{payment.reference}</TableCell>
                        <TableCell>{payment.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Company Information Footer */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-bold text-lg">AutoCare Tanzania</h3>
                <p className="text-sm text-muted-foreground">Professional Car Service & Maintenance</p>
                <p className="text-sm text-muted-foreground">
                  Dar es Salaam, Tanzania | Phone: +255 123 456 789 | Email: info@autocare.co.tz
                </p>
                <p className="text-xs text-muted-foreground">VAT Registration: 123-456-789</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
