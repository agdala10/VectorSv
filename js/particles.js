/* VectorSv — ambient particle field in the icon's neon palette. Pure canvas, no deps. */
(function () {
  var canvas = document.getElementById('particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, parts = [];
  var COLORS = ['0,212,255', '255,47,179', '255,154,0', '150,120,255'];
  var N = 90;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function spawn(anywhere) {
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 10,
      r: 0.8 + Math.random() * 2.4,
      vy: 0.15 + Math.random() * 0.55,
      vx: (Math.random() - 0.5) * 0.35,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      a: 0.25 + Math.random() * 0.55,
      tw: Math.random() * Math.PI * 2
    };
  }
  for (var i = 0; i < N; i++) parts.push(spawn(true));

  // Faint connecting lines between close particles (constellation feel).
  function links() {
    ctx.lineWidth = 1;
    for (var i = 0; i < parts.length; i++) {
      for (var j = i + 1; j < parts.length; j++) {
        var dx = parts[i].x - parts[j].x, dy = parts[i].y - parts[j].y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 130 * 130) {
          var o = (1 - Math.sqrt(d2) / 130) * 0.14;
          ctx.strokeStyle = 'rgba(0,212,255,' + o.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(parts[i].x, parts[i].y);
          ctx.lineTo(parts[j].x, parts[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    links();
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.tw += 0.03;
      p.x += p.vx + Math.sin(p.tw) * 0.15;
      p.y -= p.vy;
      if (p.y < -12 || p.x < -12 || p.x > W + 12) parts[i] = p = spawn(false);
      var glow = p.a * (0.7 + 0.3 * Math.sin(p.tw));
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(' + p.c + ',0.9)';
      ctx.fillStyle = 'rgba(' + p.c + ',' + glow.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    requestAnimationFrame(frame);
  }
  // Respect users who prefer less motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ctx.fillStyle = 'rgba(0,212,255,0.15)';
    for (var k = 0; k < parts.length; k++) {
      ctx.beginPath();
      ctx.arc(parts[k].x, parts[k].y, parts[k].r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    frame();
  }
})();
