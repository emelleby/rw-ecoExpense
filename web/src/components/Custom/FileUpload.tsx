import { useState, useRef } from 'react'

import { Camera, Upload } from 'lucide-react'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

// import { createReceipt } from 'src/services/receipts/receipts'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface FileUploadProps {
  onUpload: (fileUrl: string) => void
  expenseId: number
}

const CREATE_RECEIPT_MUTATION = gql`
  mutation CreateReceiptMutation($input: ReceiptInput!) {
    createReceipt(input: $input) {
      id
      url
      fileName
      fileType
    }
  }
`

const FileUpload = ({ onUpload, expenseId }: FileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null)
  // const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [createReceipt] = useMutation(CREATE_RECEIPT_MUTATION)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 1. Store file and show preview

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      setLoading(true)
      // 2. Get signed URL
      console.log('Getting signed URL...')
      const urlResponse = await fetch(
        'http://localhost:8910/.redwood/functions/uploadUrl'
      )
      console.log('URL Response:', urlResponse)

      // Log the raw response text
      const responseText = await urlResponse.text()
      console.log('Raw response:', responseText)

      // Parse JSON after examining the response
      const responseData = JSON.parse(responseText)
      const { uploadUrl, fileUrl } = responseData

      console.log('Upload URL:', uploadUrl)
      console.log('File URL:', fileUrl)

      console.log('Uploading to Google Storage...')
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })
      console.log('Upload response:', uploadResponse)

      // 4. Create receipt record
      const result = await createReceipt({
        variables: {
          input: {
            url: fileUrl,
            fileName: file.name,
            fileType: file.type,
            expenseId,
          },
        },
      })

      // 5. Update form with receipt reference
      onUpload(result.data.createReceipt.id)

      toast.success('Upload completed successfully')
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Something went wrong: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // const FileUpload = ({ onUpload, expenseId }: FileUploadProps) => {
  //   const [preview, setPreview] = useState<string | null>(null)
  //   const [selectedFile, setSelectedFile] = useState<File | null>(null)
  //   const [loading, setLoading] = useState(false)
  //   const fileInputRef = useRef<HTMLInputElement>(null)
  //   const [createReceipt] = useMutation(CREATE_RECEIPT_MUTATION)

  //   const handleFileChange = async (
  //     event: React.ChangeEvent<HTMLInputElement>
  //   ) => {
  //     const file = event.target.files?.[0]
  //     if (!file) return

  //     // Store the file
  //     setSelectedFile(file)

  //     // Show preview
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
  //       setPreview(reader.result as string)
  //     }
  //     reader.readAsDataURL(file)

  //     //
  //     const handleSubmit = async () => {
  //       if (!selectedFile) return

  //       try {
  //         setLoading(true)
  //         // // Get signed URL
  //         // const urlResponse = await fetch('/api/functions/uploadUrl')
  //         // const { uploadUrl, fileUrl } = await urlResponse.json()

  //         // // Upload file directly to Google Cloud Storage
  //         // await fetch(uploadUrl, {
  //         //   method: 'PUT',
  //         //   body: file,
  //         //   headers: {
  //         //     'Content-Type': file.type,
  //         //   },
  //         // })
  //         // onUpload(fileUrl)

  //         const result = await createReceipt({
  //           variables: {
  //             input: {
  //               file,
  //               expenseId,
  //             },
  //           },
  //         })

  //         onUpload(result.data.createReceipt.url)

  //         // const result = await createReceipt({
  //         //   file: selectedFile,
  //         //   expenseId,
  //         // })
  //         // onUpload(result.url)

  //         toast.success('Upload completed successfully')
  //       } catch (error) {
  //         console.error('Upload failed:', error)
  //         toast.error('Something went wrong: ' + error.message)
  //       } finally {
  //         setLoading(false)
  //       }
  //     }
  //   }

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      <div className="flex space-x-4">
        <Button
          type="button" // Add this
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          disabled={loading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose File
        </Button>

        <Button
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.setAttribute('capture', 'environment')
              fileInputRef.current.click()
            }
          }}
          variant="outline"
          disabled={loading}
        >
          <Camera className="mr-2 h-4 w-4" />
          Take Photo
        </Button>
      </div>

      {loading && (
        <div className="text-sm text-muted-foreground">Uploading...</div>
      )}

      {preview && (
        <div className="mt-4 rounded-lg border">
          <img
            src={preview}
            alt="Receipt preview"
            className="max-h-[200px] rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  )
}

export default FileUpload
