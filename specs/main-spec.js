'use strict';
var _ = require('lodash');
var DI = require('../src/main');
describe('DI::', function () {
    it('should be a function', function () {
        expect(_.isFunction(DI)).toBe(true);
    });
});