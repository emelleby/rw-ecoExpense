jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}))

jest.mock('src/lib/storage', () => ({
  storage: {
    bucket: jest.fn(),
  },
  bucketName: 'ecoexpense-receipts',
}))

import { SyntaxError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { storage } from 'src/lib/storage'

import {
  receipts,
  receipt,
  createReceipt,
  createUploadUrl,
  deleteReceipt,
  finalizePendingReceipt,
} from './receipts'
import type { StandardScenario } from './receipts.scenarios'

// The service passes `input` straight through to Prisma; the one-to-one
// link needs expenseId even though the SDL ReceiptInput omits it.
const receiptInput = (
  input: Record<string, unknown>
): Parameters<typeof createReceipt>[0]['input'] => input as never

const mockBucket = storage.bucket as jest.Mock
const mockFile = {
  getSignedUrl: jest.fn(),
  delete: jest.fn(),
  copy: jest.fn(),
}

describe('receipts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockBucket.mockReturnValue({ file: () => mockFile })
  })

  scenario('returns all receipts', async (scenario: StandardScenario) => {
    const result = await receipts()

    expect(result.length).toEqual(Object.keys(scenario.receipt).length)
  })

  scenario('returns a single receipt', async (scenario: StandardScenario) => {
    const result = await receipt({ id: scenario.receipt.one.id })

    expect(result).toEqual(scenario.receipt.one)
  })

  scenario('creates a receipt', async (scenario: StandardScenario) => {
    // Receipt.one occupies its expense (one-to-one); free it first
    await db.receipt.delete({ where: { id: scenario.receipt.one.id } })

    const result = await createReceipt({
      input: receiptInput({
        url: 'String',
        fileName: 'String',
        fileType: 'String',
        expenseId: scenario.receipt.one.expenseId,
        updatedAt: '2024-12-08T17:55:56.485Z',
      }),
    })

    expect(result.url).toEqual('String')
    expect(result.fileName).toEqual('String')
    expect(result.fileType).toEqual('String')
    expect(result.expenseId).toEqual(scenario.receipt.one.expenseId)
    expect(result.updatedAt).toEqual(new Date('2024-12-08T17:55:56.485Z'))
  })
})

describe('createUploadUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockBucket.mockReturnValue({ file: () => mockFile })
  })

  it('returns a signed upload URL and public URL for an image', async () => {
    mockFile.getSignedUrl.mockResolvedValueOnce(['https://signed.url/put'])

    const result = await createUploadUrl({ contentType: 'image/jpeg' })

    expect(result).toEqual({
      uploadUrl: 'https://signed.url/put',
      fileUrl:
        'https://storage.googleapis.com/ecoexpense-receipts/receipts/pending/test-uuid-1234.jpeg',
      fileName: 'receipts/pending/test-uuid-1234.jpeg',
    })
  })

  it('requests a v4 write URL with the given content type and a 15 minute expiry', async () => {
    mockFile.getSignedUrl.mockResolvedValueOnce(['https://signed.url/put'])

    await createUploadUrl({ contentType: 'image/png' })

    expect(mockFile.getSignedUrl).toHaveBeenCalledTimes(1)
    const [options] = mockFile.getSignedUrl.mock.calls[0]
    expect(options.version).toEqual('v4')
    expect(options.action).toEqual('write')
    expect(options.contentType).toEqual('image/png')
    expect(options.expires).toBeGreaterThan(Date.now() + 14 * 60 * 1000)
    expect(options.expires).toBeLessThanOrEqual(Date.now() + 15 * 60 * 1000)
  })

  it('uses the pdf extension for PDF uploads', async () => {
    mockFile.getSignedUrl.mockResolvedValueOnce(['https://signed.url/put'])

    const result = await createUploadUrl({ contentType: 'application/pdf' })

    expect(result.fileName).toEqual('receipts/pending/test-uuid-1234.pdf')
    expect(result.fileUrl).toContain('/receipts/pending/test-uuid-1234.pdf')
  })

  it('rejects unsupported content types', async () => {
    await expect(
      createUploadUrl({ contentType: 'text/plain' })
    ).rejects.toThrow('Only images and PDFs can be uploaded as receipts')
    expect(mockFile.getSignedUrl).not.toHaveBeenCalled()
  })
})

describe('finalizePendingReceipt', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockBucket.mockReturnValue({ file: () => mockFile })
    mockFile.copy.mockResolvedValue([{}])
    mockFile.delete.mockResolvedValue([{}])
  })

  it('copies a pending object to the permanent prefix and deletes the pending one', async () => {
    const result = await finalizePendingReceipt(
      'https://storage.googleapis.com/ecoexpense-receipts/receipts/pending/abc.png'
    )

    expect(result).toEqual(
      'https://storage.googleapis.com/ecoexpense-receipts/receipts/abc.png'
    )
    expect(mockFile.copy).toHaveBeenCalledTimes(1)
    expect(mockFile.delete).toHaveBeenCalledWith({ ignoreNotFound: true })
  })

  it('passes through URLs outside the pending prefix', async () => {
    const url =
      'https://storage.googleapis.com/ecoexpense-receipts/receipts/old.png'

    const result = await finalizePendingReceipt(url)

    expect(result).toEqual(url)
    expect(mockFile.copy).not.toHaveBeenCalled()
    expect(mockFile.delete).not.toHaveBeenCalled()
  })

  it('throws a friendly error when the pending object is already gone', async () => {
    mockFile.copy.mockRejectedValueOnce({ code: 404 })

    const promise = finalizePendingReceipt(
      'https://storage.googleapis.com/ecoexpense-receipts/receipts/pending/abc.png'
    )
    await expect(promise).rejects.toThrow(
      'The uploaded receipt has expired and must be uploaded again'
    )
    await expect(promise).rejects.toBeInstanceOf(SyntaxError)
  })

  it('rethrows non-404 copy failures', async () => {
    mockFile.copy.mockRejectedValueOnce(new Error('storage down'))

    await expect(
      finalizePendingReceipt(
        'https://storage.googleapis.com/ecoexpense-receipts/receipts/pending/abc.png'
      )
    ).rejects.toThrow('storage down')
  })

  it('still returns the final URL when deleting the pending object fails', async () => {
    mockFile.delete.mockRejectedValueOnce(new Error('delete failed'))

    const result = await finalizePendingReceipt(
      'https://storage.googleapis.com/ecoexpense-receipts/receipts/pending/abc.png'
    )

    expect(result).toEqual(
      'https://storage.googleapis.com/ecoexpense-receipts/receipts/abc.png'
    )
  })
})

describe('deleteReceipt', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockBucket.mockReturnValue({ file: () => mockFile })
  })

  scenario(
    'deletes the storage object and the DB row for a GCS receipt',
    async (scenario: StandardScenario) => {
      mockFile.delete.mockResolvedValueOnce([{}])

      const result = await deleteReceipt({
        id: scenario.receipt.one.id,
        url: 'https://storage.googleapis.com/ecoexpense-receipts/receipts/abc.jpg',
      })

      expect(mockFile.delete).toHaveBeenCalledWith({ ignoreNotFound: true })
      expect(result).toEqual({
        id: scenario.receipt.one.id,
        success: true,
      })
      const deleted = await receipt({ id: scenario.receipt.one.id })
      expect(deleted).toEqual(null)
    }
  )

  scenario(
    'strips query strings from the URL before deleting the object',
    async (scenario: StandardScenario) => {
      mockFile.delete.mockResolvedValueOnce([{}])

      await deleteReceipt({
        id: scenario.receipt.one.id,
        url: 'https://storage.googleapis.com/ecoexpense-receipts/receipts/abc.jpg?X-Goog-Signature=sig',
      })

      expect(mockBucket).toHaveBeenCalledWith('ecoexpense-receipts')
      expect(mockFile.delete).toHaveBeenCalledTimes(1)
    }
  )

  scenario(
    'still deletes the DB row when the storage object cannot be deleted',
    async (scenario: StandardScenario) => {
      mockFile.delete.mockRejectedValueOnce(new Error('storage down'))

      const result = await deleteReceipt({
        id: scenario.receipt.one.id,
        url: 'https://storage.googleapis.com/ecoexpense-receipts/receipts/abc.jpg',
      })

      expect(result.success).toEqual(true)
      const deleted = await receipt({ id: scenario.receipt.one.id })
      expect(deleted).toEqual(null)
    }
  )

  scenario(
    'skips storage deletion for legacy Filestack URLs',
    async (scenario: StandardScenario) => {
      const result = await deleteReceipt({
        id: scenario.receipt.one.id,
        url: 'https://cdn.filestackcontent.com/AbCdEf123',
      })

      expect(mockFile.delete).not.toHaveBeenCalled()
      expect(result.success).toEqual(true)
      const deleted = await receipt({ id: scenario.receipt.one.id })
      expect(deleted).toEqual(null)
    }
  )

  scenario(
    'only deletes the storage object when the receipt was not saved yet',
    async () => {
      mockFile.delete.mockResolvedValueOnce([{}])

      const result = await deleteReceipt({
        id: 0,
        url: 'https://storage.googleapis.com/ecoexpense-receipts/receipts/unsaved.jpg',
      })

      expect(mockFile.delete).toHaveBeenCalledWith({ ignoreNotFound: true })
      expect(result).toEqual({ success: true })
      expect(result.id).toBeUndefined()
    }
  )

  scenario('does not touch storage when the url is empty', async () => {
    const result = await deleteReceipt({ id: 0, url: '' })

    expect(mockFile.delete).not.toHaveBeenCalled()
    expect(result.success).toEqual(true)
  })
})
