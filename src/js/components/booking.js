import {select, templates} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './amountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking{
  constructor(bookElem){
    const thisBooking = this;
    thisBooking.render(bookElem);
    thisBooking.initWidgets();

  }
  render(bookElem){
    const thisBooking = this;
    //console.log('book elem booking:',bookElem);
    const generatedHTML = templates.bookingWidget(); //za cart
    thisBooking.dom = {};

    thisBooking.dom.wrapper = bookElem;
    const generatedDOM = utils.createDOMFromHTML(generatedHTML); //za renderInMenu
    //console.log('dom',generatedDOM);
    thisBooking.dom.wrapper.appendChild(generatedDOM); //za renderInMenu

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);   //select.widgets.datePicker.wrapper
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

  } //end render

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);

    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
  } //end initWidgets

} // end Booking

export default Booking;
