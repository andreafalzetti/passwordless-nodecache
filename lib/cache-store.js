'use strict';

var util = require('util');
var bcrypt = require('bcryptjs');
var passwordless = require('passwordless');
var TokenStore = require('passwordless-tokenstore');
var NodeCache = require('node-cache');

var myCache = new NodeCache();

function NodeCacheStore() {
  TokenStore.call(this);

  this._cache = {};
}

util.inherits(NodeCacheStore, TokenStore);

NodeCacheStore.prototype.authenticate = function(token, uid, callback) {
  var self = this;

  if (!token || !uid || !callback) {
    throw new Error('TokenStore:authenticate called with invalid parameters');
  }

  myCache.get(uid, function( err, item ){
    if( !err ){
      if(item == undefined){
        // key not found
        return callback(null, false, null);
      } else {
        // key found

        self._validateToken(token, item, function(err, res) {
          if (err) {
            return callback(err, false, null);
          }

          if (res) {
            if(!item.originUrl) {
              return callback(null, true, "");
            } else {
              return callback(null, true, item.originUrl);
            }
          }

          return callback(null, false, null);
        });

      }
    }
  });
};

NodeCacheStore.prototype.storeOrUpdate = function(token, uid, msToLive, originUrl, callback) {
  if (!token || !uid || !msToLive || !callback) {
    throw new Error('TokenStore:storeOrUpdate called with invalid parameters');
  }

  bcrypt.hash(token, 10, function(err, hashedToken) {

    if (err) {
      return callback(err);
    }

    var newRecord = {
      hashedToken: hashedToken,
      uid: uid,
      ttl: new Date(Date.now() + msToLive),
      originUrl: originUrl
    };

    myCache.set(uid, newRecord, function( err, success ){
      if( !err && success ){
        // true
        callback();
      } else {
        // false
        callback(err);
      }
    });

  }.bind(this));
};

NodeCacheStore.prototype.invalidateUser = function(uid, callback) {
  if (!uid || !callback) {
    throw new Error('TokenStore:invalidateUser called with invalid parameters');
  }

  myCache.del(uid, function( err, count ){
    if( !err ){
      // delted successfully
      callback();
    } else {
      callback(err);
    }
  });
};

NodeCacheStore.prototype.clear = function(callback) {
  if (!callback) {
    throw new Error('TokenStore:clear called with invalid parameters');
  }

  myCache.flushAll();
  callback();
};

NodeCacheStore.prototype.length = function(callback) {
  callback(null, myCache.keys().length);
};

NodeCacheStore.prototype._validateToken = function(token, storedItem, callback) {
  if (storedItem && storedItem.ttl > new Date()) {
    bcrypt.compare(token, storedItem.hashedToken, function(err, res) {
      if (err) {
        return callback(err, false, null);
      }

      if (res) {
        return callback(null, true, storedItem.originUrl);
      }

      callback(null, false, null);
    });
  } else {
    callback(null, false, null);
  }
};

module.exports = NodeCacheStore;
