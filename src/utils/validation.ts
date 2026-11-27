// Deliberately simple: one "@", something before it, and a domain with a dot.
// Real address validation happens when a server sends a confirmation email.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MIN_PASSWORD_LENGTH = 6;

export function validateEmail(email: string): string | undefined {
  const value = email.trim();
  if (!value) return 'Enter your email address.';
  if (!EMAIL_PATTERN.test(value))
    return 'Enter a valid email, like name@example.com.';
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'Enter your password.';
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return undefined;
}
