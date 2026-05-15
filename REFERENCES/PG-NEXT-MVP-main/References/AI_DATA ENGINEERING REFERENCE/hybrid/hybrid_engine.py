import os
import re
import time
import json
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from google import genai

load_dotenv()
API_KEY = os.getenv("API_KEY")
MODEL_ID = os.getenv("MODEL_ID")

if not API_KEY or not MODEL_ID:
    raise ValueError("API_KEY and MODEL_ID must be set in the .env file")

client = genai.Client(api_key=API_KEY)


# !!! START OF LAYER 1: Lexicon & NLP Rules Engine !!!
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

STOP_WORDS = {"ang", "ng", "sa", "yung", "the", "is", "to", "a", "and", "na", "ako", "pa", "naman", "ba", "po", "siya", "kaso", "talaga"}

SENTIMENT_LEXICON = {
    "great": 0.6, "good": 0.5, "excellent": 0.8, "love": 0.7, 
    "legit": 0.6, "sulit": 0.7, "maganda": 0.6, "bango": 0.5, "okay": 0.2,
    "bad": -0.6, "terrible": -0.8, "damaged": -0.7, "leaking": -0.7, 
    "fake": -0.8, "tubig": -0.7, "mahal": -0.4, "pangit": -0.8, "sira": -0.8
}

INTENSIFIERS = {"very", "sobra", "grabe", "super", "really"}
NEGATORS = {"not", "hindi", "wala", "never", "no", "di"}

VECTOR_KEYWORDS = {
    "Product Formulation": ["performance", "formula", "scent", "amoy", "tubig", "bango"],
    "Packaging": ["packaging", "damaged", "leaking", "seal", "bukas", "basag", "takip"],
    "Retail Execution": ["delivery", "courier", "late", "shipping"]
}

def score_text_with_confidence(text: str):
    """Calculates sentiment using Lexicon and returns a Confidence Score (Token Hit Rate)."""
    # Clean text: remove punctuation, lowercase
    clean_text = re.sub(r"[^\w\s]", "", text.lower())
    tokens = clean_text.split()
    
    # Remove Stop Words to find the "Meaningful Words"
    meaningful_words = [t for t in tokens if t not in STOP_WORDS]
    
    if not meaningful_words:
        return {"score": 0.0, "confidence": 1.0, "hits": 0, "total_meaningful": 0}
    
    total_score = 0.0
    lexicon_hits = 0
    negation_window = 0
    prev_intensifier = False
    
    for token in meaningful_words:
        if token in NEGATORS:
            negation_window = 3  # Negate the next 3 tokens
            continue
        if token in INTENSIFIERS:
            prev_intensifier = True
            lexicon_hits += 1
            continue
        
        weight = SENTIMENT_LEXICON.get(token, 0.0)
        
        # If the word is in the lexicon, count it as a hit
        if weight != 0.0:
            lexicon_hits += 1
            if prev_intensifier: weight *= 1.5
            if negation_window > 0:
                weight *= -1
                negation_window -= 1
            total_score += weight
        
        prev_intensifier = False
        if negation_window > 0: negation_window -= 1
        
     # Calculate confidence as the ratio of lexicon hits to total meaningful words
    confidence = lexicon_hits / len(meaningful_words)
    final_sentiment = float(np.tanh(total_score))  # Normalize to [-1, 1]
    
    return {
        "score": final_sentiment,
        "confidence": confidence,
        "hits": lexicon_hits,
        "total_meaningful": len(meaningful_words)
    }
    

def get_lexicon_vectors(text: str):
    text_lower = text.lower()
    matched = [v for v, kws in VECTOR_KEYWORDS.items() if any(kw in text_lower for kw in kws)]
    return matched[0] if matched else "Other"

# !!! END OF LAYER 1: Lexicon & NLP Rules Engine !!!
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!




# !!! START OF LAYER 2: Gemini LLM !!!
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

def extract_insights_llm(review_text):
    """
    Uses the GenAI client to extract insights from a review.
    Called only when Layer 1 confidence is low, to save on API costs.
    """
    
    prompt = f"""
    You are an expert Data Analyst for P&G Fabric Care in the Philippines.
    Analyze the following Taglish e-commerce review: "{review_text}"
    
    Extract the following information and return ONLY a valid JSON object. Do not include markdown tags like ```json.
    
    Keys to extract:
    - "Sentiment": (Strictly choose one: Positive, Negative, Neutral)
    - "Vector": (Strictly choose from P&G's 5 Vectors: Product, Packaging, Communication, Retail Execution, Value)
    - "Summary": (A brief 3 to 5 word English summary, and be consistent in the format or wordings across all reviews)
    - "Action_Required": (True or False)
    - "Churn_Risk": (True or False - True ONLY if the user says they will stop buying or switch brands)
    - "Competitor_Mentioned": (Extract the competitor brand name if they say they are switching, otherwise write "None")
    """
    
    try:
        response = client.models.generate_content(model=MODEL_ID, contents=prompt)
        cleaned = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned)
    except Exception as e:
        return {"Sentiment": "Error", "Vector": "Error", "Summary": "LLM Failed", "Action_Required": False, "Churn_Risk": False, "Competitor_Mentioned": "None"}
    
    
# !!! END OF LAYER 2: Gemini LLM !!!
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


# !!! START OF LAYER 3: Hybrid Engine Logic !!!
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

def process_review(review_text):
    """Decides whether to use Free Lexicon or LLM"""
    
    # Run Layer 1: Lexicon Analysis
    lex_result = score_text_with_confidence(review_text)
    
    # Rule: If sentence is short (< 3 meaningful words), assume confidence is fine.
    # Otherwise, if Confidence is below 30%, ESCALATE TO LLM.
    MIN_CONFIDENCE = 0.50
    
    if len(lex_result["total_meaningful"]) >= 3 or lex_result["confidence"] < MIN_CONFIDENCE:
       print(f"  [ROUTING] Low Confidence ({lex_result['confidence']:.0%}). Escalating to LLM...")
       llm_data = extract_insights_llm(review_text)
       llm_data["Processed_By"] = "Layer 2: LLM"
       return llm_data
   
    else:
        print(f"  [ROUTING] High Confidence ({lex_result['confidence']:.0%}). Processed locally.")
        # Translate the math score into business logic
        if lex_result["score"] > 0.15: sentiment = "Positive"
        elif lex_result["score"] < -0.15: sentiment = "Negative"
        else: sentiment = "Neutral"
        
        return {
            "Sentiment": sentiment,
            "Vector": get_lexicon_vectors(review_text),
            "Summary": "Handled by NLP",
            "Action_Required": False, # Lexicon is too rigid to safely trigger executive alerts
            "Churn_Risk": False,
            "Competitor_Mentioned": "None",
            "Processed_By": "Layer 1: Lexicon NLP"
        }
        
# !!! END OF LAYER 3: Hybrid Engine Logic !!!
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!





# DEMO SCRIPT

if __name__ == "__main__":
    test_reviews = [
        # Scenario 1: Known slang and words (Should be handled by Layer 1)
        "Super sulit na budol! Ang bango sa damit, legit.",
        
        # Scenario 2: The Masking Effect! Uses "Okay" but is filled with unknown slang (Should go to Layer 2)
        "Okay naman yung unang gamit, kaso umay na ako sa packaging, very latak vibes talaga pag tumagal. Lipat na ako sa Surf."
    ]
    
    print("=== Initiating P&G Hybrid AI Pipeline... ===\n")
    
    results = []
    for i, review in enumerate(test_reviews):
        print(f"Processing Review #{i+1}: {review}")
        result = process_review(review)
        print(f"  -> Result: {result['Sentiment']} | Vector: {result['Vector']}")
        if result.get('Churn_Risk'):
            print(f"  -> CHURN RISK DETECTED! Swapping to: {result.get('Competitor_Mentioned')}")
        results.append(result)