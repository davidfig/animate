## animate.js
a configurable javascript animation library; designed for use with https://github.com/pixijs/pixi.js, https://github.com/davidfig/update/, and https://github.com/davidfig/debug/

## Code Example

        // initialize Debug and Update -- this is only needed for the debug panels on the bottom right
        Debug.init();
        Update.init();

        // set up pixi and shapes
        var renderer, stage, red, green, blue, sprite;
        pixi();

        // red triangle fades, moves, and scales; repeats and reverses forever
        Animate.to(red, {alpha: 0.1, x: 500, y: 500, scale: {x: 5, y: 5}}, 1000,
            {repeat: true, reverse: true}, Easing.easeInOutSine);

        // green triangle moves, rotates, and fades when done
        Animate.to(green, {x: 50, y: 400, rotation: 2 * Math.PI}, 2500,
            {reverse: true, onDone: function (object) { Animate.to(object, {alpha: 0}, 2000); }}, Easing.easeInSine);

        // blue triangle spins forever
        Animate.to(blue, {rotation: -2 * Math.PI}, 1000, {continue: true});

        // circle changes from blue to red and reverse and repeats
        Animate.tint(sprite, 0xff0000, 2000, {repeat: true, reverse: true});

        // circle also shakes forever, it starts after 1 second
        Animate.shake(sprite, 5, 0, {repeat: true, wait: 1000});

        // render loop
        function update()
        {
            renderer.render(stage);
        }
        Update.add(update, null, {percent: 'Render'});
        Update.update();

        function pixi()
        {
            renderer = new PIXI.WebGLRenderer(1000, 1000, {transparent: true});
            document.body.appendChild(this.renderer.view);
            stage = new PIXI.Container();
            red = triangle(100, 0xff0000);
            red.position.set(50, 50);
            green = triangle(50, 0x00ff00);
            green.position.set(300,300);
            blue = triangle(50, 0x0000ff);
            blue.position.set(500,100);
            sprite = PIXI.Sprite.fromImage('circle.png');
            stage.addChild(sprite);
            sprite.tint = 0x0000ff;
            sprite.position.set(200, 200);
        }

        function triangle(size, color)
        {
            var half = size / 2;
            var g = new PIXI.Graphics();
            stage.addChild(g);
            g.beginFill(color);
            g.moveTo(0, -half);
            g.lineTo(-half, half);
            g.lineTo(half, half);
            g.closePath();
            g.endFill();
            return g;
        }

## Live Example
https://davidfig.github.io/animate/

## Installation
include animate.js in your project or add to your workflow

    <script src="animate.js"></script>

## API Reference

### Animate.to(object, to, duration, options, ease)
* animate any numeric parameter
* object - object to animate
* to - parameters to animate, e.g.: {alpha: 5, scale: {x, 5}, rotation: Math.PI}
* ease - easing function from easing.js (see http://easings.net for examples)
* options {}

  - wait - wait n MS before starting animation (can also be used to pause animation for a length of time)

  __change active animation__ (assigned through returned options from to())
  - pause - pause animation
  - cancel - cancel animation
  - restart - restart animation with current starting values
  - original - restart animation with original starting values

  __when animation expires__
  - repeat - true = repeat animation forever; n = repeat animation n times
  - reverse - true = reverse animation (if combined with repeat, then pulse); n = reverse animation n times
  - continue - true = continue animation with new starting values; n = continue animation n times

  __callbacks__
  - onDone - function pointer for when the animation expires or is cancelled
  - onFirst - function pointer for first time update is called (does not include pause or wait time)
  - onEach - function pointer called after each update
  - onLoop - function pointer called after a revere, repeat, or continue
  - onReverse - function pointer called after a reverse
  - onRepeat - function pointer called after a repeat

### Animate.tint(object, tint, duration, options, ease)
tints a pixi.js sprite
* object - object to be tinted
* tint - the desired tint, e.g., 0xffffff is white, 0xff0000 is red
* options - same as Animate.to()

### shake(object, amount, duration, options, ease)
shake a pixi.js object
* object - object to be shaken
* amount - number of pixels to move
* options - same as Animate.to()

## License
MIT License (MIT)