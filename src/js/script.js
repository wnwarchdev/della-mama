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
        thisProduct.element.classList.add('active'); // dodaje klase active/ lub toggle?
        /* [DONE]find all active products */
        const activeAll = document.querySelectorAll('.active'); //zapisuje wszystkie elementy z klasa active do consta
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
      const thisProduct = this;
      console.log(thisProduct);
    }




  }


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
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);


      thisApp.initData();
      thisApp.initMenu();
    },
  };





  app.init();
}
