let gulp = require('gulp');
let del = require('del');
let browserify = require('browserify');
let babelify = require('babelify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify');
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


gulp.task('scripts', () => {
  return browserify(
    {
      paths: [path.join(__dirname, paths.script.src)],
      entries: paths.game.entry,
      debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source(paths.game.dest))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./srcmaps'))
    .pipe(gulp.dest(paths.script.dest));
});

async function clean() {
  del([paths.build]);
}

async function copyHTML() {
  gulp.src([paths.base + '/index.html', ])
      .pipe(gulp.dest(paths.build));
}

async function copyAssets() {
  gulp.src(paths.assets.src + '/**/*')
      .pipe(gulp.dest(paths.assets.dest));
}

async function copyPhaser() {
  gulp.src(paths.phaser + '/phaser.min.js')
      .pipe(gulp.dest(paths.script.dest));
}

async function copyStyles() {
  gulp.src(paths.styles.src + '/**/*.css')
      .pipe(gulp.dest(paths.styles.dest));
}

gulp.task('clean', clean);
gulp.task('copy-html', copyHTML);
gulp.task('copy-assets', copyAssets);
gulp.task('copy-phaser', copyPhaser);
gulp.task('copy-styles', copyStyles);
gulp.task('copy-static', gulp.series('copy-html', 'copy-assets', 'copy-phaser', 'copy-styles'));
gulp.task('build', gulp.series('copy-static', 'scripts'));
gulp.task('default', gulp.series('build'));
