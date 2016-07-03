/*
    animate.js <https://github.com/davidfig/animate>
    License: MIT license <https://github.com/davidfig/animate/license>
    Author: David Figatner
    Copyright (c) 2016 YOPEY YOPEY LLC
*/ (function(){

// animate any numeric parameter
// object - object to animate
// to - parameters to animate, e.g.: {alpha: 5, scale: {x, 5}, rotation: Math.PI}
// ease - easing function from easing.js (see http://easings.net for examples)
// options {}
//
//      wait - wait n MS before starting animation (can also be used to pause animation for a length of time)
//
//      __change active animation__ (assigned through returned options from to())
//      pause - pause animation
//      cancel - cancel animation
//      restart - restart animation with current starting values
//      original - restart animation with original starting values
//
//      __when animation expires__
//      repeat - true = repeat animation forever; n = repeat animation n times
//      reverse - true = reverse animation (if combined with repeat, then pulse); n = reverse animation n times
//      continue - true = continue animation with new starting values; n = continue animation n times
//
//      __callbacks
//      onDone - function pointer for when the animation expires or is cancelled
//      onFirst - function pointer for first time update is called (does not include pause or wait time)
//      onEach - function pointer called after each update
//      onLoop - function pointer called after a revere, repeat, or continue
//      onReverse - function pointer called after a reverse
//      onRepeat - function pointer called after a repeat
//
//      TODO - suffix: add a suffice to the end of all values (e.g., 'px')
function to(object, to, duration, options, ease)
{
    // restart loop
    function restart()
    {
        var i = 0;
        start = [], delta = [], keys = [];

        // loops through all keys in to object
        for (var key in to)
        {

            // handles keys with one additional level e.g.: to = {scale: {x: 5, y: 5}}
            if (isNaN(to[key]))
            {
                keys[i] = {key: key, children: []};
                start[i] = [];
                delta[i] = [];
                var j = 0;
                for (var key2 in to[key])
                {
                    keys[i].children[j] = key2;
                    start[i][j] = object[key][key2];
                    delta[i][j] = to[key][key2] - object[key][key2];
                    j++;
                }
            }
            else
            {
                start[i] = object[key];
                delta[i] = to[key] - object[key];
                keys[i] = key;
            }
            i++;
        }
        time = 0;
    }

    // time expired
    function end(leftOver)
    {
        if (options.reverse)
        {
            for (var i = 0; i < keys.length; i++)
            {
                if (isNaN(to[keys[i]]))
                {
                    for (var j = 0; j < keys[i].children.length; j++)
                    {
                        delta[i][j] = -delta[i][j];
                        start[i][j] = object[keys[i].key][keys[i].children[j]];
                    }
                }
                else
                {
                    delta[i] = -delta[i];
                    start[i] = object[keys[i]];
                }
            }
            time = leftOver;
            if (!options.repeat)
            {
                options.reverse = false;
            }
            else
            {
                if (options.repeat !== true)
                {
                    options.repeat--;
                }
            }
            if (options.onLoop)
            {
                onLoop(object, options);
            }
        }
        else if (options.repeat)
        {
            time = leftOver;
            if (options.repeat !== true)
            {
                options.repeat--;
            }
            if (options.onLoop)
            {
                onLoop(object, options);
            }
        }
        else if (options.continue)
        {
            for (var i = 0; i < keys.length; i++)
            {
                if (isNaN(to[keys[i]]))
                {
                    for (var j = 0; j < keys[i].children.length; j++)
                    {
                        start[i][j] = object[keys[i].key][keys[i].children[j]];
                    }
                }
                else
                {
                    start[i] = object[keys[i]];
                }
            }
            time = leftOver;
            if (options.continue !== true)
            {
                options.continue--;
            }
            if (options.onLoop)
            {
                onLoop(object, options);
            }
        }
        else
        {
            if (options.onDone)
            {
                options.onDone(object);
            }
            object = null;
            options = null;
            return true;
        }
    }

    // update loop
    function update(elapsed)
    {
        if (options.pause)
        {
            return;
        }
        if (options.wait)
        {
            options.wait -= elapsed;
            if (options.wait < 0)
            {
                elapsed += options.wait;
                options.wait = false;
            }
            else
            {
                return;
            }
        }
        if (options.cancel)
        {
            if (options.onDone)
            {
                options.onDone(object);
            }
            object = null;
            options = null;
            return true;
        }
        if (options.restart)
        {
            restart();
        }
        if (options.original)
        {
            time = 0;
        }
        if (!first)
        {
            first = true;
            if (options.onFirst)
            {
                options.onFirst(object);
            }
        }
        time += elapsed;
        var leftOver = 0;
        if (time > duration)
        {
            leftOver = time - duration;
            time = duration;
        }
        for (var i = 0; i < keys.length; i++)
        {
            if (isNaN(to[keys[i]]))
            {
                for (var j = 0; j < keys[i].children.length; j++)
                {
                    object[keys[i].key][keys[i].children[j]] = ease(time, start[i][j], delta[i][j], duration);
                }
            }
            else
            {
                object[keys[i]] = ease(time, start[i], delta[i], duration);
            }
        }
        if (options.onEach)
        {
            options.onEach(elapsed, object);
        }
        if (time === duration)
        {
            return end(leftOver);
        }
    }

    options = options || {};
    ease = ease || Easing.none;
    var time, start, delta, keys, first;
    restart();
    Update.add(update);
    return options;
}

function tint(object, tint, duration, options, ease)
{
    object.tint = object.tint || 0xffffff;
    var r = object.tint >> 16;
    var g = object.tint >> 8 & 0x0000ff;
    var b = object.tint & 0x0000ff;
    var colorFrom = {r: r, g: g, b: b};

    r = tint >> 16;
    g = tint >> 8 & 0x0000ff;
    b = tint & 0x0000ff;
    var colorTo = {r: r, g: g, b: b};

    function each(elapsed, current)
    {
        object.tint = current.r << 16 | current.g << 8 | current.b;
    }

    options = options || {};
    options.onEach = each;

    return to(colorFrom, colorTo, duration, options, ease);
}

function shake(object, amount, duration, options, ease)
{
    function each()
    {
        object.x = start.x + Math.floor(Math.random() * amount * 2) - amount;
        object.y = start.y + Math.floor(Math.random() * amount * 2) - amount;
    }

    var start = {x: object.x, y: object.y};

    options = options || {};
    options.onEach = each;

    object.shake = 0;
    return to(object, {shake: 1}, duration, options, ease);
}

// options for animate functions:
//
//    __when finished__
//    repeat: repeat the animation when completed (does not call finished)
//    repeatCount: repeats repeatCount number of times
//    reverse: repeat by reversing to and from
//
//    __misc__
//    renderer: the name of the renderer to set as dirty
//    createOnly: returns an animate structure without adding it to the YY.Update queue
//    randomDuration: [min, max] on repeat, change the duration to a random value between min and max
//    cancel: remove animation if parent === null; checks n = cancel levels of parents
//    noX: for moveTo, don't change X
//    noY: for moveTo, don't change Y
//
//    __callbacks__
//    onEach: a function pointer executed after each update (return true to cancel animatino)
//    onWait: a function pointer executed after each update during a wait
//    onBefore: a function pointer executed before each update
//    onFinished: a function pointer executed when completed
//    onFirst: a function pointer executed on first update
//    onReverse: called during reverse

/*


// zoom a YY.Viewport to (zoomX, zoomY)
viewportZoom: function(viewport, zoomX, zoomY, duration, wait, options, ease) {
    object = makeArray(viewport);
    ease = ease || YY.Easing.none;
    var start = new PIXI.Point(viewport.size.view.x, viewport.size.view.y);
    var delta = new PIXI.Point((zoomX || viewport.screenYtoX(zoomY)) - start.x, (zoomY || viewport.screenXtoY(zoomX)) - start.y);
    return add({call: viewportZoomUpdate, object: object, start: start, delta: delta, time: 0, duration: duration, wait: wait, options: options, ease: ease});
},

viewportMove: function(viewport, x, y, duration, wait, options, ease) {
    object = makeArray(viewport);
    ease = ease || YY.Easing.none;
    var start = new PIXI.Point(viewport.center.x, viewport.center.y);
    var delta = new PIXI.Point(x - start.x, y - start.y);
    return add({call: viewportMoveUpdate, object: object, start: start, delta: delta, time: 0, duration: duration, wait: wait, options: options, ease: ease});
},

movie: function(object, textures, duration, wait, options, ease) {
    object = makeArray(object);
    ease = ease || YY.Easing.none;
    var start = 0;
    var delta = textures.length - 1;
    return add({call: movieUpdate, object: object, start: start, delta: delta, to: delta, time: 0, duration: duration, wait: wait, options: options, ease: ease,
        textures: textures});
},

shake: function(object, amount, duration, wait, options)
{
    object = makeArray(object);
    var start = [];
    for (var i = 0; i < object.length; i++)
    {
        start[i] = new PIXI.Point(object[i].x, object[i].y);
    }
    return add({call: shakeUpdate, object: object, start: start, amount: amount, time: 0, duration: duration, wait: wait, options: options});
},

widthPercentTo: function(object, to, duration, wait, options, ease)
{
    object = makeArray(object);
    ease = ease || YY.Easing.none;
    var start = parseInt(object[0].style.width.substr(0, object[0].style.width.length - 1));
    var delta = to - start;
    return add({call: widthPercentToUpdate, object: object, start: start, delta: delta, to: to, time: 0, duration: duration, wait: wait, options: options, ease: ease});
},

widthTo: function(object, to, duration, wait, options, ease)
{
    object = makeArray(object);
    ease = ease || YY.Easing.none;
    var start = object[0].width;
    var delta = to - start;
    return add({call: widthUpdate, object: object, start: start, delta: delta, to: to, time: 0, duration: duration, wait: wait, options: options, ease: ease});
},

circularPath: function(object, radius, startAngle, endAngle, duration, wait, options, ease)
{
    object = makeArray(object);
    ease = ease || YY.Easing.none;
    var start = startAngle;
    var delta = endAngle - startAngle;
    return add({call: circularPathUpdate, object: object, radius: radius, start: start, delta: delta, to: endAngle, time: 0, duration: duration, wait: wait, options: options, ease: ease});
},

moveToTarget: function(object, to, speed, wait, options)
{
    object = makeArray(object);
    var start = new PIXI.Point(object[0].x, object[0].y);
    return add({call: moveToTargetUpdate, object: object, start: start, to: to, speed: speed, wait: wait, options: options});
},

moveAngle: function(object, angle, speed, duration, wait, options)
{
    object = makeArray(object);
    var start = object[0].position.clone();
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return add({call: moveAngleUpdate, object: object, cos: cos, sin: sin, start: start, duration: duration, time: 0, speed: speed, wait: wait, options: options});
},

////// UPDATE FUNCTIONS //////
//////////////////////////////

moveAngleUpdate: function(elapsed, item, list)
{
    item.time += elapsed;
    if (item.time > item.duration)
    {
        if (item.options.reverse)
        {
            var swap = item.start;
            item.start = item.to;
            item.to = swap;
            if (item.options.repeatCount)
            {
                item.options.repeatCount--;
            }
            else if (!item.options.repeat)
            {
                item.options.reverse = false;
            }
            if (item.options.onreverse)
            {
                item.options.onreverse(elapsed, item, list);
            }
            return false;
        }
        return true;
    }
    var first = list[0];
    first.x += item.speed * item.cos * elapsed;
    first.y += item.speed * item.sin * elapsed;
},

moveToTargetUpdate: function(elapsed, item, list)
{
    var i = 0;
    var first = list[0];
    var angle = YY.Misc.angleTwoPoints(first.position, item.to);
    if (angle !== item.last)
    {
        item.last = angle;
        item.sin = Math.sin(angle);
        item.cos = Math.cos(angle);
    }
    var xBeforeDelta = first.x - item.to.x < 0;
    var yBeforeDelta = first.y - item.to.y < 0;
    first.x += item.cos * item.speed;
    first.y += item.sin * item.speed;
    if (xBeforeDelta !== (first.x - item.to.x < 0))
    {
        first.x = item.to.x;
    }
    if (yBeforeDelta !== (first.y - item.to.y < 0))
    {
        first.y = item.to.y;
    }
    if (first.x === item.to.x && first.y === item.to.y)
    {
        if (item.options.reverse)
        {
            var swap = item.start;
            item.start = item.to;
            item.to = swap;
            if (item.options.repeatCount)
            {
                item.options.repeatCount--;
            }
            else if (!item.options.repeat)
            {
                item.options.reverse = false;
            }
            if (item.options.onreverse)
            {
                item.options.onreverse(elapsed, item, list);
            }
            return false;
        }
        return true;
    }
},

circularPathUpdate: function(elapsed, item, list)
{
    var i;
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        for (i = 0; i < list.length; i++)
        {
            list[i].x = Math.cos(item.to) * item.radius;
            list[i].y = Math.sin(item.to) * item.radius;
        }
        return true;
    }
    var ease = item.ease(item.time, item.start, item.delta, item.duration);
    for (i = 0; i < list.length; i++)
    {
        list[i].x = Math.cos(ease) * item.radius;
        list[i].y = Math.sin(ease) * item.radius;
        item.percent = ease;
    }
    return false;
},

widthPercentToUpdate: function(elapsed, item, list)
{
    var i;
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        for (i = 0; i < list.length; i++)
        {
            list[i].style.width = item.to + '%';
        }
        return true;
    }
    var ease = item.ease(item.time, item.start, item.delta, item.duration);
    for (i = 0; i < list.length; i++)
    {
        list[i].style.width = ease + '%';
    }
    return false;
},

widthUpdate: function(elapsed, item, list)
{
    var i;
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        for (i = 0; i < list.length; i++)
        {
            list[i].width = item.to;
        }
        return true;
    }
    var ease = item.ease(item.time, item.start, item.delta, item.duration);
    for (i = 0; i < list.length; i++)
    {
        list[i].width = ease;
    }
    return false;
},


shakeUpdate: function(elapsed, item, list)
{
    var i;
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        for (i = 0; i < list.length; i++)
        {
            list[i].position.x = item.start[i].x;
            list[i].position.y = item.start[i].y;
            if (item.options.three)
            {
                list[i].position.z = item.start[i].z;
            }
        }
        return true;
    }
    for (i = 0; i < list.length; i++)
    {
        list[i].position.x = item.start[i].x + YY.Random.range(-item.amount, item.amount);
        list[i].position.y = item.start[i].y + YY.Random.range(-item.amount, item.amount);
        if (item.options.three)
        {
            list[i].position.z = item.start[i].z + YY.Random.range(-item.amount, item.amount);
        }
    }
},

movieUpdate: function(elapsed, item, list) {
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        return true;
    }
    else
    {
        var ease = item.ease(item.time, item.start, item.delta, item.duration);
        ease = Math.floor(ease);
        for (var i = 0; i < list.length; i++)
        {
            list[i].texture = item.textures[ease];
        }
    }
},

tintUpdate: function(elapsed, item, list) {
    var i = 0;
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        for (i = 0; i < list.length; i++)
        {
            if (item.options.three)
            {
                list[i].color = list[i].color = new THREE.Color(parseInt(item.color2));
            }
            else
            {
                list[i].tint = item.color2;
            }

        }
        if (item.options.reverse)
        {
            var temp = item.color1;
            item.color1 = item.color2;
            item.color2 = temp;
            if (item.options.repeatCount)
            {
                item.options.repeatCount--;
            }
            else if (!item.options.repeat)
            {
                item.options.reverse = false;
            }
            item.time = 0;
            return false;
        }
        return true;
    }
    else
    {
        var ease = item.ease(item.time, item.start, item.delta, item.duration);
        var tint = YY.Color.blend(ease, item.color1, item.color2);
        for (i = 0; i < list.length; i++)
        {
            if (item.options.three)
            {
                list[i].color = new THREE.Color(parseInt(tint));
            }
            else
            {
                list[i].tint = tint;
            }
        }
    }
},

viewportMoveUpdate: function(elapsed, item, list)
{
    var i;
    item.time += elapsed;
    if (item.time >= item.duration && item.ease !== YY.Easing.decelerate)
    {
        for (i = 0; i < list.length; i++)
        {
            list[i].moveTo(item.start.x + item.delta.x, item.start.y + item.delta.y);
        }
        return true;
    }
    else
    {
        var x, y;
        if (item.ease === YY.Easing.decelerate)
        {
            x = viewport.center.x + elapsed * item.options.velocity.x;
            y = viewport.center.y + elapsed * item.options.velocity.y;
            var originalX = item.options.velocity.x > 0;
            var originalY = item.options.velocity.y > 0;
            item.options.velocity.x += item.options.accelerate.x * elapsed;
            item.options.velocity.y += item.options.accelerate.y * elapsed;
            if ((originalX && item.options.velocity.x < 0) || (!originalX && item.options.velocity.x > 0))
            {
                item.options.accelerate.x = item.options.velocity.x = 0;
            }
            if ((originalY && item.options.velocity.y < 0) || (!originalY && item.options.velocity.y > 0))
            {
                item.options.accelerate.y = item.options.velocity.y = 0;
            }
            if (item.options.velocity.x === 0 && item.options.velocity.y === 0) return true;
        }
        else
        {
            x = item.ease(item.time, item.start.x, item.delta.x, item.duration);
            y = item.ease(item.time, item.start.y, item.delta.y, item.duration);
        }
        for (i = 0; i < list.length; i++)
        {
            list[i].moveTo(x, y);
        }
    }
},

viewportZoomUpdate: function(elapsed, item, object)
{
    var viewport = object[0];
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        viewport.zoomTo(item.start.x + item.delta.x, item.start.y + item.delta.y);
        return true;
    }
    else
    {
        var x = item.ease(item.time, item.start.x, item.delta.x, item.duration);
        var y = item.ease(item.time, item.start.y, item.delta.y, item.duration);
        viewport.zoomTo(x, y);
    }
},

fadeMusicUpdate: function(elapsed, item, list)
{
    var i;
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        for (i = 0; i < list.length; i++)
        {
            list[i].gainNode.gain.value = item.to;
        }
        return true;
    }
    var volume = item.ease(item.time, item.start, item.delta, item.duration);
    for (i = 0; i < list.length; i++)
    {
        list[i].gainNode.gain.value = volume;
    }
    return false;
},

alphaUpdate: function(elapsed, item, list) {
    var i;
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        for (i = 0; i < list.length; i++)
        {
            list[i].alpha = item.to;
        }
        return true;
    }
    var alpha = item.ease(item.time, item.start, item.delta, item.duration);
    for (i = 0; i < list.length; i++)
    {
        list[i].alpha = alpha;
    }
    return false;
},

opacityUpdate: function(elapsed, item, list) {
    var i;
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        for (i = 0; i < list.length; i++)
        {
            list[i].style.opacity = item.to;
        }
        return true;
    }
    var alpha = item.ease(item.time, item.start, item.delta, item.duration);
    for (i = 0; i < list.length; i++)
    {
        list[i].style.opacity = alpha;
    }
    return false;
},

scaleUpdate: function(elapsed, item, list)
{
    var i;
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        for (i = 0; i < list.length; i++)
        {
            if (item.options.xOnly)
            {
                list[i].scale.x = item.to;
            }
            else if (item.options.yOnly)
            {
                list[i].scale.y = item.to;
            }
            else if (isNaN(item.to))
            {
                list[i].scale.x = item.to.x;
                list[i].scale.y = item.to.y;
            }
            else
            {
                list[i].scale.x = list[i].scale.y = item.to;
            }
        }
        return true;
    }
    else
    {
        var scale;
        if (isNaN(item.to))
        {
            scale = {x: item.ease(item.time, item.start.x, item.delta.x, item.duration), y: item.ease(item.time, item.start.y, item.delta.y, item.duration)};
        }
        else
        {
            scale = item.ease(item.time, item.start, item.delta, item.duration);
        }
        for (i = 0; i < list.length; i++)
        {
            if (item.options.xOnly)
            {
                list[i].scale.x = scale;
            }
            else if (item.options.yOnly)
            {
                list[i].scale.y = scale;
            }
            else if (isNaN(item.to))
            {
                list[i].scale.x = scale.x;
                list[i].scale.y = scale.y;
            }
            else
            {
                list[i].scale.x = list[i].scale.y = scale;
            }
        }
    }
    return false;
},

rotationUpdate: function(elapsed, item, list)
{
    var i;
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        for (i = 0; i < list.length; i++)
        {
            list[i].rotation = item.to;
        }
        return true;
    }
    else
    {
        var rotation = item.ease(item.time, item.start, item.delta, item.duration);
        for (i = 0; i < list.length; i++)
        {
            list[i].rotation = rotation;
        }
    }
    return false;
}

rotationUpdate3: function(elapsed, item, list)
{
    var i;
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        for (i = 0; i < list.length; i++)
        {
            list[i].rotation.x = item.to.x;
            list[i].rotation.y = item.to.y;
            list[i].rotation.z = item.to.z;
        }
        return true;
    }
    else
    {
        var x = item.ease(item.time, item.start.x, item.delta.x, item.duration);
        var y = item.ease(item.time, item.start.y, item.delta.y, item.duration);
        var z = item.ease(item.time, item.start.z, item.delta.z, item.duration);
        for (i = 0; i < list.length; i++)
        {
            list[i].rotation.set(x, y, z);
        }
    }
    return false;
}

rotationDirectionUpdate: function(elapsed, item, list)
{
    var i;
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        for (i = 0; i < list.length; i++)
        {
            list[i].rotation = item.to;
        }
        return true;
    }
    else
    {
        var rotation = item.ease(item.time, item.start, item.delta, item.duration);
        for (i = 0; i < list.length; i++)
        {
            list[i].rotation = rotation;
        }
    }
}

moveUpdate: function(elapsed, item, list)
{
    var i = 0;
    item.time += elapsed;
    if (item.time >= item.duration)
    {
        for (i = 0; i < list.length; i++)
        {
            if (item.options.dom)
            {
                list[i].style.left = item.start.x + item.delta.x + 'px';
                if (!item.options.noY)
                {
                    list[i].style.top = item.start.y + item.delta.y + 'px';
                }
            }
            else
            {
                if (item.options.three)
                {
                    list[i].position.x = item.start.x + item.delta.x;
                    list[i].position.y = item.start.y + item.delta.y;
                    list[i].position.z = item.start.z + item.delta.z;
                }
                else
                {
                    if (!item.options.noX)
                    {
                        list[i].x = item.start.x + item.delta.x;
                    }
                    if (!item.options.noY)
                    {
                        list[i].y = item.start.y + item.delta.y;
                    }
                }
            }
        }
        if (item.options.reverse)
        {
            item.time = 0;
            var swap = item.start;
            item.start = item.to;
            item.to = swap;
            if (!item.options.noX)
            {
                item.delta.x = item.to.x - item.start.x;
            }
            if (!item.options.noY)
            {
                item.delta.y = item.to.y - item.start.y;
            }
            if (item.options.three)
            {
                item.delta.z = item.to.z - item.start.z;
            }
            if (item.options.repeatCount)
            {
                item.options.repeatCount--;
            }
            else if (!item.options.repeat)
            {
                item.options.reverse = false;
            }
            if (item.options.onreverse)
            {
                item.options.onreverse(elapsed, item, list);
            }
            return false;
        }
        return true;
    }
    else
    {
        if (!item.options.noX)
        {
            var x = item.ease(item.time, item.start.x, item.delta.x, item.duration);
        }
        var y, z;
        if (!item.options.noY)
        {
            y = item.ease(item.time, item.start.y, item.delta.y, item.duration);
        }
        if (item.options.three)
        {
            z = item.ease(item.time, item.start.z, item.delta.z, item.duration);
        }
        for (i = 0; i < list.length; i++)
        {
            if (item.options.three)
            {
                list[i].position.x = x;
                list[i].position.y = y;
                list[i].position.z = z;
            }
            else
            {
                if (item.options.dom)
                {
                    list[i].style.left = x + 'px';
                    if (!item.options.noY)
                    {
                        list[i].style.top = y + 'px';
                    }
                }
                else
                {
                    if (!item.options.noX)
                    {
                        list[i].x = x;
                    }
                    if (!item.options.noY)
                    {
                        list[i].y = y;
                    }
                }
            }
        }
    }
},

// adds an animate object to the list to be animated
add: function(animate)
{
    animate.options = animate.options || {};
    animate.ease = animate.ease || YY.Easing.none;
    if (!animate.options.createOnly)
    {
        list.push(animate);
    }
    return animate;
}
*/
function update(elapsed)
{
    if (removeQueue.length)
    {
        removeQueueItems();
    }

    // debug counter for number of animations
    var animating = 0;

    for (i = 0; i < list.length; i++)
    {
        var item = list[i];
        if (item.pause)
        {
            continue;
        }
        animating++;

        // calculated elapsed used if a wait has just completed
        var itemElapsed = elapsed;
        if (item.wait && item.waitElapsed !== -1)
        {
            item.waitElapsed = item.waitElapsed || 0;
            item.waitElapsed += elapsed;
            if (item.waitElapsed >= item.wait)
            {
                itemElapsed = (item.waitElapsed - item.wait);
                item.waitElapsed = -1;
            }
            else
            {
                if (item.options.waitEach)
                {
                    item.options.waitEach(elapsed, item.object, item);
                }
                continue;
            }
        }
        if (item.options.before)
        {
            item.options.before(itemElapsed, item.object, item);
        }
        var result = item.call(itemElapsed, item, item.object);
        if (item.options.first && !item.first)
        {
            item.options.first(itemElapsed, item.object, item);
            item.first = true;
        }
        if (item.options.each)
        {
            result = result || item.options.each(itemElapsed, item.object, item);
        }
        if (result)
        {
            if (item.options.reverse)
            {
                item.time = 0;
                var swap = item.start;
                item.start = item.to;
                item.to = swap;
                if (item.options.randomDuration)
                {
                    item.duration = YY.Random.range(item.options.randomDuration[0], item.options.randomDuration[1]);
                }
                if (isNaN(item.delta))
                {
                    for (var prop in item.delta)
                    {
                        item.delta[prop] = -item.delta[prop];
                    }
                }
                else
                {
                    item.delta = -item.delta;
                }
                if (item.options.repeatCount)
                {
                    item.options.repeatCount--;
                }
                else if (!item.options.repeat)
                {
                    item.options.reverse = false;
                }
            }
            else if (item.options.repeat)
            {
                item.time = 0;
                if (item.options.randomDuration)
                {
                    item.duration = YY.Random.range(item.options.randomDuration[0], item.options.randomDuration[1]);
                }
            }
            else if (item.options.repeatCount)
            {
                item.time = 0;
                item.options.repeatCount--;
                if (item.options.randomDuration)
                {
                    item.duration = YY.Random.range(item.options.randomDuration[0], item.options.randomDuration[1]);                    }
            }
            else
            {
                if (item.options.finished)
                {
                    item.options.finished(itemElapsed, item.object, item);
                }
                item.pause = true;
                remove(item);
            }
        }
        if (item.options.cancel)
        {
            var amount = item.options.cancel === true ? 1 : item.options.cancel;
            for (var j = 0; j < item.object.length; j++)
            {
                var parent = item.object[j];
                for (var k = 0; k < amount; k++)
                {
                    parent = parent.parent;
                    if (parent === null)
                    {
                        remove(item);
                        break;
                    }
                }
            }
        }
        if (item.options.renderer)
        {
            item.options.renderer.dirty = true;
        }
    }
    if (Debug && animating !== debugLast)
    {
        debugOne(animating + ' animations', {panel: panel});
        debugLast = animating;
    }
}

// exports
var Animate = {
    to: to,
    tint: tint,
    shake: shake
};

// add support for AMD (Asynchronous Module Definition) libraries such as require.js.
if (typeof define === 'function' && define.amd)
{
    define(function()
    {
        return {
            Animate: Animate
        };
    });
}

// add support for CommonJS libraries such as browserify.
if (typeof exports !== 'undefined')
{
    exports.Animate = Animate;
}

// define globally in case AMD is not available or available but not used
if (typeof window !== 'undefined')
{
    window.Animate = Animate;
} })();