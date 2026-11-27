import { getGreeting, getLastSevenDays } from '../src/utils/date';
import { initialsFromName, nameFromEmail } from '../src/utils/user';

describe('nameFromEmail', () => {
  it('turns the part before @ into a readable name', () => {
    expect(nameFromEmail('jane.doe_92@mail.com')).toBe('Jane Doe');
    expect(nameFromEmail('SAM@mail.com')).toBe('Sam');
  });

  it('falls back when there are no letters to use', () => {
    expect(nameFromEmail('1234@mail.com')).toBe('Friend');
  });
});

describe('initialsFromName', () => {
  it('uses the first and last word', () => {
    expect(initialsFromName('Jane Mary Doe')).toBe('JD');
    expect(initialsFromName('Sam')).toBe('S');
  });
});

describe('getGreeting', () => {
  const at = (hour: number) => new Date(2026, 0, 1, hour);

  it('matches the time of day', () => {
    expect(getGreeting(at(8))).toBe('Good morning');
    expect(getGreeting(at(14))).toBe('Good afternoon');
    expect(getGreeting(at(20))).toBe('Good evening');
    expect(getGreeting(at(2))).toBe('Good evening');
  });
});

describe('getLastSevenDays', () => {
  it('returns seven days, oldest first, ending today', () => {
    const days = getLastSevenDays(new Date(2026, 10, 26)); // Thursday
    expect(days).toHaveLength(7);
    expect(days.map(day => day.label).join('')).toBe('FSSMTWT');
    expect(days.filter(day => day.isToday)).toHaveLength(1);
    expect(days[6].isToday).toBe(true);
  });
});
