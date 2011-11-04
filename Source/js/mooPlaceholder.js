/*
---

name: mooPlaceholder

description: provides placeholder= behaviour to browsers that don't support it.

author: Dimitar Christoff, Qmetric Group Limited

license: MIT-style license.

version: 1.5

requires:
  - Core/String
  - Core/Event
  - Core/Element
  - Core/Array
  - Core/Class

provides: mooPlaceholder

...
*/
(function() {

    var mooPlaceholder = this.mooPlaceholder = new Class({
        // behaviour for default values of inputs class

        Implements: [Options],

        options: {
            // default options
            htmlPlaceholder: "placeholder", // the element attribute, eg, data-placeholder="MM/YY" -> "data-placeholder"
            unmoddedClass: "unchanged", // apply a class to the unmodded input, say, to grey it out
            parentNode: document, // limit to a particular set of child nodes
            defaultSelector: "input[placeholder]"
        },

        initialize: function(options) {
            this.setOptions(options);
            this.nativeSupport = !!'placeholder' in document.createElement('input');
        },

        attachToElements: function(selector) {
            // basic function example that uses a class selector to
            this.inputs = this.options.parentNode.getElements(selector || this.options.defaultSelector);

            if (this.inputs.length) {
                this.inputs.each(function(el) {
                    this.attachEvents(el);
                }, this);
            }
        }, // end attachToElements

        detachFromElements: function() {
            // reset managed fields values. call this on form submit before validation!
            var className = this.options.unmoddedClass;
            if (!this.inputs)
                return;

            this.inputs.each(function(el) {
                if (el.get("value") == el.get("placeholder")) {
                    el.set("value", "").removeClass(className);
                }
                el.removeEvents(el.retrieve("bound")).eliminate("bound");
            });

        },

        attachEvents: function(el, placeholder) {
            // method that attaches the events to an input element.
            placeholder = placeholder || el.get(this.options.htmlPlaceholder);
            if (this.nativeSupport || !document.id(el) || !placeholder || !placeholder.length)
                return;

            var hasValue = !!el.get("value").length;

            if (!hasValue)
                el.set("value", placeholder);

            el.store("placeholder", placeholder);

            // append unmodded class to input at start
            if (this.options.unmoddedClass && !hasValue)
                el.addClass(this.options.unmoddedClass);

            // now cater for the events
            var boundEvents = {
                change: this.change.bind(this, el),
                focus: this.focus.bind(this, el),
                blur: this.blur.bind(this, el)
            };

            el.addEvents(boundEvents).store("bound", boundEvents);
        },

        change: function(el) {
            // when value changes
            var value = el.get("value").trim(), placeholder = el.retrieve("placeholder");
            if (value != placeholder) {
                // once it changes, remove this check and remove the unmoddedClass
                el.removeClass(this.options.unmoddedClass).removeEvents("change");
            }

        },

        focus: function(el) {
            var value = el.get("value").trim(), placeholder = el.retrieve("placeholder");
            if (value == placeholder) {
                el.set("value", "").removeClass(this.options.unmoddedClass);
            }
        },

        blur: function(el) {
            var value = el.get("value").trim(), placeholder = el.retrieve("placeholder");
            if (value == placeholder || value == "") {
                el.set("value", placeholder).addClass(this.options.unmoddedClass);
            }
        }

    });

})();
