esfs
====

wrapper to use fs easily


## About
Wrap fs function to use typical function easily.

## Function
- cp
 - copy file / directory
  - cp(src, dst, options, callback);
     - src: source file or directory
     - dst: destination for source
     - options
         - filter: set filter with regexp format.
     - callback: callback function
- cpSync
 - copy file / directory synchronously
 - cpSync(src, dst, options);
- rm
 - remove file / directory
 - rm(path, callback);
     - path: file / directory path
     - callback: callback function
- rmSync
 - remove file / directory synchronously
 - rmSync(path);
- mkdir
 - make directory
 - mkdir(path, mode, callback);
     - path: file / directory path
     - mode: permission
     - callback: callback function
- mkdirSync
 - make directory synchronously
- mkdirp
 - make directory with subdirectory

## sample    
    var esfs = require('esfs');
    esfs.cp('input.txt', 'output.txt', options);

    esfs.mkdirSync('test');
    esfs.mkdirSync('test/test2');
    esfs.mkdirSync('test/test2/test3');

    var cb = function() {
      console.log('callback test');
    };
    esfs.rm('test', cb);

    // copy directory with filter
    var options = {filter:['.txt']};
    esfs.cp('inputdir', 'outputdir', options);

    // create directory tree
    esfs.mkdirp('tree1/tree2/tree3/tree4');



## License 

(The MIT License)

Copyright (c) 2013 Shunsuke &lt;qfoori@gmail.com&gt;  

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
