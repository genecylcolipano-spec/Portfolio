import { useSiteConfig, DEFAULT_CONFIG } from "../utils/siteConfig";

const Footer = () => {
  const cfg = useSiteConfig();
  const currentYear = new Date().getFullYear();
  const name = cfg.display_name || DEFAULT_CONFIG.display_name;
  const url = cfg.site_url || DEFAULT_CONFIG.site_url;

  return (
    <footer>
      <center>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
        <span className="block text-sm pb-4 text-gray-500 text-center">
          © {currentYear}{" "}
          <a href={url} className="hover:underline">
            {name}™
          </a>
          . All Rights Reserved.
        </span>
      </center>
    </footer>
  );
};

export default Footer;
