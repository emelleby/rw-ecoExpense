import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  mockGraphQLMutation,
  render,
  screen,
  waitFor,
} from '@redwoodjs/testing/web'
import { toast } from '@redwoodjs/web/toast'

import UploadReciepts from './UploadReciepts'

jest.mock('@redwoodjs/web/toast', () => {
  return {
    toast: { success: jest.fn(), error: jest.fn() },
    Toaster: () => null,
  }
})

const GCS_URL =
  'https://storage.googleapis.com/ecoexpense-receipts/receipts/test-uuid.jpeg'
const LEGACY_URL = 'https://cdn.filestackcontent.com/AbCdEf123'

const defaultProps = {
  receiptUrl: '',
  fileName: '',
  fileType: '',
  id: 0,
  setReceiptUrl: jest.fn(),
  setFileName: jest.fn(),
  setFileType: jest.fn(),
}

describe('UploadReciepts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders successfully', () => {
    expect(() => render(<UploadReciepts {...defaultProps} />)).not.toThrow()
  })

  it('shows the upload and camera buttons when no receipt is set', () => {
    render(<UploadReciepts {...defaultProps} />)

    expect(screen.getByText('Upload Receipt')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Take a photo of the receipt')
    ).toBeInTheDocument()
  })

  it('uploads an image via a signed URL and sets the receipt state', async () => {
    mockGraphQLMutation('CreateUploadUrlMutation', {
      createUploadUrl: {
        uploadUrl: 'https://signed.url/put',
        fileUrl: GCS_URL,
        fileName: 'receipts/test-uuid.jpeg',
      },
    })
    // Only intercept the PUT to the signed URL; let GraphQL requests
    // through to the MSW-mocked Apollo link
    const realFetch = global.fetch
    global.fetch = jest.fn(((input: RequestInfo, init?: RequestInit) => {
      if (init?.method === 'PUT') {
        return Promise.resolve({ ok: true })
      }
      return realFetch(input, init)
    }) as typeof fetch) as jest.Mock

    render(<UploadReciepts {...defaultProps} />)

    const file = new File(['image-data'], 'receipt.png', {
      type: 'image/png',
    })
    await userEvent.upload(screen.getByTestId('file-input'), file)

    await waitFor(() => {
      expect(defaultProps.setReceiptUrl).toHaveBeenCalledWith(GCS_URL)
    })
    expect(toast.success).toHaveBeenCalledWith('Receipt uploaded')
    expect(defaultProps.setFileName).toHaveBeenCalledWith('receipt.png')
    expect(defaultProps.setFileType).toHaveBeenCalledWith('image/png')
    expect(global.fetch).toHaveBeenCalledWith(
      'https://signed.url/put',
      expect.objectContaining({ method: 'PUT' })
    )
    const putCall = (global.fetch as jest.Mock).mock.calls.find(
      ([, init]) => init?.method === 'PUT'
    ) as unknown as [string, RequestInit]
    expect(putCall[0]).toEqual('https://signed.url/put')
    expect(putCall[1].headers['Content-Type']).toEqual('image/png')
    expect(putCall[1].body).toEqual(file)

    global.fetch = realFetch
  })

  it('rejects files larger than 10 MB', async () => {
    render(<UploadReciepts {...defaultProps} />)

    const file = new File(['data'], 'big.png', { type: 'image/png' })
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 })
    await userEvent.upload(screen.getByTestId('file-input'), file)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'The file is too large. Maximum size is 10 MB.'
      )
    })
    expect(defaultProps.setReceiptUrl).not.toHaveBeenCalled()
    expect(defaultProps.setFileName).not.toHaveBeenCalled()
    expect(defaultProps.setFileType).not.toHaveBeenCalled()
  })

  it('rejects files that are not images or PDFs', async () => {
    render(<UploadReciepts {...defaultProps} />)

    const file = new File(['text'], 'notes.txt', { type: 'text/plain' })
    // fireEvent instead of userEvent.upload, which filters by accept
    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Only images and PDFs can be uploaded as receipts'
      )
    })
    expect(defaultProps.setReceiptUrl).not.toHaveBeenCalled()
    expect(defaultProps.setFileType).not.toHaveBeenCalled()
  })

  it('shows an image preview for GCS receipts', () => {
    render(
      <UploadReciepts
        {...defaultProps}
        receiptUrl={GCS_URL}
        fileName="receipt.png"
        fileType="image/png"
        id={5}
      />
    )

    const image = screen.getByAltText('Receipt preview')
    expect(image).toHaveAttribute('src', GCS_URL)
    expect(screen.getByText('Replace Image')).toBeInTheDocument()
  })

  it('shows a link preview for GCS PDF receipts', () => {
    render(
      <UploadReciepts
        {...defaultProps}
        receiptUrl={GCS_URL.replace('jpeg', 'pdf')}
        fileName="receipt.pdf"
        fileType="application/pdf"
        id={5}
      />
    )

    const link = screen.getByText('receipt.pdf').closest('a')
    expect(link).toHaveAttribute('href', GCS_URL.replace('jpeg', 'pdf'))
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('shows a placeholder for legacy Filestack URLs', () => {
    render(
      <UploadReciepts
        {...defaultProps}
        receiptUrl={LEGACY_URL}
        fileName="old.png"
        fileType="image/png"
        id={5}
      />
    )

    expect(screen.getByText(/Receipt unavailable/)).toBeInTheDocument()
    expect(screen.queryByAltText('Receipt preview')).not.toBeInTheDocument()
  })

  it('clears the receipt state when Replace is clicked', async () => {
    mockGraphQLMutation('DeleteReceiptMutation', {
      deleteReceipt: { id: 5 },
    })

    render(
      <UploadReciepts
        {...defaultProps}
        receiptUrl={GCS_URL}
        fileName="receipt.png"
        fileType="image/png"
        id={5}
      />
    )

    await userEvent.click(screen.getByText('Replace Image'))

    await waitFor(() => {
      expect(defaultProps.setReceiptUrl).toHaveBeenCalledWith('')
    })
    expect(defaultProps.setFileName).toHaveBeenCalledWith('')
    expect(defaultProps.setFileType).toHaveBeenCalledWith('')
  })
})
