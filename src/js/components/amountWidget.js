import {settings, select} from '../settings.js';
import BaseWidget from './baseWidget.js';


class AmountWidget extends BaseWidget {
  constructor(element) {
    super (element, settings.amountWidget.defaultValue);
    const thisWidget = this;
    thisWidget.getElements(element);
    //thisWidget.value = settings.amountWidget.defaultValue;
    //thisWidget.setValue(thisWidget.dom.input.value);
    thisWidget.initActions();
    //console.log('Amount Widget:' , thisWidget);
    //console.log('constructor arguments:', element);
  } //end constructor
  getElements(){
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(value){
    return !isNaN(value)
    && value >= settings.amountWidget.defaultMin
    && value <= settings.amountWidget.defaultMax ;
  }




  renderValue(){
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;

  }


  initActions() {
    const thisWidget = this; //za Product
    //console.log(thisProduct);
    thisWidget.dom.input.addEventListener('change', function(){
      thisWidget.setValue(thisWidget.dom.input.value);
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  } // end initActions


} // end AmountWidget


export default AmountWidget;
