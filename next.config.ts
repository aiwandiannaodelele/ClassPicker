import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 设置 turbopack.root 解决构建警告
  turbopack: {
    root: "./"
  }
};

export default nextConfig;