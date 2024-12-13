const englishMonthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const getEnglishMonthName = (month: number) => {
  if (month < 0 || month > 11) {
    return undefined;
  }

  return englishMonthNames[month];
};
