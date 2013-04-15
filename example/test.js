var esfs = require('../esfs');

var fnFind = function(results) {
  console.log(results);
};

esfs.find('./sample', {filter: ['.ejs']}, fnFind);

var result = esfs.findSync('./sample', {filter: ['.txt']});
console.log(result);

esfs.rm('output.txt');
esfs.rmSync('sample_copy');

esfs.cp('sample/input.txt', 'output.txt', options);

console.log('test');
esfs.mkdirSync('test');
esfs.mkdirSync('test/test2');
esfs.mkdirSync('test/test2/test3');

var cb = function() {
  console.log('callback test');
};
esfs.rm('test', cb);

// copy directory with filter
var options = {filter:['.ejs']};
esfs.cp('sample', 'sample_copy', options);

// create directory tree
esfs.mkdirp('tree1/tree2/tree3/tree4');



