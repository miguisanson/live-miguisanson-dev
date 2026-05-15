import streamlit as st
import pandas as pd
import plotly.express as px
import os

# 1. Page Configuration
st.set_page_config(
    page_title="P&G Agentic Insights",
    page_icon="",
    layout="wide"
)

st.title("P&G Fabric Care: AI Consumer Insights")
st.markdown("This dashboard translates raw, Taglish e-commerce feedback into **Agentic AI Insights** mapped directly to P&G's 5 Vectors of Superiority, including **Competitor Churn Detection**.")

# 2. The Ironclad Data Loader (Updated with Churn Metrics)
def load_data_safely():
    # file_name = 'MVP_AI_Insights.csv'
    file_name = 'with_negative_sentiment.json'

    
    if os.path.exists(file_name):
        try:
            # temp_df = pd.read_csv(file_name)
            temp_df = pd.read_json(file_name, orient='records')  # Updated to read JSON format
            if not temp_df.empty and 'brand' in temp_df.columns and 'Churn_Risk' in temp_df.columns:
                return temp_df
        except Exception:
            pass 

    # THE FALLBACK: Updated to include Churn_Risk and Competitor_Mentioned
    st.warning("**Note:** Displaying prototype data with simulated Churn Intent Detection.")
    
    mock_data = {
        'brand': ['Personal Collection', 'PREMIER WASH', 'No Brand', 'No Brand', 'Tide (Mock)', 'Tide (Mock)'],
        'productName': ['SOF FABRIC CONDITIONER', 'LIQUID DETERGENT KIT', 'Fabric Conditioner Repacked', 'PREMIUM FABCON DIY KIT', 'Tide Liquid', 'Tide Powder'],
        'reviewText': [
            'legit xia mabangon', 
            'Great value for money!', 
            '2 liters nabili ko lang sa halagang 111 pesos.', 
            'TUBIG NA PO YUNG FABCON. HINDI NA THICK.', 
            'Basag yung takip pag dating.',
            'Pangit na ng amoy ng Tide ngayon, lipat na ako sa Surf.' # <-- The Churn trigger!
        ],
        'Sentiment': ['Positive', 'Positive', 'Positive', 'Negative', 'Negative', 'Negative'],
        'Vector': ['Retail Execution', 'Value', 'Value', 'Product Formulation', 'Packaging', 'Product Formulation'],
        'Summary': ['Legitimate, smells good', 'Excellent value', 'Value, performance', 'Fabcon lost thickness', 'Broken cap, leaking', 'Bad smell, switching brands'],
        'Action_Required': [False, False, False, True, True, True],
        'Churn_Risk': [False, False, False, True, False, True],
        'Competitor_Mentioned': ['None', 'None', 'None', 'None', 'None', 'Surf']
    }
    return pd.DataFrame(mock_data)

df = load_data_safely()

# 3. Sidebar Controls
st.sidebar.image("https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Procter_%26_Gamble_logo.svg/800px-Procter_%26_Gamble_logo.svg.png", width=150)
st.sidebar.header("Filter Data")

selected_brands = st.sidebar.multiselect(
    "Select Brand(s)", 
    options=df['brand'].unique(), 
    default=df['brand'].unique()
)

selected_sentiments = st.sidebar.multiselect(
    "Select Sentiment(s)", 
    options=df['Sentiment'].unique(), 
    default=df['Sentiment'].unique()
)

filtered_df = df[
    (df['brand'].isin(selected_brands)) & 
    (df['Sentiment'].isin(selected_sentiments))
]

# 4. KPI Metrics Row (Now with 5 columns!)
st.markdown("High-Level Metrics")
col1, col2, col3, col4, col5 = st.columns(5)
col1.metric("Total Reviews Analyzed", len(filtered_df))
col2.metric("Positive Sentiment", len(filtered_df[filtered_df['Sentiment'] == 'Positive']))
col3.metric("Negative Sentiment", len(filtered_df[filtered_df['Sentiment'] == 'Negative']))

action_alerts = len(filtered_df[filtered_df['Action_Required'] == True])
col4.metric("Defect Alerts", action_alerts)

churn_alerts = len(filtered_df[filtered_df['Churn_Risk'] == True])
col5.metric("Churn Risks Detected", churn_alerts)

st.divider()

# 5. Data Visualizations
st.markdown("Sentiment & Vector Distribution")
col_viz1, col_viz2 = st.columns(2)

with col_viz1:
    fig_sentiment = px.pie(
        filtered_df, 
        names='Sentiment', 
        hole=0.4,
        color='Sentiment',
        color_discrete_map={'Positive': '#2ca02c', 'Negative': '#d62728', 'Neutral': '#7f7f7f'},
        title="Overall Sentiment Breakdown"
    )
    st.plotly_chart(fig_sentiment, width='stretch')

with col_viz2:
    vector_counts = filtered_df['Vector'].value_counts().reset_index()
    vector_counts.columns = ['Vector', 'Count']
    fig_vector = px.bar(
        vector_counts, 
        x='Vector', 
        y='Count', 
        text='Count',
        color='Vector',
        title="Issues by Vector of Superiority"
    )
    fig_vector.update_traces(textposition='outside', marker_color='#1f77b4')
    st.plotly_chart(fig_vector, width='stretch')

st.divider()

# 6. Agentic Action Alerts (Now Highlights Competitor Mentions!)
st.markdown("High-Priority Escalations (Defects & Churn)")
alerts_df = filtered_df[(filtered_df['Action_Required'] == True) | (filtered_df['Churn_Risk'] == True)]

if len(alerts_df) > 0:
    st.error(f"AI has flagged **{len(alerts_df)}** review(s) requiring immediate intervention.")
    
    # We display the new Churn_Risk and Competitor_Mentioned columns here
    display_cols = ['brand', 'Vector', 'Summary', 'Churn_Risk', 'Competitor_Mentioned', 'reviewText']
    st.dataframe(
        alerts_df[display_cols], 
        width='stretch',
        hide_index=True
    )
else:
    st.success("No critical escalations flagged at this time! 🎉")

st.divider()

# 7. Raw Data Explorer
with st.expander("View All AI-Enriched Data"):
    st.dataframe(filtered_df, width='stretch', hide_index=True)