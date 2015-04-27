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
    return function (obj) {
        obj = obj || {};
        var name = obj.name;
        var impl = obj.impl;
        var deps = obj.deps;
        if (!name) throw msg('Module name should be specified');
        if (reg[name]) throw msg('Module <' + name + '> has been already registered');

        impl = typeof impl === 'function' ? impl : utils.constant(impl);
        reg[name] = {
            impl: impl,
            deps: deps
        };
        return this;
    };
}
function getFrom (reg) {
    return function resolve(deps, next) {
        var opts = deps.map(function(name) {
            var module = reg[name];
            if(!module) throw msg('Module <' + name + '> has not been registered');
            if (module.deps) return resolve(module.deps, module.impl);
            return module.impl();
        });
        if (next) return next.apply(null, opts);
        return function (cb) {
            return cb.apply(null, opts);
        };
    };
}