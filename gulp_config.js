var gulpConfig = function() {
  var src = './src/';
  var build = './build/';
  var temp = './temp/'
  var foundation = './bower_components/foundation/'
  var assets = build + 'assets';

  var config = {
    /**
    *   native files
    */
    src: {
        // customed files
        js: src + 'js/**/*.js',
        template: src + 'jade/page/*.jade',
        sass: src + 'sass/**/*.sass',
        applicationSass: src + 'sass/application.sass',

        // bundle js file
        collectionJs: src + 'js/collection.js',

        //foundation css framework
        foundationJs: src + 'foundation/js/',
        foundationScss: src + 'foundation/scss/',
        foundationVendor: src + 'foundation/js/vendor/',

        //third party library or framework for sass
        vendor: src + 'sass/vendor'
    },
    /**
    *   build folders
    */
    build: {
        // customed files
        js: build + 'js/',
        css:  build + 'css/',
        html: build,

        //third party
        assets : {
            //library
            lib: assets + 'lib',
            // font
            font: assets + 'font',
            //iamges
            img: assets + 'img',
            //video
            video: assets + 'video'
        }
    },
    /**
    *   temp folders
    */
    temp: {
      js: temp + 'js/',
      css: temp + 'css/',
      foundationJs: temp + 'foundation/js/',
      foundationScss: temp + 'foundation/scss/'
    },
    /**
    *   cssFramework folders
    */
    cssFramework: {
      js: [foundation + 'js/foundation/**/*.js', foundation + 'js/vendor/**/*.js'],
      scss: foundation + 'scss/**/*.scss'
    }
  };// end config

  return config;
};

module.exports = gulpConfig();
