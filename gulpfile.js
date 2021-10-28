'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var notify = require("gulp-notify");
var gulpignore = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var uglifycss = require('gulp-uglifycss');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require( 'imagemin-pngquant' );
var imageminJpegRecompress = require( 'imagemin-jpeg-recompress' );
var flatten = require( 'gulp-flatten' );

var sourcePath = 'assets';
var destinationPath = 'dist';

var reportError = function (error) {
    notify({
            title: "There's an error",
            message: 'Check the console for more details.'
        }).write(error);
    console.log(error.toString());
    this.emit('end');
};

gulp.task('sass', gulp.series(function(done) {
    return gulp.src([sourcePath + '/sass/**/*.scss', "!" + sourcePath + "/sass/**/_*.scss"])
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(
                sass( {
                        errLogToConsole: true,
                        //outputStyle: 'compressed',
                        outputStyle: 'compact',
                        // outputStyle: 'nested',
                        // outputStyle: 'expanded',
                        precision: 10
                    }
                ).on('error', reportError)
            )
            .pipe(prefix('last 2 versions'))
            .pipe(sourcemaps.write('.'))
            .pipe(uglifycss())
            .pipe(gulp.dest(destinationPath + '/css'));
    done();
}));

gulp.task('img', gulp.series(function(done) {
        return gulp.src(sourcePath + '/images/**/*')
            .pipe(
                imagemin(
                    {
                        progressive: true,
                        svgoPlugins: [{removeViewBox: false}],
                        use: [pngquant(), imageminJpegRecompress({loops: 3, min: 80})]
                    }
                )
            )
            .pipe(gulp.dest(destinationPath + '/images'));
    
    done();
}));

gulp.task('js', gulp.series(function(done) {
        return gulp.src(sourcePath + '/js/**/*.js')
            .pipe(uglify())
            .pipe(gulp.dest(destinationPath + '/js'));

    done();
}));

gulp.task('fonts', gulp.series(function(done) {
    return gulp.src(sourcePath + '/fonts/**/*' )
        .pipe( flatten({ includeParents: 1} ) )
        .pipe( gulp.dest(destinationPath + '/fonts' ) );
    done();
}));


gulp.task(
    'watch', function () {

		gulp.watch(sourcePath + '/sass/**/*.scss', gulp.series('sass'));

		gulp.watch(sourcePath + '/js/**/*.js', gulp.series('js') );

        gulp.watch(sourcePath + '/images/**/*', gulp.series('img') );
        
        gulp.watch( sourcePath + '/fonts/**/*', gulp.series( 'fonts' ) );


    }
);

gulp.task('default', gulp.parallel('sass', 'js', 'img', 'fonts'));


