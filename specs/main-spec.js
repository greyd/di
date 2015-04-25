'use strict';
var _ = require('lodash');
var DI = require('../src/main');
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
        it ('should add modules to an injector', function () {
            expect(this.injector.add()).toBe(this.injector);
        });
    });
});