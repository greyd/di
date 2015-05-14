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
            var message = msg('Module name should be specified');
            expect(_.partial(this.injector.add)).toThrow(message);
        });
        it('should fail if a user tries to add module with already registered name', function () {
            var name = 'a';
            var message = msg('Module <' + name + '> has been already registered');
            var args = {
                name: name,
                impl: 1
            };
            this.injector.add(args);
            expect(_.partial(this.injector.add, args)).toThrow(message);
        });
    });

    describe('get()->', function () {
        var deps = ['a', 'b', 'c'];
        beforeEach(init(injector, addDeps));
        it('should rise an exception if a desired module does not exist', function () {
            var name = 'z';
            var message = msg('Module <' + name + '> has not been registered');
            expect(_.partial(this.injector.get, [name])).toThrow(message);
        });
        it('should pass to a callback stored modules', function () {
            this.injector.get(deps, checkDeps(this.depsObj));
        });
        it('should return a function if a callback was omitted', function () {
            var result = this.injector.get(deps);
            result(checkDeps(this.depsObj));
        });
        it('should resolve nested dependencies', function () {
            var deps = ['z', 'sum'];
            injectDeps(this.injector, {
                x: {
                    impl: function () {return 1;}
                },
                y: {
                    impl: function () {return 2;}
                },
                z: {
                    impl: function (x, y) {return x + y;},
                    deps: ['x', 'y']
                },
                sum: {
                    impl: function (x,y,z) {return x + y + z;},
                    deps: ['x', 'y', 'z']
                }
            });
            this.injector.get(deps, function (z, sum) {
                expect(z).toBe(3);
                expect(sum).toBe(6);
            });
            var result = this.injector.get(deps);
            result(function (z, sum) {
                expect(z).toBe(3);
                expect(sum).toBe(6);
            });
        });
    });
    describe('getAsync()->', function () {
        beforeEach(init(injector));
        it('should rise an exception if a desired module does not exist', function () {
            var name = 'z';
            var message = msg('Module <' + name + '> has not been registered');
            expect(_.partial(this.injector.getAsync, [name])).toThrow(message);
        });
        it('should handle async modules', function (done) {
            injectDeps(this.injector, {
                x: {
                    impl: function (cb) {setTimeout(function () {cb(1);}, 0);}
                },
                y: {
                    impl: function (cb) {setTimeout(function () {cb(2);}, 0);}
                }
            });

            this.injector.getAsync(['x', 'y'], function (x, y) {
                expect(x).toBe(1);
                expect(y).toBe(2);
                done();
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
        a: {impl: 1},
        b: {impl: {test: 1}},
        c: {impl: [1, 2, 3]}
    };
    injectDeps (this.injector, this.depsObj);
}
function injectDeps (injector, obj) {
    Object.keys(obj).forEach(function(name) {
        var module = obj[name];
        module.name = name;
        injector.add(module);
    });
    return injector;
}
function checkDeps(depsObj) {
    return function (a, b, c) {
        expect(a).toBe(depsObj.a.impl);
        expect(b).toBe(depsObj.b.impl);
        expect(c).toBe(depsObj.c.impl);
    };
}