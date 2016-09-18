/**
 * @file wait.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

const Add = require('./animate.js').add;

/** base class for all animations */
class Wait
{
    /**
     * @param {object} object to animate
     * @param {object} [options]
     * @param {number} [options.wait=0] n milliseconds before starting animation (can also be used to pause animation for a length of time)
     * @param {Function} [options.ease] function from easing.js (see http://easings.net for examples)
     * @param {Renderer} [options.renderer] sets Renderer.dirty for each loop
     * @param {boolean} [options.pause] start the animation paused
     * @param {(boolean|number)} [options.repeat] true: repeat animation forever; n: repeat animation n times
     * @param {(boolean|number)} [options.reverse] true: reverse animation (if combined with repeat, then pulse); n: reverse animation n times
     * @param {(boolean|number)} [options.continue] true: continue animation with new starting values; n: continue animation n times
     * @param {Function} [options.onDone] function pointer for when the animation expires
     * @param {Function} [options.onCancel] function pointer called after cancelled
     * @param {Function} [options.onWait] function pointer for wait
     * @param {Function} [options.onFirst] function pointer for first time update is called (does not include pause or wait time)
     * @param {Function} [options.onEach] function pointer called after each update
     * @param {Function} [options.onLoop] function pointer called after a revere, repeat, or continue
     */
    constructor(object, options)
    {
        this.object = object;
        this.options = options || {};
        this.time = 0;
        Add(this);
    }

    pause()
    {
        this.options.pause = true;
    }

    resume()
    {
        this.options.pause = false;
    }

    cancel()
    {
        this.options.cancel = true;
    }

    done()
    {
    }

    end(leftOver)
    {
        if (this.options.reverse)
        {
            this.reverse();
            this.time = leftOver;
            if (!this.options.repeat)
            {
                if (this.options.reverse === true)
                {
                    this.options.reverse = false;
                }
                else
                {
                    this.options.reverse--;
                }
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
                this.options.onLoop(this.list || this.object);
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
                this.options.onLoop(this.list || this.object);
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
                this.options.onLoop(this.list || this.object);
            }
        }
        else
        {
            this.done();
            if (this.options.onDone)
            {
                this.options.onDone(this.list || this.object, leftOver);
            }
            this.list = this.object = null;
            this.options = null;
            return true;
        }
    }

    update(elapsed)
    {
        if (!this.options)
        {
            return;
        }
        if (this.options.cancel)
        {
            if (this.options.onCancel)
            {
                this.options.onCancel(this.list || this.object);
            }
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
            if (this.options.wait <= 0)
            {
                elapsed = -this.options.wait;
                this.options.wait = false;
            }
            else
            {
                if (this.options.onWait)
                {
                    this.options.onWait(elapsed, this.list || this.object);
                }
                return;
            }
        }
        if (!this.first)
        {
            this.first = true;
            if (this.options.onFirst)
            {
                this.options.onFirst(this.list || this.object);
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
            this.options.onEach(elapsed, this.list || this.object);
        }
        if (this.options.renderer)
        {
            this.options.renderer.dirty = true;
        }
        if (this.duration !== 0 && this.time === this.duration)
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

    calculate() {}

    noEase (t, b, c, d)
    {
        return c*(t/=d) + b;
    }
}

module.exports = Wait;