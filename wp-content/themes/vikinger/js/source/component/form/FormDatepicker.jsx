const React = require('react');

const app = require('../../utils/core');

const dateUtils = require('../utils/date');

const IconSVG = require('../icon/IconSVG');

class FormDatepicker extends React.Component {
  constructor(props) {
    super(props);

    const dater = dateUtils();

    const dateValue = this.props.value !== '' ? this.props.value : new Date();

    this.date = {
      day: {
        name: `${this.props.name}_day`,
        value: dater.getDay(dateValue)
      },
      month: {
        name: `${this.props.name}_month`,
        value: dater.getMonth(dateValue)
      },
      year: {
        name: `${this.props.name}_year`,
        value: dater.getYear(dateValue)
      }
    };

    this.dater = dater;

    this.months = this.dater.getMonths();

    if (this.props.meta.range_type) {
      if (this.props.meta.range_type[0] === 'relative') {
        const currentYear = (new Date()).getFullYear(),
              yearRelativeStart = Number.parseInt(this.props.meta.range_relative_start[0], 10),
              yearRelativeEnd = Number.parseInt(this.props.meta.range_relative_end[0], 10);
  
        this.years = this.dater.getYears(currentYear + yearRelativeStart, currentYear + yearRelativeEnd);
      } else {
        const yearAbsoluteStart = Number.parseInt(this.props.meta.range_absolute_start[0], 10),
              yearAbsoluteEnd = Number.parseInt(this.props.meta.range_absolute_end[0], 10);

        this.years = this.dater.getYears(yearAbsoluteStart, yearAbsoluteEnd);
      }
    } else {
      const currentYear = (new Date()).getFullYear();

      this.years = this.dater.getYears(currentYear - 60, currentYear + 10);
    }

    this.state = {
      [this.date.day.name]: this.date.day.value,
      [this.date.month.name]: this.date.month.value,
      [this.date.year.name]: this.date.year.value,
      daysInMonthYear: this.dater.getDaysInMonthYear(this.date.month.value, this.date.year.value)
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const yearChanged = e.target.name === this.date.year.name,
          monthChanged = e.target.name === this.date.month.name;

    // if month or year changed
    if (monthChanged || yearChanged) {
      // validate that the current day value is still valid
      const date = {
        day: this.state[this.date.day.name],
        month: monthChanged ? e.target.value: this.state[this.date.month.name],
        year: yearChanged ? e.target.value: this.state[this.date.year.name]
      };

      // if current day value is not valid, set it to max possible value
      if (!this.dater.validDay(date.day, date.month, date.year)) {
        this.setState({
          [this.date.day.name]: this.dater.getMaxDaysInMonthYear(date.month, date.year)
        });
      }
    }

    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      this.setState((state, props) => {
        return {
          daysInMonthYear: this.dater.getDaysInMonthYear(state[this.date.month.name], state[this.date.year.name])
        };
      });

      const date = this.dater.getDateString(this.state[this.date.day.name], this.state[this.date.month.name], this.state[this.date.year.name]);

      this.props.onChange(date);
    });
  }

  render() {
    return (
      <div className="form-select-wrap">
        {/* FORM SELECT */}
        <div className="form-select">
          <label htmlFor={this.date.day.name}>{app.ucfirst(this.props.name)} - {vikinger_translation.day}</label>
          <select id={this.date.day.name} name={this.date.day.name} value={this.state[this.date.day.name]} onChange={this.onChange}>
          {
            this.state.daysInMonthYear.map((day) => {
              return (
                <option key={day} value={day}>{day}</option>
              );
            })
          }
          </select>
          <IconSVG icon="small-arrow" modifiers="form-select-icon" />
        </div>
        {/* FORM SELECT */}

        {/* FORM SELECT */}
        <div className="form-select">
          <label htmlFor={this.date.month.name}>{app.ucfirst(this.props.name)} - {vikinger_translation.month}</label>
          <select id={this.date.month.name} name={this.date.month.name} value={this.state[this.date.month.name]} onChange={this.onChange}>
          {
            this.months.map((month) => {
              return (
                <option key={month} value={month}>{month}</option>
              );
            })
          }
          </select>
          <IconSVG icon="small-arrow" modifiers="form-select-icon" />
        </div>
        {/* FORM SELECT */}

        {/* FORM SELECT */}
        <div className="form-select">
          <label htmlFor={this.date.year.name}>{app.ucfirst(this.props.name)} - {vikinger_translation.year}</label>
          <select id={this.date.year.name} name={this.date.year.name} value={this.state[this.date.year.name]} onChange={this.onChange}>
          {
            this.years.map((year) => {
              return (
                <option key={year} value={year}>{year}</option>
              );
            })
          }
          </select>
          <IconSVG icon="small-arrow" modifiers="form-select-icon" />
        </div>
        {/* FORM SELECT */}
      </div>
    );
  }
}

module.exports = FormDatepicker;