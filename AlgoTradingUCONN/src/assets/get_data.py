from datetime import date, timedelta
import pandas as pd
import yfinance as yf

def get_data(company):
    end = date.today() - timedelta(days=1)
    print(f"date: {end}")
    stack = []
    counter = 0
    datas = []
    while True:
        previous_date = end - timedelta(days=1)
        stock_data = yf.download(company, previous_date, end)
        if not stock_data.empty:
            stack.append(stock_data)
            counter += 1
        if counter == 21:
            break
        end = end - timedelta(days=1)
    while len(stack) != 0:
        datas.append(stack.pop())
    combined_data = pd.concat(datas)
    
    # Save data to CSV file with company ticker as filename
    filename = f"/csv/{company}_stock_data.csv"
    combined_data.to_csv(filename)
    print(f"Saved data to {filename}")
    
    return combined_data


tickerlist=['AAPL', 'MSFT', 'JNJ', 'PG', 'KO', 'XOM', 'WMT', 'IBM', 'GE', 'F', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NFLX', 'INTC', 'AMD', 'NVDA', 'V', 'PYPL']
for(ticker in tickerlist):
  get_data(ticker)

