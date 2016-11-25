/**
 * @file animate.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/animate}
 */

module.exports = {
    init: require('./src/animate.js').init,
    remove: require('./src/animate.js').remove,
    update: require('./src/animate.js').update,
    load: require('./src/load.js'),

    wait: require('./src/wait.js'),
    to: require('./src/to.js'),
    shake: require('./src/shake.js'),
    tint: require('./src/tint.js'),
    face: require('./src/face.js'),
    angle: require('./src/angle.js'),
    target: require('./src/target.js'),
    movie: require('./src/movie.js')
};