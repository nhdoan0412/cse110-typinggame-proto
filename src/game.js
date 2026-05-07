export class RunnerGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.theme = null;
    this.running = false;
    this.avatar = { x: 110, y: 360, vy: 0, grounded: true };
    this.camera = 0;
    this.obstacles = [];
    this.pickups = [];
    this.effects = [];
    this.lastFrame = 0;
    this.progress = 0;
    this.loop = this.loop.bind(this);
  }

  start(theme) {
    this.theme = theme;
    this.running = true;
    this.avatar = { x: 110, y: 360, vy: 0, grounded: true };
    this.camera = 0;
    this.progress = 0;
    this.obstacles = [
      { x: 360, y: 372, w: 32, h: 48 },
      { x: 690, y: 348, w: 36, h: 72 },
      { x: 1040, y: 384, w: 52, h: 36 }
    ];
    this.pickups = [
      { x: 520, y: 310, collected: false },
      { x: 850, y: 280, collected: false },
      { x: 1220, y: 330, collected: false }
    ];
    this.effects = [];
    this.lastFrame = performance.now();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
  }

  setProgress(progress) {
    this.progress = progress;
    this.camera = progress * 520;
  }

  reward(label) {
    this.effects.push({ label, ttl: 120 });
    const pickup = this.pickups.find((item) => !item.collected);
    if (pickup) pickup.collected = true;
  }

  jump() {
    if (!this.avatar.grounded) return;
    this.avatar.vy = -15;
    this.avatar.grounded = false;
  }

  dash() {
    this.camera += 36;
  }

  loop(now) {
    if (!this.running) return;
    const dt = Math.min(32, now - this.lastFrame) / 16.67;
    this.lastFrame = now;
    this.update(dt);
    this.draw();
    requestAnimationFrame(this.loop);
  }

  update(dt) {
    this.avatar.vy += 0.85 * dt;
    this.avatar.y += this.avatar.vy * dt;
    if (this.avatar.y >= 360) {
      this.avatar.y = 360;
      this.avatar.vy = 0;
      this.avatar.grounded = true;
    }
    this.effects = this.effects
      .map((effect) => ({ ...effect, ttl: effect.ttl - dt }))
      .filter((effect) => effect.ttl > 0);
  }

  draw() {
    const { ctx, canvas, theme } = this;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = theme.sky;
    ctx.fillRect(0, 0, width, height);

    this.drawBackground(ctx, width, height);
    const floorY = 420;
    ctx.fillStyle = theme.floor;
    ctx.fillRect(0, floorY, width, height - floorY);

    ctx.save();
    ctx.translate(-this.camera, 0);
    this.drawTrack(ctx);
    this.drawObstacles(ctx, theme);
    this.drawPickups(ctx, theme);
    this.drawAvatar(ctx, theme);
    ctx.restore();

    this.drawEffects(ctx, width);
  }

  drawBackground(ctx, width, height) {
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    for (let i = 0; i < 12; i += 1) {
      const x = (i * 170 - this.camera * 0.25) % (width + 180);
      ctx.fillRect(x, 90 + (i % 4) * 42, 72, 10);
    }
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.fillRect(0, height - 124, width, 2);
  }

  drawTrack(ctx) {
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 16]);
    ctx.beginPath();
    ctx.moveTo(this.camera - 120, 420);
    ctx.lineTo(this.camera + 1200, 420);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawObstacles(ctx, theme) {
    ctx.fillStyle = theme.hazard;
    for (const obstacle of this.obstacles) {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(obstacle.x + 6, obstacle.y + 8, obstacle.w - 12, 6);
      ctx.fillStyle = theme.hazard;
    }
  }

  drawPickups(ctx, theme) {
    for (const pickup of this.pickups) {
      if (pickup.collected) continue;
      ctx.fillStyle = theme.pickup;
      ctx.beginPath();
      ctx.arc(pickup.x, pickup.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  drawAvatar(ctx, theme) {
    ctx.fillStyle = theme.avatar;
    ctx.fillRect(this.avatar.x, this.avatar.y, 42, 60);
    ctx.fillStyle = "rgba(17,24,39,0.9)";
    ctx.fillRect(this.avatar.x + 10, this.avatar.y + 14, 8, 8);
    ctx.fillRect(this.avatar.x + 25, this.avatar.y + 14, 8, 8);
    ctx.fillRect(this.avatar.x + 8, this.avatar.y + 60, 10, 18);
    ctx.fillRect(this.avatar.x + 26, this.avatar.y + 60, 10, 18);
  }

  drawEffects(ctx, width) {
    ctx.textAlign = "center";
    ctx.font = "700 20px system-ui";
    for (const effect of this.effects) {
      ctx.globalAlpha = Math.min(1, effect.ttl / 30);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(effect.label, width / 2, 64 + (120 - effect.ttl) * -0.25);
    }
    ctx.globalAlpha = 1;
  }
}
