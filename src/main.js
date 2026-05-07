import { RunnerGame } from "./game.js?v=3";
import { packs } from "./packs.js?v=3";
import { getBestRun, saveBestRun } from "./storage.js?v=3";

const els = {
  screenTitle: document.querySelector("#screen-title"),
  streak: document.querySelector("#streak-label"),
  accuracy: document.querySelector("#accuracy-label"),
  xp: document.querySelector("#xp-label"),
  packGrid: document.querySelector("#pack-grid"),
  menuScreen: document.querySelector("#menu-screen"),
  gameScreen: document.querySelector("#game-screen"),
  summaryScreen: document.querySelector("#summary-screen"),
  packLabel: document.querySelector("#pack-label"),
  roundLabel: document.querySelector("#round-label"),
  concept: document.querySelector("#concept-label"),
  summary: document.querySelector("#summary-label"),
  tip: document.querySelector("#tip-label"),
  target: document.querySelector("#target-code"),
  input: document.querySelector("#typing-input"),
  feedback: document.querySelector("#feedback"),
  progressCount: document.querySelector("#progress-count"),
  raceMeterFill: document.querySelector("#race-meter-fill"),
  unlockList: document.querySelector("#unlock-list"),
  wpm: document.querySelector("#wpm-label"),
  rival: document.querySelector("#rival-label"),
  pace: document.querySelector("#pace-label"),
  skip: document.querySelector("#skip-button"),
  restart: document.querySelector("#restart-button"),
  menu: document.querySelector("#menu-button"),
  jump: document.querySelector("#jump-button"),
  dash: document.querySelector("#dash-button"),
  summaryTitle: document.querySelector("#summary-title"),
  summaryStats: document.querySelector("#summary-stats"),
  playAgain: document.querySelector("#play-again-button"),
  summaryMenu: document.querySelector("#summary-menu-button"),
  template: document.querySelector("#pack-card-template")
};

const state = {
  pack: null,
  round: 0,
  typed: "",
  mistakes: 0,
  totalKeys: 0,
  correctKeys: 0,
  streak: 0,
  xp: 0,
  startedAt: 0,
  roundStartedAt: 0,
  completedChars: 0,
  completed: 0,
  unlocked: []
};

const game = new RunnerGame(document.querySelector("#arena"));

function showScreen(name) {
  for (const screen of [els.menuScreen, els.gameScreen, els.summaryScreen]) {
    screen.classList.remove("active");
  }
  document.querySelector(`#${name}-screen`).classList.add("active");
}

function renderPacks() {
  els.packGrid.textContent = "";
  for (const pack of packs) {
    const card = els.template.content.firstElementChild.cloneNode(true);
    card.querySelector(".pack-icon").textContent = pack.icon;
    card.querySelector(".pack-name").textContent = pack.name;
    card.querySelector(".pack-description").textContent = pack.description;
    const best = getBestRun(pack.id);
    card.querySelector(".pack-best").textContent = best
      ? `Best: ${best.xp} XP, ${best.accuracy}% accuracy`
      : "No runs yet";
    card.addEventListener("click", () => startPack(pack));
    els.packGrid.append(card);
  }
}

function startPack(pack) {
  Object.assign(state, {
    pack,
    round: 0,
    typed: "",
    mistakes: 0,
    totalKeys: 0,
    correctKeys: 0,
    streak: 0,
    xp: 0,
    startedAt: performance.now(),
    roundStartedAt: performance.now(),
    completedChars: 0,
    completed: 0,
    unlocked: []
  });
  els.screenTitle.textContent = pack.name;
  game.start(pack.theme);
  showScreen("game");
  renderRound();
}

function renderRound() {
  const level = state.pack.levels[state.round];
  els.packLabel.textContent = state.pack.name;
  els.roundLabel.textContent = `Round ${state.round + 1} of ${state.pack.levels.length}`;
  els.concept.textContent = level.concept;
  els.summary.textContent = level.summary;
  els.tip.textContent = level.tip;
  els.input.value = "";
  els.feedback.textContent = "Type the target exactly. Fix red characters before moving on.";
  els.feedback.className = "feedback";
  state.typed = "";
  state.roundStartedAt = performance.now();
  renderTarget();
  renderProgress();
  updateStats();
  updateRaceTelemetry();
  requestAnimationFrame(() => els.input.focus());
}

function renderTarget() {
  const target = state.pack.levels[state.round].code;
  const typed = state.typed;
  const pieces = [...target].map((char, index) => {
    const safe = escapeHtml(char);
    if (typed[index] == null) {
      return `<span class="${index === typed.length ? "current" : ""}">${safe}</span>`;
    }
    if (typed[index] === char) return `<span class="done">${safe}</span>`;
    return `<span class="wrong">${safe}</span>`;
  });
  els.target.innerHTML = pieces.join("");
}

function handleInput() {
  const target = state.pack.levels[state.round].code;
  state.typed = els.input.value;
  state.totalKeys += 1;

  const validPrefix = target.startsWith(state.typed);
  if (validPrefix) {
    state.correctKeys += 1;
    state.streak += 1;
    els.feedback.textContent = state.typed === target ? "Clean compile. Sprint to the next gate." : getRaceCue();
    els.feedback.className = "feedback good";
  } else {
    state.mistakes += 1;
    state.streak = 0;
    els.feedback.textContent = "Mismatch. Backspace to the highlighted character and correct it.";
    els.feedback.className = "feedback bad";
  }

  renderTarget();
  updateStats();
  updateRaceTelemetry();
  if (state.typed === target) completeRound();
}

function completeRound() {
  const level = state.pack.levels[state.round];
  state.completed += 1;
  state.completedChars += level.code.length;
  state.unlocked.push(level.reward);
  state.xp += Math.max(25, 120 - state.mistakes * 8 + state.streak);
  game.reward(level.reward);
  state.round += 1;
  state.typed = "";
  renderProgress();
  updateRaceTelemetry();
  if (state.round >= state.pack.levels.length) {
    setTimeout(finishRun, 550);
    return;
  }
  setTimeout(renderRound, 600);
}

function finishRun() {
  const elapsedSeconds = Math.max(1, Math.round((performance.now() - state.startedAt) / 1000));
  const accuracy = getAccuracy();
  const run = {
    xp: state.xp,
    accuracy,
    mistakes: state.mistakes,
    seconds: elapsedSeconds,
    completed: state.completed,
    date: new Date().toISOString()
  };
  saveBestRun(state.pack.id, run);
  game.stop();
  updateStats();
  els.screenTitle.textContent = "Run summary";
  els.summaryTitle.textContent = `${state.pack.name} cleared`;
  els.summaryStats.innerHTML = [
    `${run.xp} XP`,
    `${run.accuracy}% accuracy`,
    `${getWpm()} WPM`,
    `${run.mistakes} mistakes`,
    `${run.seconds}s`
  ]
    .map((text) => `<span>${text}</span>`)
    .join("");
  showScreen("summary");
}

function updateStats() {
  els.streak.textContent = `Streak ${state.streak}`;
  els.accuracy.textContent = `Accuracy ${getAccuracy()}%`;
  els.xp.textContent = `XP ${state.xp}`;
}

function renderProgress() {
  const total = state.pack?.levels.length ?? 0;
  els.progressCount.textContent = `${state.unlocked.length}/${total}`;
  const raceProgress = Math.round(getOverallProgress() * 100);
  els.raceMeterFill.style.width = `${raceProgress}%`;
  if (state.unlocked.length === 0) {
    els.unlockList.innerHTML = "<span>Complete a prompt to add your first unlock.</span>";
    return;
  }
  els.unlockList.innerHTML = state.unlocked
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("");
}

function updateRaceTelemetry() {
  const progress = getOverallProgress();
  const elapsedSeconds = Math.max(0, (performance.now() - state.startedAt) / 1000);
  const rivalProgress = Math.min(0.98, elapsedSeconds / getTargetRaceSeconds());
  const wpm = getWpm();
  const lead = progress - rivalProgress;
  els.wpm.textContent = `${wpm} WPM`;
  els.rival.textContent = lead >= 0 ? `Lead ${(lead * 100).toFixed(0)}%` : `Behind ${Math.abs(lead * 100).toFixed(0)}%`;
  els.pace.textContent = state.streak >= 8 ? "Boost active" : state.mistakes > 0 ? "Repair typos" : "Pace steady";
  els.raceMeterFill.style.width = `${Math.round(progress * 100)}%`;
  game.setRaceState({
    progress,
    rivalProgress,
    wpm,
    combo: state.streak,
    accuracy: getAccuracy()
  });
}

function getRaceCue() {
  if (state.streak > 0 && state.streak % 12 === 0) return "Combo boost. Your runner is pulling ahead.";
  if (state.streak > 0 && state.streak % 6 === 0) return "Nice rhythm. Keep the syntax clean.";
  return "Good pace.";
}

function getOverallProgress() {
  if (!state.pack) return 0;
  const current = state.pack.levels[state.round];
  const currentCorrect = current ? getMatchingPrefixLength(current.code, state.typed) : 0;
  const totalChars = state.pack.levels.reduce((sum, level) => sum + level.code.length, 0);
  return Math.min(1, (state.completedChars + currentCorrect) / totalChars);
}

function getMatchingPrefixLength(target, typed) {
  let count = 0;
  for (let index = 0; index < typed.length && index < target.length; index += 1) {
    if (typed[index] !== target[index]) break;
    count += 1;
  }
  return count;
}

function getWpm() {
  if (!state.startedAt) return 0;
  const elapsedMinutes = Math.max(1 / 60, (performance.now() - state.startedAt) / 60000);
  const current = state.pack?.levels[state.round];
  const currentCorrect = current ? getMatchingPrefixLength(current.code, state.typed) : 0;
  return Math.round(((state.completedChars + currentCorrect) / 5) / elapsedMinutes);
}

function getTargetRaceSeconds() {
  const totalChars = state.pack.levels.reduce((sum, level) => sum + level.code.length, 0);
  return Math.max(35, totalChars / 5 / 38 * 60);
}

function getAccuracy() {
  if (state.totalKeys === 0) return 100;
  return Math.max(0, Math.round((state.correctKeys / state.totalKeys) * 100));
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}

els.input.addEventListener("input", handleInput);
els.skip.addEventListener("click", completeRound);
els.restart.addEventListener("click", () => startPack(state.pack));
els.menu.addEventListener("click", () => {
  game.stop();
  els.screenTitle.textContent = "Choose a syntax pack";
  renderPacks();
  showScreen("menu");
});
els.jump.addEventListener("click", () => game.jump());
els.dash.addEventListener("click", () => game.dash());
els.playAgain.addEventListener("click", () => startPack(state.pack));
els.summaryMenu.addEventListener("click", () => {
  els.screenTitle.textContent = "Choose a syntax pack";
  renderPacks();
  showScreen("menu");
});

window.addEventListener("keydown", (event) => {
  if (!els.gameScreen.classList.contains("active")) return;
  if (event.key === "ArrowUp") game.jump();
  if (event.key === "ArrowRight") game.dash();
  if (event.key === "Escape") els.menu.click();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js?v=3").catch(() => {});
}

renderPacks();
