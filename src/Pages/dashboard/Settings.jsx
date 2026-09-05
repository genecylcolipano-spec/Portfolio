import { useEffect, useState, useRef } from 'react'
import {
  Settings2, Github, Linkedin, Instagram, Youtube, Globe,
  FileText, Calendar, Save, AlertCircle, CheckCircle2, Loader2,
  User, Briefcase, Type, Quote, Sparkles, Code2, Boxes, Mail, ImagePlus, X, Hash, Upload,
  GraduationCap, Plus, Trash2,
} from 'lucide-react'
import { getSiteConfig, saveSiteConfig, DEFAULT_CONFIG, parseEducation } from '../../utils/siteConfig'
import { supabase } from '../../supabase'

const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const MAX_RESUME_BYTES = 10 * 1024 * 1024
const RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
]
const RESUME_EXT = /\.(pdf|docx?|jpe?g|png|webp)$/i

// ─── tiny shared UI pieces ────────────────────────────────────────────────────

const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.6 5.82a4.28 4.28 0 0 1-1.9-3.32h-3.1v13.2a2.6 2.6 0 1 1-1.86-2.5V9.98a5.7 5.7 0 1 0 4.96 5.65V8.9a7.34 7.34 0 0 0 4.3 1.38V7.18a4.3 4.3 0 0 1-2.4-1.36Z" />
  </svg>
)

const Card = ({ children, className = '' }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500 pointer-events-none" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl">
      {children}
    </div>
  </div>
)

const inputClass =
  'w-full bg-[#0d0d22] border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all'

const Field = ({ label, icon: Icon, value, onChange, placeholder, type = 'text', hint, multiline }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </label>
    {multiline ? (
      <textarea
        rows={4}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} resize-y min-h-[96px]`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    )}
    {hint && <p className="text-xs text-gray-600">{hint}</p>}
  </div>
)

const ProfilePhotoField = ({ value, onChange }) => {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [previewFailed, setPreviewFailed] = useState(!value)

  useEffect(() => {
    setPreviewFailed(!value)
  }, [value])

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploadError('')
    if (!file.type.startsWith('image/')) {
      setUploadError('Choose an image file (JPG, PNG, or WebP).')
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setUploadError('Image must be 5 MB or smaller.')
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `profile/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('profile-images').upload(path, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('profile-images').getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Check the profile-images bucket and admin storage policy.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="sm:col-span-2 space-y-3">
      <label className="flex items-center gap-1.5 text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
        <ImagePlus className="w-3.5 h-3.5" />
        Profile Photo
      </label>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-white/15 bg-[#0d0d22] shrink-0 flex items-center justify-center">
          {value && !previewFailed ? (
            <img
              src={value}
              alt="Profile preview"
              onError={() => setPreviewFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-indigo-300/40" strokeWidth={1.2} />
          )}
        </div>
        <div className="flex-1 w-full space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… or upload a file"
            className={inputClass}
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />}
              {uploading ? 'Uploading…' : 'Upload image'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-white/10 text-gray-500 hover:text-red-300 hover:border-red-500/20"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-gray-600">
            Square photo, face centered. Paste a public URL or upload (max 5 MB). Click Save Settings after uploading. Falls back to /Photo.jpg if empty.
          </p>
          {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
        </div>
      </div>
    </div>
  )
}

const ResumeFileField = ({ url, filename, onChange }) => {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const apply = (nextUrl, nextName) => onChange({ url: nextUrl, filename: nextName })

  const uploadToBucket = async (bucket, path, file) => {
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploadError('')
    const typeOk = RESUME_TYPES.includes(file.type) || RESUME_EXT.test(file.name)
    if (!typeOk) {
      setUploadError('Choose a PDF, Word, JPG, or PNG resume.')
      return
    }
    if (file.size > MAX_RESUME_BYTES) {
      setUploadError('Resume must be 10 MB or smaller.')
      return
    }

    setUploading(true)
    try {
      const safeName = file.name.replace(/[^\w.-]+/g, '_').slice(0, 80)
      const path = `resumes/${Date.now()}-${safeName}`
      let publicUrl
      try {
        publicUrl = await uploadToBucket('resumes', path, file)
      } catch (err) {
        const msg = String(err.message || '').toLowerCase()
        if (!msg.includes('bucket') && !msg.includes('not found')) throw err
        publicUrl = await uploadToBucket('profile-images', path, file)
      }
      apply(publicUrl, file.name)
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Create the resumes bucket or use profile-images, then try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="sm:col-span-2 space-y-2">
      <label className="flex items-center gap-1.5 text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
        <FileText className="w-3.5 h-3.5" />
        Resume / CV
      </label>
      <input
        type="url"
        value={url}
        onChange={(e) => apply(e.target.value, filename)}
        placeholder="https://… or upload a PDF"
        className={inputClass}
      />
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
          className="hidden"
          onChange={handleFile}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? 'Uploading…' : 'Upload file'}
        </button>
        {url && (
          <button
            type="button"
            onClick={() => apply('', '')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-white/10 text-gray-500 hover:text-red-300 hover:border-red-500/20"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
        {filename && (
          <span className="text-xs text-indigo-300/80 truncate max-w-[220px]">{filename}</span>
        )}
      </div>
      <p className="text-xs text-gray-600">
        Upload a PDF (or Word/image) or paste a Drive/Notion URL. Visitors view it first, then can download. Click Save Settings after uploading.
      </p>
      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
    </div>
  )
}

const emptyEducation = () => ({ school: '', degree: '', years: '', note: '' })

const readEducationDrafts = (value) => {
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value || '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => ({
      school: String(item?.school || ''),
      degree: String(item?.degree || ''),
      years: String(item?.years || ''),
      note: String(item?.note || ''),
    }))
  } catch {
    return []
  }
}

const EducationListField = ({ value, onChange }) => {
  const items = readEducationDrafts(value)
  const write = (next) => onChange(JSON.stringify(next))

  const update = (index, key, nextValue) => {
    write(items.map((item, i) => (i === index ? { ...item, [key]: nextValue } : item)))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-1.5 text-xs text-indigo-300/70 uppercase tracking-wider font-medium">
          <GraduationCap className="w-3.5 h-3.5" />
          Education
        </label>
        <button
          type="button"
          onClick={() => write([...items, emptyEducation()])}
          disabled={items.length >= 8}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 disabled:opacity-40"
        >
          <Plus className="w-3.5 h-3.5" />
          Add school
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-xs text-gray-600">
          No schools yet. Add college, senior high, or courses. They appear as a timeline on the About page.
        </p>
      )}

      {items.map((item, index) => (
        <div key={index} className="rounded-xl border border-white/10 bg-[#0d0d22]/70 p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Entry {index + 1}</p>
            <button
              type="button"
              onClick={() => write(items.filter((_, i) => i !== index))}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-300"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={item.school}
              onChange={(e) => update(index, 'school', e.target.value)}
              placeholder="School or university"
              className={inputClass}
            />
            <input
              value={item.degree}
              onChange={(e) => update(index, 'degree', e.target.value)}
              placeholder="Degree, strand, or program"
              className={inputClass}
            />
            <input
              value={item.years}
              onChange={(e) => update(index, 'years', e.target.value)}
              placeholder="2021 — 2025"
              className={inputClass}
            />
            <input
              value={item.note}
              onChange={(e) => update(index, 'note', e.target.value)}
              placeholder="Optional note"
              className={inputClass}
            />
          </div>
        </div>
      ))}
      <p className="text-xs text-gray-600">
        Shown on the About page between the resume buttons and the stat cards. List newest first. Click Save Settings when done.
      </p>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Settings() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    getSiteConfig().then(c => {
      setConfig(c)
      setLoading(false)
    })
  }, [])

  const set = key => value => setConfig(prev => ({ ...prev, [key]: value }))

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const next = {
        ...config,
        education: JSON.stringify(parseEducation(config.education)),
      }
      await saveSiteConfig(next)
      setConfig(next)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message || 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-50" />
          <div className="relative w-9 h-9 bg-[#030014] rounded-xl border border-white/15 flex items-center justify-center">
            <Settings2 className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-500 text-xs">Name, title, copy, and public profile links</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">{error}</p>
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <p className="text-xs">Settings saved — changes are live on your portfolio.</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">

          {/* Identity — shown on Home / About / Navbar */}
          <Card>
            <div className="p-5 sm:p-6 space-y-5">
              <h2 className="text-sm font-semibold text-white border-b border-white/8 pb-3">
                Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Display Name"
                  icon={User}
                  value={config.display_name}
                  onChange={set('display_name')}
                  placeholder="Genecyl"
                  hint="Navbar logo, About greeting, footer, and page title."
                />
                <Field
                  label="Job Title"
                  icon={Briefcase}
                  value={config.job_title}
                  onChange={set('job_title')}
                  placeholder="Frontend Developer"
                  hint="Hero heading. The last word goes on the second line."
                />
                <Field
                  label="Site URL"
                  icon={Globe}
                  type="url"
                  value={config.site_url}
                  onChange={set('site_url')}
                  placeholder="https://genecyl.com"
                />
                <Field
                  label="Status Badge"
                  icon={Sparkles}
                  value={config.status_badge}
                  onChange={set('status_badge')}
                  placeholder="Ready to Innovate"
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Hero Tagline"
                    icon={Type}
                    value={config.tagline}
                    onChange={set('tagline')}
                    placeholder="Building websites that are innovative…"
                    multiline
                  />
                </div>
                <Field
                  label="Typewriter Words"
                  icon={Type}
                  value={config.typewriter_words}
                  onChange={set('typewriter_words')}
                  placeholder="Front-End Developer, Tech Enthusiast"
                  hint="Comma-separated. Cycles under the job title."
                />
                <Field
                  label="Tech Stack Pills"
                  icon={Code2}
                  value={config.tech_stack}
                  onChange={set('tech_stack')}
                  placeholder="React, Javascript, Node.js, Tailwind"
                  hint="Home page only. Comma-separated pills under the hero."
                />
                <Field
                  label="Portfolio Tech Stack"
                  icon={Boxes}
                  value={config.portfolio_tech_stack}
                  onChange={set('portfolio_tech_stack')}
                  placeholder="React, Javascript, Node.js, Tailwind"
                  hint="Portfolio Showcase tab only. Comma-separated. Does not change the Home pills."
                />
              </div>
            </div>
          </Card>

          {/* About copy */}
          <Card>
            <div className="p-5 sm:p-6 space-y-5">
              <h2 className="text-sm font-semibold text-white border-b border-white/8 pb-3">
                About Page
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <ProfilePhotoField
                  value={config.profile_image_url || ''}
                  onChange={set('profile_image_url')}
                />
                <Field
                  label="About Subtitle"
                  icon={Sparkles}
                  value={config.about_subtitle}
                  onChange={set('about_subtitle')}
                  placeholder="Transforming ideas into digital experiences"
                />
                <Field
                  label="About Bio"
                  icon={Type}
                  value={config.about_bio}
                  onChange={set('about_bio')}
                  placeholder="Short paragraph about you…"
                  multiline
                />
                <Field
                  label="Quote"
                  icon={Quote}
                  value={config.about_quote}
                  onChange={set('about_quote')}
                  placeholder="Leveraging AI as a professional tool, not a replacement."
                />
                <EducationListField
                  value={config.education}
                  onChange={set('education')}
                />
              </div>
            </div>
          </Card>

          {/* Social links */}
          <Card>
            <div className="p-5 sm:p-6 space-y-5">
              <h2 className="text-sm font-semibold text-white border-b border-white/8 pb-3">
                Social Links
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="GitHub"
                  icon={Github}
                  type="url"
                  value={config.github_url}
                  onChange={set('github_url')}
                  placeholder="https://github.com/your-username"
                />
                <Field
                  label="LinkedIn"
                  icon={Linkedin}
                  type="url"
                  value={config.linkedin_url}
                  onChange={set('linkedin_url')}
                  placeholder="https://linkedin.com/in/your-profile"
                />
                <Field
                  label="Instagram"
                  icon={Instagram}
                  type="url"
                  value={config.instagram_url}
                  onChange={set('instagram_url')}
                  placeholder="https://instagram.com/your-handle"
                />
                <Field
                  label="YouTube"
                  icon={Youtube}
                  type="url"
                  value={config.youtube_url}
                  onChange={set('youtube_url')}
                  placeholder="https://youtube.com/@your-channel"
                />
                <Field
                  label="TikTok"
                  icon={TikTokIcon}
                  type="url"
                  value={config.tiktok_url}
                  onChange={set('tiktok_url')}
                  placeholder="https://tiktok.com/@your-handle"
                />
              </div>
            </div>
          </Card>

          {/* Personal info */}
          <Card>
            <div className="p-5 sm:p-6 space-y-5">
              <h2 className="text-sm font-semibold text-white border-b border-white/8 pb-3">
                Personal Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ResumeFileField
                  url={config.resume_url || ''}
                  filename={config.resume_filename || ''}
                  onChange={({ url, filename }) => setConfig((prev) => ({
                    ...prev,
                    resume_url: url,
                    resume_filename: filename,
                  }))}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Contact Email"
                    icon={Mail}
                    type="email"
                    value={config.contact_email}
                    onChange={set('contact_email')}
                    placeholder="you@example.com"
                    hint="Inbox for the Contact form (FormSubmit). Falls back to VITE_CONTACT_EMAIL if left blank. The first submission must confirm this address."
                  />
                </div>
                <Field
                  label="Years of Experience"
                  icon={Hash}
                  type="number"
                  value={config.years_experience}
                  onChange={set('years_experience')}
                  placeholder="5"
                  hint="Shown on the About card. Change this anytime. Leave blank to calculate from the career start date."
                />
                <Field
                  label="Career Start Date"
                  icon={Calendar}
                  value={config.career_start}
                  onChange={set('career_start')}
                  placeholder="2021-01-01"
                  type="date"
                  hint="Used only when Years of Experience is blank."
                />
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    About will show{' '}
                    <span className="text-indigo-300 font-medium">
                      {(() => {
                        const raw = String(config.years_experience ?? '').trim()
                        const n = parseInt(raw, 10)
                        if (raw !== '' && !Number.isNaN(n)) return Math.max(0, n)
                        const start = new Date(config.career_start)
                        const today = new Date()
                        return Math.max(0, today.getFullYear() - start.getFullYear() -
                          (today < new Date(today.getFullYear(), start.getMonth(), start.getDate()) ? 1 : 0))
                      })()}
                    </span>
                    {' '}years of experience
                    {String(config.years_experience ?? '').trim() !== '' ? ' (manual).' : ' (from start date).'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Save */}
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="relative group/s">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-60 blur group-hover/s:opacity-100 transition duration-300" />
              <div className="relative flex items-center gap-2 px-6 py-2.5 bg-[#030014] rounded-xl border border-white/10">
                {saving
                  ? <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  : <Save className="w-4 h-4 text-indigo-400" />}
                <span className="text-sm text-gray-200">{saving ? 'Saving…' : 'Save Settings'}</span>
              </div>
            </button>
          </div>

        </form>
      )}

      {/* Info note */}
      <Card>
        <div className="p-4 flex gap-3">
          <Globe className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Changes take effect immediately on save. Name, job title, and tagline
            update Home and About. Education entries appear as a timeline on About.
            Tech Stack Pills stay on Home; Portfolio Tech Stack stays on the Showcase
            tab. Leave any social URL blank to hide that icon. Visitors who already
            have the page open pick up the new values on their next visit
            (5-minute client cache).
          </p>
        </div>
      </Card>

    </div>
  )
}
