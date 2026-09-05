import { useEffect, useState, memo, useMemo } from "react"
import { FileText, Code, Award, Globe, ArrowUpRight, Sparkles, User, GraduationCap } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useSiteConfig, DEFAULT_CONFIG, parseEducation } from "../utils/siteConfig"
import ResumeViewer from "../components/ResumeViewer"
import { hasResume } from "../utils/resume"

const Header = memo(({ subtitle }) => (
  <div className="text-center lg:mb-8 mb-2 px-[5%]">
    <div className="inline-block relative group">
      <h2
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
        data-aos="zoom-in-up"
        data-aos-duration="600"
      >
        About Me
      </h2>
    </div>
    <p
      className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      <Sparkles className="w-5 h-5 text-purple-400" />
      {subtitle}
      <Sparkles className="w-5 h-5 text-purple-400" />
    </p>
  </div>
));

Header.displayName = 'Header';

const ProfileImage = memo(({ src }) => {
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  return (
    <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
      <div className="relative group" data-aos="fade-up" data-aos-duration="1000">
        {/* Decorative gradient halo — desktop only to keep mobile cheap */}
        <div className="absolute -inset-6 opacity-[25%] z-0 hidden sm:block">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 rounded-full blur-2xl animate-spin-slower" />
          <div className="absolute inset-0 bg-gradient-to-l from-fuchsia-500 via-rose-500 to-pink-600 rounded-full blur-2xl animate-pulse-slow opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-cyan-500 to-teal-400 rounded-full blur-2xl animate-float opacity-50" />
        </div>

        <div className="relative">
          <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_0_40px_rgba(120,119,198,0.3)] transform transition-all duration-700 group-hover:scale-105">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20 transition-all duration-700 group-hover:border-white/40 group-hover:scale-105" />

            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-blue-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block" />

            {failed ? (
              <div className="w-full h-full bg-gradient-to-br from-[#1a1a3a] to-[#0d0d22] flex items-center justify-center">
                <User className="w-24 h-24 text-indigo-300/40" strokeWidth={1.2} />
              </div>
            ) : (
              <img
                src={src}
                alt="Profile"
                onError={() => setFailed(true)}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                loading="lazy"
              />
            )}

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 hidden sm:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/10 to-transparent transform translate-y-full group-hover:-translate-y-full transition-transform duration-1000 delay-100" />
              <div className="absolute inset-0 rounded-full border-8 border-white/10 scale-0 group-hover:scale-100 transition-transform duration-700 animate-pulse-slow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProfileImage.displayName = 'ProfileImage';

const StatCard = memo(({ icon: Icon, color, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration={1300} className="relative group">
    <div className="relative z-10 bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
      <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

      <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 transition-transform group-hover:rotate-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <span className="text-4xl font-bold text-white">{value}</span>
      </div>

      <div>
        <p className="text-sm uppercase tracking-wider text-gray-300 mb-2">{label}</p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">{description}</p>
          <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

const EducationTimeline = memo(({ items }) => {
  if (!items.length) return null;

  return (
    <div className="mt-16" data-aos="fade-up" data-aos-duration="1000">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#a855f7]/20 border border-white/10 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-indigo-300" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Education</h3>
          <p className="text-xs sm:text-sm text-gray-500">Academic background</p>
        </div>
      </div>

      <ol className="relative space-y-6 border-l border-indigo-500/25 ml-4 sm:ml-5">
        {items.map((item, index) => (
          <li
            key={`${item.school}-${item.years}-${index}`}
            className="ml-6 sm:ml-8"
            data-aos="fade-up"
            data-aos-duration={900 + index * 120}
          >
            <span className="absolute -left-[9px] mt-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] ring-4 ring-[#030014]" />
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 sm:p-5">
              {item.years && (
                <p className="text-xs uppercase tracking-wider text-indigo-300/80 mb-1">{item.years}</p>
              )}
              {item.degree && (
                <p className="text-base sm:text-lg font-semibold text-white">{item.degree}</p>
              )}
              {item.school && (
                <p className="text-sm text-gray-300 mt-0.5">{item.school}</p>
              )}
              {item.note && (
                <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">{item.note}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
});

EducationTimeline.displayName = 'EducationTimeline';

const AboutPage = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalCertificates: 0,
    YearExperience: 0,
  });
  const [resumeOpen, setResumeOpen] = useState(false);
  const cfg = useSiteConfig();

  const CV_URL = cfg.resume_url || '';
  const resumeReady = hasResume(CV_URL);
  const CAREER_START = cfg.career_start || '2021-01-01';
  const MANUAL_YEARS = cfg.years_experience;
  const education = useMemo(() => parseEducation(cfg.education), [cfg.education]);

  useEffect(() => {
    const updateStats = () => {
      let storedProjects = [];
      let storedCertificates = [];

      try {
        storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");
      } catch {
        // Corrupt cache — fall back to zeroes rather than crashing the section
      }

      const parsed = parseInt(String(MANUAL_YEARS ?? '').trim(), 10)
      const hasManual = MANUAL_YEARS !== '' && MANUAL_YEARS != null && !Number.isNaN(parsed)

      let experience
      if (hasManual) {
        experience = Math.max(0, parsed)
      } else {
        const startDate = new Date(CAREER_START);
        const today = new Date();
        experience =
          today.getFullYear() -
          startDate.getFullYear() -
          (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);
        experience = Math.max(0, experience)
      }

      setStats({
        totalProjects: storedProjects.length,
        totalCertificates: storedCertificates.length,
        YearExperience: experience,
      });
    };

    updateStats();

    window.addEventListener('storage', updateStats);
    window.addEventListener('portfolioDataUpdated', updateStats);

    return () => {
      window.removeEventListener('storage', updateStats);
      window.removeEventListener('portfolioDataUpdated', updateStats);
    };
  }, [CAREER_START, MANUAL_YEARS]);

  const { totalProjects, totalCertificates, YearExperience } = stats;

  useEffect(() => {
    const initAOS = () => AOS.refresh();
    initAOS();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAOS, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-[#6366f1] to-[#a855f7]",
      value: totalProjects,
      label: "Total Projects",
      description: "Innovative web solutions crafted",
      animation: "fade-right",
    },
    {
      icon: Award,
      color: "from-[#a855f7] to-[#6366f1]",
      value: totalCertificates,
      label: "Certificates",
      description: "Professional skills validated",
      animation: "fade-up",
    },
    {
      icon: Globe,
      color: "from-[#6366f1] to-[#a855f7]",
      value: YearExperience,
      label: "Years of Experience",
      description: "Continuous learning journey",
      animation: "fade-left",
    },
  ], [totalProjects, totalCertificates, YearExperience]);

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm:mt-0"
      id="About"
      itemScope
      itemType="https://schema.org/Person"
    >
      <Header subtitle={cfg.about_subtitle || DEFAULT_CONFIG.about_subtitle} />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                Hello, I&apos;m
              </span>
              <span
                className="block mt-2 text-gray-200"
                data-aos="fade-right"
                data-aos-duration="1300"
                itemProp="name"
              >
                {cfg.display_name || DEFAULT_CONFIG.display_name}
              </span>
            </h2>

            <p
              className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
              {cfg.about_bio || DEFAULT_CONFIG.about_bio}
            </p>

            {/* Quote */}
            <div
              className="relative bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#a855f7]/5 border border-[#6366f1]/30 rounded-2xl p-4 my-6 backdrop-blur-md shadow-2xl overflow-hidden"
              data-aos="fade-up"
              data-aos-duration="1700"
            >
              <div className="absolute top-2 right-4 w-16 h-16 bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-2 w-12 h-12 bg-gradient-to-r from-[#a855f7]/20 to-[#6366f1]/20 rounded-full blur-lg" />

              <div className="absolute top-3 left-4 text-[#6366f1] opacity-30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                </svg>
              </div>

              <blockquote className="text-gray-300 text-center lg:text-left italic font-medium text-sm relative z-10 pl-6">
                &quot;{cfg.about_quote || DEFAULT_CONFIG.about_quote}&quot;
              </blockquote>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:px-0 w-full">
              <button
                type="button"
                data-aos="fade-up"
                data-aos-duration="800"
                disabled={!resumeReady}
                onClick={() => setResumeOpen(true)}
                title={resumeReady ? 'View resume' : 'Upload a resume in Settings first'}
                className="w-full lg:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> View Resume
              </button>
              <a href="#Portofolio" className="w-full lg:w-auto">
                <button
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="w-full lg:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-[#a855f7]/50 text-[#a855f7] font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 hover:bg-[#a855f7]/10"
                >
                  <Code className="w-4 h-4 sm:w-5 sm:h-5" /> View Projects
                </button>
              </a>
            </div>
          </div>

          <ProfileImage src={cfg.profile_image_url || '/Photo.jpg'} />
        </div>

        <ResumeViewer
          open={resumeOpen}
          url={CV_URL}
          filename={cfg.resume_filename}
          onClose={() => setResumeOpen(false)}
        />

        <EducationTimeline items={education} />

        <a href="#Portofolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </a>
      </div>
    </div>
  );
};

export default memo(AboutPage);
