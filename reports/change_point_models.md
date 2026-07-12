# Change Point Models for Brent Oil Price Analysis

## Introduction

Brent oil prices are affected by many external factors, including geopolitical conflicts, OPEC decisions, economic crises, and global supply-demand changes. These events can cause sudden changes in the behavior of oil prices.

A change point model is a statistical approach used to identify points in a time series where the underlying statistical properties change. These changes are called structural breaks.

In this project, change point analysis is used to detect periods when Brent oil prices experienced significant shifts and to investigate whether these shifts occurred around major historical events.


## Purpose of Change Point Models

Traditional time series models often assume that the statistical characteristics of a dataset remain constant over time. However, financial and energy markets frequently experience sudden changes.

Change point models help identify:

* Changes in average oil price levels
* Changes in market volatility
* Transitions between different market conditions
* Periods where external events may have influenced price behavior

For Brent oil prices, detected change points may correspond to events such as:

* Geopolitical conflicts
* OPEC production decisions
* Economic recessions
* Global supply disruptions

## How Change Point Models Work

A change point model assumes that a time series can be divided into different periods, where each period has its own statistical characteristics.

For example:

Before a change point:

* Average price = μ₁
* Market behavior follows one pattern

After a change point:

* Average price = μ₂
* Market behavior follows a different pattern

The model estimates the most likely time point where this change occurred.

In a Bayesian change point model, uncertainty is included by estimating probabilities for possible change points rather than selecting only one fixed date.


## Application to Brent Oil Prices

For this analysis, the model will examine historical Brent oil prices and identify dates where the price behavior significantly changed.

The detected change points will then be compared with the event dataset containing:

* Political events
* OPEC decisions
* Economic shocks

This comparison helps generate hypotheses about possible factors influencing major price movements.

## Expected Outputs

The change point analysis is expected to produce the following outputs:

### 1. Change Point Dates

The model identifies estimated dates where significant structural changes occurred in the Brent oil price series.

Example:

* A possible change point around March 2020 during the COVID-19 oil price crash.

### 2. Before and After Parameters

The model estimates different statistical parameters before and after each change point, including:

* Mean price level
* Price variability
* Market volatility

Example:

Before change point:

* Average price = $70/barrel

After change point:

* Average price = $40/barrel

### 3. Posterior Distributions

Bayesian modeling provides probability distributions showing uncertainty around:

* Change point location
* Parameter estimates
* Model predictions

### 4. Quantified Impact

The analysis can measure how much prices changed after detected structural breaks.

Example:

"Following an OPEC production cut announcement, the model detected a shift in average Brent prices from X USD/barrel to Y USD/barrel."


## Limitations of Change Point Analysis

Although change point models can identify periods of significant change, they have several limitations:

1. A detected change point does not prove that a specific event caused the price change.

2. Multiple events may occur close together, making it difficult to determine the exact cause.

3. Market reactions may occur before or after an event due to expectations and delayed effects.

4. Results depend on model assumptions, selected distributions, and prior choices.

5. Change point models identify statistical patterns but do not replace economic analysis.


## Conclusion

Change point analysis provides a useful framework for understanding structural changes in Brent oil prices. By identifying periods of significant market shifts and comparing them with historical events, this analysis can provide insights into possible relationships between global events and oil market behavior.
