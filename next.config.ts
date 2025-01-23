import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        port: "",
        pathname: "/public/**", // Adjusted to match `/public`
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile images
        port: "",
        pathname: "/**", // Allows all paths under this domain
      },
    ],
  },
};

export default nextConfig;
