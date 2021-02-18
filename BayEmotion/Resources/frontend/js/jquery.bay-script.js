;
(function ($, window, document, StateManager, undefined) {
    'use strict';

    var BayScript = {
        opts: {
            /**
             * Selector for the element contains emotion wrapper additional classes.
             *
             * @type {String}
             */
            emotionWrapperClassElemSelector: ".emotion--wrapper--css-class"
        },
        /**
         * Initialize the plugin
         *
         * @method init
         * @return void
         */
        init: function () {
            var self = this;

            self.registerEvents();

            $.publish("plugin/BayScript/onInit", [self]);
        },
        /**
         * Registers all necessary event listeners for the plugin to proper operate.
         *
         * @public
         * @method registerEvents
         */
        registerEvents: function () {
            var self = this;

            $.subscribe('plugin/swEmotion/onInit', $.proxy(self.onSWEmotionOnInit, self));

            $.publish("plugin/BayScript/onRegisterEvents", [self]);
        },
        /**
         * Event handler method which will be fired when the shopware
         * plugin published necessary event.
         *
         * @public
         * @event plugin/swEmotion/onInit
         * @method onSWEmotionOnInit
         * @param {jQuery.Event} event
         * @param {jQuery.PluginBase} me
         */
        onSWEmotionOnInit: function (event, me) {
            var self = this,
                cssClass = '',
                $cssClassElem = me.$wrapper.find(self.opts.emotionWrapperClassElemSelector);

            if ($cssClassElem.length < 1) {
                return;
            }

            cssClass = $cssClassElem.val() ? $cssClassElem.val() : '';

            me.$wrapper.addClass(cssClass);

            $.publish("plugin/BayScript/onSWEmotionOnInit", [self, $cssClassElem, cssClass, event, me]);
        }
    };

    BayScript.init();
})(jQuery, window, document, window.StateManager);