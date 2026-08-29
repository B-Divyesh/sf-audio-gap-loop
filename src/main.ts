import './styles.css';
import { csvCell, DEFAULT_CADENCE, formatTime, normalizeCadence } from './cadence';
import { clearRecords, deleteClipRecord, deleteDatabase, getClips, getLogs, importRecords, putClip, putLog, setDatabaseName } from './db';
import { captureLicenseFromUrl, checkoutUrl, initialLicenseState, saveLicenseToken, studioCheckoutEnabled, verifyLicense } from './license';
import type { BackupFile, CadencePreset, Clip, PracticeLog } from './models';

const demoMode = location.pathname === '/demo/' || location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
const storagePrefix = demoMode ? 'demo:' : '';
const storageKey = (key: string) => `${storagePrefix}${key}`;
if (demoMode) setDatabaseName('demo:audio-gap-loop');

const workbench = document.querySelector<HTMLElement>('#workbench-app')!;
const studio = document.querySelector<HTMLElement>('#studio-app');
const statusRegion = document.querySelector<HTMLElement>('#app-status')!;
const offlineBanner = document.querySelector<HTMLElement>('#offline-banner')!;
const audioInput = document.querySelector<HTMLInputElement>('#audio-file')!;
const backupInput = document.querySelector<HTMLInputElement>('#backup-file')!;
const clipDialog = document.querySelector<HTMLDialogElement>('#clip-dialog')!;
const clipForm = document.querySelector<HTMLFormElement>('#clip-form')!;
const clipTitle = document.querySelector<HTMLInputElement>('#clip-title')!;
const clipTranscript = document.querySelector<HTMLTextAreaElement>('#clip-transcript')!;
const selectedFile = document.querySelector<HTMLElement>('#selected-file')!;
const rightsCheck = document.querySelector<HTMLInputElement>('#rights-check')!;
const clipError = document.querySelector<HTMLElement>('#clip-error')!;
const toast = document.querySelector<HTMLElement>('#toast')!;

const audio = new Audio();
audio.preload = 'metadata';

let clips: Clip[] = [];
let logs: PracticeLog[] = [];
let selectedId: string | null = localStorage.getItem(storageKey('agl_selected_clip'));
let objectUrl: string | null = null;
let pendingFile: File | null = null;
let editingId: string | null = null;
let phase: 'idle' | 'playing' | 'gap' | 'paused' | 'complete' = 'idle';
let repetitionsThisRun = 0;
let sessionLogged = false;
let gapTimer: number | null = null;
let gapEndsAt = 0;
let licenseState = demoMode ? { token: null, unlocked: false, checking: false, message: '' } : initialLicenseState();
let presets = readJson<CadencePreset[]>('agl_presets', []);
let queue = readJson<string[]>('agl_queue', []);

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]!);
}

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(storageKey(key)) ?? '') as T;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: string): void {
  localStorage.setItem(storageKey(key), value);
}

const SAMPLE_AUDIO_URL = '/assets/french-bonjour-ccby25.oga';

async function loadSampleAudio(): Promise<Blob> {
  const response = await fetch(SAMPLE_AUDIO_URL);
  if (!response.ok) throw new Error('The sample audio could not be opened. Reload and try again.');
  return response.blob();
}

async function seedDemo(): Promise<void> {
  const existing = await getClips();
  if (existing.length) return;
  const now = '2026-08-28T09:00:00.000Z';
  const clip: Clip = {
    id: 'demo-french-greeting', title: 'French greeting',
    transcript: 'Bonjour.',
    activeLine: 0, audio: await loadSampleAudio(), mimeType: 'audio/ogg', duration: 1,
    createdAt: now, updatedAt: now, cadence: { ...DEFAULT_CADENCE, gapSeconds: 3, repetitions: 3 }
  };
  await putClip(clip);
  await putLog({ id: 'demo-practice-1', clipId: clip.id, completedAt: '2026-08-28T09:05:00.000Z', repetitions: 3, secondsListened: 6 });
  writeLocal('agl_selected_clip', clip.id);
}

async function resetDemo(): Promise<void> {
  if (!demoMode) return;
  stopCadence();
  await clearRecords();
  ['agl_selected_clip', 'agl_presets', 'agl_queue'].forEach((key) => localStorage.removeItem(storageKey(key)));
  await seedDemo();
  [clips, logs] = await Promise.all([getClips(), getLogs()]);
  selectedId = clips[0]?.id ?? null;
  if (selectedId) await loadClipAudio(clips[0]);
  renderWorkbench();
  showToast('Sample practice loop reset.');
}

async function leaveDemo(): Promise<void> {
  if (!demoMode) return;
  stopCadence();
  ['agl_selected_clip', 'agl_presets', 'agl_queue'].forEach((key) => localStorage.removeItem(`demo:${key}`));
  await deleteDatabase('demo:audio-gap-loop');
  location.assign('/');
}

function selectedClip(): Clip | undefined {
  return clips.find((clip) => clip.id === selectedId);
}

function announce(message: string): void {
  statusRegion.textContent = '';
  requestAnimationFrame(() => { statusRegion.textContent = message; });
}

let toastTimer = 0;
function showToast(message: string, duration = 4500): void {
  window.clearTimeout(toastTimer);
  toast.innerHTML = `${escapeHtml(message)}<button type="button" aria-label="Dismiss notification" data-action="dismiss-toast">×</button>`;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, duration);
}

function updateNetworkStatus(): void {
  offlineBanner.hidden = navigator.onLine;
}

async function checkActualConnectivity(): Promise<void> {
  if (!navigator.onLine) {
    offlineBanner.hidden = false;
    return;
  }
  const controller = navigator.serviceWorker?.controller;
  if (!controller) return;
  const channel = new MessageChannel();
  const result = new Promise<boolean>((resolve) => {
    const timer = window.setTimeout(() => resolve(navigator.onLine), 2500);
    channel.port1.onmessage = (event) => {
      window.clearTimeout(timer);
      resolve(Boolean(event.data?.online));
    };
  });
  controller.postMessage({ type: 'CHECK_CONNECTIVITY' }, [channel.port2]);
  offlineBanner.hidden = await result;
}

function clipLines(clip: Clip): string[] {
  return clip.transcript.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function logTotals(): { repetitions: number; minutes: number } {
  return logs.reduce((total, log) => ({
    repetitions: total.repetitions + log.repetitions,
    minutes: total.minutes + log.secondsListened / 60
  }), { repetitions: 0, minutes: 0 });
}

function renderWorkbench(): void {
  workbench.setAttribute('aria-busy', 'false');
  if (!clips.length) {
    workbench.innerHTML = `
      <div class="empty-state">
        <div class="empty-cassette" aria-hidden="true"></div>
        <div>
          <h3>No audio clips yet</h3>
          <p>Add an audio clip you have permission to use. It stays in this browser.</p>
        </div>
        <button class="button button-primary" type="button" data-action="open-import">Import audio file</button>
      </div>`;
    return;
  }

  if (!selectedClip()) selectedId = clips[0].id;
  const current = selectedClip()!;
  const totals = logTotals();
  const lines = clipLines(current);
  const clipLogs = logs.filter((log) => log.clipId === current.id);
  const clipRepetitions = clipLogs.reduce((sum, log) => sum + log.repetitions, 0);

  workbench.innerHTML = `
    <div class="workspace-grid">
      <section class="tape-library" aria-labelledby="clip-library-title">
        <div class="library-head"><h3 id="clip-library-title">Audio clips</h3><span class="count-chip">${clips.length} ${clips.length === 1 ? 'audio clip' : 'audio clips'}</span></div>
        <ul class="clip-list">
          ${clips.map((clip) => {
            const reps = logs.filter((log) => log.clipId === clip.id).reduce((sum, log) => sum + log.repetitions, 0);
            return `<li><button class="clip-select" type="button" data-action="select-clip" data-id="${clip.id}" aria-current="${clip.id === current.id}">
              <span><span class="clip-title">${escapeHtml(clip.title)}</span><span class="clip-meta">${formatTime(clip.duration)} · ${reps} repeats</span></span><span class="mini-reel" aria-hidden="true"></span>
            </button></li>`;
          }).join('')}
        </ul>
      </section>
      <div>
        ${playerMarkup(current, lines)}
        <div class="practice-summary" aria-label="Local practice summary">
          <div class="metric"><strong>${clips.length}</strong><span>audio clips prepared</span></div>
          <div class="metric"><strong>${totals.repetitions}</strong><span>repeats logged</span></div>
          <div class="metric"><strong>${Math.round(totals.minutes)}</strong><span>minutes listened</span></div>
        </div>
        <section class="history" aria-labelledby="history-title">
          <h3 id="history-title">Recent practice</h3>
          ${logs.length ? `<ul class="history-list">${logs.slice(0, 6).map((log) => {
            const title = clips.find((clip) => clip.id === log.clipId)?.title ?? 'Removed audio clip';
            return `<li><div><strong>${escapeHtml(title)}</strong><br><time datetime="${log.completedAt}">${new Date(log.completedAt).toLocaleString()}</time></div><span>${log.repetitions} ${log.repetitions === 1 ? 'repeat' : 'repeats'}</span></li>`;
          }).join('')}</ul>` : '<p class="transcript-empty">Completed practice will appear here—no score attached.</p>'}
        </section>
      </div>
    </div>`;

  audio.volume = current.cadence.volume;
  audio.playbackRate = current.cadence.speed;
  updateTransportDisplay();
  renderStudio();
  announce(`${current.title} selected. ${clipRepetitions} repeats logged.`);
}

function playerMarkup(clip: Clip, lines: string[]): string {
  const activeLine = Math.min(clip.activeLine, Math.max(0, lines.length - 1));
  return `<section class="player-shell ${phase === 'playing' ? 'is-playing' : ''}" aria-label="Practice player for ${escapeHtml(clip.title)}">
    <div class="player-top">
      <div><p class="eyebrow">Current audio clip</p><h3>${escapeHtml(clip.title)}</h3></div>
      <div class="player-tools">
        <button class="icon-button" type="button" data-action="edit-clip">Edit</button>
        <button class="icon-button" type="button" data-action="delete-clip">Delete</button>
      </div>
    </div>
    <div class="cassette-window" aria-hidden="true">
      <div class="reels"><span class="reel"></span><span class="reel"></span></div>
      <div class="phase-strip"><span class="phase-step" data-phase="playing">Listen</span><span class="phase-step" data-phase="gap">Your turn</span><span class="phase-step" data-phase="complete">Hear again</span></div>
    </div>
    <section class="transcript-panel" aria-labelledby="transcript-title">
      <h4 id="transcript-title">Transcript line</h4>
      ${lines.length ? `<div class="transcript-lines">${lines.map((line, index) => `<button type="button" class="transcript-line" data-action="select-line" data-line="${index}" aria-pressed="${index === activeLine}">${escapeHtml(line)}</button>`).join('')}</div>` : '<p class="transcript-empty">No transcript yet. Use Edit to add one phrase per line.</p>'}
    </section>
    <div class="transport">
      <div class="now-status"><span id="phase-label">Ready to listen</span><output id="repeat-count">0 / ${clip.cadence.repetitions} repeats</output></div>
      <label class="sr-only" for="timeline">Position in audio</label>
      <input class="timeline" id="timeline" data-control="seek" type="range" min="0" max="${Math.max(.1, clip.duration)}" value="0" step="0.05" />
      <div class="time-row"><span id="current-time">0:00</span><span>${formatTime(clip.duration)}</span></div>
      <div class="transport-buttons">
        <button class="button button-primary" type="button" data-action="toggle-play">Start timed repeats</button>
        <button class="button button-outline" type="button" data-action="replay">Replay now</button>
        <button class="button button-outline" type="button" data-action="finish">Save practice session</button>
      </div>
      <div class="cadence-controls">
        <label>Speaking gap
          <select data-cadence="gapSeconds" aria-label="Speaking gap between repeats">
            ${[1, 2, 3, 4, 5, 7, 10, 15, 20].map((value) => `<option value="${value}" ${clip.cadence.gapSeconds === value ? 'selected' : ''}>${value} seconds</option>`).join('')}
          </select>
        </label>
        <label>Repeats
          <input data-cadence="repetitions" type="number" min="1" max="30" value="${clip.cadence.repetitions}" inputmode="numeric" />
        </label>
        <label>Playback speed
          <select data-cadence="speed" aria-label="Playback speed">
            ${[.6, .7, .75, .85, 1, 1.1, 1.25].map((value) => `<option value="${value}" ${clip.cadence.speed === value ? 'selected' : ''}>${value}×</option>`).join('')}
          </select>
        </label>
        <label>Player volume
          <input data-cadence="volume" type="range" min="0" max="1" value="${clip.cadence.volume}" step="0.05" />
        </label>
      </div>
      <p class="safety-note"><span aria-hidden="true">◖</span><span>Hearing-safe habit: begin below 60% volume, lower it if speech feels sharp, and take regular breaks.</span></p>
    </div>
  </section>`;
}

function updateTransportDisplay(): void {
  const current = selectedClip();
  if (!current) return;
  const shell = document.querySelector<HTMLElement>('.player-shell');
  shell?.classList.toggle('is-playing', phase === 'playing');
  document.querySelectorAll<HTMLElement>('.phase-step').forEach((step) => {
    const matches = step.dataset.phase === phase || (phase === 'paused' && step.dataset.phase === 'playing');
    step.classList.toggle('active', matches);
  });
  const labels = {
    idle: 'Ready to listen',
    playing: 'Listen',
    gap: `Your turn — ${Math.max(0, Math.ceil((gapEndsAt - Date.now()) / 1000))}s`,
    paused: 'Paused',
    complete: 'Timed repeats complete'
  };
  const phaseLabel = document.querySelector<HTMLElement>('#phase-label');
  const repeatCount = document.querySelector<HTMLOutputElement>('#repeat-count');
  const button = document.querySelector<HTMLButtonElement>('[data-action="toggle-play"]');
  const timeline = document.querySelector<HTMLInputElement>('#timeline');
  const currentTime = document.querySelector<HTMLElement>('#current-time');
  if (phaseLabel) phaseLabel.textContent = labels[phase];
  if (repeatCount) repeatCount.textContent = `${repetitionsThisRun} / ${current.cadence.repetitions} repeats`;
  if (button) button.textContent = phase === 'playing' || phase === 'gap' ? 'Pause timed repeats' : phase === 'paused' ? 'Resume timed repeats' : phase === 'complete' ? 'Practise again' : 'Start timed repeats';
  if (timeline) timeline.value = String(audio.currentTime || 0);
  if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
}

function renderStudio(): void {
  if (!studio) return;
  if (!studioCheckoutEnabled && !licenseState.unlocked) {
    studio.innerHTML = '<div class="checkout-unavailable" role="status"><h3>Studio extras are not available yet.</h3><p>The practice player and data exports are ready to use.</p></div>';
    return;
  }
  const current = selectedClip();
  const queueClips = queue.map((id) => clips.find((clip) => clip.id === id)).filter((clip): clip is Clip => Boolean(clip));
  studio.innerHTML = `
    <div class="studio-grid">
      <div class="studio-copy">
        <h3>Studio extras are not available yet.</h3>
        <p>Saved timing presets and an audio clip queue will appear here when they are ready.</p>
        ${licenseState.unlocked
    ? '<p><strong>Unlocked on this device.</strong></p>'
    : studioCheckoutEnabled
      ? `<a class="button button-primary" href="${checkoutUrl}">Buy Studio</a>`
      : '<p class="checkout-unavailable" role="status"><strong>Studio extras are not available yet.</strong> You can still use the practice player and exports.</p>'}
      </div>
      <div class="license-panel">
        <h3>${licenseState.unlocked ? 'License active' : 'Restore a purchase'}</h3>
        <p>${licenseState.unlocked ? 'The core player never waits for a license check.' : 'If you have a Studio license, paste its token here.'}</p>
        <form class="license-form" id="license-form">
          <label for="license-token">License token</label>
          <input id="license-token" name="license" type="text" autocomplete="off" spellcheck="false" required />
          <button class="button button-dark" type="submit">Verify license</button>
        </form>
        <p class="license-status" role="status">${escapeHtml(licenseState.message)}</p>
      </div>
    </div>
    <div class="studio-tools ${licenseState.unlocked ? '' : 'locked-tool'}" aria-label="Studio extras">
      <section class="studio-tool">
        <h3>Timing presets</h3>
        ${licenseState.unlocked ? `<form class="preset-form" id="preset-form"><label for="preset-name">Save the current timing</label><input id="preset-name" name="name" maxlength="40" placeholder="e.g. Slow warm-up" required ${current ? '' : 'disabled'} /><button class="button button-small button-dark" type="submit" ${current ? '' : 'disabled'}>Save</button></form>
          ${presets.length ? `<ul class="preset-list">${presets.map((preset) => `<li><span><strong>${escapeHtml(preset.name)}</strong><br><small>${preset.cadence.gapSeconds}s gap · ${preset.cadence.repetitions}× · ${preset.cadence.speed}× speed</small></span><span><button class="button button-small button-outline" type="button" data-action="apply-preset" data-id="${preset.id}">Apply</button> <button class="button button-small button-danger" type="button" data-action="remove-preset" data-id="${preset.id}" aria-label="Remove ${escapeHtml(preset.name)}">×</button></span></li>`).join('')}</ul>` : '<p class="transcript-empty">No presets saved yet.</p>'}` : '<p>Available after the one-time unlock. Timing controls remain free.</p>'}
      </section>
      <section class="studio-tool">
        <h3>Audio clip queue</h3>
        ${licenseState.unlocked ? `${current ? `<button class="button button-small button-outline" type="button" data-action="queue-current" ${queue.includes(current.id) ? 'disabled' : ''}>${queue.includes(current.id) ? 'Already queued' : `Queue “${escapeHtml(current.title)}”`}</button>` : ''}
          ${queueClips.length ? `<ol class="queue-list">${queueClips.map((clip, index) => `<li><span>${index + 1}. ${escapeHtml(clip.title)}</span><span><button class="button button-small button-outline" type="button" data-action="practice-queued" data-id="${clip.id}">Open</button> <button class="button button-small button-danger" type="button" data-action="remove-queue" data-id="${clip.id}" aria-label="Remove ${escapeHtml(clip.title)} from queue">×</button></span></li>`).join('')}</ol>` : '<p class="transcript-empty">Queue audio clips in the order you want to practise.</p>'}` : '<p>Available after the one-time unlock. You can always open any audio clip directly.</p>'}
      </section>
    </div>`;
}

async function loadClipAudio(clip: Clip): Promise<void> {
  stopCadence(true);
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(clip.audio);
  audio.src = objectUrl;
  audio.volume = clip.cadence.volume;
  audio.playbackRate = clip.cadence.speed;
  audio.load();
}

async function selectClip(id: string): Promise<void> {
  const clip = clips.find((item) => item.id === id);
  if (!clip) return;
  selectedId = id;
  writeLocal('agl_selected_clip', id);
  await loadClipAudio(clip);
  renderWorkbench();
  document.querySelector('.player-shell')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearGapTimer(): void {
  if (gapTimer !== null) window.clearInterval(gapTimer);
  gapTimer = null;
}

async function playCurrent(fromStart = true): Promise<void> {
  const clip = selectedClip();
  if (!clip) return;
  clearGapTimer();
  if (fromStart) audio.currentTime = 0;
  audio.playbackRate = clip.cadence.speed;
  audio.volume = clip.cadence.volume;
  phase = 'playing';
  updateTransportDisplay();
  announce(`Listen. Repeat ${repetitionsThisRun + 1} of ${clip.cadence.repetitions}.`);
  try {
    await audio.play();
  } catch {
    phase = 'paused';
    updateTransportDisplay();
    showToast('Playback could not start. Check that this browser supports the audio format, then try again.');
  }
}

async function startCadence(): Promise<void> {
  if (phase === 'playing' || phase === 'gap') {
    audio.pause();
    clearGapTimer();
    phase = 'paused';
    updateTransportDisplay();
    announce('Timed repeats paused.');
    return;
  }
  if (phase === 'idle' || phase === 'complete') {
    repetitionsThisRun = 0;
    sessionLogged = false;
  }
  await playCurrent(phase !== 'paused');
}

function beginGap(): void {
  const clip = selectedClip();
  if (!clip) return;
  phase = 'gap';
  gapEndsAt = Date.now() + clip.cadence.gapSeconds * 1000;
  announce(`Your turn. ${clip.cadence.gapSeconds} second speaking gap.`);
  clearGapTimer();
  gapTimer = window.setInterval(() => {
    updateTransportDisplay();
    if (Date.now() >= gapEndsAt) {
      clearGapTimer();
      void playCurrent(true);
    }
  }, 100);
  updateTransportDisplay();
}

async function commitSession(): Promise<void> {
  const clip = selectedClip();
  if (!clip || repetitionsThisRun < 1 || sessionLogged) return;
  const log: PracticeLog = {
    id: crypto.randomUUID(),
    clipId: clip.id,
    completedAt: new Date().toISOString(),
    repetitions: repetitionsThisRun,
    secondsListened: Math.round(clip.duration * repetitionsThisRun / clip.cadence.speed)
  };
  await putLog(log);
  logs.unshift(log);
  sessionLogged = true;
}

async function finishSession(): Promise<void> {
  audio.pause();
  clearGapTimer();
  await commitSession();
  phase = repetitionsThisRun ? 'complete' : 'idle';
  renderWorkbench();
  showToast(repetitionsThisRun ? `${repetitionsThisRun} repeats saved locally.` : 'Practice stopped.');
}

function stopCadence(reset = true): void {
  audio.pause();
  clearGapTimer();
  if (reset) {
    phase = 'idle';
    repetitionsThisRun = 0;
    sessionLogged = false;
    audio.currentTime = 0;
  }
}

function openImportDialog(file: File): void {
  pendingFile = file;
  editingId = null;
  clipForm.reset();
  clipTitle.value = file.name.replace(/\.[^.]+$/, '').replaceAll(/[-_]+/g, ' ');
  selectedFile.textContent = `${file.name} · ${formatBytes(file.size)} · saved on this device`;
  selectedFile.hidden = false;
  rightsCheck.checked = false;
  rightsCheck.disabled = false;
  clipError.textContent = '';
  document.querySelector('#clip-dialog-title')!.textContent = 'Add an audio clip';
  clipForm.querySelector<HTMLButtonElement>('[type="submit"]')!.textContent = 'Save audio clip';
  clipDialog.showModal();
  clipTitle.focus();
}

function openEditDialog(clip: Clip): void {
  pendingFile = null;
  editingId = clip.id;
  clipForm.reset();
  clipTitle.value = clip.title;
  clipTranscript.value = clip.transcript;
  selectedFile.textContent = 'The audio file will stay unchanged.';
  rightsCheck.checked = true;
  rightsCheck.disabled = true;
  clipError.textContent = '';
  document.querySelector('#clip-dialog-title')!.textContent = 'Edit audio clip';
  clipForm.querySelector<HTMLButtonElement>('[type="submit"]')!.textContent = 'Save changes';
  clipDialog.showModal();
  clipTitle.focus();
}

function formatBytes(bytes: number): string {
  if (bytes < 1_000_000) return `${Math.ceil(bytes / 1000)} KB`;
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

function audioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const preview = new Audio();
    const url = URL.createObjectURL(file);
    const done = (duration: number) => { URL.revokeObjectURL(url); resolve(Number.isFinite(duration) ? duration : 0); };
    preview.preload = 'metadata';
    preview.onloadedmetadata = () => done(preview.duration);
    preview.onerror = () => done(0);
    preview.src = url;
  });
}

async function saveClipFromDialog(): Promise<void> {
  if (!clipForm.reportValidity()) return;
  const title = clipTitle.value.trim();
  if (!title) return;
  clipError.textContent = '';
  const saveButton = clipForm.querySelector<HTMLButtonElement>('[type="submit"]')!;
  saveButton.disabled = true;
  saveButton.textContent = 'Saving…';
  try {
    if (editingId) {
      const existing = clips.find((clip) => clip.id === editingId);
      if (!existing) throw new Error('That audio clip could not be found.');
      const updated: Clip = { ...existing, title, transcript: clipTranscript.value.trim(), updatedAt: new Date().toISOString() };
      await putClip(updated);
      clips = clips.map((clip) => clip.id === updated.id ? updated : clip);
      clipDialog.close();
      renderWorkbench();
      showToast('Audio clip details saved.');
      return;
    }
    if (!pendingFile) throw new Error('Choose an audio file first.');
    if (!rightsCheck.checked) throw new Error('Confirm that you have permission to use this audio.');
    const now = new Date().toISOString();
    const clip: Clip = {
      id: crypto.randomUUID(),
      title,
      transcript: clipTranscript.value.trim(),
      activeLine: 0,
      audio: pendingFile,
      mimeType: pendingFile.type || 'audio/mpeg',
      duration: await audioDuration(pendingFile),
      createdAt: now,
      updatedAt: now,
      cadence: { ...DEFAULT_CADENCE }
    };
    await putClip(clip);
    clips.unshift(clip);
    clipDialog.close();
    audioInput.value = '';
    pendingFile = null;
    await selectClip(clip.id);
    showToast('Audio clip saved. It is ready offline.');
  } catch (error) {
    clipError.textContent = error instanceof Error ? error.message : 'The audio clip could not be saved.';
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = editingId ? 'Save changes' : 'Save audio clip';
  }
}

async function updateCadence(key: string, rawValue: string): Promise<void> {
  const clip = selectedClip();
  if (!clip || !['gapSeconds', 'repetitions', 'speed', 'volume'].includes(key)) return;
  const cadence = normalizeCadence({ ...clip.cadence, [key]: Number(rawValue) });
  const updated = { ...clip, cadence, updatedAt: new Date().toISOString() };
  clips = clips.map((item) => item.id === updated.id ? updated : item);
  await putClip(updated);
  audio.volume = cadence.volume;
  audio.playbackRate = cadence.speed;
  if (phase === 'idle' || phase === 'complete') renderWorkbench();
  else updateTransportDisplay();
  announce('Timing settings saved.');
}

async function chooseTranscriptLine(index: number): Promise<void> {
  const clip = selectedClip();
  if (!clip) return;
  const updated = { ...clip, activeLine: index, updatedAt: new Date().toISOString() };
  clips = clips.map((item) => item.id === updated.id ? updated : item);
  await putClip(updated);
  renderWorkbench();
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read audio.'));
    reader.readAsDataURL(blob);
  });
}

function dataUrlToAudioBlob(dataUrl: string, title: string): Blob {
  const match = /^data:(audio\/[a-z0-9.+-]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) throw new Error(`Audio is missing for “${title || 'untitled audio clip'}”.`);
  try {
    const binary = atob(match[2]);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new Blob([bytes], { type: match[1] });
  } catch {
    throw new Error(`Audio is damaged for “${title || 'untitled audio clip'}”.`);
  }
}

async function exportBackup(): Promise<void> {
  showToast('Preparing your complete local backup…', 12_000);
  const backup: BackupFile = {
    schema: 1,
    exportedAt: new Date().toISOString(),
    clips: await Promise.all(clips.map(async ({ audio: clipAudio, ...clip }) => ({ ...clip, audioBase64: await blobToDataUrl(clipAudio) }))),
    logs
  };
  downloadBlob(new Blob([JSON.stringify(backup)], { type: 'application/json' }), `audio-gap-loop-backup-${new Date().toISOString().slice(0, 10)}.json`);
  showToast('Backup exported, including your audio.');
}

function exportCsv(): void {
  const titleById = new Map(clips.map((clip) => [clip.id, clip.title]));
  const rows = [['completed_at', 'clip', 'repetitions', 'seconds_listened'], ...logs.map((log) => [
    log.completedAt, titleById.get(log.clipId) ?? 'Removed audio clip', log.repetitions, log.secondsListened
  ])];
  const csv = rows.map((row) => row.map(csvCell).join(',')).join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `audio-gap-loop-log-${new Date().toISOString().slice(0, 10)}.csv`);
  showToast('Practice log exported.');
}

async function importBackup(file: File): Promise<void> {
  try {
    const parsed = JSON.parse(await file.text()) as BackupFile;
    if (parsed.schema !== 1 || !Array.isArray(parsed.clips) || !Array.isArray(parsed.logs)) throw new Error('This is not an Audio Gap Loop backup.');
    const restoredClips: Clip[] = parsed.clips.map(({ audioBase64, ...clip }) => ({
      ...clip,
      audio: dataUrlToAudioBlob(audioBase64, clip.title),
      cadence: normalizeCadence(clip.cadence)
    } as Clip));
    const existingById = new Map(clips.map((clip) => [clip.id, clip]));
    const newestClips = restoredClips.filter((clip) => {
      const existing = existingById.get(clip.id);
      return !existing || clip.updatedAt.localeCompare(existing.updatedAt) >= 0;
    });
    await importRecords(newestClips, parsed.logs);
    clips = await getClips();
    logs = await getLogs();
    queue = queue.filter((id) => clips.some((clip) => clip.id === id));
    writeLocal('agl_queue', JSON.stringify(queue));
    if (clips.length) await selectClip(selectedId && clips.some((clip) => clip.id === selectedId) ? selectedId : clips[0].id);
    else renderWorkbench();
    showToast(`Imported ${restoredClips.length} audio clips and ${parsed.logs.length} practice entries.`);
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'The backup could not be imported.', 7000);
  } finally {
    backupInput.value = '';
  }
}

async function handleAction(target: HTMLElement): Promise<void> {
  const action = target.closest<HTMLElement>('[data-action]')?.dataset.action;
  const actionTarget = target.closest<HTMLElement>('[data-action]');
  if (!action || !actionTarget) return;
  switch (action) {
    case 'open-import': audioInput.click(); break;
    case 'select-clip': await selectClip(actionTarget.dataset.id!); break;
    case 'toggle-play': await startCadence(); break;
    case 'replay':
      if (phase === 'complete') repetitionsThisRun = 0;
      sessionLogged = false;
      await playCurrent(true);
      break;
    case 'finish': await finishSession(); break;
    case 'edit-clip': if (selectedClip()) openEditDialog(selectedClip()!); break;
    case 'close-dialog': clipDialog.close(); break;
    case 'delete-clip': {
      const clip = selectedClip();
      if (!clip || !confirm(`Delete the audio clip “${clip.title}” and its local practice history? This cannot be undone.`)) break;
      stopCadence();
      await deleteClipRecord(clip.id);
      clips = clips.filter((item) => item.id !== clip.id);
      logs = logs.filter((log) => log.clipId !== clip.id);
      queue = queue.filter((id) => id !== clip.id);
      writeLocal('agl_queue', JSON.stringify(queue));
      selectedId = clips[0]?.id ?? null;
      if (selectedId) await loadClipAudio(clips[0]);
      renderWorkbench();
      showToast('Audio clip and its practice history deleted.');
      break;
    }
    case 'select-line': await chooseTranscriptLine(Number(actionTarget.dataset.line)); break;
    case 'dismiss-toast': toast.hidden = true; break;
    case 'reset-demo': await resetDemo(); break;
    case 'start-real': await leaveDemo(); break;
    case 'export-json': await exportBackup(); break;
    case 'export-csv': exportCsv(); break;
    case 'import-json': backupInput.click(); break;
    case 'queue-current': {
      const clip = selectedClip();
      if (licenseState.unlocked && clip && !queue.includes(clip.id)) {
        queue.push(clip.id); writeLocal('agl_queue', JSON.stringify(queue)); renderStudio(); announce(`${clip.title} added to the queue.`);
      }
      break;
    }
    case 'remove-queue': queue = queue.filter((id) => id !== actionTarget.dataset.id); writeLocal('agl_queue', JSON.stringify(queue)); renderStudio(); break;
    case 'practice-queued': await selectClip(actionTarget.dataset.id!); document.querySelector('#workbench')?.scrollIntoView(); break;
    case 'apply-preset': {
      const clip = selectedClip();
      const preset = presets.find((item) => item.id === actionTarget.dataset.id);
      if (licenseState.unlocked && clip && preset) {
        const updated = { ...clip, cadence: { ...preset.cadence }, updatedAt: new Date().toISOString() };
        clips = clips.map((item) => item.id === clip.id ? updated : item); await putClip(updated); renderWorkbench(); showToast(`Applied “${preset.name}”.`);
      }
      break;
    }
    case 'remove-preset': presets = presets.filter((item) => item.id !== actionTarget.dataset.id); writeLocal('agl_presets', JSON.stringify(presets)); renderStudio(); break;
  }
}

document.addEventListener('click', (event) => { void handleAction(event.target as HTMLElement); });

document.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  if (target.dataset.cadence) void updateCadence(target.dataset.cadence, target.value);
});

document.addEventListener('input', (event) => {
  const target = event.target as HTMLInputElement;
  if (target.dataset.control === 'seek') {
    audio.currentTime = Number(target.value);
    updateTransportDisplay();
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target as HTMLFormElement;
  if (form.id === 'clip-form') {
    event.preventDefault();
    void saveClipFromDialog();
  }
  if (form.id === 'license-form') {
    event.preventDefault();
    const token = new FormData(form).get('license')?.toString().trim();
    if (!token) return;
    saveLicenseToken(token);
    licenseState = { token, unlocked: false, checking: true, message: 'Checking this license…' };
    renderStudio();
    void verifyLicense(true).then((state) => { licenseState = state; renderStudio(); });
  }
  if (form.id === 'preset-form') {
    event.preventDefault();
    const clip = selectedClip();
    const name = new FormData(form).get('name')?.toString().trim();
    if (!licenseState.unlocked || !clip || !name) return;
    presets.push({ id: crypto.randomUUID(), name, cadence: { ...clip.cadence } });
    writeLocal('agl_presets', JSON.stringify(presets));
    renderStudio();
    showToast('Timing preset saved.');
  }
});

audioInput.addEventListener('change', () => {
  const file = audioInput.files?.[0];
  if (!file) return;
  if (file.size > 100 * 1024 * 1024) {
    showToast('That file is too large. Trim it into a shorter audio clip and try again.', 7000);
    audioInput.value = '';
    return;
  }
  const likelyAudio = file.type.startsWith('audio/') || /\.(mp3|m4a|wav|ogg|opus|webm)$/i.test(file.name);
  if (!likelyAudio) {
    showToast('This file is not recognised as audio. Choose an audio file and try again.', 7000);
    audioInput.value = '';
    return;
  }
  openImportDialog(file);
});

backupInput.addEventListener('change', () => {
  const file = backupInput.files?.[0];
  if (file) void importBackup(file);
});

audio.addEventListener('timeupdate', updateTransportDisplay);
audio.addEventListener('ended', () => {
  const clip = selectedClip();
  if (!clip || phase !== 'playing') return;
  repetitionsThisRun += 1;
  if (repetitionsThisRun >= clip.cadence.repetitions) {
    phase = 'complete';
    void commitSession().then(() => {
      renderWorkbench();
      announce(`Timed repeats complete. ${repetitionsThisRun} repeats saved.`);
    });
  } else beginGap();
});
audio.addEventListener('error', () => {
  if (!audio.src) return;
  phase = 'paused';
  updateTransportDisplay();
  showToast('This audio clip could not be decoded. Try converting it to MP3 or WAV.');
});

document.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement;
  if (target.matches('input, textarea, select, button, a') || clipDialog.open) return;
  if (event.code === 'Space') { event.preventDefault(); void startCadence(); }
  if (event.key.toLowerCase() === 'r') { event.preventDefault(); void playCurrent(true); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); audio.currentTime = Math.max(0, audio.currentTime - 5); updateTransportDisplay(); }
  if (event.key === 'ArrowRight') { event.preventDefault(); audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5); updateTransportDisplay(); }
});

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  try {
    await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
    await checkActualConnectivity();
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'SW_UPDATED') showToast('A new offline version is ready. Reload when convenient.', 9000);
    });
  } catch {
    showToast('Offline setup was unavailable. The player still works while this page stays open.');
  }
}

async function init(): Promise<void> {
  updateNetworkStatus();
  if (demoMode) {
    document.title = 'Demo — Audio Gap Loop';
    const description = 'Try a spoken French greeting with timed repeats.';
    const updateMeta = (selector: string, content: string) => document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', 'https://audio-gap-loop.sociobot.in/demo/');
    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:url"]', 'https://audio-gap-loop.sociobot.in/demo/');
    updateMeta('meta[property="og:title"]', document.title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[name="twitter:title"]', document.title);
    updateMeta('meta[name="twitter:description"]', description);
    document.querySelector<HTMLElement>('#demo-banner')!.hidden = false;
    await seedDemo();
  } else renderStudio();
  try {
    [clips, logs] = await Promise.all([getClips(), getLogs()]);
    queue = queue.filter((id) => clips.some((clip) => clip.id === id));
    writeLocal('agl_queue', JSON.stringify(queue));
    if (clips.length) {
      const initial = selectedId && clips.some((clip) => clip.id === selectedId) ? selectedId : clips[0].id;
      selectedId = initial;
      await loadClipAudio(clips.find((clip) => clip.id === initial)!);
    }
    renderWorkbench();
  } catch {
    workbench.setAttribute('aria-busy', 'false');
    workbench.innerHTML = '<div class="notice notice-error" role="alert"><strong>Browser storage did not open.</strong><br>Check your browser storage settings, then reload.</div>';
  }
  if (demoMode) { renderStudio(); void registerServiceWorker(); return; }
  const returnedFromCheckout = captureLicenseFromUrl();
  if (returnedFromCheckout) licenseState = initialLicenseState();
  if (licenseState.token || returnedFromCheckout) {
    licenseState = { ...licenseState, checking: true, message: 'Checking this license…' };
    renderStudio();
    licenseState = await verifyLicense(returnedFromCheckout);
    renderStudio();
  }
  void registerServiceWorker();
}

void init();
