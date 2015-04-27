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
        return typeof obj === 'object' && typeof obj.impl === 'function';
    }
};