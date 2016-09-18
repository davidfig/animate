/**
 * @file src/angle.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

const Wait = require('./wait.js');

/**
 * move object at an angle
 */
class Angle extends Wait
{
    /**
     * @param {object} object to animate
     * @param {number} angle in radians
     * @param {number} speed in pixels/millisecond
     * @param {number} [duration=0] in milliseconds; if 0, then continues forever
     * @param {object} [options] @see {@link Wait}
     */
    constructor(object, angle, speed, duration, options)
    {
        super(object, options);
        this.change(angle);
        this.speed = speed;
        this.duration = duration || 0;
    }

    change(angle)
    {
        this.sin = Math.sin(angle);
        this.cos = Math.cos(angle);
    }

    calculate(elapsed)
    {
        this.object.x += this.cos * elapsed * this.speed;
        this.object.y += this.sin * elapsed * this.speed;
    }
}

module.exports = Angle;