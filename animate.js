/*
    animate.js <https://github.com/davidfig/animate>
    License: MIT license <https://github.com/davidfig/animate/license>
    Author: David Figatner
    Copyright (c) 2016 YOPEY YOPEY LLC
*/

// animate any numeric parameter
// object - object to animate
// to - parameters to animate, e.g.: {alpha: 5, scale: {x, 5}, rotation: Math.PI}
// duration - time to run (use 0 for infinite duration--should only be used with customized easing functions)
// ease - easing function from easing.js (see http://easings.net for examples)
// options {}
//
//      wait - wait n MS before starting animation (can also be used to pause animation for a length of time)
//      renderer - sets renderer.dirty = true for each loop
//
//      __change active animation__ (assigned through returned options from to())
//      pause - pause animation
//      cancel - cancel animation
//      restart - restart animation with current starting values
//      original - restart animation with original starting values
//
//      __when animation expires__
//      repeat - true = repeat animation forever; n = repeat animation n times
//      reverse - true = reverse animation (if combined with repeat, then pulse); n = reverse animation n times
//      continue - true = continue animation with new starting values; n = continue animation n times
//
//      __callbacks
//      onDone - function pointer for when the animation expires or is cancelled
//      onFirst - function pointer for first time update is called (does not include pause or wait time)
//      onEach - function pointer called after each update
//      onLoop - function pointer called after a revere, repeat, or continue
//      onReverse - function pointer called after a reverse
//      onRepeat - function pointer called after a repeat
//
//      TODO - suffix: add a suffice to the end of all values (e.g., 'px')
//
// customized easing function(time, start, delta, duration, options)
//   time: current time
//   start: starting value (or {} of starting values)
//   delta: to - start
//   options: {}
//      to: end value
//      parameter: name of parameter being changed
//      object: object
//      options: Animate.to's options (can use it to end the easing function with options.cancel = true)
function to(object, to, duration, options, ease)
{
    // restart loop
    function restart()
    {
        var i = 0;
        start = [], delta = [], keys = [];

        // loops through all keys in to object
        for (var key in to)
        {

            // handles keys with one additional level e.g.: to = {scale: {x: 5, y: 5}}
            if (isNaN(to[key]))
            {
                keys[i] = {key: key, children: []};
                start[i] = [];
                delta[i] = [];
                var j = 0;
                for (var key2 in to[key])
                {
                    keys[i].children[j] = key2;
                    start[i][j] = object[key][key2];
                    delta[i][j] = to[key][key2] - object[key][key2];
                    j++;
                }
            }
            else
            {
                start[i] = object[key];
                delta[i] = to[key] - object[key];
                keys[i] = key;
            }
            i++;
        }
        time = 0;
    }

    // time expired
    function end(leftOver)
    {
        if (options.reverse)
        {
            for (var i = 0; i < keys.length; i++)
            {
                if (isNaN(to[keys[i]]))
                {
                    for (var j = 0; j < keys[i].children.length; j++)
                    {
                        delta[i][j] = -delta[i][j];
                        start[i][j] = object[keys[i].key][keys[i].children[j]];
                    }
                }
                else
                {
                    delta[i] = -delta[i];
                    start[i] = object[keys[i]];
                }
            }
            time = leftOver;
            if (!options.repeat)
            {
                options.reverse = false;
            }
            else
            {
                if (options.repeat !== true)
                {
                    options.repeat--;
                }
            }
            if (options.onLoop)
            {
                onLoop(object, options);
            }
        }
        else if (options.repeat)
        {
            time = leftOver;
            if (options.repeat !== true)
            {
                options.repeat--;
            }
            if (options.onLoop)
            {
                onLoop(object, options);
            }
        }
        else if (options.continue)
        {
            for (var i = 0; i < keys.length; i++)
            {
                if (isNaN(to[keys[i]]))
                {
                    for (var j = 0; j < keys[i].children.length; j++)
                    {
                        start[i][j] = object[keys[i].key][keys[i].children[j]];
                    }
                }
                else
                {
                    start[i] = object[keys[i]];
                }
            }
            time = leftOver;
            if (options.continue !== true)
            {
                options.continue--;
            }
            if (options.onLoop)
            {
                onLoop(object, options);
            }
        }
        else
        {
            if (options.onDone)
            {
                options.onDone(object);
            }
            object = null;
            options = null;
            return true;
        }
    }

    // update loop
    function update(elapsed)
    {
        if (options.cancel)
        {
            if (options.onDone)
            {
                options.onDone(object);
            }
            object = null;
            options = null;
            return true;
        }
        if (options.restart)
        {
            restart();
            options.pause = false;
        }
        if (options.original)
        {
            time = 0;
            options.pause = false;
        }
        if (options.pause)
        {
            return;
        }
        if (options.wait)
        {
            options.wait -= elapsed;
            if (options.wait < 0)
            {
                elapsed += options.wait;
                options.wait = false;
            }
            else
            {
                return;
            }
        }
        if (!first)
        {
            first = true;
            if (options.onFirst)
            {
                options.onFirst(object);
            }
        }
        time += elapsed;
        var leftOver = 0;
        if (duration !== 0 && time > duration)
        {
            leftOver = time - duration;
            time = duration;
        }
        for (var i = 0; i < keys.length; i++)
        {
            if (isNaN(to[keys[i]]))
            {
                for (var j = 0; j < keys[i].children.length; j++)
                {
                    object[keys[i].key][keys[i].children[j]] = ease(time, start[i][j], delta[i][j], duration, {to: to[i][j], object: object[keys[i].key], parameter: keys[i].children[j], options: options});
                }
            }
            else
            {
                object[keys[i]] = ease(time, start[i], delta[i], duration, {to: to[i], parameter: keys[i], object: object, options: options});
            }
        }
        if (options.onEach)
        {
            options.onEach(elapsed, object);
        }
        if (options.renderer)
        {
            options.renderer.dirty = true;
        }
        if (time === duration)
        {
            return end(leftOver);
        }
    }

    options = options || {};
    ease = ease || Easing.none;
    var time, start, delta, keys, first;
    restart();
    Update.add(update);
    return options;
}

// tints a pixi.js sprite
function tint(object, tint, duration, options, ease)
{
    object.tint = object.tint || 0xffffff;
    var r = object.tint >> 16;
    var g = object.tint >> 8 & 0x0000ff;
    var b = object.tint & 0x0000ff;
    var colorFrom = {r: r, g: g, b: b};

    r = tint >> 16;
    g = tint >> 8 & 0x0000ff;
    b = tint & 0x0000ff;
    var colorTo = {r: r, g: g, b: b};

    function each(elapsed, current)
    {
        object.tint = current.r << 16 | current.g << 8 | current.b;
        if (oldEach)
        {
            oldEach(elapsed, current);
        }
    }

    options = options || {};
    var oldEach = options.onEach;
    options.onEach = each;

    return to(colorFrom, colorTo, duration, options, ease);
}

function shake(object, amount, duration, options, ease)
{
    function each(elapsed, object)
    {
        object.x = start.x + Math.floor(Math.random() * amount * 2) - amount;
        object.y = start.y + Math.floor(Math.random() * amount * 2) - amount;
        if (oldEach)
        {
            oldEach(elapsed, object);
        }
    }

    var start = {x: object.x, y: object.y};
    options = options || {};
    var oldEach = options.onEach;
    options.onEach = each;

    object.shake = 0;
    return to(object, {shake: 1}, duration, options, ease);
}

// accepts either an animation or list of animations
function cancel(animate)
{
    if (animate)
    {
        if (Array.isArray(animate))
        {
            for (var i = 0; i < animate.length; i++)
            {
                animate[i].cancel = true;
            }
        }
        else
        {
            animate.cancel = true;
        }
    }
}

// move to a target
// object - object to animate
// to - target to move to (should have a .x and .y parameter)
// speed - number of pixels to move per millisecond
// ease - easing function from easing.js (see http://easings.net for examples)
// options {}
//
//      wait - wait n MS before starting animation (can also be used to pause animation for a length of time)
//      renderer - sets renderer.dirty = true for each loop
//
//      __change active animation__ (assigned through returned options from to())
//      pause - pause animation
//      cancel - cancel animation
//
//      __when animation expires__
//      keepAlive - false (default) don't cancel the animation when target is reached
//
//      __callbacks
//      onDone - function pointer for when the animation expires or is cancelled
//      onFirst - function pointer for first time update is called (does not include pause or wait time)
//      onEach - function pointer called after each update
function toTarget(object, target, speed, options)
{
    function update(elapsed)
    {
        if (options.cancel)
        {
            if (options.onDone)
            {
                options.onDone(object);
            }
            return true;
        }
        if (options.pause)
        {
            return;
        }
        if (options.wait)
        {
            options.wait -= elapsed;
            if (options.wait < 0)
            {
                elapsed += options.wait;
                options.wait = false;
            }
            else
            {
                return;
            }
        }
        if (!first)
        {
            first = true;
            if (options.onFirst)
            {
                options.onFirst(object);
            }
        }
        var angle = Math.atan2(target.y - object.y, target.x - object.x);
        if (angle !== lastAngle)
        {
            cos = Math.cos(angle);
            sin = Math.sin(angle);
            lastAngle = angle;
        }
        var deltaX = target.x - object.x;
        var deltaY = target.y - object.y;
        if (deltaX === 0 && deltaY === 0)
        {
            if (!options.keepAlive)
            {
                if (options.onDone)
                {
                    options.onDone(object);
                }
                return true;
            }
        }
        else
        {
            var signX = deltaX >= 0;
            var signY = deltaY >= 0;
            object.x += cos * elapsed * speed;
            object.y += sin * elapsed * speed;
            if (signX !== ((target.x - object.x) >= 0))
            {
                object.x = target.x;
            }
            else if (signY !== ((target.y - object.y) >= 0))
            {
                object.y = target.y;
            }
        }
        if (options.renderer)
        {
            options.renderer.dirty = true;
        }
        if (options.onEach)
        {
            options.onEach(elapsed, object);
        }
    }

    options = options || {};
    var lastAngle, cos, sin, first;
    Update.add(update);
    return options;
}

// exports
var Animate = {
    to: to,
    toTarget: toTarget,
    tint: tint,
    shake: shake,
    cancel: cancel
};

// add support for AMD (Asynchronous Module Definition) libraries such as require.js.
if (typeof define === 'function' && define.amd)
{
    define(function()
    {
        return {
            Animate: Animate
        };
    });
}

// add support for CommonJS libraries such as browserify.
if (typeof exports !== 'undefined')
{
    module.exports = Animate;
}

// define globally in case AMD is not available or available but not used
if (typeof window !== 'undefined')
{
    window.Animate = Animate;
}