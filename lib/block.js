var shm = require('shm');

function Block(tag, size) {
  if (!tag)
    throw new Error("Tag must be a non-zero string");
  if (!size)
    throw new Error("Size must be a non-zero integer");
  this.size = size || 1024;
  this.shmId_ = shm.openSHM(tag, 'c', 0, this.size);
};

Block.prototype.read = function(offset, length) {
  return shm.readSHM(this.shmId_, (offset || 0), (length || this.size));
};

Block.prototype.write = function(data, offset, length) {
  if (!data)
    throw new Error("Must specify data to write");
  return shm.writeSHM(this.shmId_, data, (offset || 0), (length || data.length));
};

module.exports = Block;