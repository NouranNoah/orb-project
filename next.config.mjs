/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n.js');

const nextConfig = {
  transpilePackages: ['zego-express-engine-webrtc'],
  images: {
    domains: ['res.cloudinary.com'], 
  },
};

export default withNextIntl(nextConfig);
