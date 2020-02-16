import {select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './amountWidget.js';

class Product {
  constructor(id, data){
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    //console.log('new Product:', thisProduct);
  }
  renderInMenu(){
    const thisProduct = this;

    /* geterate HTML of singlw product */
    const generatedHTML = templates.menuProduct(thisProduct.data);
    //console.log(generatedHTML);
    /* create DOM element based on product code */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu cntainer */
    const menuContainer = document.querySelector(select.containerOf.menu);
    /* add created DOM element to menu container */
    menuContainer.appendChild(thisProduct.element);
  }

  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);

    //console.log(thisProduct.form);
    //console.log(thisProduct.formInputs);

  }

  initAccordion(){
    const thisProduct = this;
    /* [DONE]find the clickable trigger (the element that should react to clicking) */
    const trigger = thisProduct.accordionTrigger; //stala z elementem clickable
    //console.log(trigger); headery...
    /* [DONE]START: click event listener to trigger */
    trigger.addEventListener ('click', function() { //dodajemy event listener do elementów w stalej trigger
      /* [DONE]prevent default action for event */
      event.preventDefault(); //czemu to dodajemy, skoro w headerze nie ma linkow i buttonow?
      /* [DONE]toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive); // dodaje klase active/ lub toggle? //za obiektem...
      /* [DONE]find all active products */
      const activeAll = document.querySelectorAll('.product.active'); //zapisuje wszystkie elementy z klasa active do consta // .product aby pominac .product-images....
      //console.log(activeAll);
      /* [DONE]START LOOP: for each active product */
      for (let activeSingle of activeAll) { //iteruje po arrayu z wszystkich produktów z klasą active
      /* [DONE]START: if the active product isn't the element of thisProduct */
      //console.log(activeSingle);
        if (activeSingle !== thisProduct.element) { // funkcja if sprawdzajaca czy element z acive nie nalezy do kliknietego headera...
        /* [DONE]remove class active for the active product */
          //console.log(activeSingle);
          activeSingle.classList.toggle('active'); //przełącza z klasy active / add nieco lepsze
          /* [DONE]END: if the active product isn't the element of thisProduct */
        } //koniec funkcji if
        /* [DONE] END LOOP: for each active product */
      } // koniec funkcji for iterujacej elementy tablicy
      /* [DONE] END: click event listener to trigger */
    }// koniec funkcji anonimowej
    ); //zamkniecie nawiasu argumentów listenera
  }// koniec deklaracji initAccordion()


  initOrderForm(){
    const thisProduct = this;
    //console.log(thisProduct);
    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  //Obliczanie ceny produktu
  processOrder(){
    /* save the element in thisProduct.data.params with key paramId as const param */
    const thisProduct = this;
    //console.log('produkt to:', thisProduct.data.name);
    //console.log('jego paramy to:', thisProduct.data.params);
    //console.log('ID paramów to:', thisProduct.data.params[1]); //nie działa
    //console.log(thisProduct);

    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('default select:',formData);
    //console.log(formData);

    thisProduct.params = {};
    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price; //cena gotowego produktu
    //console.log('product price:',price);
    //console.log(price);
    /* START LOOP: for each paramId in thisProduct.data.params */
    for (let paramId in thisProduct.data.params) {
      //console.log('paramId to: ',paramId);
      /* save the element in thisProduct.data.params with key paramId as const param */
      const param = this.data.params[paramId];
      //console.log('to id to',param);
      /* START LOOP: for each optionId in param.options */
      for (let optionID in param.options) { //czemu nie thisProduct.data.params //ok niewazne...
        //console.log('opcje tego id to:', optionID);
        /* save the element in param.options with key optionId as const option */
        const option = param.options[optionID];
        //console.log('optionId:',optionID);
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionID) > -1; //co to jest >-1?
        /* START IF: if option is selected and option is not default */
        if (optionSelected && (option.default==null)) { //==false nie działa //jak zapisac not deafult? !== ?
          /* add price of option to variable price */
          price = price + option.price;
        //  console.log('cena w gore:',price);
        /* END IF: if option is selected and option is not default */
        }
        /* START ELSE IF: if option is not selected and option is default */
        else if (optionSelected == false && option.default) {
          /* deduct price of option from price */
          price = price - option.price;
        //  console.log('cena w dol:',price);
          /* END ELSE IF: if option is not selected and option is default */
        }
        /* New IF: imageWrapper */
        //New const
        const productImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionID);
        //console.log(productImages);
        if (optionSelected == true) { //if selected add class

          if(!thisProduct.params[paramId]){ //
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
            thisProduct.params[paramId].options[optionID] = option.label;

          }

          for (let image of productImages) {
            //console.log(image);
            image.classList.add(classNames.menuProduct.imageVisible);
            //console.log('activated');
          }
        }
        else {
          for (let image of productImages) { //if selected remove class
            image.classList.remove(classNames.menuProduct.imageVisible);
            //console.log('DEactivated');
          }
        } //END   imageWrapper If
      /* END LOOP: for each optionId in param.options */
      }
      /* set the contents of thisProduct.priceElem to be the value of variable price */
      /*new: multiply price by amount */
      //console.log('price:',price);
      //console.log('multiplier:',thisProduct.amountWidget.value); //pizze liczą sie trzykrotnie ?
      //console.log(thisProduct.priceElem);
    } //end of loop for each paramId

    //let multiplier = thisProduct.amountWidget.value;
    //let priceMultiplied = price * multiplier;
    //price *= thisProduct.amountWidget.value;
    //thisProduct.priceElem.innerHTML = price;

    /* multiply price by amount */
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;
    //console.log('paramy:',thisProduct.params);


  } //end of process order

  initAmountWidget(){
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('custom', function () {  // za product
      thisProduct.processOrder();
    });
  }

  addToCart(){
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name; //nazwa produktu
    //console.log(thisProduct.name);
    thisProduct.amount = thisProduct.amountWidget.value; //ilość produktu
    //console.log(thisProduct.amount);
    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }

} //end of Product

export default Product;
