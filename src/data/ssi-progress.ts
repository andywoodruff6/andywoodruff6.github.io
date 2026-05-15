/**
 * SSI to 100M progress data.
 *
 * Update this monthly from the OCME registry numbers. Source of truth is
 * the monthly check-in in `~/SynologyDrive/agentic_brain/Theme - Scale Your Compute.md`
 * under "Monthly Master Goal Check in". When you update there, mirror here.
 */

export interface DIDBreakdownItem {
  type: string;
  count: number;
  notes?: string;
}

export interface MonthlySnapshot {
  month: string;            // ISO month, e.g. "2026-03"
  members: number;
  contentPieces: number;
  activeUploaders: number;
  totalDIDs: number;
  multiplier: number;       // DIDs per member
  breakdown: DIDBreakdownItem[];
  notes?: string;
}

export const TARGET_DIDS = 100_000_000;
export const TARGET_YEAR = 2034;

export const MISSION_STATEMENT =
  'Bring self-sovereign identity (SSI) technology to 100 million people by the end of 2034.';

export const SNAPSHOTS: MonthlySnapshot[] = [
  {
    month: '2026-02',
    members: 610,
    contentPieces: 4854,
    activeUploaders: 200,
    totalDIDs: 12_750, // midpoint of 11,000-14,500 estimate
    multiplier: 23,
    breakdown: [
      { type: 'Member DIDs', count: 610 },
      { type: 'Content DIDs', count: 12_140, notes: 'estimate, pre-registry-verification' },
    ],
    notes: 'First check-in. Numbers were estimates pending registry verification.',
  },
  {
    month: '2026-03',
    members: 651,
    contentPieces: 5_250,
    activeUploaders: 200,
    totalDIDs: 16_686,
    multiplier: 25.6,
    breakdown: [
      { type: 'Member DIDs', count: 651, notes: '1 per member' },
      { type: 'Content DIDs', count: 15_750, notes: '5,250 content × 3 DIDs each' },
      { type: 'Playlist DIDs', count: 60, notes: '~30-min streaming segments' },
      { type: 'Play Records', count: 60, notes: '1 per playlist per broadcast' },
      { type: 'Revenue Receipts', count: 15, notes: '~4-5 / month, 3 months' },
      { type: 'Payment Records', count: 150, notes: '1 per creator paid per month' },
    ],
    notes: 'First fully verified count. Four DID types previously uncounted now reconciled.',
  },
];

export function latest(): MonthlySnapshot {
  return SNAPSHOTS[SNAPSHOTS.length - 1]!;
}

export function progressPct(snapshot: MonthlySnapshot = latest()): number {
  return (snapshot.totalDIDs / TARGET_DIDS) * 100;
}

export function yearsRemaining(asOfYear = new Date().getFullYear()): number {
  return TARGET_YEAR - asOfYear;
}

/**
 * Required compounding rate to hit 100M from current count by target year,
 * expressed as annual multiplier (e.g. 3.0 = 3× per year).
 */
export function requiredAnnualMultiplier(snapshot: MonthlySnapshot = latest()): number {
  const yearsLeft = Math.max(yearsRemaining(), 1);
  return Math.pow(TARGET_DIDS / snapshot.totalDIDs, 1 / yearsLeft);
}
