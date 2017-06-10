const workboxBuild = require('workbox-build');
const SRC_DIR = 'src';
const BUILD_DIR = 'dist';

const input = {
  swDest: `${BUILD_DIR}/sw.js`,
  globDirectory: BUILD_DIR,
  globPatterns: [
    '**/*.{js,png,ico,svg,html,css}',
    'assets/**/*'
  ],
  globIgnores: [
    'package.json',
    'index.js',
    'sw.js'
  ],
  navigateFallback: '/index.html',
  clientsClaim: true,
  runtimeCaching: [
    {
      urlPattern: /\/api\/(.*)/,   // /^https:\/\/example\.com\/api/,
      handler: 'cacheFirst'
    }
  ],
  handleFetch: true,
  maximumFileSizeToCacheInBytes: 4000000
};

workboxBuild.generateSW(input).then(() => {
  console.log('The production service worker has been injected with a precache list.');
});
