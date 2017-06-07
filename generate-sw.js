const workboxBuild = require('workbox-build');
const SRC_DIR = 'src';
const BUILD_DIR = 'dist';

workboxBuild.injectManifest({
  swSrc: `${SRC_DIR}/sw.js`,
  swDest: `${BUILD_DIR}/sw.js`,
  globDirectory: BUILD_DIR,
  globPatterns: [
    '**/*.{js,png,ico,svg,html,css}',
    'assets/**/*'
  ],
  globIgnores: [
    'manifest.js',
    'package.json',
    'index.js',
    'sw.js'
  ],
  manifestDest: `${BUILD_DIR}/manifest.js`,
  maximumFileSizeToCacheInBytes: 4000000
}).then(() => {
  console.log('The production service worker has been injected with a precache list.');
});
