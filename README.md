## animate.js
yet another javascript animation library (designed specifically for games and PIXI.js)

## Live Example
https://davidfig.github.io/animate/

## Installation

    npm install yy-animate

# API Reference
## Classes

<dl>
<dt><a href="#Angle">Angle</a></dt>
<dd><p>animate object&#39;s {x, y} using an angle</p>
</dd>
<dt><a href="#Face">Face</a></dt>
<dd><p>Rotates an object to face the target</p>
</dd>
<dt><a href="#Shake">Shake</a></dt>
<dd><p>shakes an object or list of objects</p>
</dd>
<dt><a href="#Target">Target</a></dt>
<dd><p>move an object to a target&#39;s location</p>
</dd>
<dt><a href="#Tint">Tint</a></dt>
<dd><p>changes the tint of an object</p>
</dd>
<dt><a href="#To">To</a></dt>
<dd><p>animate any numeric parameter of an object or array of objects</p>
</dd>
<dt><a href="#Wait">Wait</a></dt>
<dd><p>base class for all animations</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#init">init([options])</a></dt>
<dd><p>used to initialize update call</p>
</dd>
<dt><a href="#remove">remove(animate)</a></dt>
<dd><p>remove an animation</p>
</dd>
<dt><a href="#update">update(elapsed)</a></dt>
<dd><p>update function (can be called manually or called internally by <a href="#init">init</a>)</p>
</dd>
<dt><a href="#load">load(object(s), load, [options])</a></dt>
<dd><p>restart an animation from a saved state</p>
</dd>
</dl>

<a name="Angle"></a>

## Angle
animate object's {x, y} using an angle

**Kind**: global class  
<a name="new_Angle_new"></a>

### new Angle(object, angle, speed, [duration], [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| object | <code>object</code> |  | to animate |
| angle | <code>number</code> |  | in radians |
| speed | <code>number</code> |  | in pixels/millisecond |
| [duration] | <code>number</code> | <code>0</code> | in milliseconds; if 0, then continues forever |
| [options] | <code>object</code> |  | @see [Wait](#Wait) |

<a name="Face"></a>

## Face
Rotates an object to face the target

**Kind**: global class  
<a name="new_Face_new"></a>

### new Face(object, target, speed, [options])

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> |  |
| target | <code>Point</code> |  |
| speed | <code>number</code> | in radians/millisecond |
| [options] | <code>object</code> | @see [Wait](#Wait) |
| [options.keepAlive] | <code>boolean</code> | don't stop animation when complete |

<a name="Shake"></a>

## Shake
shakes an object or list of objects

**Kind**: global class  
<a name="new_Shake_new"></a>

### new Shake(object, amount, duration, options)

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> &#124; <code>array</code> | or list of objects to shake |
| amount | <code>number</code> | to shake |
| duration | <code>number</code> | (in milliseconds) to shake |
| options | <code>object</code> | (see Animate.wait) |

<a name="Target"></a>

## Target
move an object to a target's location

**Kind**: global class  
<a name="new_Target_new"></a>

### new Target(object, target, speed, [options])
move to a target


| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | object to animate |
| target | <code>object</code> | object needs to contain {x: x, y: y} |
| speed | <code>number</code> | number of pixels to move per millisecond |
| [options] | <code>object</code> | @see [Wait](#Wait) |
| [options.keepAlive] | <code>boolean</code> | don't cancel the animation when target is reached |

<a name="Tint"></a>

## Tint
changes the tint of an object

**Kind**: global class  
<a name="new_Tint_new"></a>

### new Tint(object, tint, [duration], [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| object | <code>PIXI.DisplayObject</code> |  |  |
| tint | <code>number</code> |  |  |
| [duration] | <code>number</code> | <code>0</code> | in milliseconds, if 0, repeat forever |
| [options] | <code>object</code> |  | @see [Wait](#Wait) |

<a name="To"></a>

## To
animate any numeric parameter of an object or array of objects

**Kind**: global class  
**Examples**: // animate sprite to (20, 20) over 1s using easeInOuTsine, and then reverse the animation
new Animate.to(sprite, {x: 20, y: 20}, 1000, {reverse: true, ease: Easing.easeInOutSine});

// animate list of sprites to a scale over 10s after waiting 1s
new Animate.to([sprite1, sprite2, sprite3], {scale: {x: 0.25, y: 0.25}}, 10000, {wait: 1000});  
<a name="new_To_new"></a>

### new To(object, goto, [duration], [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| object | <code>object</code> |  | to animate |
| goto | <code>object</code> |  | parameters to animate, e.g.: {alpha: 5, scale: {x, 5} rotation: Math.PI} |
| [duration] | <code>number</code> | <code>0</code> | time to run (use 0 for infinite duration--should only be used with customized easing functions) |
| [options] | <code>object</code> |  |  |
| [options.wait] | <code>number</code> | <code>0</code> | n milliseconds before starting animation (can also be used to pause animation for a length of time) |
| [options.pause] | <code>boolean</code> |  | start the animation paused |
| [options.repeat] | <code>boolean</code> &#124; <code>number</code> |  | true: repeat animation forever; n: repeat animation n times |
| [options.reverse] | <code>boolean</code> &#124; <code>number</code> |  | true: reverse animation (if combined with repeat, then pulse); n: reverse animation n times |
| [options.continue] | <code>boolean</code> &#124; <code>number</code> |  | true: continue animation with new starting values; n: continue animation n times |
| [options.load] | <code>function</code> |  | loads an animation using an .save() object; note the * parameters below cannot be loaded and must be re-set |
| [options.ease] | <code>function</code> |  | function from easing.js (see http://easings.net for examples)* |
| [options.renderer] | <code>Renderer</code> |  | sets Renderer.dirty for each loop* |
| [options.onDone] | <code>function</code> |  | function pointer for when the animation expires* |
| [options.onCancel] | <code>function</code> |  | function pointer called after cancelled* |
| [options.onWait] | <code>function</code> |  | function pointer for wait* |
| [options.onFirst] | <code>function</code> |  | function pointer for first time update is called (does not include pause or wait time)* |
| [options.onEach] | <code>function</code> |  | function pointer called after each update* |
| [options.onLoop] | <code>function</code> |  | function pointer called after a revere, repeat, or continue* |

<a name="Wait"></a>

## Wait
base class for all animations

**Kind**: global class  
<a name="new_Wait_new"></a>

### new Wait(object, [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| object | <code>object</code> |  | to animate |
| [options] | <code>object</code> |  |  |
| [options.wait] | <code>number</code> | <code>0</code> | n milliseconds before starting animation (can also be used to pause animation for a length of time) |
| [options.pause] | <code>boolean</code> |  | start the animation paused |
| [options.repeat] | <code>boolean</code> &#124; <code>number</code> |  | true: repeat animation forever; n: repeat animation n times |
| [options.reverse] | <code>boolean</code> &#124; <code>number</code> |  | true: reverse animation (if combined with repeat, then pulse); n: reverse animation n times |
| [options.continue] | <code>boolean</code> &#124; <code>number</code> |  | true: continue animation with new starting values; n: continue animation n times |
| [options.load] | <code>function</code> |  | loads an animation using an .save() object; note the * parameters below cannot be loaded and must be re-set |
| [options.ease] | <code>function</code> |  | function from easing.js (see http://easings.net for examples)* |
| [options.renderer] | <code>Renderer</code> |  | sets Renderer.dirty for each loop* |
| [options.onDone] | <code>function</code> |  | function pointer for when the animation expires* |
| [options.onCancel] | <code>function</code> |  | function pointer called after cancelled* |
| [options.onWait] | <code>function</code> |  | function pointer for wait* |
| [options.onFirst] | <code>function</code> |  | function pointer for first time update is called (does not include pause or wait time)* |
| [options.onEach] | <code>function</code> |  | function pointer called after each update* |
| [options.onLoop] | <code>function</code> |  | function pointer called after a revere, repeat, or continue* |

<a name="init"></a>

## init([options])
used to initialize update call

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> |  |
| [options.update] | <code>boolean</code> | Update from [https://github.com/davidfig/update](https://github.com/davidfig/update), if not defined, update needs to be called manually |
| [options.debug] | <code>boolean</code> | include debug options when calling update |

<a name="remove"></a>

## remove(animate)
remove an animation

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| animate | <code>object</code> &#124; <code>array</code> | the animation (or array of animations) to remove |

<a name="update"></a>

## update(elapsed)
update function (can be called manually or called internally by [init](#init))

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| elapsed | <code>number</code> | since last update |

<a name="load"></a>

## load(object(s), load, [options])
restart an animation from a saved state

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| object(s) | <code>object</code> | to animate (cannot be saved) |
| load | <code>object</code> | object from .save() |
| [options] | <code>object</code> | include any additional options that cannot be saved (e.g., onDone function pointer) |


* * *

Copyright (c) 2016 YOPEY YOPEY LLC - MIT License - Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown)