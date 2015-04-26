'use strict';
var utils = require('./utils');
var msg = utils.msgFor('Injector');
function DI () {
    var register = {};
    return {
        add: addTo(register),
        get: getFrom(register)
    };
}
module.exports = DI;
function addTo (reg) {
    return function (name, impl, deps) {
        if (!name) throw msg('Module name should be specified');
        if (reg[name]) throw msg('Module <' + name + '> has been already registered');
        reg[name] = impl;
        return this;
    };
}
function getFrom (reg) {
    return function (deps, next) {
        var opts = deps.map(function(dep) {
            return reg[dep];
        });
        if (next) return next.apply(null, opts);
        return function (cb) {
            return cb.apply(null, opts);
        };
    };
}