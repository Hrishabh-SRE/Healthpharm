// Validates the environment before Next builds or boots. Keep this import first.
import "./src/env";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
