import numpy as np

def calculate_log_returns(df):
    df["Log_Return"] = np.log(df["Price"]).diff()
    return df.dropna()