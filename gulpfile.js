//  *************************************
//
//  Gulpfile
//
//  *************************************
//
//  Available tasks:
//  'gulp'
//  'gulp list'
//  'gulp build'
//  'gulp lint:js'
//  'gulp concat:js'
//  'gulp watch:js'
//  'gulp serve'
//
//  *************************************



//  -------------------------------------
//  Modules
//  -------------------------------------
//
//  gulp                    :  The streaming build system
//  gulp-autoprefixer				:  Prefix CSS with Autoprefixer
//  gulp-load-plugins       :  Automatically load Gulp plugins
//  gulp-cached             :  A simple in-memory file cache for gulp
//  gulp-eslint             :  The pluggable linting utility for JavaScript and JSX
//  gulp-jade								:  Compile Jade templates
//  gulp-jscs               :  JS code style linter
//  gulp-jscs-stylish       :  A reporter for the JSCS
//  gulp-plumber            :  Prevent pipe breaking caused by errors from gulp plugins
//  gulp-rucksack						:  A little bag of CSS superpowers
//  gulp-sourcemaps         :  Source map support for Gulp.js
//  gulp-task-listing       :  Task listing for your gulpfile
//  gulp-using              :  Lists all files used
//  gulp-util               :  Utility functions for gulp plugins
//  gulp-sass								:  Something like this will compile your Sass files
//  react                   :  A JavaScript library for building user interfaces
//  reactify                :  Browserify transform for JSX
//  vinyl-buffer            :  Convert streaming vinyl files to use buffers
//  vinyl-source-stream     :  Use conventional text streams at the start
//  babel-eslint            :  Lint ALL valid Babel code with ESlint
//  babelify                :  Babel browserify transform
//  browser-sync            :  Live CSS Reload & Browser Syncing
//  browserify              :  Browser-side require() the node way
//  eslint-config-airbnb    :  Airbnb's ESLint config, following our styleguide
//  eslint-plugin-react     :  React specific linting rules for ESLint
//  main-bower-files        :  Dynamically include your bower components
//
// -------------------------------------



//  -------------------------------------
//  Require gulp module
//  -------------------------------------
//
//  gulp core modules
var gulp = require('gulp');
var config = require('./gulp_config');
var $ = require('gulp-load-plugins')({lazy: true});
//
//  browserify related modules
var browserify = require('browserify');
var babelify = require('babelify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
//
//  browser-sync module
var browserSync = require('browser-sync').create();
//
//  export files from bower_components
var mainBowerFiles = require('main-bower-files');
//
//  -------------------------------------



//  -------------------------------------
//  Utility function
//  -------------------------------------
//
function log(msg) {
	if (typeof(msg) === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				$.util.log($.util.colors.bgYellow.white(msg[item]));
			}
		}
	}
	else {
		$.util.log($.util.colors.underline.bold.bgYellow(msg));
	}
}
//
//  -------------------------------------


//  -------------------------------------
//  Task: list
//  -------------------------------------
//
gulp.task('list', function() {
  log('list all tasks registered');
  $.taskListing();
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: build
//  -------------------------------------
//
gulp.task('build', ['concat:js', 'compile:css', 'compile:html']);
//
//  -------------------------------------



//  -------------------------------------
//  Task: export: foundation
//  -------------------------------------
//
gulp.task('export:foundation', ['export:foundationJs', 'export:foundationScss'])
//
//  -------------------------------------



//  -------------------------------------
//  Task: export: foundationJs
//  -------------------------------------
//
gulp.task('export:foundationJs', function() {
  log('Export js files from foundation');
	return gulp
		.src(config.cssFramework.js, { base: './bower_components/foundation/js/' })
		.pipe($.using({
      prefix: 'export:foundationJs',
      color: 'yellow'
    }))
		.pipe(gulp.dest(config.src.foundationJs));
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: export: foundationScss
//  -------------------------------------
//
gulp.task('export:foundationScss', function() {
  log('Export scss files from foundation');
	return gulp
		.src(config.cssFramework.scss, { base: './bower_components/foundation/scss/' })
		.pipe($.using({
      prefix: 'export:foundationScss',
      color: 'yellow'
    }))
		.pipe(gulp.dest(config.src.foundationScss));
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: export: library
//  -------------------------------------
//
gulp.task('export:library', function() {

	var jsFilter = $.filter(['**/*.js'], {restore: true});
	var cssFilter = $.filter('**/*.css', {restore: true});

	return gulp
		.src(mainBowerFiles())

	  .pipe(jsFilter)
	  .pipe(gulp.dest(config.temp.js))
	  .pipe(jsFilter.restore);

    // .pipe(cssFilter)
    // .pipe(gulp.dest(config.temp.css))
    // .pipe(cssFilter.restore());

});
//
//  -------------------------------------



//  -------------------------------------
//  Task: lint:js
//  -------------------------------------
//
gulp.task('lint:js', function(){
  log('ESlint and JSCS examination task');
  return gulp
    .src(config.src.js)
    .pipe($.cached('linting'))
    .pipe($.plumber())
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.jscs())
    .pipe($.jscsStylish())
    .pipe($.using({
      prefix: 'lint:js',
      color: 'yellow'
    }));
});
//
//  -------------------------------------




//  -------------------------------------
//  Task: concat:js
//  -------------------------------------
//
gulp.task('concat:js',['lint:js'] ,function(){
  log('concat js files task');

	var filesOrder = [
		// vendor for foundation
		config.src.foundationVendor + 'jquery.js',
		config.src.foundationVendor + 'jquery.cookie.js',
		config.src.foundationVendor + 'fastclick.js',
		config.src.foundationVendor + 'placeholder.js',

		// foundation
		config.src.foundationJs + 'foundation/foundation.js',

		// customed js files
		config.src.js
	];

  return gulp
		.src(filesOrder)
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.using({
      prefix: 'concat:js',
      color: 'yellow'
    }))
		.pipe($.babel())
		.pipe($.concat('main.js'))
    .pipe($.sourcemaps.write('./maps'))
    .pipe(gulp.dest(config.build.js))
    .pipe(browserSync.stream());
});
//
//  -------------------------------------


//  -------------------------------------
//  Task: watch:js
//  -------------------------------------
//
gulp.task('watch:js', ['concat:js'], browserSync.reload);
//
//  -------------------------------------



//  -------------------------------------
//  Task: compile:css
//  -------------------------------------
//
gulp.task('compile:css', function () {
    log('Compiling Sass --> CSS');
    return gulp
        .src(config.src.applicationSass)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
				.pipe($.using({
		      prefix: 'compile:css',
		      color: 'yellow'
		    }))
        .pipe($.sass({
          indentedSyntax: true
        }))
				.pipe($.rucksack({
					autoprefixer: true
				}))
        .pipe($.sourcemaps.write('./maps'))
        .pipe(gulp.dest(config.build.css))
        .pipe(browserSync.stream())
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: watch:css
//  -------------------------------------
//
gulp.task('watch:css', ['compile:css'], browserSync.reload);
//
//  -------------------------------------



//  -------------------------------------
//  Task: compile:html
//  -------------------------------------
//
gulp.task('compile:html', function () {
  log('Compiling Jade --> HTML');
  return gulp
    .src(config.src.template)
		.pipe($.cached('compile:html'))
    .pipe($.plumber())
		.pipe($.using({
			prefix: 'compile:html',
			color: 'yellow'
		}))
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest(config.build.html))
    .pipe(browserSync.stream())
});
//
//  -------------------------------------



//  -------------------------------------
//  Task: watch:html
//  -------------------------------------
//
gulp.task('watch:html', ['compile:html'], browserSync.reload);
//
//  -------------------------------------



//  -------------------------------------
//  Task: serve
//  -------------------------------------
//
gulp.task('serve',['build'] ,function() {

    log('browser-sync starts');

    browserSync.init({
        server: {
            baseDir: './build'
        }
    });

    gulp.watch(config.src.js, ['watch:js']);
		gulp.watch(config.src.sass, ['watch:css']);
		gulp.watch(config.src.template, ['watch:html']);
});
//  -------------------------------------



//  -------------------------------------
//  Task: default
//  -------------------------------------
//
gulp.task('default', ['list', 'serve']);
//
//  -------------------------------------
