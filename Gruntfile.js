module.exports = function (grunt) {
	'use strict';

	var path = require('path');
	var util = require('util');

	grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-fileindex');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: ['build/**/*.*', 'build', 'test/**/_tmp.*', 'test/tmp', 'tmp']
		},
		typescript: {
			options: {
				target: 'es5',
				base_path: 'src/'
			},
			module: {
				src: ['lib/module.ts'],
				dest: 'build/module.js'
			},
			test_all: {
				option: {base_path: 'test/any/'},
				src: ['test/any/*.test.ts'],
				dest: 'test/any/_tmp.any.test.js'
			},
			test_node: {
				option: {base_path: 'test/node/'},
				src: ['test/node/*.test.ts'],
				dest: 'test/node/_tmp.node.test.js'
			},
			test_browser: {
				option: {base_path: 'test/browser/'},
				src: ['test/browser/*.test.ts'],
				dest: 'test/browser/_tmp.browser.test.js'
			}
		},
		mochaTest: {
			all: {
				src: ['test/any/*.test.js', 'test/node/*.test.js'],
				options: {
					reporter: 'mocha-unfunk-reporter'
				}
			}
		},
		mocha: {
			options: {
				bail: true,
				log: true,
				mocha: {
					ignoreLeaks: false
				},
				reporter: 'mocha-unfunk-reporter',
				run: true
			},
			all: {
				src: ['test/*.html']
			}
		},
		fileindex: {
			tests: {
				options: {
					format: 'script_src'
				},
				files: [
					{dest: 'test/_tmp.browser.bundle.js', cwd: 'test', src: ['any/*.test.js', 'browser/*.test.js'], filter: 'isFile'}
				]
			}
		}
	});

	require('source-map-support').install();

	grunt.registerTask('default', ['test']);
	grunt.registerTask('build', ['clean', 'typescript', 'fileindex', 'mochaTest', 'mocha']);
	grunt.registerTask('test', ['build']);

};