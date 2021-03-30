# ashgecko
[View this file as raw text]

Usage:

1- Download the script from this repo.
2- Open your Google Drive
3- Create a spread sheet
4- Click on Tools/Scripts
5- Copy/Paste the downloaded script into your script editor
6- Save it
7- Click Deploy -> New Deployment
8- Select Library and Name it. Click Done.
9- Then go to your spreadsheet
10- In the spreadsheet you should have a list of all the ticker symbols you care for,
make sure to put them consecutively in a column or row , so that you can select them.
My suggestion to have something like this (adjust column letters and numbers to your own spreadsheet needs) :

    A        B
1   Symbol  USD
2   BTC
3   ETH
4   DOGE
5   TRX

11- Edit cell B2 and put this formula =getPrices(JOIN(",";A2:A5))

12- This will bring the prices and put them in the B column.


Thats, it.
I hope is usefull.
