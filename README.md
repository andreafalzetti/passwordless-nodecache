# Passwordless-NodeCache
[![npm version](https://badge.fury.io/js/passwordless-nodecache.svg)](https://badge.fury.io/js/passwordless-nodecache)
[![Project Supported By ES6.io](https://img.shields.io/badge/👍_Project_Supported_By-ES6.io Tutorials-brightgreen.svg?style=flat-square)](https://ES6.io/friend/AFALZETTI)

Node-Cache token store for Passwordless

This module provides token storage for [Passwordless](https://github.com/florianheinemann/passwordless), a node.js module for express that allows website authentication without password using verification through email or other means. Visit the project's website https://passwordless.net for more details.

Tokens are stored in memory and are hashed and salted using [bcryptjs](https://github.com/dcodeIO/bcrypt.js).  As such, tokens will not survive a restart of your application.  This implementation is mainly meant for example, proof-of-concepts or perhaps unit testing.

## Usage

First, install the module:

`$ npm install passwordless-nodecache --save`

Afterwards, follow the guide for [Passwordless](https://github.com/florianheinemann/passwordless). A typical implementation may look like this:

```javascript
var passwordless = require('passwordless');
var NodeCacheStore = require('passwordless-nodecache');

passwordless.init(new NodeCacheStore());

passwordless.addDelivery(
    function(tokenToSend, uidToSend, recipient, callback) {
        // Send out a token
    });

app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken());
```

## Initialization

```javascript
new NodeCacheStore();
```

Example:
```javascript
passwordless.init(new NodeCacheStore());
```

## Hash and salt
As the tokens are equivalent to passwords (even though they do have the security advantage of only being valid for a limited time) they have to be protected in the same way. passwordless-nodecache uses [bcryptjs](https://github.com/dcodeIO/bcrypt.js) with automatically created random salts. To generate the salt 10 rounds are used.

## Tests

`$ npm test`

## License

[MIT License](http://opensource.org/licenses/MIT)

## Author
[Andrea Falzetti](http://falzetti.me)
