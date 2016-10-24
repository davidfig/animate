const PIXI = require('pixi.js');
const Debug = require('yy-debug');
const Update = require('yy-update');
const Renderer = require('yy-renderer');
const Easing = require('penner');
const Animate = require('../animate/animate.js');

// for local testing
// const Animate = require('../animate/animate.js');

// initialize Debug and Update -- this is only needed for the debug panels on the bottom right
Debug.init();
Update.init({debug: Debug, FPS: true, percent: true});

// intialize update loop for Animate with optional debug info
Animate.init({update: Update, debug: Debug});

// set up pixi and shapes
var renderer, red, green, blue, shaker, theDots = [], pacman;
pixi();

// red triangle fades, moves, and scales; repeats and reverses forever
// NOTE: the "renderer: renderer" option marks the renderer as dirty each update to ensure the page is redrawn
new Animate.to(red, {alpha: 0.1, x: 500, y: 500, scale: {x: 5, y: 5}}, 1000,
    {repeat: true, reverse: true, renderer: renderer, ease: Easing.easeInOutSine});

// green triangle moves, rotates, and fades when done
new Animate.to(green, {x: 50, y: 400, rotation: 2 * Math.PI}, 2500,
    {reverse: true, onDone: function (object) { new Animate.to(object, {alpha: 0}, 2000); }, ease: Easing.easeInSine});

// blue triangle spins forever
new Animate.to(blue, {rotation: -2 * Math.PI}, 1000, {continue: true});

// circle changes from blue to red and reverse and repeats
new Animate.tint(shaker, 0xff0000, 2000, {repeat: true, reverse: true});

// circle shakes forever, it starts after 1 second (also testing array of objects)
new Animate.shake([shaker], 5, 0, {wait: 1000});

// animate a group that is not a container
new Animate.to(theDots, {alpha: 0.1, scale: {x: 2, y: 2}}, 2000, {repeat: true, reverse: true, ease: Easing.easeInOutSine});

// pacman mouth animation
new Animate.to(pacman, {angle: 0.01}, 250, {onEach:
    function()
    {
        pacman.clear()
            .moveTo(Math.cos(pacman.angle) * pacman.radius / 2, Math.sin(pacman.angle) * pacman.radius / 2)
            .lineStyle(pacman.radius, 0xffff00)
            .arc(0, 0, pacman.radius / 2, Math.PI * pacman.angle, Math.PI * -pacman.angle, false);
    }, repeat: true, reverse: true});

var count = 0;
new Animate.to(null, null, 1000, {repeat: true, onLoop:
    function()
    {
        Debug.one('This should change every 1s (' + count++ + ')');
    }});

let rotate;
// pacman walking animation
function nextTarget()
{
    let target = {x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight};

    // rotate pacman around the short way to the target
    Animate.remove(rotate);
    rotate = new Animate.face(pacman, target, 0.01, {ease: Easing.easeInOutSine});
    return target;
}

let target = nextTarget();
let walking = new Animate.target(pacman, target, 0.15, {keepAlive: true, onDone:
    function()
    {
        walking.target = nextTarget();
    }
});

// pointer facing pacman
var facing = pointer(100, 0x00ffff);
facing.position.set(600, 400);
new Animate.face(facing, pacman, 0.00075, {keepAlive: true});

// angle movement
var circleAngle = renderer.add(PIXI.Sprite.fromImage('circle.png'));
circleAngle.anchor.set(0.5);
circleAngle.tint = 0xff00ff;
circleAngle.width = circleAngle.height = 50;
circleAngle.position.set(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
var angleAnimate = new Animate.angle(circleAngle, Math.random(), 0.1, 0, {onEach:
    function()
    {
        if (circleAngle.x > window.innerWidth || circleAngle.x < 0 || circleAngle.y > window.innerHeight || circleAngle.y < 0)
        {
            circleAngle.position.set(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
            angleAnimate.angle = Math.random() * Math.PI * 2;
        }
    }});

Update.update();

function pixi()
{
    renderer = new Renderer({update: Update, debug: Debug, transparent: true, styles: {resize: true, background: green, pointerEvents: 'none'}});
    red = triangle(100, 0xff0000);
    red.position.set(50, 50);
    green = triangle(50, 0x00ff00);
    green.position.set(300,300);
    blue = triangle(50, 0x0000ff);
    blue.position.set(500,100);
    shaker = PIXI.Sprite.fromImage('circle.png');
    renderer.addChild(shaker);
    shaker.tint = 0x0000ff;
    shaker.position.set(200, 200);
    dots(800, 250, 150, 10);
    pacmanCreate(100, 100, 100, 100);
}

function triangle(size, color)
{
    var half = size / 2;
    var g = renderer.add(new PIXI.Graphics());
    g.beginFill(color);
    g.moveTo(0, -half);
    g.lineTo(-half, half);
    g.lineTo(half, half);
    g.closePath();
    g.endFill();
    return g;
}

function pointer(size, color)
{
    var g = new PIXI.Graphics();
    renderer.addChild(g);
    g.beginFill(color);
    g.drawCircle(0, 0, size / 2);
    g.endFill();
    g.lineStyle(10, color);
    g.moveTo(0, 0);
    g.lineTo(size, 0);
    g.closePath();
    g.rotation = -Math.PI;
    return g;
}

function dots(x, y, distance)
{
    for (let i = 0; i < 100; i++)
    {
        let sprite = PIXI.Sprite.fromImage('circle.png');
        sprite.anchor.set(0.5);
        sprite.alpha = 0.5;
        sprite.tint = 0xff00ff;
        renderer.addChild(sprite);
        theDots.push(sprite);
        const angle = Math.random() * 2 * Math.PI;
        const dist = Math.random() * distance;
        sprite.x = x + Math.cos(angle) * dist;
        sprite.y = y + Math.sin(angle) * dist;
    }
}

function pacmanCreate(x, y, size)
{
    pacman = renderer.addChild(new PIXI.Graphics());
    pacman.position.set(x, y);
    pacman.radius = size / 2;
    pacman.angle = 0.3;
}

// for eslint
/* global window */