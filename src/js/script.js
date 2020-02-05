/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      //priceElem2: '.product__base-price .no-spacing', - tbc
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };


  class Product {
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
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
      });
    }
    //Obliczanie ceny produktu
    processOrder(){
      /* save the element in thisProduct.data.params with key paramId as const param */
      const thisProduct = this;
      console.log('produkt to:', thisProduct.data.name);
      //console.log('jego paramy to:', thisProduct.data.params);
      //console.log('ID paramów to:', thisProduct.data.params[1]); //nie działa
      //console.log(thisProduct);

      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('default select:',formData);
      //console.log(formData);
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
            //console.log('cena w gore:',price);
          /* END IF: if option is selected and option is not default */
          }
          /* START ELSE IF: if option is not selected and option is default */
          else if (optionSelected == false && option.default) {
            /* deduct price of option from price */
            price = price - option.price;
            //console.log('cena w dol:',price);
            /* END ELSE IF: if option is not selected and option is default */
          }
          /* New IF: imageWrapper */
          //New const
          const productImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionID);
          //console.log(productImages);
          if (optionSelected == true) { //if selected add class
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
        thisProduct.priceElem.innerHTML = price;
        //console.log(thisProduct.priceElem);
      } //end of loop for each paramId

    } //end of process order

  } //end of Product







  const app = {
    initMenu: function(){
      const thisApp = this;
      //console.log('thisApp.data:', thisApp.data);

      for (let productData in thisApp.data.products){
        new Product (productData, thisApp.data.products[productData]);
      }


      /*
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);
      const testProduct = new Product();
      console.log('testProduct', testProduct);
      */
    },

    initData: function(){
      const thisApp = this;
      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      console.log('settings:', settings);
      //console.log('templates:', templates);


      thisApp.initData();
      thisApp.initMenu();
    },
  };





  app.init();
}
