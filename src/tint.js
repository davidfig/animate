/**
 * @file tint.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

const Wait = require('./wait.js');

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
        this.ease = options.ease || this.noEase;
        const start = this.start = this.toRGB(object.tint);
        const to = this.to = this.toRGB(tint);
        this.delta = {r: to.r - start.r, g: to.g - start.g, b: to.b - start.b};
    }

    calculate(/* elapsed */)
    {
        const percent = this.ease(this.time, 0, 1, this.duration);
        const start = this.start;
        const delta = this.delta;
        this.object.tint = this.toHex({r: start.r + delta.r * percent, g: start.g + delta.g * percent, b: start.b + delta.b * percent});
    }

    reverse()
    {
        const swap = this.start;
        this.to = this.start;
        this.start = swap;
        this.delta.r *= -1;
        this.delta.g *= -1;
        this.delta.b *= -1;
    }

    toRGB(hex)
    {
        var r = hex >> 16;
        var g = hex >> 8 & 0x0000ff;
        var b = hex & 0x0000ff;
        return {r: r, g: g, b: b};
    }

    toHex(rgb)
    {
        return rgb.r << 16 | rgb.g << 8 | rgb.b;
    }


}

module.exports = Tint;