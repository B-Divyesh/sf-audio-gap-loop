const PRODUCT_SLUG = 'audio-gap-loop';
const BILLING_BASE = import.meta.env.VITE_BILLING_BASE ?? 'https://api.sociobot.in/api/v1';
const LICENSE_KEY = `sb_license:${PRODUCT_SLUG}`;
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
const DAY = 86_400_000;

interface Verdict {
  valid: boolean;
  reason: string;
  expires_at?: string | null;
  checkedAt: number;
}

export interface LicenseState {
  token: string | null;
  unlocked: boolean;
  checking: boolean;
  message: string;
}

export const checkoutUrl = `${BILLING_BASE}/products/${PRODUCT_SLUG}/checkout`;

function cachedVerdict(): Verdict | null {
  try {
    return JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as Verdict | null;
  } catch {
    return null;
  }
}

export function initialLicenseState(): LicenseState {
  const token = localStorage.getItem(LICENSE_KEY);
  const verdict = cachedVerdict();
  return {
    token,
    unlocked: Boolean(token && verdict?.valid),
    checking: false,
    message: token && verdict?.valid ? 'Studio extras are active on this device.' : ''
  };
}

export function captureLicenseFromUrl(): boolean {
  const url = new URL(location.href);
  const token = url.searchParams.get('license')?.trim();
  if (!token) return false;
  localStorage.setItem(LICENSE_KEY, token);
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  return true;
}

export function saveLicenseToken(token: string): void {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export function clearLicense(): void {
  localStorage.removeItem(LICENSE_KEY);
  localStorage.removeItem(VERDICT_KEY);
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return { token: null, unlocked: false, checking: false, message: '' };
  const cached = cachedVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) {
    return {
      token,
      unlocked: cached.valid,
      checking: false,
      message: cached.valid ? 'Studio extras are active on this device.' : 'This license is no longer active.'
    };
  }
  try {
    const response = await fetch(`${BILLING_BASE}/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error(`Verification returned ${response.status}.`);
    const result = await response.json() as { valid: boolean; reason: string; expires_at?: string | null };
    const verdict: Verdict = { ...result, checkedAt: Date.now() };
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    return {
      token,
      unlocked: result.valid,
      checking: false,
      message: result.valid ? 'Studio extras are active on this device.' : 'This license is no longer active. You can restore another license below.'
    };
  } catch {
    return {
      token,
      unlocked: Boolean(cached?.valid),
      checking: false,
      message: cached?.valid ? 'Offline: using the last valid license check.' : 'Could not verify this license. Check your connection and try again.'
    };
  }
}
