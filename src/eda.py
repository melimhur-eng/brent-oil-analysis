import numpy as np


def calculate_log_returns(df):
    df = df.copy()
    df["Log_Return"] = np.log(df["Price"]).diff()
    return df