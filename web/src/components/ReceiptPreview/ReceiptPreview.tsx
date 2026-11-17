import { useEffect, useState } from 'react'

import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

import Spinner from 'src/components/ui/Spinner'
import { isPdf } from 'src/lib/receipt'
import { cn } from 'src/utils/cn'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

interface ReceiptPreviewProps {
  url: string
  fileType?: string
  fileName?: string
  /** Applied to the rendered page images. PDFs render page-by-page. */
  className?: string
  /**
   * When provided, the preview becomes a trigger for a bigger view instead
   * of (or in addition to) showing itself inline: an image becomes
   * clickable, and a PDF gets a "View" link next to its "open in new tab"
   * link.
   */
  onView?: () => void
}

/**
 * Renders each PDF page to an image. An <iframe> with the browser's PDF
 * viewer cannot be rasterized on paper (Chromium prints it as a black box)
 * and shows scrollbars in a fixed container; page images solve both.
 */
const PdfPreview = ({ url, className }: { url: string; className?: string }) => {
  const [pages, setPages] = useState<string[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const loadingTask = pdfjsLib.getDocument(url)
    ;(async () => {
      try {
        const doc = await loadingTask.promise
        const images: string[] = []
        for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
          const page = await doc.getPage(pageNumber)
          const base = page.getViewport({ scale: 1 })
          const viewport = page.getViewport({
            scale: Math.min(2, 900 / base.width),
          })
          const canvas = document.createElement('canvas')
          canvas.width = Math.floor(viewport.width)
          canvas.height = Math.floor(viewport.height)
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('Canvas 2D context unavailable')
          // JPEG has no alpha channel: start from white so the page
          // background doesn't turn black
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          await page.render({ canvasContext: ctx, viewport }).promise
          images.push(canvas.toDataURL('image/jpeg', 0.85))
        }
        if (!cancelled) setPages(images)
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()
    return () => {
      cancelled = true
      loadingTask.destroy()
    }
  }, [url])

  if (failed) {
    // Last resort: the embedded viewer (screen only, still unprintable)
    return (
      <iframe
        src={`${url}#view=FitH`}
        title="Receipt PDF"
        className="h-[50vh] max-h-[24rem] w-full rounded-lg border print:hidden"
      />
    )
  }

  if (pages === null) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {pages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Receipt page ${index + 1}`}
          className={cn('w-full', className)}
        />
      ))}
    </div>
  )
}

const ReceiptPreview = ({
  url,
  fileType,
  fileName,
  className,
  onView,
}: ReceiptPreviewProps) => {
  if (isPdf(fileType ?? '') || isPdf(url)) {
    return (
      <div className="flex flex-col gap-1">
        <PdfPreview url={url} className={className} />
        <p className="mb-2 flex items-center justify-between gap-2 px-1 text-xs text-muted-foreground print:hidden">
          <span>
            PDF &middot;{' '}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all underline"
            >
              {fileName || 'Open in a new tab'}
            </a>
          </span>
          {onView && (
            <button
              type="button"
              onClick={onView}
              className="shrink-0 underline"
            >
              View
            </button>
          )}
        </p>
      </div>
    )
  }

  const img = (
    <img src={url} alt={fileName || 'Receipt'} className={className} />
  )

  if (onView) {
    return (
      <button type="button" onClick={onView} className="block text-left">
        {img}
      </button>
    )
  }

  return img
}

export default ReceiptPreview
