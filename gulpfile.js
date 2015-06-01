var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var del = require('del');
var vinylPaths = require('vinyl-paths');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var complexity = require('gulp-complexity');
var karma = require('karma').server;
var stylish = require('jshint-stylish');
var eslint = require('gulp-eslint');
var eslintPathFormatter = require('eslint-path-formatter');
var mocha = require('gulp-mocha');
var mochaLcovReporter = require('mocha-lcov-reporter');
var coverage = require('gulp-coverage');
var open = require('gulp-open');
var istanbul = require('gulp-istanbul');
// var Promise          = require('Bluebird');
var merge = require('gulp-merge');
var CONFIG = require('./build.config');
var reload = browserSync.reload;
var newer = require('gulp-newer'); // only copy the new one
var runSequence = require('run-sequence');

// **********************************************************************
// **********************************************************************
// **********************************************************************

var buildFolder = './build';

// tells you everything wrong with your code, quickly. Format, styling, and complexity.
gulp.task('analyze', function () {
  return gulp.src(CONFIG.client.sourceFiles)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'))
      .on('error', function (e) {
        console.warn('jshint failed.');
      })
      .pipe(jscs())
      .on('error', function (e) {
        console.warn('jscs failed');
      })
      .pipe(complexity({
        cyclomatic: [3, 7, 12],
        halstead: [8, 13, 20],
        maintainability: 100
      })
  )
      .on('error', function (e) {
        console.warn('complexity failed');
      });
});

// Like analyze, but stops if something doesn't pass a quality gate.
gulp.task('analyzeWhileIFix', function () {
  return gulp.src(CONFIG.client.sourceFiles)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'))
      .on('error', function (e) {
        this.emit('end');
      })
      .pipe(jscs())
      .on('error', function (e) {
        this.emit('end');
      })
      .pipe(complexity({
        cyclomatic: [3, 7, 12],
        halstead: [8, 13, 20],
        maintainability: 100
      })
  )
      .on('error', function (e) {
        this.emit('end');
      });
});

// runs full unit tests on your code and outputs code coverage reports for client & ci server
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/' + CONFIG.karma.configFile,
    singleRun: true
  }, function () {
    done();
  });
});

// shows your coverage
gulp.task('showCoverage', function () {
  gulp.src('./coverage/html/index.html')
      .pipe(open());
});

// runs Karma in CI mode, and re-runs unit tests while you code. Made for uber-fast unit testing
// or hardercore refactoring runs.
gulp.task('testWhileICode', function (done) {
  karma.start({
    configFile: __dirname + '/' + CONFIG.karma.configFile,
    singleRun: false,
    reporters: ['progress']
  }, function () {
    done();
  });
});

// runs analyze and test on your code with the addition of es6 linting. If it doesn't pass a quality gate,
// it fails. This should be run before you attempt a Git push / SVN commit.
gulp.task('judge', function (done) {
  gulp.src(CONFIG.client.sourceFiles)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'))
      .on('error', function (e) {
        this.emit('end');
      })
      .pipe(jscs())
      .on('error', function (e) {
        this.emit('end');
      })
      .pipe(eslint())
      .pipe(eslint.format(eslintPathFormatter))
      .pipe(eslint.failOnError())
      .pipe(complexity({
        cyclomatic: [3, 7, 12],
        halstead: [8, 13, 20],
        maintainability: 100
      })
  )
      .on('error', function (e) {
        this.emit('end');
      })
      .on('finish', function () {
        karma.start({
          configFile: __dirname + '/' + CONFIG.karma.configFile,
          singleRun: true
        }, function () {
          done();
        })
      });

});

// **********************************************************************
// **********************************************************************
// **********************************************************************

// cleans the build directories
gulp.task('clean', function (done) {
  del(CONFIG.buildFilesAndDirectoriesToClean, function () {
    console.log("clean done");
    done();
  });
});

// here for testing your version of Node supports native promises, else use Bluebird.
gulp.task('cow', function () {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, 1000);
  })
      .then(function () {
        return new Promise(function (resolve, reject) {
          setTimeout(resolve, 1000);
        });
      })
      .then(function () {
        return new Promise(function (resolve, reject) {
          setTimeout(resolve, 1000);
        });
      });
});

// copies all the files you need for a dev build. Missing prod for now.
gulp.task('copy', function () {
  // NOTE: doesn't work, task never completes, I give up.
  // All streams above work fine if you return individually,
  // so it's something wrong with merge.
  // return merge(htmlStream, jsStream, templateStream);

  return new Promise(function (resolve, reject) {
    gulp.src('src/client/index.html')
        .pipe(wiredep({ignorePath: "../../"}))
        .pipe(newer(buildFolder))
        .pipe(gulp.dest(buildFolder))
        .on('end', resolve)
        .on('error', reject);
  })
      .then(function () {
        return new Promise(function (resolve, reject) {
          gulp.src(CONFIG.client.sourceFiles)
              .pipe(newer(buildFolder))
              .pipe(gulp.dest(buildFolder))
              .on('end', resolve)
              .on('error', reject);
        });
      })
      .then(function () {
        return new Promise(function (resolve, reject) {
          gulp.src(CONFIG.client.templateFiles)
              .pipe(newer(buildFolder))
              .pipe(gulp.dest(buildFolder))
              .on('end', resolve)
              .on('error', reject);
        });
      })
      .then(function () {
        // NOTE: this guy, even in stream mode, breaks, so putting here.
        browserSync.reload();
      });
});

// injects all your files into index.html
gulp.task('inject', ['copy'], function () {
  var sources = gulp.src(CONFIG.client.sourceFiles, {read: false});
  return gulp.src('./build/index.html')
      .pipe(inject(sources, {ignorePath: '/src/client/'}))
      .pipe(gulp.dest(buildFolder));
});

// refreshes the web page when any of the files in the build folder is changed
// proxy url points to the running nodemon server url
gulp.task('browser-sync', ['start'], function () {
  browserSync.init({
    files: ['build/**/*.*'],
    proxy: 'http://localhost:8628/'
  });
  gulp.watch('src/**/*.*', ['inject']);
});

// starts nodemon to watch files and reboot your static and api web server when they change
gulp.task('start',['inject'], function (cb) {
  var called = false;
  nodemon({
    script: 'src/static/app.js',
    ext: 'js html',
    ignore: ['Gruntfile.js', 'gulpfile.js', 'node_modules', 'bower_components'],
    env: {'NODE_ENV': 'development'},
    watch: ['src/static/app.js']
  }).on('start', function onStart() {
    // ensure start only got called once
    if (!called) {
      cb();
    }
    called = true;
  }).on('restart', function onRestart() {
    // reload connected browsers after a slight delay
    setTimeout(function reload() {
      browserSync.reload({
        stream: false   //
      });
    }, 500);
  });
});

// git-r-done
gulp.task('default', function () {
  runSequence(['clean','browser-sync']);
});

//Handling errors during streaming process
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}
