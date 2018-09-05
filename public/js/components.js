'use strict';

function notify(message) {
  //check toasts holder exist
  let toastsHolder = document.querySelector('#notification-toasts-holder');
  
  //if not then add it to body
  if(!toastsHolder) {
    toastsHolder = document.createElement('div');
    toastsHolder.id = 'notification-toasts-holder';
    document.body.append(toastsHolder);
  }

  //create new toast
  let toast = document.querySelector('#notification-toast-template').cloneNode(true);
  toast.removeAttribute('id');

  toast.querySelector('.message').innerHTML = message;

  toastsHolder.append(toast);

  //slide in toast
  setTimeout(() => toast.classList.add('slideInToast'), 0);
  
  setTimeout(function() {
    //slide out toast
    toast.classList.remove('slideInToast');
    setTimeout(function() {

      //if no more toasts in holder then remove holder from body
      let toastsInHolder = document.querySelector('#notification-toasts-holder .slideInToast');
      if(!toastsInHolder) toastsHolder.remove();
      
    }, '300');
  }, 2000);
}