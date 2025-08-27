import { MultiStepCustomerForm } from "./multi-step-customer-form"

interface CustomerFormProps {
  onClose: () => void
  onSave: (customer: any) => void
  customer?: any
}

interface Vehicle {
  plate_number: string
  make: string
  model: string
  year: string
  color: string
  vehicle_type: string
}

export function CustomerForm({ onClose, onSave, customer }: CustomerFormProps) {
  // For backward compatibility, we'll use the multi-step form
  return <MultiStepCustomerForm onClose={onClose} onSave={onSave} customer={customer} />
}
