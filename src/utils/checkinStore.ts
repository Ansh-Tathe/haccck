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

// Setup default mock records
const DEFAULT_MOCK_CHECKINS: CheckinRecord[] = [
  { id: 'c1', name: 'Sarah Chen', rollNumber: 'CS2023-085', timestamp: new Date(Date.now() - 120000).toISOString(), scannerId: 'sc-mock-1' },
  { id: 'c2', name: 'Liam Rodriguez', rollNumber: 'ROB2023-012', timestamp: new Date(Date.now() - 300000).toISOString(), scannerId: 'sc-mock-1' },
  { id: 'c3', name: 'Emily Watson', rollNumber: 'FIN2024-045', timestamp: new Date(Date.now() - 600000).toISOString(), scannerId: 'sc-mock-0' }
];

type Listener = () => void;
const listeners = new Set<Listener>();

export const checkinStore = {
  // Get all checkins
  getCheckins(): CheckinRecord[] {
    const data = localStorage.getItem(CHECKINS_KEY);
    if (!data) {
      localStorage.setItem(CHECKINS_KEY, JSON.stringify(DEFAULT_MOCK_CHECKINS));
      return DEFAULT_MOCK_CHECKINS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_MOCK_CHECKINS;
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
    const scanner = this.getActiveScanner();
    const isMock = scannerIdOrCode.startsWith('sc-mock');
    const matchesCurrent = isMock || scanner.id === scannerIdOrCode || scanner.codeValue === scannerIdOrCode;

    if (!matchesCurrent) {
      return { success: false, error: 'Scanner session has expired. Please scan the current code.' };
    }
    if (Date.now() > scanner.expiresAt && !isMock) {
      this.generateNewScanner();
      return { success: false, error: 'The ticket has expired. Re-scanning new ticket...' };
    }

    const records = this.getCheckins();
    const targetScannerId = isMock ? scannerIdOrCode : scanner.id;
    
    // Duplicate check
    const duplicate = records.find(r => r.rollNumber.trim().toLowerCase() === rollNumber.trim().toLowerCase() && r.scannerId === targetScannerId);
    if (duplicate) {
      return { success: false, error: `Roll Number ${rollNumber} has already checked in for this session.` };
    }

    const newRecord: CheckinRecord = {
      id: 'r-' + Date.now(),
      name: name.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      timestamp: new Date().toISOString(),
      scannerId: targetScannerId
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
