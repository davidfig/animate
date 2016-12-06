const PIXI = require('pixi.js');
const Debug = require('yy-debug');
const Update = require('yy-update');
const Renderer = require('yy-renderer');
const Animate = require('../animate/animate.js');

// initialize Debug and Update -- this is only needed for the debug panels on the bottom right
Debug.init();
Update.init({debug: Debug, FPS: true, percent: true});

// intialize update loop for Animate with optional debug info
Animate.init({update: Update, debug: Debug, Debug: Debug, count: true});

// set up pixi and shapes
let renderer, red, green, blue, shaker, pacman;
const theDots = [], animates = [];
pixi();

// red triangle fades, moves, and scales; repeats and reverses forever
animates[0] = new Animate.to(red, {alpha: 0.1, x: 500, y: 500, scale: {x: 5, y: 5}}, 1000,
    {repeat: true, reverse: true, ease: 'easeInOutSine'});

// green triangle moves, rotates, and fades when done
new Animate.to(green, {x: 50, y: 400, rotation: 2 * Math.PI}, 2500,
    {reverse: true, onDone: function (object) { new Animate.to(object, {alpha: 0}, 2000); }, ease: 'easeInSine'});

// blue triangle spins forever
animates[1] = new Animate.to(blue, {rotation: -2 * Math.PI}, 1000, {continue: true});

// circle changes from blue to red and reverse and repeats
animates[2] = new Animate.tint(shaker, 0xff0000, 2000, {repeat: true, reverse: true});

// circle shakes forever, it starts after 1 second (also testing array of objects)
animates[3] = new Animate.shake([shaker], 5, 0, {wait: 1000});

// animate a group that is not a container
animates[4] = new Animate.to(theDots, {alpha: 0.1, scale: {x: 2, y: 2}}, 2000, {repeat: true, reverse: true, ease: 'easeInOutSine'});

function pacmanEach()
{
    pacman.clear()
        .moveTo(Math.cos(pacman.angle) * pacman.radius / 2, Math.sin(pacman.angle) * pacman.radius / 2)
        .lineStyle(pacman.radius, 0xffff00)
        .arc(0, 0, pacman.radius / 2, Math.PI * pacman.angle, Math.PI * -pacman.angle, false);
}

// pacman mouth animation
new Animate.to(pacman, {angle: 0.01}, 250, {onEach: pacmanEach, repeat: true, reverse: true});

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
    rotate = new Animate.face(pacman, target, 0.01);
    return target;
}


function onDoneTarget()
{
    target = nextTarget();
    animates[7].target = target;
}
let target = nextTarget();
animates[7] = new Animate.target(pacman, target, 0.15, {keepAlive: true, onDone: onDoneTarget});

// pointer facing pacman
var facing = pointer(100, 0x00ffff);
facing.position.set(600, 400);
animates[6] = new Animate.face(facing, pacman, 0.00075, {keepAlive: true});

// angle movement
function onEachAngle()
{
    if (circleAngle.x > window.innerWidth || circleAngle.x < 0 || circleAngle.y > window.innerHeight || circleAngle.y < 0)
    {
        circleAngle.position.set(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        animates[5].angle = Math.random() * Math.PI * 2;
    }
}

var circleAngle = renderer.add(PIXI.Sprite.fromImage('circle.png'));
circleAngle.anchor.set(0.5);
circleAngle.tint = 0xff00ff;
circleAngle.width = circleAngle.height = 50;
circleAngle.position.set(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
animates[5] = new Animate.angle(circleAngle, Math.random(), 0.1, 0, {onEach: onEachAngle});

var faces = [];
for (var i = 1; i <= 7; i++)
{
    faces.push(PIXI.Texture.fromImage('/faces/happy-' + i + '.png'));
}
var smile = new PIXI.Sprite(faces[0]);
smile.position.set(550, 50);
renderer.addChild(smile);
new Animate.movie(smile, faces, 1500, {repeat: true, reverse: true});

Update.update();

function pixi()
{
    renderer = new Renderer({update: Update, debug: Debug, transparent: true, alwaysRender: true, styles: {resize: true, background: green, pointerEvents: 'none'}});
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

// add a debug panel for instructions
function instructions()
{
    function a(n)
    {
        return animates[n] ? '<span style="background: rgba(0,255,0,0.25)">save and cancel </span>' : '<span style="background: rgba(255,0,0,0.25)">load and resume </span>';
    }
    let s = '';
    s += 'Press 1 to ' + a(0) + 'red triangle animation (.to)<br>';
    s += 'Press 2 to ' + a(1) + 'blue triangle animation (.to)<br>';
    s += 'Press 3 to ' + a(2) + 'red-to-blue circle animation (.tint)<br>';
    s += 'Press 4 to ' + a(3) + 'shaking circle animation (.to)<br>';
    s += 'Press 5 to ' + a(4) + 'lots of pink dots animation (.to with array)<br>';
    s += 'Press 6 to ' + a(5) + 'pink circle animation (.angle)<br>';
    s += 'Press 7 to ' + a(6) + 'pointer animation (.face)<br>';
    s += 'Press 8 to ' + a(7) + 'pacman animation (.target)';

    Debug.one(s, {panel: saveload});
}
const saveload = Debug.add('saveload', {side: 'leftbottom'});

instructions();
Debug.resize();

const save = [];

document.body.addEventListener('keypress',
    function(e)
    {
        const code = (typeof e.which === 'number') ? e.which : e.keyCode;
        if (code >= 49 && code < 49 + animates.length)
        {
            const i = code - 49;
            if (animates[i])
            {
                save[i] = animates[i].save();
                Animate.remove(animates[i]);
                animates[i] = null;
            }
            else
            {
                switch (i)
                {
                case 0:
                    animates[i] = Animate.load(red, save[i]);
                    break;
                case 1:
                    animates[i] = Animate.load(blue, save[i]);
                    break;
                case 2:
                    animates[i] = Animate.load(shaker, save[i]);
                    break;
                case 3:
                    animates[i] = Animate.load([shaker], save[i]);
                    break;
                case 4:
                    animates[i] = Animate.load(theDots, save[i]);
                    break;
                case 5:
                    animates[i] = Animate.load(circleAngle, save[i], {onEach: onEachAngle});
                    break;
                case 6:
                    animates[i] = Animate.load([facing, pacman], save[i]);
                    break;
                case 7:
                    animates[i] = Animate.load([pacman, target], save[i], {onDone: onDoneTarget});
                    break;
                }
            }
            instructions();
        }
        else Debug.log(code, {panel: saveload});
    }
);

// for eslint
/* global window, document */