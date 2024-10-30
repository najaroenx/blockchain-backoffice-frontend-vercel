import path from "path";
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config, { isServer }) => {
    config.resolve.alias["@"] = path.resolve(process.cwd(), "src");
    return config;
  },
  images: {
    domains: ["raw.seadn.io"],
  },
};

export default nextConfig;
