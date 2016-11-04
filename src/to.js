/**
 * @file to.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

const Wait = require('./wait.js');

/**
 * animate any numeric parameter of an object or array of objects
 * @examples
 *
 *    // animate sprite to (20, 20) over 1s using easeInOuTsine, and then reverse the animation
 *    new Animate.to(sprite, {x: 20, y: 20}, 1000, {reverse: true, ease: Easing.easeInOutSine});
 *
 *    // animate list of sprites to a scale over 10s after waiting 1s
 *    new Animate.to([sprite1, sprite2, sprite3], {scale: {x: 0.25, y: 0.25}}, 10000, {wait: 1000});
 */
class To extends Wait
{
    /**
     * @param {object} object to animate
     * @param {object} goto - parameters to animate, e.g.: {alpha: 5, scale: {x, 5} rotation: Math.PI}
     * @param {number} [duration=0] - time to run (use 0 for infinite duration--should only be used with customized easing functions)
     * @param {object} [options]
     * @param {number} [options.wait=0] n milliseconds before starting animation (can also be used to pause animation for a length of time)
     * @param {boolean} [options.pause] start the animation paused
     * @param {(boolean|number)} [options.repeat] true: repeat animation forever; n: repeat animation n times
     * @param {(boolean|number)} [options.reverse] true: reverse animation (if combined with repeat, then pulse); n: reverse animation n times
     * @param {(boolean|number)} [options.continue] true: continue animation with new starting values; n: continue animation n times
     * @param {Function} [options.load] loads an animation using an .save() object; note the * parameters below cannot be loaded and must be re-set
     * @param {Function} [options.ease] function from easing.js (see http://easings.net for examples)*
     * @param {Renderer} [options.renderer] sets Renderer.dirty for each loop*
     * @param {Function} [options.onDone] function pointer for when the animation expires*
     * @param {Function} [options.onCancel] function pointer called after cancelled*
     * @param {Function} [options.onWait] function pointer for wait*
     * @param {Function} [options.onFirst] function pointer for first time update is called (does not include pause or wait time)*
     * @param {Function} [options.onEach] function pointer called after each update*
     * @param {Function} [options.onLoop] function pointer called after a revere, repeat, or continue*
     */
    constructor(object, goto, duration, options)
    {
        options = options || {};
        super(object, options);
        this.type = 'To';
        if (Array.isArray(object))
        {
            this.list = object;
            this.object = this.list[0];
        }
        this.ease = options.ease || this.noEase;
        if (options.load)
        {
            this.load(options.load);
        }
        else
        {
            this.goto = goto;
            this.duration = duration;
            this.restart();
        }
    }

    save()
    {
        if (this.options.cancel)
        {
            return null;
        }
        const save = super.save();
        save.goto = this.goto;
        save.start = this.start;
        save.delta = this.delta;
        save.keys = this.keys;
        return save;
    }

    load(load)
    {
        super.load(load);
        this.goto = load.goto;
        this.start = load.start;
        this.delta = load.delta;
        this.keys = load.keys;
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

    calculate(/*elapsed*/)
    {
        for (var i = 0; i < this.keys.length; i++)
        {
            if (isNaN(this.goto[this.keys[i]]))
            {
                for (var j = 0; j < this.keys[i].children.length; j++)
                {
                    const key1 = this.keys[i].key;
                    const key2 = this.keys[i].children[j];
                    const others = this.object[key1][key2] = this.ease(this.time, this.start[i][j], this.delta[i][j], this.duration);
                    if (this.list)
                    {
                        for (let j = 1; j < this.list.length; j++)
                        {
                            this.list[j][key1][key2] = others;
                        }
                    }
                }
            }
            else
            {
                const key = this.keys[i];
                const others = this.object[key] = this.ease(this.time, this.start[i], this.delta[i], this.duration);
                if (this.list)
                {
                    for (let j = 1; j < this.list.length; j++)
                    {
                        this.list[j][key] = others;
                    }
                }
            }
        }
    }
}

module.exports = To;