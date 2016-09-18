/**
 * @file src/animate.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

// current list of animations
const list = [];

/**
 * used to initialize update call
 * @param {object} [options]
 * @param {boolean} [options.update] Update from {@link https://github.com/davidfig/update}, if not defined, update needs to be called manually
 * @param {boolean} [options.debug] include debug options when calling update
 */
function init(options)
{
    options = options || {};
    if (options.update)
    {
        var opts = (options.debug) ? {percent: 'Animate'} : null;
        options.update.add(update, opts);
    }
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
                if (pop.options)
                {
                    pop.options.cancel = true;
                }
            }
        }
        else
        {
            if (animate.options)
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

function update(elapsed)
{
    for (var i = list.length - 1; i >= 0; i--)
    {
        var animate = list[i];
        if (animate.update(elapsed))
        {
            list.splice(i, 1);
        }
    }
}

module.exports = {
    add: add,
    remove: remove,
    update: update,
    init: init
};