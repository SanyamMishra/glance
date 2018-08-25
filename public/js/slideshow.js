'use strict';

function previous() {
  let one = document.querySelector('#slideshow .one');
  let two = document.querySelector('#slideshow .two');
  let three = document.querySelector('#slideshow .three');
  let parent = one.parentElement;
  let previous = parent.previousElementSibling;
  if (!previous) return;

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

    previous.addEventListener('animationend', function removeExtraClasses() {
      this.classList.remove('previous', 'animated', 'slideUp');
      previous.removeEventListener('animationend', removeExtraClasses);
    });

    //demote one and second news cards down the stack
    one.classList.replace('one', 'two');
    if (two) two.classList.replace('two', 'three');

    //move last slideshow stack news card out of it
    if (three) {
      three.classList.remove('three');
      parent.after(three);
    }

    previous.removeEventListener('animationstart', moveStackDown);
  });

  //start news card slide out animation
  previous.classList.add('one', 'previous');
  parent.prepend(previous);
  previous.classList.add('animated', 'slideUp');
}

function next() {
  let one = document.querySelector('#slideshow .one');
  let two = document.querySelector('#slideshow .two');
  let three = document.querySelector('#slideshow .three');
  let parent = one.parentElement;


  //if no more elements in the stack then hide next button
  if (!three) {
    let nextButton = document.querySelector('.fas.fa-caret-right');
    if (nextButton.classList.contains('fadeIn')) {
      nextButton.classList.remove('fadeIn');
    }
    nextButton.classList.add('animated', 'fadeOut');

    //if no other cards on the stack then stop execution
    if (!two) return;
  } else {
    //if previous button is hidden show it again
    let previousButton = document.querySelector('.fas.fa-caret-left');
    if (previousButton.classList.contains('fadeOut')) {
      previousButton.classList.remove('fadeOut');
      previousButton.classList.add('fadeIn');
    }
  }

  one.addEventListener('animationstart', function moveSlideshowUp() {
    //move first slideshow stack news card out of it
    one.addEventListener('animationend', function removeFirstNewsCard() {
      this.classList.remove('one', 'animated', 'slideDown');
      parent.before(this);
      one.removeEventListener('animationend', removeFirstNewsCard);
    });

    //promote second and third news cards up the stack
    two.classList.replace('two', 'one');
    if (three) three.classList.replace('three', 'two');

    //if more cards left after slideshow, move first one inside slideshow stack
    if (parent.nextElementSibling) {
      parent.append(parent.nextElementSibling);
      parent.lastElementChild.classList.add('three');
    }

    one.removeEventListener('animationstart', moveSlideshowUp);
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
  if (event.key == 'ArrowLeft' && !event.repeat) {
    previous();
  } else if (event.key == 'ArrowRight' && !event.repeat) {
    next();
  }
});
