// web/src/components/FileUpload/FileUpload.tsx
import { useState, useRef } from 'react'

const FileUpload = ({ onUpload }) => {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      // Show preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Handle upload
      await handleUpload(file)
    }
  }

  const handleUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      onUpload(data.url)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      <div className="space-x-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Choose File
        </button>

        <button
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.setAttribute('capture', 'environment')
              fileInputRef.current.click()
            }
          }}
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          Take Photo
        </button>
      </div>

      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Preview" className="max-w-xs" />
        </div>
      )}
    </div>
  )
}

export default FileUpload
