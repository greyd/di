'use strict';
function DI () {
    var register = {};
    return {
        add: addTo(register)
    };
}
module.exports = DI;
function addTo (reg) {
    return function (name, impl, deps) {
        return this;
    };
}