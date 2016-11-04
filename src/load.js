/**
 * @file load.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

const Wait = require('./wait.js');
const To = require('./to.js');
const Tint = require('./tint.js');
const Shake = require('./shake.js');
const Angle = require('./angle.js');
const Face = require('./face.js');
const Target = require('./target.js');

/**
 * restart an animation from a saved state
 * @param {object} object(s) to animate (cannot be saved)
 * @param {object} load object from .save()
 * @param {object} [options] include any additional options that cannot be saved (e.g., onDone function pointer)
 */
function load(object, load, options)
{
    options = options || {};
    options.load = load;
    switch (load.type)
    {
    case 'Wait':
        return new Wait(object, options);
    case 'To':
        return new To(object, null, null, options);
    case 'Tint':
        return new Tint(object, null, null, options);
    case 'Shake':
        return new Shake(object, null, null, options);
    case 'Angle':
        return new Angle(object, null, null, null, options);
    case 'Face':
        return new Face(object[0], object[1], null, options);
    case 'Target':
        return new Target(object[0], object[1], null, options);
    }
}

module.exports = load;