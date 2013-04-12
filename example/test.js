var esfs = require('./esfs');
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



