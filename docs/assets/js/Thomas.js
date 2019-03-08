/**
 * Thomas theme for WebHemi
 *
 * @copyright 2012 - 2018 Gixx-web (http://www.gixx-web.com)
 * @license   https://opensource.org/licenses/MIT The MIT License (MIT)
 * @link      http://www.gixx-web.com
 */

if (typeof ThomasOptions === 'undefined') {
    var ThomasOptions = {
        verbose: true
    };
}

/**
 * Thomas Component Framework.
 */
var Thomas = function(options)
{
    "use strict";

    /** @type {Object} */
    var defaultOptions = {
        path: 'components/',
        components: [
            'Util',
            'LazyLoadImage',
        ],
        verbose: true,
        event: new Event('ThomasComponentsLoaded')
    };

    if (typeof options === 'undefined') {
        options = {};
    }

    // Complete the missing option elements.
    for (var i in defaultOptions) {
        if (defaultOptions.hasOwnProperty(i) && typeof options[i] === 'undefined') {
            options[i] = defaultOptions[i];
        }
    }

    // Correct component path.
    options.path = document.querySelector('body > script[src*="Thomas.js"]')
        .getAttribute('src').replace(/Thomas\.js/, '') + options.path;

    // Control the console activity for the components.
    ThomasOptions.verbose = options.verbose;

    /**
     * Loads the compoments one after another.
     *
     * @param {number} index
     */
    var loadComponents = function(index)
    {
        if (typeof index === 'undefined') {
            index = 0;
        }

        if (typeof options.components[index] !== 'undefined') {
            var componentName = options.components[index];

            // if the component is not loaded
            if (typeof window[componentName] === 'undefined') {
                // get some kind of XMLHttpRequest
                var xhr = new XMLHttpRequest();
                // open and send a synchronous request
                xhr.open('GET', options.path + componentName + '.js', true);

                xhr.onreadystatechange = function()
                {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        try {
                            if (xhr.status === 200) {
                                var newScriptTag = document.createElement('script');
                                newScriptTag.setAttribute('type', 'text/javascript');

                                // This is a very very mean and tricky way to actually catch the exceptions in the
                                // Ajax requested script...
                                newScriptTag.text = 'try {'+"\n"+xhr.responseText
                                    +"\n"+componentName+'.init();'
                                    +"\n"+'} catch (exp) { window.Thomas.loadError("'+componentName+'", exp); }';

                                document.getElementsByTagName('head')[0].appendChild(newScriptTag);

                                loadComponents(index + 1);
                            } else {
                                console.log(xhr.status);
                            }
                        } catch (exp) {
                            options.verbose && console.log(exp);
                        }
                    }
                };

                xhr.send('');
            }
        } else {
            setTimeout(function(){
                options.verbose && console.groupEnd();
                options.verbose && console.info(
                    '%c✔%c All components are loaded.',
                    'color:green; font-weight:bold;',
                    'color:black; font-weight:bold;'
                );
                document.dispatchEvent(options.event);
            }, 500);
        }
    };

    options.verbose && console.clear();
    options.verbose && console.info(
        '%cWelcome to the Thomas Component Framework!',
        'color:black; font-weight:bold;font-size:20px'
    );
    options.verbose && console.group(
        '%c  looking for components...',
        'color:#cecece'
    );

    return {
        constructor: Thomas,

        /**
         * Initialize the component handler by loading the components.
         */
        init : function()
        {
            loadComponents(0);
        },

        /**
         * Informs about component load error.
         *
         * @param {string} componentName
         * @param {ReferenceError} error
         */
        loadError : function(componentName, error)
        {
            var errorMsg = error.toString().split("\n")[0];
            options.verbose && console.info(
                '%c✖%c the '+componentName+' component cannot be loaded: %c'+ errorMsg,
                'color:red',
                'color:black',
                'text-decoration:underline;font-style:italic'
            );
        }
    };
};

window['Thomas'] = new Thomas(ThomasOptions);
Thomas.init();
