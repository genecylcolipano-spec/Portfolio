import { useEffect, useState } from "react";
import { Linkedin, Github, Instagram, Youtube, ExternalLink } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { getCachedConfig, getSiteConfig } from "../utils/siteConfig";

const TikTokIcon = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path d="M16.6 5.82a4.28 4.28 0 0 1-1.9-3.32h-3.1v13.2a2.6 2.6 0 1 1-1.86-2.5V9.98a5.7 5.7 0 1 0 4.96 5.65V8.9a7.34 7.34 0 0 0 4.3 1.38V7.18a4.3 4.3 0 0 1-2.4-1.36Z" />
  </svg>
);

// Static metadata — only the URL changes based on siteConfig
const LINK_META = [
  { key: "linkedin_url",  name: "LinkedIn",  displayName: "Let's Connect", subText: "on LinkedIn", icon: Linkedin,   color: "#0A66C2", gradient: "from-[#0A66C2] to-[#0077B5]", isPrimary: true },
  { key: "instagram_url", name: "Instagram", displayName: "Instagram",     subText: "Instagram",   icon: Instagram,  color: "#E4405F", gradient: "from-[#833AB4] via-[#E4405F] to-[#FCAF45]" },
  { key: "youtube_url",   name: "YouTube",   displayName: "Youtube",       subText: "YouTube",     icon: Youtube,    color: "#FF0000", gradient: "from-[#FF0000] to-[#CC0000]" },
  { key: "github_url",    name: "GitHub",    displayName: "Github",        subText: "GitHub",      icon: Github,     color: "#ffffff", gradient: "from-[#333] to-[#24292e]" },
  { key: "tiktok_url",    name: "TikTok",    displayName: "Tiktok",        subText: "TikTok",      icon: TikTokIcon, color: "#FE2C55", gradient: "from-[#000000] via-[#25F4EE] to-[#FE2C55]" },
];

const SecondaryLink = ({ link, delay }) => (
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative flex items-center gap-3 p-4 rounded-xl
               bg-white/5 border border-white/10 overflow-hidden
               hover:border-white/20 transition-all duration-500"
    data-aos="fade-up"
    data-aos-delay={delay}
  >
    <div
      className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                  bg-gradient-to-r ${link.gradient}`}
    />

    <div className="relative flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-20 rounded-lg transition-all duration-500
                   group-hover:scale-125 group-hover:opacity-30"
        style={{ backgroundColor: link.color }}
      />
      <div className="relative p-2 rounded-lg">
        <link.icon
          className="w-5 h-5 transition-all duration-500 group-hover:scale-110"
          style={{ color: link.color }}
        />
      </div>
    </div>

    <div className="flex flex-col min-w-0">
      <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors duration-300">
        {link.displayName}
      </span>
      <span className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-300">
        {link.subText}
      </span>
    </div>

    <ExternalLink
      className="w-4 h-4 text-gray-500 group-hover:text-white ml-auto
                 opacity-0 group-hover:opacity-100 transition-all duration-300
                 transform group-hover:translate-x-0 -translate-x-2"
    />

    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                   translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
      />
    </div>
  </a>
);

const SocialLinks = () => {
  const [cfg, setCfg] = useState(getCachedConfig);

  useEffect(() => {
    AOS.refresh();
    getSiteConfig().then(setCfg);
  }, []);

  // Build the live link list, hiding any platform whose URL is empty
  const socialLinks = LINK_META
    .map(meta => ({ ...meta, url: cfg[meta.key] || '' }))
    .filter(link => link.url);

  const linkedIn   = socialLinks.find(l => l.isPrimary);
  const otherLinks = socialLinks.filter(l => !l.isPrimary);

  return (
    <div className="w-full bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 py-8 backdrop-blur-xl">
      <h3
        className="text-xl font-semibold text-white mb-6 flex items-center gap-2"
        data-aos="fade-down"
      >
        <span className="inline-block w-8 h-1 bg-indigo-500 rounded-full"></span>
        Connect With Me
      </h3>

      <div className="flex flex-col gap-4">
        {/* LinkedIn — primary row (only rendered when the URL is set) */}
        {linkedIn && (
          <a
            href={linkedIn.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between p-4 rounded-lg
                       bg-white/5 border border-white/10 overflow-hidden
                       hover:border-white/20 transition-all duration-500"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                          bg-gradient-to-r ${linkedIn.gradient}`}
            />

            <div className="relative flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-20 rounded-md transition-all duration-500
                             group-hover:scale-110 group-hover:opacity-30"
                  style={{ backgroundColor: linkedIn.color }}
                />
                <div className="relative p-2 rounded-md">
                  <linkedIn.icon
                    className="w-6 h-6 transition-all duration-500 group-hover:scale-105"
                    style={{ color: linkedIn.color }}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-bold pt-[0.2rem] text-gray-200 tracking-tight leading-none group-hover:text-white transition-colors duration-300">
                  {linkedIn.displayName}
                </span>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {linkedIn.subText}
                </span>
              </div>
            </div>

            <ExternalLink
              className="relative w-5 h-5 text-gray-500 group-hover:text-white
                         opacity-0 group-hover:opacity-100 transition-all duration-300
                         transform group-hover:translate-x-0 -translate-x-1"
            />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                           translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              />
            </div>
          </a>
        )}

        {/* Remaining links — rendered in pairs, skipping any that have no URL */}
        {otherLinks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherLinks.map((link, index) => (
              <SecondaryLink key={link.name} link={link} delay={200 + index * 100} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialLinks;
