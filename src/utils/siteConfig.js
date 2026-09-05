/**
 * siteConfig — fetches key/value settings from public.site_config in Supabase.
 *
 * Results are cached in localStorage under "site_config" with a 5-minute TTL
 * so repeat page visits feel instant and there is no loading flicker.
 *
 * Usage:
 *   const config = await getSiteConfig()
 *   config.github_url  // → "https://github.com/you"
 *
 * Or inside a React component (with a loading state):
 *   const [config, setConfig] = useState(getCachedConfig())
 *   useEffect(() => { getSiteConfig().then(setConfig) }, [])
 */

import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const CACHE_KEY = 'site_config'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/** Default values shown while loading or when Supabase returns nothing. */
export const DEFAULT_CONFIG = {
  display_name:      'Genecyl',
  job_title:         'Frontend Developer',
  status_badge:      'Ready to Innovate',
  tagline:           'Building websites that are innovative, functional, and user-friendly digital solutions.',
  typewriter_words:  'Front-End Developer, Tech Enthusiast',
  tech_stack:           'React, Javascript, Node.js, Tailwind',
  portfolio_tech_stack: 'React, Javascript, Node.js, Tailwind',
  site_url:          'https://genecyl.com',
  about_subtitle:    'Transforming ideas into digital experiences',
  about_bio:         "I'm an Informatics Engineering student focused on Front-End development. I care about crafting engaging digital experiences and always aim to deliver the best possible solution for every project I take on.",
  about_quote:       'Leveraging AI as a professional tool, not a replacement.',
  github_url:        '',
  linkedin_url:      '',
  instagram_url:     '',
  youtube_url:       '',
  tiktok_url:        '',
  resume_url:        '',
  resume_filename:   '',
  profile_image_url: '',
  contact_email:     '',
  career_start:      '2021-01-01',
  years_experience:  '',
  education:         '[]',
}

/** Parse the About education timeline stored as JSON in site_config. */
export function parseEducation(value) {
  let items = value
  if (typeof value === 'string') {
    const raw = value.trim()
    if (!raw) return []
    try {
      items = JSON.parse(raw)
    } catch {
      return []
    }
  }
  if (!Array.isArray(items)) return []
  return items
    .map((item) => ({
      school: String(item?.school || '').trim(),
      degree: String(item?.degree || '').trim(),
      years: String(item?.years || '').trim(),
      note: String(item?.note || '').trim(),
    }))
    .filter((item) => item.school || item.degree)
}

/** Split a comma-separated settings value into a clean list. */
export function parseList(value, fallback = []) {
  if (typeof value !== 'string' || !value.trim()) return fallback
  const items = value.split(',').map((s) => s.trim()).filter(Boolean)
  return items.length ? items : fallback
}

/** Split a job title on its last space so the hero can stay two lines. */
export function splitJobTitle(title) {
  const t = (title || DEFAULT_CONFIG.job_title).trim()
  const i = t.lastIndexOf(' ')
  if (i === -1) return [t, '']
  return [t.slice(0, i), t.slice(i + 1)]
}

/** Hostname for display (welcome screen, footer) from a full site URL. */
export function siteHostname(url) {
  try {
    return new URL(url || DEFAULT_CONFIG.site_url).hostname
  } catch {
    return 'genecyl.com'
  }
}

/**
 * Read the last-good config from localStorage.
 * Returns DEFAULT_CONFIG if the cache is missing or corrupt.
 */
export function getCachedConfig() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return { ...DEFAULT_CONFIG }
    const { ts, data } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return { ...DEFAULT_CONFIG, ...data } // stale but usable
    return { ...DEFAULT_CONFIG, ...data }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

/** Subscribe a component to live site_config (mount fetch + save events). */
export function useSiteConfig() {
  const [config, setConfig] = useState(getCachedConfig)

  useEffect(() => {
    getSiteConfig().then(setConfig)
    const refresh = () => getSiteConfig().then(setConfig)
    window.addEventListener('siteConfigUpdated', refresh)
    return () => window.removeEventListener('siteConfigUpdated', refresh)
  }, [])

  return config
}

/**
 * Fetch the latest config from Supabase, update the cache, and return it.
 * Falls back to the cached value on network/auth error.
 */
export async function getSiteConfig() {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('key, value')

    if (error) throw error

    const config = { ...DEFAULT_CONFIG }
    const keysFromDb = new Set()
    for (const row of data) {
      config[row.key] = row.value
      keysFromDb.add(row.key)
    }

    // One-time split: keep the old shared list on Portfolio until that field is saved on its own.
    if (!keysFromDb.has('portfolio_tech_stack') && config.tech_stack) {
      config.portfolio_tech_stack = config.tech_stack
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: config }))
    return config
  } catch {
    return getCachedConfig()
  }
}

function writeError(error) {
  const code = error?.code || ''
  const raw = error?.message || 'Unknown error'
  const lower = raw.toLowerCase()
  const rls = code === '42501' || lower.includes('row-level security')

  if (rls) {
    return (
      'Supabase blocked the save (RLS). The Settings form is public-readable, ' +
      'but writes need the "admin manage site_config" policy plus a profiles row ' +
      'with role = admin for your Auth user. Re-run that policy from the README, ' +
      'confirm your profiles.role is admin, then sign out and sign back in. ' +
      `Server: ${raw}`
    )
  }

  if (code === 'PGRST205' || lower.includes('could not find the table')) {
    return (
      'The site_config table does not exist. Run the site_config SQL from the README, then try again. ' +
      `Server: ${raw}`
    )
  }

  return raw
}

/**
 * Write a full config object back to Supabase via upsert.
 * Only the admin can call this (RLS enforced on the server).
 */
export async function saveSiteConfig(config) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('You are not signed in. Sign out, open /login, and sign in again.')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError?.code === 'PGRST205') {
    throw new Error(
      'The profiles table does not exist. Run the database script from the README, then sign in again.'
    )
  }

  if (!profile || profile.role !== 'admin') {
    throw new Error(
      'This account has no admin profile. In Supabase, insert a public.profiles row ' +
      `for user ${user.id} with role = 'admin', then sign in again.`
    )
  }

  const rows = Object.entries(config).map(([key, value]) => ({ key, value: value ?? '' }))
  const { error } = await supabase
    .from('site_config')
    .upsert(rows, { onConflict: 'key' })

  if (error) throw new Error(writeError(error))

  localStorage.removeItem(CACHE_KEY)
  window.dispatchEvent(new CustomEvent('siteConfigUpdated'))
}
