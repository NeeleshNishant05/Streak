const FALLBACK_NAME = 'Friend';

// "jane.doe_92@mail.com" -> "Jane Doe". Gives the mock user a friendly name
// without asking for one on the login screen.
export function nameFromEmail(email: string): string {
  const localPart = email.split('@')[0] ?? '';
  const words = localPart
    .replace(/[0-9]+/g, ' ')
    .split(/[._\-+\s]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  return words.length > 0 ? words.join(' ') : FALLBACK_NAME;
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}
