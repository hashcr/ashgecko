//Author: Ashuin Sharma

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
  // Set a property in each of the three property stores.
  var scriptProperties = PropertiesService.getScriptProperties();
  try {
    let apiResponse = UrlFetchApp.fetch(URL);
    var responseText = apiResponse.getContentText();
    scriptProperties.setProperty('CACHED_RESPONSE_PRICES', responseText);
  } catch(e) {
    var responseText = scriptProperties.getProperty('CACHED_RESPONSE_PRICES');
  }

  // Parsing response
  let obj = JSON.parse(responseText);
  let coins = coinList.split(",");
  for (let coin in coins) {
    let curr = coins[coin];
    try {
      var price = obj[curr][inCurr];
    } catch (e) {
      var price = 0;
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
  // Set a property in each of the three property stores.
  var scriptProperties = PropertiesService.getScriptProperties();
  try {
    let apiResponse = UrlFetchApp.fetch(endpoint);
    var responseText = apiResponse.getContentText();
    scriptProperties.setProperty('CACHED_RESPONSE_IDS', responseText);
  } catch(e) {
    var responseText = scriptProperties.getProperty('CACHED_RESPONSE_IDS');
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


//The following is just 1:1 of the above calls, 1 symbol and one price to be reused on single cells
function getPriceByTicker(coinSymbol, inCurr) {
  // This is the array to be returned with the prices
  var response = 'error';
  var coin;

  // If params are not present we set defaults
  if(inCurr==null || inCurr === "") {
    inCurr = "usd";
  } 
  if (coinSymbol == null || coinSymbol === "") {
    coin = "bitcoin"
  } else {
    coin = getId(coinSymbol);
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

// @param symbolCoin just the symbol ticker of the coin.
// @returns a string with the corresponding coin ID.
function getId(symbolCoin) {

  if(null == symbolCoin || symbolCoin === "") {
    symbolCoin = "btc";
  } else {
    symbolCoin = symbolCoin.toLowerCase();
  }

  var response = 'error';

  // Setting the coin gecko API URL
  const endpoint = "https://api.coingecko.com/api/v3/coins/list";

  // Actual API call
  // Set a property in each of the three property stores.
  var scriptProperties = PropertiesService.getScriptProperties();
  try {
    let apiResponse = UrlFetchApp.fetch(endpoint);
    var responseText = apiResponse.getContentText();
    scriptProperties.setProperty('CACHED_RESPONSE_IDS', responseText);
  } catch(e) {
    var responseText = scriptProperties.getProperty('CACHED_RESPONSE_IDS');
    response = e;
  }
    
  // Parsing response
  let obj = JSON.parse(responseText);
  for (let j in obj) {
    let dat = obj[j];
    if (dat.symbol === symbolCoin) {
      return dat.id;
    }
  }

}
