/*
---

name: mooPlaceholder

description: provides placeholder= behaviour to browsers that don't support it.

author: Dimitar Christoff, Qmetric Group Limited

license: MIT-style license.

version: 1.6

requires:
  - Core/String
  - Core/Event
  - Core/Element
  - Core/Array
  - Core/Class

 provides: mooPlaceholder

...
*/
;(function() {

    var mooPlaceholder = this.mooPlaceholder = new Class({

        Implements: [Options, Events],

        options: {
            // default options
            htmlPlaceholder: 'placeholder',         // the element attribute, eg, data-placeholder='MM/YY' -> 'data-placeholder'
            unmoddedClass: 'unchanged',             // apply a class to the unmodded input, say, to grey it out
            parentNode: document,                   // limit to a particular set of child nodes
            defaultSelector: 'input[placeholder]',  // may want to add textareas also.
            autoAttach: false
        },

        initialize: function(options) {
            this.setOptions(options);
            this.nativeSupport = !!('placeholder' in document.createElement('input'));

            this.options.autoAttach && this.attachToElements();
            this.fireEvent('ready');
        },

        attachToElements: function(selector) {
            // basic function example that uses a class selector to
            var self = this;

            this.inputs = this.options.parentNode.getElements(selector || this.options.defaultSelector);

            if (this.inputs.length) {
                this.inputs.each(function(el) {
                    self.attachEvents(el);
                });
            }
            return this;
        }, // end attachToElements

        detachFromElements: function() {
            // reset managed fields values. call this on form submit before validation!
            var className = this.options.unmoddedClass;

            if (!this.inputs)
                return;

            this.inputs.each(function(el) {
                if (el.get('value') == el.get('placeholder')) {
                    el.set('value', '').removeClass(className);
                }
                el.removeEvents(el.retrieve('bound'));
            });
            return this.fireEvent('detach', this.inputs);
        },

        attachEvents: function(el, placeholder) {
            // method that attaches the events to an input element.
            var hasValue,
                boundEvents;

            placeholder = placeholder || el.get(this.options.htmlPlaceholder);

            if (this.nativeSupport || !document.id(el) || !placeholder || !placeholder.length)
                return;

            hasValue = !!el.get('value').length;
            hasValue || el.set('value', placeholder);

            // append unmodded class to input at start
            this.options.unmoddedClass && !hasValue && el.addClass(this.options.unmoddedClass);

            // save placeholder for later
            el.store('placeholder', placeholder);

            // now cater for the events
            boundEvents = {
                change: this.change.bind(this, el),
                focus: this.focus.bind(this, el),
                blur: this.blur.bind(this, el)
            };

            el.addEvents(boundEvents).store('bound', boundEvents);
            return this.fireEvent('attach', el);
        },

        change: function(el) {
            // when value changes
            var value = el.get('value').trim(),
                placeholder = el.retrieve('placeholder');

            // once it changes, remove this check and remove the unmoddedClass
            (value == placeholder) || el.removeClass(this.options.unmoddedClass).removeEvents('change');
        },

        focus: function(el) {
            var value = el.get('value').trim(),
                placeholder = el.retrieve('placeholder');

            el.removeClass(this.options.unmoddedClass);

            (value == placeholder) && el.set('value', '');
        },

        blur: function(el) {
            var value = el.get('value').trim(),
                placeholder = el.retrieve('placeholder');

            (value == placeholder || value == '') && el.set('value', placeholder).addClass(this.options.unmoddedClass);
        }
    });
})();