import 'normalize.css'
import './style.scss'

import { gsap } from 'gsap'

let width, height, app, canvas, ctx, triangles, target, animateApp = true;
const colors = [
  '221, 110, 66',
  '232, 218, 178',
  '79, 109, 122',
  '192, 214, 223'
];

// Main
initHeader();
addListeners();
initAnimation();

function initHeader() {
  width = window.innerWidth;
  height = window.innerHeight;
  target = {
    x: 0,
    y: height
  };

  app = document.getElementById('app');
  app.style.height = height + 'px';

  canvas = document.getElementById('canvas');
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext('2d');

  // create particles
  triangles = [];
  for (var x = 0; x < 480; x++) {
    addTriangle(x * 10);
  }
}

function addTriangle(delay) {
  setTimeout(() => {
    var t = new Triangle();
    triangles.push(t);
    tweenTriangle(t);
  }, delay);
}

function initAnimation() {
  animate();
}

function tweenTriangle(tri) {
  var t = Math.random() * (2 * Math.PI);
  var x = (200 + Math.random() * 100) * Math.cos(t) + width * 0.5;
  var y = (200 + Math.random() * 100) * Math.sin(t) + height * 0.5 - 20;
  var time = 4 + 3 * Math.random();

  gsap.to(tri.pos, time, {
    x: x,
    y: y,
    ease: 'Circ.easeOut',
    onComplete: () =>  {
      tri.init();
      tweenTriangle(tri);
    }
  });
}

// Event handling
function addListeners() {
  window.addEventListener('scroll', scrollCheck);
  window.addEventListener('resize', resize);
}

function scrollCheck() {
  if (document.body.scrollTop > height) animateApp = false;
  else animateApp = true;
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  app.style.height = height + 'px';
  canvas.width = width;
  canvas.height = height;
}

function animate() {
  if (animateApp) {
    ctx.clearRect(0, 0, width, height);
    for (var i in triangles) {
      triangles[i].draw();
    }
  }
  requestAnimationFrame(animate);
}

// Canvas manipulation
function Triangle() {
  var _this = this;

  // constructor
  (function () {
    _this.coords = [{}, {}, {}];
    _this.pos = {};
    init();
  })();

  function init() {
    _this.pos.x = width * 0.5;
    _this.pos.y = height * 0.5 - 20;
    _this.coords[0].x = -10 + Math.random() * 40;
    _this.coords[0].y = -10 + Math.random() * 40;
    _this.coords[1].x = -10 + Math.random() * 40;
    _this.coords[1].y = -10 + Math.random() * 40;
    _this.coords[2].x = -10 + Math.random() * 40;
    _this.coords[2].y = -10 + Math.random() * 40;
    _this.scale = 0.1 + Math.random() * 0.3;
    _this.color = colors[Math.floor(Math.random() * colors.length)];
    setTimeout(function () {
      _this.alpha = 0.8;
    }, 10);
  }

  this.draw = function () {
    if (_this.alpha >= 0.005) _this.alpha -= 0.005;
    else _this.alpha = 0;
    ctx.beginPath();
    ctx.moveTo(_this.coords[0].x + _this.pos.x, _this.coords[0].y + _this.pos.y);
    ctx.lineTo(_this.coords[1].x + _this.pos.x, _this.coords[1].y + _this.pos.y);
    ctx.lineTo(_this.coords[2].x + _this.pos.x, _this.coords[2].y + _this.pos.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(' + _this.color + ',' + _this.alpha + ')';
    ctx.fill();
  };

  this.init = init;
}