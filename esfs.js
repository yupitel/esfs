/*!
 * esfs
 * Copyright(c) 2013 Shunsuke <qfoori@gmail.com>
 * MIT Licensed
 */

var fs = require('fs');

var esfs = {
  _cp: function(src, dst, regs) {
    if (!src || !dst) {
      return;
    }
    var isCopy = false;
    if (!regs) {
      isCopy = true;
    }
    var stats = fs.lstatSync(src);
    if (!(stats.isDirectory())) {
      if (regs) {
        for (var i = 0; i < regs.length; i++) {
          var reg = regs[i];
          if (reg.test(src)) {
            isCopy = true;
            break;
          }
        }
      }
      if (isCopy === true) {
        var is = fs.createReadStream(src);
        var os = fs.createWriteStream(dst);
        is.pipe(os);
      }
    } else {
      esfs.mkdirSync(dst);
      var list = fs.readdirSync(src);
      list.forEach(function(file) {
        var srcpath = src + '/' + file;
        var dstpath = dst + '/' + file;
        esfs._cp(srcpath, dstpath, regs);
      });
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
  cp: function(src, dst, options, fn) {
    if (options) {
      if (typeof options === 'function') {
        fn = options;
        options = undefined;
      }
    }
    var regs;
    if (options) {
      regs = esfs._setFilter(options.filter);
    }
    var cb = function(exists) {
      if (exists) {
        esfs._cp(src, dst, regs);
      } else {
        console.log('   \033[36m' + src + ' is not found.\033[0m');
      }
      if (fn) {fn();}
    };
    fs.exists(src, cb);
  },
  cpSync: function(src, dst, options) {
    var regs;
    if (options) {
      regs = esfs._setFilter(options.filter);
    }
    if (fs.existsSync(src)) {
      esfs._cp(src, dst, regs);
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
