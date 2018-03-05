let gulp = require('gulp');
let del = require('del');
let browserify = require('browserify');
let babelify = require('babelify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
let path = require('path');

const paths = {
  phaser: './node_modules/phaser/dist/',
  base: './src',
  build: './build',
  assets: {
    src: './src/assets',
    dest: './build/assets'
  },
  styles: {
    src: './src/css',
    dest: './build/css'
  },
  script: {
    src: './src/js',
    dest: './build/js'
  },
  game: {
    entry: './src/js/Game.js',
    dest: 'game.js'
  }
};

gulp.task('default', ['build']);

gulp.task('build', ['copy-static', 'scripts']);

gulp.task('scripts', function() {
  return browserify(
    {
      paths: [path.join(__dirname, paths.script.src)],
      entries: paths.game.entry,
      debug: true
    })
    .transform(babelify, {
      babel: require('@babel/core'),
      sourceMaps: true
    })
    .bundle()
    .pipe(source(paths.game.dest))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./srcmaps'))
    .pipe(gulp.dest(paths.script.dest));
});

gulp.task('clean', function() {
  del([paths.build]);
});

gulp.task('copy-static', ['copy-html', 'copy-assets', 'copy-phaser', 'copy-styles']);

gulp.task('copy-html', function() {
  gulp.src([paths.base + '/index.html', ])
    .pipe(gulp.dest(paths.build));
});

gulp.task('copy-assets', function() {
  gulp.src(paths.assets.src + '/**/*')
    .pipe(gulp.dest(paths.assets.dest));
});

gulp.task('copy-phaser', function() {
  gulp.src(paths.phaser + '/phaser.min.js')
    .pipe(gulp.dest(paths.script.dest));
});

gulp.task('copy-styles', function() {
  gulp.src(paths.styles.src + '/**/*.css')
    .pipe(gulp.dest(paths.styles.dest));
});
