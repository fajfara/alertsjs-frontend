const gulp = require('gulp'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      sourcemaps = require('gulp-sourcemaps'),
      browserify = require('browserify'),
      babelify = require('babelify'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      uglify = require('gulp-uglify');


const styleSRC = './scss/main.scss',
      styleDIST = './dist/css/',
      styleWatch = './scss/**/*.scss';

const jsSRC = 'main.js',
      jsFOLDER = './js/';
      jsDIST = './dist/js/',
      jsWatch = './js/**/*.js';


// Style tasks
gulp.task('style', (done) => {

    gulp.src( styleSRC )
        .pipe( sourcemaps.init() )
        .pipe( sass({ 
            errorLogToConsole: true,
            outputStyle: 'compressed'
         }) )
        .on( 'error', console.error.bind( console ) )
        .pipe( autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }) )
        .pipe( rename( { suffix: '.min' } ))
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest(styleDIST) );
    done();

});


// JS tasks
gulp.task('js', (done) => {
    browserify({ 
        entries: jsFOLDER + jsSRC
    })
    .transform( babelify, { presets: ['@babel/preset-env']} )
    .bundle()
    .pipe( source( jsSRC ))
    .pipe( rename( { extname: '.min.js' } ))
    .pipe( buffer() )
    .pipe( sourcemaps.init({ loadMaps: true }))
    .pipe( uglify() )
    .pipe( sourcemaps.write( './' ))
    .pipe( gulp.dest( jsDIST ) )
    done();
});


// Default taks
gulp.task('default', () => {
    gulp.watch(styleWatch, gulp.series('style'));
    gulp.watch(jsWatch, gulp.series('js'));
});