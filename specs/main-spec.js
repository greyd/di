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

    describe('get()->', function () {
        beforeEach(init(injector, addDeps));
        it('should return a stored module', function () {
            var depsObj = this.depsObj;
            this.injector.get(['a', 'b', 'c', 'd'], function (a, b, c, d) {
                expect(a).toBe(depsObj.a);
                expect(b).toBe(depsObj.b);
                expect(c).toBe(depsObj.c);
                expect(d).toBe(depsObj.d);
            });
        });
    });
});
function init() {
    var fns = Array.prototype.slice.call(arguments);
    return function () {
        var that = this;
        fns.forEach(function (fn) {
            fn.call(that);
        });
    };
}
function injector() {
    this.injector = DI();
}
function addDeps() {
    this.depsObj = {
        a: 1,
        b: {test: 1},
        c: [1, 2, 3],
        d: function() {return 4;}
    };
    this.injector
        .add('a', 1)
        .add('b', this.depsObj.b)
        .add('c', this.depsObj.c)
        .add('d', this.depsObj.d);
}