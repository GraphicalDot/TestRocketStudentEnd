({
    appDir: ".",
    baseUrl: "js",
    //- this is the directory that the new files will be. it will be created if it doesn't exist
    dir: "../../frontend_build/student",
    name: "main",
    //out: "dist/main.js",
    mainConfigFile: 'js/main.js',
    removeCombined: true,
    findNestedDependencies: true,
    optimizeCss: "standard.keepLines",
    /*modules: [
     {
     name: "main"
     }
     ],*/
    fileExclusionRegExp: /(\.git)|(node_modules)/,
    uglify2: {
        mangle: false
    },
    optimize: "uglify2",
    generateSourceMaps: true,
    preserveLicenseComments: false
}) 
