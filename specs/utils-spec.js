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
    
    describe('isModule() ->', function () {
        it('should be true if an argument is object and has "impl" method', function () {
            expect(utils.isModule({impl: function () {}})).toBe(true);
            expect(utils.isModule({test: function () {}})).toBe(false);
        });
    });
});