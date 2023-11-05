# Initial thought and codes to create model and define strategy
# Option for strategies: Moving momentum, moving average
  
# Import
import numpy as np
import pandas as pd
import math
import xlsxwriter


# Historical data needs to be in a csv format
# Load historical stock data
data = pd.read_csv('path_to_data.csv')
