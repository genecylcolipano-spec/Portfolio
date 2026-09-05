import { useState, useEffect, useCallback, memo, useMemo } from "react"
import { Helmet } from "react-helmet-async"
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles, Code2 } from "lucide-react"
import { motion } from "framer-motion"
import { useSiteConfig, parseList, splitJobTitle, DEFAULT_CONFIG } from "../utils/siteConfig"

/**
 * Hero entrance is mount-driven (Framer Motion), not splash-driven.
 * The splash is only a cover; this section is always visible underneath.
 * `animate` is always "visible" — never tied to WelcomeScreen — so the hero
 * cannot stay at opacity 0 if the overlay unmounts late or not at all.
 */
const reveal = (delay, from = {}) => ({
  hidden: { opacity: 0, ...from },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  },
})

const StatusBadge = memo(({ label }) => (
  <motion.div className="inline-block animate-float lg:mx-0" variants={reveal(0.25, { scale: 0.85 })}>
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400" />
          {label}
        </span>
      </div>
    </div>
  </motion.div>
));

StatusBadge.displayName = 'StatusBadge';

const MainTitle = memo(({ line1, line2 }) => (
  <motion.div className="space-y-2" variants={reveal(0.35, { y: 30 })}>
    <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
      <span className="relative inline-block">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          {line1}
        </span>
      </span>
      {line2 && (
        <>
          <br />
          <span className="relative inline-block mt-2">
            <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
            <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
              {line2}
            </span>
          </span>
        </>
      )}
    </h1>
  </motion.div>
));

MainTitle.displayName = 'MainTitle';

const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>
));

TechStack.displayName = 'TechStack';

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-11 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon className={`w-4 h-4 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
        </span>
      </div>
    </button>
  </a>
));

CTAButton.displayName = 'CTAButton';

const SocialLink = memo(({ icon: Icon, link, label }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" aria-label={label}>
    <button className="group relative p-3" aria-label={label}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

SocialLink.displayName = 'SocialLink';

const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const FALLBACK_WORDS = ["Front-End Developer", "Tech Enthusiast"];
const FALLBACK_STACK = ["React", "Javascript", "Node.js", "Tailwind"];

const Home = () => {
  const cfg = useSiteConfig()
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [heroImageFailed, setHeroImageFailed] = useState(false)

  const words = useMemo(
    () => parseList(cfg.typewriter_words, FALLBACK_WORDS),
    [cfg.typewriter_words]
  )
  const techStack = useMemo(
    () => parseList(cfg.tech_stack, FALLBACK_STACK),
    [cfg.tech_stack]
  )
  const [titleLine1, titleLine2] = splitJobTitle(cfg.job_title)
  const siteUrl = cfg.site_url || DEFAULT_CONFIG.site_url
  const displayName = cfg.display_name || DEFAULT_CONFIG.display_name

  useEffect(() => {
    setText("")
    setIsTyping(true)
    setWordIndex(0)
    setCharIndex(0)
  }, [cfg.typewriter_words])

  const handleTyping = useCallback(() => {
    const current = words[wordIndex % words.length] || ""
    if (isTyping) {
      if (charIndex < current.length) {
        setText(prev => prev + current[charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % words.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex, words]);

  useEffect(() => {
    const timeout = setTimeout(handleTyping, isTyping ? TYPING_SPEED : ERASING_SPEED);
    return () => clearTimeout(timeout);
  }, [handleTyping, isTyping]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: displayName,
    jobTitle: cfg.job_title || DEFAULT_CONFIG.job_title,
    url: siteUrl,
    sameAs: [cfg.github_url, cfg.linkedin_url, cfg.instagram_url].filter(Boolean)
  };

  return (
    <>
      <Helmet>
        <title>{displayName} — {cfg.job_title || DEFAULT_CONFIG.job_title}</title>
        <meta name="description" content={cfg.tagline || DEFAULT_CONFIG.tagline} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={siteUrl} />
        <meta property="og:title" content={`${displayName} — ${cfg.job_title || DEFAULT_CONFIG.job_title}`} />
        <meta property="og:description" content={cfg.tagline || DEFAULT_CONFIG.tagline} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-[#030014] overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%]" id="Home">
        <div className="relative z-10">
          <div className="container mx-auto min-h-screen">
            <motion.div
              className="flex flex-col lg:flex-row items-center justify-center h-screen md:justify-between gap-0 sm:gap-12 lg:gap-20"
              initial="hidden"
              animate="visible"
            >

              {/* Left column */}
              <motion.div
                className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left order-1 lg:order-1 lg:mt-0"
                variants={reveal(0.1, { x: -60 })}
              >
                <div className="space-y-4 sm:space-y-6">
                  <StatusBadge label={cfg.status_badge || DEFAULT_CONFIG.status_badge} />
                  <MainTitle line1={titleLine1} line2={titleLine2} />

                  {/* Typing effect */}
                  <motion.div className="h-8 flex items-center" variants={reveal(0.5, { y: 24 })}>
                    <span className="text-xl md:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                      {text}
                    </span>
                    <span className="w-[3px] h-6 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink"></span>
                  </motion.div>

                  <motion.p
                    className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light"
                    variants={reveal(0.6, { y: 24 })}
                  >
                    {cfg.tagline || DEFAULT_CONFIG.tagline}
                  </motion.p>

                  {/* Tech stack */}
                  <motion.div className="flex flex-wrap gap-3 justify-start" variants={reveal(0.7, { y: 24 })}>
                    {techStack.map((tech) => (
                      <TechStack key={tech} tech={tech} />
                    ))}
                  </motion.div>

                  {/* CTA buttons */}
                  <motion.div className="flex flex-row gap-3 w-full justify-start" variants={reveal(0.8, { y: 24 })}>
                    <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
                    <CTAButton href="#Contact" text="Contact" icon={Mail} />
                  </motion.div>

                  {/* Social links — built from siteConfig, hidden if URL not set */}
                  <motion.div className="hidden sm:flex gap-4 justify-start" variants={reveal(0.9, { y: 24 })}>
                    {[
                      { icon: Github,    link: cfg.github_url,    label: "GitHub Profile" },
                      { icon: Linkedin,  link: cfg.linkedin_url,  label: "LinkedIn Profile" },
                      { icon: Instagram, link: cfg.instagram_url, label: "Instagram Profile" },
                    ].filter(s => s.link).map((social) => (
                      <SocialLink key={social.label} {...social} />
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Right column — hero illustration */}
              <motion.div
                className="w-full py-0 md:py-[10%] sm:py-0 lg:w-1/2 h-[260px] sm:h-[400px] lg:h-[600px] xl:h-[750px] relative flex items-center justify-center order-2 lg:order-2 mt-5 sm:mt-0"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                variants={reveal(0.35, { x: 60 })}
              >
                <div className="relative w-full opacity-90">
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${
                    isHovering ? "opacity-50 scale-105" : "opacity-20 scale-100"
                  }`} />

                  <div className={`relative lg:left-12 z-10 w-full opacity-90 transform transition-transform duration-500 ${
                    isHovering ? "scale-105" : "scale-100"
                  }`}>
                    {heroImageFailed ? (
                      <div className="w-full aspect-square max-h-[600px] flex items-center justify-center">
                        <div className="relative flex items-center justify-center w-3/5 aspect-square rounded-full bg-gradient-to-br from-[#6366f1]/20 to-[#a855f7]/20 border border-white/10 backdrop-blur-xl">
                          <div className="absolute inset-6 rounded-full border border-white/5 animate-pulse-slow" />
                          <Code2 className="w-1/4 h-1/4 text-indigo-300/80" strokeWidth={1.2} />
                        </div>
                      </div>
                    ) : (
                      <picture>
                        {/* Desktop / tablet — Animation2.gif (md and up, 768px) */}
                        <source media="(min-width: 768px)" srcSet="/Animation2.gif" type="image/gif" />
                        {/* Phones — Coding.gif */}
                        <img
                          src="/Coding.gif"
                          alt="Full-stack and cross-platform development"
                          onError={() => setHeroImageFailed(true)}
                          className={`w-full h-full object-contain drop-shadow-[0_0_40px_rgba(99,102,241,0.25)] transition-all duration-500 ${
                            isHovering
                              ? "scale-[100%] sm:scale-[95%] rotate-1"
                              : "scale-[95%] sm:scale-[90%]"
                          }`}
                        />
                      </picture>
                    )}
                  </div>

                  <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
                    isHovering ? "opacity-50" : "opacity-20"
                  }`}>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${
                      isHovering ? "scale-110" : "scale-100"
                    }`} />
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Home);
