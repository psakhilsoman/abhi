const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
const cake = document.getElementById("cake");
const wishBtn = document.getElementById("wish");
const playBtn = document.getElementById("play");
const wishLine = document.getElementById("wish-line");
const song = document.getElementById("song");

const colors = ["#ffd56a", "#ff7b6b", "#fff4ea", "#7ec8ff", "#f08aa0"];
let pieces = [];
let blowing = false;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function burst(count) {
  const x = canvas.width / 2;
  const y = canvas.height * 0.22;
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 7;
    pieces.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      color: colors[i % colors.length],
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      life: 90 + Math.random() * 40,
    });
  }
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces = pieces.filter((p) => p.life > 0);
  pieces.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.rot += p.spin;
    p.life -= 1;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(p.life / 80, 0);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
  requestAnimationFrame(tick);
}

function setPlayLabel() {
  playBtn.textContent = song.paused ? "Play" : "Pause";
}

playBtn.addEventListener("click", () => {
  if (song.paused) {
    if (song.ended) song.currentTime = 0;
    song.volume = 1;
    song.play();
  } else {
    song.pause();
  }
});

song.addEventListener("play", setPlayLabel);
song.addEventListener("pause", setPlayLabel);
song.addEventListener("ended", setPlayLabel);

song.loop = false;
song.volume = 1;
song.play().catch(() => {});

wishBtn.addEventListener("click", () => {
  blowing = !blowing;
  cake.classList.toggle("blown", blowing);
  wishBtn.textContent = blowing ? "Light them again" : "Blow out the candles";
  wishLine.hidden = !blowing;
  if (blowing) burst(80);
});

window.addEventListener("resize", resize);
resize();
burst(50);
tick();
