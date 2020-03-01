import {select, settings, templates, classNames} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './amountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking{
  constructor(bookElem){
    const thisBooking = this;
    thisBooking.render(bookElem);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.pickTable();
    thisBooking.clearTables();
    thisBooking.clearInputs();

  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam
      ],

    };


    //console.log('get data params:' , params);


    const urls = {
      booking:        settings.db.url + '/' + settings.db.booking
                                      + '?' + params.booking.join('&'),
      eventsCurrent:  settings.db.url + '/' + settings.db.event
                                      + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:   settings.db.url + '/' + settings.db.event
                                      + '?' + params.eventsRepeat.join('&'),

    };

    //console.log('get data urls:' , urls);
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all ([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]){
        console.log(bookings);
        //console.log(eventsCurrent);
        //console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });


  } //end getData

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};


    for (let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate,1)){
          thisBooking.makeBooked( utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    thisBooking.updateDOM();
    //console.log(thisBooking.booked);
  } //end parseData

  makeBooked (date, hour, duration, table){
    const thisBooking = this;
    console.log('makeBooked');

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }
    const startHour = utils.hourToNumber(hour);
    //console.log('startHour',startHour);


    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
    //console.log('thisBooking.booked:', thisBooking.booked);
  } //end makeBooked


  pickTable(){
    const thisBooking = this;
    for (let table of thisBooking.dom.tables) {
      table.addEventListener('click', function () {
        thisBooking.clearTables(); // bez tego moznaby bookowac kilka stolikow na raz...
        let tableNum = table.innerHTML.slice(6, 7);
        thisBooking.selectedTable = parseInt(tableNum);
        table.classList.toggle('table-selected');
      });
    }
  }

  clearTables(){
    const thisBooking = this;
    for (let table of thisBooking.dom.tables) {
      table.classList.remove('table-selected');
    }
  }


  clearInputs(){
    const thisBooking = this;

    thisBooking.dom.phone.value = null;
    thisBooking.dom.address.value = null;
    //console.log('all clear!');
  }


  updateDOM(){
    const thisBooking = this;
    console.log('dom updated');
    thisBooking.date = thisBooking.datePicker.value;
    //console.log('ddoomm', thisBooking.datePicker.value);
    //console.log('ddoomm', typeof(thisBooking.datePicker.value));
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    //console.log( 'updateDOM', typeof(thisBooking.hour));

    let allAvailable = false;
    //console.log(allAvailable);

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
      //console.log(allAvailable);
    }

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        //console.log(tableId);
        tableId = parseInt(tableId);
        //console.log('parsed');
      }

      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) //co tu siedziało
      ){
        table.classList.add(classNames.booking.tableBooked);
        //console.log('added');
      } else {
        table.classList.remove(classNames.booking.tableBooked);
        //console.log('removed');
      }
    }
  }// end updateDOM



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

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    //console.log(thisBooking.dom.tables);
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
    //console.log(thisBooking.dom.form);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    //console.log(thisBooking.dom.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    //console.log(thisBooking.dom.address);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);
    //console.log(thisBooking.dom.starters);

  } //end render

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('custom', function(){ //custom zamiast updated...

      thisBooking.updateDOM();

      //console.log('updated by listener');
    });

    thisBooking.dom.hourPicker.addEventListener('custom', function() {
      thisBooking.clearTables();
      // for (let table of thisBooking.dom.tables) {
      //   table.classList.remove('table-selected');
      // }
    });

    thisBooking.dom.datePicker.addEventListener('change', function() {
      thisBooking.clearTables();
      // for (let table of thisBooking.dom.tables) {
      //   table.classList.remove('table-selected');
      // }
    });

    thisBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (thisBooking.selectedTable !== 0) {
        console.log(thisBooking.selectedTable);
        thisBooking.sendReservation();
      } else {
        alert('Pick any table to proceed');
      }

    });


  } //end initWidgets

  sendReservation() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
    //console.log('sendReservation URL:', url);

    const payload = {
      date: thisBooking.date,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.selectedTable,
      ppl: thisBooking.peopleAmount.value,
      duration: thisBooking.hoursAmount.value,
      starters: [],
      phone: thisBooking.dom.phone.value,
      adress: thisBooking.dom.address.value,
    };

    for (let starter of thisBooking.dom.starters) { //za sendOrder
      if (starter.checked == true) {
        payload.starters.push(starter.value);
        //console.log(payload.starters);
      }
    }

    console.log('sendReservation payload:',payload);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    fetch(url, options)
      .then(function(response) {
        return response.json();
      }).then(function (parsedResponse) {
        console.log('parsedResponse: ', parsedResponse);
      });
    console.log('order sent');

    thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
    console.log('makeBooking payload:',payload.date, payload.hour, payload.duration, payload.table);

    thisBooking.clearTables();
    thisBooking.updateDOM();
    thisBooking.clearInputs();



  } // end sendReservation

} // end Booking

export default Booking;
