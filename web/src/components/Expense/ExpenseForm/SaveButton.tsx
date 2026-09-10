import { Loader2 } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { Button } from 'src/components/ui/Button'

interface SaveButtonProps {
  loading?: boolean
}

const SaveButton = ({ loading }: SaveButtonProps) => {
  const {
    formState: { isSubmitting },
  } = useFormContext()
  const saving = isSubmitting || loading

  return (
    <Button
      type="submit"
      variant="default"
      className="w-full"
      disabled={saving}
      aria-busy={saving}
    >
      {saving && <Loader2 className="animate-spin" />}
      {saving ? 'Saving...' : 'Save'}
    </Button>
  )
}

export default SaveButton
