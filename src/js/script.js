/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product',
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
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1, //ok działa!
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
    db: {
      url: '//localhost:3131',
      product: 'product',
      order: 'order',
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
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
      app.cart.add(thisProduct);

    }

  } //end of Product

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


  class Cart{
    constructor(element){
      const thisCart = this;
      thisCart.products=[];
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.getElements(element);
      thisCart.initActions();
      //console.log('new Cart', thisCart);
    }
    getElements(element){
      const thisCart = this;
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList); //za toggleTrigger
      thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

      for(let key of thisCart.renderTotalsKeys){
        thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
      }
    }
    initActions(){
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function () {
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      thisCart.dom.productList.addEventListener ('custom', function(){
        thisCart.update();
      });

      thisCart.dom.productList.addEventListener('remove', function(event){
        thisCart.remove(event.detail.cartProduct);
      });
    }
    add(menuProduct){
      const thisCart = this;
      const generatedHTML = templates.cartProduct(menuProduct); //nowododany szablon do stalej
      const generatedDOM = utils.createDOMFromHTML(generatedHTML); //za renderInMenu
      thisCart.dom.productList.appendChild(generatedDOM); //za renderInMenu
      //console.log('adding product:', menuProduct);
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      //console.log('products', thisCart.products);
      thisCart.update();
    }
    update() {
      const thisCart = this;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;

      for (let productSingle of thisCart.products) {
        thisCart.subtotalPrice = thisCart.subtotalPrice + productSingle.price;
        thisCart.totalNumber = thisCart.totalNumber + productSingle.amount;
      //  console.log('update działa',thisCart.subtotalPrice , thisCart.totalNumber);
      }

      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee; /// tu dopisz szybki if

      for(let key of thisCart.renderTotalsKeys){
        for(let elem of thisCart.dom[key]){
          elem.innerHTML = thisCart[key];
        }
      }

    } // end update

    remove(cartProduct){
      const thisCart = this;

      const index = thisCart.products.indexOf(cartProduct);
      thisCart.products.splice(index, 1);
      cartProduct.dom.wrapper.remove();
      thisCart.update();
    } // end remove


  } // end Cart

  class CartProduct{
    constructor(menuProduct, element){
      const thisCartProduct = this;
      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));
      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();
      //console.log(thisCartProduct);
    }// end constructor

    getElements(element){
      const thisCartProduct = this;
      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget); //omg..tu byl dopiero blad...
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    }// end getElements

    initAmountWidget(){
      const thisCartProduct = this;
      //console.log('odpala');
      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
      //console.log(thisCartProduct.amountWidget);
      console.log(thisCartProduct.amountWidget.value);
      console.log(thisCartProduct.priceSingle);
      console.log(thisCartProduct.priceSingle * thisCartProduct.amount);
      thisCartProduct.dom.amountWidget.addEventListener('custom', function () { //co ma byc pierwszym argumentem? custom zglasza blad, a change nie działa...
        console.log('ok!');
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
        console.log(thisCartProduct.price);
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      });
    }// end initAmountWidget

    remove(){
      const thisCartProduct = this;

      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });

      thisCartProduct.dom.wrapper.dispatchEvent(event);
    } //end remove

    initActions(){
      const thisCartProduct = this;

      thisCartProduct.dom.edit.addEventListener('click', function(event){
        event.preventDefault();
      });

      thisCartProduct.dom.remove.addEventListener('click', function(event){
        event.preventDefault();
        console.log('test');
        thisCartProduct.remove();

      });
    } //end initActions


  } // end CartProduct


  const app = {
    initMenu: function(){
      const thisApp = this;
      //console.log('thisApp.data:', thisApp.data);

      for (let productData in thisApp.data.products){
        new Product (productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.product;
    },

    initCart: function(){
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart (cartElem);
    },

    init: function(){
      const thisApp = this;
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);


      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };





  app.init();
}
