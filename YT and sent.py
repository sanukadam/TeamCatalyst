
import pandas as pd
import nltk
nltk.download('vader_lexicon')
from moviepy.editor import VideoFileClip, concatenate_videoclips
from nltk.sentiment import SentimentIntensityAnalyzer

# Load the dataset
df = pd.read_csv('movies_youtube_sentiments.csv')

# Initialize the Sentiment Intensity Analyzer
sia = SentimentIntensityAnalyzer()

# Function to categorize sentiment
def categorize_sentiment(score):
    if score >= 0.5:
        return 'Positive'
    elif score <= -0.5:
        return 'Negative'
    else:
        return 'Neutral'

# Example function to analyze sentiment (if needed)
def analyze_sentiment(text):
    score = sia.polarity_scores(text)['compound']
    return score

# Assuming there's a 'description' column for sentiment analysis
df['sentiment_scores'] = df['description'].apply(analyze_sentiment)
df['sentiment_category'] = df['sentiment_score'].apply(categorize_sentiment)

# Function to segment trailers
def segment_trailer(trailer_link, start_time, end_time, output_file):
    try:
        clip = VideoFileClip(trailer_link).subclip(start_time, end_time)
        clip.write_videofile(output_file)
    except Exception as e:
        print(f"Error processing {trailer_link}: {e}")

# Define start and end times for segments (adjust as needed)
segment_duration = 10  # seconds
for index, row in df.iterrows():
    # Example: Let's assume we want to create segments of the first 10 seconds for each trailer
    start_time = 0  # you can modify this to dynamic times based on your logic
    end_time = segment_duration
    
    if row['sentiment_category'] == 'Positive':
        segment_trailer(row['trailer_link'], start_time, end_time, f"positive_segment_{index}.mp4")
    elif row['sentiment_category'] == 'Negative':
        segment_trailer(row['trailer_link'], start_time, end_time, f"negative_segment_{index}.mp4")

# Compile segments into new trailers
positive_clips = [VideoFileClip(f"positive_segment_{i}.mp4") for i in range(len(df)) if df.loc[i, 'sentiment_category'] == 'Positive']
negative_clips = [VideoFileClip(f"negative_segment_{i}.mp4") for i in range(len(df)) if df.loc[i, 'sentiment_category'] == 'Negative']

if positive_clips:
    final_positive_trailer = concatenate_videoclips(positive_clips)
    final_positive_trailer.write_videofile("final_positive_trailer.mp4")

if negative_clips:
    final_negative_trailer = concatenate_videoclips(negative_clips)
    final_negative_trailer.write_videofile("final_negative_trailer.mp4")

print("Trailer segmentation and compilation completed.")

