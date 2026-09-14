import { isPdf } from 'src/lib/receipt'
import { cn } from 'src/utils/cn'

interface ReceiptPreviewProps {
  url: string
  fileType?: string
  fileName?: string
  /** Applied to the <img>. PDFs render in a fixed-height inline viewer. */
  className?: string
  /**
   * When provided, the preview becomes a trigger for a bigger view instead
   * of (or in addition to) showing itself inline: an image becomes
   * clickable, and a PDF gets a "View" link next to its "open in new tab"
   * link — a live iframe is its own browsing context, so clicks inside it
   * never bubble up to a wrapping onClick. Omit when this preview already
   * is the full view (e.g. inside a detail sheet).
   */
  onView?: () => void
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
        {/* An <iframe> triggers the browser's built-in PDF viewer for
            cross-origin URLs, where <object>/<embed> often do not. */}
        <iframe
          src={`${url}#view=FitH`}
          title={fileName || 'Receipt PDF'}
          className={cn(
            'w-full rounded-lg border',
            // Taller in the detail sheet (no onView, it's the full view);
            // the in-page list row stays compact.
            onView
              ? 'h-[50vh] max-h-[24rem] print:h-64'
              : 'h-[80vh] max-h-[48rem]'
          )}
        />
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
