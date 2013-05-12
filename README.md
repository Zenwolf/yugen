README
============================================================

    "To watch the sun sink behind a flower clad hill.
    To wander on in a huge forest without thought of return.
    To stand upon the shore and gaze after a boat that
    disappears behind distant islands. To contemplate the
    flight of wild geese seen and lost among the clouds.
    And, subtle shadows of bamboo on bamboo."
    -- Zeami Motokiyo

Yugen is an Entity system. You can use it to create many
different kinds of things. The things that you make can
dynamically change their behavior, or even transform into
other things.

Yugen uses Behaviors and Attributes to define an entity's
functionality. This is different than other entity systems
that are strictly component-based.


Project Status
------------------------------------------------------------

Unstable; in development.


Summary
------------------------------------------------------------

Yugen follows the concept of a "component-based" entity
system. Instead of using components of encapsulated logic
and data, Yugen splits the two by providing Attributes
and Behaviors.

In a strict component-based entity system, a single
component encapsulates both a specific set of properties
and the associated logic. Yugen makes a higher-level
distinction between data and logic, which is why it
separates Behaviors and Attributes.

A Yugen entity is composed of any number of attributes (data
with minimal validation) and behaviors (logic). Attributes
are independent from behaviors, and thus multiple behaviors
can act upon the same attribute(s).


Entities
------------------------------------------------------------

A Yugen entity is a generic container composed of the
following:

* Attributes
* Behaviors

Attributes know nothing about behaviors. Behaviors may
reference and act upon any number of attributes. An entity
acts as an observable object and mediator for the collection
of attributes and behaviors.


Attributes
------------------------------------------------------------

An Attribute is a property name/value pair. It can have a
minimal set of validation logic, but any other logic should
be inside of a behavior.


Behaviors
------------------------------------------------------------

A Behavior is a set of logic that can reference and modify
attribute values, be added or removed from an Entity, or
respond to events.


Diagrams
------------------------------------------------------------

                        +-----------+  send/receive   
                   +----| Attribute |----+
    +--------+     |    +-----------+    |    +------------+
    |        |<>---+          ^          +--->|            |
    | Entity |                |               |   Entity   |
    |        |<>---+          |          +--->|   Event    |
    +--------+     |    +-----------+    |    +------------+
                   +----| Behavior  |----+
                        +-----------+  send/receive
                              |
                              | send/receive
                              v
                        +-----------+
                        | External  |
                        | Events    |
                        +-----------+


Design Philosophy
------------------------------------------------------------

Yugen uses my "wabi-sabi" design philosphy, shared by its
sister libraries (Kokou, Kanso, etc):

Mixin, Object, Delegate, Compose (MODC)

This style promotes several concepts:

* Create simple objects that perform a specific function.
* Provide a companion mixin, if possible, to provide
  flexibility to create new types of objects.
* Use differential overrides, where the non-overrides
  are delegated to the prototypical object.
* Use composition for more complex behavior.

By using these principles, you have extreme flexibility
to create many combinations of objects and allow the end
user to adapt the functionality to their own specific
use case.

For example, attribute.js provides a factory function
that creates a basic attribute object by using the mixin
that itself defined.

In evented-attribute.js, you see that it uses a vanilla
attribute object as the prototypical object. It also mixes
in the emitter functionality and simply overrides a single
function, setVal, to emit an event.

### Mixins ###

I use the "verb" style of mixin with an applied context
(using "call") to link cached functions for performance.

For example, attribute mixin, asAttribute,
is used like this: attr.asAttribute.call(myObj). Then,
myObj also has attribute functionality.

_Properties:_ Because I do not rely on constructors, due to
the extensive use of mixins, each mixin defines an init
function that sets up the required mixin properties. The
init function should be labeled after the mixin's
functionality, such as: initAttr, initEmitter, etc. This
allows you to create a factory function to do a specific
initialization, or allows the end user to manually init
each functionality separately.
