const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

/**
 * Maps a normalised tech name (lowercase, no spaces / dots / dashes) to a
 * Devicon URL. Unknown names still get a tile — TechStackIcon falls back if
 * the image 404s.
 */
const ICONS = {
  html: `${DEVICON}/html5/html5-original.svg`,
  html5: `${DEVICON}/html5/html5-original.svg`,
  css: `${DEVICON}/css3/css3-original.svg`,
  css3: `${DEVICON}/css3/css3-original.svg`,
  javascript: `${DEVICON}/javascript/javascript-original.svg`,
  js: `${DEVICON}/javascript/javascript-original.svg`,
  typescript: `${DEVICON}/typescript/typescript-original.svg`,
  ts: `${DEVICON}/typescript/typescript-original.svg`,
  react: `${DEVICON}/react/react-original.svg`,
  reactjs: `${DEVICON}/react/react-original.svg`,
  reactnative: `${DEVICON}/react/react-original.svg`,
  next: `${DEVICON}/nextjs/nextjs-original.svg`,
  nextjs: `${DEVICON}/nextjs/nextjs-original.svg`,
  vite: `${DEVICON}/vitejs/vitejs-original.svg`,
  vitejs: `${DEVICON}/vitejs/vitejs-original.svg`,
  node: `${DEVICON}/nodejs/nodejs-original.svg`,
  nodejs: `${DEVICON}/nodejs/nodejs-original.svg`,
  express: `${DEVICON}/express/express-original.svg`,
  tailwind: `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
  tailwindcss: `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
  bootstrap: `${DEVICON}/bootstrap/bootstrap-original.svg`,
  sass: `${DEVICON}/sass/sass-original.svg`,
  supabase: `${DEVICON}/supabase/supabase-original.svg`,
  firebase: `${DEVICON}/firebase/firebase-original.svg`,
  materialui: `${DEVICON}/materialui/materialui-original.svg`,
  mui: `${DEVICON}/materialui/materialui-original.svg`,
  git: `${DEVICON}/git/git-original.svg`,
  github: `${DEVICON}/github/github-original.svg`,
  figma: `${DEVICON}/figma/figma-original.svg`,
  vscode: `${DEVICON}/vscode/vscode-original.svg`,
  python: `${DEVICON}/python/python-original.svg`,
  java: `${DEVICON}/java/java-original.svg`,
  php: `${DEVICON}/php/php-original.svg`,
  mysql: `${DEVICON}/mysql/mysql-original.svg`,
  postgresql: `${DEVICON}/postgresql/postgresql-original.svg`,
  mongodb: `${DEVICON}/mongodb/mongodb-original.svg`,
  docker: `${DEVICON}/docker/docker-original.svg`,
  vercel: `${DEVICON}/vercel/vercel-original.svg`,
  netlify: `${DEVICON}/netlify/netlify-original.svg`,
  redux: `${DEVICON}/redux/redux-original.svg`,
  graphql: `${DEVICON}/graphql/graphql-plain.svg`,
  framer: `${DEVICON}/framermotion/framermotion-original.svg`,
  framermotion: `${DEVICON}/framermotion/framermotion-original.svg`,
};

/** Resolve a display name like "Node.js" or "Tailwind CSS" to a Devicon URL. */
export function iconForTech(name) {
  const key = String(name || "")
    .toLowerCase()
    .replace(/[\s._-]+/g, "");
  return ICONS[key] || `${DEVICON}/javascript/javascript-original.svg`;
}
