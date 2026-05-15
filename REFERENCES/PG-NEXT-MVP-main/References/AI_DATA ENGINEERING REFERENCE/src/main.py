import os
import time
import json
import pandas as pd
from dotenv import load_dotenv
from google import genai
from sqlalchemy import create_engine

# Load environment variables from .env file
load_dotenv()
API_KEY = os.getenv("API_KEY")
MODEL_ID = os.getenv("MODEL_ID")

if not API_KEY or not MODEL_ID:
    raise ValueError("API_KEY and MODEL_ID must be set in the .env file")

# Initialize the GenAI client
client = genai.Client(api_key=API_KEY)

print("Connecting to SQLite database...")
DB_PATH = "reviews.db"
engine = create_engine(f'sqlite:///{DB_PATH}')
print("Connected!")


try:
    # Load reviews from the database
    print("\nLoading reviews from the database...")
    df = pd.read_sql("SELECT * FROM reviews", con=engine)
    
    df_clean = df.dropna(subset=['reviewText']).head(5).copy()  # Drop rows where reviewText is NaN
    print(f"Successfully loaded {len(df_clean)} reviews for processing.")
    
except Exception as e:
    print(f"Error loading reviews from the database: {e}")
    df_clean = pd.DataFrame()  # Create an empty DataFrame to avoid further errors
    exit()
    

# Payload management
def manage_payload(review_text, max_words=50):
    """
    Truncates text to a maximum number of words to save LLM token costs.
    50 words is roughly 60-75 LLM tokens
    """
    # Convert to string to avoid errors if the data is weirdly formatted
    text_str = str(review_text) 
    words = text_str.split()
    
    # If longer than limit, slice the list and stitch it back 
    if len(words) > max_words:
        truncated_text = " ".join(words[:max_words]) + "..."
        return truncated_text
    
    return text_str
    
    
# Engine
def extract_insights(review_text):
    """
    Uses the GenAI client to extract insights from a review.
    """
    # Apply payload management
    safe_text = manage_payload(review_text) 
    
    prompt = f"""
    You are an expert Data Analyst for P&G Fabric Care in the Philippines.
    Analyze the following Taglish e-commerce review: "{safe_text}"
    
    Extract the following information and return ONLY a valid JSON object.
    
    Keys to extract:
    - "Sentiment": (Strictly choose one: Positive, Negative, Neutral)
    - "Vector": (Strictly choose from P&G's 5 Vectors: Product Formulation, Packaging, Communication, Retail Execution, Value)
    - "Summary": (A brief 3 to 5 word English summary)
    - "Action_Required": (True or False - True ONLY if it's a defect, leak, or fake)
    - "Churn_Risk": (True or False - True ONLY if they explicitly state they will switch brands)
    - "Competitor_Mentioned": (Extract competitor name if switching, otherwise write "None")
    """
    
    try:
        response = client.model.generate_content(
            model=MODEL_ID,
            input=prompt
            )
        
        # Extract the JSON from the response
        cleaned_response = response.text.replace('```json', '').replace('```', '').strip()
        insights = json.loads(cleaned_response)
        return insights
    
    except Exception as e:
        print(f"Error in extract_insights: {e}")
        return {
            "Sentiment": "Error",
            "Vector": "Error",
            "Summary": "Error",
            "Action_Required": False,
            "Churn_Risk": False,
            "Competitor_Mentioned": "Error"}
        
print("\nExtracting insights from reviews...")
extracted_data = []

for index, row in df_clean.iterrows():
    print(f"\nProcessing review {index + 1}/{len(df_clean)}...")
    insights = extract_insights(row['reviewText'])
    extracted_data.append({insights})
    time.sleep(2)  # Sleep to avoid hitting rate limits
    
print("\nMerging Agentic insights with original data...")
# Merge insights back into the original DataFrame
insights_df = pd.DataFrame(extracted_data, index=df_clean.index)
final_df = pd.concat([df_clean, insights_df], axis=1)


# Writing back to sqlite (output)
print("\nWriting back to SQLite...")
try:
    final_df.to_sql('reviews_with_insights', con=engine, if_exists='replace', index=False)
    print("Successfully wrote insights back to the database!")
except Exception as e:
    print(f"Error writing back to the database: {e}")
    exit()
    
print("\nProcess completed successfully!")


print()