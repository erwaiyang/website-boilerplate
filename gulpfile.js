/*eslint-env node */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', ['copy-html', 'copy-images', 'copy-json', 'copy-framework', 'styles', 'lint', 'scripts'], function() {
	gulp.watch('view/styles/**/*.scss', ['styles']);
	gulp.watch('controller/**/*.js', ['lint', 'scripts-dist']);
	gulp.watch('view/*.html', ['copy-html']);
	gulp.watch('./dist/*.html').on('change', browserSync.reload);
	gulp.watch('./dist/js/*.js').on('change', browserSync.reload);

	browserSync.init({
		server: './dist'
	});
});

gulp.task('dist', [
	'copy-html',
	'copy-images',
	'styles',
	'lint',
	'scripts'
]);

gulp.task('scripts', function() {
	gulp.src('controller/**/*.js')
		.pipe(concat('all.js'))
		.pipe(uglify({
			mangle: false
		}))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('copy-html', function() {
	gulp.src('./view/*.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
	gulp.src('image/*')
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('copy-json', function() {
	gulp.src('model/data/*.json')
		.pipe(gulp.dest('./dist/js/data'));
});

gulp.task('copy-framework', function(){
	gulp.src('./framework/**/*')
		.pipe(gulp.dest('./dist'));
});

gulp.task('styles', function() {
	gulp.src('view/styles/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('lint', function () {
	return gulp.src(['controller/**/*.js'])
		// eslint() attaches the lint output to the eslint property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failOnError last.
		.pipe(eslint.failOnError());
});

gulp.task('tests', function () {
	gulp.src('./__test__/spec/extraSpec.js')
		.pipe(jasmine({
			integration: true,
			vendor: 'controller/**/*.js'
		}));
});