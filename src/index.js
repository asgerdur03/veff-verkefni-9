/**
 * Gefið efni fyrir verkefni 9, ekki er krafa að nota nákvæmlega þetta en nota
 * verður gefnar staðsetningar.
 */

import { el, empty } from './lib/elements.js';
import { weatherSearch } from './lib/weather.js';

/**
 * @typedef {Object} SearchLocation
 * @property {string} title
 * @property {number} lat
 * @property {number} lng
 */

/**
 * Allar staðsetning sem hægt er að fá veður fyrir.
 * @type Array<SearchLocation>
 */
const locations = [
  {
    title: 'Reykjavík',
    lat: 64.1355,
    lng: -21.8954,
  },
  {
    title: 'Akureyri',
    lat: 65.6835,
    lng: -18.0878,
  },
  {
    title: 'New York',
    lat: 40.7128,
    lng: -74.006,
  },
  {
    title: 'Tokyo',
    lat: 35.6764,
    lng: 139.65,
  },
  {
    title: 'Sydney',
    lat: 33.8688,
    lng: 151.2093,
  },
];

/**
 * Hreinsar fyrri niðurstöður, passar að niðurstöður séu birtar og birtir element.
 * @param {Element} element
 */
function renderIntoResultsContent(element) {
  // TODO útfæra
  const resultsContent = document.querySelector('.results');

  empty(resultsContent);

  resultsContent.appendChild(element);

  //resultsContent.appendChild(element);

}

/**
 * Birtir niðurstöður í viðmóti.
 * @param {SearchLocation} location
 * @param {Array<import('./lib/weather.js').Forecast>} results
 */
function renderResults(location, results) {
  // TODO útfæra

  console.log('slay')

}

/**
 * Birta villu í viðmóti.
 * @param {Error} error
 */
function renderError(error) {
  // TODO útfæra
  // "Gat ekki sótt staðsetiningu"
  console.error("error", error);
  const errorMessage = el('p', {}, 'Gat ekki sốtt staðsetningu. Villa: ' + error.message);

  renderIntoResultsContent(errorMessage);
}

/**
 * Birta biðstöðu í viðmóti.
 */
function renderLoading() {
  console.log('render loading');

  const loadingMessage = el('p', {}, 'Er að leita...');
  renderIntoResultsContent(loadingMessage);
  // TODO útfæra
}

/**
 * Framkvæmir leit að veðri fyrir gefna staðsetningu.
 * Birtir biðstöðu, villu eða niðurstöður í viðmóti.
 * @param {SearchLocation} location Staðsetning sem á að leita eftir.
 */
async function onSearch(location) {
  console.log('onSearch', location);

  // Birta loading state
  renderLoading();

  const results = await weatherSearch(location.lat, location.lng);

  console.log(results);

  // TODO útfæra
  if (results) {
    renderResults(location, results);
  } else {
    renderError();
  }
  
  // Hér ætti að birta og taka tillit til mismunandi staða meðan leitað er.
}

/**
 * Framkvæmir leit að veðri fyrir núverandi staðsetningu.
 * Biður notanda um leyfi gegnum vafra.
 */
async function onSearchMyLocation() {

  // TODO útfæra

  // laga, breyta probs

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const location = { title: 'Núverandi staðsetning', lat: latitude, lng: longitude };
        await onSearch(location);
      } catch (error) {
        renderError(error);
      }
    }, (error) => {
      renderError(new Error('Gat ekki fengið leyfi til að nálgast staðsetningu.'));
    });
  } else {
    renderError(new Error('Vafrinn þinn styður ekki staðsetningarþjónustu.'));
  }
}

/**
 * Býr til takka fyrir staðsetningu.
 * @param {string} locationTitle
 * @param {() => void} onSearch
 * @returns {HTMLElement}
 */
function renderLocationButton(locationTitle, onSearch) {
  // Notum `el` fallið til að búa til element og spara okkur nokkur skref.
  const locationElement = el(
    'li',
    { class: 'locations__location' },
    el(
      'button',
      { class: 'locations__button', click: onSearch },
      locationTitle,
    ),
  );

  return locationElement;
}

/**
 * Býr til grunnviðmót: haus og lýsingu, lista af staðsetningum og niðurstöður (falið í byrjun).
 * @param {Element} container HTML element sem inniheldur allt.
 * @param {Array<SearchLocation>} locations Staðsetningar sem hægt er að fá veður fyrir.
 * @param {(location: SearchLocation) => void} onSearch
 * @param {() => void} onSearchMyLocation
 */
function render(container, locations, onSearch, onSearchMyLocation) {
  // Búum til <main> og setjum `weather` class
  const parentElement = document.createElement('main');
  parentElement.classList.add('weather');

  // Búum til <header> með beinum DOM aðgerðum
  const headerElement = document.createElement('header');
  const heading = document.createElement('h1');
  heading.appendChild(document.createTextNode('Veðurstofa Ásu'));
  headerElement.appendChild(heading);
  parentElement.appendChild(headerElement);

  // Búum til inngangstexta með beimun DOM aðgerðum
  const introElement = document.createElement('p');
  introElement.appendChild(document.createTextNode('Veldu staðsetningu til að sjá hita- og úrkomuspá þar'));
  parentElement.appendChild(introElement);

  const locationElement = document.createElement('h2');
  locationElement.appendChild(document.createTextNode('Staðsetningar'));
  parentElement.appendChild(locationElement);


  // Búa til <div class="loctions">
  const locationsElement = document.createElement('div');
  locationsElement.classList.add('locations');

  // Búa til <ul class="locations__list">
  const locationsListElement = document.createElement('ul');
  locationsListElement.classList.add('locations__list');

  // <div class="loctions"><ul class="locations__list"></ul></div>
  locationsElement.appendChild(locationsListElement);

  // <div class="loctions"><ul class="locations__list"><li><li><li></ul></div>
  for (const location of locations) {
    const liButtonElement = renderLocationButton(location.title, () => {
      console.log('Halló!!', location);
      onSearch(location);
    });
    locationsListElement.appendChild(liButtonElement);
  }

  parentElement.appendChild(locationsElement);




  // TODO útfæra niðurstöðu element
  const resultsElement = el('div', { class: 'results' });
  parentElement.appendChild(resultsElement);

  container.appendChild(parentElement);

  // container fyrir niðurstöður
  /*
  const resultsElement = document.createElement('div');
  resultsElement.classList.add('results'); // class="results"

  // bætum við Heading ,texta og töflu
  const resultsHeaderElement = document.createElement('h2');
  resultsHeaderElement.appendChild(document.createTextNode('Niðurstöður'));

  const resultsAreaHeadingElement = document.createElement('h3');
  resultsAreaHeadingElement.appendChild(document.createTextNode('<Strengur af takka sem ýtt var á>'));

  const resultsLocationTextElement = document.createElement('p');
  resultsLocationTextElement.appendChild(document.createTextNode('Spá fyrir dagin á breiddargráðu <lat> og lengdargráðu <lng>.'));

  

  resultsElement.appendChild(resultsHeaderElement);
  resultsElement.appendChild(resultsAreaHeadingElement);
  resultsElement.appendChild(resultsLocationTextElement);

  const resultsTableElement = document.createElement('table');


  resultsElement.appendChild(resultsTableElement);

  // 
  





  parentElement.appendChild(resultsElement);
*/

  


  container.appendChild(parentElement);
}

// Þetta fall býr til grunnviðmót og setur það í `document.body`
render(document.body, locations, onSearch, onSearchMyLocation);
