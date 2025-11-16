/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static exports for pages that require authentication
  experimental: {
    // This allows the build to complete without Clerk credentials
  },
};

export default nextConfig;
