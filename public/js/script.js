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
      else if (error.name === 'SyntaxError')
        throw new JSONParseError(error.message);
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
    optionsDiv.addEventListener('click', function optionsEventListener() {
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

//Build a new news card
function buildNewsCard(article) {
  return new Promise(function(resolve, reject) {
    //if any of the needed info missing then abort with error
    if (!(article.source.name && article.title && article.description && article.urlToImage && article.publishedAt))
      return reject(new Error('Insufficient information'));

    //cloning template news card and inserting info
    let newsCard = document.querySelector('#news-card-template').cloneNode(true);
    newsCard.removeAttribute('id');
    newsCard.querySelector('.headline').innerHTML = article.title;
    newsCard.querySelector('.source').innerHTML = article.source.name;
    newsCard.querySelector('.time').innerHTML = '1 hour ago';
    newsCard.querySelector('.description').innerHTML = article.description;

    //trying to load the background image of news card
    let backgroundImage = new Image;
    
    //if image loaded succesfully then return news card
    backgroundImage.onload = function() {
      newsCard.style.backgroundImage += `, url('${article.urlToImage}')`;
      return resolve(newsCard);
    };

    //if image not loaded the abort with error
    backgroundImage.onerror = function() {
      return reject(new Error('Image not found'));
    };

    backgroundImage.src = article.urlToImage;
  });
}

function fetchNews(settings) {
  fetch('/api/getNews', {
    method: 'POST',
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({settings: settings})
  }).then(response => response.json())
    .then(function (response) {
      if (response.status === 'countryNotFound') {
        fetchCountry()
          .then(function (country) {
            settings = {};
            settings.countries = [country];
            localStorage.setItem('settings', settings);
            fetchNews(settings);
          })
          .catch(error => { error; });
      }

      // let newsCardsHolder = document.querySelector('#cards-holder');
      // let slideshow = newsCardsHolder.querySelector('#slideshow');

      // for(let article of response.articles) {
      //   buildNewsCard(article)
      //     .then(function(newsCard) {
      //       let slideshowCount = slideshow.children.length;
      //       if (slideshowCount < 3) {
      //         slideshowCount++;
      //         let slideshowCountClass = (slideshowCount == 1) ? 'one' : (slideshowCount == 2) ? 'two' : 'three';
      //         newsCard.classList.add(slideshowCountClass);
      //         slideshow.append(newsCard);
      //       } else {
      //         newsCardsHolder.append(newsCard);
      //       }
      //     })
      //     .catch(error => {error;});
      // }
    });
}

function updateSettings(settings) {
  localStorage.setItem('settings', JSON.stringify(settings));
}

let settings = localStorage.getItem('settings');
if(!settings) {

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
              updateSettings(response);
          });
      }

      //Save the news feed settings configuration file
      updateSettings(response);
    })
    .catch(function(error) {
      //tell users we need data to show personalised news feed
      //show settings page and set settings in localStorage
      //location errors
      if(!(error instanceof LocationError))
        throw error;

      alert('we need some data to show personalised news so please chose something in settings');
      alert('thanks for choosing some shit now saving this in settings and proceeding to show news');
    })
    .then(function() {
      //now settings are saved in localStorage
      //fetchnews()
      alert('fetch news');
    });
}