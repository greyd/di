'use strict';
module.exports = {
    msgFor: function (module) {
        return function (message) {
            return ['[', module, ']=> ', message].join('');
        };
    }
};