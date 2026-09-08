import { useRef, useState } from 'react'

import { CameraIcon, FileTextIcon, PlusIcon } from 'lucide-react'
import {
  CreateUploadUrlMutation,
  CreateUploadUrlMutationVariables,
  DeleteReceiptMutation,
  DeleteReceiptMutationVariables,
} from 'types/graphql'

import { gql, TypedDocumentNode, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { Button } from 'src/components/ui/Button'
import useLoader from 'src/hooks/useLoader'

const CREATE_UPLOAD_URL_MUTATION: TypedDocumentNode<
  CreateUploadUrlMutation,
  CreateUploadUrlMutationVariables
> = gql`
  mutation CreateUploadUrlMutation($contentType: String!) {
    createUploadUrl(contentType: $contentType) {
      uploadUrl
      fileUrl
      fileName
    }
  }
`

const DELETE_RECEIPT_MUTATION: TypedDocumentNode<
  DeleteReceiptMutation,
  DeleteReceiptMutationVariables
> = gql`
  mutation DeleteReceiptMutation($id: Int!, $url: String!) {
    deleteReceipt(id: $id, url: $url) {
      id
    }
  }
`

const MAX_FILE_SIZE = 10 * 1024 * 1024

interface UploadRecieptsProps {
  receiptUrl: string
  fileName: string
  fileType: string
  id: number
  setReceiptUrl: (url: string) => void
  setFileName: (fileName: string) => void
  setFileType: (fileType: string) => void
}

export default function UploadReciepts({
  receiptUrl,
  fileName,
  fileType,
  id,
  setReceiptUrl,
  setFileName,
  setFileType,
}: UploadRecieptsProps) {
  const { showLoader, hideLoader, Loader } = useLoader()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const [deleteReceipt] = useMutation(DELETE_RECEIPT_MUTATION, {
    onCompleted: () => {
      toast.success('Receipt deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL_MUTATION)

  const isGcsUrl = receiptUrl.includes('storage.googleapis.com/')
  const isImage = fileType.startsWith('image/')

  const onReplaceClick = async () => {
    const receiptId = id || 0
    showLoader()
    try {
      await deleteReceipt({ variables: { id: receiptId, url: receiptUrl } })
    } finally {
      hideLoader()
    }
    setReceiptUrl('')
    setFileName('')
    setFileType('')
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    // Reset so selecting the same file again re-triggers onChange
    event.target.value = ''
    if (!file) return

    if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      toast.error('Only images and PDFs can be uploaded as receipts')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('The file is too large. Maximum size is 10 MB.')
      return
    }

    try {
      setUploading(true)
      showLoader()
      const { data } = await createUploadUrl({
        variables: { contentType: file.type },
      })
      const { uploadUrl, fileUrl } = data.createUploadUrl

      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!response.ok) {
        throw new Error(`Upload failed (${response.status})`)
      }

      setReceiptUrl(fileUrl)
      setFileName(file.name)
      setFileType(file.type)
      toast.success('Receipt uploaded')
    } catch (error) {
      // fetch throws TypeError on network/CORS failures
      if (error instanceof TypeError) {
        toast.error(
          'Could not reach the upload destination. Ask your admin to verify the storage bucket CORS configuration.'
        )
      } else {
        toast.error(
          error instanceof Error ? error.message : 'Receipt upload failed'
        )
      }
    } finally {
      setUploading(false)
      hideLoader()
    }
  }

  return (
    <div className="relative">
      <Loader />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
        data-testid="file-input"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        data-testid="camera-input"
      />

      {!receiptUrl && (
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="dotted"
            className="flex-1"
            type="button"
            disabled={uploading}
          >
            <span>
              {' '}
              <PlusIcon />{' '}
            </span>
            Upload Receipt
          </Button>
          <Button
            onClick={() => cameraInputRef.current?.click()}
            variant="dotted"
            size="icon"
            type="button"
            aria-label="Take a photo of the receipt"
            disabled={uploading}
          >
            <CameraIcon />
          </Button>
        </div>
      )}

      {receiptUrl && (
        <div className="mt-4">
          <h3 className="rw-label">Receipt Preview</h3>
          <div className="mx-auto w-full max-w-sm">
            {isGcsUrl && isImage && (
              <img
                src={receiptUrl}
                alt="Receipt preview"
                className="h-auto w-full rounded-lg object-contain shadow-md"
              />
            )}
            {isGcsUrl && !isImage && (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border p-4 hover:bg-accent"
              >
                <FileTextIcon className="size-6 shrink-0" />
                <span className="break-all text-sm underline">
                  {fileName || 'Open receipt (PDF)'}
                </span>
              </a>
            )}
            {!isGcsUrl && (
              <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                Receipt unavailable (stored with a previous file service)
              </div>
            )}
            <Button
              onClick={onReplaceClick}
              className="mt-2 w-full"
              variant="destructive"
              type="button"
            >
              Replace Image
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
