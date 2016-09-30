/**
 * @file animate.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

const Wait = require('./wait.js');

/** shakes an object */
class Shake extends Wait
{
    constructor(object, amount, duration, options)
    {
        super(object, options);
        this.start = {x: object.x, y: object.y};
        this.amount = amount;
        this.duration = duration;
    }

    calculate(/*elapsed*/)
    {
        const object = this.object;
        const start = this.start;
        const amount = this.amount;
        object.x = start.x + Math.floor(Math.random() * amount * 2) - amount;
        object.y = start.y + Math.floor(Math.random() * amount * 2) - amount;
    }

    done()
    {
        const object = this.object;
        const start = this.start;
        object.x = start.x;
        object.y = start.y;
    }
}

module.exports = Shake;