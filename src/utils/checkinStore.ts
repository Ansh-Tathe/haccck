export interface CheckinRecord {
  id: string;
  name: string;
  rollNumber: string;
  timestamp: string;
  scannerId: string;
}

export interface ScannerState {
  id: string;
  codeValue: string;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const CHECKINS_KEY = 'panda_checkins_data';
const ACTIVE_SCANNER_KEY = 'panda_active_scanner';

// ─── Cloud Sync (valid KVDB bucket) ──────────────────────────────────────────
// Bucket created: 7oz4UxWDPzWnan4AfeRdFu
const SYNC_BASE = 'https://kvdb.io/7oz4UxWDPzWnan4AfeRdFu';
const SYNC_URL = `${SYNC_BASE}/checkins_v2`;

const FIXED_SCANNER_ID = 'sc-stable';

// ─── Pub / Sub ────────────────────────────────────────────────────────────────
type Listener = () => void;
const listeners = new Set<Listener>();

// Listen for localStorage changes made in OTHER tabs (student → teacher sync
// when both are on the same browser/device).
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === CHECKINS_KEY) {
      // Another tab wrote to checkins — notify all subscribers
      listeners.forEach((l) => l());
    }
  });
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const checkinStore = {
  // ── Scanner ─────────────────────────────────────────────────────────────────

  /** Returns the persistent scanner, creating it once if missing. */
  getActiveScanner(): ScannerState {
    const data = localStorage.getItem(ACTIVE_SCANNER_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data) as ScannerState;
        if (parsed.id && parsed.codeValue) return parsed;
      } catch {
        /* fall through */
      }
    }
    return this._createScanner();
  },

  _createScanner(): ScannerState {
    const hash = Math.random().toString(36).substring(2, 10).toUpperCase();
    const scanner: ScannerState = {
      id: FIXED_SCANNER_ID,
      codeValue: `PANDA-${hash}`,
    };
    localStorage.setItem(ACTIVE_SCANNER_KEY, JSON.stringify(scanner));
    this.notify();
    return scanner;
  },

  // ── Local checkins ──────────────────────────────────────────────────────────

  getCheckins(): CheckinRecord[] {
    const data = localStorage.getItem(CHECKINS_KEY);
    if (!data) return [];
    try {
      const parsed: CheckinRecord[] = JSON.parse(data);
      // Strip legacy mock records
      const filtered = parsed.filter((r) => !['c1', 'c2', 'c3'].includes(r.id));
      if (filtered.length !== parsed.length) {
        localStorage.setItem(CHECKINS_KEY, JSON.stringify(filtered));
      }
      return filtered;
    } catch {
      return [];
    }
  },

  _saveCheckins(records: CheckinRecord[]) {
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(records));
    this.notify();
  },

  // ── Add check-in (called from StudentScanPortal on student's device) ─────────

  addCheckin(
    name: string,
    rollNumber: string,
    scannedCode: string
  ): { success: boolean; error?: string } {
    // The code in the QR URL is the authority. No localStorage comparison needed
    // because the student's browser has its own localStorage.
    if (!scannedCode || !scannedCode.trim()) {
      return { success: false, error: 'Missing scanner code. Please scan the QR code again.' };
    }

    const records = this.getCheckins();

    // Duplicate check
    const dup = records.find(
      (r) =>
        r.rollNumber.trim().toLowerCase() === rollNumber.trim().toLowerCase() &&
        r.scannerId === scannedCode.trim()
    );
    if (dup) {
      return { success: false, error: `Roll Number ${rollNumber} has already checked in.` };
    }

    const newRecord: CheckinRecord = {
      id: 'r-' + Date.now(),
      name: name.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      timestamp: new Date().toISOString(),
      scannerId: scannedCode.trim(),
    };

    const updated = [newRecord, ...records];
    this._saveCheckins(updated);

    // Push to cloud so teacher's dashboard can pull it
    this._mergeAndPushToCloud(newRecord);

    return { success: true };
  },

  // ── Cloud sync ───────────────────────────────────────────────────────────────

  /**
   * Fetch cloud records, merge with local, save locally, and push the merged
   * result back to cloud. This ensures every device eventually has all records.
   */
  async fetchCloudCheckins(): Promise<CheckinRecord[]> {
    try {
      const res = await fetch(SYNC_URL);

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim() !== '') {
          const cloudData: CheckinRecord[] = JSON.parse(text);
          if (Array.isArray(cloudData) && cloudData.length > 0) {
            const local = this.getCheckins();
            const merged = this._merge(cloudData, local);
            this._saveCheckins(merged);
            return merged;
          }
        }
      }
    } catch (e) {
      console.warn('[PANDA] Cloud fetch failed — using local only.', e);
    }
    return this.getCheckins();
  },

  /**
   * Called after a student check-in: fetch cloud first, add the new record,
   * then push the merged list back. This prevents overwriting other students.
   */
  async _mergeAndPushToCloud(newRecord: CheckinRecord) {
    try {
      let cloudData: CheckinRecord[] = [];
      const res = await fetch(SYNC_URL);
      if (res.ok) {
        const text = await res.text();
        if (text && text.trim() !== '') {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) cloudData = parsed;
        }
      }

      // Merge: cloud first so we don't lose other students
      const merged = this._merge(cloudData, [newRecord]);
      await this._pushToCloud(merged);

      // Also update local so teacher dashboard sees it immediately if same browser
      this._saveCheckins(this._merge(this.getCheckins(), [newRecord]));
    } catch (e) {
      console.warn('[PANDA] Cloud push failed — record saved locally only.', e);
    }
  },

  async _pushToCloud(records: CheckinRecord[]) {
    await fetch(SYNC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(records),
    });
  },

  /** Merge two arrays of records deduped by id, newest first. */
  _merge(a: CheckinRecord[], b: CheckinRecord[]): CheckinRecord[] {
    const combined = [...a, ...b];
    const unique = combined.filter(
      (v, i, arr) => arr.findIndex((t) => t.id === v.id) === i
    );
    unique.sort(
      (x, y) => new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime()
    );
    return unique;
  },

  // ── Clear all records ────────────────────────────────────────────────────────

  async clearDatabase() {
    this._saveCheckins([]);
    try {
      await this._pushToCloud([]);
    } catch {
      /* ignore */
    }
  },

  // ── Pub/Sub ──────────────────────────────────────────────────────────────────

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notify() {
    listeners.forEach((l) => l());
  },
};
