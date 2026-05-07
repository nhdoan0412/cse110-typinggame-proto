const PREFIX = "syntax-runner:";

export function getBestRun(packId) {
  try {
    const raw = localStorage.getItem(`${PREFIX}${packId}:best`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveBestRun(packId, run) {
  const current = getBestRun(packId);
  if (!current || run.xp > current.xp || (run.xp === current.xp && run.accuracy > current.accuracy)) {
    localStorage.setItem(`${PREFIX}${packId}:best`, JSON.stringify(run));
  }
}
