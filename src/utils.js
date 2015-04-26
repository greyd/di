'use strict';
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
        return typeof obj === 'object' &&
            Object.keys(obj).length === 2 &&
            typeof obj.impl === 'function' &&
            obj.deps;
    }
};