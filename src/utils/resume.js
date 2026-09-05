const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif)(\?|#|$)/i
const PDF_EXT = /\.pdf(\?|#|$)/i
const OFFICE_EXT = /\.(docx?|rtf)(\?|#|$)/i

function driveFileId(url) {
  if (!url) return ''
  const file = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (file) return file[1]
  const id = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  return id?.[1] || ''
}

export function hasResume(url) {
  return Boolean(String(url || '').trim()) && String(url).trim() !== '#'
}

export function resumeKind(url) {
  const value = String(url || '')
  if (!hasResume(value)) return 'none'
  if (driveFileId(value) || /drive\.google\.com/i.test(value)) return 'drive'
  if (IMAGE_EXT.test(value) || /\/image\//i.test(value)) return 'image'
  if (PDF_EXT.test(value) || /application\/pdf/i.test(value)) return 'pdf'
  if (OFFICE_EXT.test(value)) return 'office'
  if (/notion\.(so|site)/i.test(value)) return 'external'
  return 'pdf'
}

export function resumePreviewUrl(url) {
  const id = driveFileId(url)
  if (id) return `https://drive.google.com/file/d/${id}/preview`
  const kind = resumeKind(url)
  if (kind === 'office') {
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`
  }
  return url
}

export function resumeDownloadUrl(url) {
  const id = driveFileId(url)
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`
  return url
}

export function resumeFilename(url, storedName = '') {
  if (storedName?.trim()) return storedName.trim()
  try {
    const path = new URL(url).pathname
    const name = decodeURIComponent(path.split('/').pop() || '')
    if (name && name !== '/') return name.replace(/^\d+-/, '')
  } catch {
    // ignore invalid URLs
  }
  return 'resume.pdf'
}

export async function downloadResume(url, storedName = '') {
  const filename = resumeFilename(url, storedName)
  const href = resumeDownloadUrl(url)

  try {
    const res = await fetch(href)
    if (!res.ok) throw new Error('Could not fetch resume')
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)
  } catch {
    window.open(href, '_blank', 'noopener,noreferrer')
  }
}
