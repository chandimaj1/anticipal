const dateUtils = function () {
  const me = {};

  me.getMaxDaysInMonthYear = function (month, year) {
    return (new Date(year, month, 0)).getDate();
  };

  me.getDaysInMonthYear = function (month, year) {
    const maxDay = me.getMaxDaysInMonthYear(month, year),
          days = [];

    for (let i = 1; i <= maxDay; i++) {
      days.push(i);
    }

    return days;
  };

  me.validDay = function (day, month, year) {
    const maxDay = me.getMaxDaysInMonthYear(month, year);

    return day <= maxDay;
  };

  me.getMonths = function () {
    const months = [];

    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }

    return months;
  };

  me.getYears = function (start, end) {
    const years = [];

    for (let i = end; i >= start; i--) {
      years.push(i);
    }

    return years;
  };

  me.getDay = function (date) {
    return (new Date(date)).getDate();
  };

  me.getMonth = function (date) {
    return (new Date(date)).getMonth() + 1;
  };

  me.getYear = function (date) {
    return (new Date(date)).getFullYear();
  };

  me.pad = function (number) {
    return number < 10 ? `0${number}` : number;
  };

  me.getDateString = function (day, month, year, dateSeparator = '-', hourSeparator = ':') {
    const date = new Date(year, month - 1, day),
          displayYear = date.getFullYear(),
          displayMonth = me.pad(date.getMonth() + 1),
          displayDay = me.pad(date.getDate()),
          displayHours = me.pad(date.getHours()),
          displayMinutes = me.pad(date.getMinutes()),
          displaySeconds = me.pad(date.getSeconds());

    return `${displayYear}${dateSeparator}${displayMonth}${dateSeparator}${displayDay} ${displayHours}${hourSeparator}${displayMinutes}${hourSeparator}${displaySeconds}`;
  };

  return me;
};

module.exports = dateUtils;