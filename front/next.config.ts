import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Active le mode standalone pour Docker
    output: 'standalone',

    // Configuration des images
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

export default nextConfig;