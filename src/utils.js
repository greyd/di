'use strict';
var __s = Array.prototype.slice;
module.exports = {
    msgFor: msgFor,
    constant: constant,
    isModule: isModule,
    deferrable: deferrable,
    callbackify: callbackify,
    asyncCompose: asyncCompose,
    asyncFor: asyncCompose(identityArr)
};
function msgFor(module) {
    return function (message) {
        return ['[', module, ']=> ', message].join('');
    };
}
function constant(val) {
    return function () {
        return val;
    };
}
function isModule(obj) {
    return typeof obj === 'object' && typeof obj.impl === 'function';
}
function deferrable(fn) {
    return function () {
        return (function (args) {
            return function (callback) {
                return fn.apply(null, args.concat([callback]));
            };
        })(__s.call(arguments));
    };
}
function asyncCompose(handler) {
    return function () {
        var args = __s.call(arguments);
        var next = args.pop();
        var ready=0;
        var result = [];
        args.forEach(function (fn, index) {
            fn(function (data) {
                result[index] = data;
                ready++;
                if (ready === args.length) handler.apply(null, result.concat(next));
            });
        });
    };
}
function callbackify(fn) {
    return function () {
        var args = __s.call(arguments);
        var next = args.pop();
        next(fn.apply(null, args));
    };
}
function identityArr() {
    var args = __s.call(arguments);
    var next = args.pop();
    next.apply(null, args);
}
