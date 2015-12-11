/* File: gulpfile.js */

//package requirements
var gulp =        require('gulp'),
    gutil =       require('gulp-util'),
    jshint =      require('gulp-jshint'),
    sass =        require('gulp-sass'),
    plumber =     require('gulp-plumber'),
    sourcemaps =  require('gulp-sourcemaps'),
    concat =      require('gulp-concat'),
    copy =        require('gulp-copy'),
    jade =        require('gulp-jade'),
    bower =       require('gulp-bower'),
    watch =       require('gulp-watch'),
    browser =     require('browser-sync'),
    rimraf =      require('rimraf'),
    run =         require('run-sequence'),
    uglify =      require('gulp-uglify'),
    rename =      require('gulp-rename'),
    gulpif =      require('gulp-if'),
    parallelize = require('concurrent-transform'),
    aws =         require('gulp-awspublish'),
    mincss =      require('gulp-minify-css'),
    babel =       require('gulp-babel'),
    isProd =      process.env.NODE_ENV === 'prod',

    paths = {
      filesrc: ['./source/**/*.*'],
      jadesrc: ['./source/**/*.jade'],
      sasssrc: ['./source/**/*.scss'],
      codesrc: ['./source/**/*.js'],
      mediasrc: ['./source/media/**/*', './source/favicon.ico'],
      destination: './public',
    };

//build tasks
gulp.task('default', function(cb){
  run('build', 'serve', 'watch', cb);
});
gulp.task('build', ['clean:public'], function(cb){
  run('bower','jade', 'build-js', 'build-css', 'copy', cb);
});
gulp.task('serve', function(){
  browser.init({server: paths.destination});
});
//refresh tasks
gulp.task('refresh', function(cb){
  return run('build', 'reload', cb);
});
gulp.task('reload', function(){
  browser.reload();
});
//wipe out public folder on build
gulp.task('clean:public', function(cb){
  rimraf(paths.destination, cb);
});
//set which files to watch for changes
gulp.task('watch', function(){
  return watch(paths.filesrc, function(){
    gulp.start('refresh');
  });
});
//helper tasks
gulp.task('copy', function(){
  return gulp.src(paths.mediasrc)
  .pipe(copy(paths.destination, {prefix: 1}))
  .on('error', gutil.log);
});
gulp.task('bower', function(){
  return bower();
});
gulp.task('jshint', function(){
  return gulp.src(paths.codesrc)
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});
gulp.task('jade', function(){
  return gulp.src(paths.jadesrc)
  .pipe(plumber())
  .pipe(jade({pretty: true, doctype: 'html', locals: {isProd: isProd}}))
  .pipe(gulp.dest(paths.destination))
  .on('error', gutil.log);
});
gulp.task('build-css', function(){
  return gulp.src(paths.sasssrc)
  .pipe(plumber(function(error) {
    gutil.log(gutil.colors.red(error.message));
    this.emit('end');
  }))
  .pipe(sourcemaps.init())
  .pipe(sass({errLogToConsole: true}))
  .pipe(concat('styles.css'))
  //minify if you "export NODE_ENV='prod'"
  .pipe(gulpif(isProd, rename({suffix: '.min'})))
  .pipe(gulpif(isProd, mincss()))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.destination));
});
gulp.task('build-js', function(){
  return gulp.src(paths.codesrc)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(concat('index.js'))

    //uglify/minify if you "export NODE_ENV='prod'"
  .pipe(gulpif(isProd, rename({suffix: '.min'})))
  .pipe(isProd ? uglify() : gutil.noop())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.destination))
  .on('error', gutil.log);
});
//publishing tasks for amazon web services
gulp.task('publish', ['bower', 'build'], function(){
  var awsParams = {
    'params': {
      "Bucket": process.env.AWS_BUCKET
    },
    'accessKeyId': process.env.AWS_ACCESS_KEY_ID,
    'secretAccessKey': process.env.AWS_SECRET_ACCESS_KEY
    };
  var publisher = aws.create(awsParams);
  return gulp.src('./public/**/*')
    .pipe(aws.gzip())
    .pipe(parallelize(publisher.publish({}), 20))
    .pipe(publisher.cache())
    .pipe(aws.reporter())
    .on('error', gutil.log);
});
