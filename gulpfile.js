const gulp = require('gulp')
const gulpless = require('gulp-less') 
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const del = require('del')
//! пути к нашим изначальным файлам и файлам назначения
const paths = {
    styles: {
        src: 'src/styles/**/*.less',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    }
}
//! таск для очистки каталогов
function clean() {
    return del(['dist']);    //* удалем все ненужные файлы из папки dist
}
//! задача для пробразования less в css и затем добавляние в папку dist
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(gulpless())
        .pipe(cleanCSS())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))  //* скомпилировался но куда то его надо записать 
        .pipe(gulp.dest(paths.styles.dest))    //* записываем файл
}
//! task для обработки скриптов 

function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true
    })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest))

}
//! task для обработки стилей
function watch() {      //* следит за изменениями в файле 
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

const build = gulp.series(clean, gulp.parallel(styles,scripts), watch);   //* выполняет задачи последовательно выполняет 3 задачи и обрабатывает их последовательно
//! Полключение модулей
exports.clean = clean;   //* экспортируем модули как задачи и дальше с помощью команды gulp мы можем их вызывать gulp clean 
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;   //* deafult срабатывает когда мы просто пишем команду gulp