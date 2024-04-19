from datetime import date,timedelta
import pandas as pd
import yfinance as yf
import numpy as np
# import pandas_ta

def get_data(company):
  end = date.today()-timedelta(days=1)
  print(f"date:{end}")
  stack = []
  counter = 0
  datas = []
  while True:
    previous_date = end - timedelta(days=1)
    stock_data = yf.download(company,previous_date,end)
    if not stock_data.empty:
      stack.append(stock_data)
      counter += 1
    if counter == 21:
      break;
    end = end - timedelta(days=1)
  while len(stack) != 0:
    datas.append(stack.pop())
  return pd.concat(datas)

def download_stock_data(tickers):
    start_date = date.today() - timedelta(days=9)
    end_date = date.today()

    # Loop through each ticker and download the data
    for ticker in tickers:
        data = yf.download(ticker, start=start_date, end=end_date)
        filename = f"{ticker}_data.csv"
        data.to_csv(filename)
        print(f"Data for {ticker} saved to {filename}")

companies = ['AAPL']

download_stock_data(companies)
