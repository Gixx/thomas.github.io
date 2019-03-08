/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2018 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

if (typeof lazyLoadImageOptions === 'undefined') {
    var lazyLoadImageOptions = {
        verbose: ThomasOptions.verbose
    };
}
/**
 * LazyLoadImage component.
 *
 * @type {{init}}
 */
var LazyLoadImage = function(options)
{
    "use strict";

    /** @type {boolean} */
    var initialized = false;
    /** @type {NodeList} */
    var lazyLoadImages = [];
    /** @type {number} */
    var idCounter = 1;

    /**
     * Adds lazy-load behaviour to an image element.
     *
     * @param HTMLElement
     * @return {{constructor: LazyLoadImageElement}}
     * @constructor
     */
    var LazyLoadImageElement = function(HTMLElement)
    {
        /** @type {boolean} */
        var loading = false;
        /** @type {boolean} */
        var loaded = false;

        /**
         * Checks if the image is in the viewPort
         *
         * @returns {boolean}
         */
        function isElementInViewport()
        {
            var rect = HTMLElement.getBoundingClientRect();

            return (
                rect.top >= 0
                && rect.left   >= 0
                && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
            );
        }

        /**
         * Load image.
         */
        function loadImage()
        {
            if (loaded || loading) {
                return;
            }

            if (isElementInViewport()) {
                loading = true;
                var src = HTMLElement.getAttribute('data-src');
                var preload = new Image;

                preload.onerror = function() {
                    options.verbose && console.info(
                        '%c✖%c the image ' + src + ' cannot be loaded.',
                        'color:red',
                        'color:black'
                    );
                    return true;
                };

                preload.onload = function() {
                    HTMLElement.src = src;
                    HTMLElement.removeAttribute('data-src');
                    options.verbose && console.info(
                        '%c⚡%c a Lazy Load Image element is loaded %o',
                        'color:orange;font-weight:bold',
                        'color:#599bd6',
                        '#'+HTMLElement.getAttribute('id')
                    );
                };

                try {
                    preload.src = src;
                    loaded = true;
                } catch (exp) {
                    loading = false;
                }
            }
        }

        Util.addEventListeners([window], 'scroll', loadImage, this);
        options.verbose && console.info(
            '%c✚%c a Lazy Load Image element is initialized %o',
            'color:green; font-weight:bold;',
            'color:black;',
            '#'+HTMLElement.getAttribute('id')
        );
        loadImage();

        return {
            constructor: LazyLoadImageElement
        }
    };

    if (typeof Util === 'undefined') {
        throw new ReferenceError('The Util component is required to use this component.');
    }

    options.verbose && console.info(
        '%c✔%c the Lazy Load Image component is loaded.',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    return {
        /**
         * Initializes the loader and collects the elements.
         */
        init : function()
        {
            if (initialized) {
                return;
            }

            options.verbose && console.group(
                '%c  looking for Lazy Load Image Elements...',
                'color:#cecece'
            );
            lazyLoadImages = document.querySelectorAll('img[data-src]');

            for (var i = 0, len = lazyLoadImages.length; i < len; i++) {
                if (!lazyLoadImages[i].hasAttribute('id')) {
                    lazyLoadImages[i].setAttribute('id', 'lazyImage' + (idCounter++));
                }

                lazyLoadImages[i].component = new LazyLoadImageElement(lazyLoadImages[i]);
            }

            options.verbose && console.groupEnd();

            Util.triggerEvent(document, 'lazyLoadImageComponentLoaded');
            initialized = true;
        }
    };
}(lazyLoadImageOptions);
