"""Loads the analysis outputs (prices, events, change points) from data/ into memory."""
import os

import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")


def _load_prices() -> pd.DataFrame:
    df = pd.read_csv(os.path.join(DATA_DIR, "prices.csv"), parse_dates=["Date"])
    df = df.sort_values("Date").reset_index(drop=True)
    return df


def _load_events() -> pd.DataFrame:
    df = pd.read_csv(os.path.join(DATA_DIR, "events.csv"), parse_dates=["Date"])
    df = df.sort_values("Date").reset_index(drop=True)
    df.insert(0, "id", range(1, len(df) + 1))
    return df


def _load_changepoints() -> pd.DataFrame:
    df = pd.read_csv(os.path.join(DATA_DIR, "changepoints.csv"), parse_dates=["Change_Date"])
    df = df.sort_values("Change_Date").reset_index(drop=True)
    df.insert(0, "id", range(1, len(df) + 1))
    df["Pct_Change"] = (df["After_Mean"] - df["Before_Mean"]) / df["Before_Mean"].abs() * 100
    return df


PRICES = _load_prices()
EVENTS = _load_events()
CHANGEPOINTS = _load_changepoints()


def reload():
    """Re-read CSVs from disk, e.g. after swapping in real notebook outputs."""
    global PRICES, EVENTS, CHANGEPOINTS
    PRICES = _load_prices()
    EVENTS = _load_events()
    CHANGEPOINTS = _load_changepoints()
