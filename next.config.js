const path = require("path");

// let assetPrefix = "/";
// let basePath = "/";

// if (isGithubActions) {
//   const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");

//   assetPrefix = `/${repo}/`;
//   basePath = `/${repo}`;
// }

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  // assetPrefix: assetPrefix,
  // basePath: basePath,
  // images: {
  //   loader: "imgix",
  //   path: 'the "domain" of your Imigix source',
  // },
};

module.exports = nextConfig;
