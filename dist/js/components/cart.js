import {settings, select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import CartProduct from './cartProduct.js';

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
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phoneNumber = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.deliveryAdress = thisCart.dom.wrapper.querySelector(select.cart.address);

    //console.log(thisCart.dom.phoneNumber);
    //console.log(thisCart.dom.deliveryAdress);


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

    thisCart.dom.form.addEventListener('submit', function(){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      address: thisCart.dom.deliveryAdress.value,
      phone: thisCart.dom.phoneNumber.value,
      totalNumber: thisCart.totalNumber,
      totalPrice: thisCart.totalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };


    for (let product of thisCart.products) {
      payload.products.push(product.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedRespose:', parsedResponse);
      });

  } //end sendOrder()

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

    //thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee; /// tu dopisz szybki if

    if(thisCart.products.length) {
      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      console.log('length - true!');
    } else {
      thisCart.totalPrice = 0;
      thisCart.deliveryFee = 0;
      console.log('no length');
      console.log(thisCart.products);
    }



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

export default Cart;
