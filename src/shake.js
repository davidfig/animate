/**
 * @file animate.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

const Wait = require('./wait.js');

/**
 * shakes an object or list of objects
 */
class Shake extends Wait
{
    /**
     * @param {object|array} object or list of objects to shake
     * @param {number} amount to shake
     * @param {number} duration (in milliseconds) to shake
     * @param {object} options (see Animate.wait)
     */
    constructor(object, amount, duration, options)
    {
        super(object, options);
        if (Array.isArray(object))
        {
            this.array = true;
            this.list = object;
            this.start = [];
            for (let i = 0, count = object.length; i < count; i++)
            {
                const target = object[i];
                this.start[i] = {x: target.x, y: target.y};
            }
        }
        else
        {
            this.start = {x: object.x, y: object.y};
        }
        this.amount = amount;
        this.duration = duration;
    }

    calculate(/*elapsed*/)
    {
        const object = this.object;
        const start = this.start;
        const amount = this.amount;
        if (this.array)
        {
            const list = this.list;
            for (let i = 0, count = list.length; i < count; i++)
            {
                const object = list[i];
                const actual = start[i];
                object.x = actual.x + Math.floor(Math.random() * amount * 2) - amount;
                object.y = actual.y + Math.floor(Math.random() * amount * 2) - amount;
            }
        }
        object.x = start.x + Math.floor(Math.random() * amount * 2) - amount;
        object.y = start.y + Math.floor(Math.random() * amount * 2) - amount;
    }

    done()
    {
        const object = this.object;
        const start = this.start;
        if (this.array)
        {
            const list = this.list;
            for (let i = 0, count = list.length; i < count; i++)
            {
                const object = list[i];
                const actual = start[i];
                object.x = actual.x;
                object.y = actual.y;
            }
        }
        else
        {
            object.x = start.x;
            object.y = start.y;
        }
    }
}

module.exports = Shake;