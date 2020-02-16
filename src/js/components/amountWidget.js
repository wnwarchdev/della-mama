import {settings, select} from '../settings.js';


class AmountWidget {
  constructor(element) {
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.value = settings.amountWidget.defaultValue;
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();
    //console.log('Amount Widget:' , thisWidget);
    //console.log('constructor arguments:', element);
  } //end constructor
  getElements(element){
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }
  setValue(value) {

    const thisWidget = this;
    const newValue = parseInt(value);
    // [DONE] validation
    //console.log(value);
    if ( (newValue >= settings.amountWidget.defaultMin) && (newValue <= settings.amountWidget.defaultMax) && (newValue !== thisWidget.value ) ) { //newValue !== value || newValue >= settings.amountWidget.defaultMin || newValue <= settings.amountWidget.defaultMax
      thisWidget.value = newValue;
      thisWidget.announce();
    }



    thisWidget.input.value = thisWidget.value;
  }



  initActions() {
    const thisWidget = this; //za Product
    //console.log(thisProduct);
    thisWidget.input.addEventListener('change', function(){
      thisWidget.setValue(thisWidget.input.value);
    });

    thisWidget.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  } // end initActions

  announce(){
    const thisWidget = this;
    const event = new Event ('custom', {bubbles: true});
    thisWidget.element.dispatchEvent(event); //dispatch event?
    //alert('happened');
  }
} // end AmountWidget


export default AmountWidget;
