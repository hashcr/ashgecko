//Author: Ashuin Sharma

// Get your key here -> https://coinmarketcap.com/api
const API_KEY = "PUT YOUR COIN MARKET CAP API KEY HERE";

//Get Price of a list of coins.
//@param coinList Ticker symbol list separated by commas
//@param converTo Tickey symbol of resulting currency (default is USD)
//@returns A list of prices corresponding to the provided coinList order.
function getPrices(coinList, convertTo) {
  // This is the array to be returned with the prices
  let response = [];

  if (coinList == null || coinList === "") {
    coinList = "btc,eth,doge,safemoon";
  }

  if (convertTo == null || convertTo === "") {
    convertTo = "usd";
  }

  coinList = coinList.toUpperCase();
  convertTo = convertTo.toUpperCase();

  // Setting the coin mkt cap API URL
  const endpoint = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
  const ids = "?CMC_PRO_API_KEY="+API_KEY;
  const symbols = "&symbol="+coinList;
  const convert = "&convert="+convertTo;
  const URL = endpoint + ids + symbols + convert;  
  const coins = coinList.split(',');

  // Actual API call
  try {
    let apiResponse = UrlFetchApp.fetch(URL);
    let responseText = apiResponse.getContentText();
    let responseObj = JSON.parse(responseText);
    // Parsing response
    if (responseObj.status.error_code == 0) {
      for (let i in coins) {
        let coin = coins[i];
        response.push(getPriceFromResponse_(responseObj.data, coin, convertTo));
      }
      Logger.log(response);
      return response;
    } else {
      return "Error";
    }
  }
  catch(e) {
    Logger.log(e);
    return "Error";
  }   
}

function getPriceFromResponse_(data, symbolx, convertTo) {
  for(let i in data) {
    let coin = data[i];
    if (coin.symbol === symbolx) {
      if (convertTo === "USD")
        return coin.quote.USD.price;
      else
        return coin.quote.BTC.price;
    }
  }
  return -1;
}

function deleteCache_() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteAllProperties();
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
