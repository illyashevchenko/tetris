/**
 * Created by Illia_Shevchenko on 01.09.2015.
 */
'use strict';


var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    mainBowerFiles = require('main-bower-files'),
    args    = require('yargs').argv,

    transpile = args.es5,

    clientConf = {
        folder: './app/',
        source: './app/src',
        mainJs  : './app/src/main.js',
        js    : './app/src/**/*.js',
        html  : './app/index.html',
        css   : './app/styles/main.css',

        tests: './app/tests/**/*.spec.js',
        jsOut : 'app.js',
        cssOut: 'app.css',
        libJsOut: 'lib.js',
        docOut     : './app/documentation',

        testConf: './app/karma.conf.js',
        testBuildConf: './app/karma.conf.build.js'
    },

    destination = 'server' + (transpile ? '-es5' : ''),
    clientDestination = destination + '/public',

    initEnv = function () {
        process.env.NODE_TRANSPILE = transpile;
        process.env.NODE_DEST      = destination;
    };

initEnv();

gulp.task('clientLibJs', function () {
    var files = mainBowerFiles({
        paths: clientConf.folder,
        filter: /require.js/
    });

    gulp.src(files)
        .pipe(plugins.uglify())
        .pipe(gulp.dest(clientDestination));
});

gulp.task('clientJs', function () {
    gulp.src(clientConf.mainJs)
        .pipe(plugins.requirejsOptimize({
            useStrict: true,
            baseUrl  : clientConf.source,
            paths  : {
                json: '../bower_components/requirejs-plugins/src/json',
                text: '../bower_components/requirejs-plugins/lib/text'
            },
            out: clientConf.jsOut/*,
            TODO: Source maps seems not to be working - file is not created

             optimize: 'uglify2',
             generateSourceMaps: true,
             preserveLicenseComments: false
             */
        }))
        .pipe(gulp.dest(clientDestination));
});

gulp.task('clientLint', function () {
    gulp.src(clientConf.js)
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format());
});


gulp.task('clientDoc', function () {
    require('del')(clientConf.docOut + '/**')
        .then(function () {
            gulp.src(clientConf.js)
                .pipe(plugins.jsdoc(clientConf.docOut));
        });
});

//TODO: Add process html to make work app without building and change it on building
gulp.task('clientHtml', function () {
    gulp.src(clientConf.html)
        .pipe(gulp.dest(clientDestination));
});


gulp.task('clientCss', function () {
    gulp.src(clientConf.css)
        .pipe(plugins.minifyCss())
        .pipe(plugins.concat(clientConf.cssOut))
        .pipe(gulp.dest(clientDestination));
});

gulp.task('clientTest', function () {
    gulp.src('notexisting')
    .pipe(plugins.karma({
            configFile: clientConf.testConf,
            logLevel  : 'ERROR',
            action    : 'run'
        }));
});

//TODO: This is not working. Because we bootstrap main.js file also to build. And karma runs it.
gulp.task('clientTestBuild', function () {
    gulp.src('notexisting')
        .pipe(plugins.karma({
            configFile: clientConf.testBuildConf,
            action    : 'run'
        }));
});


gulp.task('clientBuild', ['clientTest', 'clientLint', 'clientLibJs', 'clientJs', 'clientHtml', 'clientCss']);
gulp.task('clientBuildDev', ['clientTest', 'clientLint', 'clientDoc']);

gulp.task('clientDev', ['clientBuildDev'], function () {
    gulp.watch([clientConf.js, clientConf.tests], ['clientBuildDev']);
});

gulp.task('default', []);