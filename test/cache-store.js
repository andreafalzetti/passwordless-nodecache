'use strict';

var expect = require('chai').expect;
var uuid = require('node-uuid');
var chance = new require('chance')();
var NodeCacheStore = require('../');
var TokenStore = require('passwordless-tokenstore');
var standardTests = require('passwordless-tokenstore-test');

function TokenStoreFactory() {
  return new NodeCacheStore();
}

function beforeEachTest(done) {
  done();
}

function afterEachTest(done) {
  done();
}

// Call the test suite
standardTests(TokenStoreFactory, beforeEachTest, afterEachTest);
