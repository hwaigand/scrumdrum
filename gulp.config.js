module.exports = function () {

    var client = './src/client/';
    var clientApp = client + 'app/';
    var clientCommon = client + 'common/';
    var report = './report/';
    var root = './';
    var scripts = './Scripts/';
    var server = './server';
    var temp = './temp/';
    //var wiredep = require('wiredep');
    //var bowerFiles = wiredep({ devDependencies: true }).js;

    //Files paths
    var config = {
        alljs: [
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        build: './build/',
        client: client,
        clientApp: clientApp,
        css: [
            temp + 'styles.css',
            root + 'Content/*.css'
        ],
        customCss: [
            client + 'customCss/gcrclient.css'
        ],
        fonts: [
            './bower_components/font-awesome/fonts/**/*.*',
            './bower_components/bootstrap/fonts/**/*.*'
        ],
        html: client + '**/*.html',
        htmlTemplates: clientApp + '**/*.html',
        images: client + 'images/**/*.*',
        index: [
            client + 'index.html'
        ],
        indexJs: [
           client + 'index.js'
        ],

        indexSrc: [
            client + 'src/client/'
        ],

        js: [
            clientCommon + '**/*.module.js',
            clientApp + '**/*.module.js',
            clientApp + '**/*.config.js',
            clientApp + '**/*.js',
            clientCommon + '**/*.config.js',
            clientCommon + '**/*.js',
            client + 'js/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],

        jscript: [
            scripts + 'modernizr*.js',
            scripts + 'jq*.min.js',
            scripts + 'bootstrap*.min.js'
        ],

        vendor: [
            scripts + 'angular.js',
            scripts + '*.min.js',
            scripts + 'angular-ui/ui-bootstrap-tpls.min.js',
            '!' + scripts + 'angular.min.js',
            '!' + scripts + 'modernizr*.js',
            '!' + scripts + 'bootstrap*.min.js',
            '!' + scripts + 'jq*.*'
        ],

        less: './Content/styles.less',
        report: report,
        root: root,
        server: server,
        temp: temp,

        // optimized files
        optimized: {
            css: 'lib.css',
            customCss: 'app.css',
            jq: 'jq.js',
            app: 'app.js',
            lib: 'lib.js'
        },

        // templatecache
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app',
                standAlone: false,
                root: 'app/'
            }
        },

        // browserSync
        browserReloadDelay: 1000,

        // bower and npm locations
        bower: {
            //json: require('./bower.json'),
            directory: './Scripts',
            ignorePath: '../..'
        },

        packages: [
            './package.json',
            './bower.json'
        ],

        // karma and testing settings
        specHelpers: [client + 'test-helpers/*.js'],
        serverIntegrationSpecs: [client + 'tests/server-integration/**/*.spec.js', client + 'tests/*.spec.js'],

        // node settings
        defaultPort: 7203,
        nodeServer: './server/app.js'
    };

    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    };

    config.karma = getKarmaOptions();

    return config;


    ///////////////////////////////

    function getKarmaOptions() {
        var options = {
            files: [].concat(
                //bowerFiles,
                config.specHelpers,
                client + '**/*.module.js',
                client + '**/*.js',
                temp + config.templateCache.file,
                config.serverIntegrationSpecs
            ),
            exclude: [],
            coverage: {
                dir: report + 'coverage',
                reporters: [
                    { type: 'html', subdir: 'report-html' },
                    { type: 'lcov', subdir: 'report-lcov' },
                    { type: 'text-summary' }
                ]
            },
            preprocessors: {}
        };

        options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];

        return options;
    }
};
