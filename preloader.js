// Прелоадер A&M Concept — частицы складываются в «A&M CONCEPT», затем плавно исчезает.
// Портировано из React-компонента particle-text-effect на чистый JS.
(function () {
  var overlay = document.getElementById('preloader');
  var canvas = document.getElementById('preloader-canvas');
  if (!overlay || !canvas) return;

  var html = document.documentElement;
  function hide() {
    overlay.classList.add('is-hidden');
    html.style.overflow = '';
    setTimeout(function () { overlay.style.display = 'none'; }, 900);
  }

  // Уважаем «уменьшить движение» — показываем сайт сразу.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hide();
    return;
  }

  html.style.overflow = 'hidden';

  var W = 1100, H = 340;
  canvas.width = W;
  canvas.height = H;
  var ctx = canvas.getContext('2d');

  var PIXEL_STEPS = 4;
  var GOLD = { r: 198, g: 166, b: 92 };
  var CREAM = { r: 234, g: 223, b: 203 };

  function generateRandomPos(x, y, mag) {
    var rx = Math.random() * W;
    var ry = Math.random() * H;
    var dx = rx - x, dy = ry - y;
    var m = Math.sqrt(dx * dx + dy * dy);
    if (m > 0) { dx = (dx / m) * mag; dy = (dy / m) * mag; }
    return { x: x + dx, y: y + dy };
  }

  function Particle() {
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.closeEnoughTarget = 100;
    this.maxSpeed = 1.0;
    this.maxForce = 0.1;
    this.particleSize = 2.5;
    this.isKilled = false;
    this.startColor = { r: 0, g: 0, b: 0 };
    this.targetColor = { r: 0, g: 0, b: 0 };
    this.colorWeight = 0;
    this.colorBlendRate = 0.01;
  }

  Particle.prototype.move = function () {
    var proximityMult = 1;
    var dx = this.pos.x - this.target.x, dy = this.pos.y - this.target.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.closeEnoughTarget) proximityMult = distance / this.closeEnoughTarget;

    var tx = this.target.x - this.pos.x, ty = this.target.y - this.pos.y;
    var mag = Math.sqrt(tx * tx + ty * ty);
    if (mag > 0) { tx = (tx / mag) * this.maxSpeed * proximityMult; ty = (ty / mag) * this.maxSpeed * proximityMult; }

    var sx = tx - this.vel.x, sy = ty - this.vel.y;
    var sm = Math.sqrt(sx * sx + sy * sy);
    if (sm > 0) { sx = (sx / sm) * this.maxForce; sy = (sy / sm) * this.maxForce; }

    this.acc.x += sx; this.acc.y += sy;
    this.vel.x += this.acc.x; this.vel.y += this.acc.y;
    this.pos.x += this.vel.x; this.pos.y += this.vel.y;
    this.acc.x = 0; this.acc.y = 0;
  };

  Particle.prototype.draw = function (c) {
    if (this.colorWeight < 1) this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1);
    var r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight);
    var g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight);
    var b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight);
    c.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
    c.fillRect(this.pos.x, this.pos.y, this.particleSize, this.particleSize);
  };

  Particle.prototype.kill = function () {
    if (this.isKilled) return;
    var rp = generateRandomPos(W / 2, H / 2, (W + H) / 2);
    this.target.x = rp.x; this.target.y = rp.y;
    this.startColor = {
      r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
      g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
      b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight
    };
    this.targetColor = { r: 14, g: 14, b: 12 };
    this.colorWeight = 0;
    this.isKilled = true;
  };

  var particles = [];

  function buildWord(word) {
    var off = document.createElement('canvas');
    off.width = W; off.height = H;
    var octx = off.getContext('2d');
    octx.fillStyle = 'white';
    octx.font = '900 104px Georgia, "Times New Roman", serif';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillText(word, W / 2, H / 2);

    var pixels = octx.getImageData(0, 0, W, H).data;
    var coords = [];
    for (var i = 0; i < pixels.length; i += PIXEL_STEPS * 4) coords.push(i);
    for (var k = coords.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1));
      var t = coords[k]; coords[k] = coords[j]; coords[j] = t;
    }

    var idx = 0;
    for (var n = 0; n < coords.length; n++) {
      var ci = coords[n];
      if (pixels[ci + 3] > 0) {
        var x = (ci / 4) % W;
        var y = Math.floor(ci / 4 / W);
        var p;
        if (idx < particles.length) { p = particles[idx]; p.isKilled = false; idx++; }
        else {
          p = new Particle();
          var rp = generateRandomPos(W / 2, H / 2, (W + H) / 2);
          p.pos.x = rp.x; p.pos.y = rp.y;
          p.maxSpeed = Math.random() * 6 + 4;
          p.maxForce = p.maxSpeed * 0.05;
          p.particleSize = Math.random() * 1.6 + 1.8;
          p.colorBlendRate = Math.random() * 0.0275 + 0.0025;
          particles.push(p);
        }
        p.startColor = {
          r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
          g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
          b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight
        };
        p.targetColor = Math.random() < 0.45 ? CREAM : GOLD;
        p.colorWeight = 0;
        p.target.x = x; p.target.y = y;
      }
    }
    for (var m = idx; m < particles.length; m++) particles[m].kill();
  }

  var raf;
  function animate() {
    ctx.fillStyle = 'rgba(14,14,12,0.12)';
    ctx.fillRect(0, 0, W, H);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.move();
      p.draw(ctx);
      if (p.isKilled && (p.pos.x < 0 || p.pos.x > W || p.pos.y < 0 || p.pos.y > H)) {
        particles.splice(i, 1);
      }
    }
    raf = requestAnimationFrame(animate);
  }

  buildWord('A&M CONCEPT');
  animate();

  // Собрали слово → держим → плавно убираем прелоадер.
  setTimeout(function () {
    overlay.classList.add('is-hidden');
    html.style.overflow = '';
  }, 2700);
  setTimeout(function () {
    overlay.style.display = 'none';
    if (raf) cancelAnimationFrame(raf);
  }, 3600);

  // Подстраховка: если что-то пошло не так — не держим экран дольше 6с.
  setTimeout(hide, 6000);
})();
