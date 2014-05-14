var util = require("util");
var events = require ("events");
var Block = require("./block");

function Mailbox(tag, size) {
  this.block_ = new Block(tag, size);
  this.header_ = new Block(tag + ':header', Mailbox.HEADER_LENGTH);
};

Mailbox.prototype.send = function(data) {
  this.block_.write(data);
  this.header_.write(MESSAGE_PENDING_BUFFER);
  return this;
};

Mailbox.prototype.pending = function() {
  var headerData = this.header_.read();
  return headerData[0] == Mailbox.MESSAGE_PENDING;
};

Mailbox.prototype.readLoop_ = function() {
  if (!this.pending()) {
    setImmediate(this.readLoop_);
    return;
  }

  var data = this.block_.read();
  this.header_.write(MESSAGE_EMPTY_BUFFER);
  this.receiving_ = false;
  this.emit('receive', data)
};

Mailbox.prototype.receive = function() {
  if (this.receiving_)
    return this;

  this.receiving_ = true;
  this.readLoop_();
  return this;
};

Mailbox.MESSAGE_PENDING = true;
Mailbox.MESSAGE_PENDING_BUFFER = new Buffer([Mailbox.MESSAGE_PENDING]);
Mailbox.MESSAGE_EMPTY = false;
Mailbox.MESSAGE_EMPTY_BUFFER = new Buffer([Mailbox.MESSAGE_EMPTY]);
Mailbox.HEADER_LENGTH = Mailbox.MESSAGE_PENDING.length;

util.inherits(Mailbox, events.EventEmitter);

module.exports = Mailbox;