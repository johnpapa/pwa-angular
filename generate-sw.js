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
  runtimeCaching: [],
  handleFetch: true,
  maximumFileSizeToCacheInBytes: 4000000
};

workboxSW.router.registerRoute(
  /\/api\/(.*)/,
  // workboxSW.strategies.networkFirst({ networkTimeoutSeconds: 1 })
  workboxSW.strategies.staleWhileRevalidate({ cacheName: 'hero-api' })
);

const networkFirstStrategy = workboxSW.strategies.networkFirst();
workboxSW.router.registerRoute('/home/', networkFirstStrategy);
workboxSW.router.registerRoute('/heroes/', networkFirstStrategy);
workboxSW.router.registerRoute('/villains/', networkFirstStrategy);


workboxBuild.generateSW(input).then(() => {
  console.log('The production service worker has been injected with a precache list.');
});
