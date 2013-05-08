// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

define(
    [
        './attribute',
        './evented-attribute',
        './entity'
    ],

    function (attr, eventedAttr, entity) {
        return {
            attr       : attr,
            eventedAttr: eventedAttr,
            entity     : entity
        };
    }
);
