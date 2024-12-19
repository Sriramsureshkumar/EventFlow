from flask import Flask, request, jsonify
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from scipy.sparse import csr_matrix

app = Flask(__name__)

# Generate User-Event Matrix
def generate_user_event_matrix(users, events):
    num_users = len(users)
    num_events = len(events)
    user_event_matrix = np.zeros((num_users, num_events))

    event_to_index = {event['name']: idx for idx, event in enumerate(events)}

    for user_idx, user in enumerate(users):
        for event in user['registeredEvents']:
            event_name = event['name'] if isinstance(event, dict) else event
            event_idx = event_to_index.get(event_name)
            if event_idx is not None:
                user_event_matrix[user_idx, event_idx] = 1

    return csr_matrix(user_event_matrix)

# Weighted Content-Based Filtering (CBF)
def content_based_filtering(user_prefs, events):
    combined_data = [
        f"{event['description']} {event['category']} {event['venue']}" for event in events
    ]

    user_profile = (
        f"{' '.join(user_prefs['categories']) * 2} "  
        f"{' '.join(user_prefs['locations'])} "
        f"{' '.join(user_prefs['interests'])}"
    )

    tfidf = TfidfVectorizer()
    event_matrix = tfidf.fit_transform(combined_data)
    user_vector = tfidf.transform([user_profile])

    similarities = cosine_similarity(user_vector, event_matrix).flatten()

    # Normalizing event similarity scores
    ranked_events = sorted(enumerate(similarities), key=lambda x: x[1], reverse=True)
    return [events[idx]['name'] for idx, sim in ranked_events if sim > 0.1]  # Filter out irrelevant matches

# Collaborative Filtering (CF) using SVD
def collaborative_filtering(user_event_matrix, user_index):
    if user_event_matrix[user_index].sum() == 0:
        return []

    svd = TruncatedSVD(n_components=min(50, user_event_matrix.shape[1]))
    decomposed_matrix = svd.fit_transform(user_event_matrix)

    user_vector = decomposed_matrix[user_index].reshape(1, -1)
    similarities = cosine_similarity(user_vector, decomposed_matrix).flatten()
    similar_users = np.argsort(similarities)[::-1]

    recommended_events = set()
    for similar_user in similar_users:
        if similar_user == user_index or similarities[similar_user] < 0.1:  # Ignore dissimilar users
            continue
        events_attended = user_event_matrix[similar_user].nonzero()[1]
        recommended_events.update(events_attended)

    return list(recommended_events)

# Hybrid Recommendation with weighted approach
def hybrid_recommendation(user_prefs, events, user_event_matrix, user_index, registered_events):
    cb_recommendations = content_based_filtering(user_prefs, events)
    cf_indices = collaborative_filtering(user_event_matrix, user_index)
    cf_recommendations = [events[idx]['name'] for idx in cf_indices]

    final_recommendations = list(set(cf_recommendations[:5]) | set(cb_recommendations[:5]))  # Prioritize top results

    # Remove already registered events from the recommendations
    final_recommendations = [event for event in final_recommendations if event not in registered_events]

    return final_recommendations

# Evaluate Recommendations Without Ground Truth
def evaluate_recommendations(users, recommendations, events):
    total_recommended = 0
    unique_recommended_events = set()
    novelty_scores = []
    diversity_scores = []

    # Pre-compute event categories and locations for diversity
    event_data = {event['name']: (event['category'], event['venue']) for event in events}

    for user in users:
        user_id = user['user_id']
        registered_events = set(
            event['name'] if isinstance(event, dict) else event 
            for event in user.get("registeredEvents", [])
        )
        recommended_events = set(recommendations.get(user_id, []))

        total_recommended += len(recommended_events)
        unique_recommended_events.update(recommended_events)

        # Novelty: Events not in the user's registered events
        if recommended_events:
            new_recommendations = recommended_events - registered_events
            novelty_scores.append(len(new_recommendations) / len(recommended_events))

        # Diversity: Unique (category, venue) pairs in recommendations
        recommended_data = [event_data[event] for event in recommended_events if event in event_data]
        unique_recommendation_attributes = len(set(recommended_data))
        diversity_scores.append(unique_recommendation_attributes / len(recommended_data) if recommended_data else 0)

    # Calculate Coverage
    coverage = len(unique_recommended_events) / len(events) if events else 0

    # Aggregate Novelty and Diversity
    avg_novelty = sum(novelty_scores) / len(novelty_scores) if novelty_scores else 0
    avg_diversity = sum(diversity_scores) / len(diversity_scores) if diversity_scores else 0

    return {
        "avg_novelty": avg_novelty,
        "avg_diversity": avg_diversity,
        "coverage": coverage,
    }

# API to generate recommendations
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()

    users = data.get('users', [])
    events = data.get('events', [])

    if not users or not events:
        return jsonify({"error": "Invalid data received"}), 400

    user_event_matrix = generate_user_event_matrix(users, events)

    recommendations = {}
    for user in users:
        user_id = user['user_id']
        user_index = users.index(user)  # Get the index of the user in the list
        user_prefs = user['preferences']
        registered_events = user.get("registeredEvents", [])

        recs = hybrid_recommendation(user_prefs, events, user_event_matrix, user_index, registered_events)
        recommendations[user_id] = recs

    evaluation_metrics = evaluate_recommendations(users, recommendations, events)
    print("Evaluation Metrics:", evaluation_metrics)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(port=5001)
