import { Loader2 } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { Button } from 'src/components/ui/Button'

interface SaveButtonProps {
  saving?: boolean
  loading?: boolean
  /** Text shown when idle; defaults to "Save" */
  label?: string
}

const SaveButton = ({ saving, loading, label = 'Save' }: SaveButtonProps) => {
  const { formState } = useFormContext() ?? {
    formState: { isSubmitting: false },
  }
  const busy = saving || loading || formState.isSubmitting

  return (
    <Button
      type="submit"
      variant="default"
      className="w-full"
      disabled={busy}
      aria-busy={busy}
    >
      {busy && <Loader2 className="animate-spin" />}
      {busy ? 'Saving...' : label}
    </Button>
  )
}

export default SaveButton
