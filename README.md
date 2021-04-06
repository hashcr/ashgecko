# ashgecko
[View this file as raw text]

Usage:

1- Download the script from this repo.
2- Open your Google Drive
3- Create a spread sheet
4- Click on Tools/Scripts
5- Copy/Paste the downloaded script into your script editor
6- Then go to CoinMarketCap.com/api and register to get an API KEY and paste into the Script and Save the File.
7- Click Deploy -> New Deployment
8- Select Library and Name it. Click Done.
9- Then in the editor select the function "getPrices" from the dropdown 
and runit for the first time, by clicking on the Play button. 

(It may prompt you for permissions, you should accept them)

10- Then go to your spreadsheet
11- In the spreadsheet you should have a list of all the ticker symbols you care for,
make sure to put them consecutively in a column or row , so that you can select them.
My suggestion to have something like this  :

    A        B
1   Symbol  USD
2   BTC
3   ETH
4   DOGE
5   TRX

12- Edit cell B2 and put this formula =getPrices(JOIN(",";$A$2:$A$5);$B$1)
(adjust column letters and numbers to your own spreadsheet needs. In this case A2 and A5 its just an example)

The script method is called :   getPrices(coinList, convertToCurrency)
where coinList is a string with crypto currencies Ticker Symbol separated by comma.
And convertToCurrency is an optional parameter to see the resulting prices in a specific
currency. (defaults to USD)

13- This will bring the prices converted to USD and put them in the B column.


Thats, it.
I hope is useful.
