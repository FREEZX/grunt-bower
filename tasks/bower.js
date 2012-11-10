/*
 * grunt-bower
 * https://github.com/curist/grunt-bower
 *
 * Copyright (c) 2012 curist
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================
  var task_name = 'bower'
    , task_desc = 'Copy bower installed components to dist folder.'
    , _ = grunt.utils._
    , path = require('path')
    , bower = require('bower')
    , log = grunt.log.write;

  grunt.registerMultiTask(task_name, task_desc, function() {
    var done = this.async()
      , dest = this.file.dest || 'public/scripts/vendor/'
      , base_path = this.data.options.basePath;

    bower.commands.list({"paths":true})
      .on('data',  function (data) {
        _(data).each(function(src_path, lib_name) {
          var preserved_path
            , dest_file_path;

          if(base_path !== undefined) {
            preserved_path = strippedBasePath(base_path, src_path);
          } else {
            preserved_path = '';
          }

          dest_file_path = path.join(dest, preserved_path, (lib_name + '.js'));

          try {
            grunt.file.copy(src_path, dest_file_path);
            log(src_path.cyan + ' copied.\n');
          } catch (err) {
            grunt.fail.warn(err);
          }
        });
        done();
      })
      .on('error', function (err) {
        grunt.fail.warn(err);
      });
  });

  function strippedBasePath(base_path, src_path) {
    var base_path_arr = _(base_path.split(path.sep)).compact()
      , src_path_arr = _(src_path.split(path.sep)).compact()
      , i = 0;

    // we want path only, no filename
    src_path_arr.pop();

    while(base_path_arr[i] === src_path_arr[i]) {
      i++;
    }

    return src_path_arr.slice(i).join(path.sep);
  }
};
