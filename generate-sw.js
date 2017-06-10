const workboxBuild = require('workbox-build');
const SRC_DIR = 'src';
const BUILD_DIR = 'dist';

const input = {
  swSrc: `${SRC_DIR}/sw.js`,
  swDest: `${BUILD_DIR}/sw.js`,
  globDirectory: BUILD_DIR,
  manifestDest: `${BUILD_DIR}/manifest.js`,
  globPatterns: [
    '**/*.{js,png,ico,svg,html,css}',
    'assets/**/*',
    // 'api/**/*', // not ideal for data
  ],
  globIgnores: [
    'package.json',
    'index.js',
    'sw.js'
  ],
  // staticFileGlobs: [
  //   'assets/**/*',
  //   'favicon.ico',
  //   'offline.html',
  //   '*.bundle.js',
  //   '*.chunk.js'
  // ]
  maximumFileSizeToCacheInBytes: 4000000
};

workboxBuild.generateFileManifest(input).then(() => {
  console.log('The production manifest for pre-cache jhas been created with a precache list.');
});
