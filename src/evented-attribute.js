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

    var EVENT_VALUE_CHANGE = 'VALUE_CHANGE';

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
            this.emit(EVENT_VALUE_CHANGE, {
                type: EVENT_VALUE_CHANGE,
                name  : this.data.name,
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
    module.EVENT_VALUE_CHANGE = EVENT_VALUE_CHANGE;

    return module;
});
