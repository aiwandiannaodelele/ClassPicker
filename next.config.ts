/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
