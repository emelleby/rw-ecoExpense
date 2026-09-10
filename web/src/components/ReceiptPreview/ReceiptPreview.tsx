import { isPdf } from 'src/lib/receipt'

interface ReceiptPreviewProps {
  url: string
  fileType?: string
  fileName?: string
  /** Applied to the <img>. PDFs render in a fixed-height inline viewer. */
  className?: string
}

const ReceiptPreview = ({
  url,
  fileType,
  fileName,
  className,
}: ReceiptPreviewProps) => {
  if (isPdf(fileType ?? '') || isPdf(url)) {
    return (
      <div className="flex flex-col gap-1">
        {/* An <iframe> triggers the browser's built-in PDF viewer for
            cross-origin URLs, where <object>/<embed> often do not. */}
        <iframe
          src={`${url}#view=FitH`}
          title={fileName || 'Receipt PDF'}
          className="h-[70vh] max-h-[32rem] w-full rounded-lg border"
        />
        <p className="text-xs text-muted-foreground">
          PDF &middot;{' '}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all underline"
          >
            {fileName || 'Open in a new tab'}
          </a>
        </p>
      </div>
    )
  }

  return <img src={url} alt={fileName || 'Receipt'} className={className} />
}

export default ReceiptPreview
