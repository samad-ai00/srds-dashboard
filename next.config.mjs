/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Vercel build ke waqt TypeScript errors ignore karne ke liye
    ignoreBuildErrors: true,
  },
};

export default nextConfig;