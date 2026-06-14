export interface CheckinRecord {
  id: string;
  name: string;
  rollNumber: string;
  timestamp: string;
  scannerId: string;
}

export interface ScannerState {
  id: string;
  codeValue: string; // token shown in QR
}

// LocalStorage keys
const CHECKINS_KEY = 'panda_checkins_data';
const ACTIVE_SCANNER_KEY = 'panda_active_scanner';

// Cloud sync endpoint
const SYNC_URL = 'https://kvdb.io/panda_sync_dex_workspace_98242/checkins_v1';

// Fixed scanner ID — never changes
const FIXED_SCANNER_ID = 'sc-stable';

type Listener = () => void;
const listeners = new Set<Listener>();

export const checkinStore = {
  // ─── Scanner ─────────────────────────────────────────────────────────────

  /**
   * Returns the ONE persistent scanner. Creates it once and never regenerates.
   * The codeValue is fixed for the lifetime of the localStorage, so QR codes
   * never become stale.
   */
  getActiveScanner(): ScannerState {
    const data = localStorage.getItem(ACTIVE_SCANNER_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data) as ScannerState;
        // Validate shape — must have id and codeValue
        if (parsed.id && parsed.codeValue) {
          return parsed;
        }
      } catch {
        // Fall through to create
      }
    }
    // First-time creation only
    return this._createScanner();
  },

  /** Internal: create and persist a brand-new scanner (called once ever). */
  _createScanner(): ScannerState {
    const randomHash = Math.random().toString(36).substring(2, 10).toUpperCase();
    const scanner: ScannerState = {
      id: FIXED_SCANNER_ID,
      codeValue: `PANDA-${randomHash}`,
    };
    localStorage.setItem(ACTIVE_SCANNER_KEY, JSON.stringify(scanner));
    this.notify();
    return scanner;
  },

  // ─── Check-ins ────────────────────────────────────────────────────────────

  getCheckins(): CheckinRecord[] {
    const data = localStorage.getItem(CHECKINS_KEY);
    if (!data) {
      localStorage.setItem(CHECKINS_KEY, JSON.stringify([]));
      return [];
    }
    try {
      const parsed: CheckinRecord[] = JSON.parse(data);
      // Strip any legacy mock records
      const filtered = parsed.filter(r => !['c1', 'c2', 'c3'].includes(r.id));
      if (filtered.length !== parsed.length) {
        localStorage.setItem(CHECKINS_KEY, JSON.stringify(filtered));
      }
      return filtered;
    } catch {
      return [];
    }
  },

  saveCheckins(records: CheckinRecord[]) {
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(records));
    this.notify();
  },

  // ─── Add Check-in ─────────────────────────────────────────────────────────

  addCheckin(
    name: string,
    rollNumber: string,
    scannedCode: string
  ): { success: boolean; error?: string } {
    const scanner = this.getActiveScanner();

    // Accept both the codeValue (what's in the QR URL) and the id
    const isValid =
      scannedCode === scanner.codeValue || scannedCode === scanner.id;

    if (!isValid) {
      return {
        success: false,
        error: `Invalid scanner code. Please scan the QR code again.`,
      };
    }

    return this._processCheckin(name, rollNumber, scanner.id);
  },

  _processCheckin(
    name: string,
    rollNumber: string,
    scannerId: string
  ): { success: boolean; error?: string } {
    const records = this.getCheckins();

    // Duplicate check per session
    const duplicate = records.find(
      r =>
        r.rollNumber.trim().toLowerCase() ===
          rollNumber.trim().toLowerCase() && r.scannerId === scannerId
    );
    if (duplicate) {
      return {
        success: false,
        error: `Roll Number ${rollNumber} has already checked in for this session.`,
      };
    }

    const newRecord: CheckinRecord = {
      id: 'r-' + Date.now(),
      name: name.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      timestamp: new Date().toISOString(),
      scannerId,
    };

    const updated = [newRecord, ...records];
    this.saveCheckins(updated);
    this.pushCloudCheckins(updated);
    return { success: true };
  },

  // ─── Cloud Sync ───────────────────────────────────────────────────────────

  async fetchCloudCheckins(): Promise<CheckinRecord[]> {
    try {
      const res = await fetch(SYNC_URL);
      if (res.status === 404) {
        const local = this.getCheckins();
        await this.pushCloudCheckins(local);
        return local;
      }
      if (res.ok) {
        const cloudData = await res.json();
        if (Array.isArray(cloudData)) {
          const local = this.getCheckins();
          const merged = [...cloudData, ...local].filter(
            (v, i, a) => a.findIndex(t => t.id === v.id) === i
          );
          merged.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          localStorage.setItem(CHECKINS_KEY, JSON.stringify(merged));
          this.notify();
          return merged;
        }
      }
    } catch (e) {
      console.warn('Network sync offline. Using local data.', e);
    }
    return this.getCheckins();
  },

  async pushCloudCheckins(records: CheckinRecord[]) {
    try {
      await fetch(SYNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(records),
      });
    } catch (e) {
      console.warn('Cloud push failed (offline).', e);
    }
  },

  // ─── Clear ────────────────────────────────────────────────────────────────

  /**
   * Clears all attendance records but keeps the same scanner alive.
   * The QR code URL does NOT change.
   */
  async clearDatabase() {
    localStorage.setItem(CHECKINS_KEY, JSON.stringify([]));
    this.notify();
    try {
      await this.pushCloudCheckins([]);
    } catch {
      // Ignore
    }
  },

  // ─── Pub/Sub ──────────────────────────────────────────────────────────────

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  notify() {
    listeners.forEach(l => l());
  },
};
