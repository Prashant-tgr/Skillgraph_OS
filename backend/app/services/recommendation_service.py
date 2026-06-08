from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

class RecommendationService:
    def __init__(self):
        # Stop words filter out common English words (the, is, at, which, and)
        self.vectorizer = TfidfVectorizer(stop_words='english')

    def suggest_courses(self, topic_title: str, course_data_list: list):
        """
        Uses TF-IDF and Cosine Similarity to find courses matching the topic title.
        course_data_list should be a list of dicts with 'title', 'description', 'url'.
        """
        if not course_data_list:
            return []

        df = pd.DataFrame(course_data_list)
        
        # Combine title and description for a richer document vector
        df['combined_text'] = df['title'] + " " + df['description']
        
        # Fit and transform the course texts
        tfidf_matrix = self.vectorizer.fit_transform(df['combined_text'])
        
        # Transform the target topic title
        topic_vector = self.vectorizer.transform([topic_title])
        
        # Calculate cosine similarity
        cosine_sim = cosine_similarity(topic_vector, tfidf_matrix)
        
        # Extract scores and add to dataframe
        df['score'] = cosine_sim[0]
        
        # Sort by highest score and take top 3
        top_courses = df.sort_values(by='score', ascending=False).head(3)
        
        # Return as a clean list of dictionaries
        return top_courses[['title', 'description', 'url', 'score']].to_dict('records')