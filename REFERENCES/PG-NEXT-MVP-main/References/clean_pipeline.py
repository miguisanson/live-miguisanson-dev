from pathlib import Path
import pandas as pd
import numpy as np
import re
from unidecode import unidecode
from rapidfuzz import process, fuzz

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
    
GENERIC_BRANDS = {"no brand", "unknown", "n/a", "nan", ""}

def normalize_match_text(x):
    if pd.isna(x):
        return ""
    x = unidecode(str(x)).lower()
    x = re.sub(r"[^a-z0-9%/&.+ -]+", " ", x)
    x = re.sub(r"\s+", " ", x).strip()
    return x

def combine_product_text(product_name, about_this_item):
    parts = []
    if pd.notna(product_name):
        parts.append(str(product_name))
    if pd.notna(about_this_item):
        parts.append(str(about_this_item))
    return " | ".join(parts)

def exact_brand_alias_search(text):
    text = f" {text} "
    for alias, brand_name in sorted(ALIAS_TO_BRAND.items(), key=lambda kv: len(kv[0]), reverse=True):
        if re.search(rf"(?<![a-z0-9]){re.escape(alias)}(?![a-z0-9])", text):
            return brand_name, alias
    return None, None

def infer_brand_fields(product_name, about_this_item, brand_col):
    combined = combine_product_text(product_name, about_this_item)
    text = normalize_match_text(combined)
    brand_col_norm = normalize_match_text(brand_col)

    # 1. Exact alias match from text
    brand_name, matched_alias = exact_brand_alias_search(text)
    if brand_name:
        parent_brand = BRAND_ALIASES[brand_name]["parent_brand"]
        if parent_brand is None and brand_col_norm not in GENERIC_BRANDS:
            if normalize_match_text(brand_col) != normalize_match_text(brand_name):
                parent_brand = str(brand_col).strip()
        return pd.Series({
            "line_brand": brand_name,
            "parent_brand": parent_brand,
            "brand_source": "text_alias_exact",
            "brand_match_text": matched_alias
        })

    # 2. Explicit "brand: JN" style field inside aboutThisItem
    m = re.search(r"brand\s*[:=-]\s*([a-z][a-z0-9 &/\-]{1,40})", text)
    if m:
        explicit_brand = m.group(1).strip().title()
        return pd.Series({
            "line_brand": explicit_brand,
            "parent_brand": None,
            "brand_source": "about_brand_field",
            "brand_match_text": explicit_brand
        })

    # 3. Use existing brand column if it is not generic
    if brand_col_norm not in GENERIC_BRANDS:
        return pd.Series({
            "line_brand": str(brand_col).strip(),
            "parent_brand": None,
            "brand_source": "brand_column",
            "brand_match_text": str(brand_col).strip()
        })

    # 4. Fuzzy fallback against aliases
    alias_choices = list(ALIAS_TO_BRAND.keys())
    fuzzy_result = process.extractOne(text, alias_choices, scorer=fuzz.partial_ratio)
    if fuzzy_result and fuzzy_result[1] >= 90:
        matched_alias = fuzzy_result[0]
        brand_name = ALIAS_TO_BRAND[matched_alias]
        return pd.Series({
            "line_brand": brand_name,
            "parent_brand": BRAND_ALIASES[brand_name]["parent_brand"],
            "brand_source": "text_alias_fuzzy",
            "brand_match_text": matched_alias
        })

    return pd.Series({
        "line_brand": "Unknown",
        "parent_brand": None,
        "brand_source": "unknown",
        "brand_match_text": None
    })

VOLUME_TO_ML = {
    "ml": 1,
    "l": 1000,
    "liter": 1000,
    "liters": 1000,
    "ltr": 1000,
    "gallon": 3785.41,
    "gallons": 3785.41,
    "gal": 3785.41,
}

WEIGHT_TO_G = {
    "g": 1,
    "kg": 1000,
    "gram": 1,
    "grams": 1,
}

SIZE_X_PACK_RE = re.compile(
    r"(?P<value>\d+(?:\.\d+)?)\s*(?P<unit>kg|g|grams?|ml|l|liters?|liter|ltr|gallons?|gallon|gal|oz)\s*[xX]\s*(?P<pack>\d+)\b",
    re.I
)

SIZE_RE = re.compile(
    r"(?P<value>\d+(?:\.\d+)?)\s*(?P<unit>kg|g|grams?|ml|l|liters?|liter|ltr|gallons?|gallon|gal|oz)\b",
    re.I
)

PACK_RE = re.compile(
    r"(?:(?:bundle|set|pack)\s*of\s*(?P<bundle>\d+))|(?P<count>\d+)\s*(?:pcs?|pc|count|ct|sheets?)\b",
    re.I
)

def normalize_unit(unit):
    if not unit:
        return None
    unit = unit.lower()
    if unit in {"grams"}:
        return "g"
    if unit in {"liter", "liters", "ltr"}:
        return "l"
    if unit in {"gallons"}:
        return "gallon"
    return unit

def extract_size_pack_fields(product_name, about_this_item):
    text = normalize_match_text(combine_product_text(product_name, about_this_item))

    size_value = None
    size_unit = None
    pack_count = None
    matched_size_text = None

    m = SIZE_X_PACK_RE.search(text)
    if m:
        size_value = float(m.group("value"))
        size_unit = normalize_unit(m.group("unit"))
        pack_count = int(m.group("pack"))
        matched_size_text = m.group(0)
    else:
        m = SIZE_RE.search(text)
        if m:
            size_value = float(m.group("value"))
            size_unit = normalize_unit(m.group("unit"))
            matched_size_text = m.group(0)

        p = PACK_RE.search(text)
        if p:
            pack_count = p.group("bundle") or p.group("count")
            if pack_count is not None:
                pack_count = int(pack_count)

    normalized_volume_ml = None
    normalized_weight_g = None

    if size_value is not None and size_unit in VOLUME_TO_ML:
        normalized_volume_ml = size_value * VOLUME_TO_ML[size_unit]
    elif size_value is not None and size_unit in WEIGHT_TO_G:
        normalized_weight_g = size_value * WEIGHT_TO_G[size_unit]

    return pd.Series({
        "size_value": size_value,
        "size_unit": size_unit,
        "pack_count": pack_count,
        "normalized_volume_ml": normalized_volume_ml,
        "normalized_weight_g": normalized_weight_g,
        "size_match_text": matched_size_text
    })

# product type

PRODUCT_TYPE_RULES = {
    "Fabric Conditioner": [
        "fabric conditioner", "fabcon", "fabric softener", "softener"
    ],
    "Laundry Detergent": [
        "detergent", "liquid detergent", "powder detergent", "laundry liquid"
    ],
    "Scent Beads": [
        "beads", "fragrance beads", "scent booster", "booster beads"
    ],
    "Fabric Spray": [
        "fabric spray", "linen spray", "air freshener", "odor absorber"
    ],
    "Dryer Sheets": [
        "dryer sheets", "dryer sheet"
    ],
    "Capsules/Pods": [
        "capsule", "capsules", "pods"
    ],
    "Bleach/Stain Remover": [
        "bleach", "stain remover"
    ]
}

def infer_product_type(product_name, about_this_item):
    text = normalize_match_text(combine_product_text(product_name, about_this_item))
    scores = {}

    for product_type, keywords in PRODUCT_TYPE_RULES.items():
        score = sum(kw in text for kw in keywords)
        if score > 0:
            scores[product_type] = score

    if not scores:
        return "Unknown"

    return max(scores, key=scores.get)

# 

def extract_variant_or_scent(product_name, about_this_item):
    text_raw = combine_product_text(product_name, about_this_item)
    text = normalize_match_text(text_raw)

    patterns = [
        r"scent of ([a-z0-9 /&-]{2,40})",
        r"fragrance[: ]+([a-z0-9 /&-]{2,40})",
        r"([a-z0-9 /&-]{2,40}) scent",
        r"rose gold perfume",
        r"fresh bamboo",
        r"sweet cotton",
        r"pink/peach",
        r"sunrise fresh",
        r"garden bloom",
        r"lavender",
        r"sakura",
        r"paris",
        r"blue bliss",
        r"anti-bac"
    ]

    for pat in patterns:
        m = re.search(pat, text)
        if m:
            if m.groups():
                return m.group(1).strip().title()
            return m.group(0).strip().title()

    return None


def add_date_parts(df, source_col, prefix):
    series = pd.to_datetime(df[source_col], errors="coerce") if source_col in df.columns else pd.Series(pd.NaT, index=df.index)
    df[f"{prefix}_day"] = series.dt.day.astype("Int64")
    df[f"{prefix}_month"] = series.dt.month.astype("Int64")
    df[f"{prefix}_year"] = series.dt.year.astype("Int64")
    return series

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

BRAND_ALIASES = {
    "Yen Yen": {
        "parent_brand": None,
        "aliases": ["yen yen", "yenyen"]
    },
    "SOF": {
        "parent_brand": "Personal Collection",
        "aliases": ["sof", "sof fabric conditioner", "personal collection sof"]
    },
    "Downy": {
        "parent_brand": None,
        "aliases": ["downy"]
    },
    "Ariel": {
        "parent_brand": None,
        "aliases": ["ariel"]
    },
    "Tide": {
        "parent_brand": None,
        "aliases": ["tide"]
    },
    "Breeze": {
        "parent_brand": None,
        "aliases": ["breeze"]
    },
    "Champion": {
        "parent_brand": None,
        "aliases": ["champion"]
    },
    "Mighty Clean": {
        "parent_brand": None,
        "aliases": ["mighty clean"]
    },
    "Del": {
        "parent_brand": None,
        "aliases": ["del", "del fabric conditioner"]
    },
    "Snuggle": {
        "parent_brand": None,
        "aliases": ["snuggle"]
    },
    "Pigeon": {
        "parent_brand": None,
        "aliases": ["pigeon"]
    },
    "JN": {
        "parent_brand": None,
        "aliases": ["jn"]
    }
}

ALIAS_TO_BRAND = {}
for brand_name, meta in BRAND_ALIASES.items():
    for alias in meta["aliases"]:
        ALIAS_TO_BRAND[alias] = brand_name

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
        "internalReviewId", "reviewDate", "reviewDateISO", "revewDate", "reviewText",
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
    review_date_source = next((col for col in ["reviewDateISO", "reviewDate", "revewDate"] if col in df.columns), None)
    if review_date_source:
        df["review_date"] = add_date_parts(df, review_date_source, "review")
    else:
        df["review_date"] = pd.Series(pd.NaT, index=df.index)
        df["review_day"] = pd.Series(pd.NA, index=df.index, dtype="Int64")
        df["review_month"] = pd.Series(pd.NA, index=df.index, dtype="Int64")
        df["review_year"] = pd.Series(pd.NA, index=df.index, dtype="Int64")

    if "dateAddedToCatalog" in df.columns:
        df["dateAddedToCatalog_clean"] = add_date_parts(df, "dateAddedToCatalog", "catalog")
    else:
        df["dateAddedToCatalog_clean"] = pd.Series(pd.NaT, index=df.index)
        df["catalog_day"] = pd.Series(pd.NA, index=df.index, dtype="Int64")
        df["catalog_month"] = pd.Series(pd.NA, index=df.index, dtype="Int64")
        df["catalog_year"] = pd.Series(pd.NA, index=df.index, dtype="Int64")

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
    review_key_cols = ["internalReviewId", "reviewRating", "reviewText", "reviewDateISO", "reviewDate", "revewDate"]
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
        "productUrl", "dateAddedToCatalog_clean", "catalog_day", "catalog_month", "catalog_year",
        "internalReviewId", "review_date", "review_day", "review_month", "review_year", "reviewRating",
        "reviewText", "reviewText_clean",
        "language_flag",
        "verified_purchase_flag", "has_text", "has_image",
        "low_rating_flag", "relevance_flag",
        "issue_vector", "issue_owner"
    ]
    final_cols = [c for c in final_cols if c in df_reviews_gold.columns]
    df_master = df_reviews_gold[final_cols].copy()
    df_master_main = df_master[df_master["relevance_flag"].isin(["relevant", "borderline"])].copy()

    # =========================
    # Product enrichment layer
    # =========================
    product_cols = [
        "retailerProductCode", "productName", "aboutThisItem",
        "brand", "category", "subcategory", "productUrl"
    ]
    product_cols = [c for c in product_cols if c in df.columns]

    df_product_dim = (
        df[product_cols]
        .dropna(subset=["retailerProductCode"])
        .drop_duplicates(subset=["retailerProductCode"])
        .copy()
    )

    df_product_dim["combined_product_text"] = df_product_dim.apply(
        lambda row: combine_product_text(row.get("productName"), row.get("aboutThisItem")),
        axis=1
    )

    brand_features = df_product_dim.apply(
        lambda row: infer_brand_fields(
            row.get("productName"),
            row.get("aboutThisItem"),
            row.get("brand")
        ),
        axis=1
    )

    size_features = df_product_dim.apply(
        lambda row: extract_size_pack_fields(
            row.get("productName"),
            row.get("aboutThisItem")
        ),
        axis=1
    )

    df_product_dim["product_type"] = df_product_dim.apply(
        lambda row: infer_product_type(row.get("productName"), row.get("aboutThisItem")),
        axis=1
    )

    df_product_dim["variant_or_scent"] = df_product_dim.apply(
        lambda row: extract_variant_or_scent(row.get("productName"), row.get("aboutThisItem")),
        axis=1
    )

    df_product_dim = pd.concat([df_product_dim, brand_features, size_features], axis=1)

    product_feature_cols = [
        "retailerProductCode",
        "line_brand",
        "parent_brand",
        "brand_source",
        "brand_match_text",
        "product_type",
        "variant_or_scent",
        "size_value",
        "size_unit",
        "pack_count",
        "normalized_volume_ml",
        "normalized_weight_g",
        "size_match_text"
    ]

    df_master = df_master.merge(
        df_product_dim[product_feature_cols],
        on="retailerProductCode",
        how="left"
    )

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
    df_product_dim.to_csv(PROCESSED_DIR / "dim_product_enriched.csv", index=False)

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
        df_product_dim.to_excel(writer, sheet_name="dim_product_enriched", index=False)
        
    print("\nDone. Files written to:")
    print(PROCESSED_DIR)

if __name__ == "__main__":
    main()