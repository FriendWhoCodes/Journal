import nextConfig from "eslint-config-next/core-web-vitals";

const eslintConfig = [...nextConfig, { ignores: ["tests/"] }];

export default eslintConfig;
