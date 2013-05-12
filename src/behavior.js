// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
 * A behavior object.
 *
 */
define(['kokou/emitter', 'kokou/sorted-table', './registry'],
function (emitter, table, registry) {

    var behavior         = {};
    var module           = {};
    var objCount         = 0;
    var behaviorRegistry = registry.create().initRegistry();


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Behavior mixin.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var asBehavior = (function () {

        /*
         * Config object:
         *   name   : String          // the behavior's name
         *   entity : Object<entity>  // the parent entity object
         *   emitter: Object<emitter> // optional emitter to use for events
         */
        function initBehavior(config) {
            config = config || {};

            this.data.name    = config.name    || 'defaultBehaviorName';
            this.data.entity  = config.entity  || null;
            this.data.emitter = config.emitter || emitter.create({});

            this.data.id = this.data.name + '-' + (objCount += 1);

            behaviorRegistry.add( this.data.id, this );

            return this;
        }

        /*
         * Tell the behavior to terminate itself and clean up.
         */
        function terminateBehavior() {
            // override to implement specific behavior.
        }

        /*
         * Tell the behavior to bind to any events it is interested in.
         */
        function bindBehaviorEvents() {
            // override to implement specific behavior.
        }

        /*
         * Tell the behavior to unbind from its events.
         */
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
    // Public module.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    module.create     = create;           // factory function
    module.asBehavior = asBehavior;       // mixin
    module.registry   = behaviorRegistry; // registry of all behaviors

    return module;
});
