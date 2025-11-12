import path from "path";
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config, { isServer }) => {
    config.resolve.alias["@"] = path.resolve(process.cwd(), "src");
    return config;
  },
  images: {
    domains: [
      "raw.seadn.io", 
      "images.unsplash.com",
      "orange-tremendous-wallaby-734.mypinata.cloud"
    ],
  },
};

export default nextConfig;
