// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * An evented version of an attribute.
 */
define(['kokou/emitter', './attribute'], function (emitter, attr) {
    var eventedAttr = attr.create(); // prototypical object
    var module      = {};            // public module
    var eProto      = Object.getPrototypeOf(eventedAttr);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Prototypical object.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Add emitter functionality to our prototypical attr object.
    emitter.asEmitter.call(eventedAttr);

    /*
     * Add a customized setVal that will emit an event when the value is
     * changed.
     */
    eventedAttr.setVal = function (value) {
        var result = eProto.setVal.call(this, value);
        if ( result[0] === true ) {
            this.emit('value', {
                oldVal: result[1],
                newVal: value
            });
        }
    };

    eventedAttr.terminateAttr = function () {
        this.emit('terminate', {});
        this.clearListeners();
    };


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Factory, with optional config where config is sum of emitter and
    // attribute configs. Otherwise you can manually init the new object.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function create(config) {
        var obj = Object.create(eventedAttr);

        config = ( typeof config === 'object' ) ? config : null ;

        if (config !== null) {
            obj.initAttr(config);
            obj.initEmitter(config);
        }

        return obj;
    }

    module.create = create;

    return module;
});
