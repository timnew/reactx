'use strict';

require('coffee-script/register');
require('babel/register');

require('chai').should();
global.expect = require('chai');

global.sourceRoot = require('approot')(__dirname, '..', 'lib').consolidate();
process.env.NODE_PATH = global.sourceRoot();
require('module').Module._initPaths();

// global.Promise = require('bluebird');
