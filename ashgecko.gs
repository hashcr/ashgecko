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
