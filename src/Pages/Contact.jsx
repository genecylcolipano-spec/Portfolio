import { useState, useEffect } from "react";
import { Share2, User, Mail, MessageSquare, Send } from "lucide-react";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

import SocialLinks from "../components/SocialLinks";
import Komentar from "../components/Commentar";
import { useSiteConfig } from "../utils/siteConfig";

// FormSubmit relays the form to your inbox without a backend of your own.
// Prefer Settings → Contact Email; fall back to VITE_CONTACT_EMAIL.
const ENV_CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL;

const EMPTY_FORM = { name: "", email: "", message: "" };

const ContactPage = () => {
  const cfg = useSiteConfig();
  const contactEmail = (cfg.contact_email || ENV_CONTACT_EMAIL || "").trim();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.refresh();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contactEmail) {
      Swal.fire({
        title: "Not configured",
        text: "Add a Contact Email in Dashboard → Settings (or set VITE_CONTACT_EMAIL) to enable the form.",
        icon: "warning",
        confirmButtonColor: "#6366f1",
        background: "#030014",
        color: "#ffffff",
      });
      return;
    }

    setIsSubmitting(true);

    Swal.fire({
      title: "Sending message...",
      html: "Please wait while we deliver your message",
      allowOutsideClick: false,
      background: "#030014",
      color: "#ffffff",
      didOpen: () => Swal.showLoading(),
    });

    const showSuccess = () => {
      Swal.fire({
        title: "Success!",
        text: "Your message has been sent successfully.",
        icon: "success",
        confirmButtonColor: "#6366f1",
        background: "#030014",
        color: "#ffffff",
        timer: 2000,
        timerProgressBar: true,
      });
      setFormData(EMPTY_FORM);
    };

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("message", formData.message);
      submitData.append("_subject", "New message from your portfolio website");
      submitData.append("_captcha", "false");
      submitData.append("_template", "table");

      await axios.post(`https://formsubmit.co/${contactEmail}`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess();
    } catch (error) {
      // FormSubmit's CORS response can surface as a status-0 request even on success
      if (error.request && error.request.status === 0) {
        showSuccess();
      } else {
        Swal.fire({
          title: "Failed",
          text: "Something went wrong. Please try again later.",
          icon: "error",
          confirmButtonColor: "#6366f1",
          background: "#030014",
          color: "#ffffff",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-[5%] sm:px-[5%] lg:px-[10%]">
      <div className="text-center lg:mt-[5%] mt-10 mb-2 sm:px-0 px-[5%]">
        <h2
          data-aos="fade-down"
          data-aos-duration="1000"
          className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
        >
          Contact Me
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2"
        >
          Got a question? Send me a message and I&apos;ll get back to you soon.
        </p>
      </div>

      <div
        className="h-auto py-10 flex items-center justify-center 2xl:pr-[3.1%] lg:pr-[3.8%] md:px-0"
        id="Contact"
      >
        <div className="container px-[1%] grid grid-cols-1 lg:grid-cols-[45%_55%] 2xl:grid-cols-[35%_65%] gap-12">
          {/* Contact form */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-5 py-10 sm:p-10 transform transition-all duration-500 hover:shadow-[#6366f1]/10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                  Get In Touch
                </h2>
                <p className="text-gray-400">
                  Have something to discuss? Send me a message and let&apos;s talk.
                </p>
              </div>
              <Share2 className="w-10 h-10 text-[#6366f1] opacity-50 shrink-0" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div data-aos="fade-up" data-aos-delay="100" className="relative group">
                <User className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50"
                  required
                />
              </div>

              <div data-aos="fade-up" data-aos-delay="200" className="relative group">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50"
                  required
                />
              </div>

              <div data-aos="fade-up" data-aos-delay="300" className="relative group">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full resize-none p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 h-[9.9rem] disabled:opacity-50"
                  required
                />
              </div>

              <button
                data-aos="fade-up"
                data-aos-delay="400"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366f1]/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-white/10 flex justify-center">
              <SocialLinks />
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-3 py-3 md:p-10 md:py-8 shadow-2xl transform transition-all duration-500 hover:shadow-[#6366f1]/10">
            <Komentar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
