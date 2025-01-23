//import { useState } from 'react'

import * as fileStack from 'filestack-js'
//import { PickerInline } from 'filestack-react'
import { PlusIcon } from 'lucide-react'
import {
  DeleteReceiptMutation,
  DeleteReceiptMutationVariables,
} from 'types/graphql'

import { TypedDocumentNode, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { Button } from 'src/components/ui/button'
import useLoader from 'src/hooks/useLoader'

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
  id,
  setReceiptUrl,
  setFileName,
  setFileType,
}: UploadRecieptsProps) {
  const client = fileStack.init(process.env.REDWOOD_ENV_FILESTACK_API_KEY)

  const { showLoader, hideLoader } = useLoader()

  const [deleteReceipt] = useMutation(DELETE_RECEIPT_MUTATION, {
    onCompleted: () => {
      toast.success('Receipt deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onReplaceClick = async () => {
    const receiptId = id || 0
    showLoader()
    await deleteReceipt({ variables: { id: receiptId, url: receiptUrl } })
    hideLoader()
    setReceiptUrl('')
    setFileName('')
    setFileType('')
  }

  const handleUpload = async () => {
    try {
      await client
        .picker({
          onUploadDone: (res) => {
            console.log('Upload successful:', res)

            const file = res.filesUploaded[0]

            setReceiptUrl(file.url)
            setFileName(file.filename)
            setFileType(file.mimetype)

            // Handle uploaded file data here
          },
        })
        .open()
    } catch (error) {
      console.error('Error during upload:', error)
    }
  }

  const thumbnail = (url, width = 2 * 384) => {
    const parts = url.split('/')
    parts.splice(3, 0, `resize=width:${width}`)
    return parts.join('/')
  }

  return (
    <div>
      {!receiptUrl && (
        <Button
          onClick={(e) => {
            e.preventDefault()
            handleUpload()
          }}
          variant="dotted"
          className="w-full"
        >
          <span>
            {' '}
            <PlusIcon />{' '}
          </span>
          Upload Receipt
        </Button>
      )}
      {receiptUrl && (
        <div className="mt-4">
          <h3 className="rw-label">Receipt Preview</h3>
          <div className="mx-auto w-full max-w-sm">
            <img
              src={thumbnail(receiptUrl)}
              alt="Receipt preview"
              className="h-auto w-full rounded-lg object-contain shadow-md"
            />
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
