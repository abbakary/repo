import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { Badge } from "./ui/badge"
import { Plus, Trash2, ArrowLeft, ArrowRight, Save, User, Car, Wrench, FileText } from "lucide-react"

interface MultiStepCustomerFormProps {
  onClose: () => void
  onSave: (data: any) => void
  customer?: any
}

interface Vehicle {
  plate_number: string
  make: string
  model: string
  vehicle_type: string
}

interface TireService {
  item_name: string
  brand: string
  quantity: number
  tire_type: string
}

interface CarService {
  service_types: string[]
  vehicle_id: string
  problem_description: string
  estimated_duration: number
  priority: string
}

interface InquiryDetails {
  inquiry_type: string
  questions: string
  contact_preference: string
  follow_up_date?: string
}

export function MultiStepCustomerForm({ onClose, onSave, customer }: MultiStepCustomerFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [savedCustomerId, setSavedCustomerId] = useState<string | null>(null)

  const [customerData, setCustomerData] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    address: customer?.address || "",
    notes: customer?.notes || "",
  })

  const [serviceIntent, setServiceIntent] = useState<"service" | "inquiry" | "">("")

  const [serviceType, setServiceType] = useState<"tire_sales" | "car_service" | "">("")

  const [customerType, setCustomerType] = useState("")
  const [businessInfo, setBusinessInfo] = useState({
    business_name: "",
    tax_number: "",
    is_owner: true,
  })

  const [personalSubType, setPersonalSubType] = useState<"owner" | "driver" | "">("") // For personal customer sub-type

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      plate_number: "",
      make: "",
      model: "",
      vehicle_type: "",
    },
  ])

  // Service Details
  const [tireService, setTireService] = useState<TireService>({
    item_name: "",
    brand: "",
    quantity: 1,
    tire_type: "",
  })

  const [carService, setCarService] = useState<CarService>({
    service_types: [],
    vehicle_id: "",
    problem_description: "",
    estimated_duration: 60,
    priority: "medium",
  })

  const [inquiryDetails, setInquiryDetails] = useState<InquiryDetails>({
    inquiry_type: "",
    questions: "",
    contact_preference: "phone",
    follow_up_date: undefined,
  })

  const steps = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Service Intent", icon: Car },
    { id: 3, title: "Service Type", icon: Wrench },
    { id: 4, title: "Details & Review", icon: FileText },
  ]


  const saveCurrentStep = () => {
    const stepData = {
      step: currentStep,
      customerData,
      customerType,
      businessInfo,
      vehicles,
      serviceIntent,
      serviceType,
      tireService,
      carService,
      inquiryDetails,
      savedAt: new Date().toISOString(),
    }

    try {
      // Save to localStorage with a unique key
      const draftKey = `customer-draft-${customerData.phone || Date.now()}`
      localStorage.setItem(draftKey, JSON.stringify(stepData))

      // Show success feedback
      alert("Progress saved successfully! You can continue later.")
      console.log("Progress saved:", stepData)
    } catch (error) {
      console.error("Error saving progress:", error)
      alert("Failed to save progress. Please try again.")
    }
  }

  const handleCustomerInputChange = (field: string, value: string | boolean) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }))
  }

  const handleVehicleChange = (index: number, field: string, value: string) => {
    setVehicles((prev) => prev.map((vehicle, i) => (i === index ? { ...vehicle, [field]: value } : vehicle)))
  }

  const addVehicle = () => {
    setVehicles((prev) => [
      ...prev,
      {
        plate_number: "",
        make: "",
        model: "",
        vehicle_type: "",
      },
    ])
  }

  const removeVehicle = (index: number) => {
    setVehicles((prev) => prev.filter((_, i) => i !== index))
  }

  const saveCustomerOnly = () => {
    // Save customer data and get ID for later use
    const customerId = `CUST-${Date.now()}`
    setSavedCustomerId(customerId)
    // Here you would typically save to database
    console.log("[v0] Customer saved:", { ...customerData, vehicles, id: customerId })
  }

  const handleServiceTypeChange = (type: "tire_sales" | "car_service" | "inquiry") => {
    setServiceType(type)
    if (type === "inquiry") {
      setCustomerData((prev) => ({ ...prev, is_inquiry_only: true }))
    }
  }

  const handleTireServiceChange = (field: string, value: string | number) => {
    setTireService((prev) => ({ ...prev, [field]: value }))
  }

  const handleCarServiceChange = (field: string, value: any) => {
    setCarService((prev) => ({ ...prev, [field]: value }))
  }

  const handleInquiryChange = (field: string, value: string) => {
    setInquiryDetails((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinalSubmit = () => {
    // Validate required fields
    if (!customerData.name || !customerData.phone) {
      alert("Please fill in required customer information (Name and Phone)")
      return
    }

    if (serviceIntent === "service" && !serviceType) {
      alert("Please select a service type")
      return
    }

    if (serviceType === "tire_sales" && (!tireService.item_name || !tireService.brand)) {
      alert("Please fill in tire service details")
      return
    }

    if (serviceType === "car_service" && carService.service_types.length === 0) {
      alert("Please select at least one service type for car service")
      return
    }

    // Create comprehensive data structure
    const finalData = {
      customer: {
        ...customerData,
        customer_type: customerType,
        business_info: (customerType === "government" || customerType === "ngo" || customerType === "private") ? businessInfo : null,
        is_owner: customerType === "personal" ? personalSubType === "owner" : undefined,
        personal_sub_type: customerType === "personal" ? personalSubType : undefined,
        vehicles: serviceType === "car_service" ? vehicles : [],
        id: `CUST-${Date.now()}`,
        customer_code: `CUST${String(Date.now()).slice(-6)}`,
        registration_date: new Date().toISOString().split('T')[0],
        is_active: true,
        total_visits: 0,
        total_spent: 0,
      },
      order: serviceIntent === "service" ? {
        id: `ORD-${Date.now()}`,
        order_number: `ORD${String(Date.now()).slice(-6)}`,
        order_type: serviceType === "tire_sales" ? "sales" : "service",
        status: "created",
        priority: serviceType === "car_service" ? carService.priority : "normal",
        description: serviceType === "tire_sales"
          ? `Tire Sales: ${tireService.quantity}x ${tireService.brand} ${tireService.item_name}`
          : serviceType === "car_service"
          ? `Car Service: ${carService.service_types.join(", ")}`
          : "General inquiry",
        estimated_completion: serviceType === "car_service"
          ? new Date(Date.now() + carService.estimated_duration * 60000).toISOString()
          : null,
        total_amount: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } : null,
      service_details: {
        service_intent: serviceIntent,
        service_type: serviceType,
        details: serviceType === "tire_sales" ? tireService
               : serviceType === "car_service" ? carService
               : inquiryDetails,
      },
      metadata: {
        created_at: new Date().toISOString(),
        created_by: "current_user", // This should come from user context
        source: "multi_step_form",
        draft_cleared: true,
      }
    }

    try {
      // Clear any saved draft since we're submitting
      if (customerData.phone) {
        const draftKey = `customer-draft-${customerData.phone}`
        localStorage.removeItem(draftKey)
      }

      console.log("Submitting customer and order data:", finalData)

      // Call the parent's onSave function
      onSave(finalData)

      // Success feedback
      alert(`${serviceIntent === "service" ? "Order" : "Inquiry"} created successfully!`)

    } catch (error) {
      console.error("Error submitting data:", error)
      alert("Failed to create order. Please try again.")
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 px-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Customer Information</CardTitle>
                <CardDescription>Enter basic contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerData.name}
                    onChange={(e) => handleCustomerInputChange("name", e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={customerData.phone}
                      onChange={(e) => handleCustomerInputChange("phone", e.target.value)}
                      placeholder="+255 xxx xxx xxx"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerData.email}
                      onChange={(e) => handleCustomerInputChange("email", e.target.value)}
                      placeholder="customer@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={customerData.address}
                    onChange={(e) => handleCustomerInputChange("address", e.target.value)}
                    placeholder="Enter customer address"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={customerData.notes}
                    onChange={(e) => handleCustomerInputChange("notes", e.target.value)}
                    placeholder="Any additional notes about the customer"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What brings you here today?</CardTitle>
                <CardDescription>Select the purpose of your visit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={serviceIntent === "service" ? "default" : "outline"}
                    onClick={() => {
                      setServiceIntent("service")
                      setCurrentStep(3) // Directly go to service type selection
                    }}
                    className="h-20 flex flex-col gap-2"
                  >
                    <Wrench className="h-6 w-6" />
                    <span>I need a service</span>
                  </Button>
                  <Button
                    type="button"
                    variant={serviceIntent === "inquiry" ? "default" : "outline"}
                    onClick={() => {
                      setServiceIntent("inquiry")
                      setServiceType("") // Clear service type since it's inquiry only
                      setCurrentStep(4) // Directly go to inquiry details
                    }}
                    className="h-20 flex flex-col gap-2"
                  >
                    <FileText className="h-6 w-6" />
                    <span>Just an inquiry</span>
                  </Button>
                </div>

                {serviceIntent && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {serviceIntent === "service"
                        ? "Great! We'll help you with your service needs. Click 'Next' to select the type of service."
                        : "No problem! We'll collect your inquiry details and get back to you soon."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            {serviceIntent === "service" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Service Type</CardTitle>
                  <CardDescription>What type of service do you need?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={serviceType === "tire_sales" ? "default" : "outline"}
                      onClick={() => {
                        setServiceType("tire_sales")
                        setCurrentStep(4) // Directly go to details form
                      }}
                      className="h-20 flex flex-col gap-2"
                    >
                      <Car className="h-6 w-6" />
                      <span>Tire Sales</span>
                    </Button>
                    <Button
                      type="button"
                      variant={serviceType === "car_service" ? "default" : "outline"}
                      onClick={() => {
                        setServiceType("car_service")
                        setCurrentStep(4) // Directly go to details form
                      }}
                      className="h-20 flex flex-col gap-2"
                    >
                      <Wrench className="h-6 w-6" />
                      <span>Car Service</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Inquiry Details</CardTitle>
                  <CardDescription>Tell us about your inquiry</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Inquiry Type</Label>
                    <Select
                      value={inquiryDetails.inquiry_type}
                      onValueChange={(value) => setInquiryDetails({ ...inquiryDetails, inquiry_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pricing">Pricing Information</SelectItem>
                        <SelectItem value="services">Available Services</SelectItem>
                        <SelectItem value="appointment">Appointment Booking</SelectItem>
                        <SelectItem value="general">General Question</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Your Questions</Label>
                    <Textarea
                      value={inquiryDetails.questions}
                      onChange={(e) => setInquiryDetails({ ...inquiryDetails, questions: e.target.value })}
                      placeholder="Please describe your inquiry in detail"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            {serviceIntent === "service" && (
              <>
                {serviceType === "car_service" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Type</CardTitle>
                      <CardDescription>This helps us provide better service</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Customer Type</Label>
                        <Select value={customerType} onValueChange={setCustomerType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="government">Government</SelectItem>
                            <SelectItem value="ngo">NGO</SelectItem>
                            <SelectItem value="private">Private Company</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="bodaboda">Bodaboda</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Business fields for organizational customers */}
                      {(customerType === "government" || customerType === "ngo" || customerType === "private") && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Organization Name</Label>
                            <Input
                              value={businessInfo.business_name}
                              onChange={(e) => setBusinessInfo({ ...businessInfo, business_name: e.target.value })}
                              placeholder="Enter organization name"
                            />
                          </div>
                          <div>
                            <Label>Tax Number</Label>
                            <Input
                              value={businessInfo.tax_number}
                              onChange={(e) => setBusinessInfo({ ...businessInfo, tax_number: e.target.value })}
                              placeholder="Enter tax number"
                            />
                          </div>
                        </div>
                      )}

                      {/* Sub-type selection for personal customers */}
                      {customerType === "personal" && (
                        <div>
                          <Label>Customer Sub-Type</Label>
                          <Select value={personalSubType} onValueChange={setPersonalSubType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select if you are the owner or driver" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="owner">Owner</SelectItem>
                              <SelectItem value="driver">Driver</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-1">
                            {personalSubType === "owner" ? "You own the vehicle being serviced" : personalSubType === "driver" ? "You drive but don't own the vehicle" : "Please select your relationship to the vehicle"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Vehicle information for car services */}
                {serviceType === "car_service" && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Vehicle Information</CardTitle>
                      <Button type="button" onClick={addVehicle} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vehicle
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {vehicles.map((vehicle, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Vehicle {index + 1}</h4>
                            {vehicles.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeVehicle(index)}
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label>Plate Number</Label>
                              <Input
                                value={vehicle.plate_number}
                                onChange={(e) => handleVehicleChange(index, "plate_number", e.target.value)}
                                placeholder="T123ABC"
                              />
                            </div>
                            <div>
                              <Label>Make</Label>
                              <Input
                                value={vehicle.make}
                                onChange={(e) => handleVehicleChange(index, "make", e.target.value)}
                                placeholder="Toyota"
                              />
                            </div>
                            <div>
                              <Label>Model</Label>
                              <Input
                                value={vehicle.model}
                                onChange={(e) => handleVehicleChange(index, "model", e.target.value)}
                                placeholder="Corolla"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label>Vehicle Type</Label>
                              <Select
                                value={vehicle.vehicle_type}
                                onValueChange={(value) => handleVehicleChange(index, "vehicle_type", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="car">Car</SelectItem>
                                  <SelectItem value="truck">Truck</SelectItem>
                                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                                  <SelectItem value="bus">Bus</SelectItem>
                                  <SelectItem value="van">Van</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Service details based on type */}
                {serviceType === "tire_sales" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tire Service Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Item Name *</Label>
                          <Select
                            value={tireService.item_name}
                            onValueChange={(value) => handleTireServiceChange("item_name", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select tire item" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All-Season Tire">All-Season Tire</SelectItem>
                              <SelectItem value="Summer Tire">Summer Tire</SelectItem>
                              <SelectItem value="Winter Tire">Winter Tire</SelectItem>
                              <SelectItem value="Performance Tire">Performance Tire</SelectItem>
                              <SelectItem value="Off-Road Tire">Off-Road Tire</SelectItem>
                              <SelectItem value="Eco Tire">Eco Tire</SelectItem>
                              <SelectItem value="Run-Flat Tire">Run-Flat Tire</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Brand *</Label>
                          <Select
                            value={tireService.brand}
                            onValueChange={(value) => handleTireServiceChange("brand", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select brand" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Michelin">Michelin</SelectItem>
                              <SelectItem value="Bridgestone">Bridgestone</SelectItem>
                              <SelectItem value="Continental">Continental</SelectItem>
                              <SelectItem value="Pirelli">Pirelli</SelectItem>
                              <SelectItem value="Goodyear">Goodyear</SelectItem>
                              <SelectItem value="Dunlop">Dunlop</SelectItem>
                              <SelectItem value="Yokohama">Yokohama</SelectItem>
                              <SelectItem value="Hankook">Hankook</SelectItem>
                              <SelectItem value="Toyo">Toyo</SelectItem>
                              <SelectItem value="Kumho">Kumho</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            value={tireService.quantity}
                            onChange={(e) => handleTireServiceChange("quantity", parseInt(e.target.value))}
                            min={1}
                          />
                        </div>
                        <div>
                          <Label>Tire Type</Label>
                          <Select
                            value={tireService.tire_type}
                            onValueChange={(value) => handleTireServiceChange("tire_type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New Tire</SelectItem>
                              <SelectItem value="used">Used Tire</SelectItem>
                              <SelectItem value="refurbished">Refurbished</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {serviceType === "car_service" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Car Service Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Select Service(s)</Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Oil Change",
                            "Engine Diagnostics",
                            "Brake Repair",
                            "Tire Rotation",
                            "Wheel Alignment",
                            "Battery Check",
                            "Fluid Top-Up",
                          ].map((service) => (
                            <div
                              key={service}
                              className="flex items-center space-x-2 border rounded-full px-4 py-2 cursor-pointer hover:bg-muted"
                              onClick={() => {
                                setCarService((prev) => ({
                                  ...prev,
                                  service_types: prev.service_types.includes(service)
                                    ? prev.service_types.filter((s) => s !== service)
                                    : [...prev.service_types, service],
                                }))
                              }}
                            >
                              <Checkbox
                                id={service}
                                checked={carService.service_types.includes(service)}
                                className="pointer-events-none"
                              />
                              <Label htmlFor={service} className="font-normal cursor-pointer">
                                {service}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Problem Description</Label>
                        <Textarea
                          value={carService.problem_description}
                          onChange={(e) => handleCarServiceChange("problem_description", e.target.value)}
                          placeholder="Describe the issue with the vehicle..."
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Estimated Duration (in mins)</Label>
                          <Input
                            type="number"
                            value={carService.estimated_duration}
                            onChange={(e) => handleCarServiceChange("estimated_duration", parseInt(e.target.value))}
                            min={0}
                          />
                        </div>
                        <div>
                          <Label>Priority</Label>
                          <Select
                            value={carService.priority}
                            onValueChange={(value) => handleCarServiceChange("priority", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {serviceIntent === "inquiry" && (
              <Card>
                <CardHeader>
                  <CardTitle>Inquiry Details</CardTitle>
                  <CardDescription>Review the inquiry details before submitting.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="font-semibold">Inquiry Type</Label>
                    <p>{inquiryDetails.inquiry_type}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Questions</Label>
                    <p className="text-sm text-muted-foreground">{inquiryDetails.questions}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Review & Confirm</CardTitle>
                <CardDescription>Please review all the information before saving.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Customer Info Review */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Customer Information</h3>
                    <div className="text-sm">
                      <p>
                        <span className="font-medium">Name:</span> {customerData.name}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {customerData.phone}
                      </p>
                      {customerData.email && (
                        <p>
                          <span className="font-medium">Email:</span> {customerData.email}
                        </p>
                      )}
                      {customerData.address && (
                        <p>
                          <span className="font-medium">Address:</span> {customerData.address}
                        </p>
                      )}
                      {customerData.notes && (
                        <p>
                          <span className="font-medium">Notes:</span> {customerData.notes}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Type:</span> {customerType || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Service Details Review */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Service Details</h3>
                    <div className="text-sm">
                      <p>
                        <span className="font-medium">Intent:</span> {serviceIntent}
                      </p>
                      {serviceIntent === "service" && (
                        <>
                          <p>
                            <span className="font-medium">Service Type:</span> {serviceType}
                          </p>
                          {serviceType === "tire_sales" && (
                            <div className="mt-2 space-y-1">
                              <p className="font-medium">Tire Details:</p>
                              <ul className="list-disc list-inside ml-4">
                                <li>
                                  Item: {tireService.item_name}, Brand: {tireService.brand}
                                </li>
                                <li>
                                  Quantity: {tireService.quantity}, Type: {tireService.tire_type}
                                </li>
                              </ul>
                            </div>
                          )}
                          {serviceType === "car_service" && (
                            <div className="mt-2 space-y-1">
                              <p className="font-medium">Car Service Details:</p>
                              <ul className="list-disc list-inside ml-4">
                                <li>
                                  Services:{" "}
                                  {carService.service_types.length > 0 ? carService.service_types.join(", ") : "N/A"}
                                </li>
                                <li>
                                  Vehicle:{" "}
                                  {vehicles.find((v) => v.plate_number === carService.vehicle_id)?.plate_number || "N/A"}
                                </li>
                                <li>Problem: {carService.problem_description}</li>
                                <li>Priority: {carService.priority}</li>
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                      {serviceIntent === "inquiry" && (
                        <div className="mt-2 space-y-1">
                          <p className="font-medium">Inquiry Details:</p>
                          <p>Type: {inquiryDetails.inquiry_type}</p>
                          <p>Questions: {inquiryDetails.questions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Create New Customer & Service Request</DialogTitle>
          <DialogDescription>
            Use this form to add a new customer and log their service or inquiry.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center cursor-pointer transition-colors ${
                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setCurrentStep(step.id)}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 transition-colors ${
                  currentStep >= step.id ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                }`}
              >
                <step.icon className="h-4 w-4" />
              </div>
              <span className="text-xs text-center">{step.title}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">{renderStepContent()}</div>

        <DialogFooter className="flex flex-col md:flex-row md:justify-between space-x-0 md:space-x-2 space-y-2 md:space-y-0">
          <div className="flex justify-end gap-2 w-full">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
            )}
            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep} disabled={!customerData.name || !customerData.phone}>
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="button" onClick={handleFinalSubmit}>
                <Save className="h-4 w-4 mr-2" />
                Save & Finish
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
