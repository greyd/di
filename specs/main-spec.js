'use strict';
var _ = require('lodash');
var utils = require('../src/utils');
var DI = require('../src/main');
var msg = utils.msgFor('Injector');
describe('DI::', function () {
    it('should be a function', function () {
        expect(_.isFunction(DI)).toBe(true);
    });
    it('should return a new injector', function () {
        expect(_.isObject(DI())).toBe(true);
    });
    describe('add() ->', function () {
        beforeEach(function () {
            this.injector = DI();
        });
        it('should return a link to the current injector', function () {
            expect(_.partial(this.injector.add)).toThrow(msg('Module name should be specified'));
        });
        it('should fail if a user tries to add module with already registered name', function () {
            var name = 'a';
            this.injector.add(name, 1);
            expect(_.partial(this.injector.add, name, 2)).toThrow(msg('Module <' + name + '> has been already registered'));
        });
    });
});