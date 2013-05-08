// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
 * The main entity object.
 *
 */
define(['kokou/emitter', 'kokou/table'], function (emitter, table) {

    var entity = {};
    var module = {};

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Private functions
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function handleAttrEvent(e) {
        console.log(e);
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Entity mixin.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var asEntity = (function () {

        function initEntity(config) {
            var eData = null;
            config = config || {};

            this.data = this.data || {};
            eData = this.data['entity'] = {};

            eData.emitter   = config.emitter   || emitter.create({});
            eData.attrs     = config.attrs     || table.create({});
            eData.behaviors = config.behaviors || table.create({});
        }

        function getAttr(attrName) {
            var eData = this.data['entity'];
            return eData.attrs.get(attrName);
        }

        function getAttrVal(attrName) {
            var attr = this.getAttr(attrName);
            var val;
            if (attr) { val = attr.getVal(); }
            return val;
        }

        function setAttrVal(attrName, val) {
            var attr = this.getAttr(attrName);
            var result;
            if (attr) { result = attr.setVal(val); }
            return result;
        }

        function addAttr(attr) {
            var eData = this.data['entity'];
            eData.attrs.put( attr.getName(), attr );
        }

        function addEventedAttr(eventedAttr) {
            this.addAttr(eventedAttr);
            eventedAttr.addListener('value', handleAttrEvent, this, false);
        }

        function removeAttr(attrName) {
            var eData = this.data['entity'];
            var attr = eData.attrs.remove(attrName);
            attr.terminateAttr();
            return attr;
        }

        function removeEventedAttr(eventedAttrName) {
            var attr = this.removeAttr(eventedAttrName);
            attr.removeListener('value', handleAttrEvent, this, false);
            return attr;
        }

        return function () {
            this.initEntity        = initEntity;
            this.getAttr           = getAttr;
            this.getAttrVal        = getAttrVal;
            this.setAttrVal        = setAttrVal;
            this.addAttr           = addAttr;
            this.addEventedAttr    = addEventedAttr;
            this.removeAttr        = removeAttr;
            this.removeEventedAttr = removeEventedAttr;
        };
    } ());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Prototypical object.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    asEntity.call(entity);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Factory function.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function create(config) {
        var obj = Object.create(entity);

        config = ( typeof config === 'object' ) ? config : null ;

        if ( config !== null ) {
            obj.initEntity(config);
        }

        return obj;
    }

    module.create   = create;   // factory
    module.asEntity = asEntity; // mixin

    return module;
});
