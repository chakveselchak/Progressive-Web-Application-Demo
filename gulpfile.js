var gulp = require('gulp');
var config = require('./source/js/config.js');

gulp.task('generate-service-worker', function(callback) {
  generateWS(callback);
});


function generateWS (callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = 'public';
  var contextDir = config.context;
      contextDir = contextDir.slice(0,-1);

  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,woff,eot,ttf}'],
    stripPrefix: rootDir,
    replacePrefix: contextDir
  }, callback);
}