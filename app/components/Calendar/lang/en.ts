// Default (English) texts for the Calendar component.
// Copy this file to create a new language and pass it through the `lang` prop.
const en = {
  // Weekdays (Monday-first)
  mon: "Mo",
  tue: "Tu",
  wed: "We",
  thu: "Th",
  fri: "Fr",
  sat: "Sa",
  sun: "Su",

  // Months
  january: "January",
  february: "February",
  march: "March",
  april: "April",
  may: "May",
  june: "June",
  july: "July",
  august: "August",
  september: "September",
  october: "October",
  november: "November",
  december: "December",

  // Messages
  noDates: "No dates available",
};

export type CalendarLang = Record<keyof typeof en, string>;

export default en satisfies CalendarLang;
