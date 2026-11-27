import { validateEmail, validatePassword } from '../src/utils/validation';

describe('validateEmail', () => {
  it('asks for an email when empty or only spaces', () => {
    expect(validateEmail('')).toBe('Enter your email address.');
    expect(validateEmail('   ')).toBe('Enter your email address.');
  });

  it.each([
    'jane',
    'jane@',
    'jane@example',
    'jane@example.c',
    'ja ne@example.com',
  ])('rejects %p', email => {
    expect(validateEmail(email)).toBe(
      'Enter a valid email, like name@example.com.',
    );
  });

  it.each(['jane@example.com', '  jane.doe+habits@mail.co.uk  '])(
    'accepts %p',
    email => {
      expect(validateEmail(email)).toBeUndefined();
    },
  );
});

describe('validatePassword', () => {
  it('asks for a password when empty', () => {
    expect(validatePassword('')).toBe('Enter your password.');
  });

  it('requires at least 6 characters', () => {
    expect(validatePassword('12345')).toBe(
      'Password must be at least 6 characters.',
    );
    expect(validatePassword('123456')).toBeUndefined();
  });
});
