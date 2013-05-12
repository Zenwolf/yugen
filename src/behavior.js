// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
 * A behavior object.
 *
 */
define(['kokou/emitter'], function (emitter) {

    var behavior = {};
    var module   = {};
    var objCount = 0;


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Behavior mixin.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var asBehavior = (function () {

        function initBehavior(config) {
            config = config || {};

            this.data.name    = config.name    || 'defaultBehaviorName';
            this.data.entity  = config.entity  || null;
            this.data.emitter = config.emitter || emitter.create({});

            this.data.id = this.data.name + '-' + (objCount += 1);

            return this;
        }

        function terminateBehavior() {
            // override to implement specific behavior.
        }

        function bindBehaviorEvents() {
            // override to implement specific behavior.
        }

        function unbindBehaviorEvents() {
            // override to implement specific behavior.
        }

        return function () {
            this.initBehavior         = initBehavior;
            this.terminateBehavior    = terminateBehavior;
            this.bindBehaviorEvents   = bindBehaviorEvents;
            this.unbindBehaviorEvents = unbindBehaviorEvents;
        };
    } ());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Prototype.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    asBehavior.call(behavior);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Factory function
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function create(config) {
        // Create a new instance of an attribute.
        var obj = Object.create(behavior);

        config = ( typeof config === 'object' ) ? config : null ;

        if ( config !== null ) {
            obj.initBehavior(config);
        }

        return obj;
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Module
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    module.create     = create;     // factory function
    module.asBehavior = asBehavior; // mixin

    return module;
});
