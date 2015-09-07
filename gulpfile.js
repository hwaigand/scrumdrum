var gulp = require('gulp');
// var gulpAngularTemplatecache = require('gulp-angular-templatecache');
// var gulpAutoprefixer = require('gulp-autoprefixer');
// var gulpBump = require('gulp-bump');
// var gulpCsso = require('gulp-csso');
// var gulpFilter = require('gulp-filter');
// var gulpIf = require('gulp-if');
// var gulpImagemin = require('gulp-imagemin');
// var gulpInject = require('gulp-inject');
// var gulpJscs = require('gulp-jscs');
// var gulpJshint = require('gulp-jshint');
// var gulpLess = require('gulp-less');
// var gulpMinifyHtml = require('gulp-minify-html');
// var gulpNgAnnotate = require('gulp-ng-annotate');
// var gulpNodemon = require('gulp-nodemon');
// var gulpPlumber = require('gulp-plumber');
// var gulpPrint = require('gulp-print');
// var gulpRev = require('gulp-rev');
// var gulpRevReplace = require('gulp-rev-replace');
// var gulpTaskListing = require('gulp-task-listing');
// var gulpUglify = require('gulp-uglify');
// var gulpUtil = require('gulp-util');
// var gulpUseref = require('gulp-useref');
var jshintStylish = require('jshint-stylish');

//var series = require('stream-series');
//var karma = require('karma').server;
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var gp = require('gulp-load-plugins')({ lazy: true });
var config = require('./gulp.config')();
var del = require('del');
var port = process.env.PORT || config.defaultPort;


gulp.task('help', gp.taskListing);
gulp.task('default', ['help']);

gulp.task('vet', function () {
    log('Analyzing source code with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe(gp.if(args.verbose, gp.print()))
        .pipe(gp.jscs())
        .pipe(gp.jshint())
        .pipe(gp.jshint.reporter(jshintStylish, { verbose: true }))
        .pipe(gp.jshint.reporter('fail', { ignoreWarning: true }));
});

gulp.task('styles', ['clean-styles'], function () {
    log('Compiling less --> css');

    return gulp
        .src(config.less)
        .pipe(gulpLess())
        .pipe(gulpPlumber())
        .pipe(gulpAutoprefixer({ browsers: ['last 2 version', '> 5%'] }))
        .pipe(gulp.dest(config.temp));
});

gulp.task('customCss', ['clean-customCss'], function () {
    log('Copying custom CSS');

    return gulp
        .src(config.customCss)
        .pipe(gulp.dest(config.build + 'css'));
});

gulp.task('fonts', ['clean-fonts'], function () {
    log('Copying fonts');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('images', ['clean-images'], function () {
    log('Copying and compressing images');

    return gulp
        .src(config.images)
        .pipe(gulpImagemin({ optimizationlevel: 4 }))
        .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('clean', function (done) {
    var delconfig =
    [].concat(config.build, config.temp);
    log('Cleaning: ' + gp.util.colors.blue(delconfig));
    del(delconfig, done);
});

gulp.task('clean-customCss', function (done) {
    clean(config.build + 'css/**/*.*', done);
});

gulp.task('clean-fonts', function (done) {
    clean(config.build + 'fonts/**/*.*', done);
});

gulp.task('clean-images', function (done) {
    clean(config.build + 'images/**/*.*', done);
});

gulp.task('clean-styles', function (done) {
    clean(config.temp + '**/*.css', done);
});

gulp.task('clean-code', function (done) {
    var files =
    [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    );
    clean(files, done);
});

gulp.task('less-watcher', function () {
    gulp.watch([config.less], ['styles']);
});

gulp.task('templatecache', ['clean-code'], function () {
    log('Creating AngularJS $templatecache');
    return gulp
        .src(config.htmlTemplates)
        .pipe(gulpMinifyHtml({ empty: true }))
        .pipe(gulpAngularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});

gulp.task('wiredep', function () {

    log('Wire Up the bower css and js and the app js');

    //var vendorStream = gulp.src(config.vendor, { read: false });
    //var appStream = gulp.src(config.js, { read: false });

    //var options = config.getWiredepDefaultOptions();
    //var wiredep = require('wiredep').stream;
    //var vendor = config.vendor;

    return gulp
        .src(config.index)
        //.pipe(wiredep(options))
        .pipe(gulpInject(gulp.src(config.jscript, { read: false }), { starttag: '<!-- inject:jscript:{{ext}} -->' }))
        .pipe(gulpInject(gulp.src(config.vendor, { read: false }), { starttag: '<!-- inject:vendor:{{ext}} -->' }))
        .pipe(gulpInject(gulp.src(config.css)))
        .pipe(gulpInject(gulp.src(config.customCss, { read: false }), { starttag: '<!-- inject:customCss:{{ext}} -->' }))
        .pipe(gulpInject(gulp.src(config.js))) 
        .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function () {

    log('Wire up the app css');

    return gulp
        .src(config.index)
        .pipe(gulp.dest(config.root));
});

gulp.task('client-watcher', function () {
    gulp.watch([config.alljs], ['vet', 'inject']);
});


gulp.task('optimize', ['inject', 'images', 'fonts', 'customCss'], function () {

    var assets = gulpUseref.assets({ searchPath: './' });
    var templateCache = config.temp + config.templateCache.file;
    var cssFilter = gulpFilter('**/' + config.optimized.css);
    var customCssFilter = gulpFilter('**/' + config.optimized.customCss);
    var jqFilter = gulpFilter('**/' + config.optimized.jq);
    var jsLibFilter = gulpFilter('**/' + config.optimized.lib);
    var jsAppFilter = gulpFilter('**/' + config.optimized.app);

    log('Optimizing js, css and html');

    return gulp
        .src(config.index)
        .pipe(gulpPlumber())
        .pipe(gulpInject(gulp.src(templateCache, { read: false }),
            {
                starttag: '<!-- inject:templatecache -->'
            }
        ))
        .pipe(assets)
        .pipe(cssFilter)
        .pipe(gulpCsso())
        .pipe(cssFilter.restore())
        .pipe(customCssFilter)
        .pipe(gulpCsso())
        .pipe(customCssFilter.restore())
        .pipe(jqFilter)
        .pipe(gulpUglify())
        .pipe(jqFilter.restore())
        .pipe(jsLibFilter)
        .pipe(gulpUglify())
        .pipe(jsLibFilter.restore())
        .pipe(jsAppFilter)
        .pipe(gulpNgAnnotate())
        .pipe(gulpUglify())
        .pipe(jsAppFilter.restore())
        //.pipe(gulpRev())
        .pipe(assets.restore())
        .pipe(gulpUseref())
        //.pipe(gulpRevReplace())
        //.pipe(gulp.dest(config.root))
        //.pipe(gulpRev.manifest())
        .pipe(gulp.dest(config.root));

});

/**
 * Bump the version
 * --type-pre   will bump the pre-release version   *.*.*-x
 * --type-patch or no flag will bump the patch version   *.*.x
 * --type-minor will bump the minor version   *.x.*
 * --type-major will bump the major version   x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', function () {
    var msg = 'Bumping version';
    var type = args.type;
    var version = args.version;
    var options = {};

    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }

    log(msg);

    return gulp
    .src(config.packages)
    .pipe(gulpBump(options))
    .pipe(gulp.dest(config.root));
});

//gulp.task('build-Release', ['optimize'], function () {
//    log('Building Release ....');
//});

//gulp.task('build-Debug', ['inject'], function () {
//    log('Building Debug ....');
//});

gulp.task('clean-Release', ['clean'], function () {
    log('Cleaning Release ....');
});

gulp.task('clean-Debug', ['clean'], function () {
    log('Cleaning Debug ....');
});

gulp.task('serve-dev', ['optimize'], function () {
    serve(true); // isDev
});

gulp.task('serve-build', ['inject'], function () {
    serve(false); // isDev
});

gulp.task('test', ['vet', 'templatecache'], function (done) {
    log('starting Testing');
    startTests(true, done);
});

gulp.task('tests', function (done) {
    return karma.start(//{ port: 9876 },
        {configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});


/////////////////////

function serve(isDev) {

    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    return gulpNodemon(nodeOptions)
        .on('restart', ['vet'], function (ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function () {
                browserSync.notify('reloading now ...');
                browserSync.reload({ stream: false });
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync(isDev);
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function startBrowserSync(isDev) {

    if (args.noSync || browserSync.active) {
        return;
    }

    log('Starting browser-sync on port: ' + port);
    //if (isDev) {
    //    gulp.watch([config.less], ['styles'])
    //        .on('change', function (event) { changeEvent(event); });
    //} else {
    //    gulp.watch([config.less, config.js, config.html],
    //        ['optimize', browserSync.reload])
    //        .on('change', function (event) { changeEvent(event); });
    //}

    //gulp.task('less-watcher', function () {
    //    gulp.watch([config.less], ['styles']);
    //});

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,

        files: isDev ? [
            config.scripts + '*.min.js',
            config.client + '**/*.*',
            '!' + config.less,
            config.temp
        ] : [],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-GCRStoreDemo',
        notify: true,
        reloadDelay: 1000
    };
    browserSync(options);

}

function startTests(singleRun, done) {
   
    var excludeFiles = [];
    var serverSpecs = config.serverIntegrationSpecs;

    excludeFiles = serverSpecs;

    log('starting Testing');

    karma.start({
        configFile: __dirname + '/karma.config.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    function karmaCompleted(karmaResult) {
        log('Karma completed');
        if (karmaResult === 1) {
            done('karma: tests failed with code ' + karmaResult);
        } else {
            done();
        }
    }
}

function clean(path, done) {
    log('cleaning' + gp.util.colors.blue(path));
    del(path, done);
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                gp.util.log(gp.util.colors.blue(msg[item]));
            }
        }
    } else {
        if (msg) {
            gp.util.log(gp.util.colors.blue(msg));
        }
    }
}
