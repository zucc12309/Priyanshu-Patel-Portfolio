/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: new URL(".", import.meta.url).pathname,
  devIndicators: false,
  env: {
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
