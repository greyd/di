'use strict';
var __s = Array.prototype.slice;
module.exports = {
    msgFor: function (module) {
        return function (message) {
            return ['[', module, ']=> ', message].join('');
        };
    },
    constant: function (val) {
        return function () {
            return val;
        };
    },
    isModule: function(obj) {
        return typeof obj === 'object' && typeof obj.impl === 'function';
    },
    deferrable: function (fn) {
        return function() {
            return (function(args) {
                return function(callback) { return fn.apply(null, args.concat([callback])); };
            })(__s.call(arguments));
        };
    }
};