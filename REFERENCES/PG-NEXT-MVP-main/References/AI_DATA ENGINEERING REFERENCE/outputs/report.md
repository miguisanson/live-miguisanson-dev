# Business Intelligence Report — Review Sentiment Analysis

## Executive Summary

| Metric | Value |
|---|---|
| Total reviews | 12 |
| Positive | 6 (50.0%) |
| Neutral | 1 (8.3%) |
| Negative | 5 (41.7%) |
| Overall avg sentiment score | 0.018 |

## Methodology

Sentiment is scored using a signed lexicon of English and Filipino/Tagalog tokens, with intensifier multiplication and negation-window flipping. Raw sums are normalised to [-1, 1] via tanh so that longer reviews do not artificially dominate the scale.

Reviews are assigned to one or more business vectors via keyword matching (multi-label). Insight rules are applied per vector using negative mention volume and average score as the primary signals.

## Vector Insights and Recommended Actions

### Product

Mentions: 6 | Avg sentiment score: -0.145 | Negative: 3 | Positive: 2

Brands with negative mentions: {'Pantene': 2, 'Downy': 1}

Recommended action: Launch a quality-reassurance campaign. Highlight formula consistency and product authenticity in listings and content.

### Packaging

Mentions: 2 | Avg sentiment score: -0.042 | Negative: 1 | Positive: 1

Brands with negative mentions: {'Downy': 1}

Recommended action: Audit packaging supplier for seal and structural integrity. Add a replacement guarantee to listings to reduce churn from damaged orders.

### Communication

Mentions: 3 | Avg sentiment score: 0.724 | Negative: 0 | Positive: 3

No negative mentions. Leading brands: {'Downy': 2, 'Pantene': 1}

Recommended action: Seller communication is a competitive advantage. Document response playbooks and scale to new agents.

### Retail Execution

Mentions: 4 | Avg sentiment score: -0.087 | Negative: 2 | Positive: 2

Brands with negative mentions: {'Downy': 1, 'Pantene': 1}

Recommended action: Escalate courier SLA breaches. Conduct fulfillment partner audit and surface real-time tracking in post-purchase communications.

### Value

Mentions: 4 | Avg sentiment score: -0.049 | Negative: 2 | Positive: 2

Brands with negative mentions: {'Pantene': 2}

Recommended action: Introduce a bundle promo or trial SKU to address price sensitivity. Communicate cost-per-use versus competitors.

## Brand x Vector Summary

| brand | vector | avg_score | mention_count |
| --- | --- | --- | --- |
| Downy | communication | 0.817 | 2 |
| Downy | packaging | -0.042 | 2 |
| Downy | product | -0.604 | 1 |
| Downy | retail_execution | -0.042 | 2 |
| Downy | value | 0.571 | 2 |
| Pantene | communication | 0.537 | 1 |
| Pantene | product | -0.053 | 5 |
| Pantene | retail_execution | -0.132 | 2 |
| Pantene | value | -0.669 | 2 |

## Charts

- `sentiment_by_vector.png` — average sentiment score per business vector
- `heatmap_brand_vector.png` — brand x vector sentiment heatmap
- `sentiment_distribution.png` — overall positive / neutral / negative split
