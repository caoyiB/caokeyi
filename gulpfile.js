var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean-css');
var concat = require('gulp-concat');
var server = require('gulp-webserver');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var htmlmin = require('gulp-htmlmin');
var server = require('gulp-webserver');
var url = require('url');
var list = require('./public/scripts/index.json');
var fs = require("fs");
var path = require("path");

gulp.task('devSass', function () {
    return gulp.src('./public/styles/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ["last 2 versions"]
        }))
        .pipe(concat('all.css'))
        .pipe(clean())
        .pipe(gulp.dest("./public/css"))
})

gulp.task('watch', function () {
    return gulp.watch('./public/styles/*.scss', gulp.series('devSass'))
})

gulp.task('server', function () {
    return gulp.src('./public')
        .pipe(server({
            port: 9090,
            open: true,
            middleware: function (req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return res.end("")
                }
                if (pathname === '/api/list') {
                    var name = url.parse(req.url, true).query.name;

                    var target = [];

                    list.forEach(function (item) {
                        if (item.title.match(name) != null) {
                            target.push(item.item);
                        }
                    })

                    res.end(JSON.stringify({
                        code: 1,
                        data: target
                    }))
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'public', pathname)));
                }

            }
        }))
})

gulp.task('public', gulp.series('devSass', 'server', 'watch'));

gulp.task('bUglify', function () {
    return gulp.src('./public/scripts/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/scripts/'))
})

gulp.task('bHtmlmin', function () {
    return gulp.src('./public/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('./build'))
})

gulp.task('bCss', function () {
    return gulp.src('./public/css/*.css')
        .pipe(gulp.dest('./build/css'))
})

gulp.task('fonts', function () {
    return gulp.src('./public/fonts/*.{html,log,css,eot,js,svg,ttf,woff}')
        .pipe(gulp.dest('./build/fonts'))
})

gulp.task('images', function () {
    return gulp.src('./public/images/*.jpg')
        .pipe(gulp.dest('./build/images'))
})

gulp.task('json', function () {
    return gulp.src('./public/scripts/*.json')
        .pipe(gulp.dest('./build/scripts'))
})

gulp.task('shang', function () {
    return gulp.src('build')
        .pipe(server({
            port: 8080,
            open: true,
            livereload: true,
            middleware: function (req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return res.end("")
                }
                if (pathname === '/api/list') {
                    var name = url.parse(req.url, true).query.name;

                    var target = [];

                    list.forEach(function (item) {
                        if (item.title.match(name) != null) {
                            target.push(item.item);
                        }
                    })

                    res.end(JSON.stringify({
                        code: 1,
                        data: target
                    }))
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'build', pathname)));
                }

            }
        }))
})

gulp.task('build', gulp.series('bUglify', 'bHtmlmin', 'bCss', 'fonts', 'images','json'))