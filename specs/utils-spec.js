'use strict';
var utils = require('../src/utils');

describe('UTILS::', function () {
    describe('msgFor()->', function () {
        it('should format messages', function () {
            var module = 'TEST';
            var message = 'message';
            expect(utils.msgFor(module)(message)).toBe('[' + module + ']=> ' + message);
        });
    });

    describe('constant()->', function () {
        it('should keep a value immutable', function () {
            var test = utils.constant(1);
            expect(test(1)).toBe(1);
            test(2);
            expect(test(1)).toBe(1);
        });
    });
    
    describe('isModule()->', function () {
        it('should be true if an argument is object and has "impl" method', function () {
            expect(utils.isModule({impl: function () {}})).toBe(true);
            expect(utils.isModule({test: function () {}})).toBe(false);
        });
    });

    describe('deferrable()->', function () {
        beforeEach(addAsync());
        it('should split initialization of function by 3 steps', function (done) {
            var name = 2;
            utils.deferrable(this.async)(name)(function (data) {
                expect(data).toBe(name);
                done();
            });
        });
    });

    describe('asyncFor()->', function () {
        beforeEach(addAsync());
        it('should call next after all async data will be fetched', function (done) {
            utils.asyncFor(
                this.defAsync(1),
                this.defAsync(2),
                this.defAsync(3),
                function (a,b,c) {
                    expect(a).toEqual(1);
                    expect(b).toEqual(2);
                    expect(c).toEqual(3);
                    done();
                }
            );
        });
        it('should handle nested asyncFor', function (done) {
            var defAsyncCompose = utils.deferrable(utils.asyncCompose(this.asyncSum));
            utils.asyncFor(
                defAsyncCompose(
                    defAsyncCompose(
                        this.defAsync(1),
                        this.defAsync(2)
                    ),
                    defAsyncCompose(
                        this.defAsync(1),
                        this.defAsync(2)
                    )
                ),
                this.defAsync(3),
                function (a, b) {
                    expect(a).toEqual(6);
                    expect(b).toEqual(3);
                    done();
                }
            );
        });
    });

    describe('callbackify() ->', function () {
        beforeEach(addSync());
        it('should wrap sync function and put into callback result of its invokation', function (done) {
            var defAsyncCompose = utils.deferrable(utils.asyncCompose(utils.callbackify(this.sum)));
            utils.asyncFor(
                defAsyncCompose(
                    defAsyncCompose(
                        this.defSync(1),
                        this.defSync(2)
                    ),
                    defAsyncCompose(
                        this.defSync(1),
                        this.defSync(2)
                    )
                ),
                defAsyncCompose(
                    this.defSync(1),
                    this.defSync(2)
                ),
                function (a, b) {
                    expect(a).toEqual(6);
                    expect(b).toEqual(3);
                    done();
                }
            );
        });
    });
});
function addAsync() {
    return function () {
        this.async = function (name, cb) {
            setTimeout(function () {
                cb(name);
            }, 0);
        };
        this.asyncSum = function () {
            var args = Array.prototype.slice.call(arguments);
            var cb = args.pop();
            cb(args.reduce(function (a, b) {return a + b;}, 0));
        };
        this.defAsync = utils.deferrable(this.async);
    };
}
function addSync() {
    return function () {
        this.sync = function (name) {
            return name;
        };
        this.sum = function () {
            var args = Array.prototype.slice.call(arguments);
            return args.reduce(function (a, b) {return a + b;}, 0);
        };
        this.defSync = utils.deferrable(utils.callbackify(this.sync));
    };
}