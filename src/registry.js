/*
 *
 */
define(['kokou/sorted-table'], function (sortedTable) {

    var registry = {};
    var module   = {};


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Registry mixin.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var asRegistry = (function () {

        function initRegistry() {
            this.data = this.data || {};
            this.data.table = sortedTable.create().initTable();

            return this;
        }

        function add(id, obj) {
            return this.data.table.put(id, obj);
        }

        function remove(id) {
            return this.data.table.remove(id);
        }

        function get(id) {
            return this.data.table.get(id);
        }

        function getAll() {
            var list = [];

            this.data.table.forEach(function (id, obj) {
                list.push( obj );
            });

            return list;
        }

        return function () {
            this.initRegistry = initRegistry;
            this.add          = add;
            this.remove       = remove;
            this.get          = get;
            this.getAll       = getAll;
        };
    } ());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Prototype object.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    asRegistry.call(registry);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Factory function.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function create(config) {
        // Create a new instance of an attribute.
        var obj = Object.create(registry);

        config = ( typeof config === 'object' ) ? config : null ;

        if ( config !== null ) {
            obj.initRegistry(config);
        }

        return obj;
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Public module.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    module.create     = create;
    module.asRegistry = asRegistry;

    return module;
});
