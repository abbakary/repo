"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface PaymentFormProps {
  invoice: any
  onClose: () => void
  onSave: (payment: any) => void
}

export function PaymentForm({ invoice, onClose, onSave }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    amount: invoice.balance_due,
    payment_method: "",
    payment_reference: "",
    payment_date: new Date(),
    notes: "",
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      invoice_id: invoice.id,
      ...formData,
    })
  }

  const formatCurrency = (amount: number) => {
    return `TSH ${amount.toLocaleString()}`
  }

  const isFullPayment = formData.amount >= invoice.balance_due
  const isPartialPayment = formData.amount > 0 && formData.amount < invoice.balance_due

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Record Payment
          </DialogTitle>
          <DialogDescription>Record a payment for invoice {invoice.invoice_number}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Invoice Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-medium">{invoice.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Invoice Number:</span>
                  <span className="font-medium">{invoice.invoice_number}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium">{formatCurrency(invoice.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-medium text-green-600">{formatCurrency(invoice.paid_amount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Balance Due:</span>
                  <span className="text-red-600">{formatCurrency(invoice.balance_due)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Payment Amount (TSH) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      max={invoice.balance_due}
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", Number.parseFloat(e.target.value) || 0)}
                      placeholder="Enter amount"
                      required
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Maximum: {formatCurrency(invoice.balance_due)}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="payment_method">Payment Method *</Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(value) => handleInputChange("payment_method", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="mpesa">M-Pesa</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="tigopesa">Tigo Pesa</SelectItem>
                        <SelectItem value="airtelmoney">Airtel Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payment_reference">Payment Reference</Label>
                    <Input
                      id="payment_reference"
                      value={formData.payment_reference}
                      onChange={(e) => handleInputChange("payment_reference", e.target.value)}
                      placeholder="Transaction ID, cheque number, etc."
                    />
                  </div>

                  <div>
                    <Label>Payment Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.payment_date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.payment_date ? format(formData.payment_date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.payment_date}
                          onSelect={(date) => handleInputChange("payment_date", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Payment Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Any additional notes about this payment..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Payment Amount:</span>
                  <span className="font-medium text-green-600">{formatCurrency(formData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Balance:</span>
                  <span className="font-medium">
                    {formatCurrency(Math.max(0, invoice.balance_due - formData.amount))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Type:</span>
                  <span className="font-medium">
                    {isFullPayment ? (
                      <span className="text-green-600">Full Payment</span>
                    ) : isPartialPayment ? (
                      <span className="text-orange-600">Partial Payment</span>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </span>
                </div>
                {isFullPayment && (
                  <div className="text-sm text-green-600 font-medium">✓ This payment will mark the invoice as PAID</div>
                )}
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={!formData.amount || !formData.payment_method}
            >
              Record Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
