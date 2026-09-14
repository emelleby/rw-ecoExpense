import { useState } from 'react'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { Button } from 'src/components/ui/Button'
import { Input } from 'src/components/ui/Input'
import { Label } from 'src/components/ui/Label'

const UPDATE_MY_BANK_ACCOUNT = gql`
  mutation UpdateMyBankAccount($input: UpdateBankAccountInput!) {
    updateMyBankAccount(input: $input) {
      id
      bankAccount
      iban
      swiftBic
      internationalAccountName
      internationalBankAddress
    }
  }
`

interface BankDetailsProps {
  user: {
    bankAccount?: string | null
    iban?: string | null
    swiftBic?: string | null
    internationalAccountName?: string | null
    internationalBankAddress?: string | null
  }
}

const BankDetails = ({ user }: BankDetailsProps) => {
  const [bankAccount, setBankAccount] = useState(user.bankAccount ?? '')
  const [iban, setIban] = useState(user.iban ?? '')
  const [swiftBic, setSwiftBic] = useState(user.swiftBic ?? '')
  const [internationalAccountName, setInternationalAccountName] = useState(
    user.internationalAccountName ?? ''
  )
  const [internationalBankAddress, setInternationalBankAddress] = useState(
    user.internationalBankAddress ?? ''
  )
  const [saving, setSaving] = useState(false)

  const [updateMyBankAccount] = useMutation(UPDATE_MY_BANK_ACCOUNT)

  const onSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      await updateMyBankAccount({
        variables: {
          input: {
            bankAccount,
            iban,
            swiftBic,
            internationalAccountName,
            internationalBankAddress,
          },
        },
      })
      toast.success('Bank details updated')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update bank details')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="bankAccount">Bank account</Label>
        <Input
          id="bankAccount"
          value={bankAccount}
          onChange={(e) => setBankAccount(e.target.value)}
          placeholder="Your domestic bank account number"
        />
        <p className="text-sm text-slate-500">
          Used for reimbursements paid directly from a domestic bank.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-slate-200 p-4">
        <div>
          <h3 className="mb-1 text-lg font-medium text-foreground">
            International bank details
          </h3>
          <p className="text-sm text-slate-500">
            Used for international transfers, for example a Wise or other
            foreign account. This can be a different account than your domestic
            bank account.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="internationalAccountName">Name</Label>
            <Input
              id="internationalAccountName"
              value={internationalAccountName}
              onChange={(e) => setInternationalAccountName(e.target.value)}
              placeholder="Name on the account"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              placeholder="e.g. BE09 9679 4746 6357"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="swiftBic">Swift/BIC</Label>
            <Input
              id="swiftBic"
              value={swiftBic}
              onChange={(e) => setSwiftBic(e.target.value)}
              placeholder="e.g. TRWIBEB1XXX"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="internationalBankAddress">Bank address</Label>
            <Input
              id="internationalBankAddress"
              value={internationalBankAddress}
              onChange={(e) => setInternationalBankAddress(e.target.value)}
              placeholder="Address of the bank holding the account"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Save bank details'}
      </Button>
    </form>
  )
}

export default BankDetails
