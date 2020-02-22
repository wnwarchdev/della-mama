/*global flatpickr*/
/*eslint no-undef: "error"*/

import {select} from '../settings.js';
import {utils} from '../utils.js';
import BaseWidget from './baseWidget.js';


class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super (wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);


    thisWidget.initPlugin();

  } //end constructor

  initPlugin(){
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);

    thisWidget.maxDate = utils.addDays(thisWidget.minDate, 21);
    thisWidget.farDate = utils.dateToStr(thisWidget.maxDate);

    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.farDate,
      'disable': [
        function(date) {
          // return true to disable
          return (date.getDay() === 1); // 0 || date.getDay() === 6);

        }
      ],
      'locale': {
        'firstDayOfWeek': 1 // start week on Monday
      },

      onChange: function(dateStr){
        thisWidget.value = dateStr;
      },



    });


  }

  parseValue(value){
    return value;
  }

  isValid(){
    return true;
  }



  renderValue(){
    //console.log();
  }


} // end DatePicker


export default DatePicker;
