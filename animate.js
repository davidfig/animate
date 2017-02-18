/**
 * @file animate.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

/**
 * @file src/animate.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

// current list of animations
const list = [];
let _defaults = {};

// hold debug panel for count (if available)
let Debug;
let count;

/**
 * used to initialize update call
 * @param {object} [options]
 * @param {boolean} [options.update] Update from {@link https://github.com/davidfig/update}, if not defined, update needs to be called manually
 * @param {boolean} [options.debug] include debug in percent panel when calling update
 * @param {boolean|object} [options.count] include the animations running count in debug panel {@link https://github.com/davidfig/debug}; can also provide an object with styling for the panel
 * @param {Debug} [options.Debug] use this instantiation of yy-debug for options.count {@link https://github.com/davidfig/debug}
 * @param {Renderer} [options.renderer] default renderer for all animations
 * @param {function|string} [options.ease] default easing function for all animations
 */

function init(options)
{
    options = options || {};
    if (options.update)
    {
        const opts = (options.debug) ? {percent: 'Animate'} : null;
        options.update.add(update, opts);
    }
    if (options.count)
    {
        Debug = options.debug || require('yy-debug');
        const opts = (typeof options.count === 'object') ? options.count : {};
        opts.text = '0 animations';
        count = Debug.add('AnimateCount', opts);
    }
    setDefaults(options);
}

/*
 * Change global defaults
 * @param {Renderer} [options.renderer] default renderer for all animations
 * @param {function|string} [options.ease] default easing function for all animations
 */
function setDefaults(options)
{
    _defaults.renderer = options.renderer || _defaults.renderer;
    _defaults.ease = options.ease || _defaults.ease;
}

/**
 * remove an animation
 * @param {object|array} animate - the animation (or array of animations) to remove
 */
function remove(animate)
{
    if (animate)
    {
        if (Array.isArray(animate))
        {
            while (animate.length)
            {
                var pop = animate.pop();
                if (pop && pop.options)
                {
                    pop.options.cancel = true;
                }
            }
        }
        else
        {
            if (animate && animate.options)
            {
                animate.options.cancel = true;
            }
        }
    }
}

function add(animate)
{
    list.push(animate);
    return animate;
}

/**
 * update function (can be called manually or called internally by {@link init})
 * @param {number} elapsed since last update
 */
function update(elapsed)
{
    let n = 0;
    for (let i = list.length - 1; i >= 0; i--)
    {
        const animate = list[i];
        if (animate.update(elapsed))
        {
            list.splice(i, 1);
        }
        else
        {
            if (!animate.options.pause)
            {
                n++;
            }
        }
    }
    if (count)
    {
        Debug.one(n + ' animations', {panel: count});
    }
}

module.exports = {
    init,
    update,
    remove,
    add,
    get defaults()
    {
        return _defaults;
    },
    setDefaults,
    wait: require('./src/wait'),
    to: require('./src/to'),
    shake: require('./src/shake'),
    tint: require('./src/tint'),
    face: require('./src/face'),
    angle: require('./src/angle'),
    target: require('./src/target'),
    movie: require('./src/movie'),
    load: require('./src/load')
};