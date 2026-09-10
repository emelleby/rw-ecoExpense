import { Loader2 } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { Button } from 'src/components/ui/Button'

interface SaveButtonProps {
  saving?: boolean
  loading?: boolean
}

const SaveButton = ({ saving, loading }: SaveButtonProps) => {
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
      {busy ? 'Saving...' : 'Save'}
    </Button>
  )
}

export default SaveButton
