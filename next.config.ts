const { execSync } = require('child_process');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BUILD_ID: execSync('git rev-parse HEAD').toString().trim(),
  },
  generateBuildId: async () => {
    return execSync('git rev-parse HEAD').toString().trim();
  },
};

module.exports = nextConfig;
