const transactionTypes = Object.freeze({
  purchase: 'purchase',
  sale: 'sale',
  adjustment: 'adjustment',
  return: 'return',
  expired: 'expired',
  damaged: 'damaged',
});

module.exports = transactionTypes;
