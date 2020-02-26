//import {settings} from '../settings.js';

class BaseWidget {
  constructor(wrapperElement, initialValue) {
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;
    //console.log('BaseWidget');
  }

  get value(){
    const thisWidget = this;
    return thisWidget.correctValue;
  }

  set value(value) {
    const thisWidget = this;
    const newValue = thisWidget.parseValue(value);
    // [DONE] validation
    //console.log(value);
    if ( newValue != thisWidget.correctValue && thisWidget.isValid(newValue))  { //newValue !== value || newValue >= settings.amountWidget.defaultMin || newValue <= settings.amountWidget.defaultMax
      thisWidget.correctValue = newValue;
      thisWidget.announce();
    }
    thisWidget.renderValue();
  }

  setValue(value){
    const thisWidget = this;
    thisWidget.value = value;

  }

  parseValue(value){
    return parseInt(value);
  }

  isValid(value){
    return !isNaN(value);
  }

  renderValue(){
    const thisWidget = this;
    thisWidget.dom.wrapper.innerHTML = thisWidget.value;

  }

  announce(){
    const thisWidget = this;
    const event = new Event ('custom', {bubbles: true});
    thisWidget.dom.wrapper.dispatchEvent(event); //dispatch event?
    //alert('happened');
  }



} //end BaseWidget

export default BaseWidget;
