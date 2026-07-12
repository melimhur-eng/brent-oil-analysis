# Brent Oil Price Analysis Workflow

## 1. Business Understanding

The objective of this analysis is to investigate how major geopolitical events, OPEC decisions, and economic shocks influence Brent crude oil prices. The analysis aims to identify significant changes in oil price behavior, understand possible relationships with historical events, and provide data-driven insights for energy market stakeholders.


## 2. Data Collection and Loading

The analysis begins by collecting and loading the historical Brent oil price dataset. The dataset contains daily Brent oil prices with two main attributes:

* **Date:** The date of the recorded oil price.
* **Price:** Brent crude oil price in USD per barrel.

The Date column will be converted into a datetime format to support time-series analysis. Initial checks will be performed to identify missing values, duplicate records, and data quality issues.


## 3. Data Preparation and Cleaning

The raw dataset will be prepared for analysis by:

* Converting dates into the correct datetime format.
* Sorting observations chronologically.
* Checking for missing values.
* Handling inconsistencies in the dataset.
* Creating additional features such as daily log returns.

Log returns will be calculated as:

**Log Return = log(Price at time t) - log(Price at time t-1)**

This transformation helps analyze price movements and volatility patterns.


## 4. Exploratory Data Analysis (EDA)

Exploratory analysis will be conducted to understand the characteristics of the Brent oil price series.

The analysis will include:

### Trend Analysis

* Visualizing historical Brent oil prices.
* Identifying long-term increases, decreases, and major market shocks.

### Stationarity Analysis

* Testing whether the price series is stationary.
* Comparing raw prices with log returns.
* Understanding how stationarity affects model selection.

### Volatility Analysis

* Examining fluctuations in log returns.
* Identifying periods of high and low market volatility.

EDA findings will guide the selection of appropriate statistical models.


## 5. Event Data Integration

A structured event dataset will be created containing major:

* Geopolitical events.
* OPEC production decisions.
* Economic crises.

Each event will include an approximate date and description. These events will later be compared with detected structural changes in oil prices.


## 6. Change Point Analysis

A Bayesian change point model will be developed to identify periods where Brent oil prices experience significant structural changes.

The model will estimate:

* Possible change point dates.
* Price behavior before and after changes.
* Changes in average price levels and volatility.

Detected change points will be compared with historical events to identify possible explanations for market shifts.


## 7. Statistical Interpretation and Insight Generation

The final stage will focus on interpreting the analysis results.

Insights will include:

* Major periods of oil price changes.
* Events occurring near detected change points.
* Quantified differences in price behavior before and after structural breaks.
* Limitations of interpreting statistical relationships as causal effects.

The final results will be communicated through visualizations, reports, and recommendations for energy market stakeholders.
