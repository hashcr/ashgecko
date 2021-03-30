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
    response.push(obj[curr][inCurr]);
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
