/**
 * @file src/face.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

const Angle = require('yy-angle');
const Wait = require('./wait.js');

/**
 * @description
 * Animates rotation of object to face the target
 */
class Face extends Wait
{
    /**
     * @param {object} object
     * @param {Point} target
     * @param {number} speed in radians/millisecond
     * @param {object} [options] @see {@link Wait}
     */
    constructor(object, target, speed, options)
    {
        super(object, options);
        this.target = target;
        this.speed = speed;
    }

    calculate(elapsed)
    {
        var angle = Angle.angleTwoPoints(this.object.position, this.target);
        var difference = Angle.differenceAngles(angle, this.object.rotation);
        if (difference === 0)
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
            var sign = Angle.differenceAnglesSign(angle, this.object.rotation);
            var change = this.speed * elapsed;
            var delta = (change > difference) ? difference : change;
            this.object.rotation += delta * sign;
        }
    }
}

module.exports = Face;