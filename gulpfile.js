// конвертації ttf у woff, woff2


let project_folder = "dist";
//let project_folder = require("path").basename(__dirname);
let source_folder = "#src";

let fs = require('fs');

let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html", "!" + source_folder + "/blocks/_*.html" ],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/*.js",
		img: source_folder + "/img/**/*.{jpg,jpeg,png,gif,ico,webp,svg}",
		//img: source_folder + "/img/**/*.{jpg,png,gif,ico,webp,svg}",
		fonts: source_folder + "/fonts/*.ttf",
		svg: source_folder + "/img/svg/*.svg",

		//video: source_folder + "/video/*",
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		//img: source_folder + "/img/**/*.{jpg,png,gif,ico,webp,svg}",
		img: source_folder + "/img/**/*.{jpg,jpeg,png,gif,ico,webp,svg}",
		svg: source_folder + "/img/svg/*.svg",
		//video: source_folder + "/video/*.*"

	},
	clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	scss = require("gulp-sass"),
	scssError = require('gulp-sass-error'),
	autoprefixer = require("gulp-autoprefixer"),
	group_media = require("gulp-group-css-media-queries"),
	clean_css = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	uglify = require("gulp-uglify-es").default,
	imagemin = require("gulp-imagemin"),
	webp = require("gulp-webp"),
	webphtml = require("gulp-webp-html"),
	webpcss = require("gulp-webpcss"),
	svgSprite = require("gulp-svg-sprite"),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace'),
	ttf2woff = require("gulp-ttf2woff"),
	ttf2woff2 = require("gulp-ttf2woff2"),
	fonter = require("gulp-fonter"),
	concat = require("gulp-concat"),
	cssbeauty = require("gulp-cssbeautify"),
	sourcemaps = require('gulp-sourcemaps'),
	chokidar = require('chokidar');

	const throwError = true

// One-liner for current directory
// chokidar.watch('.').on('all', (event, path) => {
// console.log(event, path);
// });;


function browserSync() {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}

function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

function css() {
	return src(path.src.css)

		//.pipe(sourcemaps.init())
		.pipe(
			scss({
				outputStyle: "expanded"
			}).on('error', scss.logError)
		)
		.pipe(group_media())

		.pipe(cssbeauty())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(webpcss())
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		//.pipe(sourcemaps.write('./'))
		.pipe(dest(path.build.css))

		.pipe(browsersync.stream())
}

function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(
			uglify()
		)
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

function images() {
	return src(path.src.img)
		.pipe(
			webp({
				//quality: 90
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		// .pipe(
		// 	imagemin({
		// 		progressive: true,
		// 		svgoPlugins: [{ removeViewBox: false }],
		// 		interlaced: true,
		// 		optimizationLevel: 3 // 0 to 7
		// 	})
		// )
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}



function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts))
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))

}

gulp.task('otf2ttf', function () {
	return src([source_folder + '/fonts/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(source_folder + '/fonts/'));
})

// виконується окремим таском -- gulp svgSprite  -- для збирання спрайту із svg файлів
// gulp.task('svgSprite', function () {
// 	return gulp.src([source_folder + '/img/svg/*.svg'])
// 		.pipe(svgSprite({
// 			mode: {
// 				stack: {
// 					sprite: "../sprite.svg", //sprite file name
// 					//example: true
// 				}
// 			},
// 		}
// 		))
// 		.pipe(dest(path.build.img))

// })

function svgSprites() {
	return src(path.src.svg)

		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite

		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg",

				}

			},
		}
		))
		.pipe(dest(path.build.img))

}

function fontsStyle(params) {

	let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];

					if (c_fontname != fontname) {
						fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}

function libs() {
	return src([
		'node_modules/jquery/dist/jquery.js',
		'node_modules/slick-carousel/slick/slick.js',
		//'node_modules/swiper/swiper-bundle.js',
		//'node_modules/nouislider/distribute/nouislider.js',
		//'node_modules/wnumb/wNumb.js',
		//'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
		//'node_modules/select2/dist/js/select2.min.js',
		'node_modules/wowjs/dist/wow.min.js',
		//'node_modules/ion-rangeslider/js/ion.rangeSlider.min.js',
		//'node_modules/bootstrap/js/dist/modal.js'
		// 'node_modules/popper.js/dist/umd/popper.js',
		//'node_modules/bootstrap/dist/js/bootstrap.min.js',



	])

		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(dest(path.build.js))

};

// function video() {
// 	return src(path.src.video)
// 		.pipe(dest(path.build.video))
// 		.pipe(browsersync.stream())
// }



function cb() {

}

function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
	//gulp.watch([path.watch.svg], svgSprites);
	//gulp.watch([path.watch.video], video);
}

function clean() {
	return del(path.clean);

}

//let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, libs, video), fontsStyle);
let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, libs, svgSprites), fontsStyle);

//let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, libs), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

// exports.video = video;
exports.fontsStyle = fontsStyle;
exports.libs = libs;
exports.fonts = fonts;
exports.images = images;
exports.svgSprites = svgSprites;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;


