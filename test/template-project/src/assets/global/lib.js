/**
 * @noWrap
 * @require 'fis-mod.js'
 * @require 'redux'
 * @require 'redux-thunk'
 * @require 'react-dom'
 * @require 'react-redux'
 * @require 'react-fastclick'
 * @require 'humps'
 */
(function() {
    Object.assign = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
})();