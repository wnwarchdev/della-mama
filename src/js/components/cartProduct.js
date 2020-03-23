import {select} from '../settings.js'; //chyba z 30 min stracone na poszukiwania... {} !!!
import AmountWidget from './amountWidget.js';

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

  getData() {
    const thisCartProduct = this;
    return {
      product_id: thisCartProduct.id,
      product_amount: thisCartProduct.amount,
      product_price: thisCartProduct.price,
      product_priceSingle: thisCartProduct.priceSingle,
      product_params: thisCartProduct.params,
    };
  } //end getData()


} // end CartProduct

export default CartProduct;
