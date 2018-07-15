var gulp        = require('gulp'),
	scss        = require('gulp-sass'),
	browserSync = require('browser-sync'),
	cssnano     = require('gulp-cssnano'),
	rename      = require('gulp-rename'),
	del         = require('del'),
	imagemin    = require('gulp-imagemin'),
	pngquant    = require('imagemin-pngquant'),
	autoprefixer= require('gulp-autoprefixer');

gulp.task('scss', function() {
	return gulp.src('app/scss/main.scss')
	.pipe(scss().on( 'error', function( error )
      {console.log( error );} )
	)
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade:true}))
	.pipe(gulp.dest('app/styles'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('css-libs', function(){
	return gulp.src('app/styles/main.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'})) 
	.pipe(gulp.dest('app/css'));
});

gulp.task('img', function(){
	return gulp.src('app/img/**/*')
	.pipe(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest('docs/img'));
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('clean', function(){
	return del.sync('docs');
});

gulp.task('watch', ['browser-sync', 'scss'], function() {
	gulp.watch('app/index.html', ['scss']);
	gulp.watch('app/scss/**/*.scss', ['scss']);
	// gulp.watch('app/index.html', browserSync.reload);
	gulp.watch('app/styles/**/*.css', browserSync.reload);
});

gulp.task('build', ['clean', 'scss', 'img'], function() {
	var buildHtml = gulp.src('app/**/*.html')
	.pipe(gulp.dest('docs'));
	
	var buildCss = gulp.src('app/styles/**/*')
	.pipe(gulp.dest('docs/styles'));

	var buildJs = gulp.src('app/script.js')
	.pipe(gulp.dest('docs'));
});
