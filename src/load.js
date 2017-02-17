/**
 * @file load.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

const wait = require('./wait');
const to = require('./to');
const tint = require('./tint');
const shake = require('./shake');
const angle = require('./angle');
const face = require('./face');
const target = require('./target');
const movie = require('./movie');

/**
 * restart an animation = require(a saved state
 * @param {object} object(s) to animate (cannot be saved)
 * @param {object} load object = require(.save()
 * @param {object} [options] include any additional options that cannot be saved (e.g., onDone function pointer)
 */

function load(object, load, options)
{
    if (!load)
    {
        return null;
    }
    options = options || {};
    options.load = load;
    switch (load.type)
    {
    case 'Wait':
        return new wait(object, options);
    case 'To':
        return new to(object, null, null, options);
    case 'Tint':
        return new tint(object, null, null, options);
    case 'Shake':
        return new shake(object, null, null, options);
    case 'Angle':
        return new angle(object, null, null, null, options);
    case 'Face':
        return new face(object[0], object[1], null, options);
    case 'Target':
        return new target(object[0], object[1], null, options);
    case 'Movie':
        return new movie(object, object[1], null, options);
    }
}

module.exports = load;