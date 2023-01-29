module.exports = function(grunt) {

    grunt.initConfig({
        symlink: {
            options: {
                // Enable overwrite to delete symlinks before recreating them
                overwrite: false,
                // Enable force to overwrite symlinks outside the current working directory
                force: false
            },
            // The "build/target.txt" symlink will be created and linked to
            // "source/target.txt". It should appear like this in a file listing:
            // build/target.txt -> ../source/target.txt
            explicit: {
                src: 'source/target.txt',
                dest: 'build/target.txt'
            },
            // These examples using "expand" to generate src-dest file mappings:
            // http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
            expanded: {
                files: [
                    // All child files and directories in "source", starting with "foo-" will
                    // be symlinked into the "build" directory, with the leading "source"
                    // stripped off.
                    {
                        expand: true,
                        overwrite: false,
                        cwd: 'source',
                        src: ['foo-*'],
                        dest: 'build'
                    },
                    // All child directories in "source" will be symlinked into the "build"
                    // directory, with the leading "source" stripped off.
                    {
                        expand: true,
                        overwrite: false,
                        cwd: 'source',
                        src: ['*'],
                        dest: 'build',
                        filter: 'isDirectory'
                    }
                ]
            },
        }
    });

    /**
     * Load modules
     */
    grunt.loadNpmTasks('grunt-contrib-symlink');

    /**
     * Main tasks
     */
    grunt.registerTask('default', ['symlink']);

};