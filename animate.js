/*
    animate.js <https://github.com/davidfig/animate>
    License: MIT license <https://github.com/davidfig/animate/license>
    Author: David Figatner
    Copyright (c) 2016 YOPEY YOPEY LLC
*/

var Animate = {

    PI_2: Math.PI * 2,
    list: [],

    /**
     * @param {object=} options
     * @param {boolean} options.noUpdate - do not add to Update queue (use only if Animate.update() will be called manually)
     */
    init: function(options)
    {
        options = options || {};
        if (!options.noUpdate)
        {
            Update.add(Animate.update);
        }
    },

    /**
     * remove an animation
     * @param {object|array} animate - the animation (or array of animations) to remove
     */
    remove: function(animate)
    {
        if (animate)
        {
            if (Array.isArray(animate))
            {
                while (animate.length)
                {
                    var pop = animate.pop();
                    pop.cancel = true;
                }
            }
            else
            {
                animate.cancel = true;
            }
        }
    },

    /**
     * animate any numeric parameter
     * @param {object} object to animate
     * @param {object} goto - parameters to animate, e.g.: {alpha: 5, scale: {x, 5}, rotation: Math.PI}
     * @param {number} duration - time to run (use 0 for infinite duration--should only be used with customized easing functions)
     * @param {function=Easing.none} easing function from easing.js (see http://easings.net for examples)
     * @param {object=} options
     * @param {number=} options.wait n milliseconds before starting animation (can also be used to pause animation for a length of time)
     * @param {Renderer=} options.renderer - sets Renderer.dirty for each loop
     * @param {boolean=} options.pause - start the animation paused
     * @param {boolean|number=} options.repeat - true = repeat animation forever; n = repeat animation n times
     * @param {boolean|number=} options.reverse - true = reverse animation (if combined with repeat, then pulse); n = reverse animation n times
     * @param {boolean|number=} options.continue - true = continue animation with new starting values; n = continue animation n times
     * @param {function=} options.onDone - function pointer for when the animation expires
     * @param {function=} options.onCancel - function pointer called after cancelled
     * @param {function=} options.onWait - function pointer for wait
     * @param {function=} options.onFirst - function pointer for first time update is called (does not include pause or wait time)
     * @param {function=} options.onEach - function pointer called after each update
     * @param {function=} options.onLoop - function pointer called after a revere, repeat, or continue
     */
    to: function(object, goto, duration, options, ease)
    {
        if (Array.isArray(object))
        {
            return Animate.toArray(object, goto, duration, options, ease);
        }
        else
        {
            return new AnimateTo(object, goto, duration, options, ease);
        }
    },

    /**
     * move to a target
     * @param {PIXI.DisplayObject} object - object to animate
     * @param {PIXI.DisplayObject|PIXI.Point} target (should have a .x and .y parameter)
     * @param {number} speed - number of pixels to move per millisecond
     * @param {object=} options
     * @param {object=} options.wait - wait n milliseconds before starting animation (can also be used to pause animation for a length of time)
     * @param {Renderer=} renderer - sets Renderer.dirty for each loop
     * @param {boolean=} pause - pause animation indefinitely
     * @param {boolean=} keepAlive - don't cancel the animation when target is reached
     * @param {Function=} onDone - callback for when the animation expires or is cancelled
     *                             is also triggered when keepAlive = true and the target is reached (triggers on each update)
     * @param {Function=} onFirst - callback for first time update is called (does not include pause or wait time)
     * @param {Function=} onEach - callback after each update
     * @param {Function=} onWait - callback for wait loops
     * @param {Function} ease - easing function from easing.js (see http://easings.net for examples)
     */
    target: function(object, target, speed, options)
    {
        return new AnimateTarget(object, target, speed, options);
    },

    /**
     * face (spin to) a target
     * @param {PIXI.DisplayObject} object to spin
     * @param {PIXI.DisplayObject|PIXI.Point} target to face
     * @param {number} speed - number of radians to move per millisecond
     * @param {object} options
     * @param {number=} options.wait n milliseconds before starting animation (can also be used to pause animation for a length of time)
     * @param {Renderer=} options.renderer - sets Renderer.dirty for each loop
     * @param {boolean=} options.pause - start the animation paused
     * @param {boolean=} options.keepAlive - don't cancel the animation when target is reached
     * @param {function=} options.onDone - function pointer for when the animation expires
     * @param {function=} options.onWait - function pointer for wait
     * @param {function=} options.onFirst - function pointer for first time update is called (does not include pause or wait time)
     * @param {function=} options.onEach - function pointer called after each update
     */
    face: function(object, target, speed, options)
    {
        return new AnimateFace(object, target, speed, options);
    },

    /**
     * animate a list of PIXI.Textures
     * @param {PIXI.Sprite} object to animate
     * @param {PIXI.Texture[]} textures to cycle
     * @param {number} duration
     * @param {object=} options (same as Animate.to)
     * @param {Function=Easing.none} ease - easing function
     */
    movie: function(object, textures, duration, options, ease)
    {
        function each(elapsed)
        {
            var index = Math.floor(dummy.count);
            for (var i = 0; i < list.length; i++)
            {
                list[i].texture = textures[index];
            }
            if (onEach)
            {
                onEach(elapsed, object);
            }
        }

        var list = (Array.isArray(object)) ? object : [object];
        var dummy = {count: 0};
        var onEach = options.onEach;
        options.onEach = each;
        return new AnimateTo(dummy, {count: textures.length - 1}, duration, options, ease);
    },

    add: function(animate)
    {
        Animate.list.push(animate);
    },

    toArray: function(list, goto, duration, options, ease)
    {
        function each(elapsed, object)
        {
            for (var i = 0; i < keys.length; i++)
            {
                if (isNaN(goto[keys[i]]))
                {
                    for (var j = 0; j < keys[i].children.length; j++)
                    {
                        for (var k = 1; k < list.length; k++)
                        {
                            list[k][keys[i].key][keys[i].children[j]] = list[0][keys[i].key][keys[i].children[j]];
                        }
                    }
                }
                else
                {
                    for (var k = 1; k < list.length; k++)
                    {
                        list[k][keys[i]] = list[0][keys[i]];
                    }
                }
            }
            if (onEach)
            {
                onEach(elapsed, object);
            }
        }

        function done()
        {
            if (onDone)
            {
                onDone(list);
            }
        }

        var keys = [], i = 0;
        for (var key in goto)
        {

            // handles keys with one additional level e.g.: goto = {scale: {x: 5, y: 5}}
            if (isNaN(goto[key]))
            {
                keys[i] = {key: key, children: []};
                var j = 0;
                for (var key2 in goto[key])
                {
                    keys[i].children[j] = key2;
                    j++;
                }
            }
            else
            {
                keys[i] = key;
            }
            i++;
        }
        var onEach = options.onEach;
        options.onEach = each;
        var onDone = options.onDone;
        options.onDone = done;
        return new AnimateTo(list[0], goto, duration, options, ease);
    },

    tint: function(object, tint, duration, options, ease)
    {
        function toRGB(hex)
        {
            var r = hex >> 16;
            var g = hex >> 8 & 0x0000ff;
            var b = hex & 0x0000ff;
            return {r: r, g: g, b: b};
        }

        function toHex(rgb)
        {
            return rgb.r << 16 | rgb.g << 8 | rgb.b;
        }

        function each(elapsed, current)
        {
            if (list)
            {
                var tint = toHex(current);
                for (var i = 0; i < list.length; i++)
                {
                    list[i].tint = tint;
                }
            }
            else
            {
                object.tint = toHex(current);
            }
            if (oldEach)
            {
                oldEach(elapsed, current);
            }
        }

        options = options || {};
        var oldEach = options.onEach;
        options.onEach = each;
        var list;
        if (Array.isArray(object))
        {
            list = object;
            object = list[0];
        }
        object.tint = object.tint || 0xffffff;
        var colorFrom = toRGB(object.tint);
        var colorTo = toRGB(tint);
        return new AnimateTo(colorFrom, colorTo, duration, options, ease);
    },

    shake: function(object, amount, duration, options, ease)
    {
        function each(elapsed, object)
        {
            if (list)
            {
                for (var i = 0; i < list.length; i++)
                {
                    list[i].x = start[i].x + Math.floor(Math.random() * amount * 2) - amount;
                    list[i].y = start[i].y + Math.floor(Math.random() * amount * 2) - amount;
                }
            }
            else
            {
                object.x = start.x + Math.floor(Math.random() * amount * 2) - amount;
                object.y = start.y + Math.floor(Math.random() * amount * 2) - amount;
            }
            if (oldEach)
            {
                oldEach(elapsed, object);
            }
        }
        function done()
        {
            if (list)
            {
                for (var i = 0; i < list.length; i++)
                {
                    list[i].x = start[i].x;
                    list[i].y = start[i].y;
                }
            }
            else
            {
                object.x = start.x;
                object.y = start.y;
            }
            if (oldDone)
            {
                oldDone(object);
            }
        }

        var list = null, start;
        if (Array.isArray(object))
        {
            list = object;
            object = list[0];
            start = [];
            for (var i = 0; i < list.length; i++)
            {
                start[i] = {x: list[i].x, y: list[i].y};
            }
        }
        else
        {
            start = {x: object.x, y: object.y};
        }
        options = options || {};
        var oldEach = options.onEach;
        options.onEach = each;
        var oldDone = options.onDone;
        options.onDone = done;
        object.shake = 0;
        return new AnimateTo(object, {shake: 1}, duration, options, ease);
    },

    update: function(elapsed)
    {
        for (var i = Animate.list.length - 1; i >= 0; i--)
        {
            if (Animate.list[i].update(elapsed))
            {
                Animate.list.splice(i, 1);
            }
        }
    }
};

class AnimateBase
{
    constructor(object, options)
    {
        this.object = object;
        this.options = options || {};
        Animate.add(this);
    }

    pause()
    {
        this.options.pause = true;
    }

    cancel()
    {
        this.options.cancel = true;
    }

    end(leftOver)
    {
        if (this.options.reverse)
        {
            this.reverse();
            this.time = leftOver;
            if (!this.options.repeat)
            {
                this.options.reverse = false;
            }
            else
            {
                if (this.options.repeat !== true)
                {
                    this.options.repeat--;
                }
            }
            if (this.options.onLoop)
            {
                this.onLoop(this.object);
            }
        }
        else if (this.options.repeat)
        {
            this.time = leftOver;
            if (this.options.repeat !== true)
            {
                this.options.repeat--;
            }
            if (this.options.onLoop)
            {
                this.onLoop(this.object);
            }
        }
        else if (this.options.continue)
        {
            this.continue();
            this.time = leftOver;
            if (this.options.continue !== true)
            {
                this.options.continue--;
            }
            if (this.options.onLoop)
            {
                this.onLoop(this.object);
            }
        }
        else
        {
            if (this.options.onDone)
            {
                this.options.onDone(this.object);
            }
            this.object = null;
            this.options = null;
            return true;
        }
    }

    update(elapsed)
    {
        if (this.options.cancel)
        {
            if (this.options.onCancel)
            {
                this.options.onCancel(object);
            }
            this.object = null;
            this.options = null;
            return true;
        }
        if (this.options.restart)
        {
            this.restart();
            this.options.pause = false;
        }
        if (this.options.original)
        {
            this.time = 0;
            this.options.pause = false;
        }
        if (this.options.pause)
        {
            return;
        }
        if (this.options.wait)
        {
            this.options.wait -= elapsed;
            if (this.options.wait < 0)
            {
                elapsed += this.options.wait;
                this.options.wait = false;
            }
            else
            {
                if (this.options.onWait)
                {
                    this.options.onWait(this.object);
                }
                return;
            }
        }
        if (!this.first)
        {
            this.first = true;
            if (this.options.onFirst)
            {
                this.options.onFirst(this.object);
            }
        }
        this.time += elapsed;
        var leftOver = 0;
        if (this.duration !== 0 && this.time > this.duration)
        {
            leftOver = this.time - this.duration;
            this.time = this.duration;
        }
        var allDone = this.calculate(elapsed);
        if (this.options.onEach)
        {
            this.options.onEach(elapsed, this.object);
        }
        if (this.options.renderer)
        {
            this.options.renderer.dirty = true;
        }
        if (this.time === this.duration)
        {
            return this.end(leftOver);
        }
        if (allDone)
        {
            return true;
        }
    }

    // correct certain DOM values
    _correctDOM(key, value)
    {
        switch (key)
        {
        case 'opacity':
            return (isNaN(value)) ? 1 : value;
        }
        return value;
    }
}

class AnimateTo extends AnimateBase
{
    constructor(object, goto, duration, options, ease)
    {
        super(object, options);
        this.goto = goto;
        this.duration = duration;
        this.ease = ease || Easing.none;
        this.restart();
    }

    restart()
    {
        var i = 0;
        this.start = [];
        this.delta = [];
        this.keys = [];

        // loops through all keys in goto object
        for (var key in this.goto)
        {

            // handles keys with one additional level e.g.: goto = {scale: {x: 5, y: 5}}
            if (isNaN(this.goto[key]))
            {
                this.keys[i] = {key: key, children: []};
                this.start[i] = [];
                this.delta[i] = [];
                var j = 0;
                for (var key2 in this.goto[key])
                {
                    this.keys[i].children[j] = key2;
                    this.start[i][j] = parseFloat(this.object[key][key2]);
                    this.start[i][j] = this._correctDOM(key2, this.start[i][j]);
                    this.start[i][j] = isNaN(this.start[i][j]) ? 0 : this.start[i][j];
                    this.delta[i][j] = this.goto[key][key2] - this.start[i][j];
                    j++;
                }
            }
            else
            {
                this.start[i] = parseFloat(this.object[key]);
                this.start[i] = this._correctDOM(key, this.start[i]);
                this.start[i] = isNaN(this.start[i]) ? 0 : this.start[i];
                this.delta[i] = this.goto[key] - this.start[i];
                this.keys[i] = key;
            }
            i++;
        }
        this.time = 0;
    }

    reverse()
    {
        for (var i = 0; i < this.keys.length; i++)
        {
            if (isNaN(this.goto[this.keys[i]]))
            {
                for (var j = 0; j < this.keys[i].children.length; j++)
                {
                    this.delta[i][j] = -this.delta[i][j];
                    this.start[i][j] = parseFloat(this.object[this.keys[i].key][this.keys[i].children[j]]);
                    this.start[i][j] = isNaN(this.start[i][j]) ? 0 : this.start[i][j];
                }
            }
            else
            {
                this.delta[i] = -this.delta[i];
                this.start[i] = parseFloat(this.object[this.keys[i]]);
                this.start[i] = isNaN(this.start[i]) ? 0 : this.start[i];
            }
        }
    }

    continue()
    {
        for (var i = 0; i < this.keys.length; i++)
        {
            if (isNaN(this.goto[this.keys[i]]))
            {
                for (var j = 0; j < this.keys[i].children.length; j++)
                {
                    this.start[i][j] = parseFloat(this.object[this.keys[i].key][this.keys[i].children[j]]);
                    this.start[i][j] = isNaN(this.start[i][j]) ? 0 : this.start[i][j];
                }
            }
            else
            {
                this.start[i] = parseFloat(this.object[this.keys[i]]);
                this.start[i] = isNaN(this.start[i]) ? 0 : this.start[i];
            }
        }
    }

    calculate(elapsed)
    {
        for (var i = 0; i < this.keys.length; i++)
        {
            if (isNaN(this.goto[this.keys[i]]))
            {
                for (var j = 0; j < this.keys[i].children.length; j++)
                {
                    this.object[this.keys[i].key][this.keys[i].children[j]] = this.ease(this.time, this.start[i][j], this.delta[i][j], this.duration);
                }
            }
            else
            {
                this.object[this.keys[i]] = this.ease(this.time, this.start[i], this.delta[i], this.duration);
            }
        }
    }
}

class AnimateTarget extends AnimateBase
{
    constructor(object, target, speed, options)
    {
        super(object, options);
        this.target = target;
        this.speed = speed;
    }

    // TODO
    reverse() {}
    continue() {}

    calculate(elapsed)
    {
        if (!this.lastTarget || this.target.x !== this.lastTarget.x || this.target.y !== this.lastTarget.y || this.lastTarget.posX !== this.object.x || this.lastTarget.posY !== this.object.y)
        {
            var angle = Math.atan2(this.target.y - this.object.y, this.target.x - this.object.x);
            this.cos = Math.cos(angle);
            this.sin = Math.sin(angle);
            this.lastTarget = {x: this.target.x, y: this.target.y};
        }
        var deltaX = this.target.x - this.object.x;
        var deltaY = this.target.y - this.object.y;
        if (deltaX === 0 && deltaY === 0)
        {
            if (this.options.onDone)
            {
                this.options.onDone(this.object);
            }
            if (!this.options.keepAlive)
            {
                return true;
            }
        }
        else
        {
            var signX = deltaX >= 0;
            var signY = deltaY >= 0;
            this.object.x += this.cos * elapsed * this.speed;
            this.object.y += this.sin * elapsed * this.speed;
            if (signX !== ((this.target.x - this.object.x) >= 0))
            {
                this.object.x = this.target.x;
            }
            if (signY !== ((this.target.y - this.object.y) >= 0))
            {
                this.object.y = this.target.y;
            }
            this.lastTarget.posX = this.object.x;
            this.lastTarget.posY = this.object.y;
        }
    }
}

//     // move at an angle
//     // object - object to animate
//     // angle - angle to move at
//     // speed - number of pixels to move per millisecond
//     // options {}
//     //
//     //      wait - wait n MS before starting animation (can also be used to pause animation for a length of time)
//     //      renderer - sets renderer.dirty = true for each loop
//     //
//     //      __change active animation__ (assigned through returned options from to())
//     //      pause - pause animation
//     //      cancel - cancel animation
//     //
//     //      __callbacks__
//     //      onDone - function pointer for when the animation expires or is cancelled
//     //      onFirst - function pointer for first time update is called (does not include pause or wait time)
//     //      onEach - function pointer called after each update
//     //      onWait - function pointer for wait
//     angle: function(object, angle, speed, duration, options)
//     {
//         function update(elapsed)
//         {
//             if (options.cancel)
//             {
//                 if (options.onDone)
//                 {
//                     options.onDone(object);
//                 }
//                 return true;
//             }
//             if (options.pause)
//             {
//                 return;
//             }
//             if (options.wait)
//             {
//                 options.wait -= elapsed;
//                 if (options.wait < 0)
//                 {
//                     elapsed += options.wait;
//                     options.wait = false;
//                 }
//                 else
//                 {
//                     if (options.onWait)
//                     {
//                         options.onWait(object);
//                     }
//                     return;
//                 }
//             }
//             time += elapsed;
//             if (time >= duration)
//             {
//                 if (options.onDone)
//                 {
//                     options.onDone(object);
//                 }
//                 return true;
//             }
//             if (!first)
//             {
//                 first = true;
//                 if (options.onFirst)
//                 {
//                     options.onFirst(object);
//                 }
//             }
//             object.x += cos * elapsed * speed;
//             object.y += sin * elapsed * speed;
//             if (options.renderer)
//             {
//                 options.renderer.dirty = true;
//             }
//             if (options.onEach)
//             {
//                 options.onEach(elapsed, object);
//             }
//         }

//         options = options || {};
//         var first;
//         var cos = Math.cos(angle);
//         var sin = Math.sin(angle);
//         Update.add(update);
//         return options;
//     },

class AnimateFace extends AnimateBase
{
    constructor(object, target, speed, options)
    {
        super(object, options);
        this.target = target;
        this.speed = speed;
    }

    angleTwoPoints(p1, p2)
    {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }

    differenceAngles(a, b)
    {
        var c = Math.abs(a - b) % Animate.PI_2;
        return c > Math.PI ? (Animate.PI_2 - c) : c;
    }

    differenceAnglesSign(target, source)
    {
        function mod(a, n)
        {
            return (a % n + n) % n;
        }

        var a = target - source;
        return mod((a + Math.PI), Animate.PI_2) - Math.PI > 0 ? 1 : -1;
    }

    calculate(elapsed)
    {
        var angle = angleTwoPoints(this.object.position, this.target);
        if (angle === this.object.rotation)
        {
            if (this.options.onDone)
            {
                this.options.onDone(this.object);
            }
            if (!this.options.keepAlive)
            {
                return true;
            }
        }
        else
        {
            var difference = differenceAngles(angle, this.object.rotation);
            var sign = differenceAnglesSign(angle, this.object.rotation);
            var change = this.speed * elapsed;
            var delta = (change > difference) ? difference : change;
            this.object.rotation += delta * sign;
        }
    }
}

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