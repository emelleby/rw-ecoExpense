import { useState } from 'react'

import { PlusCircle, Users } from 'lucide-react'

import CustomerDialog from 'src/components/Profile/Customers/CustomerDialog'
import CustomerRatesCell, {
  type Rate,
} from 'src/components/Profile/Customers/CustomerRatesCell'
import CustomersCell, {
  type Customer,
} from 'src/components/Profile/Customers/CustomersCell'
import RatesDialog from 'src/components/Profile/Customers/RatesDialog/RatesDialog'

import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'

// Layout and dialog state only; data lives in the cells and dialogs.
const Customers = () => {
  // undefined = closed, null = create, Customer = edit
  const [editing, setEditing] = useState<Customer | null | undefined>()

  const [ratesDialogOpen, setRatesDialogOpen] = useState(false)
  const [rateFormDialogOpen, setRateFormDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  )
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null)

  const handleViewRates = (customer: Customer) => {
    setSelectedCustomer(customer)
    setRatesDialogOpen(true)
  }

  const handleEditRate = (rate: Rate) => {
    setSelectedRate(rate)
    setRateFormDialogOpen(true)
  }

  const handleRateFormComplete = () => {
    setSelectedRate(null)
    setRateFormDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="text-lg font-medium">Your Customers</span>
        </div>
        <Button size="sm" onClick={() => setEditing(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <CustomersCell onEdit={setEditing} onViewRates={handleViewRates} />

      <CustomerDialog
        open={editing !== undefined}
        onOpenChange={(open) => !open && setEditing(undefined)}
        customer={editing}
      />

      {/* Rates Dialog */}
      {selectedCustomer && (
        <Dialog
          open={ratesDialogOpen}
          onOpenChange={(open) => {
            setRatesDialogOpen(open)
            if (!open) {
              setSelectedCustomer(null)
              setSelectedRate(null)
              setRateFormDialogOpen(false)
            }
          }}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Rates for {selectedCustomer.name}</DialogTitle>
              <DialogDescription>
                Manage rates for this customer. You can add, edit, or delete
                rates.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="mb-4 flex items-center justify-start">
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedRate(null) // Ensure we're in create mode
                    setRateFormDialogOpen(true) // Open the rate form dialog
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Rate
                </Button>
              </div>

              <CustomerRatesCell
                customerId={selectedCustomer.id}
                onEdit={handleEditRate}
              />

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setRatesDialogOpen(false)
                    setSelectedCustomer(null)
                    setSelectedRate(null)
                  }}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Rate Edit/Create Dialog */}
      {selectedCustomer && (
        <RatesDialog
          open={rateFormDialogOpen}
          onOpenChange={(open: boolean) => {
            setRateFormDialogOpen(open)
            if (!open) {
              setSelectedRate(null)
            }
          }}
          customerId={selectedCustomer.id}
          customerName={selectedCustomer.name}
          rate={selectedRate || undefined}
          onComplete={handleRateFormComplete}
        />
      )}
    </div>
  )
}

export default Customers
