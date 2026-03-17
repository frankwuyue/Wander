// ─── Storage ──────────────────────────────────────────────────────────────────
// Wander uses the Claude artifact storage API (window.storage) for persistence.
// When migrating to a standalone PWA, replace these with localStorage,
// IndexedDB, or a backend of your choice.
//
// TODO: Replace window.storage with localStorage or a real backend
//       when deploying outside of Claude artifacts.

const JOURNAL_KEY = "wander-journal";
const DAILY_KEY = "wander-daily";

function useLocalStorage() {
  return typeof window !== "undefined" && !window.storage;
}

export async function loadJournal() {
  try {
    if (useLocalStorage()) {
      const raw = localStorage.getItem(JOURNAL_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    const r = await window.storage.get(JOURNAL_KEY);
    return r ? JSON.parse(r.value) : [];
  } catch {
    return [];
  }
}

export async function saveJournal(entries) {
  try {
    if (useLocalStorage()) {
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
      return;
    }
    await window.storage.set(JOURNAL_KEY, JSON.stringify(entries));
  } catch {}
}

export async function loadDailyState() {
  try {
    if (useLocalStorage()) {
      const raw = localStorage.getItem(DAILY_KEY);
      return raw ? JSON.parse(raw) : null;
    }
    const r = await window.storage.get(DAILY_KEY);
    return r ? JSON.parse(r.value) : null;
  } catch {
    return null;
  }
}

export async function saveDailyState(state) {
  try {
    if (useLocalStorage()) {
      localStorage.setItem(DAILY_KEY, JSON.stringify(state));
      return;
    }
    await window.storage.set(DAILY_KEY, JSON.stringify(state));
  } catch {}
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
