/** @type {import('next').NextConfig} */
const nextConfig = {
  //   reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "", // You can leave this empty for standard ports
        pathname: "/dpwtcr4cz/image/upload/**", // Adjust this to match your image paths
      },
    ],
  },
  experimental: {
    reactCompiler: true,
  },
}

export default nextConfig
