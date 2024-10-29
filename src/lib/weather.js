const API_URL = 'https://api.open-meteo.com/v1/forecast';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @typedef {Object} Forecast
 * @property {string} time
 * @property {number} temperature
 * @property {number} precipitation
 */

/**
 * Tekur við gögnum frá Open Meteo og skilar fylki af spám í formi Forecast.
 * @param {unknown} data Gögn frá Open Meteo.
 * @returns {Array<Forecast>}
 */
function parseResponse(data) {

  const hourly = data.hourly;
  const {time= [], temperature_2m= []	, precipitation = []} = hourly;

  const allForecasts = [];
  for (let i = 0; i < time.length; i++) {	
    /** @type string */
    const _time = time[i];

    /** @type number */
    const _temperature = temperature_2m[i];

    /** @type number */
    const _precipitation = precipitation[i];

    /**@type Forecast */
    const forecast = {
      time: _time,
      temperature: _temperature,
      precipitation: _precipitation,
    };

    allForecasts.push(forecast);

  }
  return allForecasts;
}

/**
 * Framkvæmir leit að veðurspám fyrir gefna staðsetningu.
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<Array<Forecast>>} Fylki af spám fyrir staðsetningu.
 */
export async function weatherSearch(lat, lng) {
  await sleep(1000);
  // Querystring sem við viljum senda með leit
  // latitude={lat}&longitude={lng}}&hourly=temperature_2m,precipitation&timezone=GMT&forecast_days=1

  // TODO útfæra
  // Hér ætti að nota URL og URLSearchParams
  const url = new URL(API_URL);
  const querystring = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    hourly: 'temperature_2m,precipitation',
    forecast_days: '1',
  });
  url.search = querystring.toString();

  const response = await fetch(url.href);

  if (response.ok) {
    const data = await response.json();

    return parseResponse(data);
  }
}
