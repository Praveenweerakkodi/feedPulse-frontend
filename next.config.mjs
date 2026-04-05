/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enables standalone mode for Docker deployments
  // This bundles only the files needed for production avoiding the whole node_modules
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: true, 
  }
};

export default nextConfig;
