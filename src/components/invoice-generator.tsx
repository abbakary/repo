"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CalendarDays, Save, X, Search, FileText, DollarSign } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface InvoiceGeneratorProps {
  onClose: () => void
  onGenerate: (invoiceData: any) => void
}

// Mock data for completed job cards ready for invoicing
const mockCompletedJobCards = [
  {
    id: 5,
    job_card_number: "JC-2024-005",
    customer_id: 1,
    customer_name: "John Mwalimu",
    work_description: "Brake system overhaul",
    completion_date: "2024-01-22",
    estimated_cost: 95000,
    parts_cost: 65000,
    labor_cost: 30000,
    status: "completed"
  },
  {
    id: 6,
    job_card_number: "JC-2024-006",
    customer_id: 2,
    customer_name: "Tanzania Revenue Authority",
    work_description: "Fleet maintenance - 3 vehicles",
    completion_date: "2024-01-21",
    estimated_cost: 450000,
    parts_cost: 280000,
    labor_cost: 170000,
    status: "completed"
  },
  {
    id: 7,
    job_card_number: "JC-2024-007",
    customer_id: 3,
    customer_name: "Mama Fatuma",
    work_description: "Chain and sprocket replacement",
    completion_date: "2024-01-20",
    estimated_cost: 35000,
    parts_cost: 25000,
    labor_cost: 10000,
    status: "completed"
  },
]

const mockCustomers = [
  { id: 1, name: "John Mwalimu", customer_code: "CUST001", customer_type: "personal", payment_terms: 15 },
  { id: 2, name: "Tanzania Revenue Authority", customer_code: "CUST002", customer_type: "government", payment_terms: 30 },
  { id: 3, name: "Mama Fatuma", customer_code: "CUST003", customer_type: "bodaboda", payment_terms: 7 },
]

export function InvoiceGenerator({ onClose, onGenerate }: InvoiceGeneratorProps) {
  const [generationType, setGenerationType] = useState<"job_card" | "manual">("job_card")
  const [selectedJobCard, setSelectedJobCard] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [subtotal, setSubtotal] = useState("")
  const [taxRate, setTaxRate] = useState("18")
  const [discountAmount, setDiscountAmount] = useState("0")
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [paymentTerms, setPaymentTerms] = useState("15")
  const [notes, setNotes] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredJobCards = mockCompletedJobCards.filter(jc =>
    jc.job_card_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jc.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jc.work_description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedJobCardData = mockCompletedJobCards.find(jc => jc.id.toString() === selectedJobCard)
  const selectedCustomer = mockCustomers.find(c => c.id.toString() === customerId)

  const handleJobCardSelect = (jobCardId: string) => {
    setSelectedJobCard(jobCardId)
    const jobCard = mockCompletedJobCards.find(jc => jc.id.toString() === jobCardId)
    if (jobCard) {
      setCustomerId(jobCard.customer_id.toString())
      setSubtotal(jobCard.estimated_cost.toString())
      
      // Set due date based on customer payment terms
      const customer = mockCustomers.find(c => c.id === jobCard.customer_id)
      if (customer) {
        setPaymentTerms(customer.payment_terms.toString())
        const due = new Date(invoiceDate)
        due.setDate(due.getDate() + customer.payment_terms)
        setDueDate(due)
      }
    }
  }

  const handleCustomerSelect = (customerId: string) => {
    setCustomerId(customerId)
    const customer = mockCustomers.find(c => c.id.toString() === customerId)
    if (customer) {
      setPaymentTerms(customer.payment_terms.toString())
      const due = new Date(invoiceDate)
      due.setDate(due.getDate() + customer.payment_terms)
      setDueDate(due)
    }
  }

  const calculateTaxAmount = () => {
    const sub = parseFloat(subtotal) || 0
    const discount = parseFloat(discountAmount) || 0
    const rate = parseFloat(taxRate) || 0
    return ((sub - discount) * rate / 100)
  }

  const calculateTotalAmount = () => {
    const sub = parseFloat(subtotal) || 0
    const discount = parseFloat(discountAmount) || 0
    const tax = calculateTaxAmount()
    return sub - discount + tax
  }

  const handleGenerate = () => {
    const invoiceData = {
      job_card_id: generationType === "job_card" ? parseInt(selectedJobCard) : null,
      customer_id: parseInt(customerId),
      status: "draft",
      subtotal: parseFloat(subtotal) || 0,
      tax_rate: parseFloat(taxRate) || 0,
      tax_amount: calculateTaxAmount(),
      discount_amount: parseFloat(discountAmount) || 0,
      total_amount: calculateTotalAmount(),
      paid_amount: 0,
      balance_due: calculateTotalAmount(),
      invoice_date: format(invoiceDate, "yyyy-MM-dd"),
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      payment_method: null,
      payment_reference: null,
      generated_by: 1, // Current user ID
    }

    onGenerate(invoiceData)
  }

  const isFormValid = () => {
    if (generationType === "job_card") {
      return selectedJobCard && customerId && subtotal && parseFloat(subtotal) > 0
    } else {
      return customerId && subtotal && parseFloat(subtotal) > 0
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Invoice
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Generation Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Type</CardTitle>
              <CardDescription>Choose how to generate the invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={generationType === "job_card" ? "default" : "outline"}
                  onClick={() => setGenerationType("job_card")}
                  className="h-20 flex flex-col gap-2"
                >
                  <FileText className="h-6 w-6" />
                  <span>From Job Card</span>
                  <span className="text-xs opacity-70">Generate from completed work</span>
                </Button>
                <Button
                  type="button"
                  variant={generationType === "manual" ? "default" : "outline"}
                  onClick={() => setGenerationType("manual")}
                  className="h-20 flex flex-col gap-2"
                >
                  <DollarSign className="h-6 w-6" />
                  <span>Manual Invoice</span>
                  <span className="text-xs opacity-70">Create custom invoice</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Source Selection */}
            <div className="space-y-6">
              {generationType === "job_card" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Job Card</CardTitle>
                    <CardDescription>Choose from completed job cards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Search Job Cards</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search by job card, customer, or work..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {filteredJobCards.map((jobCard) => (
                        <div
                          key={jobCard.id}
                          className={`p-3 border rounded cursor-pointer hover:bg-muted ${
                            selectedJobCard === jobCard.id.toString() ? "border-primary bg-primary/5" : ""
                          }`}
                          onClick={() => handleJobCardSelect(jobCard.id.toString())}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{jobCard.job_card_number}</div>
                              <div className="text-sm text-muted-foreground">{jobCard.customer_name}</div>
                              <div className="text-sm text-muted-foreground">{jobCard.work_description}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">TSH {jobCard.estimated_cost.toLocaleString()}</div>
                              <Badge variant="secondary" className="text-xs">
                                {jobCard.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedJobCardData && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-800">Selected Job Card</h4>
                        <div className="text-sm text-green-700 space-y-1">
                          <div><strong>Job Card:</strong> {selectedJobCardData.job_card_number}</div>
                          <div><strong>Customer:</strong> {selectedJobCardData.customer_name}</div>
                          <div><strong>Work:</strong> {selectedJobCardData.work_description}</div>
                          <div><strong>Amount:</strong> TSH {selectedJobCardData.estimated_cost.toLocaleString()}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Selection</CardTitle>
                    <CardDescription>Select customer for manual invoice</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Customer</Label>
                      <Select value={customerId} onValueChange={handleCustomerSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCustomers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id.toString()}>
                              <div className="flex justify-between items-center w-full">
                                <span>{customer.name}</span>
                                <Badge variant="secondary" className="ml-2">
                                  {customer.customer_type}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedCustomer && (
                      <div className="p-3 bg-muted rounded-md">
                        <h4 className="font-medium">{selectedCustomer.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedCustomer.customer_code}</p>
                        <p className="text-sm text-muted-foreground">
                          Payment Terms: {selectedCustomer.payment_terms} days
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Invoice Dates */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Dates</CardTitle>
                  <CardDescription>Set invoice and due dates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Invoice Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {format(invoiceDate, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={invoiceDate}
                            onSelect={(date) => date && setInvoiceDate(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={dueDate}
                            onSelect={setDueDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label>Payment Terms (days)</Label>
                    <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="15">15 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="45">45 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Financial Details */}
            <div className="space-y-6">
              {/* Financial Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Details</CardTitle>
                  <CardDescription>Set amounts and calculations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Subtotal (TSH) *</Label>
                    <Input
                      type="number"
                      value={subtotal}
                      onChange={(e) => setSubtotal(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tax Rate (%)</Label>
                      <Select value={taxRate} onValueChange={setTaxRate}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0% (Exempt)</SelectItem>
                          <SelectItem value="18">18% (Standard VAT)</SelectItem>
                          <SelectItem value="10">10% (Reduced)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Discount Amount (TSH)</Label>
                      <Input
                        type="number"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 p-4 bg-muted rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>TSH {(parseFloat(subtotal) || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Discount:</span>
                      <span>-TSH {(parseFloat(discountAmount) || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax ({taxRate}%):</span>
                      <span>TSH {calculateTaxAmount().toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total:</span>
                      <span>TSH {calculateTotalAmount().toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>Notes and terms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Invoice Notes</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes or terms..."
                      rows={4}
                    />
                  </div>

                  {selectedJobCardData && (
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Work Description:</strong></p>
                      <p>{selectedJobCardData.work_description}</p>
                      <p className="mt-2"><strong>Completion Date:</strong> {selectedJobCardData.completion_date}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Generation Summary */}
              {isFormValid() && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800">Invoice Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-green-700 space-y-2">
                    <div><strong>Customer:</strong> {selectedCustomer?.name}</div>
                    <div><strong>Invoice Date:</strong> {format(invoiceDate, "PPP")}</div>
                    <div><strong>Due Date:</strong> {dueDate ? format(dueDate, "PPP") : "Not set"}</div>
                    <div><strong>Total Amount:</strong> TSH {calculateTotalAmount().toLocaleString()}</div>
                    {generationType === "job_card" && selectedJobCardData && (
                      <div><strong>Job Card:</strong> {selectedJobCardData.job_card_number}</div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={!isFormValid()}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
