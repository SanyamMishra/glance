'use strict';

(function() {
  
  let isSlideshowRunning = false;
  
  function previous() {
    if(isSlideshowRunning) return;

    let one = document.querySelector('#slideshow .one');
    let two = document.querySelector('#slideshow .two');
    let three = document.querySelector('#slideshow .three');
    let parent = one.parentElement;
    let previous = parent.previousElementSibling;
    if (!previous) return;

    isSlideshowRunning = true;

    //if no more previous news cards then hide previous button
    let previousButton = document.querySelector('.fas.fa-caret-left');
    if (!previous.previousElementSibling) {
      if (previousButton.classList.contains('fadeIn')) {
        previousButton.classList.remove('fadeIn');
      }
      previousButton.classList.add('animated', 'fadeOut');
    }

    //if next button is hidden then show it again
    let nextButton = document.querySelector('.fas.fa-caret-right');
    if (nextButton.classList.contains('fadeOut')) {
      nextButton.classList.remove('fadeOut');
      nextButton.classList.add('fadeIn');
    }

    previous.addEventListener('animationstart', function moveStackDown() {
      previous.removeEventListener('animationstart', moveStackDown);

      previous.addEventListener('animationend', function removeExtraClasses() {
        previous.removeEventListener('animationend', removeExtraClasses);
        this.classList.remove('previous', 'animated', 'slideUp');
        isSlideshowRunning = false;
      });

      //demote one and second news cards down the stack
      one.classList.replace('one', 'two');
      if (two) two.classList.replace('two', 'three');

      //move last slideshow stack news card out of it
      if (three) {
        three.classList.remove('three');
        parent.after(three);
      }


    });

    //start news card slide out animation
    previous.classList.add('one', 'previous');
    parent.prepend(previous);
    previous.classList.add('animated', 'slideUp');
  }

  function next() {
    if (isSlideshowRunning) return;
    
    let one = document.querySelector('#slideshow .one');
    let two = document.querySelector('#slideshow .two');
    let three = document.querySelector('#slideshow .three');
    let parent = one.parentElement;

    //if no other cards on the stack then stop execution
    if (!two) return;

    isSlideshowRunning = true;


    //if no more elements in the stack then hide next button
    if (!three) {
      let nextButton = document.querySelector('.fas.fa-caret-right');
      if (nextButton.classList.contains('fadeIn')) {
        nextButton.classList.remove('animated', 'fadeIn');
      }
      nextButton.classList.add('animated', 'fadeOut');
    } else {
      //if previous button is hidden show it again
      let previousButton = document.querySelector('.fas.fa-caret-left');
      if (previousButton.classList.contains('fadeOut')) {
        previousButton.classList.remove('animated', 'fadeOut');
        previousButton.classList.add('animated', 'fadeIn');
      }
    }

    one.addEventListener('animationstart', function moveSlideshowUp() {
      one.removeEventListener('animationstart', moveSlideshowUp);

      //move first slideshow stack news card out of it
      one.addEventListener('animationend', function removeFirstNewsCard() {
        one.removeEventListener('animationend', removeFirstNewsCard);
        parent.before(this);
        this.classList.remove('one', 'animated', 'slideDown');
        isSlideshowRunning = false;
      });

      //promote second and third news cards up the stack
      two.classList.replace('two', 'one');
      if (three) three.classList.replace('three', 'two');

      //if more cards left after slideshow, move first one inside slideshow stack
      if (parent.nextElementSibling) {
        parent.append(parent.nextElementSibling);
        parent.lastElementChild.classList.add('three');
      }

    });

    //start news card slide out animation
    one.classList.add('animated', 'slideDown');
  }

  //Open previous news card
  document.querySelector('.fas.fa-caret-left').addEventListener('click', previous);

  //Open next news card
  document.querySelector('.fas.fa-caret-right').addEventListener('click', next);

  //Adding keyboard shortcuts for arrow keys
  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
      previous();
    } else if (event.key === 'ArrowRight') {
      next();
    }
  });

})();