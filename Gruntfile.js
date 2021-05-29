module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('./package.json');
    var entryPoint = pkg.name.replace(/-(\w)/g, function(m, g) {
        return g.toUpperCase();
    });
    var umd = {
        prefix:
            "(function (root, factory) {\n" +
            "    if (typeof define === 'function' && define.amd) {\n" +
            "        define([], factory);\n" +
            "    } else if (typeof module === 'object' && module.exports) {\n" +
            "        module.exports = factory();\n" +
            "    } else {\n" +
            "        root."+entryPoint+" = factory();\n" +
            "    }\n" +
            "})(this, function() {\n" +
            "'use strict';\n",
         postfix:
            "\nreturn "+entryPoint+";\n" +
            "});",
    };
    var esm = {
        prefix: "",
        postfix: "export default "+entryPoint+";",
    };
    grunt.initConfig({
        jshint: {
            options: {
                shadow: true,
            },
            files: ['./src/'+pkg.name+'.js'],
        },
        concat: {
            umd: {
                options: {
                    banner: umd.prefix,
                    footer: umd.postfix,
                },
                src: ['./src/'+pkg.name+'.js'],
                dest: './umd/'+pkg.name+'.js',
            },
            esm: {
                options: {
                    banner: esm.prefix,
                    footer: esm.postfix,
                },
                src: ['./src/'+pkg.name+'.js'],
                dest: './esm/'+pkg.name+'.js',
            },
            mjs: {
                src: ['./esm/'+pkg.name+'.js'],
                dest: './esm/'+pkg.name+'.mjs',
            },
        },
        uglify: {
           options: {
               mangle: {},
               compress: {},
           },
           src: {
               src: './src/'+pkg.name+'.js',
               dest: './src/'+pkg.name+'.min.js',
           },
           umd: {
               src: './umd/'+pkg.name+'.js',
               dest: './umd/'+pkg.name+'.min.js',
           },
        },
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
