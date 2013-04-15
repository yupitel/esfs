/*!
 * esfs
 * Copyright(c) 2013 Shunsuke <qfoori@gmail.com>
 * MIT Licensed
 */

var fs = require('fs');

var esfs = {
  _find: function(src, dst, options, fnFile, fnDir) {
    var isUse = false;
    var regs = options.regs;
    if (!regs) {
      isUse = true;
    }
    var stats = fs.lstatSync(src);
    if (!(stats.isDirectory())) {
      if (options.useFile === true) {
        if (regs) {
          for (var i = 0; i < regs.length; i++) {
            var reg = regs[i];
            if (reg.test(src)) {
              isUse = true;
              break;
            }
          }
        }
        if (isUse === true) {
          if (fnFile) {fnFile(src, dst);}
        }
      }
    } else {
      if (options.useDir === true) {
        if (fnDir) {fnDir(src, dst);}
      }
      if (options.recursive === true) {
        var list = fs.readdirSync(src);
        list.forEach(function(file) {
          var srcpath = src + '/' + file;
          var dstpath;
          if (dst) {
            dstpath = dst + '/' + file;
          }
          esfs._find(srcpath, dstpath, options, fnFile, fnDir);
        });
      }
    }
  },
  _setFilter: function(filter) {
    if (!filter) {
      return null;
    }
    if (!(filter instanceof Array)) {
      filter = [filter];
    }
    var regs = [];
    for (var i = 0; i < filter.length; i++) {
      var reg = new RegExp(filter[i], 'i');
      regs.push(reg);
    }
    return regs;
  },
  _setOption: function(options) {
    var result = {};    
    result.recursive = true;
    result.useFile   = true;
    result.useDir    = true;
    if (options) {
      result.regs = esfs._setFilter(options.filter);
      if (options.type === 'd') {
        result.useFile = false;
      } else if (options.type === 'f') {
        result.useDir  = false;
      }
      if (options.recursive === false) {
        result.recursive = false;
      }
    }
    return result;
  },
  find: function(path, options, fn) {
    if (options) {
      if (typeof options === 'function') {
        fn = options;
        options = undefined;
      }
    }
    var args = esfs._setOption(options);
    var cb = function(exists) {
      var results = [];
      if (exists) {
        var fnFile = function(src, dst) {
          results.push(src);        
        };
        esfs._find(path, null, args, fnFile);
      } else {
        console.log('   \033[36m' + path + ' is not found.\033[0m');
      }
      if (fn) {fn(results);}
    };
    fs.exists(path, cb);
  },  
  findSync: function(path, options) {
    var args = esfs._setOption(options);
    if (fs.existsSync(path)) {
      var results = [];
      var fnFile = function(src, dst) {
        results.push(src);
      };
      esfs._find(path, null, args, fnFile);
      return results;
    } else {
      console.log('   \033[36m' + path + ' is not found.\033[0m');
      return null;
    }
  },
  _cpFile: function(src, dst) {
    var is = fs.createReadStream(src);
    var os = fs.createWriteStream(dst);
    is.pipe(os);
  },
  _cpDir: function(src, dst) {
    esfs.mkdirSync(dst);
  },
  cp: function(src, dst, options, fn) {
    if (options) {
      if (typeof options === 'function') {
        fn = options;
        options = undefined;
      }
    }
    var args = esfs._setOption(options);
    var cb = function(exists) {
      if (exists) {
        esfs._find(src, dst, args, esfs._cpFile, esfs._cpDir);
      } else {
        console.log('   \033[36m' + src + ' is not found.\033[0m');
      }
      if (fn) {fn();}
    };
    fs.exists(src, cb);
  },
  cpSync: function(src, dst, options) {
    var args = esfs._setOption(options);
    if (fs.existsSync(src)) {
      esfs._find(src, dst, args, esfs._cpFile, esfs._cpDir);
    } else {
      console.log('   \033[36m' + src + ' is not found.\033[0m');
    }
  },
  _rm: function(path, isSync) {
    var stats = fs.lstatSync(path);
    if (stats.isDirectory()) {
      var list = fs.readdirSync(path);
      list.forEach(function(file) {
        var filepath = path + '/' + file;
        esfs._rm(filepath);
      });
      fs.rmdirSync(path);
    } else {
      fs.unlinkSync(path);
    }
  },
  rm: function(path, fn) {
    fs.exists(path, function (exists) {
      if (exists) {
        esfs._rm(path);
      }
      if (fn) {fn();}
    });
  },
  rmSync: function(path) {
    if (fs.existsSync(path)) {
      esfs._rm(path);
    }
  },
  mkdir: function(path, mode, fn) {
    fs.exists(path, function (exists) {
      if (!exists) {
        fs.mkdir(path, mode, fn);
      }
    });
  },
  mkdirSync: function(path, mode) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, mode);
    }
  },
  mkdirp: function(path, mode) {
    var use = path.replace(/\\/g, '/');
    var list = use.split('/');
    var dir = '';
    if (list[0].match(/.:/i)) {
      dir += list[0];
      list.shift();
    }
    for (var i = 0; i < list.length; i++) {
      if (dir.length > 0) {dir += '/';}
      dir += list[i];
      esfs.mkdirSync(dir, mode);
    }
  }
};
 
module.exports = esfs;
