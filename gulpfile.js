const gulp = require('gulp');
const workboxBuild = require('workbox-build');

const SRC_DIR = 'src';
const BUILD_DIR = 'dist';

gulp.task('sw', () => {
  return workboxBuild.generateFileManifest({
    swSrc: `${SRC_DIR}/sw.js`,
    swDest: `${BUILD_DIR}/sw.js`,
    globDirectory: BUILD_DIR,
    manifestDest: `${BUILD_DIR}/manifest.js`,
    maximumFileSizeToCacheInBytes: 4000000,
    staticFileGlobs: [
      'assets/**/*',
      'api/**/*',
      'favicon.ico',
      'offline.html',
      '*.bundle.js',
      '*.chunk.js'
    ]
  });
});

