// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

define(
    [
        './attribute',
        './evented-attribute',
        './behavior',
        './entity'
    ],

    function (attr, eventedAttr, behavior, entity) {
        return {
            attr       : attr,
            eventedAttr: eventedAttr,
            behavior   : behavior,
            entity     : entity
        };
    }
);
