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
    this.race = {
      progress: 0,
      rivalProgress: 0,
      wpm: 0,
      combo: 0,
      accuracy: 100
    };
    this.loop = this.loop.bind(this);
  }

  start(theme) {
    this.theme = theme;
    this.running = true;
    this.avatar = { x: 110, y: 360, vy: 0, grounded: true };
    this.camera = 0;
    this.race = {
      progress: 0,
      rivalProgress: 0,
      wpm: 0,
      combo: 0,
      accuracy: 100
    };
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

  setRaceState(race) {
    this.race = { ...this.race, ...race };
    this.camera = Math.max(0, this.race.progress * 1320 - 230);
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

    ctx.save();
    ctx.translate(-this.camera, 0);
    this.drawRaceway(ctx, theme);
    this.drawObstacles(ctx, theme);
    this.drawPickups(ctx, theme);
    this.drawRival(ctx, theme);
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
    ctx.fillRect(0, height - 150, width, 2);
  }

  drawRaceway(ctx, theme) {
    ctx.fillStyle = theme.floor;
    ctx.fillRect(this.camera - 120, 330, 1800, 132);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(this.camera - 120, 392, 1800, 4);
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 3;
    for (const y of [356, 424]) {
      ctx.setLineDash([18, 18]);
      ctx.beginPath();
      ctx.moveTo(this.camera - 120, y);
      ctx.lineTo(this.camera + 1800, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    this.drawFinishLine(ctx);
    this.drawMileMarkers(ctx);
  }

  drawFinishLine(ctx) {
    const finishX = 1480;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(finishX, 312, 14, 168);
    ctx.fillStyle = "#111827";
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 2; col += 1) {
        if ((row + col) % 2 === 0) ctx.fillRect(finishX + col * 7, 312 + row * 21, 7, 21);
      }
    }
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "800 18px system-ui";
    ctx.fillText("FINISH", finishX - 28, 300);
  }

  drawMileMarkers(ctx) {
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "700 13px system-ui";
    for (let index = 0; index <= 4; index += 1) {
      const x = 120 + index * 330;
      ctx.fillRect(x, 322, 2, 148);
      ctx.fillText(`${index * 25}%`, x - 14, 492);
    }
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
    const x = 90 + this.race.progress * 1390;
    const boost = Math.min(16, this.race.combo);
    ctx.fillStyle = theme.avatar;
    ctx.fillRect(x, this.avatar.y, 46 + boost * 0.3, 50);
    ctx.fillStyle = "rgba(17,24,39,0.9)";
    ctx.fillRect(x + 11, this.avatar.y + 13, 8, 8);
    ctx.fillRect(x + 28, this.avatar.y + 13, 8, 8);
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillRect(x - 26 - boost, this.avatar.y + 18, 20 + boost, 8);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 13px system-ui";
    ctx.fillText("YOU", x + 6, this.avatar.y - 12);
  }

  drawRival(ctx, theme) {
    const x = 90 + this.race.rivalProgress * 1390;
    const y = 292;
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(x, y, 44, 38);
    ctx.fillStyle = theme.hazard;
    ctx.fillRect(x + 8, y + 9, 28, 8);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 13px system-ui";
    ctx.fillText("RIVAL", x - 2, y - 12);
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
