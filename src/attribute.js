// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Attribute definition using AMD format.
 *
 * Create an attribute object with a config:
 *
 * CONFIG:
 *
 *   { name : 'foo'    // the attribute's name
 *   , value: 7        // the initial value
 *   , validate: false // whether or not to turn on validation
 *   }
 *
 *
 * NOTES:
 *
 * 1. To set a new value, use the "set" method. If you write it directly without
 *    using "set", you will circumvent eventing, optional validation, and other
 *    critical logic.
 *
 * 2. If you want event functionality then see evented-attribute.js.
 *
 */
define(['./registry'], function (registry) {
    var module       = {}; // public module
    var attr         = {};   // attribute prototypical object.
    var objCount     = 0;
    var attrRegistry = registry.create().initRegistry();


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Attribute mixin.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var asAttribute = (function () {
        /*
         * Initialize the object with the correct local properties.
         */
        function initAttr(config) {
            config = config || {};
            this.data = this.data || {};

            this.data.name           = config.name       || 'defaultAttrName';
            this.data.value          = config.value      || 'defaultAttrValue';
            this.data.isValidationOn = config.validate   || false;

            // Id is a combination of name and instantiation count.
            this.data.id = this.data.name + '-' + (objCount += 1);

            attrRegistry.add( this.data.id, this );

            return this;
        }

        function terminateAttr() {
            // override for specific logic.
        }

        function getName() {
            return this.data.name;
        }

        /*
         * Optional validation logic for a value. Override to implement your
         * own custom validation.
         */
        function validate(value) {
            var isValid = true;

            if ( typeof value === 'undefined' ) {
                isValid = false;
            }

            return isValid;
        }

        function getVal() {
            return this.data.value;
        }

        /*
         * Set the value. Returns a tuple of boolean (success/fail) and the
         * old value (if value was changed, otherwise null). If the old value
         * was actually null and was replaced, then you would see [true, null]
         * as opposed to [false, null].
         */
        function setVal(value) {
            var data   = this.data;
            var oldVal = data.value;
            var result = [false, null];

            if ( data.isValidationOn && !this.validate(value) ) {
                throw 'Attr:' + data.id + ' :: invalid value :: ' + value;
            }

            if (oldVal !== value) {
                data.value = value;
                result = [true, oldVal];
            }

            return result;
        }

        return function () {
            this.initAttr      = initAttr;
            this.terminateAttr = terminateAttr;
            this.getName       = getName;
            this.validate      = validate;
            this.getVal        = getVal;
            this.setVal        = setVal;
        };
    } ());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Prototypical object.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Mixin the Attribute functionality to our prototypical attribute object.
    asAttribute.call(attr);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Factory function, with optional config
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function create(config) {
        // Create a new instance of an attribute.
        var obj = Object.create(attr);

        config = ( typeof config === 'object' ) ? config : null ;

        if ( config !== null ) {
            obj.initAttr(config);
        }

        return obj;
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Public module.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    module.create      = create;       // factory function.
    module.asAttribute = asAttribute;  // Make the mixin available.
    module.registry    = attrRegistry; // registry of all attributes.

    return module;
});
