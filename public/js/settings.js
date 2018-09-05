// 'use strict';

// (function() {

//get current settings
let settings;
let supportedCountries = [];
let sources = [];

//event handler to get options nav button clicks
document.querySelector('header nav').addEventListener('click', function(event) {
  let target = event.target.closest('#options-nav-button');
  if(!target) return;
  let targetImg = target.querySelector('img');
  
  //set to open settings page
  let targetImgNewSrc = '/img/times.svg';
  let clickIntent = 'showSettings';
  //if image is already close icon then close settings page
  if (targetImg.getAttribute('src') === targetImgNewSrc) {
    targetImgNewSrc = '/img/cog.svg';
    clickIntent = 'hideSettings';
  }
  //if settings shown then news search is disbaled
  if(clickIntent === 'showSettings')
    document.querySelector('header #search-container').style.display = 'none';
  else
    document.querySelector('header #search-container').style.display = '';

  //options nav button click animations
  targetImg.addEventListener('animationend', function f() {
    this.removeEventListener('animationend', f);
    this.src = targetImgNewSrc;
    this.classList.replace('scrollOut', 'scrollIn');
  });
  targetImg.classList.remove('scrollIn');
  targetImg.classList.add('scrollOut');
  //if intent is to show settings then show settings page, else hide it
  let settingsPage = document.querySelector('#settings-page');
  if(clickIntent === 'showSettings')
    settingsPage.style.display = 'block';
  else {
    settingsPage.style.display = 'none';
    if(setSettings(settings))
      fetchNews();
  }
});

document.querySelector('#settings-page nav').addEventListener('click', function(event) {
  let target = event.target.closest('#settings-page nav li');
  if(!target) return;
  if(target.classList.contains('active')) return;
  let settingsTabContainer = document.querySelector('#settings-tab-container');
  let currentActiveNavTab = target.parentElement.querySelector('.active');
  let currentDisplayingTab = settingsTabContainer.querySelector(`.tab#${currentActiveNavTab.dataset.tabId}`);
  let tabToDisplay = settingsTabContainer.querySelector(`.tab#${target.dataset.tabId}`);
  let scrollAmount = tabToDisplay.offsetLeft - currentDisplayingTab.offsetLeft;
  currentActiveNavTab.classList.remove('active');
  target.classList.add('active');
  
  settingsTabContainer.scrollLeft += scrollAmount;
});

//initialize settings page
customFetch('/api/getSupportedCountriesAndSources')
  //sort supported countries by full name and update globals
  .then(function (response) {
    
    supportedCountries = response.supportedCountries.sort(function (a, b) {
      if (a.name > b.name) return 1;
      else if (a.name < b.name) return -1;
      else return 0;
    });
    sources = response.sources;
  })
  .then(() => initSettingsPage());

function initSettingsPage() {
  settings = getSettings();
  
  if (!settings) return;
  //initalize location tab by adding countries badges
  //add all selected countries badges
  for (let country of settings.countries)
    addCountryBadgeToContainer(
      country,
      document.querySelector('#location-tab #selected-countries .countries-container'),
      true
    );
  //add all country badges except selected countries
  for (let country of supportedCountries) {
    if (settings.countries.includes(country.short_name)) continue;
    addCountryBadgeToContainer(
      country.short_name,
      document.querySelector('#location-tab #all-countries .countries-container')
    );
  }
  //initialize sources tab
  //fill sources filter data
  fillFilterOptions('category', 'category-filter');
  fillFilterOptions('language', 'language-filter');
  fillFilterOptions('country_full_name', 'country-filter');
  let sourcesContainer = document.querySelector('#sources-tab #sources-container');
  for (let source of sources) {
    let sourceTile = document.querySelector('#source-tile-template').cloneNode(true);
    sourceTile.removeAttribute('id');
    if (settings.sources.includes(source.id))
      sourceTile.classList.add('selected');
    sourceTile.querySelector('.name').innerHTML = source.name;
    sourceTile.querySelector('.description').innerHTML = source.description;
    sourceTile.dataset.id = source.id;
    sourceTile.dataset.category = source.category;
    sourceTile.dataset.language = source.language;
    sourceTile.dataset.country = source.country_full_name;
    sourcesContainer.append(sourceTile);
  }
}
//function to fill sources filter options data
function fillFilterOptions(dataKey, filterId) {
  
  //pluck filter options data with dataKey from sources and find distinct values of them
  //then sort the distinct values
  let data = [...new Set(sources.map(source => source[dataKey]))].sort();
  
  //select container to put the filter options data with filterId
  let filterOptionsContainer = document.querySelector('#sources-tab #'+ filterId +' .options');
  //put all data as filter options
  for (let datum of data) {
    let option = document.querySelector('#filter-option-template').cloneNode(true);
    option.removeAttribute('id');
    option.querySelector('.text').innerHTML = datum;
    filterOptionsContainer.append(option);
  }
}


/***********************************************************************************************/
/*Location Tab Specific Functions***************************************************************/
/***********************************************************************************************/
//event handler to move countries in location tab in settings
document.querySelector('#settings-page #location-tab').addEventListener('click', function(event) {
  let target = event.target.closest('#location-tab .country');
  if(!target) return;
  if(target.classList.contains('selected')) {
    
    //move country badge to all countries
    let allCountriesContainer = document.querySelector('#location-tab #all-countries .countries-container');
    moveCountryBadgeToContainer(target, allCountriesContainer);
    target.classList.remove('selected');
    notify('Country removed');
    //update setttings file
    settings.countries.find(function (item, index, array) {
      if (item === target.dataset.shortName)
        array.splice(index, 1);
    });
  } else {
    
    //move country badge to selected countries
    let selectedCountriesContainer = document.querySelector('#location-tab #selected-countries .countries-container');
    moveCountryBadgeToContainer(target, selectedCountriesContainer);
    target.classList.add('selected');
    notify('Country added');
    
    //add country to the settings file
    settings.countries.push(target.dataset.shortName);
  }
});
//function to move country badge to the specific container in sorted manner
function moveCountryBadgeToContainer(country, container) {
  let countries = container.children;
  let countriesCount = countries.length;
  let countryName = country.dataset.name;
  
  //container has no country, simply append given country badge
  if (countriesCount === 0) {
    container.append(country);
  } else if(countryName < countries[0].dataset.name) {
    //given country name is smaller than first country in container
    //add given country at first in container
    container.prepend(country);
    return;
  } else if (countryName > countries[countriesCount - 1].dataset.name) {
    //given country name is bigger than last country in container
    //add given country at last in container
    container.append(country);
  }
  for(let i = 0; i < countriesCount; i++) {
    //if given country name is bigger than current country but smaller than next country
    //then add the given country in between them
    if(countryName > countries[i].dataset.name && countryName <= countries[i+1].dataset.name) {
      countries[i].after(country);
      return;
    } 
  }
}
//function to create and add country badge to specific container
function addCountryBadgeToContainer(country, container, asSelected = false) {
  let countryBadge = document.querySelector('#country-toast-template').cloneNode(true);
  countryBadge.removeAttribute('id');
  //find the full name of given country short name
  let countryFullName = supportedCountries.reduce(function (final, curr) {
    if (curr.short_name === country) final = curr.name;
    return final;
  }, country);
  //add data-name attribute to the badge for moving badge in sorted manner between containers
  countryBadge.dataset.name = countryFullName;
  //add data-short-name attribute to the badge for updating settings file
  countryBadge.dataset.shortName = country;
  
  //check if needed to add a already selected country
  if(asSelected)
    countryBadge.classList.add('selected');
  
  //add flag and full name to the badge
  countryBadge.querySelector('.flags').classList.add('flag-' + country);
  countryBadge.querySelector('.name').innerHTML = countryFullName;
  //append it to the given container
  container.append(countryBadge);
}
/***********************************************************************************************/
/*Sources Tab Specific Functions****************************************************************/
/***********************************************************************************************/
document.querySelector('#sources-tab #filters-container').addEventListener('click', function(event) {
  let target = event.target.closest('label');
  if (event.target.type !== 'checkbox' || !target) return;
  sourcesFilter();
});
function sourcesFilter() {
  let sourcesContainer = document.querySelector('#sources-tab #sources-container');
  sourcesContainer.querySelector('#no-source').style.display = 'none';
  
  let categoryFilters = filterOptions('category-filter');
  let languageFilters = filterOptions('language-filter');
  let countryFilters = filterOptions('country-filter');
  let anySourceShown = false;
  
  for(let source of sourcesContainer.querySelectorAll('.source')) {
    if(categoryFilters.length && languageFilters.length && countryFilters.length) {
      if (categoryFilters.includes(source.dataset.category) && languageFilters.includes(source.dataset.language) && countryFilters.includes(source.dataset.country)) {
        source.style.display = 'block';
        anySourceShown = true;
      } else source.style.display = 'none';
    } else if(categoryFilters.length && languageFilters.length) {
      if (categoryFilters.includes(source.dataset.category) && languageFilters.includes(source.dataset.language)) {
        source.style.display = 'block';
        anySourceShown = true;
      } else source.style.display = 'none';
    } else if(categoryFilters.length && countryFilters.length) {
      if (categoryFilters.includes(source.dataset.category) && countryFilters.includes(source.dataset.country)) {
        source.style.display = 'block';
        anySourceShown = true;
      } else source.style.display = 'none';
    } else if(languageFilters.length && countryFilters.length) {
      if (languageFilters.includes(source.dataset.language) && countryFilters.includes(source.dataset.country)) {
        source.style.display = 'block';
        anySourceShown = true;
      } else source.style.display = 'none';
    } else if(categoryFilters.length) {
      if (categoryFilters.includes(source.dataset.category)) {
        source.style.display = 'block';
        anySourceShown = true;
      } else source.style.display = 'none';
    } else if(languageFilters.length) {
      if (languageFilters.includes(source.dataset.language)) {
        source.style.display = 'block';
        anySourceShown = true;
      } else source.style.display = 'none';
    } else if(countryFilters.length) {
      if (countryFilters.includes(source.dataset.country)) {
        source.style.display = 'block';
        anySourceShown = true;
      } else source.style.display = 'none';
    } else {
      source.style.display = 'block';
      anySourceShown = true;
    }
  }
  if(!anySourceShown) {
    sourcesContainer.querySelector('#no-source').style.display = 'flex';
  }
}
function filterOptions(containerId) {
  return [...document.querySelectorAll(`#sources-tab #${containerId} label`)]
    .filter(label => label.querySelector('input').checked)
    .map(label => label.querySelector('.text').innerHTML);
}
document.querySelector('#sources-tab #search-bar input').addEventListener('keyup', function() {
  let sourcesContainer = document.querySelector('#sources-tab #sources-container');
  sourcesContainer.querySelector('#no-source').style.display = 'none';
  let anySourceShown = false;
  for(let source of sourcesContainer.querySelectorAll('.source')) {
    if(
      source.querySelector('.name').innerHTML.toLowerCase().includes(this.value) ||
      source.querySelector('.description').innerHTML.toLowerCase().includes(this.value)
    ) {
      source.style.display = 'block';
      anySourceShown = true;
    } else source.style.display = 'none';
  }
  if (!anySourceShown) {
    sourcesContainer.querySelector('#no-source').style.display = 'flex';
  }
});
document.querySelector('#sources-tab #sources-container').addEventListener('click', function(event) {
  let target = event.target.closest('.source');
  if(!target) return;
  if(target.classList.contains('selected')) {
    //update setttings file
    settings.sources.find(function (item, index, array) {
      if (item === target.dataset.id)
        array.splice(index, 1);
    });
    notify('Source removed');
  } else {
    //add source to the settings file
    settings.sources.push(target.dataset.id);
    notify('Source added');
  }
  target.classList.toggle('selected');
  
}); 

// })();