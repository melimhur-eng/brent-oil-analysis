# Assumptions and Limitations

## Assumptions

1. The Brent crude oil price series accurately reflects major developments in the global oil market.

2. The dates of geopolitical, economic, and OPEC-related events are approximate and represent the beginning of their potential impact on oil prices.

3. Significant changes in the statistical properties of the time series may correspond to major external events that affected the oil market.

4. The relationship between events and oil prices is assumed to be observable through changes in the mean, variance, or volatility of the price series.

5. Daily Brent oil prices provide sufficient temporal resolution to detect structural breaks and market regime changes.

6. The Bayesian change point model assumes that the underlying data-generating process can change at certain points in time and that these changes can be statistically estimated.

## Limitations

1. Oil prices are influenced by many factors simultaneously, including supply and demand, exchange rates, inflation, interest rates, speculation, and global economic conditions. Not all of these variables are included in this analysis.

2. Several important events may occur close together in time, making it difficult to isolate the effect of a single event.

3. Some events affect oil prices gradually rather than immediately, resulting in delayed market responses that may not align perfectly with detected change points.

4. Change point estimates are subject to uncertainty and depend on model assumptions and prior distributions.

5. The analysis focuses on statistical patterns in historical data and cannot perfectly predict future market behavior.

## Statistical Correlation vs. Causal Impact

This analysis aims to identify whether structural breaks in Brent oil prices occur around major geopolitical or economic events. However, finding that a change point occurs near an event does **not** prove that the event caused the price change.

Change point analysis identifies **statistical correlations in time**—that is, whether two occurrences happen around the same period. Demonstrating **causal impact** would require additional evidence, such as incorporating other explanatory variables, conducting causal inference studies, or using economic models that control for confounding factors.

Therefore, any association between detected change points and historical events should be interpreted as a hypothesis about potential causes rather than definitive proof of causation.
