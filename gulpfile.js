const { src, dest, watch, series } = require('gulp')

//CSS y SASS
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps') 
const cssnano = require('cssnano') 

//IMAGENES
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const avif = require('gulp-avif')

function css(done) {
    //Pasos: 
    //1. {sourcemaps} - Mapear el css con los archivos scss 
    //2. {sass} - Compilar SASS, con la opcion de mimificado
    //3. {postcss} - 
        //{autoprefixer} - Lee el browserList del package.json y compila con la compatibilidad indicada
        //{cssnano} - Mimifica y optimiza la hoja de estilo
    //4. {sourcemaps} - Guarda el mapeo en el mismo directorio
    //5. {sourcemaps} - Guarda el CSS en el directorio indicado

    src('src/scss/app.scss') //Identifica el archivo SASS
     /*  1.  */   .pipe( sourcemaps.init()) 
     /*  2.  */   .pipe( sass({ outputStyle: 'compressed' }) ) 
     /*  3.  */   .pipe( postcss( [ autoprefixer(), cssnano() ] )) 
     /*  4.  */   .pipe( sourcemaps.write('.')) 
     /*  5.  */   .pipe( dest('build/css') )

    done()
}

function imagenes(done) {
    src('src/img/**/*')
        .pipe( imagemin( { optimizationLevel: 3 } ))
        .pipe( dest('build/img') )
    
    done()
    //se puede usar el return para no usar el cb de done()
}

function versionWebp() {
    return src('src/img/**/*.{png,jpg}')
        .pipe( webp( { quality: 50 } ))
        .pipe( dest('build/img'))
}

function versionAvif() {
    return src('src/img/**/*.{png,jpg}')
        .pipe( avif( { quality: 50 } ))
        .pipe( dest('build/img'))
}

function dev() {
    watch('src/scss/**/*.scss', css)
    watch('src/img/**/*', imagenes)
}

//Ese es el nombre con el que voy a llamar a gulp. ej. gulp css
exports.css = css
exports.dev = dev
exports.imagenes = imagenes
exports.versionWebp = versionWebp
exports.versionAvif = versionAvif

exports.default = series( imagenes, versionWebp, versionAvif, css, dev ); 
//se ejecutan con solo gulp y para ejecutar multiples tareas

//series - ejecuta primero una tarea y luego sigue a la otra series( css, dev)
//parallel - inicia las tareas en paralelo( css, dev)

// "browserList": [
//     "last 1 version",
//     "> 1%"
//   ]
