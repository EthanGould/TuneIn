var gulp = require('gulp');

var connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: '.',
    livereload: true
  })
});

var gutil = require('gulp-util');

gulp.task('log', function() {
  gutil.log('== My Log Task ==')
});


// SASS
var sass = require('gulp-sass');

gulp.task('sass', function() {
  gulp.src('styles/sass/main.scss')
	  .pipe(
	  	sass(
	  		{
	  			style: 'expanded'
	  		}
	  	)
	  )
	.on('error', gutil.log)
  .pipe(gulp.dest('dist/css'))
});


// WATCH (scripts and styles)
gulp.task('watch', function() {
  gulp.watch('scripts/modules/*.js', ['babel']);
  gulp.watch('styles/sass/main.scss', ['sass']);
});


// BABEL (scripts transpiler)
var babel = require('gulp-babel');
 
gulp.task('babel', () =>
	gulp.src('scripts/modules/test.js')
    .pipe(babel({
        presets: ['env']
    }))
		.pipe(gulp.dest('dist/js'))
);
