'use strict';

class HTTPError extends Error {
  constructor(statusCode) {
    super(statusCode);
    this.name = 'HTTPError';
    this.code = statusCode;
  }
}
class JSONParseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'JSONParseError';
  }
}
class ModalError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ModalError';
  }
}
class LocationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LocationError';
  }
}
class InsufficientParametersError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InsufficientParametersError';
  }
}

function customFetch(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(function (response) {
      if (response.status === 200)
        return response.json();
      else
        throw new HTTPError(response.status);
    })
    .catch(function (error) {
      if (error instanceof HTTPError)
        throw error;
      else if (error.name === 'SyntaxError') {
        hideWaitClock();
        showModal('JSON Parse Error', { preferred: 'done' }, 'fas fa-exclamation-circle');
        throw new JSONParseError(error.message);
      }
    });
}

//Function to show custom modals
function showModal(message, options, icon = 'fas fa-info-circle') {
  return new Promise(function(resolve, reject) {

    //if message or options is not given then throw error
    if(!(message && options)) return reject(new ModalError('Invalid Parameters'));

    //Clone the modal template as base html
    let modal = document.querySelector('#modal-template').cloneNode(true);
    modal.removeAttribute('id');

    //set the modal icon and message
    modal.querySelector('.icon i').className = icon;
    modal.querySelector('.message').innerHTML = message;

    //getting a reference to options container
    let optionsDiv = modal.querySelector('.options');

    //if any preferred option is given then set it
    if(options.preferred) { 
      let preferredOption = document.createElement('span');
      preferredOption.classList.add('option', 'preferred');
      preferredOption.innerHTML = options.preferred;
      preferredOption.setAttribute('data-value', options.preferred);
      optionsDiv.append(preferredOption);
    }

    //if there are other options then set them
    if(options.other) {
      for (let option of options.other) {
        let opt = document.createElement('span');
        opt.classList.add('option');
        opt.innerHTML = option;
        opt.setAttribute('data-value', option);
        optionsDiv.append(opt);
      }
    }

    //if no option is given then throw error
    if(optionsDiv.children.length === 0) return reject(new ModalError('No options to interact given'));

    //display the custom modal
    document.body.append(modal);

    //add an event listener to get clicks on options
    optionsDiv.addEventListener('click', function optionsEventListener(event) {
      let target = event.target;

      //if option inside modal is clicked then remove it and give response
      if(target.classList.contains('option') && target.closest('.modal')) {
        modal.remove();
        return resolve(target.dataset.value);
      }
    });
     
  });
}


function fetchGeolocation() {
  
  //show modal to ask for Geolocaction gracefully
  return showModal('To show news most relevant to you we need your location', {
    preferred: 'done',
    other: ['cancle']
  })
    .then(function(option) {
      return new Promise(function(resolve, reject) {

        //if user declined request from custom modal then throw error
        if (option === 'cancle') return reject(new LocationError('Request declined by the user'));

        //if user accepts custom modals request then proceed

        //check if geolocation is supported by the client browser
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            
            //user gave browser permission to share location
            //returning Geolocation data successfully
            return resolve(position);

          }, function (error) {
            
            //browser declined to share location
            //throwing appropriate error
            switch (error.code) {
              case error.PERMISSION_DENIED:
                return reject(new LocationError('Request declined by the user'));
              case error.POSITION_UNAVAILABLE:
                return reject(new LocationError('Position unavailable'));
              case error.TIMEOUT:
                return reject(new LocationError('Request Timeout'));
              case error.UNKNOWN_ERROR:
                return reject(new LocationError('Unknow error'));
            }

          });
        } else {
          //HTML5 Geolocation API is not supported by browser
          
          showModal('Geolocation is not supported by this browser.', {
            preferred: 'ok'
          });
          return reject(new LocationError('Geolocation API not supported'));
        }
      });
    });
}

function getHumanReadableTime(publishedAt) {
  let milliseconds = Date.now() - new Date(publishedAt).getTime();
  let minutes = Math.floor(milliseconds / (1000 * 60));
  let hours = Math.floor(milliseconds / (1000 * 60 * 60));
  let days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  let months = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 30));
  let years = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 365));
  
  let result, unit;
  if(years) [result, unit] = [years, 'year'];
  else if(months) [result, unit] = [months, 'month'];
  else if(days) [result, unit] = [days, 'day'];
  else if(hours) [result, unit] = [hours, 'hour'];
  else if(minutes) [result, unit] = [minutes, 'minute'];

  if(result > 1)
    unit += 's';

  return `${result} ${unit} ago`;
}

//Build a new news card
function buildNewsCard(article) {
  return new Promise(function(resolve, reject) {
    //if any of the needed info missing then abort with error
    if (!(article.source.name && article.title && article.description && article.url && article.urlToImage && article.publishedAt))
      return reject(new Error('Insufficient information'));

    //cloning template news card and inserting info
    let newsCard = document.querySelector('#news-card-template').cloneNode(true);
    newsCard.removeAttribute('id');
    newsCard.setAttribute('href', article.url);
    newsCard.querySelector('.headline').innerHTML = article.title;
    newsCard.querySelector('.source').innerHTML = article.source.name;
    newsCard.querySelector('.time').innerHTML = getHumanReadableTime(article.publishedAt);
    newsCard.querySelector('.description').innerHTML = article.description;

    //trying to load the background image of news card
    let backgroundImage = new Image;
    
    //if image loaded succesfully then return news card
    backgroundImage.onload = function() {
      newsCard.style.backgroundImage += `, url('${article.urlToImage}')`;
      newsCard.style.backgroundImage += ', linear-gradient(rgba(0,0,0,1), rgba(0,0,0,1))';
      return resolve(newsCard);
    };

    //if image not loaded the abort with error
    backgroundImage.onerror = function() {
      return reject(new Error('Image not found'));
    };

    backgroundImage.src = article.urlToImage;
  });
}

function processNewsJSON(response) {
  
  //reset preveious and next buttons of slideshow
  let [prevButton, nextButton] = document.querySelectorAll('main .button-holder i');
  prevButton.classList.remove('animated', 'fadeIn');
  prevButton.classList.add('fadeOut');
  nextButton.classList.remove('animated', 'fadeIn', 'fadeOut');

  if (response.errorType === 'InsufficientParametersError')
    throw new InsufficientParametersError(response.status);

  //if no news cards in in response then show no-news banner and hide clock over it
  if (!response.length) {
    document.querySelector('main #no-news').style.display = 'flex';
    hideWaitClock();
  } else document.querySelector('main #no-news').style.display = 'none';

  
  let newsCardsHolder = document.querySelector('#cards-holder');
  let slideshow = newsCardsHolder.querySelector('#slideshow');

  for (let i = 0; i < newsCardsHolder.children.length; i++) {
    if (newsCardsHolder.children[i].tagName === 'A') {
      newsCardsHolder.children[i].remove();
      i--;
    }
  }

  for (let i = 0; i < slideshow.children.length; i++) {
    if (slideshow.children[i].tagName === 'A') {
      slideshow.children[i].remove();
      i--;
    }
  }

  for (let article of response) {
    buildNewsCard(article)
      .then(function (newsCard) {
        let slideshowCount = slideshow.children.length;
        if (slideshowCount < 3) {
          slideshowCount++;
          let slideshowCountClass = (slideshowCount === 1) ? 'one' : (slideshowCount === 2) ? 'two' : 'three';
          newsCard.classList.add(slideshowCountClass);
          slideshow.append(newsCard);
        } else {
          newsCardsHolder.append(newsCard);
        }
      })
      //hide wait clock after at least 5 cards are loaded
      .then(function () {
        if ((newsCardsHolder.children.length + slideshow.children.length) >= 5)
          hideWaitClock();
      })
      .catch(error => { error; });
  }

  //if news cards are less than 5 then hide wait clock over them here
  hideWaitClock();
}

function fetchNews() {
  showWaitClock();
  customFetch('/api/fetchNews', getSettings())
    .then(response => processNewsJSON(response));
}

function needUpdation(oldSettings, newSettings) {
  if(!oldSettings) return true;

  if (oldSettings.countries.length !== newSettings.countries.length || oldSettings.sources.length !== newSettings.sources.length)
    return true;

  for (let country of oldSettings.countries) {
    if (!newSettings.countries.includes(country))
      return true;
  }

  for (let source of oldSettings.sources) {
    if (!newSettings.sources.includes(source))
      return true;
  }

  return false;
}

function getSettings() {
  let settings = localStorage.getItem('settings');
  return JSON.parse(settings);
}

function setSettings(settings) {
  
  if(needUpdation(getSettings(), settings)) {
    localStorage.setItem('settings', JSON.stringify(settings));
    return true;
  }

  return false;
}

if(!getSettings()) {

  //Trying to setup basic news feed settings by looking for country from IP address
  customFetch('/api/setup')
    .then(function(response) {

      //If country lookup from IP address fail then fetch Geolocation from browser
      if(response.errorType === 'LocationError') {
        return fetchGeolocation()
          //sending browser geolocation data for geocoding
          .then(position => 
            customFetch('/api/geocodePosition', {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          )
          //Save the news feed settings configuration file
          .then(function(response) {
            if (response.errorType === 'LocationError')
              throw new LocationError(response.status);
            else if(response.errorType === 'InsufficientParametersError')
              throw new InsufficientParametersError(response.status);
            else
              setSettings(response);
          });
      }

      //Save the news feed settings configuration file
      setSettings(response);
    })
    .catch(function(error) {
      //tell users we need data to show personalised news feed
      //show settings page and set settings in localStorage
      //location errors
      if(!(error instanceof LocationError))
        throw error;

      alert('we need some data to show personalised news so please chose something in settings');
      alert('thanks for choosing some shit now saving this in settings and proceeding to show news');
      console.log(error);
    })
    .then(function() {
      initSettingsPage();
      //now settings are saved in localStorage
      fetchNews();
    });
} else {
  //if settings are available then fetch news
  fetchNews();
}

function showWaitClock() {
  let waitClock = document.querySelector('#wait-clock');
  waitClock.style.display = 'flex';
}

function hideWaitClock() {
  let waitClock = document.querySelector('#wait-clock');
  waitClock.style.display = 'none';
}

document.querySelector('header #search').addEventListener('submit', function(event) {
  event.preventDefault();
  showWaitClock();
  customFetch('/api/search', {
    searchTerm: this.querySelector('input').value
  })
    // .then(response => console.log(response));
    .then(response => processNewsJSON(response));
});