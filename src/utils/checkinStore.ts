import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Local Storage Keys ───────────────────────────────────────────────────────
const ACTIVE_SCANNER_KEY = 'panda_active_scanner';
const FIXED_SCANNER_ID = 'sc-stable';

// ─── Firestore Collection ─────────────────────────────────────────────────────
const CHECKINS_COLLECTION = 'checkins';

// ─── Pub/Sub ──────────────────────────────────────────────────────────────────
type Listener = () => void;
const listeners = new Set<Listener>();

// In-memory cache of checkins (kept fresh by the Firestore real-time listener)
let _cachedCheckins: CheckinRecord[] = [];
let _firestoreUnsub: (() => void) | null = null;

// ─── Store ────────────────────────────────────────────────────────────────────
export const checkinStore = {
  // ── Scanner (still uses localStorage — only teacher device needs this) ───────

  getActiveScanner(): ScannerState {
    const data = localStorage.getItem(ACTIVE_SCANNER_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data) as ScannerState;
        if (parsed.id && parsed.codeValue) return parsed;
      } catch { /* fall through */ }
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

  // ── Real-time listener ────────────────────────────────────────────────────────

  /**
   * Start listening to Firestore in real-time.
   * Call this once on app mount. Returns an unsubscribe function.
   * Every time a student checks in from ANY device, the teacher's ledger updates instantly.
   */
  startRealtimeSync(): () => void {
    if (_firestoreUnsub) _firestoreUnsub(); // clean up old listener

    const q = query(
      collection(db, CHECKINS_COLLECTION),
      orderBy('timestamp', 'desc')
    );

    _firestoreUnsub = onSnapshot(
      q,
      (snapshot) => {
        _cachedCheckins = snapshot.docs.map((d) => d.data() as CheckinRecord);
        this.notify(); // triggers UI re-render in AttendanceSection
      },
      (err) => {
        console.error('[PANDA] Firestore real-time sync error:', err);
      }
    );

    return () => {
      if (_firestoreUnsub) {
        _firestoreUnsub();
        _firestoreUnsub = null;
      }
    };
  },

  // ── Read ──────────────────────────────────────────────────────────────────────

  /** Returns the in-memory cache (kept fresh by startRealtimeSync). */
  getCheckins(): CheckinRecord[] {
    return _cachedCheckins;
  },

  /** One-time fetch from Firestore (used for initial load before listener fires). */
  async fetchCheckins(): Promise<CheckinRecord[]> {
    try {
      const q = query(
        collection(db, CHECKINS_COLLECTION),
        orderBy('timestamp', 'desc')
      );
      const snap = await getDocs(q);
      _cachedCheckins = snap.docs.map((d) => d.data() as CheckinRecord);
      this.notify();
      return _cachedCheckins;
    } catch (e) {
      console.error('[PANDA] Firestore fetch error:', e);
      return [];
    }
  },

  // ── Add check-in (called from StudentScanPortal on student's device) ──────────

  async addCheckin(
    name: string,
    rollNumber: string,
    scannedCode: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!scannedCode || !scannedCode.trim()) {
      return { success: false, error: 'Missing scanner code. Please scan the QR code again.' };
    }

    const normalizedRoll = rollNumber.trim().toUpperCase();
    const normalizedCode = scannedCode.trim();

    // Duplicate check — query against current cached list
    const dup = _cachedCheckins.find(
      (r) =>
        r.rollNumber.toUpperCase() === normalizedRoll &&
        r.scannerId === normalizedCode
    );
    if (dup) {
      return { success: false, error: `Roll Number ${normalizedRoll} has already checked in.` };
    }

    const newRecord: CheckinRecord = {
      id: 'r-' + Date.now(),
      name: name.trim(),
      rollNumber: normalizedRoll,
      timestamp: new Date().toISOString(),
      scannerId: normalizedCode,
    };

    try {
      // Write to Firestore — this triggers the real-time listener on the
      // teacher's dashboard INSTANTLY across all devices.
      await setDoc(doc(db, CHECKINS_COLLECTION, newRecord.id), newRecord);
      return { success: true };
    } catch (e) {
      console.error('[PANDA] Firestore write error:', e);
      return { success: false, error: 'Failed to save check-in. Please try again.' };
    }
  },

  // ── Clear all records ─────────────────────────────────────────────────────────

  async clearDatabase(): Promise<void> {
    try {
      const snap = await getDocs(collection(db, CHECKINS_COLLECTION));
      const deletes = snap.docs.map((d) => deleteDoc(doc(db, CHECKINS_COLLECTION, d.id)));
      await Promise.all(deletes);
      // Cache clears automatically via the real-time listener
    } catch (e) {
      console.error('[PANDA] Firestore clear error:', e);
    }
  },

  // ── Pub/Sub ───────────────────────────────────────────────────────────────────

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notify() {
    listeners.forEach((l) => l());
  },
};
