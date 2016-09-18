/**
 * @file src/target.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

const Wait = require('./wait.js');

/** move an object to a target's location */
class Target extends Wait
{
    /**
     * move to a target
     * @param {object} object - object to animate
     * @param {object} target - object needs to contain {x: x, y: y}
     * @param {number} speed - number of pixels to move per millisecond
     * @param {object} [options] @see {@link Wait}
     * @param {boolean} [options.keepAlive] don't cancel the animation when target is reached
     */
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

module.exports = Target;