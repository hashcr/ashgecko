//Author: Ashuin Sharma

const TTL_IDS_MILLIS = 3600000; // 1 hour

// @param coinList Send a String of Ticker Symbols separated by comma (e.g eth,btc,ada)
// @param inCurr The Ticker Symbol of the currency you want to see the results (USD by default)
// @returns the prices in the desired currency
function getPrices(coinList, inCurr) {
  // This is the array to be returned with the prices
  let response = [];

  // If params are not present we set defaults
  if(inCurr==null || inCurr === "") {
    inCurr = "usd";
  } 
  if (coinList == null || coinList === "") {
    coinList = "ethereum,dogecoin,bitcoin";
  } else {
    coinList = getIds(coinList);
  }

  // Lets escape characters for request URL
  escCoinList = escape(coinList);
  
  // Setting the coin gecko API URL
  const endpoint = "https://api.coingecko.com/api/v3/simple/price";
  const ids = "?ids=" + escCoinList;
  const vsCurr = "&vs_currencies="+inCurr;
  const URL = endpoint + ids + vsCurr;

  // Actual API call
  var scriptProperties = PropertiesService.getScriptProperties();
  var responseText = "";
  try {
    let apiResponse = UrlFetchApp.fetch(URL);
    responseText = apiResponse.getContentText();
    scriptProperties.setProperty('CACHED_RESPONSE_PRICES', responseText);
  } catch(e) {
    Logger.log(e);
    Logger.log("Error calling api. Using lst successful response to retrieve Crypto Prices.");
    responseText = scriptProperties.getProperty('CACHED_RESPONSE_PRICES');
  }

  // Parsing response
  let obj = JSON.parse(responseText);
  let coins = coinList.split(",");
  for (let coin in coins) {
    let curr = coins[coin];
    let price = 0;
    try {
      price = obj[curr][inCurr];
    } catch (e) {
      price = 0;
    }
    response.push(price);
  }
  return response;
}


// @param symbolList Send a String of Ticker Symbols separated by commas.
// @returns a string with the corresponding coin IDS separated by commas.
function getIds(symbolList) {

  if(null == symbolList || symbolList === "") {
    symbolList = "eth,doge,btc";
  } else {
    symbolList = symbolList.toLowerCase();
  }

  let response = [];

  // Setting the coin gecko API URL
  const endpoint = "https://api.coingecko.com/api/v3/coins/list";

  // Actual API call
  let scriptProperties = PropertiesService.getScriptProperties();
  let responseText = "";
  try {
    let lastRetrieve = scriptProperties.getProperty('CACHED_RESPONSE_IDS_TS');
    if (!lastRetrieve || (Date.now() - lastRetrieve > TTL_IDS_MILLIS)) {      
      let apiResponse = UrlFetchApp.fetch(endpoint);
      responseText = apiResponse.getContentText();
      scriptProperties.setProperty('CACHED_RESPONSE_IDS', responseText);
      scriptProperties.setProperty('CACHED_RESPONSE_IDS_TS', Date.now());
    } else {
      Logger.log("TTL active. Using cache to retrieve Crypto ID List.");
      responseText = scriptProperties.getProperty('CACHED_RESPONSE_IDS');
    }
  } catch(e) {
    Logger.log("Error calling api. Using last successful response to retrieve Crypto ID List.");
    responseText = scriptProperties.getProperty('CACHED_RESPONSE_IDS');
  }
    
  // Parsing response
  let obj = JSON.parse(responseText);
  let symbols = symbolList.split(",");
  for (let i in symbols) {
    let symbolx = symbols[i];
    for (let j in obj) {
      let dat = obj[j];
      if (dat.symbol === symbolx) {
        response.push(dat.id);
        break;
      }
    }
  }
  return response.join();
}


//brings or get the price of one specific tiker and symbol
function getPriceByTicker(coinSymbol, inCurr) {
  // This is the array to be returned with the prices
  var response = 'Err';
  var coin;

  // If params are not present we set defaults
  if(inCurr==null || inCurr === "") {
    inCurr = "usd";
  } 
  if (coinSymbol == null || coinSymbol === "") {
    coin = "bitcoin"
  } else {
    coin = getIds(coinSymbol);
  }

  // Lets escape characters for request URL
  escCoinList = escape(coin);
  
  // Setting the coin gecko API URL
  const endpoint = "https://api.coingecko.com/api/v3/simple/price";
  const id = "?ids=" + escCoinList;
  const vsCurr = "&vs_currencies="+inCurr;
  const URL = endpoint + id + vsCurr;

  // Actual API call
  // Set a property in each of the three property stores.
  var scriptProperties = PropertiesService.getScriptProperties();
  try {
    let apiResponse = UrlFetchApp.fetch(URL);
    var responseText = apiResponse.getContentText();
  
    scriptProperties.setProperty('CACHED_RESPONSE_PRICES_' + coin, responseText);
  } catch(e) {
    var responseText = scriptProperties.getProperty('CACHED_RESPONSE_PRICES_' + coin);
  }

  // Parsing response
  let obj = JSON.parse(responseText);
  
  response = (obj[coin][inCurr]);
  
  return response;
}
