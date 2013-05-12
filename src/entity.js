// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
 * The main entity object.
 *
 */
define([ 'kokou/type'
       , 'kokou/emitter'
       , 'kokou/table'
       , './evented-attribute'
       , './behavior'
       ],
function (type, emitter, table, eventedAttr, behavior) {

    var entity = {};
    var module = {};
    var count  = 0;

    var EVENT_ENTITY = 'ENTITY';


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Entity mixin.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var asEntity = (function () {

        function initEntity(config) {
            config        = config    || {};
            this.data     = this.data || {};

            if ( this.data.isEntityInit === true ) { return; }

            this.data.entityId  = config.entityId  || ('eid-' + (count += 1));
            this.data.emitter   = config.emitter   || emitter.create({});
            this.data.receivers = config.receivers || [];
            this.data.attrs     = table.create({});
            this.data.behaviors = table.create({});

            this.data.boundHandleEntityEvent =
                this.handleEntityEvent.bind(this);

            this.data.boundHandleAttrEvent =
                this.handleAttrEvent.bind(this);

            // If there are attr configs, create attrs from them.
            if ( config.attrs ) {
                config.attrs.forEach(function (cfg) {
                    this.addAttr( eventedAttr.create(cfg) );
                }, this);
            }

            // If there are behavior types, assign behaviors.
            if ( config.behaviors ) {
                config.behaviors.forEach(function (cfg) {
                    this.addBehavior( behavior.create(cfg) );
                }, this);
            }

            this.data.isEntityInit = true;
        }

        function get(attrName) {
            var attr = this.data.attrs.get(attrName);
            var val;
            if (attr) { val = attr.getVal(); }
            return val;
        }

        function set(attrName, val) {
            var attr = this.data.attrs.get(attrName);
            var result;
            if (attr) { result = attr.setVal(val); }
            return result;
        }

        function addAttr(attr) {
            this.data.attrs.put( attr.getName(), attr );

            if ( type.isFunction(attr['addListener']) ) {
                attr.addListener(eventedAttr.EVENT_VALUE_CHANGE,
                    this.data.boundHandleAttrEvent, this, false);
            }
        }

        function removeAttr(attrName) {
            var attr = this.data.attrs.remove(attrName);

            if ( type.isFunction(attr['removeListener']) ) {
                attr.removeListener(eventedAttr.EVENT_VALUE_CHANGE,
                    this.data.boundHandleAttrEvent, this, false);
            }

            if (attr) { attr.terminateAttr(); }
            return attr;
        }

        function addBehavior(behavior) {
            var behaviors = this.data.behaviors;
            var name = behavior.getName();
            var b = behaviors.get( name );
            if ( b !== undefined ) { return false; } // didn't add it again.
            behaviors.put( name, behavior );
            return true;                             // added it
        }

        function removeBehavior(name) {
            var behaviors = this.data.behaviors;
            var b = behaviors.remove( name );
            if (b) { b.terminateBehavior(); }
            return b;
        }

        function addReceiver(entity) {
            var receivers = this.data.receivers;
            if ( receivers.indexOf(entity) > -1 ) { return false; }
            receivers.push(entity);

            this.data.emitter.addListener(EVENT_ENTITY,
                entity.data.boundHandleEntityEvent, entity, false);

            return true; // added it
        }

        function removeReceiver(entity) {
            var receivers = this.data.receivers;
            var index = receivers.indexOf(entity);
            var receiver = null;
            if ( index > -1 ) { receiver = receivers.splice(index, 1)[0]; }

            this.data.emitter.removeListener(EVENT_ENTITY,
                entity.data.boundHandleEntityEvent, entity, false);

            return receiver;
        }

        function addAttrListener(attrName, eventName, callback, context, isOnce) {
            var attr = this.data.attrs.get( attrName );
            if ( attr === undefined ) { return false; }
            attr.addListener(eventName, callback, context, isOnce);
            return true;
        }

        function removeAttrListener(attrName, eventName, callback, context, isOnce) {
            var attr = this.data.attrs.get( attrName );
            if ( attr === undefined ) { return false; }
            attr.removeListener(eventName, callback, context, isOnce);
            return true;
        }

        function clear() {
            var data = this.data;
            var receivers = data.receivers.slice(0);

            // Unbind all attributes.
            data.attrs.forEach(function (name, attr) {
                attr.clearListeners();
            });

            // Unbind all behaviors.
            data.behaviors.forEach(function (name, behavior) {
                behavior.clearListeners();
            });

            receivers.forEach(function (receiver) {
                this.removeReceiver(receiver);
            }, this);

            data.receivers.length = 0;

            // Clear all properties.
            data.emitter.clearListeners();
            data.attrs.clear();
            data.behaviors.clear();
        }

        function handleAttrEvent(e) {
            var entityEvent = {
                type: EVENT_ENTITY,
                id: this.data.entityId,
                e: e
            };

            console.log('entity :: ' + this.data.entityId + ' :: handleAttrEvent');
            console.log(e);

            this.data.emitter.emit(entityEvent.type, entityEvent);
        }

        function handleEntityEvent(e) {
            var event = e.e;

            console.log('entity :: ' + this.data.entityId + ' :: handleEntityEvent');
            console.log(e);

            if ( event.type === eventedAttr.EVENT_VALUE_CHANGE ) {
                this.set( event.name, event.newVal );
            }
        }

        return function () {
            this.initEntity         = initEntity;
            this.get                = get;
            this.set                = set;
            this.addAttr            = addAttr;
            this.removeAttr         = removeAttr;
            this.addBehavior        = addBehavior;
            this.removeBehavior     = removeBehavior;
            this.addReceiver        = addReceiver;
            this.removeReceiver     = removeReceiver;
            this.clear              = clear;
            this.addAttrListener    = addAttrListener;
            this.removeAttrListener = removeAttrListener;
            this.handleEntityEvent  = handleEntityEvent;
            this.handleAttrEvent    = handleAttrEvent;
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
