"""
Review Sentiment & Business Intelligence Engine

Pipeline:
    1. Load reviews from CSV (or use synthetic data if CSV is missing)
    2. Engineer features: classify reviews into business vectors via keyword matching
    3. Analyze sentiment using a signed lexicon with intensifier and negation handling                      
    4. Extract insights per vector based on sentiment distribution and volume
    5. Generate visualizations: bar chart of sentiment by vector, heatmap of brand x vector sentiment, pie chart of overall sentiment distribution
    6. Compile a markdown report summarizing findings and recommended actions

Dependencies (all standard):
    - pandas
    - numpy
    - matplotlib

Usage:
    python main.py
    Place `reviews.csv` in the same directory with the required columns to use real data, or run without it to see the pipeline in action with synthetic reviews.
    Requuired columns in CSV: `review_text`, `product`, `brand`, `company`
"""

import logging
import os

import matplotlib.colors as mcolors
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)



# Configuration
DATA_PATH = "reviews.csv"
OUTPUT_DIR = "outputs"

# Thresholds for classifying sentiment labels based on the compound score.
# above positive_threshold => "positive"
# below negative_threshold => "negative"
# between positive_threshold and negative_threshold => "neutral"
POSITIVE_THRESHOLD = 0.15
NEGATIVE_THRESHOLD = -0.15

VECTORS: list[str] = [
    "product",
    "packaging",
    "communication",
    "retail_execution",
    "value",
]

VECTOR_KEYWORDS: dict[str, list[str]] = {
    "product": [
        "performance", "formulation", "consistency", "quality",
        "thick", "tubig", "fabcon", "formula", "scent", "effect",
    ],
    "packaging": [
        "packaging", "damaged", "box", "wrap", "leaking",
        "seal", "bukas", "basag", "broken",
    ],
    "communication": [
        "communication", "seller", "message", "response",
        "reply", "nagre-respond", "nag-reply", "contact",
    ],
    "retail_execution": [
        "delivery", "legit", "courier", "arrived", "late",
        "shipping", "dispatched", "tracking", "delayed",
    ],
    "value": [
        "value", "money", "price", "pesos", "halaga",
        "sulit", "worth", "mahal", "mura", "bayad",
    ],
}

# signed lexicon of sentiment-bearing tokens. Both English and Filipino/Tagalog terms are included to capture the bilingual nature of reviews. Weights are calibrated so that typical reviews (5-40 tokens) will yield compound scores in the range of [-1, 1].
# English and Filipino/Tagalog terms combined.
# weights are calibrated so that typical reviews will yield compound scores in the range of [-1, 1] without needing further scaling, allowing for more intuitive interpretation and threshold setting.  
# review length is not a direct factor in the score since we use tanh normalisation, but the lexicon weights are set with typical review lengths in mind to ensure that average reviews will cluster around the middle of the scale, while very positive or negative reviews can approach the extremes. 
SENTIMENT_LEXICON: dict[str, float] = {
    # positive tokens
    "great":        0.6,
    "good":         0.5,
    "excellent":    0.8,
    "best":         0.7,
    "love":         0.7,
    "awesome":      0.7,
    "satisfied":    0.6,
    "recommend":    0.5,
    "legit":        0.7,
    "authentic":    0.6,
    "fast":         0.4,
    "quick":        0.4,
    "sulit":        0.7,   # good value
    "maganda":      0.6,   # good / beautiful
    "ganda":        0.5,
    "salamat":      0.3,   # thank you (positive signal)
    "slamat":       0.3,
    "okay":         0.2,
    "legit":        0.6,
    # negative tokens
    "bad":         -0.6,
    "poor":        -0.6,
    "terrible":    -0.8,
    "awful":       -0.8,
    "worst":       -0.9,
    "damaged":     -0.7,
    "broken":      -0.7,
    "leaking":     -0.7,
    "late":        -0.5,
    "delayed":     -0.5,
    "fake":        -0.8,
    "counterfeit": -0.8,
    "expensive":   -0.5,
    "overpriced":  -0.6,
    "disappointed":-0.7,
    "unresponsive":-0.6,
    "tubig":       -0.7,   # watered-down product
    "mahal":       -0.4,   # expensive
    "pangit":      -0.8,   # bad / ugly
    "wala":        -0.4,   # absent / none
    "mali":        -0.6,   # wrong
    "sirang":      -0.8,   # broken / ruined
    "peke":        -1.0,   # counterfeit
    # Intensifiers and negators are not included here since they are 
    # handled separately in code since they don't have inherent sentiment weight
}

INTENSIFIERS: set[str] = {"very", "sobra", "grabe", "super", "talagang", "really", "extremely"}
NEGATORS: set[str] = {"not", "hindi", "wala", "never", "no", "di", "hinde"}



# Data Loading
def _synthetic_data() -> pd.DataFrame:
    rows = {
        "review_text": [
            "Tubig na po yung fabcon. Hindi na tulad ng dati na thick yung consistency.",
            "Legit seller. Salamat po, packaging okay naman.",
            "Great value for money, would buy again.",
            "2 liters nabibili ko lang sa halagang 111 pesos. Sulit!",
            "Packaging arrived damaged and leaking. Box was not sealed properly.",
            "Communication from seller was excellent and fast.",
            "Delivery was late. Courier was unresponsive to tracking queries.",
            "Product performance is top-notch. Formula is very consistent.",
            "Hindi sulit. Mahal na nga, pangit pa quality ng product.",
            "Seller replied agad. Legit seller, scent is strong and long-lasting.",
            "Maganda ang quality ng product. Will definitely re-order.",
            "Poor value for price paid. Expected better formulation.",
        ],
        "product": ["Fabcon"] * 6 + ["Shampoo"] * 6,
        "brand":   ["Downy"] * 6 + ["Pantene"] * 6,
        "company": ["P&G"] * 6 + ["Unilever"] * 6,
    }
    return pd.DataFrame(rows)


def load_reviews() -> pd.DataFrame:
    if os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
        required = {"review_text", "product", "brand", "company"}
        missing = required - set(df.columns)
        if missing:
            raise ValueError(f"CSV is missing required columns: {missing}")
        log.info("Loaded %d rows from %s", len(df), DATA_PATH)
    else:
        df = _synthetic_data()
        log.info("No CSV found at '%s'. Using %d-row synthetic dataset.", DATA_PATH, len(df))
    return df.dropna(subset=["review_text"]).reset_index(drop=True)


# Feature Engineering
def classify_vectors(text: str) -> list[str]:
    """
    Return a list of business vectors that the review text pertains to, based on keyword matching.
    A review can belong to multiple vectors if it contains keywords from each. If no keywords match
    the text, it is classified under "other".
    """
    text_lower = text.lower()
    matched = [
        vector
        for vector, keywords in VECTOR_KEYWORDS.items()
        if any(kw in text_lower for kw in keywords)
    ]
    return matched if matched else ["other"]


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["vectors"] = df["review_text"].apply(classify_vectors)
    df["primary_vector"] = df["vectors"].apply(lambda v: v[0])
    df["cbp"] = df.apply(
        lambda r: f"{r['company']} / {r['brand']} / {r['product']}", axis=1
    )
    log.info("Feature engineering complete.")
    return df


# Sentiment Analysis
def _score_text(text: str) -> float:
    """
    Compute a sentiment score for the review text using a signed lexicon with
    intensifier multiplication and negation flipping. The final score is    
    normalised to (-1, 1) using tanh to prevent long reviews from dominating.
    Negation flips the sign of the next 3 scored tokens. Intensifiers multiply          
    the weight of the next scored token by 1.5x. Both can stack if they occur together.
    """
    import re
    tokens = re.sub(r"[^\w\s]", "", text.lower()).split()

    total = 0.0
    prev_was_intensifier = False
    negation_window = 0  # counts down from 3 when a negator is hit, flipping the sign of scored tokens

    for token in tokens:
        if token in NEGATORS:
            negation_window = 3  # next 3 scored tokens will be negated
            prev_was_intensifier = False
            continue

        if token in INTENSIFIERS:
            prev_was_intensifier = True
            continue

        weight = SENTIMENT_LEXICON.get(token, 0.0)
        if weight != 0.0:
            if prev_was_intensifier:
                weight *= 1.5
            if negation_window > 0:
                weight *= -1
                negation_window -= 1
            total += weight

        prev_was_intensifier = False
        if negation_window > 0:
            negation_window -= 1

    # tanh normalisation: maps any real sum to (-1, 1)
    return float(np.tanh(total))


def analyze_sentiment(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["sentiment_score"] = df["review_text"].apply(_score_text)
    df["sentiment_label"] = df["sentiment_score"].apply(
        lambda s: "positive"
        if s > POSITIVE_THRESHOLD
        else ("negative" if s < NEGATIVE_THRESHOLD else "neutral")
    )
    dist = df["sentiment_label"].value_counts().to_dict()
    log.info("Sentiment analysis complete. Distribution: %s", dist)
    return df



# Insight Extraction
_RECOMMENDATIONS: dict[str, dict[str, str]] = {
    "product": {
        "negative": (
            "Launch a quality-reassurance campaign. Highlight formula "
            "consistency and product authenticity in listings and content."
        ),
        "positive": (
            "Leverage positive product sentiment in paid media. "
            "Feature top reviews in product detail pages."
        ),
    },
    "packaging": {
        "negative": (
            "Audit packaging supplier for seal and structural integrity. "
            "Add a replacement guarantee to listings to reduce churn from damaged orders."
        ),
        "positive": (
            "Packaging is a differentiator. Maintain standards and "
            "highlight unboxing experience in social content."
        ),
    },
    "value": {
        "negative": (
            "Introduce a bundle promo or trial SKU to address price sensitivity. "
            "Communicate cost-per-use versus competitors."
        ),
        "positive": (
            "Value perception is strong. Reinforce with best-value badging "
            "and loyalty program incentives."
        ),
    },
    "retail_execution": {
        "negative": (
            "Escalate courier SLA breaches. Conduct fulfillment partner audit "
            "and surface real-time tracking in post-purchase communications."
        ),
        "positive": (
            "Delivery execution is working. Benchmark current courier partners "
            "and replicate model across other SKUs."
        ),
    },
    "communication": {
        "negative": (
            "Implement auto-reply templates for seller response time. "
            "Target sub-1-hour first response on marketplace channels."
        ),
        "positive": (
            "Seller communication is a competitive advantage. "
            "Document response playbooks and scale to new agents."
        ),
    },
}


def extract_insights(df: pd.DataFrame) -> dict[str, list[str]]:
    exploded = df.explode("vectors").rename(columns={"vectors": "vector"})
    insights: dict[str, list[str]] = {}

    for vector in VECTORS:
        vec_df = exploded[exploded["vector"] == vector]
        if vec_df.empty:
            continue

        neg_df = vec_df[vec_df["sentiment_label"] == "negative"]
        pos_df = vec_df[vec_df["sentiment_label"] == "positive"]
        total_mentions = len(vec_df)
        avg_score = vec_df["sentiment_score"].mean()

        lines: list[str] = [
            f"Mentions: {total_mentions} | "
            f"Avg sentiment score: {avg_score:.3f} | "
            f"Negative: {len(neg_df)} | Positive: {len(pos_df)}"
        ]

        if not neg_df.empty:
            affected = neg_df["brand"].value_counts().head(3).to_dict()
            lines.append(f"Brands with negative mentions: {affected}")
            rec = _RECOMMENDATIONS.get(vector, {}).get(
                "negative", "Review negative feedback manually."
            )
            lines.append(f"Recommended action: {rec}")
        else:
            top = pos_df["brand"].value_counts().head(3).to_dict() if not pos_df.empty else {}
            lines.append(f"No negative mentions. Leading brands: {top}")
            rec = _RECOMMENDATIONS.get(vector, {}).get(
                "positive", "Maintain current performance."
            )
            lines.append(f"Recommended action: {rec}")

        insights[vector] = lines

    log.info("Insight extraction complete for %d vectors.", len(insights))
    return insights


# Visualizations
def _bar_chart(vec_avg: pd.Series) -> None:
    colors = ["#c0392b" if v < 0 else "#27ae60" for v in vec_avg.values]
    fig, ax = plt.subplots(figsize=(9, 5))
    bars = ax.bar(
        vec_avg.index, vec_avg.values,
        color=colors, edgecolor="white", linewidth=0.6,
    )
    ax.axhline(0, color="#7f8c8d", linewidth=0.8, linestyle="--")
    ax.set_title("Average Sentiment Score per Business Vector", fontsize=13, fontweight="bold")
    ax.set_xlabel("Vector")
    ax.set_ylabel("Sentiment Score (tanh-normalised)")
    ax.set_ylim(-1.1, 1.1)
    for bar, val in zip(bars, vec_avg.values):
        offset = 0.03 if val >= 0 else -0.07
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            val + offset,
            f"{val:.3f}",
            ha="center", va="bottom", fontsize=9,
        )
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "sentiment_by_vector.png"), dpi=150)
    plt.close()
    log.info("Saved sentiment_by_vector.png")


def _heatmap(pivot: pd.DataFrame) -> None:
    if pivot.empty:
        log.warning("Heatmap skipped: pivot table is empty.")
        return
    cmap = mcolors.LinearSegmentedColormap.from_list(
        "sentiment", ["#c0392b", "#ecf0f1", "#27ae60"]
    )
    fig, ax = plt.subplots(figsize=(10, max(3, len(pivot) * 0.9)))
    im = ax.imshow(pivot.values, cmap=cmap, vmin=-1, vmax=1, aspect="auto")
    ax.set_xticks(range(len(pivot.columns)))
    ax.set_xticklabels(pivot.columns, rotation=30, ha="right", fontsize=10)
    ax.set_yticks(range(len(pivot.index)))
    ax.set_yticklabels(pivot.index, fontsize=10)
    plt.colorbar(im, ax=ax, label="Avg Sentiment Score")
    for i in range(len(pivot.index)):
        for j in range(len(pivot.columns)):
            ax.text(j, i, f"{pivot.values[i, j]:.2f}", ha="center", va="center", fontsize=9)
    ax.set_title("Brand x Vector Sentiment Heatmap", fontsize=13, fontweight="bold")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "heatmap_brand_vector.png"), dpi=150)
    plt.close()
    log.info("Saved heatmap_brand_vector.png")


def _pie_chart(label_counts: pd.Series) -> None:
    palette = {"positive": "#27ae60", "neutral": "#f39c12", "negative": "#c0392b"}
    colors = [palette.get(lbl, "#95a5a6") for lbl in label_counts.index]
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.pie(
        label_counts.values,
        labels=label_counts.index,
        colors=colors,
        autopct="%1.1f%%",
        startangle=90,
        wedgeprops={"edgecolor": "white", "linewidth": 1.2},
    )
    ax.set_title("Overall Sentiment Distribution", fontsize=13, fontweight="bold")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "sentiment_distribution.png"), dpi=150)
    plt.close()
    log.info("Saved sentiment_distribution.png")


def generate_visualizations(df: pd.DataFrame) -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    exploded = df.explode("vectors").rename(columns={"vectors": "vector"})
    active_vectors = [v for v in VECTORS if v in exploded["vector"].values]

    vec_avg = (
        exploded[exploded["vector"].isin(active_vectors)]
        .groupby("vector")["sentiment_score"]
        .mean()
        .reindex(active_vectors)
        .fillna(0)
    )
    _bar_chart(vec_avg)

    pivot = (
        exploded[exploded["vector"].isin(active_vectors)]
        .groupby(["brand", "vector"])["sentiment_score"]
        .mean()
        .unstack(fill_value=0)
        .reindex(columns=active_vectors, fill_value=0)
    )
    _heatmap(pivot)

    _pie_chart(df["sentiment_label"].value_counts())


# Report
def generate_report(df: pd.DataFrame, insights: dict[str, list[str]]) -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    path = os.path.join(OUTPUT_DIR, "report.md")

    total = len(df)
    pos   = (df["sentiment_label"] == "positive").sum()
    neg   = (df["sentiment_label"] == "negative").sum()
    neu   = (df["sentiment_label"] == "neutral").sum()
    avg   = df["sentiment_score"].mean()

    with open(path, "w", encoding="utf-8") as f:
        f.write("# Business Intelligence Report — Review Sentiment Analysis\n\n")

        f.write("## Executive Summary\n\n")
        f.write("| Metric | Value |\n|---|---|\n")
        f.write(f"| Total reviews | {total} |\n")
        f.write(f"| Positive | {pos} ({pos / total * 100:.1f}%) |\n")
        f.write(f"| Neutral | {neu} ({neu / total * 100:.1f}%) |\n")
        f.write(f"| Negative | {neg} ({neg / total * 100:.1f}%) |\n")
        f.write(f"| Overall avg sentiment score | {avg:.3f} |\n\n")

        f.write("## Methodology\n\n")
        f.write(
            "Sentiment is scored using a signed lexicon of English and Filipino/Tagalog tokens, "
            "with intensifier multiplication and negation-window flipping. "
            "Raw sums are normalised to [-1, 1] via tanh so that longer reviews "
            "do not artificially dominate the scale.\n\n"
            "Reviews are assigned to one or more business vectors via keyword matching (multi-label). "
            "Insight rules are applied per vector using negative mention volume "
            "and average score as the primary signals.\n\n"
        )

        f.write("## Vector Insights and Recommended Actions\n\n")
        for vector in VECTORS:
            if vector not in insights:
                continue
            f.write(f"### {vector.replace('_', ' ').title()}\n\n")
            for line in insights[vector]:
                f.write(f"{line}\n\n")

        f.write("## Brand x Vector Summary\n\n")
        exploded = df.explode("vectors").rename(columns={"vectors": "vector"})
        summary = (
            exploded[exploded["vector"].isin(VECTORS)]
            .groupby(["brand", "vector"])["sentiment_score"]
            .agg(avg_score="mean", mention_count="count")
            .round(3)
            .reset_index()
        )
        # Markdown table formatting
        headers = "| " + " | ".join(summary.columns) + " |"
        separator = "| " + " | ".join(["---"] * len(summary.columns)) + " |"
        rows = "\n".join(
            "| " + " | ".join(str(v) for v in row) + " |"
            for row in summary.itertuples(index=False)
        )
        f.write(f"{headers}\n{separator}\n{rows}")
        f.write("\n\n")

        f.write("## Charts\n\n")
        f.write("- `sentiment_by_vector.png` — average sentiment score per business vector\n")
        f.write("- `heatmap_brand_vector.png` — brand x vector sentiment heatmap\n")
        f.write("- `sentiment_distribution.png` — overall positive / neutral / negative split\n")

    log.info("Report saved to %s", path)


# Entry Point
if __name__ == "__main__":
    df = load_reviews()
    df = engineer_features(df)
    df = analyze_sentiment(df)
    insights = extract_insights(df)
    generate_visualizations(df)
    generate_report(df, insights)
    log.info("Pipeline complete. Outputs in '%s/'.", OUTPUT_DIR)