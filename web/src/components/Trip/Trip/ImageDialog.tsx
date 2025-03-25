import React, { useState } from 'react'

import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/Dialog'

interface ImageDialogProps {
  imageUrl: string // URL of the image to display
  title?: string // Optional title for the dialog
  // trigger: React.ReactNode; // Custom trigger component (e.g., a button)
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  imageUrl,
  title = 'Image Preview',
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <div className="mt-4 flex justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Preview"
              className="h-auto max-w-full rounded-md shadow-lg"
            />
          ) : (
            <p>No image available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageDialog
