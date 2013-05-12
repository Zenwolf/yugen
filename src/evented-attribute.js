// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * An evented version of an attribute.
 */
define(['kokou/emitter', './attribute'],
function (emitter, attr) {

    var eventedAttr   = attr.create(); // prototype object
    var module        = {};            // public module
    var eProto        = Object.getPrototypeOf(eventedAttr);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Events.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var events = {

        EVENT_VALUE_CHANGE: 'VALUE_CHANGE',
        EVENT_TERMINATE   : 'TERMINATE'

    };


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Prototype object.
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
            this.emit( events.EVENT_VALUE_CHANGE, {
                type: events.EVENT_VALUE_CHANGE,
                name  : this.data.name,
                oldVal: result[1],
                newVal: value
            });
        }
    };

    eventedAttr.terminateAttr = function () {
        this.emit( events.EVENT_TERMINATE, {
            type: events.EVENT_TERMINATE,
            name: this.data.name,
            val : this.data.value
        } );

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


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Public module.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    module.create = create;

    Object.keys(events).forEach(function (key) {
        module[key] = events[key];
    });

    return module;
});
