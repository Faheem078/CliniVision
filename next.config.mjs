/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    images: {
        domains: [
            "images.unsplash.com",
            "res.cloudinary.com"
        ],
    },

    experimental: {
        typedRoutes: false,
    },
};

export default nextConfig;