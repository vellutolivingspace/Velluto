/**
 * Country Dialing Codes and Location-based Auto-detection
 */

export interface CountryInfo {
  code: string;       // Dialing code without '+' (e.g. '91', '1', '971')
  name: string;       // Country name
  flag: string;       // Flag emoji
  iso: string;        // ISO 3166-1 alpha-2
}

export const COUNTRIES: CountryInfo[] = [
  { code: '91', name: 'India', flag: '🇮🇳', iso: 'IN' },
  { code: '971', name: 'UAE', flag: '🇦🇪', iso: 'AE' },
  { code: '1', name: 'USA / Canada', flag: '🇺🇸', iso: 'US' },
  { code: '44', name: 'United Kingdom', flag: '🇬🇧', iso: 'GB' },
  { code: '61', name: 'Australia', flag: '🇦🇺', iso: 'AU' },
  { code: '65', name: 'Singapore', flag: '🇸🇬', iso: 'SG' },
  { code: '966', name: 'Saudi Arabia', flag: '🇸🇦', iso: 'SA' },
  { code: '974', name: 'Qatar', flag: '🇶🇦', iso: 'QA' },
  { code: '968', name: 'Oman', flag: '🇴🇲', iso: 'OM' },
  { code: '965', name: 'Kuwait', flag: '🇰🇼', iso: 'KW' },
  { code: '973', name: 'Bahrain', flag: '🇧🇭', iso: 'BH' },
  { code: '49', name: 'Germany', flag: '🇩🇪', iso: 'DE' },
  { code: '33', name: 'France', flag: '🇫🇷', iso: 'FR' },
  { code: '39', name: 'Italy', flag: '🇮🇹', iso: 'IT' },
  { code: '34', name: 'Spain', flag: '🇪🇸', iso: 'ES' },
  { code: '31', name: 'Netherlands', flag: '🇳🇱', iso: 'NL' },
  { code: '41', name: 'Switzerland', flag: '🇨🇭', iso: 'CH' },
  { code: '60', name: 'Malaysia', flag: '🇲🇾', iso: 'MY' },
  { code: '64', name: 'New Zealand', flag: '🇳🇿', iso: 'NZ' },
  { code: '27', name: 'South Africa', flag: '🇿🇦', iso: 'ZA' },
  { code: '254', name: 'Kenya', flag: '🇰🇪', iso: 'KE' },
  { code: '255', name: 'Tanzania', flag: '🇹🇿', iso: 'TZ' },
  { code: '977', name: 'Nepal', flag: '🇳🇵', iso: 'NP' },
  { code: '94', name: 'Sri Lanka', flag: '🇱🇰', iso: 'LK' },
  { code: '880', name: 'Bangladesh', flag: '🇧🇩', iso: 'BD' },
  { code: '81', name: 'Japan', flag: '🇯🇵', iso: 'JP' },
  { code: '82', name: 'South Korea', flag: '🇰🇷', iso: 'KR' },
  { code: '86', name: 'China', flag: '🇨🇳', iso: 'CN' },
  { code: '852', name: 'Hong Kong', flag: '🇭🇰', iso: 'HK' },
  { code: '66', name: 'Thailand', flag: '🇹🇭', iso: 'TH' },
  { code: '62', name: 'Indonesia', flag: '🇮🇩', iso: 'ID' },
  { code: '63', name: 'Philippines', flag: '🇵🇭', iso: 'PH' },
  { code: '84', name: 'Vietnam', flag: '🇻🇳', iso: 'VN' },
  { code: '7', name: 'Russia', flag: '🇷🇺', iso: 'RU' },
  { code: '55', name: 'Brazil', flag: '🇧🇷', iso: 'BR' },
  { code: '52', name: 'Mexico', flag: '🇲🇽', iso: 'MX' },
  { code: '90', name: 'Turkey', flag: '🇹🇷', iso: 'TR' },
  { code: '20', name: 'Egypt', flag: '🇪🇬', iso: 'EG' },
  { code: '351', name: 'Portugal', flag: '🇵🇹', iso: 'PT' },
  { code: '46', name: 'Sweden', flag: '🇸🇪', iso: 'SE' },
  { code: '47', name: 'Norway', flag: '🇳🇴', iso: 'NO' },
  { code: '45', name: 'Denmark', flag: '🇩🇰', iso: 'DK' },
  { code: '353', name: 'Ireland', flag: '🇮🇪', iso: 'IE' },
];

/**
 * Detects the user's country code using browser timezone as instantaneous fallback,
 * combined with an asynchronous IP lookup service.
 */
export async function detectUserCountryCode(): Promise<string> {
  // 1. Instant zero-latency timezone detection
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('India')) return '91';
    if (tz.includes('Dubai')) return '971';
    if (tz.includes('London')) return '44';
    if (tz.includes('Singapore')) return '65';
    if (tz.includes('Riyadh')) return '966';
    if (tz.includes('Qatar')) return '974';
    if (tz.includes('Sydney') || tz.includes('Melbourne')) return '61';
    if (tz.includes('New_York') || tz.includes('Los_Angeles') || tz.includes('Chicago') || tz.includes('America/')) return '1';
    if (tz.includes('Berlin') || tz.includes('Frankfurt')) return '49';
    if (tz.includes('Paris')) return '33';
  } catch (err) {
    // Ignore and proceed to IP detection
  }

  // 2. Fetch IP-based country
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://api.country.is', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.country) {
        const found = COUNTRIES.find((c) => c.iso === data.country.toUpperCase());
        if (found) return found.code;
      }
    }
  } catch (err) {
    // Fallback if network/adblocker blocks IP service
  }

  // Default to India
  return '91';
}

/**
 * Strips all non-digit characters and ensures the country code is prefixed WITHOUT the '+' sign.
 * E.g.:
 *  - ('9876543210', '91')     => '919876543210'
 *  - ('+91 98765 43210', '91') => '919876543210'
 *  - ('09876543210', '91')    => '919876543210'
 *  - ('50 123 4567', '971')   => '971501234567'
 */
export function formatPhoneNumberForStorage(phoneInput: string, countryCode: string): string {
  if (!phoneInput) return '';

  let digits = phoneInput.replace(/\D/g, '');
  digits = digits.replace(/^0+/, ''); // Strip domestic leading zero

  const cleanCountry = countryCode.replace(/\D/g, '');

  // Check if digits already begin with the selected country code
  if (digits.startsWith(cleanCountry) && digits.length > cleanCountry.length + 5) {
    return digits;
  }

  return `${cleanCountry}${digits}`;
}
