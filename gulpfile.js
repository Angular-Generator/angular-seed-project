var gulp                = require('gulp');
var browserSync         = require('browser-sync');
var del                 = require('del');
var vinylPaths          = require('vinyl-paths');
var typescript          = require('gulp-typescript');
var concat              = require('gulp-concat');
var source              = require('vinyl-source-stream');
var buffer              = require('vinyl-buffer');
var wiredep             = require('wiredep').stream;
var inject              = require('gulp-inject');
var nodemon             = require('gulp-nodemon');
var jshint              = require('gulp-jshint');
var jscs                = require('gulp-jscs');
var complexity          = require('gulp-complexity');
var karma               = require('karma').server;
var stylish             = require('jshint-stylish');
var eslint              = require('gulp-eslint');
var eslintPathFormatter = require('eslint-path-formatter');
var mocha               = require('gulp-mocha');
var  mochaLcovReporter  = require('mocha-lcov-reporter');
var coverage            = require('gulp-coverage');
var open                = require('gulp-open');
var istanbul            = require('gulp-istanbul');
var Promise          = require('Bluebird');
var merge               = require('gulp-merge');

var CONFIG              = require('./build.config');

gulp.task('hello', function()
{
	console.log('Waaazzuuuuuppp');
});

// tells you everything wrong with your code, quickly. Format, styling, and complexity.
gulp.task('analyze', function() {
  return gulp.src(CONFIG.client.sourceFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', function(e)
    {
    	console.warn('jshint failed.');
    })
    .pipe(jscs())
    .on('error', function(e)
    {
    	console.warn('jscs failed');
    })
    .pipe(complexity(CONFIG.complexity)
    )
    .on('error', function(e)
    {
    	console.warn('complexity failed');
    });
});

// Like analyze, but stops if something doesn't pass a quality gate.
gulp.task('analyzeWhileIFix', function()
{
    return gulp.src(CONFIG.client.sourceFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', function(e)
    {
        this.emit('end');
    })
    .pipe(jscs())
    .on('error', function(e)
    {
        this.emit('end');
    })
    .pipe(complexity(CONFIG.complexity)
    )
    .on('error', function(e)
    {
       this.emit('end');
    });
});

// runs full unit tests on your code and outputs code coverage reports for client & ci server
gulp.task('test', function (done)
{
  karma.start({
	    configFile: __dirname + '/' + CONFIG.karma.configFile,
	    singleRun: true
	  }, function()
	  {
	  	done();
	  });
});

// shows your coverage
gulp.task('showCoverage', function()
{
    gulp.src('./coverage/html/index.html')
        .pipe(open());
});

// runs Karma in CI mode, and re-runs unit tests while you code. Made for uber-fast unit testing
// or hardercore refactoring runs.
gulp.task('testWhileICode', function(done)
{
    karma.start({
        configFile: __dirname + '/' + CONFIG.karma.configFile,
        singleRun: false,
        reporters: ['progress']
      }, function()
      {
        done();
      });
});

// cleans the build directories
gulp.task('clean', function(done)
{
    del(CONFIG.buildFilesAndDirectoriesToClean, function()
        {
            console.log("clean done");
            done();
        });
});

// copies all the files you need for a dev build. Missing prod for now.
gulp.task('copy', ['clean'], function()
{
    // NOTE: doesn't work, task never completes, I give up.
    // All streams above work fine if you return individually,
    // so it's something wrong with merge.
    // return merge(htmlStream, jsStream, templateStream);
    
    return new Promise(function(resolve, reject)
    {
        gulp.src('src/client/index.html')
        .pipe(wiredep({ignorePath: "../../"}))
        .pipe(gulp.dest('./build'))
        .on('end', resolve)
        .on('error', reject);
    })
    .then(function()
    {
        return new Promise(function(resolve, reject)
        {
             gulp.src(CONFIG.client.sourceFiles)
            .pipe(gulp.dest('./build'))
            .on('end', resolve)
            .on('error', reject);
        });
    })
    .then(function()
    {
        return new Promise(function(resolve, reject)
        {
             gulp.src(CONFIG.client.templateFiles)
            .pipe(gulp.dest('./build'))
            .on('end', resolve)
            .on('error', reject);
        });
    })
    .then(function()
    {
        // NOTE: this guy, even in stream mode, breaks, so putting here.
        browserSync.reload();
    });
});

// injects all your files into index.html
gulp.task('inject', ['copy'], function()
{
	var wiredepSources = require('wiredep')();
	console.log("wiredepSources.css:", wiredepSources);
	var both = CONFIG.client.sourceFiles.concat(wiredepSources.css);
	console.log("both:", both);
	var sources = gulp.src(both, {read: false});
	return gulp.src('./build/index.html')
	.pipe(inject(sources, {ignorePath: '/src/client/'}))
	.pipe(gulp.dest('./build'))
	.pipe(browserSync.reload({stream: true}));
});

// refreshes the webpage
gulp.task('browserSync', function(done)
{
	browserSync({
		baseDir: 'build/index.html'
	});
	done();
});

// watch doesn't work, I gave up
// gulp.task('watch', function(done)
// {
// 	gulp.watch([
//         'src/client/*.html', 
//         'src/client/*.js', 
//         'src/client/**/*.js',
//         'src/client/**/*.html'], 
//         {read: false},
//         ['clean', 'copy', 'inject'])
//     .on('change', function(sup)
//     {
//         console.log
//     });
//     done();
// });

gulp.task('openIndex', function(done)
{
	gulp.src('./build/index.html')
        .pipe(open());

    setTimeout(function()
    {
    	done();
    }, 2000);
});

// starts nodemon to watch files and reboot your static and api web server when they change
gulp.task('start', function (done)
{
  nodemon({
	    script: 'src/static/app.js',
	    ext: 'js html',
        ignore: ['Gruntfile.js', 'gulpfile.js', 'node_modules', 'bower_components'],
	  	env: { 'NODE_ENV': 'development' },
        tasks: ['clean', 'copy', 'inject']
  	});
  done();
});

// git-r-done
gulp.task('default', [
	'clean', 
	'copy', 
	'inject',
	'openIndex', 
	'browserSync'
]);
