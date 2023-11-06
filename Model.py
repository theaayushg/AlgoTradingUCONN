# Initial thought and codes to create model and define strategy
# Option for strategies: Moving momentum, moving average
# Moving momentum: Sort 1-year-return, removing low momentum or negative return stocks, recommend for user 
# high momentum return stock or value base on price (1yearreturn/currentprice).


#Machine learning: compare prices between today and yesterday
#supervised, unsupervised, and reinforcement learning algorithms

# Import libaries
import numpy as np
import pandas as pd
import pandas_ta
import math
import xlsxwriter
from sklearn.ensemble import RandomForestClassifier


# Historical data needs to be in a csv format
# Load historical stock data. The visualization needs to show price on yesterday, today
# data needs to have close, high, low, open, volume
data = pd.read_csv('path_to_data.csv')

data['Tomorrow'] = data['TodayClose'].shift(-1)

# Create another column to parameterize (0 or 1) if tomorrow's opening is higher than today's close.
# Can use this column as input to ML.
data["Target"] = (data["Tomorrow"] > data["TodayClose"]).astype(int)

# Calculate features of that stock
# Garman-klass votatility
# Relative Strength Index
# Bollinger Bands
# ATR, MACD
# Dollar volume
data['garman_klass_vol'] = ((np.log(data['high'])-np.log(data['low']))**2)/2-(2*np.log(2)-1)*((np.log(data['adj close'])-np.log(data['open']))**2)

data['rsi'] = data.groupby(level=1)['adj close'].transform(lambda x: pandas_ta.rsi(close=x, length=20))

data['bb_low'] = data.groupby(level=1)['adj close'].transform(lambda x: pandas_ta.bbands(close=np.log1p(x), length=20).iloc[:,0])
                                                          
data['bb_mid'] = data.groupby(level=1)['adj close'].transform(lambda x: pandas_ta.bbands(close=np.log1p(x), length=20).iloc[:,1])
                                                          
data['bb_high'] = data.groupby(level=1)['adj close'].transform(lambda x: pandas_ta.bbands(close=np.log1p(x), length=20).iloc[:,2])

