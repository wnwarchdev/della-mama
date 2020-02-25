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
    thisWidget.value = thisWidget.dom.input.value;

    //thisWidget.value = thisWidget.parseValue(thisWidget.dom.input.value);


  } //end constructor

  initPlugin(){
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function(){ //czemu nie 'change'?
      thisWidget.value = thisWidget.dom.input.value;//thisWidget.dom.input.value;
      //console.log('output:',thisWidget.parseValue(thisWidget.dom.input.value));
      //thisWidget.renderValue();
      //console.log('output:',thisWidget.value);
      //console.log('val:',thisWidget.value);
    });
  } //end initPlugin

  parseValue(value){
    //console.log(value);
    //console.log('parsed', utils.numberToHour(value));
    //const thisWidget = this;
    //console.log('val:',thisWidget.value);
    //console.log(utils.numberToHour(thisWidget.value));
    return utils.numberToHour(value);
  } //end parseValue

  isValid(){
    return true;
  } //end isValid


  renderValue(){
    const thisWidget = this;
    //console.log(thisWidget.dom.output);
    //console.log(thisWidget.value);
    thisWidget.dom.output.innerHTML = thisWidget.value;//; //tutaj licho siedziało...
    //console.log(thisWidget.dom.output.innerHTML);
    //console.log(thisWidget.value);
  } //end renderValue


} // end HourPicker


export default HourPicker;
