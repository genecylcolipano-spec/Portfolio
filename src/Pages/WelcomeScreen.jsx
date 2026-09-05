import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Github, Globe, User } from 'lucide-react';
import { getCachedConfig, DEFAULT_CONFIG, siteHostname } from '../utils/siteConfig';

const TypewriterEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;

    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index += 1;
      } else {
        clearInterval(timer);
      }
    }, 260);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse" aria-hidden="true">
        |
      </span>
    </span>
  );
};

const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-3xl animate-pulse" />
    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-transparent to-purple-600/10 blur-2xl animate-float" />
  </div>
);

const IconButton = ({ Icon }) => (
  <div className="relative group hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-300" />
    <div className="relative p-2 sm:p-3 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
    </div>
  </div>
);

/**
 * WelcomeScreen
 *
 * Full-screen splash overlay. After 3.4 seconds it calls onLoadingComplete,
 * and the parent unmounts this component immediately. There is no exit
 * animation — waiting on one (especially filter: blur) can leave this
 * overlay stuck on top of Home.
 */
const WelcomeScreen = ({ onLoadingComplete }) => {
  const cfg = getCachedConfig();
  const siteUrl = cfg.site_url || DEFAULT_CONFIG.site_url;
  const host = siteHostname(siteUrl);

  useEffect(() => {
    const timer = setTimeout(onLoadingComplete, 3400);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-[60] bg-[#030014] overflow-hidden">
      <BackgroundEffect />

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-4xl mx-auto">
          {/* Icons */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="flex justify-center gap-3 sm:gap-4 md:gap-8 mb-6 sm:mb-8 md:mb-12"
          >
            {[Code2, User, Github].map((Icon, index) => (
              <div key={index}>
                <IconButton Icon={Icon} />
              </div>
            ))}
          </motion.div>

          {/* Welcome text */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
            className="text-center mb-6 sm:mb-8 md:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold space-y-2 sm:space-y-4">
              <div className="mb-2 sm:mb-4">
                {['Welcome', 'To', 'My'].map((word) => (
                  <span key={word}>
                    <span className="inline-block px-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                      {word}
                    </span>{' '}
                  </span>
                ))}
              </div>

              <div>
                {['Portfolio', 'Website'].map((word) => (
                  <span key={word}>
                    <span className="inline-block px-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {word}
                    </span>{' '}
                  </span>
                ))}
              </div>
            </h1>
          </motion.div>

          {/* Website link */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
            className="text-center"
          >
            <a
              href={siteUrl}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full relative group hover:scale-105 transition-transform duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />

              <div className="relative flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />

                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  <TypewriterEffect text={host} />
                </span>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
