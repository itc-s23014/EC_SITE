/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'flowbite.s3.amazonaws.com'],
  },
};

export default nextConfig;