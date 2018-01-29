'use strict';

const
  gulp = require('gulp'),
  gulpOptions = require('gulp-options'),
  excludeGitignore = require('gulp-exclude-gitignore'),
  gutil = require('gulp-util'),
  spawnMocha = require('gulp-spawn-mocha'),
  plugins = require('gulp-load-plugins')();

const TEST_TIMEOUT = 60000;

const paths = {
  lint: ['**/*.js'],
  watch: ['index.js', './src/**/*.js', './test/**/*.js'],
  tests: {
    unit: ['./test/unit/**/*-spec.js'],
    integration: ['./test/integration/**/*-spec.js'],
    functional: ['./test/functional/**/*-spec.js']
  },
  source: ['index.js', './src/**/*.js']
};

const ISTANBUL_OPTS = {
  print: 'both',
  'include-all-sources': false
};

let skipTests = gulpOptions.get('skip-tests') || '@skip';

gulp.task('lint', () => {
  return gulp.src(paths.lint)
    .pipe(excludeGitignore())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('coverage', () => {
  return gulp.src(paths.tests.unit.concat(paths.tests.integration).concat(paths.source))
    .pipe(spawnMocha({
      timeout: TEST_TIMEOUT,
      istanbul: ISTANBUL_OPTS,
      grep: skipTests,
      invert: true
    }))
    .on('error', gutil.log);
});

gulp.task('coveralls', ['coverage'], () => {
  return gulp.src('coverage/**/lcov.info')
    .pipe(plugins.coveralls());
});

gulp.task('test:unit', () => {
  return gulp.src(paths.tests.unit.concat(paths.source), { read: false })
    .pipe(spawnMocha({
      istanbul: ISTANBUL_OPTS,
      grep: skipTests,
      invert: true
    }))
    .on('error', gutil.log);
});

gulp.task('test:integration', () => {
  return gulp.src(paths.tests.integration.concat(paths.source), { read: false })
    .pipe(spawnMocha({
      timeout: TEST_TIMEOUT,
      istanbul: ISTANBUL_OPTS,
      grep: skipTests,
      invert: true
    }))
    .on('error', gutil.log);
});

gulp.task('test:functional', () => {
  return gulp.src(paths.tests.functional, { read: false })
    .pipe(spawnMocha({
      timeout: TEST_TIMEOUT,
      istanbul: false,
      invert: true
    }))
    .on('error', gutil.log);
});

gulp.task('test:unit-watch', () => {
  gulp.watch(paths.watch, ['test:unit']);
});

gulp.task('test', ['coverage']);
gulp.task('travis', ['lint', 'coveralls']);
gulp.task('default', ['lint', 'test']);
