/*global rangeSlider*/
/*eslint no-undef: "error"*/

import {settings, select} from '../settings.js';
import {utils} from '../utils.js';
import BaseWidget from './baseWidget.js';


class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super (wrapper, settings.hours.open);
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

    thisWidget.initPlugin();


    thisWidget.parseValue();
    thisWidget.value = thisWidget.dom.input.value;


  } //end constructor

  initPlugin(){
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function(){ //czemu nie 'change'?
      thisWidget.parseValue();
      thisWidget.value = thisWidget.dom.input.value;

      //console.log('val:',thisWidget.value);
    });
  } //end initPlugin

  parseValue(){
    const thisWidget = this;
    //console.log('val:',thisWidget.value);
    //console.log(utils.numberToHour(thisWidget.value));
    return utils.numberToHour(thisWidget.value);
  } //end parseValue

  isValid(){
    return true;
  } //end isValid


  renderValue(){
    const thisWidget = this;
    //console.log(thisWidget.dom.output);
    //console.log(thisWidget.value);
    thisWidget.dom.output.innerHTML = thisWidget.value;
  } //end renderValue


} // end HourPicker


export default HourPicker;
