import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /**
   * Enable static exports for the App Router.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: "export",

  reactCompiler: true,
  
  // 设置 turbopack.root 解决构建警告
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
