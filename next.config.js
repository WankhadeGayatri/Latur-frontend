module.exports = {
  server: {
    port: 8189,
  },
};
// next.config.js

module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
  },
};
// Add to next.config.js if using Vercel or similar
headers: async () => [
  {
    source: "/Images/:all*",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ],
  },
];
