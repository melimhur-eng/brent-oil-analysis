"""Flask API serving Brent oil change-point analysis results to the React dashboard.

Endpoints:
  GET /api/health
  GET /api/prices?start=YYYY-MM-DD&end=YYYY-MM-DD&resample=none|weekly|monthly
  GET /api/events?category=Geopolitical|Economic|OPEC&start=&end=
  GET /api/changepoints
  GET /api/summary?start=&end=
  GET /api/events/<id>/impact?window_days=30
"""
import math

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

import data_loader as dl

app = Flask(__name__)
CORS(app)

TRADING_DAYS_PER_YEAR = 252


def parse_date(value, param_name):
    if value is None:
        return None
    try:
        return pd.Timestamp(value)
    except (ValueError, TypeError):
        raise ValueError(f"Invalid date for '{param_name}': {value}")


def filter_by_date(df, date_col, start, end):
    out = df
    if start is not None:
        out = out[out[date_col] >= start]
    if end is not None:
        out = out[out[date_col] <= end]
    return out


def safe_float(value):
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return None
    return float(value)


def prices_to_records(df):
    records = []
    for row in df.itertuples(index=False):
        records.append({
            "date": row.Date.strftime("%Y-%m-%d"),
            "price": safe_float(row.Price),
            "rolling_mean": safe_float(row.Rolling_Mean),
            "rolling_std": safe_float(row.Rolling_STD),
            "log_return": safe_float(row.Log_Return),
        })
    return records


def events_to_records(df):
    return [{
        "id": int(row.id),
        "date": row.Date.strftime("%Y-%m-%d"),
        "event": row.Event,
        "category": row.Category,
        "description": row.Description,
    } for row in df.itertuples(index=False)]


def changepoints_to_records(df):
    return [{
        "id": int(row.id),
        "change_date": row.Change_Date.strftime("%Y-%m-%d"),
        "before_mean": safe_float(row.Before_Mean),
        "after_mean": safe_float(row.After_Mean),
        "pct_change": safe_float(row.Pct_Change),
        "direction": "up" if row.After_Mean >= row.Before_Mean else "down",
    } for row in df.itertuples(index=False)]


@app.errorhandler(ValueError)
def handle_value_error(err):
    return jsonify({"error": str(err)}), 400


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/api/prices")
def get_prices():
    start = parse_date(request.args.get("start"), "start")
    end = parse_date(request.args.get("end"), "end")
    resample = request.args.get("resample", "none")

    df = filter_by_date(dl.PRICES, "Date", start, end)

    if resample == "weekly":
        df = df.set_index("Date").resample("W").last().dropna(subset=["Price"]).reset_index()
    elif resample == "monthly":
        df = df.set_index("Date").resample("ME").last().dropna(subset=["Price"]).reset_index()
    elif resample != "none":
        raise ValueError(f"Invalid resample value: {resample}")

    return jsonify(prices_to_records(df))


@app.get("/api/events")
def get_events():
    start = parse_date(request.args.get("start"), "start")
    end = parse_date(request.args.get("end"), "end")
    category = request.args.get("category")

    df = filter_by_date(dl.EVENTS, "Date", start, end)
    if category:
        df = df[df["Category"] == category]

    return jsonify(events_to_records(df))


@app.get("/api/changepoints")
def get_changepoints():
    return jsonify(changepoints_to_records(dl.CHANGEPOINTS))


@app.get("/api/summary")
def get_summary():
    start = parse_date(request.args.get("start"), "start")
    end = parse_date(request.args.get("end"), "end")

    df = filter_by_date(dl.PRICES, "Date", start, end)
    if df.empty:
        raise ValueError("No price data in the requested date range")

    start_price = float(df.iloc[0]["Price"])
    end_price = float(df.iloc[-1]["Price"])
    pct_change = (end_price - start_price) / start_price * 100

    log_returns = df["Log_Return"].dropna()
    daily_vol = float(log_returns.std()) if not log_returns.empty else None
    annualized_vol = daily_vol * math.sqrt(TRADING_DAYS_PER_YEAR) if daily_vol is not None else None

    events_in_range = filter_by_date(dl.EVENTS, "Date", start, end)
    changepoints_in_range = filter_by_date(dl.CHANGEPOINTS, "Change_Date", start, end)

    return jsonify({
        "start_date": df.iloc[0]["Date"].strftime("%Y-%m-%d"),
        "end_date": df.iloc[-1]["Date"].strftime("%Y-%m-%d"),
        "start_price": round(start_price, 2),
        "end_price": round(end_price, 2),
        "pct_change": round(pct_change, 2),
        "daily_volatility": round(daily_vol, 6) if daily_vol is not None else None,
        "annualized_volatility_pct": round(annualized_vol * 100, 2) if annualized_vol is not None else None,
        "event_count": int(len(events_in_range)),
        "changepoint_count": int(len(changepoints_in_range)),
    })


@app.get("/api/events/<int:event_id>/impact")
def get_event_impact(event_id):
    window_days = request.args.get("window_days", default=30, type=int)
    if window_days is None or window_days <= 0:
        raise ValueError("window_days must be a positive integer")

    match = dl.EVENTS[dl.EVENTS["id"] == event_id]
    if match.empty:
        return jsonify({"error": f"Event {event_id} not found"}), 404

    event = match.iloc[0]
    event_date = event["Date"]
    window = pd.Timedelta(days=window_days)

    before = dl.PRICES[(dl.PRICES["Date"] >= event_date - window) & (dl.PRICES["Date"] < event_date)]
    after = dl.PRICES[(dl.PRICES["Date"] >= event_date) & (dl.PRICES["Date"] <= event_date + window)]

    if before.empty or after.empty:
        return jsonify({"error": "Not enough price data around this event"}), 404

    before_avg_price = float(before["Price"].mean())
    after_avg_price = float(after["Price"].mean())
    before_vol = float(before["Log_Return"].dropna().std()) if not before["Log_Return"].dropna().empty else None
    after_vol = float(after["Log_Return"].dropna().std()) if not after["Log_Return"].dropna().empty else None

    return jsonify({
        "event": {
            "id": int(event["id"]),
            "date": event_date.strftime("%Y-%m-%d"),
            "event": event["Event"],
            "category": event["Category"],
            "description": event["Description"],
        },
        "window_days": window_days,
        "before_avg_price": round(before_avg_price, 2),
        "after_avg_price": round(after_avg_price, 2),
        "pct_change": round((after_avg_price - before_avg_price) / before_avg_price * 100, 2),
        "before_volatility": round(before_vol, 6) if before_vol is not None else None,
        "after_volatility": round(after_vol, 6) if after_vol is not None else None,
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
