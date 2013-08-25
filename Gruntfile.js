module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            javascript: {
                files: [{
                    expand: true,
                    cwd: 'src/scripts/lib/',
                    src: ['require.minified.js'],
                    dest: 'app/js'
                }]
            },
            web: {
                files: [{
                    expand: true,
                    cwd: 'src/html/',
                    src: ['app.html'],
                    dest: 'app/'
                }]
            },
            channel: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['channel.php'],
                    dest: 'app/'
                }]
            }
        },
        less: {
            production: {
                options: {
                    paths: ['less'],
                    yuicompress: true
                },
                files: {
                    'app/css/app.css': 'src/less/app.less',
                }
            }
        },

        jshint: {
            files: ['Gruntfile.js', 'src/scripts/*.js'],
            options: {
                camelcase: true,
                eqeqeq: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noempty: true,
                nonew: true,
                plusplus: true,
                quotmark : true,
                undef: true,
                unused: true,
                trailing: true,
                maxparams: 4,
                maxdepth: 3,
                maxstatements: 14,
                maxlen: 100,
                jquery: true,
                browser: true, // to allow global browser variables
                // options here to override JSHint defaults
                predef : ['define', 'require'],
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        clean : {
            distro : {
                src : ['app']
            }
        },
        requirejs: {
            compile: {
                options: {
                    almond: true,
                    wrap: true,
                    name: 'config',
                    baseUrl: 'src/scripts/lib',
                    mainConfigFile: 'src/scripts/config.js',
                    out: 'app/js/app.js'
                }
            }
        },
        ftpush: {
          build: {
            auth: {
              host: 'uw12.uniweb.no',
              port: 21,
              authKey: 'key1'
            },
            src: 'app/',
            dest: '/www/likeapp',
            exclusions: [''],
            keep: ['']
          }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-ftpush');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'less', 'copy', 'requirejs', 'ftpush']);
    grunt.registerTask('test', ['jshint']);
};