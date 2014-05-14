var Block = require("../lib/block");
var shm = require('shm');

var testString = "animaniacs";

exports.testBlockSetup = function(test) {
  var block = new Block('test', 1);
  test.notEqual(block.shmId_, undefined, "block.shmId_ should be defined");
  test.done();
};

exports.testBlockRead = function(test) {
  var block = new Block('test', testString.length);
  shm.writeSHM(block.shmId_, new Buffer(testString), 0, testString.length);
  test.equal(block.read().toString(), testString, "block should read back test string");
  test.done();
};

exports.testBlockWrite = function(test) {
  var block = new Block('test', testString.length);
  block.write(new Buffer(testString));
  var data = shm.readSHM(block.shmId_, 0, testString.length);
  test.equal(data.toString(), testString, "block should write test string");
  test.done();
};
