const workboxBuild = require('workbox-build');
const SRC_DIR = 'src';
const BUILD_DIR = 'dist';

const input = {
  swSrc: `${SRC_DIR}/sw.js`,
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
  maximumFileSizeToCacheInBytes: 4000000
};

workboxBuild.injectManifest(input).then(() => {
  console.log('The production service worker has been injected with a precache list.');
});
