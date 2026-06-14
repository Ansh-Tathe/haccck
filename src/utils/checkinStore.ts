export interface CheckinRecord {
  id: string;
  name: string;
  rollNumber: string;
  timestamp: string;
  scannerId: string;
}

export interface ScannerState {
  id: string;
  createdAt: number; // timestamp ms
  expiresAt: number; // timestamp ms
  codeValue: string; // token hash
}

// Key for local storage
const CHECKINS_KEY = 'panda_checkins_data';
const ACTIVE_SCANNER_KEY = 'panda_active_scanner';

// Public sync endpoints using KVDB key-value storage
const SYNC_URL = 'https://kvdb.io/panda_sync_dex_workspace_98242/checkins_v1';


type Listener = () => void;
const listeners = new Set<Listener>();

export const checkinStore = {
  // Get all checkins
  getCheckins(): CheckinRecord[] {
    const data = localStorage.getItem(CHECKINS_KEY);
    if (!data) {
      localStorage.setItem(CHECKINS_KEY, JSON.stringify([]));
      return [];
    }
    try {
      const parsed: CheckinRecord[] = JSON.parse(data);
      // Filter out any mock checkins (whose ids are 'c1', 'c2', 'c3')
      const filtered = parsed.filter(r => !['c1', 'c2', 'c3'].includes(r.id));
      if (filtered.length !== parsed.length) {
        localStorage.setItem(CHECKINS_KEY, JSON.stringify(filtered));
      }
      return filtered;
    } catch {
      return [];
    }
  },

  // Save checkins list locally
  saveCheckins(records: CheckinRecord[]) {
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(records));
    this.notify();
  },

  // Get active scanner details
  getActiveScanner(): ScannerState {
    const data = localStorage.getItem(ACTIVE_SCANNER_KEY);
    if (data) {
      try {
        const scanner: ScannerState = JSON.parse(data);
        if (Date.now() < scanner.expiresAt) {
          return scanner;
        }
      } catch {
        // Fall through
      }
    }
    return this.generateNewScanner();
  },

  // Generate a new scanner expiring in 5 minutes
  generateNewScanner(): ScannerState {
    const now = Date.now();
    const durationMs = 5 * 60 * 1000; // 5 minutes
    const randomHash = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newScanner: ScannerState = {
      id: 'sc-' + now,
      createdAt: now,
      expiresAt: now + durationMs,
      codeValue: `PANDA-SEC-${randomHash}`
    };
    localStorage.setItem(ACTIVE_SCANNER_KEY, JSON.stringify(newScanner));

    // Also push to active scanner history list in localStorage to allow validation of recently rotated codes
    const historyData = localStorage.getItem('panda_scanner_history');
    let history: ScannerState[] = [];
    if (historyData) {
      try {
        history = JSON.parse(historyData);
      } catch {
        history = [];
      }
    }
    history.push(newScanner);
    // Keep only the last 10 entries
    if (history.length > 10) {
      history = history.slice(history.length - 10);
    }
    localStorage.setItem('panda_scanner_history', JSON.stringify(history));

    this.notify();
    return newScanner;
  },

  // Sync cloud database database ledger
  async fetchCloudCheckins(): Promise<CheckinRecord[]> {
    try {
      const res = await fetch(SYNC_URL);
      if (res.status === 404) {
        // First initialization, write mock records
        const local = this.getCheckins();
        await this.pushCloudCheckins(local);
        return local;
      }
      if (res.ok) {
        const cloudData = await res.json();
        if (Array.isArray(cloudData)) {
          const local = this.getCheckins();
          // Merge unique rows (by id)
          const merged = [...cloudData, ...local].filter(
            (v, i, a) => a.findIndex(t => t.id === v.id) === i
          );
          
          // Sort check-ins descending by timestamp
          merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          localStorage.setItem(CHECKINS_KEY, JSON.stringify(merged));
          this.notify();
          return merged;
        }
      }
    } catch (e) {
      console.warn('Network sync offline. Syncing locally.', e);
    }
    return this.getCheckins();
  },

  // Push checkins to cloud database
  async pushCloudCheckins(records: CheckinRecord[]) {
    try {
      await fetch(SYNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(records)
      });
    } catch (e) {
      console.warn('Failed to upload checkpoints to sync cloud.', e);
    }
  },

  // Submit checkin form
  addCheckin(name: string, rollNumber: string, scannerIdOrCode: string): { success: boolean; error?: string } {
    const isMock = scannerIdOrCode.startsWith('sc-mock');
    if (isMock) {
      return this.processCheckinRecord(name, rollNumber, scannerIdOrCode);
    }

    // Load scanner history to check if the code/ID corresponds to a valid session
    const historyData = localStorage.getItem('panda_scanner_history');
    let history: ScannerState[] = [];
    if (historyData) {
      try {
        history = JSON.parse(historyData);
      } catch {
        history = [];
      }
    }

    // Include the current active scanner too
    const active = this.getActiveScanner();
    if (active && !history.some(h => h.id === active.id)) {
      history.push(active);
    }

    // Find the scanner session that matches the scannerIdOrCode
    const matchedScanner = history.find(h => h.id === scannerIdOrCode || h.codeValue === scannerIdOrCode);

    if (!matchedScanner) {
      return { success: false, error: 'Scanner session has expired. Please scan the current code.' };
    }

    if (Date.now() > matchedScanner.expiresAt) {
      return { success: false, error: 'The ticket has expired. Re-scanning new ticket...' };
    }

    return this.processCheckinRecord(name, rollNumber, matchedScanner.id);
  },

  processCheckinRecord(name: string, rollNumber: string, scannerId: string): { success: boolean; error?: string } {
    const records = this.getCheckins();
    
    // Duplicate check
    const duplicate = records.find(r => r.rollNumber.trim().toLowerCase() === rollNumber.trim().toLowerCase() && r.scannerId === scannerId);
    if (duplicate) {
      return { success: false, error: `Roll Number ${rollNumber} has already checked in for this session.` };
    }

    const newRecord: CheckinRecord = {
      id: 'r-' + Date.now(),
      name: name.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      timestamp: new Date().toISOString(),
      scannerId
    };

    const updated = [newRecord, ...records];
    this.saveCheckins(updated);

    // Push updates asynchronously to cloud key-value store
    this.pushCloudCheckins(updated);

    return { success: true };
  },

  // Clear database
  async clearDatabase() {
    localStorage.setItem(CHECKINS_KEY, JSON.stringify([]));
    this.notify();
    try {
      await this.pushCloudCheckins([]);
    } catch {
      // Ignore
    }
    this.generateNewScanner();
  },

  // Subscribe to changes
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  notify() {
    listeners.forEach(l => l());
  }
};
