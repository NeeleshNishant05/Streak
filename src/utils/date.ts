export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return 'Good evening';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function formatToday(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export type WeekDay = {
  key: string;
  label: string;
  isToday: boolean;
};

// The last seven days, oldest first, ending with today.
export function getLastSevenDays(today: Date = new Date()): WeekDay[] {
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - index));
    return {
      key: day.toDateString(),
      label: day.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isToday: index === 6,
    };
  });
}
