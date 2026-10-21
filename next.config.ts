import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ホームフォルダにも package-lock.json があるため、ルートを明示する
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
