/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // El service worker se sirve desde /public/sw.js y se registra manualmente.
  // No usamos next-pwa para mantener control total y cero dependencias extra.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
