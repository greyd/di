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
        var deps = ['a', 'b', 'c', 'd'];
        beforeEach(init(injector, addDeps));
        it('should rise an exception if a desired module does not exist', function () {
            var name = 'z';
            expect(_.partial(this.injector.get, [name])).toThrow(msg('Module <' + name + '> has not been registered'));
        });
        it('should pass to a callback stored modules', function () {
            this.injector.get(deps, checkDeps(this.depsObj));
        });
        it('should return a function if a callback was omitted', function () {
            var result = this.injector.get(deps);
            result(checkDeps(this.depsObj));
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
function checkDeps(depsObj) {
    return function (a, b, c, d) {
        expect(a).toBe(depsObj.a);
        expect(b).toBe(depsObj.b);
        expect(c).toBe(depsObj.c);
        expect(d).toBe(depsObj.d);
    };
}