/**
 * jQuery Bar Rating Plugin v1.2.2
 *
 * http://github.com/antennaio/jquery-bar-rating
 *
 * Copyright (c) 2012-2016 Kazik Pietruszewski
 *
 * This plugin is available under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($) {
    var BarRating = (function() {
        function BarRating() {
            var self = this;
            var wrapElement = function() {
                var classes = ['br-wrapper'];
                if (self.options.theme !== '') {
                    classes.push('br-theme-' + self.options.theme);
                }
                self.$elem.wrap($('<div />', {
                    'class': classes.join(' ')
                }));
            };
            var unwrapElement = function() {
                self.$elem.unwrap();
            };
            var findOption = function(value) {
                if ($.isNumeric(value)) {
                    value = Math.floor(value);
                }
                return $('option[value="' + value  + '"]', self.$elem);
            };
            var getInitialOption = function() {
                var initialRating = self.options.initialRating;
                if (!initialRating) {
                    return $('option:selected', self.$elem);
                }
                return findOption(initialRating);
            };
            var getEmptyOption = function() {
                var $emptyOpt = self.$elem.find('option[value="' + self.options.emptyValue + '"]');
                if (!$emptyOpt.length && self.options.allowEmpty) {
                    $emptyOpt = $('<option />', { 'value': self.options.emptyValue });
                    return $emptyOpt.prependTo(self.$elem);
                }
                return $emptyOpt;
            };
            var getData = function(key) {
                var data = self.$elem.data('barrating');
                if (typeof key !== 'undefined') {
                    return data[key];
                }
                return data;
            };
            var setData = function(key, value) {
                if (value !== null && typeof value === 'object') {
                    self.$elem.data('barrating', value);
                } else {
                    self.$elem.data('barrating')[key] = value;
                }
            };
            var saveDataOnElement = function() {
                var $opt = getInitialOption();
                var $emptyOpt = getEmptyOption();
                var value = $opt.val();
                var text = $opt.data('html') ? $opt.data('html') : $opt.text();
                var allowEmpty = (self.options.allowEmpty !== null) ?
                    self.options.allowEmpty :
                    !!$emptyOpt.length;
                var emptyValue = ($emptyOpt.length) ? $emptyOpt.val() : null;
                var emptyText = ($emptyOpt.length) ? $emptyOpt.text() : null;
                setData(null, {
                    userOptions: self.options,
                    ratingValue: value,
                    ratingText: text,
                    originalRatingValue: value,
                    originalRatingText: text,
                    allowEmpty: allowEmpty,
                    emptyRatingValue: emptyValue,
                    emptyRatingText: emptyText,
                    readOnly: self.options.readonly,
                    ratingMade: false
                });
            };
            var removeDataOnElement = function() {
                self.$elem.removeData('barrating');
            };
            var ratingText = function() {
                return getData('ratingText');
            };
            var ratingValue = function() {
                return getData('ratingValue');
            };
            var buildWidget = function() {
                var $w = $('<div />', { 'class': 'br-widget' });
                self.$elem.find('option').each(function() {
                    var val, text, html, $a;
                    val = $(this).val();
                    if (val !== getData('emptyRatingValue')) {
                        text = $(this).text();
                        html = $(this).data('html');
                        if (html) { text = html; }
                        $a = $('<a />', {
                            'href': '#',
                            'data-rating-value': val,
                            'data-rating-text': text,
                            'html': (self.options.showValues) ? text : ''
                        });
                        $w.append($a);
                    }
                });
                if (self.options.showSelectedRating) {
                    $w.append($('<div />', { 'text': '', 'class': 'br-current-rating' }));
                }
                if (self.options.reverse) {
                    $w.addClass('br-reverse');
                }
                if (self.options.readonly) {
                    $w.addClass('br-readonly');
                }
                return $w;
            };
            var nextAllorPreviousAll = function() {
                if (getData('userOptions').reverse) {
                    return 'nextAll';
                } else {
                    return 'prevAll';
                }
            };
            var setSelectFieldValue = function(value) {
                findOption(value).prop('selected', true);
                if (getData('userOptions').triggerChange) {
                    self.$elem.change();
                }
            };
            var resetSelectField = function() {
                $('option', self.$elem).prop('selected', function() {
                    return this.defaultSelected;
                });
                if (getData('userOptions').triggerChange) {
                    self.$elem.change();
                }
            };
            var showSelectedRating = function(text) {
                text = text ? text : ratingText();
                if (text == getData('emptyRatingText')) {
                    text = '';
                }
                if (self.options.showSelectedRating) {
                    self.$elem.parent().find('.br-current-rating').text(text);
                }
            };
            var fraction = function(value) {
                return Math.round(((Math.floor(value * 10) / 10) % 1) * 100);
            };
            var resetStyle = function() {
                self.$widget.find('a').removeClass(function(index, classes) {
                    return (classes.match(/(^|\s)br-\S+/g) || []).join(' ');
                });
            };
            var applyStyle = function() {
                var $a = self.$widget.find('a[data-rating-value="' + ratingValue() + '"]');
                var initialRating = getData('userOptions').initialRating;
                var baseValue = $.isNumeric(ratingValue()) ? ratingValue() : 0;
                var f = fraction(initialRating);
                var $all, $fractional;
                resetStyle();
                $a.addClass('br-selected br-current')[nextAllorPreviousAll()]()
                    .addClass('br-selected');
                if (!getData('ratingMade') && $.isNumeric(initialRating)) {
                    if ((initialRating <= baseValue) || !f) {
                        return;
                    }
                    $all = self.$widget.find('a');
                    $fractional = ($a.length) ?
                        $a[(getData('userOptions').reverse) ? 'prev' : 'next']() :
                        $all[(getData('userOptions').reverse) ? 'last' : 'first']();
                    $fractional.addClass('br-fractional');
                    $fractional.addClass('br-fractional-' + f);
                }
            };
            var isDeselectable = function($element) {
                if (!getData('allowEmpty') || !getData('userOptions').deselectable) {
                    return false;
                }
                return (ratingValue() == $element.attr('data-rating-value'));
            };
            var attachClickHandler = function($elements) {
                $elements.on('click.barrating', function(event) {
                    var $a = $(this),
                        options = getData('userOptions'),
                        value,
                        text;
                    event.preventDefault();
                    value = $a.attr('data-rating-value');
                    text = $a.attr('data-rating-text');
                    if (isDeselectable($a)) {
                        value = getData('emptyRatingValue');
                        text = getData('emptyRatingText');
                    }
                    setData('ratingValue', value);
                    setData('ratingText', text);
                    setData('ratingMade', true);
                    setSelectFieldValue(value);
                    showSelectedRating(text);
                    applyStyle();
                    options.onSelect.call(
                        self,
                        ratingValue(),
                        ratingText(),
                        event
                    );
                    return false;
                });
            };
            var attachMouseEnterHandler = function($elements) {
                $elements.on('mouseenter.barrating', function() {
                    var $a = $(this);
                    resetStyle();
                    $a.addClass('br-active')[nextAllorPreviousAll()]()
                        .addClass('br-active');
                    showSelectedRating($a.attr('data-rating-text'));
                });
            };
            var attachMouseLeaveHandler = function($elements) {
                self.$widget.on('mouseleave.barrating blur.barrating', function() {
                    showSelectedRating();
                    applyStyle();
                });
            };
            var fastClicks = function($elements) {
                $elements.on('touchstart.barrating', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $(this).click();
                });
            };
            var disableClicks = function($elements) {
                $elements.on('click.barrating', function(event) {
                    event.preventDefault();
                });
            };
            var attachHandlers = function($elements) {
                attachClickHandler($elements);
                if (self.options.hoverState) {
                    attachMouseEnterHandler($elements);
                    attachMouseLeaveHandler($elements);
                }
            };
            var detachHandlers = function($elements) {
                $elements.off('.barrating');
            };
            var setupHandlers = function(readonly) {
                var $elements = self.$widget.find('a');
                if (getData('userOptions').fastClicks) {
                    fastClicks($elements);
                }
                if (readonly) {
                    detachHandlers($elements);
                    disableClicks($elements);
                } else {
                    attachHandlers($elements);
                }
            };
            this.show = function() {
                if (getData()) return;
                wrapElement();
                saveDataOnElement();
                self.$widget = buildWidget();
                self.$widget.insertAfter(self.$elem);
                applyStyle();
                showSelectedRating();
                setupHandlers(self.options.readonly);
                self.$elem.hide();
            };
            this.readonly = function(state) {
                if (typeof state !== 'boolean' || getData('readOnly') == state) return;
                setupHandlers(state);
                setData('readOnly', state);
                self.$widget.toggleClass('br-readonly');
            };
            this.set = function(value) {
                var options = getData('userOptions');
                if (self.$elem.find('option[value="' + value + '"]').length === 0) return;
                setData('ratingValue', value);
                setData('ratingText', self.$elem.find('option[value="' + value + '"]').text());
                setData('ratingMade', true);
                setSelectFieldValue(ratingValue());
                showSelectedRating(ratingText());
                applyStyle();
                if (!options.silent) {
                    options.onSelect.call(
                        this,
                        ratingValue(),
                        ratingText()
                    );
                }
            };
            this.clear = function() {
                var options = getData('userOptions');
                setData('ratingValue', getData('originalRatingValue'));
                setData('ratingText', getData('originalRatingText'));
                setData('ratingMade', false);
                resetSelectField();
                showSelectedRating(ratingText());
                applyStyle();
                options.onClear.call(
                    this,
                    ratingValue(),
                    ratingText()
                );
            };
            this.destroy = function() {
                var value = ratingValue();
                var text = ratingText();
                var options = getData('userOptions');
                detachHandlers(self.$widget.find('a'));
                self.$widget.remove();
                removeDataOnElement();
                unwrapElement();
                self.$elem.show();
                options.onDestroy.call(
                    this,
                    value,
                    text
                );
            };
        }
        BarRating.prototype.init = function (options, elem) {
            this.$elem = $(elem);
            this.options = $.extend({}, $.fn.barrating.defaults, options);
            return this.options;
        };
        return BarRating;
    })();
    $.fn.barrating = function (method, options) {
        return this.each(function () {
            var plugin = new BarRating();
            if (!$(this).is('select')) {
                $.error('Sorry, this plugin only works with select fields.');
            }
            if (plugin.hasOwnProperty(method)) {
                plugin.init(options, this);
                if (method === 'show') {
                    return plugin.show(options);
                } else {
                    if (plugin.$elem.data('barrating')) {
                        plugin.$widget = $(this).next('.br-widget');
                        return plugin[method](options);
                    }
                }
            } else if (typeof method === 'object' || !method) {
                options = method;
                plugin.init(options, this);
                return plugin.show();
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.barrating');
            }
        });
    };
    $.fn.barrating.defaults = {
        theme:'',
        initialRating:null, // initial rating
        allowEmpty:null, // allow empty ratings?
        emptyValue:'', // this is the expected value of the empty rating
        showValues:false, // display rating values on the bars?
        showSelectedRating:true, // append a div with a rating to the widget?
        deselectable:true, // allow to deselect ratings?
        reverse:false, // reverse the rating?
        readonly:false, // make the rating ready-only?
        fastClicks:true, // remove 300ms click delay on touch devices?
        hoverState:true, // change state on hover?
        silent:false, // supress callbacks when controlling ratings programatically
        triggerChange:true, // trigger change event when ratings are set or reset
        onSelect:function (value, text, event) {
        }, // callback fired when a rating is selected
        onClear:function (value, text) {
        }, // callback fired when a rating is cleared
        onDestroy:function (value, text) {
        } // callback fired when a widget is destroyed
    };
    $.fn.barrating.BarRating = BarRating;
}));
