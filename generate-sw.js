const workboxBuild = require('workbox-build');
const SRC_DIR = 'src/client';
const BUILD_DIR = 'dist/public';
const SW = 'sw.js';
const globPatterns = [
  '**/*.{js,png,ico,svg,html,css}',
  'assets/**/*'
];

const globIgnores = [
  'package.json',
  'index.js',
  'sw.js'
];

const input = {
  swSrc: `${SRC_DIR}/${SW}`,
  swDest: `${BUILD_DIR}/${SW}`,
  globDirectory: BUILD_DIR,
  globPatterns: globPatterns,
  globIgnores: globIgnores,
  maximumFileSizeToCacheInBytes: 4000000
};

workboxBuild.injectManifest(input).then(() => {
  console.log(`The service worker ${BUILD_DIR}/${SW} has been injected with a precache list.`);
});
