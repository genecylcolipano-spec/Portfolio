import { useEffect, useState } from 'react'
import { X, Download, FileText, ExternalLink, Loader2 } from 'lucide-react'
import {
  downloadResume,
  hasResume,
  resumeFilename,
  resumeKind,
  resumePreviewUrl,
} from '../utils/resume'

export default function ResumeViewer({ open, url, filename, onClose }) {
  const [downloading, setDownloading] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)
  const kind = resumeKind(url)
  const preview = resumePreviewUrl(url)
  const name = resumeFilename(url, filename)

  useEffect(() => {
    if (!open) return undefined
    setPreviewFailed(false)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, url])

  if (!open) return null

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadResume(url, filename)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-viewer-title"
    >
      <div
        className="relative w-full max-w-5xl h-[88vh] flex flex-col rounded-2xl border border-white/10 bg-[#0b0b1f] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-white/10 shrink-0">
          <div className="min-w-0">
            <h2 id="resume-viewer-title" className="text-white font-semibold text-sm sm:text-base truncate">
              Resume
            </h2>
            <p className="text-xs text-gray-500 truncate">{name}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {hasResume(url) && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white text-xs sm:text-sm font-medium hover:opacity-90 disabled:opacity-60"
              >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Download
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              aria-label="Close resume"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-[#070716]">
          {!hasResume(url) ? (
            <EmptyState message="No resume has been uploaded yet." />
          ) : previewFailed || kind === 'external' ? (
            <EmptyState
              message="This file cannot be previewed here."
              actionHref={url}
            />
          ) : kind === 'image' ? (
            <div className="h-full overflow-auto p-4 flex justify-center">
              <img
                src={preview}
                alt="Resume"
                onError={() => setPreviewFailed(true)}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          ) : (
            <iframe
              title="Resume preview"
              src={preview}
              className="w-full h-full border-0 bg-white"
              onError={() => setPreviewFailed(true)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message, actionHref }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-6">
      <FileText className="w-10 h-10 text-indigo-300/40" />
      <p className="text-sm text-gray-400">{message}</p>
      {actionHref && (
        <a
          href={actionHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-white"
        >
          Open in a new tab <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  )
}
