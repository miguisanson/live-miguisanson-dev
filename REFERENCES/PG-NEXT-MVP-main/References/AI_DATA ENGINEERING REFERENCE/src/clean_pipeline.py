from pathlib import Path
import pandas as pd
import numpy as np
import re
from unidecode import unidecode

from langdetect import detect, DetectorFactory
DetectorFactory.seed = 0

# =========================
# Paths
# =========================
BASE_DIR = Path(__file__).resolve().parent.parent
RAW_PATH = BASE_DIR / "data" / "raw" / "Lazada PH Fabric - Student Copy.xlsx"
INTERIM_DIR = BASE_DIR / "data" / "interim"
PROCESSED_DIR = BASE_DIR / "data" / "processed"

INTERIM_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

# =========================
# Helpers
# =========================
def normalize_text(x):
    if pd.isna(x):
        return np.nan
    x = str(x)
    x = unidecode(x)
    x = x.strip()
    x = re.sub(r"\s+", " ", x)
    return x

def normalize_text_lower(x):
    x = normalize_text(x)
    return x.lower() if isinstance(x, str) else np.nan

def parse_bool(x):
    if pd.isna(x):
        return np.nan
    x = str(x).strip().lower()
    true_vals = {"true", "yes", "y", "1"}
    false_vals = {"false", "no", "n", "0"}
    if x in true_vals:
        return 1
    if x in false_vals:
        return 0
    return np.nan

def has_text(x):
    return int(isinstance(x, str) and x.strip() != "")

def has_image(x):
    return int(isinstance(x, str) and x.strip() != "")

def clean_product_name(x):
    x = normalize_text_lower(x)
    if pd.isna(x):
        return np.nan
    x = re.sub(r"[^\w\s/&()-]", " ", x)
    x = re.sub(r"\s+", " ", x).strip()
    return x

def detect_language_label(text):
    """
    Returns a simple language flag:
    - English
    - Tagalog
    - Mixed/Other
    - Unknown
    """
    if pd.isna(text):
        return "Unknown"

    text = str(text).strip()
    if len(text) < 8:
        return "Unknown"

    try:
        lang = detect(text)
        if lang == "en":
            return "English"
        elif lang == "tl":
            return "Tagalog"
        else:
            return "Mixed/Other"
    except:
        return "Unknown"

# =========================
# Mapping dictionaries
# =========================
BRAND_MAP = {
    "ariel": "Ariel",
    "downy": "Downy",
    "tide": "Tide",
    "champion": "Champion",
    "surf": "Surf",
    "breeze": "Breeze",
    "calla": "Calla",
}

RELEVANT_KEYWORDS = {
    "detergent", "fabcon", "fabric conditioner", "softener",
    "liquid detergent", "powder detergent", "bleach",
    "stain remover", "laundry", "ariel", "downy", "tide"
}

IRRELEVANT_KEYWORDS = {
    "razor", "blade", "shaving", "trimmer",
    "air freshener", "toothbrush", "shampoo"
}

VECTOR_KEYWORDS = {
    "Product": [
        "mabisa", "effective", "hindi mabisa", "not effective",
        "stain", "linis", "soft", "bango", "amoy",
        "quality", "works", "not working"
    ],
    "Packaging": [
        "leak", "damaged", "opened", "pouch", "seal",
        "bottle", "basag", "tagas"
    ],
    "Communication": [
        "misleading", "description", "instructions",
        "label", "fake photo", "listing"
    ],
    "Retail Execution": [
        "wrong item", "late delivery", "seller", "courier",
        "missing item", "not received"
    ],
    "Value": [
        "mahal", "expensive", "overpriced", "worth it",
        "sulit", "too small"
    ],
}

def canonicalize_brand(row):
    raw = row.get("brand_clean", np.nan)
    pname = row.get("productName_clean", np.nan)

    if isinstance(raw, str):
        for k, v in BRAND_MAP.items():
            if k in raw:
                return v

    if isinstance(pname, str):
        for k, v in BRAND_MAP.items():
            if k in pname:
                return v

    return "Unknown"

def relevance_flag(text):
    if pd.isna(text):
        return "borderline"
    text = str(text).lower()

    rel = any(k in text for k in RELEVANT_KEYWORDS)
    irr = any(k in text for k in IRRELEVANT_KEYWORDS)

    if rel and not irr:
        return "relevant"
    if irr and not rel:
        return "irrelevant"
    return "borderline"

def tag_issue_vector(text):
    if pd.isna(text):
        return "Unknown"
    text = str(text).lower()

    hits = {}
    for vector, keywords in VECTOR_KEYWORDS.items():
        score = sum(kw in text for kw in keywords)
        if score > 0:
            hits[vector] = score

    if not hits:
        return "Unknown"

    return max(hits, key=hits.get)

def issue_owner(vector):
    owner_map = {
        "Product": "R&D / Brand",
        "Packaging": "Packaging Team",
        "Communication": "Marketing / Content",
        "Retail Execution": "Marketplace Ops / Sales",
        "Value": "Commercial / Pricing",
        "Unknown": "Needs Review"
    }
    return owner_map.get(vector, "Needs Review")

# =========================
# Main pipeline
# =========================
def main():
    if not RAW_PATH.exists():
        raise FileNotFoundError(f"File not found: {RAW_PATH}")

    print(f"Reading: {RAW_PATH}")
    df_raw = pd.read_excel(RAW_PATH, engine="openpyxl")

    print("Raw shape:", df_raw.shape)
    print("Columns:")
    print(df_raw.columns.tolist())

    # Save raw snapshot
    df_raw.to_csv(INTERIM_DIR / "bronze_raw_snapshot.csv", index=False)

    df = df_raw.copy()

    # Standardize column names
    df.columns = [str(c).strip() for c in df.columns]

    string_cols = [
        "retailerName", "market", "site", "productName", "category", "subcategory",
        "brand", "retailerProductCode", "productUrl", "aboutThisItem",
        "internalReviewId", "reviewDate", "reviewDateISO", "reviewText",
        "parentOrChild", "reviewUrl", "reviewType", "verifiedPurchase",
        "reviewCustomerImages", "dateAddedToCatalog"
    ]

    for col in string_cols:
        if col in df.columns:
            df[col] = df[col].apply(normalize_text)

    # Clean helper columns
    if "productName" in df.columns:
        df["productName_clean"] = df["productName"].apply(clean_product_name)
    else:
        df["productName_clean"] = np.nan

    if "brand" in df.columns:
        df["brand_clean"] = df["brand"].apply(normalize_text_lower)
    else:
        df["brand_clean"] = np.nan

    if "category" in df.columns:
        df["category_clean"] = df["category"].apply(normalize_text_lower)
    else:
        df["category_clean"] = np.nan

    if "subcategory" in df.columns:
        df["subcategory_clean"] = df["subcategory"].apply(normalize_text_lower)
    else:
        df["subcategory_clean"] = np.nan

    if "reviewText" in df.columns:
        df["reviewText_clean"] = df["reviewText"].apply(normalize_text_lower)
    else:
        df["reviewText_clean"] = np.nan

    # Dates
    if "reviewDateISO" in df.columns:
        df["review_date"] = pd.to_datetime(df["reviewDateISO"], errors="coerce")
    elif "reviewDate" in df.columns:
        df["review_date"] = pd.to_datetime(df["reviewDate"], errors="coerce")
    else:
        df["review_date"] = pd.NaT

    if "dateAddedToCatalog" in df.columns:
        df["dateAddedToCatalog_clean"] = pd.to_datetime(df["dateAddedToCatalog"], errors="coerce")
    else:
        df["dateAddedToCatalog_clean"] = pd.NaT

    # Numerics
    for col in ["numberOfReviews", "productRating", "reviewRating", "helpfulReviewCount"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # Flags
    if "verifiedPurchase" in df.columns:
        df["verified_purchase_flag"] = df["verifiedPurchase"].apply(parse_bool)
    else:
        df["verified_purchase_flag"] = np.nan

    if "reviewText" in df.columns:
        df["has_text"] = df["reviewText"].apply(has_text)
    else:
        df["has_text"] = 0

    if "reviewCustomerImages" in df.columns:
        df["has_image"] = df["reviewCustomerImages"].apply(has_image)
    else:
        df["has_image"] = 0

    if "reviewRating" in df.columns:
        df["low_rating_flag"] = (df["reviewRating"] <= 2).astype("Int64")
    else:
        df["low_rating_flag"] = pd.Series([pd.NA] * len(df), dtype="Int64")

    # Split review rows vs product-only rows
    review_key_cols = ["internalReviewId", "reviewRating", "reviewText", "reviewDateISO", "reviewDate"]
    present_review_cols = [c for c in review_key_cols if c in df.columns]

    if present_review_cols:
        df["is_review_row"] = df[present_review_cols].notna().any(axis=1).astype(int)
    else:
        df["is_review_row"] = 0

    df_reviews = df[df["is_review_row"] == 1].copy()
    df_products = df[df["is_review_row"] == 0].copy()

    print("Review rows:", len(df_reviews))
    print("Product-only rows:", len(df_products))

    # Save duplicates for QA before removing
    if "internalReviewId" in df_reviews.columns:
        dupes = df_reviews[df_reviews.duplicated(subset=["internalReviewId"], keep=False)].copy()
        dupes.to_csv(INTERIM_DIR / "qa_duplicate_reviews.csv", index=False)

        # Deduplicate
        sort_cols = [c for c in ["internalReviewId", "review_date", "has_text", "has_image"] if c in df_reviews.columns]
        ascending = [True, False, False, False][:len(sort_cols)]

        df_reviews = df_reviews.sort_values(by=sort_cols, ascending=ascending)
        before = len(df_reviews)
        df_reviews = df_reviews.drop_duplicates(subset=["internalReviewId"], keep="first")
        after = len(df_reviews)
        print("Removed duplicate reviews:", before - after)

    # Drop low-value columns only in gold layer
    low_value_cols = [
        "upc", "manufacturer", "additionalProductDescription",
        "ingredients", "dateFirstAvailable", "retailerReviewId", "reviewTitle"
    ]
    df_reviews_gold = df_reviews.drop(columns=[c for c in low_value_cols if c in df_reviews.columns], errors="ignore").copy()

    # Canonical brand
    df_reviews_gold["brand_canonical"] = df_reviews_gold.apply(canonicalize_brand, axis=1)
    df_products["brand_canonical"] = df_products.apply(canonicalize_brand, axis=1)

    # Relevance
    df_reviews_gold["relevance_flag"] = df_reviews_gold["productName_clean"].apply(relevance_flag)
    df_products["relevance_flag"] = df_products["productName_clean"].apply(relevance_flag)

    # Issue routing
    df_reviews_gold["issue_vector"] = df_reviews_gold["reviewText_clean"].apply(tag_issue_vector)
    df_reviews_gold["issue_owner"] = df_reviews_gold["issue_vector"].apply(issue_owner)

    df_reviews_gold["language_flag"] = df_reviews_gold["reviewText"].apply(detect_language_label)

    # Final master table
    final_cols = [
        "retailerName", "market", "site",
        "retailerProductCode", "productName", "productName_clean",
        "category", "subcategory", "brand", "brand_canonical",
        "productUrl", "dateAddedToCatalog_clean",
        "internalReviewId", "review_date", "reviewRating",
        "reviewText", "reviewText_clean",
        "language_flag",
        "verified_purchase_flag", "has_text", "has_image",
        "low_rating_flag", "relevance_flag",
        "issue_vector", "issue_owner"
    ]
    final_cols = [c for c in final_cols if c in df_reviews_gold.columns]
    df_master = df_reviews_gold[final_cols].copy()
    df_master_main = df_master[df_master["relevance_flag"].isin(["relevant", "borderline"])].copy()

    # QA summary
    qa_summary = {
        "raw_rows": len(df_raw),
        "review_rows_after_split": len(df_reviews),
        "product_only_rows": len(df_products),
        "final_master_rows": len(df_master),
        "distinct_products": df_master["retailerProductCode"].nunique(dropna=True) if "retailerProductCode" in df_master.columns else np.nan,
        "distinct_reviews": df_master["internalReviewId"].nunique(dropna=True) if "internalReviewId" in df_master.columns else np.nan,
        "pct_has_text": round(df_master["has_text"].mean() * 100, 2) if "has_text" in df_master.columns else np.nan,
        "pct_has_image": round(df_master["has_image"].mean() * 100, 2) if "has_image" in df_master.columns else np.nan,
        "pct_low_rating": round(df_master["low_rating_flag"].fillna(0).mean() * 100, 2) if "low_rating_flag" in df_master.columns else np.nan,
    }
    qa_df = pd.DataFrame(list(qa_summary.items()), columns=["metric", "value"])

    brand_summary = (
        df_master_main
        .groupby("brand_canonical", dropna=False)
        .agg(
            reviews=("internalReviewId", "count"),
            avg_rating=("reviewRating", "mean"),
            low_rating_rate=("low_rating_flag", "mean")
        )
        .reset_index()
    ) if not df_master_main.empty else pd.DataFrame()

    vector_summary = (
        df_master_main
        .groupby(["brand_canonical", "issue_vector"], dropna=False)
        .size()
        .reset_index(name="review_count")
    ) if not df_master_main.empty else pd.DataFrame()

    null_pct = (df_raw.isna().mean() * 100).sort_values(ascending=False).reset_index()
    null_pct.columns = ["column", "null_percent"]

    # Export
    df_products.to_csv(PROCESSED_DIR / "dim_product_clean.csv", index=False)
    df_master.to_csv(PROCESSED_DIR / "fact_review_clean.csv", index=False)
    df_master_main.to_csv(PROCESSED_DIR / "fact_review_clean_main.csv", index=False)
    qa_df.to_csv(PROCESSED_DIR / "qa_summary.csv", index=False)
    brand_summary.to_csv(PROCESSED_DIR / "brand_summary.csv", index=False)
    vector_summary.to_csv(PROCESSED_DIR / "brand_vector_summary.csv", index=False)
    null_pct.to_csv(PROCESSED_DIR / "null_profile.csv", index=False)

    # Excel doesn't support timezone-aware datetimes — strip tz before writing
    def strip_tz(df):
        df = df.copy()
        for col in df.select_dtypes(include=["datetimetz"]).columns:
            df[col] = df[col].dt.tz_localize(None)
        return df

    with pd.ExcelWriter(PROCESSED_DIR / "cleaned_outputs.xlsx", engine="openpyxl") as writer:
        strip_tz(df_products).to_excel(writer, sheet_name="dim_product_clean", index=False)
        strip_tz(df_master).to_excel(writer, sheet_name="fact_review_clean", index=False)
        strip_tz(df_master_main).to_excel(writer, sheet_name="fact_review_main", index=False)
        qa_df.to_excel(writer, sheet_name="qa_summary", index=False)
        brand_summary.to_excel(writer, sheet_name="brand_summary", index=False)
        vector_summary.to_excel(writer, sheet_name="brand_vector_summary", index=False)
        null_pct.to_excel(writer, sheet_name="null_profile", index=False)

    print("\nDone. Files written to:")
    print(PROCESSED_DIR)

if __name__ == "__main__":
    main()