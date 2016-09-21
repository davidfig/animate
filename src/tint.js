/**
 * @file tint.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

const Color = require('yy-color');
const Wait = require('./wait.js');

/** changes the tint of an object */
class Tint extends Wait
{
    /**
     * @param {PIXI.DisplayObject} object
     * @param {number} tint
     * @param {number} [duration=0] in milliseconds, if 0, repeat forever
     * @param {object} [options] @see {@link Wait}
     */
    constructor(object, tint, duration, options)
    {
        super(object, options);
        this.duration = duration;
        this.ease = this.options.ease || this.noEase;
        this.start = object.tint;
        this.to = tint;
    }

    calculate(/* elapsed */)
    {
        const percent = this.ease(this.time, 0, 1, this.duration);
        this.object.tint = Color.blend(percent, this.start, this.to);
    }

    reverse()
    {
        const swap = this.to;
        this.to = this.start;
        this.start = swap;
    }
}

module.exports = Tint;